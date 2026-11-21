# Milestone Report — M1 World Foundation (recovery)

## Scope completed
The existing world (approved M2 Void and M3 geography) can now be explored through controlled, scroll-driven camera travel and direct region navigation. There's no free roam, and nothing was redesigned.

## Stages completed
| Stage | Status | Report |
|---|---|---|
| M1-R1 State and journey model | Implemented, automated-tested | `M1-R1-state-and-journey-model.md` |
| M1-R2 Camera target registry | Implemented, automated-tested, agent-inspected | `M1-R2-camera-target-registry.md` |
| M1-R3 Camera transition controller | Implemented, automated-tested, agent-inspected | `M1-R3-camera-transition-controller.md` |
| M1-R4 Scroll progression | Implemented, automated + real-input tested | `M1-R4-scroll-progression.md` |
| M1-R5 Direct navigation | Implemented, real-input tested, agent-inspected | `M1-R5-direct-navigation.md` |
| M1-R6 Input arbitration and panels | Implemented, automated + real-input tested | `M1-R6-input-arbitration.md` |
| M1-R7 Reduced motion, keyboard, touch, responsive | Implemented, real-input tested, agent-inspected | `M1-R7-reduced-motion-keyboard-touch-responsive.md` |
| M1-R8 M2/M3 integration and regression | Validated | `M1-R8-integration-regression.md` |
| M1-R9 Review and lock | **Owner-approved 2026-11-21** | this report |

## Original master-plan M1 check (§15)
| Master M1 item | Status |
|---|---|
| Entry module, R3F canvas, shared scene, initial camera, loading/error states, WebGL fallback | Already present before this run (verified in code) |
| Camera controller | `CameraRig` + `journeyPath` |
| Experience state | `experienceStore` (current region, destination, phase, progress, reduced motion, scroll block) |
| Region definitions | M3 `REGIONS` + `JOURNEY_ROUTE` + camera registry |
| Navigation controller | Store requests + `JourneyNav` |
| Scroll progression controller | `scrollInput` + `useJourneyInput` |
| Screen UI foundation | `WorldStage`, `JourneyNav`, `useDismissLayer`, hero fade |
| "Camera can move between predefined targets" / "State tracks current region/destination" / "Navigation testable" / "Scroll can advance experience" / "Direct navigation can interrupt scroll" / "Reduced motion configurable" | All verified (unit tests + 70 real-input checks) |
| "No competing camera controllers / no duplicated scroll listeners / no uncontrolled movement / canvas resize works / no console errors / UI and scene function independently" | All verified. The UI works without WebGL: the canvas fallback renders nothing and the nav and store still work. |

## Files changed (summary)
- **New source:**
  - `experience/`: journey, route, experienceStore, ExperienceContext, devHandle
  - `camera/`: cameraTargets, journeyPath, CameraRig
  - `input/`: scrollInput, useJourneyInput
  - `ui/`: JourneyNav, WorldStage, useDismissLayer
- **Modified:**
  - `WorldForge.tsx`, `WorldForge.css`
  - `core/WorldCanvas.tsx`, `core/WorldScene.tsx`
  - `regions/void/VoidRegion.tsx` (static camera removed)
  - `regions/void/VoidEnvironment.tsx` (glow fade)
  - `package.json` (`test` script)
- **New tests:** `tests/world-forge/` (5 suites, 51 tests).
- **New docs:** `docs/world-forge-autonomous/` (status, decisions, API, reports).
- **Not modified:** geography data, world blockout components, Classic code, `main`. No dependencies added.

## Validation summary
- `npm test` 51/51.
- `npm run typecheck` / `lint` / `build` exit 0.
- Real-input browser probes 70/70.
- Void scene pixel-identical: the camera pose is proven to 1e-9 and screenshot changes are confined to the UI.
- Classic unchanged. 0 console errors.

## Owner visual review status
**Owner-approved 2026-11-21** ("it's good… proceed"), after a local review. This followed the stale-HMR incident; see the STATUS Incidents section. To review locally:
```
cd portfolio
npm run dev
```
Open the printed localhost URL. Scroll or swipe through the journey, use PageDown/PageUp or the arrow keys, and open the bottom-centre region button to jump directly. Try it with your OS "reduce motion" setting on as well. Classic: add `?mode=classic`.

## Remaining limitations
- Region framings, route shape and pacing are **provisional** (DEC-001).
- Views other than the Void have a flat dark sky, because the Void's backdrop glow fades out (DEC-002).
- Narrow-layout hero raised 48 px (DEC-003).
- No world map, no control fading, no mobile-specific simplified camera, and no display font yet (all listed in DECISIONS.md).
- Worlds Beyond reads dark at its distance.

## Decisions required before M1 can be locked
1. Approve or adjust the provisional route, framings and pacing (DEC-001), after trying it locally.
2. Accept DEC-003 (mobile hero rise), or choose an alternative.
3. Note DEC-002: the sky treatment is deferred to M4/M8 design unless you want it sooner.
4. When the World Map should be designed (master §8 calls it the primary navigation entry).
5. Commit authorization. Stage 1, Stage 2, M3 and M1 work are all still uncommitted on `the-world-forge`.

## Milestone status: COMPLETE — owner-approved and LOCKED

## Next milestone
M4 The World Forge. It starts with its **required design gate**: an M3/route audit, then one recommended design direction, then your approval before any centerpiece geometry. The proposal has been submitted: `proposals/M4-world-forge-design-proposal.md`.
