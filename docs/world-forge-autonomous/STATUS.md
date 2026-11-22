# THE WORLD FORGE Status

Last updated: 2026-11-22
Current branch: `the-world-forge` (repository: `portfolio/`). `main` untouched; nothing pushed.
Commits: allowed on this branch since 2026-11-22 (DEC-025). Everything through M9 is committed. Nothing pushed, merged or deployed (that needs your explicit yes).

## Milestone overview
| Milestone | Status | Evidence / report |
|---|---|---|
| M0 | COMPLETE | Prior audit |
| M1 | REOPENED. P5 journey and UI owner-approved (DEC-021) | `reports/P5-journey-ui.md` |
| M2 | REOPENED. P4 portal realm owner-approved (DEC-020) | `reports/P4-void-portal-realm.md` |
| M3 | REOPENED. P2 archipelago owner-approved (DEC-018); World Map data in place (UI in P5) | `reports/P2-geography.md` |
| M4 | REOPENED. P3 golden spire-city hub owner-approved (DEC-019) | `reports/P3-world-forge-hub.md` |
| M5 | **LOCKED** ("PRoceed", DEC-025); NeuroPlay and AETHERION content from the CV | `reports/M5-7-8-9-integration-and-qa.md` (and `M5-5-6-works-and-dossier.md`) |
| M6 | **LOCKED**: M6.1 (DEC-027) · M6.2 (DEC-030) · M6.3 (DEC-033) | `reports/M6-1-origin-sanctum.md`, `M6-2-blueprint-archive.md`, `M6-3-path-of-ascension.md` |
| M7 | **COMPLETE** (DEC-034): the Convergence, five open territories; Story-driven Games' keep built and closed until its text arrives | `reports/M7-1-convergence-and-guild.md`, `M7-2-four-territories.md`, `M7-3-completion.md` |
| M8 | **COMPLETE** (DEC-034): the Unfinished Gate, the closing words, Ambitions, contact from anywhere | `reports/M8-horizon.md` |
| M9 | **COMPLETE** (DEC-034): integration, display font, fading controls, link test, full QA; release readiness written | `reports/M9-integration-and-release-readiness.md` |

## Current stage
Stage: **M7, M8 and M9 complete** (DEC-034). The journey is built end to end.
Next (yours):
- push, merge or deploy (explicit yes needed);
- a real-device check;
- Story-driven Games' text.

Validation: see `reports/M9-integration-and-release-readiness.md` (unit tests, typecheck, lint, build, every browser probe on high and low quality, Classic).
Blockers: none on our side. Deployment waits on your yes.

## Owner decisions needed
- [x] P1 look approved ("Proceed with phase 2, we are good to go")
- [x] P2 approved, interim Void accepted ("Proceed with phase 3")
- [x] P3 approved ("Proceed with phase 4")
- [x] P4 approved ("proceed, phase 4 approved"); cloaked figure left out (default)
- [x] P5 approved ("approved phase 6" message, DEC-021)
- [x] M5.4 prototype accepted and M5.5 directed ("add all the other projects as well", DEC-022)
- [x] M5.6 directed ("Proceed with next phase", DEC-023)
- [x] M5.5–M5.6 review: "Go with what is best" (DEC-024), taken as keeping the recommended defaults and continuing
- [x] M5 lock: "PRoceed" (DEC-025)
- [x] M6.1 design approved: "proceed" (DEC-026); the three unsourced items left out
- [x] M6.1 lock: "Proceed, M6.1 Locked and good" (DEC-027)
- [x] M6.2 design approved: "The Drafting hall - Proceed with everything"; skills = CV + the owner's image (DEC-028)
- [x] M6.2 lock and M6.3 design: "We can proceed with this Good to go" (DEC-030)
- [x] M6.3 lock and the M7 review: "Proceed" (DEC-033)
- [x] M7 concepts, build order and content (DEC-032)
- [ ] **Story-driven Games text** (its keep stands, closed until then)
- [x] Assets: procedural only, plus the display font (Cinzel, OFL; `ASSETS.md`)
- [x] Chronoshift: from its GitHub repositories (DEC-034)
- [ ] Update docs 02/06, or keep overrides only in DECISIONS.md
- [x] Commit permission: "Commit permssion granted" (DEC-025); push, merge and deploy not included
- [x] M5 content: "Cv" / "Everything is in CV" (DEC-025)
- [x] Link testing: done (DEC-034); dead links fixed or removed
- [x] Classic CGPA → 6.86 (DEC-034); Classic's NeuroPlay text not changed (not approved)
- [ ] **Push, merge or deploy**: explicit yes needed
- [ ] **Real-device check** (phone and desktop GPU)
- [ ] Optional: `@types/node` dev dependency (DEC-004)

## Forced or inferred items flagged by the owner's audit (2026-11-21)
- M1 approval and DEC-001/002/003 were inferred from "it's good… proceed". Superseded by the M1 reopen.
- Commits `dd349d0` … `105812c` were made on an inferred authorization. Commit permission was given on 2026-11-22 (DEC-025); nothing was pushed.
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
