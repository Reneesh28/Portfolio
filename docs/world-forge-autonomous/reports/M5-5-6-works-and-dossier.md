# M5.5–M5.6 report: all eight works; dossier and focus/close behaviour

Date: 2026-11-21 · Branch `the-world-forge` (uncommitted; commits remain off) · Decisions: DEC-022 (M5.5), DEC-023 (M5.6)
Status: **done; owner review requested before M5.7.**

## What you'll see
- **All eight works stand on the Projects terrace**, each with its own emblem (M5 proposal §2.1). The Works index lists them in plinth order:

  | Plinth | Work | Emblem |
  |---|---|---|
  | 0 | Sales Performance Analytics Engine (SPAE) | three ascending columns |
  | 1 | PARAS System | lens ring around a still core |
  | 2 | AETHERION | rising stepped shard |
  | 3 | NutriFit AI | spiralling stacked discs |
  | 4 | NeuroPlay Engine | two interlocking rings |
  | 5 | FinLit AI | arch over a keystone |
  | 6 | Game Stats Dashboard & Recommender | faceted, die-like polyhedron |
  | 7 | Chronoshift | hourglass |

- **Choosing a work** (click the monument, or its name in the Works index): the world dims slightly around it, the Forge's glow quietens, a thread of the Forge's light reaches the emblem, the camera eases in, and the dossier slides in on the right (on phones, a sheet from below).
- **Previous / Next** (or ← →) glides the camera along the terrace to the neighbouring work and cross-fades the dossier text. Before M5.6 this was a hard cut.
- **Close** (✕, Escape, or a click on the dimmed world) eases the camera back to the Forge view and returns keyboard focus to the work's name in the Works index.
- **Reduced motion:** camera moves are short (0.3 s), with no lift, shimmer, panel slide or cross-fade.

## Content shown (doc 11; unchanged rules)
- Only owner-confirmed text or the repository text Classic already publishes. Development builds mark repository text DRAFT; production builds don't show that note.
- **NeuroPlay:** category and its two links only, plus "Details to follow" (its site and CV descriptions disagree).
- **Chronoshift:** its name and "Details to follow" only (no content exists yet).
- **AETHERION:** overview and links; the tech list is hidden until you confirm it.
- No pictures (DEC-015).

## M5.6 changes
| Area | Change | Files |
|---|---|---|
| Switching works | The focus pose glides from the current work to the next (0.9 s, smoothstep, lifted by up to 6 units mid-way). Resizing while open re-frames the same way. | `camera/CameraRig.tsx`, `camera/cameraTargets.ts` (`FOCUS_MOTION`, `approach`, `easeFocus`, `focusGlideLift`) |
| Flicker fix | Once focused, the blend stepped down and back up on alternate frames, so the camera flickered between the focus view and the overview (most visible on slow devices; it also kept re-rendering under reduced motion). It now holds at 1. | `camera/CameraRig.tsx` |
| Subdue | A soft vignette added to the scrim; the Forge's base glow and beam haze quieten to 55% while a work is focused (0.6 s). | `WorldForge.css`, `regions/forge/ForgeCore.tsx`, `regions/forge/hubLayout.ts` (`FOCUS_SUBDUE`) |
| Panel motion | 0.26 s entry; 0.2 s cross-fade on switch; text starts at the top for each work; off under reduced motion. | `WorldForge.css`, `ui/ProjectDossier.tsx` |
| Hover | Hover glow and pointer cursor no longer stick after a click opens a dossier, or while travelling. | `regions/forge/Monuments.tsx` |
| Phone sheet | Sits 16 px higher, clearing the bottom navigation when the region name wraps onto two lines. | `WorldForge.css` |
| Dev only | The dev handle also reports the camera pose, so the browser probe can check the glide frame by frame. Absent from production. | `core/DevRenderStats.tsx`, `experience/devHandle.ts` |

## Validation
- `npm test` **96/96** (new: all 8 focus views; the glide between every pair of neighbouring works, wrap-around included, keeps more than 4 units from every monument at desktop and phone sizes; the focus blend holds steady once focused; lift capped and zero at both ends).
- Typecheck, lint and production build: exit 0. The production bundle contains no dev handle, LookDev or DRAFT note.
- **M5 browser probe 41/41** (dev server, real mouse and keys, desktop 1440×900 and phone 390×844). New checks: switching works glides with no cut and arcs over the terrace; the subdue vignette and panel entry are present; reduced motion turns the panel animations off.
- **World Map probe pass.** **Input regression 70/70** (scroll, direct navigation, panel arbitration, accessibility).
- **Classic:** no file outside `src/world-forge/` changed. The pixel comparison wasn't re-run this round.

## Review images (`m5-review/`)
- `m55-forge-works-index.jpg`: the eight works and the Works index (desktop).
- `m56-neuroplay-dossier-desktop.jpg` and `m56-neuroplay-dossier-mobile.jpg`: NeuroPlay focused after Next from NutriFit.
- `m56-chronoshift-dossier-desktop.jpg`: the outer plinth, and the sparse dossier.
- `m55-works-index-mobile.jpg`: the scrolling Works row on a phone.

## Known limits
- Verified in headless Chrome (software rendering) only; no real-device or GPU check.
- The subdue vignette is deliberately subtle. Say if you want it stronger or removed.
- On the outermost plinths (SPAE, Chronoshift), the Archive hall stands as a dark mass at the edge of the frame.

## Remaining M5 stages (doc 16)
- **M5.7 Navigation and camera integration.** Most of it already works (previous/next, direct navigation closes the dossier and travels). Left: an audit of every route into and out of a focused work (World Map, quick bar, scroll attempts, the Void return, resize, reduced-motion toggling mid-focus), with probes.
- **M5.8 Responsive, accessibility and performance.** Screen-reader pass, focus order, 44 px targets on the dossier, draw-call and triangle budget check for all eight monuments (proposal §2.5: ≤ 8 calls, ≤ 15k triangles), and the low tier.
- **M5.9 QA and milestone lock.** Full regression, Classic comparison, review images, and your lock.

## Still waiting on you
NeuroPlay content (site or CV) · AETHERION's tech list · whether to show CV figures · Chronoshift's details · the shortened names ("AETHERION", "NutriFit AI") · permission to test the project links · commit permission.
