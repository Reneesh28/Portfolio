# THE WORLD FORGE Status

Last updated: 2026-11-22
Current branch: `the-world-forge` (repository: `portfolio/`). `main` untouched; nothing pushed.
Commits: allowed on this branch since 2026-11-22 (DEC-025). P1–P5 and M5 are committed (`ee17210`, `37e4581`); the M6.1 gate documents are committed after them. Nothing pushed.

## Milestone overview
| Milestone | Status | Evidence / report |
|---|---|---|
| M0 | COMPLETE | Prior audit |
| M1 | REOPENED. P5 journey and UI owner-approved (DEC-021) | `reports/P5-journey-ui.md` |
| M2 | REOPENED. P4 portal realm owner-approved (DEC-020) | `reports/P4-void-portal-realm.md` |
| M3 | REOPENED. P2 archipelago owner-approved (DEC-018); World Map data in place (UI in P5) | `reports/P2-geography.md` |
| M4 | REOPENED. P3 golden spire-city hub owner-approved (DEC-019) | `reports/P3-world-forge-hub.md` |
| M5 | **LOCKED** ("PRoceed", DEC-025); NeuroPlay and AETHERION content from the CV | `reports/M5-7-8-9-integration-and-qa.md` (and `M5-5-6-works-and-dossier.md`) |
| M6 | M6.1 **LOCKED** (DEC-027) · M6.2 **LOCKED** (DEC-030) · M6.3 Path of Ascension built and QA'd (DEC-030); **waiting on your M6.3 lock** | `reports/M6-3-path-of-ascension.md` |
| M7 | IN PROGRESS. Concepts and content approved (DEC-032). The Convergence and The Guild built and QA'd; **waiting on your review** (hub and visual-language lock) | `reports/M7-1-convergence-and-guild.md` |
| M8 | NOT STARTED | — |
| M9 | NOT STARTED | — |

## Current stage
Stage: M7 Worlds Beyond: the Convergence and the representative territory (The Guild) built and QA'd; **your review is the next stop** (doc 16 M7.4 and M7.7, combined, DEC-032). M6.3 lock also still yours.
Objective: the Convergence (plaza, six gates facing their territories, compass monolith); The Guild (Hall, Chronicle, Assembly, Stage) with AniCos facts; card → fly to the territory → panel → return
Files: `regions/beyond/*`, `content/interests.ts`, `ui/BeyondPanel.tsx`, `camera/{cameraTargets,CameraRig}`, `experience/experienceStore.ts`; report `reports/M7-1-convergence-and-guild.md`
Validation: `npm test` 138/138 · typecheck/lint/build clean · M7 probe 81/81 (high and low) · M6.3 105/105 · M6.2 105/105 · M6.1 105/105 · M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) · map 21/21 · regression 70/70 · Classic Δ 0 against the M6.3 capture
Blockers: **M7 review (owner)**; **M6.3 lock (owner)**; Story-driven Games text (owner)
Next: on your go-ahead, Anime & Manga, Formula 1, Gaming & Content Creation and The Training Grounds, one stage each

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
- [ ] **M6.3 lock**: the Lit Ascent, the timeline selector and panel, the milestone focus and lanterns
- [x] M7 concepts, build order and content (DEC-032)
- [ ] **M7 review**: the Convergence and The Guild (the hub and visual-language lock)
- [ ] Story-driven Games text
- [ ] Assets: procedural only, or present CC0/licensed candidates
- [ ] Chronoshift content: description, stack, status, links
- [ ] Update docs 02/06, or keep overrides only in DECISIONS.md
- [x] Commit permission: "Commit permssion granted" (DEC-025); push, merge and deploy not included
- [x] M5 content: "Cv" / "Everything is in CV" (DEC-025)
- [ ] Link testing (GitHub and Vercel) still needs an explicit yes
- [ ] Classic corrections (NeuroPlay text, CGPA 6.91 → 6.86): a Classic change, needs your yes
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
