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
- Status: **RESOLVED in M4.6 (owner-approved via DEC-007).** `atmosphere/WorldSky.tsx`: a gradient dome (dark zenith, faint cold horizon band brightest toward the north) fades in exactly as the glow fades out, through one shared `voidBackdropOpacity`. The opening is unchanged.

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

## DEC-007 — M4 direction approved: "The Crucible of Worlds"
- Date: 2026-11-21 · Owner reply "approve all", which accepts every recommended option in `proposals/M4-world-forge-design-proposal.md` §6:
  1. the direction;
  2. up to 5 orbit fragments plus the four sentinels;
  3. a static crown;
  4. the world sky gradient in M4.6, fading in as the Void glow fades;
  5. 7 monument plinths, final count confirmed in M5.
- Status: **OWNER-APPROVED**. The design is locked for M4.

## DEC-008 — M4 implementation refinements (within the approved direction)
Recorded before implementation, as doc 16 requires:
- **Monument plinths on T1's walkable ring (y 6, r ≈ 22), not T2.** T2's walkable ring is only about 3.5 units wide and already carries the sentinels. T1's is about 6 units wide, fits 7 plinths with real spacing, and the M5 focus camera can frame them against the core.
- **Stairs aligned to octagon faces.** The tiers keep their approved orientation, so the south grand stair faces world bearing −9.5° (the face nearest the Void) and the east stair faces 125.5° (the face nearest the Archive avenue).
- **Route connection.** A paved forecourt in front of the south stair, plus M3-style paving from the existing route ends (`sanctum-forge` at [38, 0, 31], `forge-archive` at [46, 0, −14]) to the stair feet. M3 route data is unchanged.
- **Camera integration (M4.7/M4.8).**
  - `RegionFraming` gains an optional narrow-screen variant.
  - `createJourneyPath` gains an optional per-segment travel arc, so the Sanctum → Forge arrival can dip and rise.
  - Both are backward-compatible extensions; every other stop and segment behaves exactly as before.
- **The placeholder `regions/void/DistantForge.tsx` is retired** and replaced by `regions/forge/`, the same object at the same place and in the same orientation.
- Status: **IMPLEMENTATION DECISION**. Reviewed with M4.9.

## DEC-009 — M4 locked
- Date: 2026-11-21 · Owner reply: "Approve m4".
- Approves the World Forge centrepiece as built (M4.1–M4.8), including:
  - the small changes it brings to the Void opening (seam halo, fractured pillar tips, crown breaks and strut, orbit fragments, tier lines);
  - the DEC-008 refinements.
- The Forge's layout (`regions/forge/forgeLayout.ts`), framing and arrival are now locked contracts for M5–M9. The M5 monuments use the 7 reserved plinth sites (count confirmed in M5).
- Status: **OWNER-APPROVED, LOCKED**

## Open items carried forward (not decided)
- **World Map:** master doc §8/§9 make it the "primary navigation entry" (a clean illustrated SVG map), and the master M3 lists "World map reflecting geography". Not built (doc 05: not in M1). It needs a design and scheduling decision.
- **Controls fading after inactivity** (master doc §9): not implemented. It's UI polish with rules (no fading while focused, open or interacting).
- **Mobile "simplified camera / reduced camera travel":** depends on DEC-001.
- **Worlds Beyond target is dark** at its distance because of the world fog: an M7 design item.
- **Display typography:** the master doc locks an "elegant cinematic display font"; the World Forge still uses the inherited fonts.
