# Phase Report — P2 Geography (floating archipelago)

## Objective
Replace the M3 single landmass with the blueprint's floating archipelago, hub and spokes (plan §4, DEC-010/011/016). Keep the locked region order, keep the journey working, and bring the approved P1 atmosphere into the live world.

## Implemented
- **`data/worldGeography.ts` (rewritten):** the single source of truth for the world and the future World Map.
  - The 7 regions in locked order: the World Forge island is the hub at the origin, and the others spiral clockwise from the Void (south).
    - Void at 0°, about 199 m out (it carries the current gateway rig until P4).
    - Origin Sanctum 48° / 470 m · Blueprint Archive 98° / 520 m.
    - Path of Ascension: 4 islands climbing to a summit at 162° / 600 m, height 95.
    - Worlds Beyond: the Convergence plus 6 territories at 212° / 640 m.
    - Horizon (farthest) at 268° / 700 m, with fragments drifting beyond it.
  - 17 islands with a biome colour per region (plan §3).
  - Golden routes: a spoke from the hub to every region, plus links within the Path of Ascension and the Worlds Beyond. The Sanctum and Archive spokes start exactly where the M4 Forge's paving ends.
- **`world/Archipelago.tsx`:** islands (P1 `FloatingIsland`), golden routes baked into one draw, and the Horizon fragments.
- **`world/RegionLandmarks.tsx`:** one simple silhouette per region (placeholders for M6–M8):
  - Sanctum: colonnade, obelisk and emerald crystal.
  - Archive: blue skyline.
  - Ascension: pale peaks and a summit beacon.
  - Convergence: standing stones and monolith, plus one landmark per territory.
  - Horizon: an unfinished gate.

  Stone is baked into one draw; glowing accents are baked per colour.
- **Live-world atmosphere (P1 look):** blueprint sky, cloud sea, violet haze (exponential fog), sky and cloud-bounce light, moonlight, and bloom. The camera's far plane went from 1,200 to 9,000 (near plane 0.5), and the dev renderer counter now totals every post-processing pass.
- **Camera:** the island stops use computed provisional framings (`islandFraming`: a three-quarter view from the hub side, scaled to the footprint). The World Forge keeps its M4 framing. The M4 arrival dip was removed: it no longer produces its reveal over the new heights. P5 designs the journey moves with the same per-segment mechanism.
- **Removed:**
  - the M3 world files (`CentralLandmass`, `Plateau`, `outline`, `FloatingTerritories`, `WorldPaths`, `RegionBlockouts`, `InstancedSet`);
  - the Void-only sky handover (`WorldSky`, `voidFade` and its test) and the Void's flat horizon glow, which the blueprint sky replaces.

  All are recoverable from git history.

## Interim states (rebuilt in later phases)
- **The Void opening** has changed. Its gateway rig is M2's, but it now stands on the Void island under the blueprint sky, and golden routes are visible in the distance. **P4** rebuilds the Void.
- **The Forge** is still M4's stone crucible on the hub island. **P3** rebuilds it as the golden spire city.
- **Every framing except the Forge** is provisional. **P5** sets the final route and framings, and adds the World Map and quick bar.

## Validation
| Check | Result |
|---|---|
| `npm test` | **73/73**. New `archipelago.test.ts` covers locked order and names, hub at the origin, clockwise spiral, the Horizon farthest, islands separate with tops above the clouds and deep spiky rock, the Convergence plus 6, the climbing Ascension, spokes to every region, routes ending on islands, and the Void rig and Forge on their islands. Path tests now check no flight through island rock or landmarks and the camera above the clouds; the arrival-arc test now checks the mechanism |
| typecheck / lint / build | exit 0. Main chunk 441.87 kB (+0.6 kB); WorldCanvas chunk 927.98 kB (+19.6 kB) |
| Real-input regression (M1 suites) | **70/70 in two runs**. The probe harness was corrected to stamp one gesture's wheel events exactly `gap` apart; it had let dispatch delays leak in as fake gesture gaps |
| All 7 stops, 1440×900 and 390×844 | Every island is framed; transitions are clean; the return to the Void is exact |
| Renderer (whole scene, dev counters across all passes) | Void stop 128 draws / 30k triangles · Forge stop 67 / 28k · Archive stop 25 / 13k |
| Classic | Pixel-identical, 8/8 sections |
| Dev handle and look-dev page in production | 0 references |
| Console | 0 problems |

Review images: `p2-review/p2-all-stops-desktop.jpg` and `p2-review/p2-all-stops-mobile.jpg`.

## Known gaps
- The Void opening is in an interim state until P4, as listed above.
- The island rock still reads darker than in the images. This carries over from P1.
- **No real-GPU check.** Bloom and the full-screen cloud shaders are the heaviest new cost. P5 adds quality presets.

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly (DEC-016).

## Decisions for you
1. **Approve P2** (the archipelago layout, scale, island looks and golden routes), or list changes. For example: distances, which way regions face, island sizes, route style.
2. **The interim Void:** acceptable until P4?
3. **Commit permission** (still open).
