# M1 World Foundation — API and architecture

How the World Forge journey works, and where future milestones plug in.

## Data flow
```
input (wheel/touch/keys)  ─┐
JourneyNav (direct nav)   ─┼─► ExperienceStore ──(per frame, CameraRig only)──► journey.position ──► JourneyPath ──► camera
panels/menus (blockScroll)─┘        │
                                    └─► ExperienceSnapshot (discrete) ──► DOM UI (nav, hero fade via WorldStage)
```

## Modules (`src/world-forge/`)
| Module | Role |
|---|---|
| `experience/journey.ts` | Pure journey model: `position` in stops, `idle`/`scrolling`/`navigating` phases, `scrollJourney`, `navigateJourney`, `stepJourney`, `settleStop`. Deterministic; time steps clamped. |
| `experience/route.ts` | `JOURNEY_ROUTE` (from the M3 `REGIONS`, ordered 00→06), `stopOfRegion`, `regionAtStop`. |
| `experience/experienceStore.ts` | **Single source of truth.** Requests: `scroll(stops)`, `navigateTo(region)`, `stepRegion(±1)`. Arbitration: `blockScroll()`, `isScrollBlocked()`. Camera only: `advance(dt)`. Reads: `getJourney()` (per frame), `getSnapshot()` + `subscribe()` (discrete). Config: `JOURNEY_CONFIG`, `REDUCED_MOTION_JOURNEY_CONFIG`. |
| `experience/ExperienceContext.ts` | `ExperienceContext`, `useExperienceStore()`, `useExperienceSnapshot()`. Provided in both the DOM tree and the R3F scene. |
| `experience/devHandle.ts` | Development only: `window.__worldForge.store` for browser automation. Not in production builds. |
| `camera/cameraTargets.ts` | Pose registry: `computeVoidPose` (exact approved opening), `REGION_FRAMINGS` (**provisional**, relative to M3 anchors), `computeRegionPose`, `responsiveFov`. |
| `camera/journeyPath.ts` | Centripetal Catmull-Rom path through stop poses plus a sin² travel arc (`TRAVEL_ARC`). Exact poses at stops. |
| `camera/CameraRig.tsx` | The only camera and camera writer. Requests frames under the reduced-motion demand loop while moving. |
| `input/scrollInput.ts` | Pure input interpretation: `wheelDeltaPixels`, `createScrollInterpreter` (continuous, or one step per gesture under reduced motion), `keyboardStep`. |
| `input/useJourneyInput.ts` | One set of passive wheel/touch listeners on the root plus one document keydown listener. Ignores `[data-wf-own-scroll]` content, Ctrl+wheel, multi-touch, text entry and shortcuts. |
| `ui/JourneyNav.tsx` | Bottom-centre global navigation (toggle + region list + journey cue + live arrival announcement). |
| `ui/useDismissLayer.ts` | Escape closes the topmost open layer; shared by every menu or panel. |
| `ui/WorldStage.tsx` | Root `<main>` exposing `data-region` / `data-at-void` to CSS. |

## Input priority (locked order)
1. User interaction (DOM controls handle their own keys and clicks first).
2. Direct navigation: replaces scroll and older navigations; honoured even while a layer is open.
3. Open panel/menu: `const release = store.blockScroll()` while open, `release()` on close. The camera never moves behind it.
4. Scroll journey.
5. Ambient motion (never touches the camera).

## Contracts for later milestones
- **New region camera framing (M4–M8):** replace that region's entry in `REGION_FRAMINGS` (or extend `computeRegionPose`). Never position the camera anywhere else.
- **Panels (M5 dossier etc.):** call `useDismissLayer(open, close)` and block scroll while open. Put `data-wf-own-scroll` on scrollable content. Restore focus to the trigger on close.
- **Region content:** read `useExperienceSnapshot()` (current/destination region, phase) and don't subscribe to per-frame state in React. Per-frame scene effects read `store.getJourney()` inside `useFrame`.
- **Route changes** (order is locked): `JOURNEY_ROUTE` derives from `REGIONS`; the stop count follows automatically.

## Testing
- `npm test`: Node's built-in runner with native type stripping (Node ≥ 22.18). No dependencies. Tests live in `tests/world-forge/`.
- Browser probes (CDP, real input) live in the session scratchpad and aren't part of the repo.
