# Stage Report — M4.1 Blockout and silhouette

## Objective
Base structure, main silhouette, proportions and spatial placement for the approved direction (DEC-007), with placeholder materials only. Validate camera views.

## Implemented
- New module `src/world-forge/regions/forge/`:
  - `forgeLayout.ts`: pure layout in the Forge's local frame (approved yaw), covering tiers, core, crown, beam, sentinels, orbit fragments, stair flights, plinth sites, route ends, forecourt and quality tier.
  - `ForgeRegion` composes the layers: `ForgeFoundation`, `ForgeCore`, `ForgeCrown`, `ForgeOrbit`, `ForgeTerraces`.
- Silhouette parts keep the approved envelope exactly: tier radii and heights, pillar placement and lean, crown ring, sentinels, light column.
- Blocked in:
  - the south grand stair (3 flights, facing world −9.5°, toward the Void);
  - the east stair (2 flights, facing world 125.5°, toward the Archive);
  - 7 plinth sites on the T1 ring (DEC-008).
- Retired `regions/void/DistantForge.tsx`. `WorldGeography` no longer mounts the Forge; `WorldScene` mounts `ForgeRegion`. Two comments updated.
- Development only: `core/DevRenderStats.tsx` publishes renderer counters on `window.__worldForge.render` for performance budgets (DEC-005 handle extended).

## Validation
| Check | Result |
|---|---|
| `npm test` | 58/58 (new `forgeLayout.test.ts`: frames, envelope, stair orientation, solid even steps, plinth clearance, ward containment, orbit limits) |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports vs the `dd349d0` baseline | 0.04–0.08% of pixels changed by more than 3, almost none by more than 24. The changes are the plinth tops and stair edges at the Forge base, which barely read through the fog |
| Forge views (1440×900, 390×844) | Stairs and plinths read correctly from the World Forge stop and in the Sanctum arrival frames |
| Renderer, World Forge stop | 33 draw calls, 5.4k triangles for the whole visible scene |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.1 …".
