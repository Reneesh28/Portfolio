# M8 report: The Horizon ("The Unfinished Gate")

Date: 2026-11-22. Branch `the-world-forge`, commit `375a3cc`. Decision: DEC-034 (proposal approved with its recommendations; complete M8).
Status: **built and QA'd; locked under DEC-034's authorisation to complete M8.**

## What you'll see
- **The scene.** The farthest island faces the bright western sky. On its edge stands a great gate that isn't finished:
  - two pale-gold posts, and the start of each side of the arch;
  - the missing voussoirs and the keystone hang in the air where they'll go, glowing softly gold and drifting very slightly (still under reduced motion);
  - a path of stones leads to the threshold, and fallen blocks lie beside it.

  The gate is turned toward the settled view, so the arch reads in three-quarter view.
- **The composition.** The settled view looks from the island's south-west: the unfinished gate on the left, and the Forge glowing far off on the right. The scene sits low, leaving the sky for the closing words. Phones face the gate and the island.
- **The closing words**, in the locked text and the display font: **THE GREATEST CREATION IS STILL AHEAD.** Every world begins with an idea. This one is only getting started. Beneath them:
  - **Ambitions:** your master doc's six themes, as written;
  - **Get in touch:** the contact panel;
  - **Return to the Void:** start the journey again.
- **Contact from anywhere.** A **Contact** button (an envelope) now sits in the bottom bar on every region and opens the contact panel without travel. The panel lists email (mailto), GitHub, LinkedIn and the résumé; external links open in a new tab.
  - Opening contact closes any other panel, so only one is ever open.
  - Escape returns focus to whatever opened it.
- **No "scroll to continue"** at the end, and no ending animation beyond a short fade (master doc: calm ending).

## Content
- **The closing text:** exact (unit-tested).
- **Ambitions:** AI/ML engineering ambitions · Original games · Original IP and universes · Indie development · Content creation · Meaningful experiences.
- **Contact:**
  - `reneesh3508925@gmail.com`;
  - `github.com/Reneesh28`;
  - `linkedin.com/in/balam-reneesh` (the CV's own link target; Classic agrees);
  - `/resume.pdf`.
- **No phone number.** Instagram stays in the Worlds Beyond.

## Checks
| Check | Result |
|---|---|
| Unit tests | budget and height; the gate inside the rim with an unfinished arch (stones hang in the gap); the gate and the Forge both in frame on wide screens, the gate low in frame on narrow ones; the closing words exact; the six ambitions and the verified contact details only (no phone); state (Ambitions only at the idle Horizon; contact anywhere; navigation closes both) |
| M8/M9 probe (4 sizes; part of M9 QA) | the closing words exact, in Cinzel with the font loaded; on screen and clear of the navigation; 44 px buttons; no scroll cue; no overflow; Ambitions; Escape and focus; contact links and their targets; contact from the Void, Forge and Archive without travel; contact replacing an open dossier; Return to the Void; the fading controls |

The full results are in the M9 report.

## Files
- New:
  - `content/horizon.ts`
  - `regions/horizon/horizonLayout.ts`, `horizonGeometry.ts`, `HorizonRegion.tsx`
  - `ui/HorizonPanel.tsx`, `ui/ContactPanel.tsx`
  - `tests/world-forge/horizon.test.ts`
- Changed:
  - `experience/experienceStore.ts` (`horizonView`, `contactOpen`)
  - `camera/cameraTargets.ts` (the Horizon framing; P5's generic island framing retired, since every region now has its own view)
  - `ui/JourneyNav.tsx` (the Contact button)
  - `WorldForge.tsx`, `WorldForge.css`, `core/WorldScene.tsx`
  - tests `experienceStore.test.ts`, `journeyPath.test.ts`
