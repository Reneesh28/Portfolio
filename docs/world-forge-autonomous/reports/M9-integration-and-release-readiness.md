# M9 report: integration, optimisation and QA; release readiness

Date: 2026-11-22. Branch `the-world-forge`. Decision: DEC-034 (complete M7, M8 and M9).
Status: **M7, M8 and M9 complete. Nothing pushed, merged or deployed: those need your explicit yes.**

## The journey, end to end
| # | Region | What it is now | Milestone |
|---|---|---|---|
| 00 | The Void | The purple portal realm and the hero (P4) | approved (DEC-020) |
| 01 | The Origin Sanctum | The Quiet Court: three identity fragments, the About panel | M6.1 locked |
| 02 | The World Forge | The golden spire city; eight project monuments and dossiers | M5 locked |
| 03 | The Blueprint Archive | The Drafting Hall: four skill structures that build when chosen | M6.2 locked |
| 04 | The Path of Ascension | The Lit Ascent: five milestones, lanterns lit up to the chosen one | M6.3 locked |
| 05 | The Worlds Beyond | The Convergence and six territories (five open; Story-driven Games' keep stands, closed until its text arrives) | M7 complete |
| 06 | The Horizon | The Unfinished Gate, the closing words, Ambitions, contact | M8 complete |

**Across the whole journey:**
- the World Map and the bottom navigation, now with a **Contact** button on every region;
- the display font (Cinzel);
- controls that fade when you're idle;
- reduced motion;
- quality tiers.

Classic stays at `?mode=classic`. Its only change is the CGPA (6.86).

## M9 work
- **Integration:**
  - contact reachable from every region, with one panel at a time;
  - every region's panel follows the same rules (one shared panel shell): focus moves in and returns, Escape closes the topmost layer, scroll is blocked while open, and navigation outranks panels;
  - P2's placeholder landmarks are fully retired, since every region now builds its own.
- **Display typography:** Cinzel (SIL OFL, self-hosted, 26 KB latin subset, `font-display: swap`) for display text only; body text unchanged; recorded in `ASSETS.md`.
- **Controls fade when idle** (master doc §9):
  - they fade to a faint, still-visible presence after 5 s with no input (10 s on touch screens), and come back on any input;
  - they never fade while a panel, the map or the menu is open, while something inside is focused, or while the journey is moving.
- **Link test** (DEC-034): dead links fixed or removed, and Chronoshift's panel filled from its repositories (see the content inventory).
- **Optimisation:** each region adds a few baked draws. Measured scene totals are in the QA table; every region stays within its own budget (unit-tested).

## QA
QA_TABLE

## Release readiness: what's left, and who it's for
**Needs your explicit yes:**
1. **Push, merge or deploy.** Everything is committed on `the-world-forge` only. `main` hasn't been touched.

**Needs you (I can't do these):**
1. **A real-device check.** All testing ran in headless Chrome with software rendering. Please try a real phone (portrait and landscape) and a desktop GPU. Check the frame rate, touch, and that the quality governor steps down on a slow device.
2. **Story-driven Games:** a line or two of text. Then I open its keep.

**Found and reported, outside this repository (not changed):**
1. **Your CV PDF's clickable email and GitHub links** point to another person's address and profile, probably a template leftover. The printed text is yours.
2. **`Chronoshift_Frontend` has a committed `.env` file.** I didn't open it. Consider removing it and rotating any keys it holds.
3. **NeuroPlay's demo** (`neuroplay.vercel.app`) returned 503, so it's hidden. Tell me if it comes back.
4. **PARAS** has no public repository, so its panel has no link.

**Still open, smaller:**
- Classic still shows the site's older NeuroPlay text. Only the CGPA was approved for Classic.
- The deferred minimap and the audio toggle (P5 plan) remain deferred; there's no audio.
