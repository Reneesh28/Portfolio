# Phase Report — P1 Look development (blueprint reconciliation)

## Objective
Establish the blueprint look (DEC-010) in one small scene for your review, before any phase rebuilds the real world (plan §9, DEC-016).

## Built (development only, not in production)
Open it with `npm run dev`, then go to **`http://localhost:5173/?lookdev`**. The buttons switch between three views: 1 Establishing, 2 Forge hub, 3 Island edge. "Glow" toggles bloom.
- `look/palette.ts`: the **blueprint palette**: indigo-to-violet sky, violet cloud sea, slate stone, Forge gold, portal violet, water, and the region accents from plan §3. Every later phase takes its colours from here.
- `look/BlueprintSky.tsx`: sky dome with a violet horizon glow, stars and a pale moon.
- `look/CloudSea.tsx`: three layered, slowly drifting cloud sheets that melt into the horizon. Still under reduced motion.
- `look/islandGeometry.ts` and `look/FloatingIsland.tsx`: procedural floating islands with rugged cliff sides, jagged hanging rock and stalactite shards. Seeded and crack-free.
- `look/SpireCluster.tsx`: the **golden spire-city** test silhouette:
  - stepped terraces;
  - rings of hexagonal towers with spires, rising to a massive central tower;
  - lit window strips and gold tips;
  - the Forge Core beam (white-gold core inside a golden glow);
  - two tilted golden halo rings and an inlaid gold ring;
  - one warm light.

  Static parts are baked per material.
- `look/Waterfall.tsx`: water ribbons falling from island edges into the clouds.
- `look/Bloom.tsx`: glow, using three.js's own post-processing passes (part of the installed `three` package; no new dependency).
- `lookdev/LookDevScene.tsx` and `lookdev/LookDev.tsx`:
  - the hub island with the spire city;
  - an emerald island (Origin Sanctum's proposed look);
  - a golden route between them;
  - floating fragments;
  - two rings of distant mountains;
  - cloud-bounce lighting.
- `mode.ts` (`lookDevView`) and a dev-only branch in `WorldForge.tsx`. Production compiles the look-dev page away.

## Iterations (agent visual inspection against the three images)
1. **First pass.** The palette and clouds were right. The spires read as thin needles, the islands as smooth pucks, the mountains as plain pyramids, the moon was oversized and the beam greyish.
2. **Second pass.** Fixed all five:
   - cathedral towers on terraces with a city mass;
   - rugged rock with no cracks;
   - layered jagged ranges;
   - a smaller moon;
   - a white-gold beam with a golden glow.
3. **Third pass.** Added violet bounce light from the cloud sea, and lightened the far ranges for depth.

## Known gaps (for your review)
- **Rock undersides** are still darker than in the images, where they are lit violet and gold.
- **The mountains** are clean low-poly cones. The images show craggier, mistier ranges.
- **Painted detail** (hundreds of fine spires, arches, foliage) isn't reproduced one-to-one. This is a stylised real-time version (plan §10). Sourced assets would close more of the gap, but need your approval (decision 6, currently procedural only).
- **No real-GPU check.** This was checked only in headless software rendering; frame rate on real hardware is unverified.

## Validation
| Check | Result |
|---|---|
| `npm test` | 70/70 |
| typecheck / lint / build | exit 0 |
| Look-dev page in production bundle | 0 references (dev only) |
| The live world (`/`) | Unchanged in this phase |
| Console (look-dev, 3 views × 2 viewports) | 0 problems |

Review images: `p1-review/p1-view1-desktop.jpg`, `p1-view2-desktop.jpg`, `p1-view3-desktop.jpg` and `p1-view1-mobile.jpg`.

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly (DEC-016).

## Decisions for you
1. **Approve the P1 look as the direction for P2–P5,** or list changes: palette, cloud brightness, gold intensity, the spire city's shape, island rock, mountains, glow strength.
2. **Rock undersides and mountains:** acceptable to refine during P2, or fix them now before P1 is approved?
3. Still open from the plan: the cloaked figure, asset sourcing, Chronoshift content, updating docs 02/06, and **commit permission**.
