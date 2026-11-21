# Stage Report — M1-R7 Reduced motion, keyboard, touch, responsive

## Objective
A meaningful reduced-motion mode; keyboard and touch travel and navigation; visible focus; no hover dependency; responsive camera.

## Files changed
- `src/world-forge/input/scrollInput.ts`: `keyboardStep` (pure key mapping).
- `src/world-forge/input/useJourneyInput.ts`: one document `keydown` listener for journey travel, removed on unmount.
- `tests/world-forge/scrollInput.test.ts`: 3 keyboard tests.

## Behaviour
- **Keyboard:**
  - **Travel:** PageDown / ArrowDown / Space go to the next region; PageUp / ArrowUp / Shift+Space go to the previous one. Repeated presses chain from the destination.
  - **Ignored:** anything with Ctrl, Alt or Meta held (browser shortcuts); text entry; keys another handler already took; and any key while a layer blocks scroll. Space never fires travel on a focused button or link.
  - **Home/End:** not bound globally (master doc: "only if safe"); they work inside the region menu.
  - **Tab order:** Classic link → region toggle, both with a visible amber focus ring.
- **Touch:** swipe travel (R4) and tap navigation (R5); no hover anywhere.
- **Reduced motion:**
  - **Rendering:** demand frameloop. The idle scene is a still image (verified by identical screenshots 1.2–1.5 s apart). No ambient drift or bob.
  - **Travel:** camera transitions of at most 0.35 s. Wheel gestures become single region steps (no continuous scroll motion).
  - **UI:** hero fade and UI transitions are instant.
- **Responsive:** poses recompute from the viewport (Void layout plus `responsiveFov` for the other regions). A resize mid-transition finishes at the destination with the new framing, and resizing back restores the exact Void pose.

## Validation
| Check | Result |
|---|---|
| `npm test` | 51/51 pass |
| `npm run typecheck`, `npm run lint` | exit 0 |
| Accessibility probe (scratchpad `probe-access.mjs`) | 18/18 pass: PageDown/ArrowDown/Space/Shift+Space/ArrowUp+PageUp chain, clamp at start, Ctrl+Arrow ignored, Tab order, visible focus ring, Space on toggle opens the menu instead of travelling, PageDown with toggle focused, resize 1440→390 mid-transition, exact Void after resizing back, reduced-motion still image at the Void and at a region, reduced-motion keyboard travel, instant hero fade. 0 console errors. |
| Portrait journey (390×844) | All 7 targets reached and captured, return to the Void exact, 0 console errors |

## Visual observations (agent inspection)
- **Portrait framings:** every landmark is in frame above the nav.
- **Path of Ascension:** reads as dense mesas in portrait.
- **Worlds Beyond:** very dark at its distance in every aspect ratio, because of the world fog. This needs a region design decision in M7.

## Known limitations
- **Mobile travel:** uses the same path as desktop. The master doc's "simplified camera / reduced camera travel" for mobile needs the final route decision.
- **Controls fading after inactivity** (master doc §9): not implemented. It's a UI-polish behaviour with its own rules (no fading while focused or open). Recorded for the R9 review and release polish.

## Acceptance
- [x] Meaningful reduced-motion mode
- [x] Keyboard and touch travel and navigation
- [x] Visible focus
- [x] No hover dependency

## Git checkpoint
Not committed; no commit authorization.
