# Stage Report — M1-R3 Camera transition controller

## Objective
Smooth, interruptible, reversible camera transitions with look-at handling and limits, no roll or shake, and no stale overwrites.

## Files changed
- `src/world-forge/camera/journeyPath.ts` (new): a centripetal Catmull-Rom path through the stop poses, plus a sin² travel arc between stops.
- `src/world-forge/camera/CameraRig.tsx` (new): the **only** camera writer, and the only caller of `store.advance`.
- `src/world-forge/experience/ExperienceContext.ts` (new): React context plus `useExperienceStore` / `useExperienceSnapshot`.
- `src/world-forge/experience/devHandle.ts` (new): a **development-only** `window.__worldForge` test handle. `import.meta.env.DEV` compiles it out of production builds.
- `src/world-forge/WorldForge.tsx`: creates the store, syncs reduced motion, exposes the dev handle.
- `src/world-forge/core/WorldCanvas.tsx`, `core/WorldScene.tsx`: pass the store to the scene through context and mount `CameraRig`.
- `src/world-forge/regions/void/VoidRegion.tsx`: **removed the static drei camera.** The Void rig keeps every visual element.
- `src/world-forge/regions/void/VoidEnvironment.tsx`: `HorizonGlow` fades out across the first 0.45 stops (see decision DEC-002).
- `tests/world-forge/journeyPath.test.ts` (new).

## Implementation summary
- **Camera pose per frame:** `path.sample(journey.position)`, then `camera.position` and `camera.lookAt(target)`. FOV updates only when it changes.
- **Movement:** the journey model supplies time-based ease-in-out navigation and speed-capped scroll following.
- **Path shape:** positions and look-at points follow continuous curves. At exact stops the registered pose is returned unchanged.
- **Travel arc:** lifts long crossings (13% of segment length, sin² profile) so the camera clears terrain.
- **Reduced motion (demand frameloop):** the store's wake handler calls `invalidate()`, and the rig keeps requesting frames only while the journey moves.

## Validation commands and results
| Check | Result |
|---|---|
| `npm test` | 36/36 pass. Includes stop-pose exactness, continuity (largest camera step under 2 units per 1/600 stop), ground clearance, clearance of the tall M3 landmark volumes (highlands, terraces, summit beacon, Forge, obelisk, archive frame), and clamping. |
| `npm run typecheck`, `npm run lint`, `npm run build` | exit 0 |
| Void pixel diff, production preview vs M1 baseline at 6 viewports | Scene pixels identical. The only differences are anti-aliasing on DOM hero text edges (0.00–0.02% of pixels). Classic shows the same noise level (0.13%). |
| Runtime, dev server | Navigated Void → each region in order → back to the Void. Every stop reported the correct `currentRegion`, `destinationRegion` and idle phase. 0 console errors or warnings. |

## Visual observations (agent inspection, not owner approval)
- **First pass found two problems:**
  - The Void's flat horizon-glow billboard showed hard edges from other viewpoints. Fixed with the fade.
  - The Worlds Beyond → Horizon transition clipped through a highland rock. Fixed with the travel arc, and a test now guards it.
- **Second pass:** all targets frame their M3 blockouts and transitions show no clipping.

## Regression checks
- Void opening unchanged (pixel diff).
- Geography files untouched.
- Classic unchanged.
- One camera, one writer.

## Known limitations
- The route shape (arc height, curve) is provisional. The final route and pacing need your approval.
- Without the Void glow, views other than the Void have a flat dark sky. That needs a world sky/horizon design decision (DEC-002).

## Acceptance
- [x] Stable, smooth motion; no roll (camera up fixed at +Y, lookAt-only orientation); no shake (monotonic easing, tested)
- [x] Interruption and reversal: a newer request replaces the older one starting from the current position (tested)
- [x] Limits: positions clamped to the route, time steps clamped

## Git checkpoint
Not committed; no commit authorization.
