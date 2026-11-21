# Decision Log — autonomous run

Locked decisions are listed in `THE_WORLD_FORGE_AUTONOMOUS_DOCS/14_DECISION_LOG.md`. These are decisions raised during execution. None are owner-approved unless marked.

## DEC-001 — Provisional M1 camera route and pacing
- Date: 2026-11-21 · Area: camera/scroll · Milestones: M1 (affects M4–M9)
- Decision: functional provisional framings per region (relative to M3 anchors); a centripetal Catmull-Rom path with a 13% sin² travel arc; camera travel only, no world rotation. Timing: navigation 1.3 s + 0.35 s/stop (max 3 s), scroll settle after 0.32 s, 600 wheel px = 1 stop, 320 touch px = 1 stop. Reduced motion: at most 0.35 s, one step per gesture.
- Alternatives: world-group rotation or a hybrid (doc 07) — not chosen without a design proposal.
- Rationale: makes the existing world traversable and testable without committing to the final route, which doc 07 and the decision log reserve for you.
- Files: `camera/cameraTargets.ts`, `camera/journeyPath.ts`, `experience/experienceStore.ts`, `input/scrollInput.ts`
- Status: **ACCEPTED as provisional with M1 approval (2026-11-21, owner: "it's good… proceed")**. Each region milestone (M4–M8) replaces its own framing.

## DEC-002 — Void horizon glow fades when the journey leaves the Void
- Date: 2026-11-21 · Area: Void integration / atmosphere
- Decision: the flat `HorizonGlow` backdrop (built for the opening camera only) fades to invisible over the first 0.45 stops. It's fully opaque at the Void, so the opening is pixel-identical.
- Why: seen from any other camera its billboard edges appeared as hard wedges across the sky.
- Consequence: views other than the Void now have a flat dark sky, including the Horizon, whose name implies horizon light. **A world sky/horizon treatment for non-Void views is an open creative decision** (likely part of the M4 atmosphere and M8 Horizon design).
- Status: **Fade ACCEPTED with M1 approval.** The sky treatment is proposed as an optional M4.6 item (see the M4 proposal §3.4) and needs your decision.

## DEC-003 — Narrow-layout hero raised to clear the bottom navigation
- Date: 2026-11-21 · Area: Void UI (mobile/portrait)
- Decision: in the `max-aspect-ratio: 5/4` layout, the hero block's bottom offset changed from `max(28px, safe-area)` to `max(16px, safe-area) + 76px`, a 48 px rise, so the locked bottom-centre nav and cue don't overlap it. The 3D scene is unchanged.
- Alternatives: (B) hide the nav at the Void on narrow screens (hurts discoverability); (C) put the nav at the top on narrow screens (conflicts with the locked bottom-centre placement).
- Status: **ACCEPTED with M1 approval (2026-11-21)**. Can be revisited.

## DEC-004 — Test tooling without new dependencies
- Decision: Node's built-in test runner plus native TypeScript stripping and a small resolver hook (`tests/world-forge/register.mjs`); `npm test` script added. Test files live outside `src` and aren't typechecked by `tsc`, because `@types/node` isn't installed.
- Option: approve `@types/node` (dev-only) to typecheck tests.
- Status: **IMPLEMENTED — optional owner decision on `@types/node`**

## DEC-005 — Development-only automation handle
- Decision: `window.__worldForge = { store }`, only when `import.meta.env.DEV`; verified absent from the production bundle.
- Rationale: the original M1 deliverable "Navigation testable"; lets browser automation drive and inspect the journey.
- Status: **IMPLEMENTED — owner may veto**

## DEC-006 — M1 locked
- Date: 2026-11-21 · The owner reviewed the running build and approved ("it's good… proceed"). M1-R9 is complete. M1's architecture (single store, single camera writer, input priority) is now a locked contract for M4–M9.
- Status: **OWNER-APPROVED**

## Open items carried forward (not decided)
- **World Map:** master doc §8/§9 make it the "primary navigation entry" (a clean illustrated SVG map), and the master M3 lists "World map reflecting geography". Not built (doc 05: not in M1). It needs a design and scheduling decision.
- **Controls fading after inactivity** (master doc §9): not implemented. It's UI polish with rules (no fading while focused, open or interacting).
- **Mobile "simplified camera / reduced camera travel":** depends on DEC-001.
- **Worlds Beyond target is dark** at its distance because of the world fog: an M7 design item.
- **Display typography:** the master doc locks an "elegant cinematic display font"; the World Forge still uses the inherited fonts.
