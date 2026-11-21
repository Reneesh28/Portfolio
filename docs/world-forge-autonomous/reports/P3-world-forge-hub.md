# Phase Report — P3 The World Forge (golden spire-city hub)

## Objective
Rebuild the World Forge as the blueprint's golden spire-city hub to the images' specs (plan §2, §9; DEC-010/016/018): about 400 m overall, a 180 m main platform, a core of about 320 m, 3 levels, 7 gates, observation rings, archive halls and a Projects terrace with 8 plinths.

## Implemented
- **`regions/forge/hubLayout.ts`:** pure layout:
  - stepped terraces (platform to city floor), the city, the observation rings and the Forge Core;
  - the **7 gates** (6 region gates, each on its golden spoke, plus the Projects gate);
  - archive halls, the **Projects terrace with 8 plinths** (8 projects including Chronoshift), the waterfalls, the device quality tier, and the arrival activation envelope (kept from M4.7).
- **`SpireCity.tsx`:** the golden cathedral city on three terraces.
  - Six rings of hexagonal towers with tall roofs rise to the **central spire (about 342 m above the island)**, with lit window strips, gold tips and low halls.
  - Baked into 3 draws.
- **`ForgeCore.tsx`:**
  - the **Forge Core**: a white-gold beam rising from the spire into the sky inside a golden glow, plus an energy glow around the spire's base;
  - the **observation rings** (level 3), turning very slowly;
  - rising embers and the warm core light;
  - a slow breathing pulse, and a **one-time swell on arrival**.

  Everything is still under reduced motion.
- **`HubGates.tsx`:** the 7 gates (pillars with glowing inner edges, lintel, arch, and a keystone crystal in the colour of the region each gate leads to), **6 archive halls** with lit slits, and golden inlays (a radial line from the platform to every gate, plus rings at the platform and gate lines).
- **`ProjectsTerrace.tsx`:** a raised terrace with 8 empty plinths, amber inlays (no pictures, DEC-015), and a golden path to the platform.
- **`ForgeRegion.tsx`:** composes everything, plus 3 waterfalls off the far edge of the island.
- **Geography (DEC-018):** hub island radius 100 → 210 (`HUB`); golden spokes now start at the gates (`gateToward`). The **Void moved from about 200 m to about 420 m** (`FORGE_Z` −420), and the Void island moved with it. The opening pose still equals the rig's pose (tested at 7 viewports).
- **Camera:** a provisional hub framing showing the whole city from outside the Projects gate, plus a narrow-screen variant. P5 sets the final framing and the space for the M5 panel.
- **Retired:** the M4 stone-crucible Forge (`ForgeCore`/`Crown`/`Orbit`/`Terraces`/`Foundation`/`Atmosphere`, `forgeLayout`, `forgeMaterials`, `seamGeometry`, `forgeLayout.test`) and the unused Void backdrop constants. `mergeStatic` moved to `core/` as a shared helper. All of it is recoverable from git history.

## Interim state
- **The Void opening.** The old gateway now frames a giant golden city about 440 m away, with an observation ring overhead. That's the real scale, and it's strong but busy. **P4** rebuilds the Void (portal ring, arrival platform, floating ruins) and composes the opening against the new hub.

## Validation
| Check | Result |
|---|---|
| `npm test` | **66/66**. New `hub.test.ts` covers the images' specs (180 m platform, core 320–360 m, 3 terraces, rings around the city), 7 gates each starting its spoke, gates spaced and on the island, halls clear of gates and terrace, 8 plinths on the terrace and spaced, waterfalls away from the arrival, activation and quality. The archipelago and path tests are updated for the new hub and Void distances (no flight through the city or the ring band) |
| typecheck / lint / build | exit 0. Main chunk 442.02 kB; WorldCanvas chunk 927.07 kB |
| Real-input regression (M1 suites) | **70/70**, 0 console problems |
| All 7 stops, 1440×900 and 390×844 | Every island is framed; the hub is fully in frame on both |
| Renderer (whole scene) | Void stop 133 draws / 40k triangles · Forge stop 79 / 40k (390 px: 119 / 37k) |
| Classic | Pixel-identical, 8/8 sections |
| Dev handle and look-dev page in production | 0 references |

Review images in `p3-review/`:
- `p3-forge-desktop.jpg`
- `p3-forge-mobile.jpg`
- `p3-interim-void-desktop.jpg`
- `p3-all-stops-desktop.jpg`

## Known gaps
- **The central spire's top** is a plain tall cone. The images show more ornate spire crowns. It can be refined if you want.
- **Fine detail:** the city's architectural detail (arches, buttresses, statues) is stylised. Sourced models would need your approval.
- **No real-GPU check.** Quality presets come in P5.

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly (DEC-016/018).

## Decisions for you
1. **Approve P3** (the golden spire-city hub), or list changes: city density or height, gate style, ring size or brightness, beam strength, Projects terrace position.
2. **Commit permission** (still open).
