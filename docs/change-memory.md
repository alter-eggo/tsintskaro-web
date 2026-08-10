# Change memory

## Graveyard V2 viewer in Families

- Invariant: the /families page contains the GraveyardSplatSection, and the
  active model is the Streamed SOG index at
  public/models/tsintskaro-graveyard-streamed/lod-meta.json. The verified
  export contains 177 files totaling 190,743,810 bytes, with 22 spatial chunks
  and four LOD counts: 5,669,565, 2,834,783, 1,417,391, and 566,957.
- Rationale: Streamed SOG lets the PlayCanvas viewer request only the spatial
  chunks and level of detail needed for the current view. Loading must still
  start only after an explicit visitor action so the regular family directory
  remains lightweight.
- PlayCanvas parser guardrail: both the asset URL and its explicit filename
  must end in lod-meta.json. Supplying filename: meta.json makes PlayCanvas
  select the regular SOG parser and leaves the viewer stuck at 0%.
- Keep app.scene.gsplat.splatBudget at 1,500,000 unless a measured device and
  network profile justifies changing it. Without a positive budget, a static
  camera can progressively request every LOD file, defeating the download and
  memory goal of this streamed conversion.
- Keep the component LOD base distance at 0.25 model units with multiplier 3.
  The authored starting view must additionally clamp `lodRangeMin` to LOD 3,
  then unlock LOD 2, 1, and 0 below 70%, 40%, and 20% of the authored camera
  distance. This keeps first paint to the two coarse payloads (17 requests,
  about 10.7 MB in the 390x844 browser profile) while still increasing detail
  as the visitor approaches a grave marker. Expose the current floor through
  `data-lod-range-min` for browser regression checks.
- Preserve the authored SuperSplat camera pose from the supplied example and
  keep both WebGPU and WebGL2 device fallbacks. The embedded canvas must retain
  mouse, keyboard, touch orbit, pinch zoom, reset-view, and fullscreen controls.
- Narrow-screen zoom invariant: large wheel deltas must use bounded exponential
  scaling, pinch steps must be clamped symmetrically, and mobile layouts must
  expose explicit zoom-out and zoom-in buttons. This prevents negative linear
  wheel factors or irregular touch events from jumping the camera through the
  model while preserving zoom in both directions.
- Fullscreen invariant: narrow screens and browsers that do not expose element
  requestFullscreen must use a fixed, 100dvh viewport fallback with background
  scrolling locked and an explicit exit button. Desktop browsers should prefer
  native fullscreen and fall back to the same viewport mode if the API rejects
  the request; Escape must close the fallback.
- Publish reset and zoom together through one camera-controls ref. Separate
  refs can be left pointing at different camera instances during development
  remounts, making zoom use a stale distance even though reset looks correct.
- Touch-state guardrail: a new primary touch, canvas blur, pointer cancellation,
  or lost pointer capture must clear stale pointer and gesture state. A stale
  touch combined with a later tap is otherwise misread as a huge pinch and can
  throw the camera away from the model on a narrow screen.
- Camera-distance guardrail: cap the scene-radius-derived near limit at 0.25
  model units. Streamed SOG bounds can contain distant outlier splats; using an
  uncapped 2% of that AABB raised the minimum distance to about 20 while the
  authored pose is about 3.46, so every zoom-in attempt actually jumped away.
- The public viewer must preserve the supplied CC BY 4.0 attribution: display
  Davit Goshadze as the author, link to the SuperSplat source and CC BY 4.0
  license, and keep public/models/tsintskaro-graveyard/LICENSE.txt in the
  shipped site. Keep this legal guardrail covered by the viewer regression
  check.
- The family cards rendered around the viewer must be deterministic on the
  server and in the browser. Never use Math.random while constructing
  familiesData because it causes a React hydration mismatch on /families.
- Regression check: pnpm test:graveyard-viewer.
- Full verification: pnpm test:graveyard-viewer, pnpm typecheck, and pnpm build.

## Local environment file

- Invariant: `.env` is local-only and remains ignored by Git; `.env.example` is the committed source of truth for supported variables.
- `STORY_VIDEO_URL` may be left empty in development. Set it to a YouTube, Vimeo, or direct CDN video URL to enable the story video.
- Keep database credentials, application secrets, and certificate material only in ignored local environment files or the deployment secret store. Never copy their values into this document, tracked source files, logs, or test fixtures.
- Preserve multiline certificate values as a single quoted dotenv value, including the PEM header and footer.
- Verification: `git check-ignore .env` and `Get-Content .env`.
