import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [parts, chapters, original] = await Promise.all([
  read("lib/data/history-source.json").then(JSON.parse),
  read("lib/data/history-timeline.json").then(JSON.parse),
  read("lib/data/history-original.txt"),
]);
const normalize = (text) => text.replace(/\s+/gu, " ").trim();
const headers = [
  "Част 1. Краткие исторические сведения о селе Цинцкаро (Тетрицкаройский район, Грузия).",
  "Част 2.",
  "Часть 3. Краткие очерки истории села Цинцкаро.",
  "Часть 4.",
];
const withoutMessageHeaders = original.replace(
  /Achilles Theodoridis, \[[^\]]+\]:/gu,
  "",
);
assert.deepEqual(
  parts.map((part) => part.number),
  [1, 2, 3, 4],
);
for (const [index, part] of parts.entries()) {
  const start = withoutMessageHeaders.indexOf(headers[index]);
  assert.ok(start >= 0, `Missing source header for part ${part.number}`);
  const end =
    index < 3
      ? withoutMessageHeaders.indexOf(headers[index + 1], start)
      : undefined;
  const body = withoutMessageHeaders.slice(start + headers[index].length, end);
  assert.equal(
    normalize(part.paragraphs.map((p) => p.text).join(" ")),
    normalize(body),
    `Part ${part.number}: wording was lost or changed`,
  );
}
const paragraphs = parts.flatMap((part) => part.paragraphs);
const assignedIds = chapters.flatMap((chapter) => chapter.paragraphIds);
assert.equal(
  new Set(paragraphs.map((p) => p.id)).size,
  paragraphs.length,
  "Duplicate source IDs",
);
assert.equal(
  new Set(chapters.map((chapter) => chapter.id)).size,
  chapters.length,
  "Duplicate chapter anchors",
);
assert.equal(
  new Set(assignedIds).size,
  assignedIds.length,
  "A source fragment is repeated in the timeline",
);
assert.deepEqual(
  [...assignedIds].sort(),
  paragraphs.map((p) => p.id).sort(),
  "A source fragment is missing from the timeline",
);

// Optional check against actual server-rendered HTML, including both reading views.
if (process.argv[2]) {
  const origin = new URL(process.argv[2]);
  for (const path of ["/history", "/history/original"]) {
    const response = await fetch(new URL(path, origin));
    assert.equal(response.status, 200, `${path} did not load`);
    const html = await response.text();
    const rendered = [...html.matchAll(/data-source-id="([^"]+)"/gu)].map(
      (match) => match[1],
    );
    assert.deepEqual(
      [...rendered].sort(),
      paragraphs.map((p) => p.id).sort(),
      `${path}: missing or duplicated rendered text`,
    );
    for (const p of paragraphs)
      assert.ok(
        html.includes(
          p.text
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#x27;"),
        ),
        `${path}: changed paragraph ${p.id}`,
      );
    console.log(`${path}: all ${rendered.length} source fragments rendered`);
  }
  const response = await fetch(
    new URL("/history/tsintskaro-history.txt", origin),
  );
  assert.equal(response.status, 200);
  assert.equal(
    await response.text(),
    "История Цинцкаро\n\n" + paragraphs.map((p) => p.text).join("\n\n") + "\n",
    "The downloadable text is incomplete",
  );
}
console.log(
  `History verified: 4 complete parts, ${paragraphs.length} fragments, ${chapters.length} chapters; wording preserved, nothing missing or duplicated.`,
);
