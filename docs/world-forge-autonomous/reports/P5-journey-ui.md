# Phase Report — P5 Journey and UI

## Objective
The final camera route (reveal, Forge approach, overview, dives), framings for every island on desktop and phone, quality presets, the World Map and the quick bar (plan §5–§7; DEC-016/020).

**Note:** after an interrupted session, the working tree was found rewound to the end of P4. The first P5 implementation was lost and has been re-applied in full from that point (DEC-020).

## Implemented
- **Journey moves** (`camera/journeyPath.ts`, `camera/cameraTargets.ts`, `CameraRig`):
  - **Reveal:** leaving the Void, the camera rises over the portal (arc 0.32) and looks toward the hub mid-flight, so the archipelago and the golden Forge spread out below.
  - **Overview:** leaving the Forge, it climbs higher (arc 0.42) and looks back over the hub before diving to the Archive.
  - This adds an optional per-segment look-at bias; every stop is still exact.
- **Final framings:**
  - **The World Forge:** the city sits left of centre, and the right ≈ 40% stays clear for the M5 dossier.
  - **Every island:** a three-quarter view from the hub side.
  - **Phones and tablets:** a narrow framing for every island (pulled back and higher, fixed horizontal coverage); the Forge is centred there.
- **Quality presets** (`core/quality.ts`, `core/QualityGovernor.tsx`, `WorldCanvas`, `WorldScene`, `CloudSea`, `ForgeRegion`):
  - **Tiers:** High / Medium / Low. Medium caps the pixel ratio at 1.25 and halves the embers; Low uses pixel ratio 1, no bloom, 2 cloud sheets and a quarter of the embers.
  - **Starting tier:** from device hints (screen, memory, cores, touch).
  - **Automatic step-down:** at most twice, when the median frame time stays above 25 ms. Not used under reduced motion.
  - **`?quality=high|medium|low`** locks a tier for testing and review. The canvas exposes `data-quality`.
- **World Map** (`ui/WorldMap.tsx`, `ui/mapLayout.ts`):
  - a north-up, true-proportion map drawn from the same geography (islands in their region colours, golden routes, the hub glowing, "you are here");
  - a modal dialog: focus moves to the current region and stays inside, Escape or the close button closes it, choosing a region travels there, scroll is blocked while it's open, and focus returns to the map button;
  - phone labels show the number only (screen readers hear the name and role), with 44 px targets.
- **Quick bar** (`ui/JourneyNav.tsx`, CSS): after the region button, in the same order visually and by keyboard: **Return to the Void · World Map · The World Forge**. The map renders into the World Forge root through a portal, because the nav is transformed.

## Validation
| Check | Result |
|---|---|
| `npm test` | **78/78**. New tests: reveal above 150 m and overview above 220 m, with the overview looking back over the hub and stops exact; the Forge city left of the dossier space; every island framed at 1440×900, 390×844 and 820×1180; quality tiers ordered, device-hint rules, `?quality=` lock, the step-down rule (sustained, not spikes); the map inside its bounds at two aspects, north up and in true proportion. The continuity test is now scaled to the world (jumps, not long legs) |
| typecheck / lint / build | exit 0. Main chunk 446.55 kB (+4.5 kB, map UI); WorldCanvas chunk 932.78 kB |
| World Map and quick bar (real input, 1440 and 390) | **21/21**: quick-bar order, modal dialog, focus to the current region, 44 px phone targets, scroll blocked, Escape closes and restores focus, map travel, the Forge and Void buttons, no overflow, 0 console errors |
| Real-input regression (M1 suites) | **70/70 in two consecutive runs.** The nav-centre check now verifies that the whole bar is centred, since the toggle leads it. One earlier run had a single intermittent failure (scroll arriving after a direct navigation ended). It didn't reproduce in 4 targeted reruns or the 2 full runs, so its cause isn't proven; likely dispatch timing under software rendering |
| Moves and stops (High tier locked), all phone stops | The reveal and overview read as designed; every island is framed. Long region names wrap to two lines in the phone toggle |
| Classic | Pixel-identical |
| Dev handle and look-dev page in production | 0 references |

Review images in `p5-review/`:
- `p5-reveal-overview-forge.jpg` (mid-reveal 0.3/0.5/0.7, the Forge, mid-overview 2.35/2.5/2.7, settled)
- `p5-all-stops-mobile.jpg`
- `p5-world-map-desktop.jpg` and `p5-world-map-mobile.jpg`

## Known gaps
- **Both flights pass close to the city at about 70%:** a dramatic fly-past. I can push them wider if you prefer.
- **The quality governor was only checked in headless software rendering.** Real-GPU behaviour is unverified.
- **Still open:** controls fading when idle, the display font, the minimap and audio (deferred by the plan).

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly.

## Decisions for you
1. **Approve P5** (journey moves, framings, quality, map, quick bar), or list changes.
2. **Commit permission** (still open). Everything since `105812c`, which is P1–P5, is uncommitted. The rewind shows how fragile that is.
