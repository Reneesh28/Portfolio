# Stage Report — M4.6 Materials, lighting and atmosphere

## Objective
The final material hierarchy, light sources, fog and depth, then a performance tune.

## Implemented
- **Material hierarchy** (`forgeMaterials.ts`):
  - dark base tier, a new mid-stone T2, lighter dais and cornices;
  - amber `forgeSeamMaterial` for the tier seams and plinth inlays (fogged).
- **Molten seam** (`ForgeCore`, `seamGeometry.ts`):
  - an unlit vertex-gradient core at the approved width (1.1/1.5), white-hot over most of its height and cooling toward the gateway's amber near the crown;
  - a soft additive glow shell around it (`ForgeAtmosphere`).
- **Core light:** one warm point light (650 cd, reach 70, decay 2). It warms the pillar faces and sentinels and is the only warm light in the world. Its reach can't touch the Void gateway (200+ units away).
- **Breathing:** the glow pulses gently on a 6 s cycle. Off under reduced motion.
- **Embers:** 320 on desktop and 110 on the low-power tier. They rise through the seam, fading in above the crucible and out below the crown, and are not mounted at all under reduced motion. Their motion is written into the geometry's own buffers.
- **Tier seams:** amber lines where T2 and T3 meet the tier below.
- **Plinth inlays:** amber inlays on the outward faces of the plinths.
- **World sky (DEC-002, resolved):**
  - `atmosphere/WorldSky.tsx` is a camera-centred gradient dome;
  - `atmosphere/voidFade.ts` holds the shared handover function, now also used by the Void glow (identical math, moved);
  - the sky's opacity is `1 − voidBackdropOpacity`, so it is invisible at the Void stop.

## Composition checks and fixes (Void opening)
1. The first pass made the seam thinner and amber toward the top, which weakened the opening's focal line. I restored the approved width and a hotter ramp.
2. A pixel profile across the seam (rows 470, 520 and 570, desktop) now shows the same 4–5 px width at brightness 229–255, against 225 before, with a faint warm halo beside it.
3. The Void comparison is identical with and without the sky, which proves the sky is invisible at the opening.

## Validation
| Check | Result |
|---|---|
| `npm test` | 66/66 (new `voidFade.test.ts`: opaque at the Void, complete handover, monotonic, the two always sum to one) |
| typecheck / lint | exit 0 |
| Void opening, 6 viewports | 0.41–0.77% of pixels changed by more than 3. The seam is a little brighter, with a soft warm halo; there are faint amber tier lines at the base and a lit edge on the pillars. The gateway, framing, glow and hero are unchanged. Reviewed with M4.9 |
| All 7 stops (1440×900) | The sky band reads at every non-Void stop and is brightest toward the Horizon. No seams or wedges |
| Renderer, World Forge stop | 82 draw calls, 9.6k triangles, 320 points, 11 shader programs |
| Console | 0 problems |

## Git checkpoint
Committed as "M4.6 …".
