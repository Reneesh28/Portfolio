# M7 report (part 2): four territories — Anime & Manga, Formula 1, Gaming & Content Creation, The Training Grounds

Date: 2026-11-22. Branch `the-world-forge`. Decision: DEC-033 (after the review of the Convergence and The Guild).
Status: **built and QA'd. Story-driven Games still waits on your text.** The next stops are M7.9–M7.11 (routing, responsive and QA across all six) and the M7 lock, once Story-driven Games is in, or sooner if you'd rather lock without it.

## What you'll see
All four follow The Guild's standard (DEC-033): one island, one landmark facing the Convergence, the shared stone with lit edges in the territory's own colour, compact (under 25 m). The forms are abstract: no character art, logos or team marks.

| Territory (island) | Landmark | Light | Panel (your words, DEC-032) |
|---|---|---|---|
| **Anime & Manga** (crimson) | A wind-swept crag with a lone gate of dark stone (two leaning posts, a tie beam, a long top beam with upturned ends), with crimson banners of light falling away on the wind | crimson | One Piece |
| **Formula 1** (steel) | A banked ribbon of track arcing round the island on slim pylons | steel edges, and **one streak of white light that runs the track** every 4.5 s | "It's not over until it's over." · The Max Verstappen mentality. |
| **Gaming & Content Creation** (purple) | A broadcast mast with four floating screens shown as glowing frames (no video) | purple, with **signal rings that pulse outward** | Void Ronin · void_ronin.exe on Instagram ↗ (new tab; tested working, DEC-034) |
| **The Training Grounds** (now pale stone) | A secluded, rugged plateau: a stair cut up a rock mass, weathered training stones, a resting rock | soft natural light on the stair's edges | "A king never wavers. A king never bends. A king never relies on others. A king never gives up." |

- **The Convergence card** now lists all five open worlds in order: Anime & Manga, Formula 1, Gaming & Content Creation, The Guild, The Training Grounds.
- **In the panels,** previous/next walk all five, and the camera flies between them.
- **The gates** for these four are now bright. Story-driven Games' gate stays dim, and its island keeps a blockout until its text arrives.
- **Under reduced motion,** the streak and the rings hold still, lit evenly.

## Checks
| Check | Result |
|---|---|
| Unit tests | **138/138**. Every open territory has a landmark on its island; all forms stay under 25 m above their own island; each territory's focus is framed at six sizes; the F1 streak has 30 segments and there are three rings; the five open territories in order. |
| Typecheck · lint · production build | clean · 0 problems · built |
| M7 probe, high quality (4 sizes) | **109/109**. Covers: the card listing the five open worlds in order and reachable; Next walking Training → Anime → F1 → Creator → back to The Guild, with the camera settling on each and each panel showing the owner's words; the Instagram link opening in a new tab; return, Escape, 3D picking, dimmed world, navigation over the panel, reduced motion, console. |
| M7 probe, low quality | **109/109** |
| Regression | M6.3 105/105 · M6.2 105/105 · M6.1 105/105 · M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) · World Map 21/21 · input 70/70 |
| Classic | pixel-identical to the M7 part-1 capture (Δ 0) |

Review images (`m7-review/`):
- desktop: `m72-convergence-desktop.jpg`, `m72-anime-desktop.jpg`, `m72-f1-desktop.jpg`, `m72-creator-desktop.jpg`, `m72-training-desktop.jpg`;
- phone: `m72-convergence-phone.jpg`, `m72-creator-phone.jpg`.

## Changes made along the way
- **Formula 1:** both track edges glowed white, which drowned the streak, and the focus put the camera inside the ring. The edges are now steel, the streak white, and the camera further out.
- **Anime & Manga:** the banners read as flat bars. Each now falls away on the wind in two drooping lengths, and the view is a little wider.
- **Heights:** a height check compared every territory to the Convergence's height (the broadcast tower stands on an island 15 m higher). It now checks each territory against its own island top.

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- The Instagram link was tested on 2026-11-22, after this part was built (DEC-034): it works.

## Files
- New: `regions/beyond/territoryForms.ts` (the five territory builders; The Guild moved here).
- Changed:
  - `regions/beyond/beyondGeometry.ts`, `beyondLayout.ts`, `BeyondRegion.tsx`
  - `content/interests.ts` (four territories built)
  - `data/worldGeography.ts` (the Training Grounds' island colours)
  - `world/RegionLandmarks.tsx` (only Story-driven Games keeps a blockout)
  - `core/WorldScene.tsx`
  - tests `beyond.test.ts`, `journeyPath.test.ts`

## What's next
- **Story-driven Games:** send a line or two (which games, or what kind of stories), and it gets its landmark (the misty keep with one lit door) and opens.
- **Then M7.9–M7.11:** routing and return across all six, a responsive and performance pass, QA, and **the M7 lock (yours)**.
