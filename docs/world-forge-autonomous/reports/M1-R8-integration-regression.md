# Stage Report — M1-R8 M2/M3 integration and regression

## Objective
Void opening unchanged; geography and anchors unchanged; Classic route still works; camera views expose existing geography; build and runtime checks pass.

## Validation commands and results
| Check | Command / method | Result |
|---|---|---|
| Unit tests | `npm test` | 51/51 pass |
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0, no findings |
| Production build | `npm run build` | exit 0. Main chunk 441.20 kB (gzip 153.78), was 428.58 kB (gzip 148.99) before M1. WorldCanvas chunk 888.95 kB, unchanged within 1 kB. |
| Dev handle stripped | `grep -l __worldForge dist/assets/*.js` | 0 files |
| Void opening, scene | Preview screenshots (6 viewports, reduced motion) diffed against the pre-M1 baseline | Desktop/wide/laptop: all strong changes sit inside the hero-text area (anti-aliasing noise) and the new bottom nav; nothing changes right of x≈800, where the gateway and Forge are. Narrow viewports: changes only below the gateway (hero text raised 48 px, plus the nav). The camera-pose equivalence is also proven numerically (R2 tests). |
| Geography unchanged | File modification times | `data/worldGeography.ts` and every `world/*` file last modified before this run (08:22, before the docs arrived at 08:40). Only `VoidRegion.tsx` (camera removed) and `VoidEnvironment.tsx` (glow fade) changed among the Void files. |
| World Forge default | Preview `/` | 1 canvas, World Forge root, h1 "THE WORLD FORGE" |
| Classic | Preview `?mode=classic` | 8/8 sections, no canvas, 0 console problems, pixel diff at noise level (0.13%, same as the pre-M1 run-to-run noise) |
| Legacy `?mode=world` | Preview | World Forge |
| Real-input regression | `SUITES=scroll,nav,arbitration,access node input-probe.mjs` | **70/70 PASS**, 0 console errors or warnings |
| Region exposure | `journey-shots.mjs` at 1440×900 (with mid-transition frames) and 390×844 | All 7 targets reached and frame their M3 blockouts; transitions clip nothing; return to the Void exact |
| Single camera writer, no duplicated listeners | grep audit | `CameraRig` is the only `makeDefault` camera, the only pose writer and the only `store.advance` caller. One input hook; transient listeners only while the menu is open. |

## Regression checklist (doc 10)
- [x] Void opening composition and camera unchanged (scene). The narrow-layout hero text moved 48 px (DEC-003, needs your review).
- [x] M3 geography and anchors unchanged
- [x] World Forge remains default
- [x] Classic works via `?mode=classic`
- [x] UI screen-space
- [x] No competing camera movement
- [x] Panels/focus behave (nav menu: the only layer today)
- [x] Reduced motion works
- [x] Mobile and keyboard paths work
- [x] No unapproved dependencies (none added)
- [x] No unexpected runtime errors

## Git checkpoint
Not committed; no commit authorization.
