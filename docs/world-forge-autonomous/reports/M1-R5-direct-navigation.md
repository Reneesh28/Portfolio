# Stage Report — M1-R5 Direct navigation

## Objective
Accessible region selection: every planned region reachable directly, navigation interrupts scroll consistently, UI in screen space. No map, since the original M1 doesn't require one.

## Spec sources checked
- Master doc §8 (locked): persistent region navigation centred at the bottom, compact by default, expands, tap-compatible, current-region indicator, contextual journey cue.
- Master doc §9 (locked): "Global navigation: Bottom-center button."
- §8 also names the World Map as the primary entry point. **The map is not built in M1** (doc 05 and the original M1 scope). It remains a pending decision.

## Files changed
- `src/world-forge/ui/JourneyNav.tsx` (new): the bottom-centre toggle and region list.
- `src/world-forge/ui/WorldStage.tsx` (new): root `<main>` exposing `data-region` and `data-at-void` to CSS.
- `src/world-forge/WorldForge.tsx`: provides `ExperienceContext` to the DOM UI and mounts `JourneyNav` and `WorldStage`.
- `src/world-forge/WorldForge.css`: nav styles, Void-hero fade, narrow-layout hero clearance, reduced-motion overrides.

## Behaviour
- **Compact toggle:** shows `NN · REGION NAME` for the current region, and the destination while travelling. Minimum height 44 px.
- **Opening:** click, tap, Enter or Space opens a list of all 7 regions (index, name, role from the M3 registry). Focus moves to the current region entry, which carries `aria-current="location"`.
- **Menu keys:** Arrow Up/Down (wrapping), Home and End inside the menu.
- **Closing:** Escape closes the menu and returns focus to the toggle. An outside pointer-down closes it. Selecting a region navigates, closes the menu and returns focus to the toggle.
- **Arrival announcement:** a polite live region announces arrivals ("THE BLUEPRINT ARCHIVE, Skills").
- **Journey cue:** "SCROLL TO CONTINUE" (master doc example copy) shows only when idle, the menu is closed, and you're not at the last region.
- **Void hero and scrim:** fade out (450 ms, instant under reduced motion) once the journey leaves the Void, and come back on return. The scene isn't affected.
- **Hover:** not used, because hover is never required (master doc §7). Click or tap opens the menu.

## Validation
| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint` | exit 0 |
| Navigation probe (scratchpad `probe-nav.mjs`, real CDP mouse, keyboard and touch input on the dev server) | 27/27 pass: toggle position and size; current region shown; cue visibility; click opens 7 entries; `aria-expanded`; focus to current entry; `aria-current`; select → close + focus restore; destination shown in transit; arrival at the Archive; hero hidden away from the Void; live announcement; keyboard Enter / Arrow / Home / End / wrap / Escape + focus restore / keyboard selection; outside-click close; navigation interrupting an in-flight scroll back to the Void (exact pose) with the hero visible again; mobile hero clearing the nav, no horizontal overflow, tap open with the list fully on screen, tap navigation to the Horizon, cue hidden at the final region. 0 console errors. |

The first run's keyboard checks failed because CDP `rawKeyDown` without `text` doesn't make Chrome synthesise button activation. After the probe was fixed to send real key events, every check passed with no product change.

## Visual observations (agent inspection)
- **Desktop:** the nav sits bottom centre, clear of the hero column and the gateway. The open list sits above the toggle.
- **Mobile:** the hero block sits 48 px higher to clear the nav and cue. The 3D scene is unchanged and the gateway isn't overlapped.

## Owner review needed
- **DEC-003:** moving the narrow-layout hero up 48 px changes the approved mobile text placement.
- **Nav visual styling:** follows the existing World Forge UI tokens. The final typography is the locked "elegant cinematic display font", still to be chosen.

## Acceptance
- [x] Every planned region reachable directly (tested by click, keyboard and tap)
- [x] Navigation interrupts scroll consistently (tested at runtime and in unit tests)
- [x] Screen-space UI; no map built

## Git checkpoint
Not committed; no commit authorization.
