# Stage Report — M1-R2 Camera target registry

## Objective
Define an explicit camera pose for every region, driven by configuration and mapped to the verified M3 anchors. The Void opening pose must be preserved exactly.

## Files changed
- `src/world-forge/camera/cameraTargets.ts` (new): `computeVoidPose`, `REGION_FRAMINGS` (provisional), `computeRegionPose`, `responsiveFov`.
- `tests/world-forge/cameraTargets.test.ts` (new).

## Implementation summary
- **Pose format:** position, look-at target and vertical FOV, in world space. Camera up is always +Y, so there's no roll.
- **Void pose:** computed from the approved M2 layout functions (`computeVoidLayout` + `computeVoidPlacement`), with no new numbers. It reproduces the old nested rig camera (rig yaw → Forge offset → local position + pitch).
- **Other six regions:** framings are offsets from their M3 region anchors and are marked `status: 'provisional'`. No geography was edited.
- **Narrow screens:** `responsiveFov` widens the vertical FOV to keep horizontal coverage, capped at 72°.

## Validation
| Check | Result |
|---|---|
| `npm test` | Void pose equals the rig camera in position (< 1e-9) and full orientation (quaternion Δ < 1e-12) at 7 viewports, 360×640 to 3440×1440. Every stop has finite poses, pitch within ±60° and a camera above its anchor. |
| Typecheck / lint | exit 0 |
| Agent visual inspection | All 7 targets rendered on the dev server through the journey (see M1-R3). |

## Known limitations
- **Provisional framings.** The final framing for each region belongs to that region's approved design (M4–M8).
- **Worlds Beyond:** its target is about 130 units from the Convergence, so fog makes it dim.
- **Path of Ascension:** its framing was re-tuned during R3 after visual inspection showed the summit mesa blocking the view.

## Acceptance
- [x] Reachable targets for all seven regions (runtime-verified in R3)
- [x] No geography edits
- [x] Void opening pose preserved (automated, plus a pixel diff in R3)

## Git checkpoint
Not committed; no commit authorization.
