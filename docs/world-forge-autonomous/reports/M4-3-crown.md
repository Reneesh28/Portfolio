# Stage Report — M4.3 Crown and focal features

## Objective
The upper focal structure, without excess detail or clutter.

## Implemented
- `ForgeCrown.tsx`: the approved ring (same radius, tube, height and tilt) is now **8 stone segments with deliberate gaps** ("still being made").
  - Broken shard ends on every segment (instanced).
  - A thin, continuous **amber filament** inside the halo, visible through the gaps.
  - Three **struts** carry the halo on the pillar tips. They use the same pillar transform as `ForgeCore`, so they meet the real pillar tops.
- The crown is static (DEC-007).
- `forgeMaterials.ts`: `crownFilamentMaterial`, fogged, so from the Void it is a faint line rather than a second light source.
- `CROWN.segments` is re-laid so each pillar angle (0, ⅓, ⅔ turn) sits inside a segment.

## Validation
| Check | Result |
|---|---|
| `npm test` | 61/61 (new: crown gaps 0.015–0.04 turn; each pillar strut lands on stone) |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports | 0.12–0.27% of pixels changed by more than 3. The visible changes are the segment breaks and one strut inside the ring silhouette; the ring keeps its size, tilt and place in the gate. Reviewed with M4.9 |
| World Forge stop | Segmented halo, amber glints in the gaps, struts read; no clutter |
| Renderer, World Forge stop | 60 draw calls, 8.6k triangles (whole visible scene) |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.3 …".
