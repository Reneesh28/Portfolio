# M8 The Horizon: content and contact audit, design proposal (design gate)

Status: **PROPOSED, waiting on your approval.** No Horizon geometry, closing composition or contact interface will be coded until you approve it (doc 16 M8.2).
Date: 2026-11-22.
Governing rules:
- master doc §6 Region 06, §8 Quick access, M8 acceptance;
- doc 06 06: the closing text is preserved exactly;
- doc 11.

M7 is still open: Story-driven Games' text and the M7 lock. This gate is documents only and doesn't depend on M7.

## 1. Content and contact audit (M8.1)
The full table is in `../content/CONTENT_INVENTORY.md` under "The Horizon".

- **Closing text (locked, exact):** **THE GREATEST CREATION IS STILL AHEAD.** Every world begins with an idea. This one is only getting started.
- **Ambitions:** your master doc names six themes:
  - AI/ML engineering ambitions
  - Original games
  - Original IP and universes
  - Indie development
  - Content creation
  - Meaningful experiences

  No source has more than these words. I propose showing them exactly as written; you can add a line to any of them.
- **Contact:**
  - **GitHub:** github.com/Reneesh28 (CV and Classic agree).
  - **Email:** reneesh3508925@gmail.com (CV and Classic agree).
  - **Resume:** `/resume.pdf`.
  - **LinkedIn needs your word.** Classic links to `linkedin.com/in/balam-reneesh`; the CV's text reads "linkedin.com/inbalamreneesh".
  - **Phone:** the CV has a phone number. It's left out (private, and not in the master doc's contact list).
  - Links are shown as given and not opened; testing them needs your yes.
- **Contact must not be gated behind the journey** (master doc). Today the World Forge has no contact access outside Classic, so section 3 adds one.

## 2. Recommended direction: "The Unfinished Gate"
**Idea in one line:** the farthest island faces the brightest part of the sky. On its edge stands a great gate that isn't finished: its arch stops short, and its last stones hang in the air, waiting to be set. The Forge glows far behind.

- **Composition.** The settled view looks along the island's edge:
  - the unfinished gate on the left, opening onto the bright western horizon (where the sky already glows);
  - the Forge small and golden in the distance on the right;
  - the fragments beyond the Horizon's edge (P2) drifting out into the light: "the world continues".
- **The gate:**
  - two tall pale-gold posts and the start of an arch;
  - the missing keystone and a few stones float in place, lit softly in the Horizon's gold;
  - a short path of stones leads to the threshold.

  It replaces the P2 placeholder.
- **Calm ending, no unnecessary animation** (M8 acceptance). The hanging stones drift very slightly, and not at all under reduced motion.
- **The closing statement** appears on arrival as the final screen-space composition, large and quiet, in the locked words. Under it are two choices:
  - **"Get in touch"** opens the contact panel;
  - **"Return to the Void"** starts the journey again.

  "Ambitions" sits beside them.
- **The Ambitions panel:** the six themes as written (or your lines). It uses the shared panel in the Horizon's gold.
- **The contact panel:** Email (mailto), GitHub, LinkedIn and Resume, each labelled. External links say they open in a new tab. Optionally your Instagram (Void Ronin).
- **Camera:** the arrival is a slow, short settle, with nothing cinematic after it. Reduced motion uses a short move.
- **Mobile:** the closing statement fits a phone width; the panels are sheets; targets are 44 px.
- **Procedural only.** At most 6 extra draw calls and 12k triangles.

## 3. Contact from anywhere (master doc: "directly accessible, not gated")
- **Recommended:** a **Contact** button in the bottom bar, beside Void / Map / Forge, on every region. It opens the same contact panel without travel.
- It works over any region, closes with Escape, and returns focus.
- It's a small addition to the M1/P5 navigation (one more quick button), so it needs your yes.

## 4. Stage plan after approval (doc 16 M8)
1. Content and contact verification: **done here**, finalised with your answers.
2. Design proposal and closing composition: **this gate**.
3. Blockout.
4. Environment and final reveal.
5. Contact and link presentation, including the Contact quick button.
6. Journey integration: "Return to the Void"; the World Map and the bottom navigation.
7. Responsive, accessibility and performance.
8. QA and lock: **your stop**.

## 5. Decisions requested
1. **Direction:** approve "The Unfinished Gate" and the closing composition, or redirect.
2. **LinkedIn:** which address is right, `linkedin.com/in/balam-reneesh` (Classic) or `linkedin.com/in/balamreneesh` (the CV's text)?
3. **Ambitions:** show the six themes as written, or send a line for any of them?
4. **Contact from anywhere:** add the Contact button to the bottom bar (recommended)? Should your Instagram be in the contact panel too?
