# THE WORLD FORGE Status

Last updated: 2026-11-21
Current branch: `the-world-forge` (repository: `portfolio/`). `main` untouched; nothing pushed.
Working tree: uncommitted. Stage 1 (mode isolation), Stage 2 (Void), M3 (geography) and M1 recovery are all uncommitted; no commit authorization in this run.

## Milestone overview
| Milestone | Status | Evidence / report |
|---|---|---|
| M0 | COMPLETE | Prior audit |
| M1 | COMPLETE, owner-approved (2026-11-21), LOCKED. Framings stay provisional (DEC-001) and are refined per region milestone | `reports/M1-milestone-report.md` |
| M2 | COMPLETE, owner-approved, LOCKED | Opening scene verified pixel-identical after M1 |
| M3 | Owner-declared complete | Geography files untouched; now reachable through the journey |
| M4 | DESIGN GATE: proposal submitted, **waiting on owner approval** | `proposals/M4-world-forge-design-proposal.md` |
| M5 | NOT STARTED | — |
| M6 | NOT STARTED | — |
| M7 | NOT STARTED | — |
| M8 | NOT STARTED | — |
| M9 | NOT STARTED | — |

## Current stage
Stage: M4 design gate (pre-implementation)
Objective: audit M3 geography and the camera route; propose one cohesive direction for the Forge centrepiece
Files: `proposals/M4-world-forge-design-proposal.md` (documentation only; no source changes)
Validation: n/a (proposal). The audit used existing captures and the code for `DistantForge`, `FORGE_WARD`, routes and `REGION_FRAMINGS`
Acceptance: the proposal covers composition, scale, silhouette, materials, lighting, environment integration, camera reveal, mobile simplification, assets and performance risk
Blockers: owner approval of the direction (doc 16: no centrepiece geometry before approval)
Next: on approval, M4.1 blockout and silhouette

## Owner decisions needed
- [ ] M4 direction "The Crucible of Worlds": approve or redirect
- [ ] M4 Orbit fragments (up to 5) or sentinels only · crown static or slow drift
- [ ] DEC-002 world sky gradient: include in M4.6 or defer to M8
- [ ] M4 monument plinth count (7 proposed; confirmed in M5)
- [ ] World Map timing/design (master doc §8 primary navigation entry)
- [ ] Optional: `@types/node` dev dependency (DEC-004)
- [ ] Commit authorization. Stage 1, Stage 2, M3 and M1 are all still uncommitted

## Incidents
- 2026-11-21 — Owner saw `Cannot read properties of undefined (reading 'setWakeHandler')` at `CameraRig.tsx:31` followed by `THREE.WebGLRenderer: Context Lost.` Root cause: the dev server kept a hot-reloaded, superseded `CameraRig` (prop-based `{ store }`, which puts that call on line 31) alongside the current `WorldScene` that renders `<CameraRig />` without props. The current code cannot reach that state, because `useExperienceStore()` throws on a missing provider. Context Lost is R3F's deliberate `forceContextLoss()` when the error boundary unmounts the canvas. Reproduced exactly by hot-swapping the legacy variant in, then verified: clean startup, idle, travel, resize, refresh, Classic round-trip, and HMR saves of all 7 chain files. No source change was needed; remedy: restart the dev server and hard-reload.

## Locked items
- [x] Name, tagline, identity, region order (doc 02)
- [x] M2 The Void composition (preserved; scene pixel-identical)
- [x] M3 geography, anchors, terrain, routes (untouched)
- [x] M1 foundation: journey store, single camera rig, scroll/keyboard/touch input, bottom-centre nav (owner-approved 2026-11-21)
- [x] World Forge default; Classic at `?mode=classic`
- [x] No free roam; screen-space UI; audio off; no fake skill metrics
