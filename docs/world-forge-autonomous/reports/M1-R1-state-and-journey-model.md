# Stage Report — M1-R1 State and journey model

## Objective
Typed region IDs, route order, journey progress, transition state and navigation requests in one testable model, with no duplicated or conflicting state.

## Scope
Engineering only. The model is not yet connected to the scene, camera or input; those are M1-R2 to R5.

## Files changed
- `src/world-forge/experience/journey.ts` (new): a pure, deterministic journey model.
- `src/world-forge/experience/route.ts` (new): route order derived from the M3 `REGIONS` registry.
- `src/world-forge/experience/experienceStore.ts` (new): the single source of truth, with a React-free store and a discrete UI snapshot.
- `tests/world-forge/register.mjs`, `journey.test.ts`, `experienceStore.test.ts` (new).
- `package.json`: adds a `test` script. No dependencies added.

## Implementation summary
- **One number holds journey progress:** `position` along the route, measured in stops (0 = Void … 6 = Horizon). The camera pose will be derived from it in R2/R3.
- **Phases:** `idle`, `scrolling` and `navigating`.
- **Scroll:** moves a scroll target and is followed smoothly, with a speed limit. When input stops (after 0.32 s), the journey settles on a stop, biased in the direction of the scroll so a small nudge returns to where it started.
- **Direct navigation:** a timed ease-in-out transition starting from the current position. A newer request replaces the older one through a monotonic id. Scroll is ignored while a navigation runs, because the input-priority order puts navigation above scroll.
- **Time steps** are clamped to 0.1 s, so a stalled browser tab can't teleport the camera.
- **Store:** `scroll`, `navigateTo` and `stepRegion` are request-only. `advance` is reserved for the future camera controller, which will be the single writer of time. The UI subscribes to a referentially stable snapshot (current region, destination, phase, reduced motion), so motion on every frame causes no React re-renders.
- **Reduced-motion config:** transitions of at most 0.35 s.
- **React state:** none beyond `useSyncExternalStore`, in line with the master document's state architecture. No state library was added.

## Validation commands and results
| Command | Result |
|---|---|
| `npm test` | 21 tests passed, 0 failed (14 for the model, 7 for the store) |
| `npm run typecheck` | exit 0 |
| `npm run lint` | exit 0, no findings |

## Runtime/browser evidence
Not applicable: the model isn't connected to the scene yet, and the running app is unchanged.

## Regression checks
No existing source file was modified, so the Void, the geography and Classic are untouched.

## Known limitations
- Tests run on Node's built-in runner with native type stripping (Node ≥ 22.18). The test files sit outside `src`, so `tsc` doesn't typecheck them, because `@types/node` isn't installed and adding it needs your approval. ESLint does lint them.
- Timing constants are provisional engineering defaults. The final route and pacing are pending your approval (doc 07).

## Acceptance checklist
- [x] Typed region IDs (reuses the M3 `RegionId`)
- [x] Route order that matches the locked order (tested)
- [x] Progress, transition state and navigation requests modelled
- [x] No duplicate or conflicting state: one `position`, one scroll target, one active navigation
- [x] Testable model, with automated tests

## Git checkpoint
Not committed; this run has no commit authorization.

## Next stage
M1-R2 Camera target registry.
