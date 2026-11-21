# M5.7–M5.9 report: navigation, responsive / accessibility / performance, QA

Date: 2026-11-21 · Branch `the-world-forge` (uncommitted; commits remain off) · Decision: DEC-024
Status: **M5 LOCKED** ("PRoceed", DEC-025, 2026-11-22). Committed as `ee17210`.

## What changed for you
- **Desktop Works index** is now a vertical list at the lower right. The old centred block covered the Projects terrace, and so the very works it named. With the Forge framed left of centre, the whole terrace stays visible (`m5-review/m59-forge-desktop.jpg`).
- **Phones:** the Works row now reaches every work. Before, the first works (SPAE, PARAS, half of AETHERION) were pushed past the scroll start and couldn't be reached.
- **Phone World Map:** the Void's marker now sits above its island. It was clipped at the map's bottom edge and couldn't be tapped (a P5 bug found here).
- **The dossier** no longer overlaps the bottom navigation (it did by 2–3 px on desktop and phones).
- **Screen readers:** Previous / Next announce the neighbouring work ("Next work: FinLit AI").
- **Monuments** look the same, but now draw in two passes instead of 24.

## M5.7 Navigation and camera integration
Every route into and out of a focused work was exercised in the browser at desktop and phone sizes (probe `m57`, 39 checks):

| Route | Behaviour verified |
|---|---|
| Open from the Works index | camera settles exactly on the work's focus view |
| Journey keys (PageDown, Space, ↓, End) and wheel while open | held; the dossier keeps ← → for switching |
| Three quick → presses | lands on the third work, camera settled there |
| Resize while open | re-frames the same work for the new size |
| Reduced motion switched on mid-focus | view holds; Next still works with a short move |
| World Map over an open dossier | map opens above it; Escape closes the map, then the dossier |
| Close | camera returns exactly to the Forge view |
| Region chosen on the map, region menu, or quick bar (Void, Forge) from an open dossier | dossier closes, then travel (navigation outranks the panel) |
| Click-drag or swipe on the dimmed world | closes the dossier only; the journey doesn't move |
| Focus requested mid-travel or away from the Forge | refused |
| Reachability | every work in the Works index and every region on the World Map can be hit |

## M5.8 Responsive, accessibility, performance
- **Render budget (proposal §2.5: ≤ 8 draw calls, ≤ 15k triangles for all monuments).**
  - **Draw calls:** the monuments now cost 2 (3 with the light thread). They cost 24 before.
  - **Triangles:** 8,900 (3,820 stone + 5,080 edges), unit-tested.
  - **Measured scene totals at the Forge, high tier:** desktop 98 → 76 calls; phone 88 → 66; landscape phone 106 → 84; tablet 94 → 72. With a dossier open, desktop goes 71 → 53.
- **Picking:** invisible per-monument boxes, which are also larger touch targets. Hover shows a pointer and a click opens the dossier, verified at desktop, phone and tablet.
- **Viewports checked:** 1440×900, 390×844, 844×390 (landscape phone), 768×1024 (tablet). On each: every dossier control is at least 44×44 px, there's no horizontal overflow, and the dossier clears the navigation and stays on screen.
- **Accessibility:**
  - the dossier is a labelled dialog;
  - focus moves to its heading (also on switching) and is trapped inside;
  - Escape closes the topmost layer first;
  - focus returns to the work's name;
  - links say they open in a new tab;
  - Previous / Next name their target;
  - reduced motion removes the lift, shimmer, panel slide and cross-fade;
  - under reduced motion, hover and selection changes now request a frame (they could lag before).
- **Low tier:** Verified at all four sizes on `?quality=low` (pixel ratio 1, no bloom). Same 19 checks pass. Scene totals at the Forge: desktop 61 calls, phone 51, landscape phone 69, tablet 57 (high: 76 / 66 / 84 / 72).

## M5.9 QA
| Check | Result |
|---|---|
| Unit tests | **100/100** (new: render budget, edge ranges, monument placement, glide clearance with each monument's real height) |
| Typecheck · lint · production build | exit 0 · 0 problems · built |
| Production bundle | no dev handle, LookDev, DRAFT note or probe helper |
| M5 probe (works, dossier, glide, subdue, reduced motion) | **41/41** |
| M5.7 probe (every route in and out, reachability) | **39/39** |
| M5.8 probe, high tier (budget, 44 px, overflow, layout, picking; 4 viewports) | **19/19** |
| M5.8 probe, low tier | **19/19** |
| World Map probe | **21/21** |
| Input regression (scroll, navigation, arbitration, access) | **70/70** |
| Classic `?mode=classic` | pixel-identical to the P3 capture (Δ 0); no file outside `src/world-forge/` changed. Against the older M1 baseline it shows the same 0.13% hero-area difference the M1-R8 report recorded as run-to-run noise. |
| Console | no errors or warnings in any probe |

Review images (`m5-review/`): `m59-forge-desktop.jpg` (Works list on the right, terrace visible), `m59-neuroplay-desktop.jpg`, `m59-forge-phone.jpg`, `m59-neuroplay-tablet.jpg`, `m59-neuroplay-landscape-phone.jpg`, `m59-world-map-phone.jpg` (Void marker above its island).

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- **Landscape phones (844×390):** in the Forge overview, the terrace sits under the bottom navigation, so monuments can't be clicked there. The Works row is the way in at that size.
- The dossier is modal for screen readers (`aria-modal`), while the bottom navigation stays clickable for pointer users, as the M5 proposal intends. Keyboard and screen-reader users close the dossier first (Escape or ✕) and then navigate.
- The probes live in the session scratchpad, not the repository.

## Files
- `regions/forge/monumentGeometry.ts` (new, pure: emblems, terrace bake, budget)
- `regions/forge/Monuments.tsx` (two meshes, hit boxes, light threads)
- `ui/ProjectDossier.tsx`, `ui/WorldMap.tsx`, `ui/mapLayout.ts`, `WorldForge.css`
- dev-only `core/DevRenderStats.tsx` and `experience/devHandle.ts`
- tests `tests/world-forge/monuments.test.ts` (new) and `projects.test.ts`

## For the lock
To lock M5, please confirm the eight monuments, the Works index (right-hand list on desktop, row on phones), and the focus, switch and close behaviour. The content answers can come later: they only fill in dossiers. Still open: NeuroPlay (site or CV), AETHERION's tech list, CV figures, Chronoshift's details, the short names, link-testing permission, commit permission.

## After the lock: CV content (DEC-025)
- NeuroPlay's overview, tech and dates, and AETHERION's tech, now come from the CV. The CV's project bullets fill the master-doc fields **Approach** and **Architecture**, figures included. A single point shows as a paragraph, several as a list with amber markers.
- Checks: `npm test` 101/101 (new test: NeuroPlay and AETHERION fields come from the CV and are displayable) · typecheck, lint and build clean · M5 probe 41/41 (its NeuroPlay check now expects the CV content) · M5.8 probe 19/19.
- Images: `m5-review/m5-cv-neuroplay-desktop.jpg`, `m5-cv-neuroplay-phone.jpg`, `m5-cv-aetherion-desktop.jpg`.
