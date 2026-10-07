import "server-only";

import { Pool } from "pg";

import type { DictionaryEntry } from "@/lib/data/dictionary";

type WordRow = {
  word: string;
  translation: string;
  partOfSpeech: string | null;
  comments: string | null;
};

type AddWordInput = {
  word: string;
  translation: string;
  partOfSpeech?: string | null;
};

const globalForPg = globalThis as typeof globalThis & {
  tsintskaroWordsPool?: Pool;
};

function getSslConfig(connectionString: string) {
  let sslMode: string | null = null;

  try {
    sslMode = new URL(connectionString).searchParams.get("sslmode");
  } catch {
    sslMode = null;
  }

  if (!sslMode || sslMode === "disable") {
    return undefined;
  }

  if (process.env.DB_CERT) {
    return { ca: process.env.DB_CERT };
  }

  return { rejectUnauthorized: false };
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!globalForPg.tsintskaroWordsPool) {
    globalForPg.tsintskaroWordsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: getSslConfig(process.env.DATABASE_URL),
    });
  }

  return globalForPg.tsintskaroWordsPool;
}

function optionalText(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function validateAndNormalizeInput(input: AddWordInput) {
  const word = input.word.normalize("NFC").trim().toLowerCase();
  const translation = input.translation.trim();
  const partOfSpeech = input.partOfSpeech?.trim() || null;

  if (!word) {
    throw new Error("Укажите слово");
  }

  if (!translation) {
    throw new Error("Укажите перевод");
  }

  if (word.length > 255) {
    throw new Error("Слово не должно быть длиннее 255 символов");
  }

  if (partOfSpeech && partOfSpeech.length > 64) {
    throw new Error("Часть речи не должна быть длиннее 64 символов");
  }

  return { word, translation, partOfSpeech };
}

export async function getAllWords(): Promise<DictionaryEntry[]> {
  const result = await getPool().query<WordRow>(
    'SELECT word, translation, "partOfSpeech", comments FROM word'
  );

  return result.rows.map((row) => ({
    word: row.word,
    translation: row.translation,
    partOfSpeech: optionalText(row.partOfSpeech),
    comments: optionalText(row.comments),
  }));
}

export async function addWord(
  input: AddWordInput
): Promise<{ created: boolean }> {
  const { word, translation, partOfSpeech } = validateAndNormalizeInput(input);

  const result = await getPool().query<{ created: boolean }>(
    `INSERT INTO word (word, translation, "partOfSpeech", source, "addedBy", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, 'website', 'website', NOW(), NOW())
     ON CONFLICT (word) DO UPDATE
     SET translation = EXCLUDED.translation,
         "partOfSpeech" = EXCLUDED."partOfSpeech",
         "updatedAt" = NOW()
     RETURNING ("xmax" = 0) AS created`,
    [word, translation, partOfSpeech]
  );

  return { created: result.rows[0]?.created ?? false };
}
