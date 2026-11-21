# M6.1 report: The Origin Sanctum ("The Quiet Court")

Date: 2026-11-22.
Branch: `the-world-forge`, committed stage by stage. Decisions: DEC-025 (content source) and DEC-026 (design approved).
Status: **M6.1 stages 3–8 done; QA done. Waiting on your M6.1 lock.**

## What you'll see
- **Arrival.** After the reveal, the camera settles on the island's outer side and looks back across the Sanctum toward the hub. The golden Forge fills the horizon behind the court.
- **The island.**
  - Grassy terraces step up to a pale stone court, ringed by weathered pillars: two broken short, three carrying lintels.
  - A still pool sits at the centre, with an emerald rim of light. Faint motes rise from it.
  - A broken halo hangs overhead and drifts slowly. Moss mounds and small pines cover the open ground.
- **Three identity fragments** float on platforms around the court, each joined to it by stepping stones:
  - **The Engineer** (left): three nested rings around a cube core.
  - **The Creator** (right): an arch with a glowing crystal shard half-assembled inside it.
  - **The Explorer** (far side, tallest): a lantern mast whose pointer slowly turns outward.
- **Sanctum card.** It appears once the camera has settled: your name, the identity line and the mission, then **About** · **Engineer** · **Creator** · **Explorer**.
  - Desktop: lower left.
  - Phones: above the navigation.
  - Phones turned sideways: top left, in the sky, so it doesn't cover the court.
- **Sanctum panel.** It uses the same panel as the project dossier, in the Sanctum's emerald, with four views: Overview, The Engineer, The Creator and The Explorer.
  - The overview opens without any camera move.
  - A fragment brightens, and the camera eases a fifth of the way toward it.
  - Previous/next and ← → walk the four views. "Overview" brings the camera back.
- **Ways out:**
  - "Continue to the World Forge" (overview), "See the works" (Creator) and "Continue to the Worlds Beyond" (Explorer);
  - the bottom navigation and the World Map;
  - Escape, ✕, or tapping the dimmed world.
- **Leaving for the Forge,** the camera keeps the Forge ahead the whole way (`m6-review/m61-exit-to-forge.jpg`).

Review images in `m6-review/`:
- desktop: `m61-sanctum-desktop.jpg`, `m61-overview-desktop.jpg`, `m61-engineer-desktop.jpg`, `m61-creator-desktop.jpg`, `m61-explorer-desktop.jpg`;
- other sizes: `m61-sanctum-phone.jpg`, `m61-engineer-phone.jpg`, `m61-sanctum-landscape-phone.jpg`, `m61-overview-tablet.jpg`;
- the flight to the Forge: `m61-exit-to-forge.jpg`.

The `m61-checkpoint-*` images are the mid-build checkpoint.

## Exact copy shown (approved with the design, DEC-026)
All copy is from proposal §2.5. Every line names its source in `content/sanctum.ts`. Three items have no source anywhere and are left out: the problem-solving approach, the creator and game-development ambitions, and availability. Contact details stay for the Horizon.

## Stages
| Stage (doc 16 M6.1) | Done |
|---|---|
| Blockout and layout | `regions/sanctum/sanctumLayout.ts`: pure layout in the Sanctum's own frame (+Z away from the hub). Everything stays inside the island's rim, which is measured from its own geometry, and under 31 m tall. |
| Architecture and environment | `regions/sanctum/sanctumGeometry.ts` and `SanctumRegion.tsx`. Pale stone and green moss with emerald lines; no new lights or textures. The P2 placeholder (colonnade, obelisk and crystal) is removed. |
| Content presentation | `content/sanctum.ts` (sourced copy) and `ui/SanctumPanel.tsx` (card and panel). The dossier's shell is now the shared `ui/FocusPanel.tsx`; the dossier's behaviour and DOM are unchanged. |
| Arrival, exit and camera | `SANCTUM_VIEW` (wide and narrow), `computeFragmentFocusPose`, and a look-ahead toward the Forge on the Sanctum → Forge leg. `CameraRig` stays the only camera writer; its focus now covers fragments as well as monuments. |
| Interaction | Store: `sanctumView` and `openSanctum`. These are honoured only at the idle Sanctum, and direct navigation clears them, as it does for project focus. 3D picking uses invisible boxes. |
| Responsive, accessibility, performance | See below. |

## Checks
| Check | Result |
|---|---|
| Unit tests | **112/112**. New: render budget, edge ranges, placement inside the rim and under 31 m, the settled view facing the Forge with court, Forge and fragments in frame at 4 sizes, fragment focus (a fifth closer; left of centre on wide screens, top third on narrow ones), panel state, sourced copy, unsourced items absent, the works line from the project data. |
| Typecheck, lint, production build | clean, 0 problems, built |
| Production bundle | no dev handle, probe helper, LookDev or DRAFT note |
| M6.1 Sanctum probe, high quality (4 sizes) | **105/105**. Covers: no card during travel; card content, 44 px targets, reachability, nav clearance; the overview without a camera move; focus on the heading; scroll blocked; panel clearance; → / Next through all four views with the camera settling on each focus; wrap back to the settled view; Previous/Next labels; Escape returning focus; 3D hover and click; tapping the dimmed world; "See the works" travelling; the bottom navigation over the open panel; refusal away from the Sanctum; reduced motion; console clean. |
| M6.1 Sanctum probe, low quality | **105/105** |
| M5 regression (the dossier now uses the shared shell) | M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) |
| World Map · input regression | 21/21 · 70/70 |
| Classic `?mode=classic` | pixel-identical to the M5.9 capture (Δ 0). No file outside `src/world-forge/` changed. |

**Render cost at the Sanctum stop** (scene totals): high quality, desktop 94 draw calls (60k triangles), phone 78, landscape phone 100, tablet 78; low quality 78 / 62 / 84 / 62.
- The Sanctum adds 9 draws: 4 baked meshes, halo, pointer, motes and 2 waterfalls. Removing the P2 placeholder saves 1, so the net cost is 8, within the budget. Triangles are within 20k (unit-tested).
- Seen from the Forge (it's in the Forge view on desktop), the Forge's totals rose from 76 to 83 calls on desktop and 84 to 92 on the landscape phone, and by about 1 elsewhere.

## Changes made during the stages
- **First look:** the stone read as dark navy against the golden Forge. It's now paler, with a slight lift. The moss is greener, the island top brighter, and the terraces smaller, so the foreground doesn't swallow the court.
- **Explorer:** the halo hid its platform from the settled view, so the halo now hangs higher. The mast and lantern are thicker, so they read against the Forge's city.
- **Waterfalls:** from the settled view, the island itself hides every edge that's in frame (the camera stands above its front). The waterfalls stay on the hub-facing edge, as proposed. They show from the Forge side and on the flight to the Forge.
- **Exit:** leaving from the outer side, the camera at first looked sideways at the Archive. A look-ahead now holds the Forge in view.
- **Phones:** the fragment focus put the fragment behind the sheet. It now sits in the top third. On phones turned sideways, the card covered the court, so it moved to the top left.

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- The probes live in the session scratchpad, not the repository.
- Only the Sanctum's dev-build focus checks use the dev handle; production builds don't include it.

## Files
- New:
  - `regions/sanctum/sanctumLayout.ts`, `sanctumGeometry.ts`, `SanctumRegion.tsx`
  - `content/sanctum.ts`
  - `ui/FocusPanel.tsx`, `ui/SanctumPanel.tsx`
  - `tests/world-forge/sanctum.test.ts`
- Changed:
  - `camera/cameraTargets.ts`, `camera/CameraRig.tsx`
  - `experience/experienceStore.ts`
  - `core/WorldScene.tsx`, `world/RegionLandmarks.tsx`, `data/worldGeography.ts` (the island top colour)
  - `ui/ProjectDossier.tsx`, `WorldForge.tsx`, `WorldForge.css`
  - tests `experienceStore.test.ts`, `journeyPath.test.ts`

## For the lock
To lock M6.1, look at the images in `m6-review/` and confirm the Quiet Court, the card and panel, and the fragment focus. After the lock, M6.2 starts at its own gate: the Blueprint Archive skills inventory and design proposal (doc 16).
