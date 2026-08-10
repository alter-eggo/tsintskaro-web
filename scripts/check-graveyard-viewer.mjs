import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const modelDirectory = path.join(
  root,
  "public",
  "models",
  "tsintskaro-graveyard-streamed",
);

const metadata = JSON.parse(
  await readFile(path.join(modelDirectory, "lod-meta.json"), "utf8"),
);
const expectedLodCounts = [5_669_565, 2_834_783, 1_417_391, 566_957];

assert.equal(metadata.version, 1, "Streamed SOG index format must stay at v1");
assert.equal(metadata.lodLevels, 4, "The graveyard must keep four LOD levels");
assert.deepEqual(
  metadata.counts,
  expectedLodCounts,
  "Full, 50%, 25%, and 10% LOD counts must stay unchanged",
);
assert.equal(
  metadata.count,
  expectedLodCounts.reduce((total, count) => total + count, 0),
  "The Streamed SOG aggregate count must match all LOD levels",
);
assert.equal(metadata.filenames.length, 22, "The spatial tree must keep 22 chunks");

const expectedChunkAssets = [
  "means_l.webp",
  "means_u.webp",
  "quats.webp",
  "scales.webp",
  "sh0.webp",
  "shN_centroids.webp",
  "shN_labels.webp",
].sort();
let chunkCount = 0;
let referencedAssetCount = 0;

for (const relativeMetaPath of metadata.filenames) {
  const chunkMetadataPath = path.join(modelDirectory, relativeMetaPath);
  const chunkMetadata = JSON.parse(await readFile(chunkMetadataPath, "utf8"));
  const referencedAssets = Object.values(chunkMetadata)
    .filter((value) => value && typeof value === "object" && Array.isArray(value.files))
    .flatMap((value) => value.files)
    .sort();

  assert.equal(chunkMetadata.version, 2, `${relativeMetaPath} must be SOG v2`);
  assert.ok(chunkMetadata.count > 0, `${relativeMetaPath} must contain splats`);
  assert.equal(chunkMetadata.shN?.bands, 3, `${relativeMetaPath} must keep SH3`);
  assert.deepEqual(
    referencedAssets,
    expectedChunkAssets,
    `${relativeMetaPath} must reference the complete chunk payload`,
  );

  for (const filename of referencedAssets) {
    const asset = await stat(path.join(path.dirname(chunkMetadataPath), filename));
    assert.ok(asset.size > 0, `${relativeMetaPath}/${filename} must not be empty`);
    referencedAssetCount += 1;
  }

  chunkCount += chunkMetadata.count;
}

assert.equal(chunkCount, metadata.count, "Chunk counts must match the index count");
assert.equal(referencedAssetCount, 154, "All 22 chunk payloads must be present");

const collectFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
};

const streamedFiles = await collectFiles(modelDirectory);
const streamedBytes = (
  await Promise.all(streamedFiles.map((filename) => stat(filename)))
).reduce((total, file) => total + file.size, 0);
assert.equal(streamedFiles.length, 177, "The Streamed SOG must contain 177 files");
assert.equal(
  streamedBytes,
  190_743_810,
  "The Streamed SOG bytes must match the verified conversion",
);

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
assert.match(
  section,
  /Модель загружается частями по мере просмотра/,
  "The consent screen must explain on-demand streaming",
);
assert.match(
  section,
  /Davit Goshadze/,
  "The public viewer must credit the model author",
);
assert.match(
  section,
  /https:\/\/creativecommons\.org\/licenses\/by\/4\.0\//,
  "The public viewer must link to the CC BY 4.0 license",
);
assert.match(
  section,
  /https:\/\/superspl\.at\/scene\/734ec011/,
  "The public viewer must link to the supplied model source",
);

const license = await readFile(
  path.join(
    root,
    "public",
    "models",
    "tsintskaro-graveyard",
    "LICENSE.txt",
  ),
  "utf8",
);
assert.match(license, /Author: Davit Goshadze/);
assert.match(license, /License URL: https:\/\/creativecommons\.org\/licenses\/by\/4\.0\//);
assert.match(license, /Source: https:\/\/superspl\.at\/scene\/734ec011/);

const viewer = await readFile(
  path.join(root, "components", "families", "GraveyardSplatViewer.tsx"),
  "utf8",
);
assert.match(
  viewer,
  /\/models\/tsintskaro-graveyard-streamed\/lod-meta\.json/,
  "The viewer must load the Streamed SOG index",
);
assert.match(
  viewer,
  /filename:\s*"lod-meta\.json"/,
  "PlayCanvas must select the streamed octree parser from the asset filename",
);
assert.match(
  viewer,
  /const SPLAT_BUDGET = 1_500_000/,
  "The viewer must cap active streamed detail at 1.5 million splats",
);
assert.match(
  viewer,
  /app\.scene\.gsplat\.splatBudget = SPLAT_BUDGET/,
  "The Streamed SOG budget must be applied to the PlayCanvas scene",
);
assert.match(
  viewer,
  /const LOD_BASE_DISTANCE = 0\.25/,
  "The initial camera must prefer a coarse streamed LOD until the visitor moves closer",
);
assert.match(
  viewer,
  /lodBaseDistance:\s*LOD_BASE_DISTANCE/,
  "The per-model LOD distance must be applied to the GSplat component",
);
assert.match(
  viewer,
  /const INITIAL_STREAMING_LOD = 3/,
  "The authored starting view must begin at the smallest download LOD",
);
assert.match(
  viewer,
  /const STREAMING_LOD_DISTANCE_RATIOS = \[0\.2, 0\.4, 0\.7\]/,
  "Zoom thresholds must progressively unlock LOD 2, 1, and 0",
);
assert.match(
  viewer,
  /lodRangeMin:\s*INITIAL_STREAMING_LOD/,
  "The GSplat component must not request fine LOD chunks on first paint",
);
assert.match(
  viewer,
  /splatEntity\.gsplat\.lodRangeMin = minimumLod/,
  "Approaching the model must progressively release finer streamed LODs",
);
assert.match(
  viewer,
  /frame\.dataset\.lodRangeMin = String\(minimumLod\)/,
  "Browser regression checks must be able to observe the active LOD floor",
);
assert.match(
  viewer,
  /Math\.exp\(clampedWheelDelta \* WHEEL_ZOOM_SPEED\)/,
  "Wheel zoom must remain symmetric for large positive and negative deltas",
);
assert.match(
  viewer,
  /MIN_PINCH_ZOOM_SCALE[\s\S]*MAX_PINCH_ZOOM_SCALE[\s\S]*gestureDistance \/ gesture\.distance/,
  "Pinch zoom must clamp irregular touch-event jumps in both directions",
);
assert.match(
  viewer,
  /aria-label="Отдалить модель"/,
  "Narrow screens must provide an explicit zoom-out control",
);
assert.match(
  viewer,
  /aria-label="Приблизить модель"/,
  "Narrow screens must provide an explicit zoom-in control",
);
assert.match(
  viewer,
  /window\.matchMedia\("\(max-width: 639px\)"\)\.matches[\s\S]*typeof frame\.requestFullscreen !== "function"/,
  "Narrow screens and browsers without the element Fullscreen API must use the viewport fallback",
);
assert.match(
  viewer,
  /fixed inset-0 z-\[100\] h-\[100dvh\] w-screen/,
  "The mobile fullscreen fallback must cover the complete dynamic viewport",
);
assert.match(
  viewer,
  /document\.body\.style\.overflow = "hidden"/,
  "The page behind the viewport fullscreen fallback must not scroll",
);
assert.match(
  viewer,
  /event\.key === "Escape"[\s\S]*setIsViewportFullscreen\(false\)/,
  "The viewport fullscreen fallback must close with Escape",
);
assert.match(
  viewer,
  /aria-label=\{[\s\S]*"Закрыть полноэкранный режим"[\s\S]*<Shrink/,
  "Fullscreen mode must expose an explicit exit control",
);
assert.match(
  viewer,
  /document\.addEventListener\("fullscreenchange", syncNativeFullscreen\)/,
  "The button state must follow native fullscreen entry and exit",
);
assert.match(
  viewer,
  /frame\.dataset\.cameraDistance = distance\.toFixed\(6\)/,
  "Browser regression checks must be able to observe camera-distance changes",
);
assert.match(
  viewer,
  /Math\.min\(sceneRadius \* 0\.02, MAX_CAMERA_NEAR_LIMIT\)/,
  "A distant AABB outlier must not raise the camera near limit above the authored pose",
);
assert.match(
  viewer,
  /cameraControlsRef\.current = \{[\s\S]*reset: applyAuthoredCamera,[\s\S]*zoom: zoomCamera/,
  "Reset and zoom commands must be published atomically from one camera instance",
);
assert.match(
  viewer,
  /event\.pointerType === "touch" && event\.isPrimary[\s\S]*clearPointerGesture\(\)/,
  "A new primary touch must clear stale pointers before starting a gesture",
);
assert.match(
  viewer,
  /"lostpointercapture",[\s\S]*clearPointerGesture/,
  "Losing pointer capture must clear the active pinch gesture",
);
assert.match(
  viewer,
  /const onBlur = \(\) => \{[\s\S]*pressedKeys\.clear\(\);[\s\S]*clearPointerGesture\(\)/,
  "Canvas blur must clear both keyboard and touch state",
);
assert.doesNotMatch(
  viewer,
  /\/models\/tsintskaro-graveyard\/meta\.json/,
  "The viewer must not load the legacy monolithic SOG",
);

console.log("Graveyard Streamed SOG viewer invariant verified.");
