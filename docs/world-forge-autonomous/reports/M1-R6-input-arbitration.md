# Stage Report — M1-R6 Input arbitration and panels

## Objective
Resolve the priority between interaction, direct navigation, panels, scroll and ambient motion. No competing movement; panel wheel behaviour and Escape/focus handling are stable.

## Priority as implemented
1. **User interaction / gesture:** DOM controls handle their own input first. There are no 3D gesture interactions yet; those arrive with M5+.
2. **Direct navigation:** always honoured. It replaces scroll and older navigations (journey model), even while a layer is open.
3. **Open panel / menu:** `store.blockScroll()` makes scroll-originated input (wheel, trackpad, touch, reduced-motion wheel steps) a no-op, so the camera never moves behind a panel. An in-flight scroll settles to its stop.
4. **Scroll:** journey travel (R4).
5. **Ambient motion:** dust drift and fragment bob. It never touches the camera, so it can't compete.

## Files changed
- `src/world-forge/experience/experienceStore.ts`: `blockScroll()` (stackable release tokens, idempotent release) and `isScrollBlocked()`. `scroll()` respects the block.
- `src/world-forge/input/useJourneyInput.ts`: all scroll-originated requests yield to a block.
- `src/world-forge/ui/useDismissLayer.ts` (new): a shared stack of dismissible layers. Escape closes only the topmost, wherever focus is, through one document listener that exists only while a layer is open.
- `src/world-forge/ui/JourneyNav.tsx`: uses the layer stack, and blocks scroll while open.
- Elements that scroll their own content opt out of journey input with `data-wf-own-scroll` (R4). That's the contract for future panels.

## Validation
| Check | Result |
|---|---|
| `npm test` | 48/48 pass (3 new arbitration tests: block vs navigation, stacking and double release, settle on block) |
| `npm run typecheck`, `npm run lint` | exit 0 |
| Arbitration probe (scratchpad `probe-arbitration.mjs`, real input) | 12/12 pass: wheel over the open list and over the world doesn't move the camera; menu stays open; Escape with focus outside the nav closes it and restores focus; scroll resumes after close; direct navigation outranks the block; no stuck block; reduced-motion wheel steps blocked then resume; touch swipes blocked while open; 0 console errors |
| Nav regression (`probe-nav.mjs`) | 27/27 pass after the Escape refactor |

## Known limitations
- No content panels exist yet; the first will be the M5 dossier. The block, layer stack and `data-wf-own-scroll` contracts are in place, and the nav menu exercises them. Modal focus containment will come with the first modal panel.

## Acceptance
- [x] No competing movement: one camera writer, direct navigation over scroll, blocks over scroll, ambient separate
- [x] Panel wheel behaviour: wheel over a layer or anywhere else while it's open doesn't move the camera
- [x] Escape and focus stable (topmost-only dismissal, focus restored to the trigger)

## Git checkpoint
Not committed; no commit authorization.
