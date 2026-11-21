# THE WORLD FORGE Status

Last updated: 2026-11-21
Current branch: `the-world-forge` (repository: `portfolio/`). `main` untouched; nothing pushed.
Working tree: commits up to `105812c` (made on an inferred authorization, pending your confirmation). The reconciliation documents, P1–P5 and M5.2–M5.9 QA are **uncommitted** (P5 was re-applied after a rewind to the end of P4). Nothing pushed.

## Milestone overview
| Milestone | Status | Evidence / report |
|---|---|---|
| M0 | COMPLETE | Prior audit |
| M1 | REOPENED. P5 journey and UI owner-approved (DEC-021) | `reports/P5-journey-ui.md` |
| M2 | REOPENED. P4 portal realm owner-approved (DEC-020) | `reports/P4-void-portal-realm.md` |
| M3 | REOPENED. P2 archipelago owner-approved (DEC-018); World Map data in place (UI in P5) | `reports/P2-geography.md` |
| M4 | REOPENED. P3 golden spire-city hub owner-approved (DEC-019) | `reports/P3-world-forge-hub.md` |
| M5 | M5.1–M5.8 done, M5.9 QA done; **waiting on your M5 lock** | `reports/M5-7-8-9-integration-and-qa.md` (and `M5-5-6-works-and-dossier.md`) |
| M6 | NOT STARTED | — |
| M7 | NOT STARTED | — |
| M8 | NOT STARTED | — |
| M9 | NOT STARTED | — |

## Current stage
Stage: P6 = M5 Project System — M5.7 navigation, M5.8 responsive / accessibility / performance, M5.9 QA done; **M5 lock is yours**
Objective: every route into and out of a work verified; desktop Works list moved off the terrace; phone Works row and map reachability fixed; monuments in 2 draw calls and 8,900 triangles
Files: `regions/forge/{monumentGeometry (new),Monuments}`, `ui/{ProjectDossier,WorldMap,mapLayout}`, `WorldForge.css`, dev-only `core/DevRenderStats.tsx` + `experience/devHandle.ts`, tests `monuments.test.ts` (new) + `projects.test.ts`; report `reports/M5-7-8-9-integration-and-qa.md`
Validation: `npm test` 100/100 · typecheck/lint/build exit 0 · M5 probe 41/41 · M5.7 probe 39/39 · M5.8 probe 19/19 (high and low) · map 21/21 · regression 70/70 · Classic pixel-identical to P3 capture
Blockers: **M5 lock (owner)**; content answers still open (they only fill in dossiers)
Next: on the M5 lock, M6 starts with its design gate (Origin Sanctum first, doc 16)

## Owner decisions needed
- [x] P1 look approved ("Proceed with phase 2, we are good to go")
- [x] P2 approved, interim Void accepted ("Proceed with phase 3")
- [x] P3 approved ("Proceed with phase 4")
- [x] P4 approved ("proceed, phase 4 approved"); cloaked figure left out (default)
- [x] P5 approved ("approved phase 6" message, DEC-021)
- [x] M5.4 prototype accepted and M5.5 directed ("add all the other projects as well", DEC-022)
- [x] M5.6 directed ("Proceed with next phase", DEC-023)
- [x] M5.5–M5.6 review: "Go with what is best" (DEC-024), taken as keeping the recommended defaults and continuing
- [ ] **M5 lock** (M5.9): the eight works, the Works index, and the focus / switch / close behaviour
- [ ] Assets: procedural only, or present CC0/licensed candidates
- [ ] Chronoshift content: description, stack, status, links
- [ ] Update docs 02/06, or keep overrides only in DECISIONS.md
- [ ] Commit permission for approved phases (not yet given explicitly)
- [ ] M5 content items (NeuroPlay conflict, AETHERION stack, CV figures, link testing) still open
- [ ] Optional: `@types/node` dev dependency (DEC-004)

## Forced or inferred items flagged by the owner's audit (2026-11-21)
- M1 approval and DEC-001/002/003 were inferred from "it's good… proceed". Superseded by the M1 reopen.
- Commits `dd349d0` … `105812c` were made on an inferred authorization. Confirmation is pending; nothing was pushed.
- DEC-008 refinements and the M4 changes to the Void were made before approval. Superseded by the M4/M2 reopen.
- Not built although locked in the master doc: World Map, control fading, display font, mobile simplified camera for all regions. Now planned in P5, except the font, which is still open.
- Verification limits: no real-device or GPU testing; the browser probes are not in the repo; tests are not typechecked.

## Incidents
- 2026-11-21 — Owner saw `Cannot read properties of undefined (reading 'setWakeHandler')` at `CameraRig.tsx:31` followed by `THREE.WebGLRenderer: Context Lost.` Root cause: the dev server kept a hot-reloaded, superseded `CameraRig` (prop-based `{ store }`, which puts that call on line 31) alongside the current `WorldScene` that renders `<CameraRig />` without props. The current code cannot reach that state, because `useExperienceStore()` throws on a missing provider. Context Lost is R3F's deliberate `forceContextLoss()` when the error boundary unmounts the canvas. Reproduced exactly by hot-swapping the legacy variant in, then verified: clean startup, idle, travel, resize, refresh, Classic round-trip, and HMR saves of all 7 chain files. No source change was needed; remedy: restart the dev server and hard-reload.

- 2026-11-21 21:56 — While an M5.5 browser probe was running, the uncommitted World Forge work was stashed (`stash@{0}`, "WIP on the-world-forge") and `manga` was checked out, from outside this session. Nothing was lost: by the next session turn the branch was back on `the-world-forge` with the stash applied (not by this session). That probe run was discarded and re-run on the restored tree.

## Locked items
- [x] Name, tagline, identity, region order (doc 02)
- [ ] ~~M2 The Void composition~~ reopened (DEC-014)
- [ ] ~~M3 geography~~ reopened (DEC-014)
- [ ] ~~M1 lock~~ reopened (DEC-014); engineering core kept
- [ ] ~~M4 lock~~ reopened (DEC-014)
- [x] Region names and order (DEC-011) · Projects as monuments, no pictures (DEC-012, DEC-015) · Blueprint images as visual reference (DEC-010)
- [x] World Forge default; Classic at `?mode=classic`
- [x] No free roam; screen-space UI; audio off; no fake skill metrics
