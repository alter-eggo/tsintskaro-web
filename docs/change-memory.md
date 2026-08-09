# Change memory

## Graveyard V2 viewer in Families

- Invariant: the /families page contains the GraveyardSplatSection, and the
  82,413,778-byte browser export stays under
  public/models/tsintskaro-graveyard.
- Rationale: the original .sog scene contains 5,669,565 Gaussian splats. Its
  split web export supports progressive browser loading and must start only
  after an explicit visitor action so the regular family directory remains
  lightweight.
- Preserve the authored SuperSplat camera pose from the supplied example and
  keep both WebGPU and WebGL2 device fallbacks. The embedded canvas must retain
  mouse, keyboard, touch orbit, pinch zoom, reset-view, and fullscreen controls.
- Attribution is part of the feature, not optional footer copy: credit Davit
  Goshadze, link to https://superspl.at/scene/734ec011, and show the CC BY 4.0
  license beside the viewer.
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
