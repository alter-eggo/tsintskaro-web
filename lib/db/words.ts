import "server-only";

import { Pool } from "pg";

import type { DictionaryEntry } from "@/lib/data/dictionary";

type WordRow = {
  word: string;
  translation: string;
  partOfSpeech: string | null;
  comments: string | null;
  isReviewed: boolean;
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
       linked.aliases,
       (COALESCE(review.status = 'confirmed', false) OR (
         review.status IS DISTINCT FROM 'disputed' AND (
           edited."wordId" IS NOT NULL OR (
             review."wordId" IS NOT NULL AND
             (w.word, w.translation, w."partOfSpeech") IS DISTINCT FROM
             (review."originalWord", review."originalTranslation", review."partOfSpeech")
           )
         )
       )) AS "isReviewed"
     FROM word w
     LEFT JOIN (
       SELECT DISTINCT ON (i."wordId") i."wordId", i.status,
         i."originalWord", i."originalTranslation", i."partOfSpeech"
       FROM word_review_item i
       JOIN word_review_batch b ON b.id = i."batchId"
       WHERE b."reviewFlow" = 'dictionary' AND b.status IN ('published', 'completed')
       ORDER BY i."wordId", b."createdAt" DESC, b.id DESC, i.id DESC
     ) review ON review."wordId" = w.id
     LEFT JOIN (
       SELECT "wordId" FROM word_translation_history
       WHERE "previousTranslation" IS DISTINCT FROM translation
       UNION
       SELECT (changed->>'id')::int AS "wordId"
       FROM word_edit_history h
       CROSS JOIN LATERAL jsonb_array_elements(h."after") changed
       JOIN LATERAL jsonb_array_elements(h."before") previous
         ON previous->>'id' = changed->>'id'
       WHERE jsonb_build_array(
         changed->'word', changed->'translation', changed->'partOfSpeech',
         changed->'comments', changed->'senses', changed->'kind', changed->'literalTranslation'
       ) IS DISTINCT FROM jsonb_build_array(
         previous->'word', previous->'translation', previous->'partOfSpeech',
         previous->'comments', previous->'senses', previous->'kind', previous->'literalTranslation'
       )
     ) edited ON edited."wordId" = w.id
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
    isReviewed: row.isReviewed,
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
