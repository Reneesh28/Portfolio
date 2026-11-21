# Blueprint Reconciliation Plan

Status: **PROPOSED, waiting on owner approval.** No code changes until approved (DEC-014).
Date: 2026-11-21 · Basis: DEC-010 to DEC-015, the three blueprint images in the project root, and the governing docs where the images don't override them.

## 1. What changes and what stays
| Kept (locked or engineering foundation) | Changed toward the blueprint images |
|---|---|
| Identity text, tagline, hero copy, closing lines (doc 02) | The world's look: palette, sky, clouds, materials |
| Region names and order (DEC-011) | Geography: one landmass becomes a floating archipelago |
| No free roam; scroll journey plus direct navigation; input priority | The Void: stone gateway becomes a purple portal realm |
| Journey store, single camera controller, input handling, reduced motion, tests | The World Forge: stone crucible becomes the golden spire-city hub |
| Bottom-centre navigation (master doc) | Camera route and framings (reveal, approach, overview, dive) |
| Projects as monuments at the Forge, no pictures (DEC-012, DEC-015) | Navigation UI: adds the World Map and a quick bar |
| Classic at `?mode=classic`; World Forge default | Quality presets per device (from the images) |
| Content rules (doc 11), asset policy (doc 12), audio off by default | |

## 2. Visual target (synthesised from the three images)
- **World:** floating islands with jagged rock undersides above a sea of violet clouds. Waterfalls fall from island edges into the clouds. Distant mountain silhouettes. Glowing golden routes and bridges link the islands.
- **Palette:**
  - **Sky:** deep indigo to violet, with purple light and a moon or star glow.
  - **Hub:** gold and amber.
  - **Regions:** each has its own accent (table in §3).
  - **Stone:** dark slate, lit by its region's colour.
- **The Void:**
  - a glowing purple **portal ring** (about 24 m) standing on an **arrival platform** (about 60 m);
  - **floating ruins** and broken pillars around it, and a purple void horizon;
  - optionally, a cloaked figure seen from behind, facing the portal (decision 4).
- **The World Forge (central hub):**
  - a golden **cathedral city of spires** with the **Forge Core** beam rising from its centre and a **central spire** as the world axis;
  - golden **halo / observation rings**, and **7 region gates** placed radially;
  - archive halls, on **3 levels** (platform, forge, observation);
  - reference specs: total diameter about 400 m, core height about 320 m, main platform about 180 m.
- **Atmosphere:** layered fog and cloud, drifting particles, rim light. The Forge's gold is the brightest thing in the world.

## 3. Locked regions mapped onto the blueprint biomes (proposal, decision 2)
| Locked region | Role | Proposed blueprint look (source in the images) |
|---|---|---|
| 00 THE VOID | Entry and identity | Purple portal realm (all three images) |
| 01 ORIGIN SANCTUM | About | Verdant, emerald island with waterfalls and a quiet sanctum ("Verdant Expanse: About / Journey") |
| 02 THE WORLD FORGE | Projects | Golden spire-city hub (all three images) |
| 03 BLUEPRINT ARCHIVE | Skills | Blue, crystalline tech archive ("Frosthold: Skills / Tech", "Aether Cliffs: Development") |
| 04 PATH OF ASCENSION | Experience, education, leadership | Snow-capped rising peaks, a path climbing upward ("Aether Peaks: Exploration / Vision") |
| 05 WORLDS BEYOND | Interests (Convergence plus six zones) | A cluster of small islands with six distinct biomes drawn from the remaining image looks: ember/crimson, temporal/purple, sunken ruins, dunes, steel/industrial, shadow depths. The final six follow the interest content audit (M7) |
| 06 HORIZON | Ambitions and contact | Celestial gold-blue heights, the farthest and highest island ("Celestial Heights: Future, Goals") |

## 4. Geography (M3 redo)
- **Hub and spokes:** the Forge island sits at the centre. The Void's portal island lies to the south, the arrival side. The other regions circle the hub in locked order, linked by golden routes.
- **Scale follows the images:**
  - the Forge island is about 180 m across at its main platform and about 400 m overall;
  - region islands are about 100–200 m across, set about 400–700 m from the hub.

  The camera range, fog and quality presets scale with this.
- The **World Map** data (positions, routes, names) comes from the same geography file. One source of truth serves both the 3D world and the map.

## 5. Camera journey (M1 retune)
The images' flow is Void → reveal → Forge → overview → region. The locked order puts Origin Sanctum before the Forge, so the plan keeps that order and places the images' moments on the transitions:
1. **Void:** in front of the portal, with the hero text.
2. **Reveal:** leaving the Void, the camera rises through or over the portal, and the archipelago and the golden Forge appear below in the distance.
3. **Origin Sanctum:** arrival.
4. **World Forge:** approach and settle (the projects are here).
5. **Overview pan:** leaving the Forge, the camera rises and pans across the whole archipelago before diving to the Blueprint Archive.
6. **Path of Ascension**, **Worlds Beyond** and **Horizon** follow in order, each a dive to its island.

Direct navigation (the bottom menu and the World Map) can reach any region at any time. Reduced motion uses short moves, with no pan or reveal sweep.

## 6. Interface (from the images, within the locked bottom-centre placement)
- **Bottom-centre quick bar:** the current-region button plus icons for Void (home), World Map and Projects (Forge).
- **World Map:** an illustrated overlay of the archipelago. Choosing an island travels there.
- **Kept:** the scroll hint and the project dossier panel (M5).
- **Deferred:** the minimap/compass (the map covers it) and the audio toggle (no audio exists; audio stays off by default).

## 7. Performance and quality (from the images)
- **Presets:** High, Medium and Low, chosen from a device capability check. The pixel ratio is capped, distant islands use LOD, and repeats use instancing.
- **Targets:** 60 fps on desktop, 30 fps on mobile, initial load under 5 s.
- **Reference budget:** under 2,000 draw calls (from the images). I'll aim far lower, using the M4 merge pipeline.
- **No new libraries:** GSAP and Zustand appear in the images but aren't needed, because the existing store and camera already handle this.

## 8. Asset approach (decision 6)
The images are painted concepts.
- **Default, procedural:** island rock forms, instanced spire clusters, shader cloud sea, waterfalls and portal ring. No downloads.
- **Optional, sourced:** CC0 or clearly licensed models (for example Kenney, Quaternius or Poly Haven) for ruins and architecture detail. I list candidates with licences first and download nothing without your approval. Each would be recorded in an asset register (doc 12).

## 9. Sequence (each phase ends with your visual review)
| Phase | Work | Why this order |
|---|---|---|
| P1 Look development | Palette, sky, violet cloud sea, lighting, one test island with a spire silhouette | Sets the look every later phase uses |
| P2 Geography (M3) | The archipelago in hub-and-spoke layout, golden routes, map data, all regions as island blockouts | The Forge and Void are placed by the geography |
| P3 World Forge (M4) | Golden spire-city hub to the image specs, with 7 gates, rings, core beam, 3 levels, and a Projects terrace with 8 plinths | The centrepiece, seen from everywhere |
| P4 The Void (M2) | Portal realm, platform, floating ruins, hero text, the reveal toward the Forge | The opening frames the Forge, so it comes after the Forge |
| P5 Journey and UI (M1) | Camera route (reveal, approach, overview, dives), framings for every island, mobile framings, quality presets, World Map, quick bar | Needs every place to exist first |
| P6 M5 resumes | 8 monuments (Forged Works), text-only dossiers | Depends on the new Forge |

The M1 engineering core is reused throughout. The tests are kept and extended at each phase.

## 10. Risks
- **Painted detail.** The images' painted detail can't be matched one-to-one in real time. The aim is a faithful stylised version. Sourced assets (decision 6) close more of the gap.
- **Scale.** A world several times larger means more geometry and longer camera moves. Quality presets and LOD handle the geometry, and travel pacing will be re-tuned.
- **Doc 02's written palette** still says "dark/cold, restrained". DEC-010 overrides it, but the docs themselves are unchanged (decision 8).

## 11. Decisions requested
1. Approve this plan and its sequence (P1 → P6).
2. Approve the region-to-biome mapping in §3, or change any row.
3. The journey: the reveal on leaving the Void, and the overview pan after the Forge, with the locked order kept (§5).
4. The Void: include the cloaked figure? And should there be a short intro? My recommendation is at most about 4 s, skippable, and none under reduced motion, instead of the images' 15 s.
5. The interface: build the quick bar and World Map in P5, deferring the minimap and audio (§6)?
6. Assets: procedural only, or may I search for CC0 or licensed models and present candidates first (§8)?
7. Chronoshift: please supply its description, tech stack, status and links (DEC-013).
8. Governing docs: should I update docs 02 and 06 to match DEC-010 and DEC-011, or keep the overrides only in DECISIONS.md?
9. Commits: may I commit at each approved phase? You haven't given this explicitly yet.
