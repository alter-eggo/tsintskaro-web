import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("../lib/data/dictionary.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { TSINTSKARO_ALPHABET, compareTsintskaroWords, getWordLetter, getEntriesByLetter, searchDictionary } =
  await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
assert.equal(TSINTSKARO_ALPHABET.length, 40);
assert.deepEqual(TSINTSKARO_ALPHABET.slice(8, 11), ["Е", "Ê", "Ё"]);
assert(!TSINTSKARO_ALPHABET.includes("Ъ"));
assert.deepEqual(["бя", "бё", "бêй", "бе", "ба"].sort(compareTsintskaroWords), ["ба", "бе", "бêй", "бё", "бя"]);
assert.equal(compareTsintskaroWords("бêй".normalize("NFD"), "бêй"), 0);
assert.equal(getWordLetter("ê".normalize("NFD")), "Ê");
assert.equal(getWordLetter("бêй"), "Б");
assert.deepEqual(["да", "гха", "гя", "джа", "ея"].sort(compareTsintskaroWords), ["гя", "гха", "да", "джа", "ея"]);
const entries = [{ word: "бêй", translation: "аванс", partOfSpeech: "существительное" }, { word: "бей", translation: "другое слово" }];
assert.deepEqual(searchDictionary(entries, "бêй".normalize("NFD")), [entries[0]]);
assert.deepEqual(searchDictionary(entries, "БÊЙ"), [entries[0]]);
assert.deepEqual(searchDictionary(entries, "бей"), [entries[1]]);
assert.deepEqual(getEntriesByLetter(entries, "Б"), entries);
console.log("Dictionary checks passed: illustrated alphabet, sorting, letter filter, Unicode search.");
