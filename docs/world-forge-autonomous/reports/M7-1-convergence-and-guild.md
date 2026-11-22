# M7 report (part 1): the Convergence and The Guild — review stop

Date: 2026-11-22. Branch `the-world-forge`. Decision: DEC-032.
Status: **the Convergence and the representative territory (The Guild) are built and QA'd. Waiting on your review.** This combines doc 16's M7.4 hub lock and M7.7 visual-language lock into one stop, as DEC-032 records. The other five territories come after it.

## What you'll see
- **The Convergence.** The camera settles above the Worlds Beyond from the hub side: the central island with a round stone plaza and **six gates** on its edge, each facing its territory's island, around a **compass monolith** whose six coloured strips point at the gates.
  - Each gate carries its territory's colour on its arch line and a keystone light.
  - A territory that can be visited has a bright gate; the others stay dim until built.
  - The P2 standing stones and monolith are gone.
- **The Convergence card** lists the worlds that can be visited now: **The Guild** only. The other five appear as they're built. Story-driven Games also needs text from you.
- **The Guild (AniCos)**, recoloured warm amber, is a courtyard facing the Convergence with the master doc's four sub-landmarks:
  - **Hall**: a gabled hall with a lit doorway and windows;
  - **Chronicle**: a long wall with three bands of light (the journey);
  - **Assembly**: a ring of eight seats around a low round stone (leadership);
  - **Stage**: a raised platform with a lit frame (events).

  Warm lanterns stand at the courtyard's corners.
- **Choosing The Guild** (from the card, its gate, or the courtyard in 3D) flies the camera to it. The panel shows:

  | Section | Text |
  |---|---|
  | Hall | AniCos Student Organization |
  | Chronicle | Volunteer → Board Member → Co-CEO, over two years. |
  | Assembly | Leading 50+ members. |
  | Stage | CosCon 2.0 · Spooky Nights 2.0 |

  "Return to the Convergence" (or ✕, Escape, or tapping the dimmed world) brings the camera back.
- **Optional, as the master doc asks:** scrolling continues to the Horizon at any time, and the bottom navigation and World Map work over the panel. There are no collectibles, completion marks or mini-games.

## Your content, ready for the next territories (DEC-032)
| Territory | Text |
|---|---|
| Anime & Manga | One Piece |
| Formula 1 | "It's not over until it's over." · The Max Verstappen mentality. |
| Gaming & Content Creation | Void Ronin · void_ronin.exe on Instagram (shown as given; not fetched) |
| The Training Grounds | "A king never wavers. A king never bends. A king never relies on others. A king never gives up." (placed here because it came last; tell me if it belongs elsewhere) |
| Story-driven Games | **no text yet**: it stays closed until you send some |

## Checks
| Check | Result |
|---|---|
| Unit tests | **138/138**. New: budget and ranges, six gates on the plaza edge each facing its own island, everything compact, The Guild on its island, the Convergence and all six territories framed at six sizes, The Guild's focus (left of centre on wide screens, above the sheet on narrow ones), no focus for unbuilt territories, the six interests and only open ones listed, the owner's words used (not "Amarok"; Co-CEO only), panel state. |
| Typecheck · lint · production build | clean · 0 problems · built |
| Production bundle | no dev handle, probe helper, LookDev or DRAFT note |
| M7 probe, high quality (4 sizes) | **81/81**. Covers: no card during travel; the card listing only what can be visited; 44 px targets; nav clearance; no overflow; the camera settling on The Guild; its four sections and facts; focus on the heading; previous/next disabled with one territory; scroll blocked; panel clearance and target sizes; "Return to the Convergence" bringing the camera and focus back; Escape; 3D hover and click; tapping the dimmed world; the bottom navigation over the open panel; refusal away from the Worlds Beyond; reduced motion; console clean. |
| M7 probe, low quality | **81/81** |
| Regression | M6.3 Path 105/105 (with its new portrait framing) · M6.2 Archive 105/105 · M6.1 Sanctum 105/105 · M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) · World Map 21/21 · input 70/70 |
| Classic `?mode=classic` | pixel-identical to the M6.3 capture (Δ 0); no file outside `src/world-forge/` changed |

**Render cost at the Convergence** (scene totals): high quality, desktop 44 draw calls (21k triangles), phone 45, landscape phone 44, tablet 46; low quality 28 on desktop. The Convergence and The Guild add 2 baked meshes; removing The Guild's P2 accent saves 1.

## Changes made along the way
- **Gates.** From the settled distance, the gates' coloured lines were too thin to read. The arch lines are now thicker, and each gate has a keystone light.
- **Phone framing:**
  - The Worlds Beyond's portrait view first clipped one territory, so it now stands further back.
  - The Path's portrait view (M6.3) looked across the climb from 470 m out, which put its camera about 130 m from the hub. With the new Worlds Beyond view, the journey between them then crossed the Forge's spire city (caught by the journey test). The Path's portrait view now looks up the climb almost end-on: the islands stack upward, and the camera stays 363 m from the hub. Desktop is unchanged.

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- From the settled distance the gates are small; the keystones and the plaza carry them. Choosing a territory brings it close.
- The five unbuilt territories still show their P2 blockout landmarks.

## Files
- New:
  - `content/interests.ts`
  - `regions/beyond/beyondLayout.ts`, `beyondGeometry.ts`, `BeyondRegion.tsx`
  - `ui/BeyondPanel.tsx`
  - `tests/world-forge/beyond.test.ts`
- Changed:
  - `camera/cameraTargets.ts` (Worlds Beyond framing, territory focus, the Path's portrait framing)
  - `camera/CameraRig.tsx`
  - `experience/experienceStore.ts`
  - `core/WorldScene.tsx`, `world/RegionLandmarks.tsx`
  - `data/worldGeography.ts` (The Guild's island colours)
  - `WorldForge.tsx`, `WorldForge.css`
  - tests `experienceStore.test.ts`, `journeyPath.test.ts`

## For your review
Please look at `m7-review/` (`m7-convergence-desktop.jpg`, `m7-guild-desktop.jpg`, `m7-guild-phone.jpg`, `m7-convergence-phone.jpg`, `m7-convergence-landscape-phone.jpg`, `m7-guild-tablet.jpg`) and confirm, or redirect:
1. **the Convergence:** the plaza, six gates and compass monolith;
2. **The Guild's look:** this sets the visual language for the other territories (one island, one landmark, the shared stone with lit edges in the territory's colour, a warm or coloured light set);
3. **the interaction:** card → fly to the territory → panel → return.

On your go-ahead, I'll build the other four territories that have text (Anime & Manga, Formula 1, Gaming & Content Creation, The Training Grounds), each in its own stage. Story-driven Games follows once you send its text.
