# THE WORLD FORGE Status

Last updated: 2026-11-21
Current branch: `the-world-forge` (repository: `portfolio/`). `main` untouched; nothing pushed.
Working tree: M4 committed stage by stage (`8a282eb` … `f78f267`, plus the M4.9 report). Earlier checkpoint `dd349d0` holds Stage 1, the M2 Void, M3 geography and the M1 foundation. All local; nothing pushed.

## Milestone overview
| Milestone | Status | Evidence / report |
|---|---|---|
| M0 | COMPLETE | Prior audit |
| M1 | COMPLETE, owner-approved (2026-11-21), LOCKED. Framings stay provisional (DEC-001) and are refined per region milestone | `reports/M1-milestone-report.md` |
| M2 | COMPLETE, owner-approved, LOCKED | Opening scene verified pixel-identical after M1 |
| M3 | Owner-declared complete | Geography files untouched; now reachable through the journey |
| M4 | PARTIAL — M4.1–M4.8 implemented and validated; **M4.9 waiting on owner visual review** | `reports/M4-milestone-report.md` |
| M5 | NOT STARTED | — |
| M6 | NOT STARTED | — |
| M7 | NOT STARTED | — |
| M8 | NOT STARTED | — |
| M9 | NOT STARTED | — |

## Current stage
Stage: M4.9 Acceptance and lock
Objective: owner visual review of the World Forge centrepiece and of the small changes it brings to the Void opening; lock M4
Files: see `reports/M4-milestone-report.md`; review images in `reports/m4-review/`
Validation: `npm test` 70/70 · typecheck/lint/build exit 0 · real-input regression 70/70 ×3 · Classic pixel-identical · Forge 19 draw calls (budget 40)
Acceptance: all engineering criteria met; owner visual approval outstanding
Blockers: owner review (doc 16 M4.9; doc 10)
Next: on approval, lock M4 and start the M5 content and interaction design gate (proposal only)

## Owner decisions needed
- [ ] Approve and lock M4 (or list changes)
- [ ] Accept the Void-opening changes listed in the M4 report (seam halo, fractured pillar tips, crown breaks and strut, orbit fragments, tier lines), or keep any of them out of the opening
- [ ] World Map timing/design (master doc §8 primary navigation entry)
- [ ] Optional: `@types/node` dev dependency (DEC-004)

## Remaining roadmap (docs 03 and 16)
- **M5 Project System:** design gate (content audit, monument treatment, dossier behaviour), then M5.1–M5.9.
- **M6 Central Regions:** three separate tracks, each with its own content audit, design gate and lock:
  - M6.1 Origin Sanctum;
  - M6.2 Blueprint Archive;
  - M6.3 Path of Ascension.
- **M7 Worlds Beyond:** interest audit, Convergence proposal, then 6 territory proposals with one prototype and lock first (M7.1–M7.11).
- **M8 The Horizon:** content and contact verification, closing-composition approval (M8.1–M8.8).
- **M9 Integration and QA:** full-journey, accessibility, performance, asset and licence audits, final owner review (M9.1–M9.9).
- **Release R1–R6:** polish, performance, accessibility and alternative experience, content audit, production setup, launch. Optional E1–E7 only after launch.

## Incidents
- 2026-11-21 — Owner saw `Cannot read properties of undefined (reading 'setWakeHandler')` at `CameraRig.tsx:31` followed by `THREE.WebGLRenderer: Context Lost.` Root cause: the dev server kept a hot-reloaded, superseded `CameraRig` (prop-based `{ store }`, which puts that call on line 31) alongside the current `WorldScene` that renders `<CameraRig />` without props. The current code cannot reach that state, because `useExperienceStore()` throws on a missing provider. Context Lost is R3F's deliberate `forceContextLoss()` when the error boundary unmounts the canvas. Reproduced exactly by hot-swapping the legacy variant in, then verified: clean startup, idle, travel, resize, refresh, Classic round-trip, and HMR saves of all 7 chain files. No source change was needed; remedy: restart the dev server and hard-reload.

## Locked items
- [x] Name, tagline, identity, region order (doc 02)
- [x] M2 The Void composition (preserved; scene pixel-identical)
- [x] M3 geography, anchors, terrain, routes (untouched)
- [x] M1 foundation: journey store, single camera rig, scroll/keyboard/touch input, bottom-centre nav (owner-approved 2026-11-21)
- [x] M4 design direction "The Crucible of Worlds" (DEC-007); implementation awaiting M4.9 review
- [x] World Forge default; Classic at `?mode=classic`
- [x] No free roam; screen-space UI; audio off; no fake skill metrics
