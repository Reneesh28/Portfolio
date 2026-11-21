# Stage Report — M4.4 Orbit elements

## Objective
The approved surrounding elements: four sentinels plus up to 5 fragments (DEC-007). They should reinforce the centrepiece, not distract from it.

## Implemented
- `ForgeOrbit.tsx`:
  - **Sentinels:** the approved tapered towers (same places and heights), each with a base block deepened into the T2 slope (so nothing overhangs in the air) and a capstone.
  - **Fragments:** 5 worked-stone blocks (one material, cut-block language) at crown height, r 14.5–19. The ring turns very slowly (0.022 rad/s) and each block tumbles gently.
  - Under reduced motion, everything holds still.
  - The low-power tier (smallest viewport side under 600 px) shows 3 fragments.
- `ForgeRegion` now receives `animate` from the scene and picks its quality tier from the viewport (`forgeQuality`).

## Validation
| Check | Result |
|---|---|
| `npm test` | 61/61 (orbit test extended: fragments clear the crown and orbit above the sentinels) |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports | 0.15–0.32% of pixels changed by more than 3. Added: a few small dark fragments around the ring inside the gate, matching the Void's own floating stones. Reviewed with M4.9 |
| World Forge stop | Fragments are sparse and read as part of the crown composition, not random props |
| Renderer, World Forge stop | 73 draw calls, 8.7k triangles (whole visible scene) |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.4 …".
