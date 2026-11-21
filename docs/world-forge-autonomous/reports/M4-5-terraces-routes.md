# Stage Report — M4.5 Terraces and routes

## Objective
Layered platform and terrain detail, plus the route connection. No arbitrary floating slabs.

## Implemented
- `ForgeTerraces.tsx` plus layout data (`stairCheeks`, `parapetSegments`, `PARAPET`, `FORECOURT`, `pavePath`, `connectionEnds`):
  - **Stair cheek walls** up both sides of every flight. They are pitched to the flight and their lower ends run into the ground or terrace below.
  - **T1 parapet** along the rim, with openings where both stairs arrive.
  - **Monument plinths:** two-step bases (dark base, lighter top) at the 7 reserved sites. Empty: the monuments themselves belong to M5.
  - **Forecourt:** a paved apron at the foot of the grand stair.
  - **Route connection:** M3-style paving (same slab size, spacing and occasional missing slab) from the `sanctum-forge` route end [38, 0, 31] to the forecourt, and from the east stair foot to the `forge-archive` start [46, 0, −14].
- The M3 route data (`WORLD_ROUTES`) is untouched (DEC-008).
- The rubble skirt keeps a wider berth around the forecourt.

## Validation
| Check | Result |
|---|---|
| `npm test` | 63/63. New tests: the paths join the M3 route ends exactly and keep off the foundation; the parapet opens at each arriving stair; cheeks clear the plinths. Existing tests cover solid steps and plinth and buttress clearance |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports | 0.18–0.36% of pixels changed by more than 3. Terrace detail at the Forge base barely reads through the fog. Reviewed with M4.9 |
| World Forge stop and Sanctum arrival | The Sanctum avenue visibly leads into the forecourt and the grand stair; the east path joins the Archive avenue |
| Renderer, World Forge stop | 77 draw calls, 9.2k triangles (whole visible scene) |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.5 …".
