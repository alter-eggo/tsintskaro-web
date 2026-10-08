import "server-only";

import { Pool } from "pg";

import type { DictionaryEntry } from "@/lib/data/dictionary";

type WordRow = {
  word: string;
  translation: string;
  partOfSpeech: string | null;
  comments: string | null;
  senses?: DictionaryEntry["senses"] | null;
  kind?: DictionaryEntry["kind"];
  literalTranslation?: string | null;
  aliases?: string[] | null;
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
    `SELECT w.word, w.translation, w."partOfSpeech", w.comments,
       to_jsonb(w)->'senses' AS senses, to_jsonb(w)->>'kind' AS kind,
       to_jsonb(w)->>'literalTranslation' AS "literalTranslation",
       linked.aliases
     FROM word w
     LEFT JOIN (
       SELECT (to_jsonb(old)->>'relatedWordId')::int AS target_id, jsonb_agg(old.word) AS aliases
       FROM word old WHERE to_jsonb(old)->>'status' IN ('embedded', 'merged')
       GROUP BY (to_jsonb(old)->>'relatedWordId')::int
     ) linked ON linked.target_id = w.id
     WHERE COALESCE(to_jsonb(w)->>'status', 'active') = 'active'`,
  );

  return result.rows.map((row) => ({
    word: row.word,
    translation: row.translation,
    partOfSpeech: optionalText(row.partOfSpeech),
    comments: optionalText(row.comments),
    ...(row.senses?.length ? { senses: row.senses } : {}),
    ...(row.kind ? { kind: row.kind } : {}),
    ...(row.literalTranslation
      ? { literalTranslation: row.literalTranslation }
      : {}),
    ...(row.aliases?.length ? { aliases: row.aliases } : {}),
  }));
}

export async function addWord(
  input: AddWordInput,
): Promise<{ created: boolean }> {
  const { word, translation, partOfSpeech } = validateAndNormalizeInput(input);

  const result = await getPool().query<{ created: boolean }>(
    `INSERT INTO word AS existing (word, translation, "partOfSpeech", source, "addedBy", "createdAt", "updatedAt")
     VALUES ($1, $2, $3, 'website', 'website', NOW(), NOW())
     ON CONFLICT (word) DO UPDATE
     SET translation = EXCLUDED.translation,
         "partOfSpeech" = EXCLUDED."partOfSpeech",
         "updatedAt" = NOW()
     WHERE COALESCE(to_jsonb(existing)->>'status', 'active') = 'active'
       AND (to_jsonb(existing)->'senses' IS NULL OR to_jsonb(existing)->'senses' IN ('null'::jsonb, '[]'::jsonb))
     RETURNING ("xmax" = 0) AS created`,
    [word, translation, partOfSpeech],
  );

  if (!result.rows.length)
    throw new Error(
      "У этой записи есть значения и примеры либо она перенесена или отложена. Измените её через бота, указав нужное значение или пример.",
    );
  return { created: result.rows[0].created };
}
