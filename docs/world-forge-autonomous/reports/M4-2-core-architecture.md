# Stage Report — M4.2 Core architecture

## Objective
The main central structure and coherent structural relationships. Validate distances and composition.

## Implemented
- **Pillars** (`ForgeCore.tsx`):
  - each fractured pillar is now a group with the approved tapered shaft;
  - two bracing bands (`PILLAR_BANDS`);
  - a split shard at the top, so the pillars read as broken rather than pointed;
  - a foot block seated on the dais.
- **Crucible:** a low octagonal basin on the dais that the seam rises from.
- **Foundation** (`ForgeFoundation.tsx`):
  - cut-stone cornices capping each tier, lifted 0.04 above the tier top to avoid depth fighting;
  - stepped buttresses at the T1/T2 vertices (instanced);
  - a seeded rubble skirt around the T1 base, kept off both stairs (instanced).
- Layout data in `forgeLayout.ts`: `pillarRadiusAt`, `PILLAR_BANDS`, `CRUCIBLE`, `CORNICE`, `buttresses()`, `rubbleSkirt()`.

## Composition check and fix
In the first pass, the front pillar's foot block and the crucible hid about 8 px of the seam's glowing foot in the Void opening. I lowered them (foot block top 0.5 above the dais, crucible 0.5 tall) and re-checked: the seam's foot now reads as it did before.

## Validation
| Check | Result |
|---|---|
| `npm test` | 60/60 (new: buttresses and rubble clear of every flight; crucible and pillar relationships) |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports | 0.10–0.23% of pixels changed by more than 3. The visible changes are the fractured pillar tips just above the crown ring and faint bracing bands. Composition, seam, ring and gateway framing are unchanged. Reviewed with M4.9 |
| World Forge stop | Buttressed tiers, cornices, rubble and banded pillars read as one structure |
| Renderer, World Forge stop | 51 draw calls, 8.0k triangles for the whole visible scene |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.2 …".
