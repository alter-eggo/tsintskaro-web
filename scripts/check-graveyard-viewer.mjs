import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const modelDirectory = path.join(
  root,
  "public",
  "models",
  "tsintskaro-graveyard",
);

const expectedAssets = new Map([
  ["means_l.webp", 15_465_520],
  ["means_u.webp", 2_242_850],
  ["meta.json", 15_562],
  ["quats.webp", 18_443_108],
  ["scales.webp", 15_708_004],
  ["sh0.webp", 18_322_908],
  ["shN_centroids.webp", 2_082_542],
  ["shN_labels.webp", 10_133_284],
]);

for (const [filename, expectedSize] of expectedAssets) {
  const file = await stat(path.join(modelDirectory, filename));
  assert.equal(
    file.size,
    expectedSize,
    filename + " не совпадает с утвержденным экспортом Graveyard V2",
  );
}

const metadata = JSON.parse(
  await readFile(path.join(modelDirectory, "meta.json"), "utf8"),
);
assert.equal(metadata.version, 2, "Поддерживается формат SOG v2");
assert.equal(
  metadata.count,
  5_669_565,
  "Количество splat-точек модели должно оставаться неизменным",
);

const license = await readFile(
  path.join(modelDirectory, "LICENSE.txt"),
  "utf8",
);
assert.match(license, /Davit Goshadze/);
assert.match(license, /creativecommons\.org\/licenses\/by\/4\.0/);

const familiesPage = await readFile(
  path.join(root, "app", "families", "page.tsx"),
  "utf8",
);
assert.match(familiesPage, /<GraveyardSplatSection \/>/);

const familiesData = await readFile(
  path.join(root, "lib", "mock-data", "families.ts"),
  "utf8",
);
assert.doesNotMatch(
  familiesData,
  /Math\.random/,
  "Данные семей должны совпадать при серверном и клиентском рендеринге",
);

const section = await readFile(
  path.join(
    root,
    "components",
    "families",
    "GraveyardSplatSection.tsx",
  ),
  "utf8",
);
assert.match(section, /setIsViewerOpen\(true\)/);
assert.match(section, /Davit Goshadze/);
assert.match(section, /creativecommons\.org\/licenses\/by\/4\.0/);

console.log("Graveyard V2 viewer invariant verified.");
