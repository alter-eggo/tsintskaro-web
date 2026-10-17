import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import pg from "pg";
import ts from "typescript";

// Run the real query and mapper against read-only CTE fixtures. No stored data
// is read or changed; PostgreSQL is used to exercise the actual SQL semantics.
const source = readFileSync(new URL("../lib/db/words.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
if (!process.env.DATABASE_URL) {
  throw new Error("Set DATABASE_URL to run the read-only dictionary review checks.");
}
const sslMode = new URL(process.env.DATABASE_URL).searchParams.get("sslmode");
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslMode && sslMode !== "disable"
    ? process.env.DB_CERT ? { ca: process.env.DB_CERT } : { rejectUnauthorized: false }
    : undefined,
  connectionTimeoutMillis: 10000,
});
const words = Array.from({ length: 21 }, (_, index) => ({
  id: index + 1,
  word: index === 1 ? "абажур" : `слово${index + 1}`,
  translation: "новый перевод",
  partOfSpeech: null,
  comments: null,
  status: index === 12 ? "embedded" : "active",
  source: "chat",
  updatedAt: "2026-10-17T00:00:00Z",
}));
const batches = [
  { id: 1, status: "published", reviewFlow: "dictionary", createdAt: "2026-09-01" },
  { id: 2, status: "published", reviewFlow: "dictionary", createdAt: "2026-09-02" },
  { id: 3, status: "completed", reviewFlow: "learning", createdAt: "2026-09-03" },
  { id: 4, status: "sending", reviewFlow: "dictionary", createdAt: "2026-09-04" },
];
const item = (wordId, status = "discussion", batchId = 1, extra = {}) => ({
  id: wordId,
  wordId,
  batchId,
  status,
  originalWord: words[wordId - 1].word,
  originalTranslation: words[wordId - 1].translation,
  partOfSpeech: words[wordId - 1].partOfSpeech,
  ...extra,
});
const items = [
  item(1, "confirmed"), item(2), item(3),
  item(4, "discussion", 1, { originalTranslation: "старый перевод" }),
  item(5), item(6), item(7, "disputed"),
  item(9, "confirmed", 3), item(10, "confirmed", 4),
  item(11, "confirmed"), item(11, "disputed", 2, { id: 111 }),
  item(12), item(13), item(14), item(15), item(16), item(17),
  item(18, "disputed"), item(18, "confirmed", 2, { id: 118 }),
  item(20, "discussion", 1, { partOfSpeech: "существительное" }),
  item(21, "discussion", 1, { originalWord: "старое написание" }),
];
const translations = [2, 7, 13, 15, 15].map((wordId) => ({
  wordId, previousTranslation: "старый перевод", translation: "новый перевод",
}));
translations.push({ wordId: 19, previousTranslation: "тот же перевод", translation: "тот же перевод" });
const edit = (id, before, after) => ({ before: [{ ...words[id - 1], ...before }], after: [{ ...words[id - 1], ...after }] });
const edits = [
  edit(3, { senses: null }, { senses: [{ translation: "новый перевод", examples: [] }] }),
  { before: [], after: [words[5]] }, // A newly added word has not been reviewed.
  edit(8, { translation: "старый перевод" }, {}),
  edit(14, { updatedAt: "2026-09-01T00:00:00Z" }, {}), // Timestamp-only write.
  edit(15, { translation: "старый перевод" }, {}),
  edit(16, { word: "старое написание" }, {}),
];
const fixtures = `WITH
  word AS (SELECT * FROM jsonb_to_recordset($1::jsonb) AS w(
    id int, word text, translation text, "partOfSpeech" text, comments text,
    status text, source text, "updatedAt" timestamptz)),
  word_review_batch AS (SELECT * FROM jsonb_to_recordset($2::jsonb) AS b(
    id int, status text, "reviewFlow" text, "createdAt" timestamptz)),
  word_review_item AS (SELECT * FROM jsonb_to_recordset($3::jsonb) AS i(
    id int, "wordId" int, "batchId" int, status text, "originalWord" text,
    "originalTranslation" text, "partOfSpeech" text)),
  word_translation_history AS (SELECT * FROM jsonb_to_recordset($4::jsonb) AS t(
    "wordId" int, "previousTranslation" text, translation text)),
  word_edit_history AS (SELECT * FROM jsonb_to_recordset($5::jsonb) AS h(
    "before" jsonb, "after" jsonb))
`;
const params = [words, batches, items, translations, edits].map((data) => JSON.stringify(data));
const client = await pool.connect();
try {
  await client.query("BEGIN READ ONLY");
  const exports = {};
  class FixturePool {
    query(sql) { return client.query(fixtures + sql, params); }
  }
  vm.runInNewContext(js, {
    exports, URL, process: { env: process.env },
    require(name) {
      if (name === "server-only") return {};
      if (name === "pg") return { Pool: FixturePool };
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  const result = await exports.getAllWords();
  assert.equal(result.find((word) => word.word === "абажур")?.isReviewed, true,
    "Saved translation edits must automatically appear in the reviewed filter");
  const expectedIds = [1, 2, 3, 4, 8, 15, 16, 18, 20, 21];
  assert.deepEqual(
    Array.from(result.filter((word) => word.isReviewed), (word) => word.word).sort(),
    expectedIds.map((id) => words[id - 1].word).sort(),
  );
  assert.equal(result.length, 20);
  assert.equal(new Set(result.map((word) => word.word)).size, 20);
  console.log("Dictionary review checks passed: saved edits, legacy edits, explicit outcomes, disputes, new/unchanged words, hidden entries and duplicates.");
} finally {
  await client.query("ROLLBACK");
  client.release();
  await pool.end();
}
