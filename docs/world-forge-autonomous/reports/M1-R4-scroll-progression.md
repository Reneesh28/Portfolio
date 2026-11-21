# Stage Report — M1-R4 Scroll progression

## Objective
Map wheel, trackpad and touch input to deterministic journey progress. Down advances, up reverses, sensitivity is predictable, and there's no input trapping or stuck camera.

## Files changed
- `src/world-forge/input/scrollInput.ts` (new): pure interpreter for delta-mode normalisation, sensitivity, per-event cap and reduced-motion gesture stepping.
- `src/world-forge/input/useJourneyInput.ts` (new): one set of passive wheel and touch listeners on the World Forge root.
- `src/world-forge/WorldForge.tsx`: mounts the input hook.
- `src/world-forge/WorldForge.css`: `.wf-root` gets `touch-action: pinch-zoom` and `overscroll-behavior: none`. Vertical swipes drive the journey; pinch-zoom stays with the browser.
- `tests/world-forge/scrollInput.test.ts` (new).

## Behaviour
- **Sensitivity:** 600 wheel px = 1 stop, so one notch (about 100 px, 0.17 stop) carries past the settle threshold to the next region. Touch: 320 px = 1 stop.
- **Per-event cap:** 0.6 stop. Quick scrolling still compresses travel through accumulation, limited by the model's speed cap.
- **Full motion:** progress is continuous and settles on a stop 0.32 s after input stops.
- **Reduced motion:** no continuous scroll motion. One gesture is one region step; a gesture ends after 220 ms of quiet.
- **Ignored input:** `ctrl+wheel` (zoom), multi-touch, and anything inside an element marked `data-wf-own-scroll` (for future panels).
- **Listeners are passive and never call `preventDefault`:** the page has no document scroll to take over, so nothing is trapped.

## Validation
| Check | Result |
|---|---|
| `npm test` | 45/45 pass (9 new interpreter and integration tests) |
| `npm run typecheck`, `npm run lint` | exit 0 |
| Real-input probe (CDP `Input.dispatchMouseEvent` / `dispatchTouchEvent`, dev server, scratchpad `input-probe.mjs` + `probe-scroll.mjs`) | 14/14 pass: notch down/up (exact return to the Void), 12-notch burst, 60-notch burst clamps at the Horizon, slow 540 px trackpad reverse, direct navigation overriding scroll, newer navigation replacing an in-flight one, `scrollY` stays 0 with 0 prevented wheel events, touch swipe up/down, tiny nudge settles back, pinch-zoom preserved, reduced-motion one-step-per-gesture forward and back. 0 console errors. |

The first probe run had 3 failures. All were probe defects: the probe polled for idle before SwiftShader had processed the input, and one expectation was wrong (750 px = 1.25 stops correctly lands two regions back). After fixing the probe, every check passed with no product change.

## Known limitations
- Sensitivity constants are provisional engineering defaults. You'll judge the pacing at the M1-R9 review.
- Keyboard travel comes in M1-R7.

## Acceptance
- [x] Down advances, up reverses
- [x] Predictable sensitivity (deterministic, tested)
- [x] No input trapping (passive listeners, nothing prevented), no stuck camera (always settles to idle on a stop)

## Git checkpoint
Not committed; no commit authorization.
