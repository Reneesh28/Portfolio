# Stage Report — M4.7 Reveal and interaction integration

## Objective
Region arrival and focus behaviour, connected to the M1 camera system.

## Implemented
- **Settled framing** (`cameraTargets.ts`, `REGION_FRAMINGS['world-forge']`, now marked `status: 'M4'`):
  - a three-quarter view from the south-south-east at about terrace height;
  - the Forge axis sits left of centre and fills about 60% of the frame height;
  - the monument ring is in the lower foreground and the right side stays clear for the M5 dossier.
- **Arrival reveal** (DEC-008):
  - `createJourneyPath(poses, segmentArcs?)` takes optional per-segment travel arcs;
  - `ARRIVAL_ARCS` / `routeSegmentArcs` give the Sanctum → Forge segment a dip (−0.08), so the camera comes in low along the avenue and rises into the settled view as the crown climbs through the frame;
  - every other segment keeps the default `TRAVEL_ARC`, and `CameraRig` is still the only camera writer.
- **Activation (master P1):** when the journey settles on the Forge, the seam glow, the core light and the embers swell once (0.3 s rise, 0.9 s settle, `activationEnvelope`).
  - It is purely visual and never blocks input.
  - It is skipped under reduced motion.
- The Forge itself is not an interactive target. The monuments are, in M5.

## Validation
| Check | Result |
|---|---|
| `npm test` | 69/69. New tests: the arrival dips more than 3 units mid-segment and lands exactly on the stop pose; only that segment differs; the Forge axis sits left of centre and fills 50–72% of frame height; the activation envelope is bounded and returns to 0. The existing ground and landmark clearance tests run along the real path (with the dip) and gained a crown and orbit volume |
| typecheck / lint | exit 0 |
| Real navigation Sanctum → Forge (1440×900) | Arrival frames show the low approach and the rise; the swell is visible at arrival and settled 2.5 s later |
| Void opening | Unaffected (Void pose and Void-adjacent segments unchanged) |
| Renderer, World Forge stop | 84 draw calls, 10.8k triangles, 320 points |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.7 …".
