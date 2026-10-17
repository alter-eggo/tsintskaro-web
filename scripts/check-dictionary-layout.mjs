import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const base = path.resolve(import.meta.dirname, "..");
const localRequire = Module.createRequire(path.join(base, "package.json"));
const primitives = { TableRow: "tr", TableCell: "td" };
function compile(file, source, extras = {}) {
  const module = new Module(file);
  module.require = (id) =>
    Object.hasOwn(extras, id) ? extras[id] : localRequire(id);
  module._compile(
    ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2021,
      },
    }).outputText,
    file,
  );
  return module.exports;
}
const translationFile = path.join(
  base,
  "app/language/DictionaryTranslation.tsx",
);
const translation = compile(
  translationFile,
  fs.readFileSync(translationFile, "utf8"),
  {
    "@/components/ui/table": primitives,
    "@/lib/data/dictionary": { formatDictionaryWord: (word) => word },
  },
);
// Exercise the actual dictionary row call site, without booting Next or connecting a DB.
const file = path.join(base, "app/language/LanguageClient.tsx");
const source = fs.readFileSync(file, "utf8");
const ast = ts.createSourceFile(
  file,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
let body;
function visit(node) {
  if (
    ts.isCallExpression(node) &&
    node.expression.getText(ast) === "paginatedEntries.map"
  )
    body = node.arguments[0].body.getText(ast);
  ts.forEachChild(node, visit);
}
visit(ast);
assert(body, "dictionary row call site exists");
const { row } = compile(
  file,
  `import { DictionaryRows, DictionaryTranslation } from './actual-translation'; const TableRow='tr', TableCell='td', Badge='span'; const formatDictionaryWord=s=>s; export const row=(entry,index=0)=>${body};`,
  { "./actual-translation": translation },
);
const strip = (text) =>
  text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const cells = (html) =>
  [...html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((match) =>
    strip(match[1]),
  );
const entry = {
  word: "тестовое выражение",
  kind: "idiom",
  literalTranslation: "буквальный перевод",
  translation: "совместимый текст",
  senses: [
    {
      translation: "первое значение",
      partOfSpeech: "существительное",
      examples: [{ phrase: "длинный пример", translation: "перевод примера" }],
    },
    { translation: "второе значение", partOfSpeech: "наречие", examples: [] },
    {
      translation: null,
      examples: [
        {
          phrase: "пустое значение с примером",
          translation: "сохранённый пример",
        },
      ],
    },
  ],
};
const html = renderToStaticMarkup(
  React.createElement(React.Fragment, null, row(entry)),
);
const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((match) =>
  cells(match[1]),
);
assert.equal(
  rows[0][0],
  entry.word,
  "word cell must contain only the headword",
);
assert.equal(rows.length, 3, "each sense needs its own aligned table row");
assert.match(html, /rowSpan="3"/);
assert(rows[0].at(-1).includes("существительное"));
assert(rows[0].at(-1).includes("Фразеологизм"));
assert(rows[1].at(-1).includes("наречие"));
assert(!rows[1].at(-1).includes("существительное"));
assert(html.includes("<strong") && html.includes("длинный пример"));
assert(html.includes("Буквально:") && html.includes("буквальный перевод"));
assert(html.includes("сохранённый пример"));
// Mobile metadata must remain attached to the matching sense when the last column is hidden.
assert.equal((html.match(/Часть речи:/g) ?? []).length, 2);
for (const kind of ["word", "proverb"]) {
  const legacy = renderToStaticMarkup(
    row({
      word: "старое слово",
      translation: "старый перевод",
      partOfSpeech: "глагол",
      kind,
    }),
  );
  assert.equal(cells(legacy)[0], "старое слово");
  assert(cells(legacy).at(-1).includes("глагол"));
  if (kind === "proverb")
    assert(cells(legacy).at(-1).includes("Пословица/поговорка"));
}
console.log(
  "PASS dictionary layout: aligned senses and labels, clean headwords, kinds, examples, literal translation, legacy entries and mobile metadata.",
);
