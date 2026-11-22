# M6.3 report: The Path of Ascension ("The Lit Ascent")

Date: 2026-11-22. Branch `the-world-forge`, committed when QA passes. Decision: DEC-030.
Status: **M6.3 LOCKED** ("Proceed", DEC-033, 2026-11-22). Commit `0113000`.

## What you'll see
- **Arrival.** The camera settles in a three-quarter view up the climb: the foot island nearest on the right, and the four islands rising to the summit beacon far left, with its faint beam of light.
- **The path.** Pale stone slabs climb each island, and floating stair steps carry the path over every gap, beside the golden links. A small floating platform sits midway between pa-2 and pa-3.
- **Lanterns** line the whole path.
- **Snow-capped pinnacles** stand behind the path on each island.
- **Five waystones** mark the milestones. All are pale stone with a crown light, each with its own form:
  1. **Foundations**: a standing stone beside a cairn.
  2. **University**: an open arch.
  3. **Leadership**: twin pillars joined by a beam, on the floating platform.
  4. **Professional**: a stepped stone frame.
  5. **Building**: the summit beacon.
- **The timeline selector** (the Path card) lists the five milestones in order, each with its years. Any milestone can be chosen directly, in any order.
- **Choosing a milestone:**
  - the camera glides to its waystone (left of centre on desktop, above the sheet on phones);
  - its crown light brightens;
  - **the lanterns light from the foot of the path up to it**;
  - the timeline panel opens.

  Previous/next and ← → walk the timeline, the camera gliding along the climb as the lit front follows.
- **Building** lists AETHERION and NeuroPlay Engine with "Open in the Forge" buttons (they travel to the Forge and open the dossier), and ends with "Continue to the Worlds Beyond".

## Content (DEC-030: all from the CV)
| Milestone | Shown |
|---|---|
| Foundations · 2021 – 2023 | FIITJEE Junior College, Hyderabad, Telangana; Intermediate, Jun 2021 – Mar 2023; 83.5% |
| University · 2023 – present | Lovely Professional University, Phagwara, Punjab; B.Tech CSE, Aug 2023 – present; CGPA 6.86; certificates (Sep 2024, Oct 2024); HackerRank 5 stars |
| Leadership · over two years | AniCos Student Organization: Volunteer → Board Member → Co-CEO |
| Professional · 2025 – present | ML Intern at MacBease Connections (Nov 2025 – present, three CV points with ~35% / ~40% / ~25%); Full Stack Developer, freelance (Jan 2026 – present, three CV points with 1000+ / 100% / 40–60%); AWS Certified Cloud Practitioner (Apr 2026) |
| Building · 2026 | AETHERION (Jan 2026 – present); NeuroPlay Engine (Jan – May 2026) |

**Left out** (only Classic has them): secondary school, the freeCodeCamp certificate, the AniCos dates, and the Algo Tutor training. The Archive's "Training" label was removed with it (DEC-030).

## Stages
| Stage (doc 16 M6.3) | Done |
|---|---|
| Spatial progression blockout | `regions/ascension/ascensionLayout.ts`: pure layout in world coordinates, the path's control points, distances along it, waystone sites, the platform, pinnacles. |
| Milestone structures | `regions/ascension/ascensionGeometry.ts` and `AscensionRegion.tsx`: the path slabs and stair spans, the platform, five waystones, pinnacles with snow caps, lanterns in path order (vertex colours), crown lights, the summit beam. The P2 Path placeholders are removed, and their random draws are still consumed, so the Worlds Beyond blockouts are unchanged. |
| Information presentation | `content/timeline.ts` (sourced milestones) and `ui/AscensionPanel.tsx` (timeline selector and panel). |
| Navigation and interaction | Store: `ascensionMilestone` and `openAscension`, honoured only at the idle Path; navigation clears them. `CameraRig` focus now also covers milestones (`computeMilestoneFocusPose`). Work buttons use `visitWork`. 3D picking uses invisible boxes. |
| Responsive, accessibility, performance | See below. |

## Checks
| Check | Result |
|---|---|
| Unit tests | **130/130**. New: render budget, lanterns in path order covering the climb, waystones and pinnacles on their islands and under 30 m, milestones in path order and rising, all four islands framed at six sizes, each milestone's focus (left of centre on wide screens, above the sheet on narrow ones, clear of every island), the five milestones sourced from the CV in order, the conflicts settled and Classic-only items absent, panel state. |
| Typecheck · lint · production build | clean · 0 problems · built |
| Production bundle | no dev handle, probe helper, LookDev or DRAFT note |
| M6.3 Path probe, high quality (4 sizes) | **105/105**. Covers: no card during travel; the timeline selector in order with years, 44 px stops, reachability, nav clearance; direct selection out of order; the camera settling on each milestone's focus; each milestone's verified content; focus on the heading; scroll blocked; panel clearance and target sizes; Previous/Next labels and wrap; Escape returning the camera and focus; 3D hover and click on a waystone; tapping the dimmed world; the NeuroPlay hand-off to its Forge dossier; "Continue to the Worlds Beyond"; the bottom navigation over the open panel; refusal away from the Path; reduced motion; console clean. |
| M6.3 Path probe, low quality | **105/105** |
| After the desktop card fix | desktop re-run **27/27** |
| Regression | M6.2 Archive 105/105 · M6.1 Sanctum 105/105 · M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) · World Map 21/21 · input 70/70 |
| Classic `?mode=classic` | pixel-identical to the M6.2 capture (Δ 0); no file outside `src/world-forge/` changed |

**Render cost at the Path stop** (scene totals): high quality, desktop 35 draw calls (18k triangles), phone 47, landscape phone 35, tablet 47; low quality 19 / 31 / 19 / 31.
- The Path adds 5 draws (stone, snow, lanterns, crown lights, beam). Removing the P2 accent saves 1, so the net cost is 4, within the budget of 8 and 20k triangles (unit-tested).
- The Path is visible from the Forge and the Sanctum on desktop, so their totals rose by 4: Forge 86 → 90, Sanctum 94 → 98.

## Changes made during the stages
- **Settled view.**
  - Square-on to the climb, the chain was too wide: the summit fell off the frame's edge. The view now turns a third of the way down the climb, a three-quarter view up the ascent, which foreshortens it.
  - The aim moved toward the near foot.
  - Phones got their own aim and distance. All four islands are in frame at six sizes (unit-tested).
- **Lanterns and beam.** Unlit lanterns barely showed, so their rest glow is brighter. The summit beam read as a solid pole, so it's now thinner and fainter.
- **Desktop card.** The timeline card overlapped the bottom navigation by 4 px, so it's narrower (its stops wrap onto two rows).

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- In the wide settled view, the waystones are small (the climb spans about 300 m). Choosing a milestone brings each one close.
- The probes live in the session scratchpad, not the repository.

## Files
- New:
  - `content/timeline.ts`
  - `regions/ascension/ascensionLayout.ts`, `ascensionGeometry.ts`, `AscensionRegion.tsx`
  - `ui/AscensionPanel.tsx`
  - `tests/world-forge/ascension.test.ts`
- Changed:
  - `camera/cameraTargets.ts`, `camera/CameraRig.tsx`
  - `experience/experienceStore.ts`
  - `core/WorldScene.tsx`, `world/RegionLandmarks.tsx`
  - `content/skills.ts` (the "Training" label removed)
  - `WorldForge.tsx`, `WorldForge.css`
  - tests `experienceStore.test.ts`, `journeyPath.test.ts`

Review images (`m6-review/`):
- desktop: `m63-path-desktop.jpg`, `m63-university-desktop.jpg`, `m63-leadership-desktop.jpg`, `m63-professional-desktop.jpg`, `m63-building-desktop.jpg`;
- other sizes: `m63-path-phone.jpg`, `m63-leadership-phone.jpg`, `m63-path-landscape-phone.jpg`, `m63-university-tablet.jpg`.

## For the lock
To lock M6.3, look at the images in `m6-review/` (`m63-*`) and confirm the Lit Ascent, the timeline selector and panel, and the milestone focus with the lantern progression. This completes M6 (Central Regions). Next is M7, Worlds Beyond, which starts at its own gate: confirm six interests from your content, then a design for the Convergence and six territories.
