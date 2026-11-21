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

## DEC-010 — Blueprint images are the visual reference
- Date: 2026-11-21 · Owner: "References of how the world should look like; make them look like them if needed."
- The three images in the project root are now the visual reference for the world's look:
  - `The World Forge_ Interactive Portfolio Blueprint.png`
  - `The World Forge Blueprint Interface-1.png`
  - `The World Forge Blueprint Infographic-2.png`

  That look covers the floating archipelago, the purple cloud sea, the purple portal Void, the golden spire-city Forge hub, colour per region, the reveal → Forge → overview → region camera journey, and the world-map UI.
- Where the images conflict with the written visual language or geography (doc 02 "dark/cold… restrained" palette; doc 02 "central landmass"), **the images win**.
- Everything else in the docs stays: identity text, region names and order, no free roam, audio off by default, accessibility, content rules, asset policy.
- Status: **OWNER DECISION**

## DEC-011 — Region names and order stay locked
- Owner: "The locked one."
- The regions stay 00 THE VOID → 01 ORIGIN SANCTUM → 02 THE WORLD FORGE → 03 BLUEPRINT ARCHIVE → 04 PATH OF ASCENSION → 05 WORLDS BEYOND → 06 HORIZON.
- The images' region names (Ember Reach, Frosthold, Stonehold, …) are not used. Their biome looks may be mapped onto the locked regions, subject to owner approval.
- Status: **OWNER DECISION**

## DEC-012 — Projects stay as monuments at the Forge
- Owner: "current plan."
- Projects are monuments at the World Forge (M5 "Forged Works" direction), not one environment per project. The images' per-project environments are not built.
- Status: **OWNER DECISION**

## DEC-013 — Chronoshift is a real project to add
- Owner: "a real project to add."
- The images describe it as an "ML + RAG platform" with a MERN stack. There are no description, status or links yet, so no facts will be shown until you supply them (doc 11).
- The project count becomes 8.
- Status: **OWNER DECISION, content needed**

## DEC-014 — M1–M4 reopened
- Owner: "Yes" (reopen).
- M1, M2, M3 and M4 are reopened to align with DEC-010. The engineering foundation is kept unless the plan says otherwise.
- First step: `proposals/BLUEPRINT-RECONCILIATION-PLAN.md`, approved before any code.
- Superseded by this reopen: DEC-006, DEC-007 and DEC-009, and the "M2 locked" status.
- Status: **OWNER DECISION**

## DEC-015 — No pictures for projects
- Owner: "Remove the pictures and follow the direction of the M4; we need no pictures."
- The World Forge project dossiers use no images. Monuments and dossiers are procedural and text-only.
- Status: **OWNER DECISION**

## DEC-016 — Reconciliation plan approved
- Date: 2026-11-21 · Owner: "Proceed I approve" (on `proposals/BLUEPRINT-RECONCILIATION-PLAN.md`).
- **Taken as approved** (the plan's stated recommendations):
  - sequence P1 → P6, each phase ending with an owner visual review;
  - region-to-biome mapping (§3);
  - journey: reveal on leaving the Void, overview pan after the Forge (§5);
  - a Void intro of at most about 4 s, skippable, none under reduced motion;
  - quick bar plus World Map in P5, minimap and audio deferred.
- **Not decided; safe defaults until the owner says otherwise:**
  - Cloaked figure: not added. Asked again at the P4 design step.
  - Assets: procedural only, the plan's default. No searching or downloading.
  - Chronoshift: no content shown until supplied.
  - Governing docs 02/06: not edited. Overrides stay in this log.
  - **Commits: none.** The owner has not explicitly authorised them, so work stays uncommitted until confirmed.
- Status: **OWNER-APPROVED (plan)**, defaults as listed

## DEC-017 — P1 look approved
- Date: 2026-11-21 · Owner: "Proceed with phase 2, we are good to go" (after viewing `/?lookdev`).
- The P1 blueprint look (palette, sky, cloud sea, island style, spire-city language, glow) is the direction for P2–P5. Rock undersides and mountains are refined in later phases.
- Status: **OWNER-APPROVED**

## DEC-018 — P2 approved; P3 integration decisions
- Date: 2026-11-21 · Owner: "Proceed with phase 3" (after P2).
- **Taken as approved:** P2 archipelago, and the interim Void until P4.
- **Commits remain off** (not explicitly authorised).
- **P3 integration decisions** (recorded before implementation):
  - **Hub scale follows the images' specs:** hub island about 420 m across, main platform 180 m, core about 320 m, 3 levels (platform, forge, observation).
  - **The Void moves from about 200 m to about 420 m south** (`FORGE_Z` −200 → −420), so the larger hub fits with open sky between the islands. The Void's camera and placement math scales with it, the opening pose stays exactly the rig's pose (tested), and P4 rebuilds the Void.
  - **7 gates:** 6 region gates, one aligned with each golden spoke, plus 1 Projects gate opening onto the Projects terrace (8 plinths, 8 projects including Chronoshift, DEC-013). The images specify 7 gates and there are 6 other regions.
  - **The M4 stone crucible Forge is retired** (M4 reopened, DEC-014). The M4 merge pipeline and the activation idea are kept.
- Status: **OWNER-APPROVED (P2)** / **IMPLEMENTATION DECISIONS (P3)**

## DEC-019 — P3 approved; P4 design decisions
- Date: 2026-11-21 · Owner: "Proceed with phase 4" (after P3). **Taken as approved:** the P3 golden spire-city hub. **Commits remain off.**
- **P4 design decisions** (recorded before implementation; owner reviews at the end of P4):
  - **The portal realm replaces the stone gateway.** It has a glowing purple portal ring (about 24 m) with a stone outer ring and a faint energy film, an arrival platform (about 60 m) with a violet rune ring, floating ruins and standing ruin spires.
  - **The hero text is unchanged** (locked identity).
  - **The Void moves to about 800 m** (`FORGE_Z` −780; first set at −700, then increased after exact tests showed the outer observation ring touching the portal rim), so the whole golden city sits inside the portal ring as a distant view. This keeps the approved idea that the opening frames the Forge, and opens the space for the P5 reveal.
  - **Eye height 6.4 m** (on the platform steps), needed for the city to sit inside the ring from about 800 m away.
  - **The Horizon moves from 700 m to 880 m** (fragments beyond to about 1,230 m), so it stays the farthest island (plan §3).
  - **Intro** (DEC-016 limits: at most about 4 s, skippable, none under reduced motion): a "camera letdown". The camera eases down from high behind the platform into the opening (3.5 s) while the portal ignites. Any journey input skips it.
  - **Cloaked figure: not added.** Asked again at the P4 review.
- Status: **OWNER-APPROVED (P3)** / **IMPLEMENTATION DECISIONS (P4)**

## DEC-020 — P4 approved; P5 design decisions
- Date: 2026-11-21 · Owner: "proceed, phase 4 approved".
- **Taken as approved:** P4 portal realm and intro.
- **Cloaked figure:** left out (default; the owner didn't ask for it).
- **Commits remain off.**
- **Note:** the working tree was rewound to the end of P4 after an interrupted session (the earlier P5 work was lost); P5 is re-applied from that point.
- **P5 design decisions** (within the approved plan §5–§7; owner reviews at the end of P5):
  - **Reveal:** the Void → Sanctum segment rises high over the portal (arc 0.32 of its length), looking toward the hub mid-flight, so the archipelago and the golden Forge appear below.
  - **Overview pan:** the Forge → Archive segment climbs higher (arc 0.42), looking back over the hub mid-flight before diving to the Archive.
  - These use `createJourneyPath`'s per-segment arcs plus a new optional per-segment look-at bias. Other segments use the default arc.
  - **Forge framing:** the city sits left of centre and the right ≈ 40% stays clear for the M5 dossier. Narrow screens show it centred (the dossier is a full sheet there).
  - **Every island** gets a narrow-screen framing (pulled back and higher, fixed horizontal coverage).
  - **Quality presets** High / Medium / Low:
    - the starting tier comes from device hints (screen, memory, cores, touch);
    - an automatic step-down (at most twice) applies when the median frame time stays above 25 ms (under 40 fps). It isn't used under reduced motion;
    - `?quality=high|medium|low` locks a tier, for testing and visual review.
  - **Low tier:** pixel ratio 1, no bloom, 2 cloud layers, a quarter of the embers. **Medium:** pixel ratio up to 1.25, bloom kept, embers halved.
  - **World Map:** an accessible screen-space dialog drawn from the geography data (islands, golden routes, names). Choosing a region travels there; Escape closes; scroll is blocked while it's open; focus is restored. Region buttons on phones are at least 44 px.
  - **Quick bar:** after the region button, in the same order visually and by keyboard: Return to the Void, World Map, The World Forge (Projects).
- Status: **OWNER-APPROVED (P4)** / **IMPLEMENTATION DECISIONS (P5)**

## DEC-021 — P5 approved; P6 (M5) scope this round
- Date: 2026-11-21 · Owner: "Proceed with Phase 6 and approved phase 6" (after the P5 report). **Taken as approved:** P5. **Commits remain off.**
- P6 = M5 Project System, following doc 16's order. This round covers **M5.2** (system architecture) and **M5.3** (one representative prototype), then the required **M5.4** owner review stop.
- **Direction:** "The Forged Works" as approved in the reconciliation plan (DEC-016, P6 row): a shared stele plus a distinct emblem per project, a Works index, camera focus and a text-only dossier (no pictures, DEC-015). Monuments stand on the P3 Projects terrace's 8 plinths (8 projects including Chronoshift, DEC-013).
- **Content rule (doc 11):** a dossier shows a field only if it is owner-confirmed, or is the repository text the Classic portfolio already publishes. It never shows conflicting fields (NeuroPlay's description, tech and status), unconfirmed CV figures, untested claims beyond what Classic shows, or anything for Chronoshift until supplied. Development builds mark repository text "DRAFT — awaiting owner confirmation".
- **Prototype:** NutriFit AI, whose repo content and image are consistent (the image isn't used). The other 7 monuments are M5.5, after your content decisions.
- Status: **OWNER-APPROVED (P5)** / **IMPLEMENTATION DECISIONS (M5.2–M5.3)**

## DEC-022 — M5.4 prototype accepted; build all monuments (M5.5)
- Date: 2026-11-21 · Owner: "Check this error and add all the other projects as well".
- **Taken as:** the NutriFit prototype is accepted (M5.4), and the remaining 7 monuments are to be built now (M5.5), with the emblems from the M5 proposal (§2.1).
- **Content rules unchanged** (doc 11, DEC-021). Conflicting, unconfirmed or missing facts stay hidden (NeuroPlay's description, tech and status; AETHERION's tech; CV figures; all of Chronoshift).
  - NeuroPlay's and Chronoshift's dossiers are therefore sparse until you answer the content questions.
  - Chronoshift's dossier shows only its name and a short neutral line, "Details to follow" — a brief, honest note, not invented content.
- **The owner's error report** (`store.focusProject is not a function`) was a stale store kept by Fast Refresh after a hot update, not a source bug. The store module now forces a full page reload when it changes in development.
- Status: **OWNER DIRECTION**; content answers still open

## DEC-023 — M5.6 dossier and focus/close behaviour
- Date: 2026-11-21 · Owner: "Proceed with next phase" (after the M5.5 summary). **Taken as:** carry on to the next doc 16 stage, M5.6. **Not taken as:** answers to the open content questions, or commit permission. **Commits remain off.**
- Scope, held to the M5 proposal (§2.2 steps 3–7):
  - **Switching works** glides the camera from monument to monument (0.9 s, slightly lifted mid-way so it arcs over the terrace). Before, it cut. Resizing while a dossier is open re-frames the same way.
  - **Subdue:** the world dims slightly around the focused work (a soft vignette added to the existing scrim), and the Forge's base glow and beam haze quieten to 55% while a work is focused.
  - **Panel motion:** a short entry (0.26 s) and a cross-fade when switching works; the dossier text starts at the top for each work. All of it is off under reduced motion.
  - **Hover:** a monument's hover glow and pointer cursor no longer stick after a click opens its dossier.
  - **Fix found in M5.6 testing:** once a work was focused, the camera flickered every other frame between the focus view and the overview. It was barely visible at 60 fps but visible on slow devices, and it kept rendering under reduced motion. The focus blend now holds steady.
  - The phone dossier sheet sits a little higher, so it clears the bottom navigation when the region name wraps onto two lines.
- Nothing about content, the emblems or the camera's resting framing changed.
- Status: **OWNER DIRECTION** (proceed) / **IMPLEMENTATION DECISIONS (M5.6)**

## DEC-024 — "Go with what is best": M5.7–M5.8, then M5.9 QA up to the lock
- Date: 2026-11-21 · Owner: "Go with what is best" (after the M5.6 report, which listed review points, the remaining M5 stages and open questions).
- **Taken as:**
  - keep the recommended defaults from the M5.6 review: the subtle subdue vignette, and the current focus framing;
  - carry on through M5.7 (navigation and camera integration) and M5.8 (responsive, accessibility, performance), then run M5.9 QA and **stop for the M5.9 lock**, which is the owner's (doc 16);
  - on content, "best" under doc 11 means keeping unconfirmed facts hidden. NeuroPlay, AETHERION's tech, the CV figures and Chronoshift therefore stay as they are; nothing is invented and nothing is decided on the owner's behalf. The shortened display names stay as they are.
- **Not taken as:**
  - permission to test the project links (it sends requests to GitHub and Vercel);
  - commit permission (the owner's audit flagged earlier inferred commits).

  Both still need an explicit yes. **Commits remain off.**
- **M5.7–M5.8 decisions:**
  - **Works index on desktop** moves to a vertical list at the lower right. The old centred two-row block covered the Projects terrace, which sits lower left in the Forge overview. Phones, portrait tablets and short landscape screens keep the one-row scroller.
  - **Monuments render as two meshes** (all stone; all glowing edges, with per-monument vertex colours) plus the light thread only while lit. Picking uses invisible per-monument boxes, which are also larger touch targets. This brings the monuments within the proposal §2.5 budget.
  - **Fixes from the new probes:** the phone Works row couldn't reach its first works (centred overflow); the phone World Map clipped the Void's marker; the dossier overlapped the bottom navigation by 2–3 px; Previous/Next now name the neighbouring work for screen readers.
- Status: **OWNER DIRECTION** / **IMPLEMENTATION DECISIONS (M5.7–M5.8)**

## DEC-025 — CV as the content source; M5 locked; commits allowed
- Date: 2026-11-22 · Owner, in reply to the M5.9 report (which asked for the M5 lock and listed the open content, link-testing and commit questions): "Cv" · "Everything is in CV" · "PRoceed" · "Commit permssion granted".
- **Taken as:**
  - **"Cv":** NeuroPlay uses the CV's version. Overview, tech stack and dates (Jan – May 2026) now come from `public/resume.pdf`. The site's older "generative AI engine" text is no longer used in the World Forge.
  - **"Everything is in CV":** the CV is the owner-confirmed source for every open content question it answers:
    - AETHERION's tech list is the CV's list. Tailwind, which only the site listed, drops out.
    - The CV figures are shown (~30%, <200 ms, 200+ tasks, ~28,000 samples).
    - The CV's project bullets fill the master-doc dossier fields **Approach** and **Architecture**, close to verbatim. For NeuroPlay, the first bullet becomes the overview.
    - The short name "AETHERION" matches the CV ("Aetherion").
  - **"PRoceed":** the **M5 lock**, since it came in reply to the lock request. M6 starts with its first gate: the Origin Sanctum content audit and design proposal (doc 16 M6.1).
  - **"Commit permssion granted":** commits on `the-world-forge` are allowed. The work QA'd in M5.9 was committed as it stood (`ee17210`); later work is committed stage by stage.
- **Not in the CV, so unchanged:**
  - Chronoshift (its dossier still says "Details to follow");
  - the name "NutriFit AI";
  - the other five works' repository text (still marked DRAFT in development builds);
  - NeuroPlay's display name, which keeps the site's spelling "NeuroPlay Engine" (CV: "Neuro Play Engine").
- **Not taken as:**
  - permission to test the project links (still needs an explicit yes);
  - permission to push, merge or deploy;
  - permission to change Classic. Classic still shows the site's NeuroPlay text and a CGPA of 6.91 (the CV says 6.86); correcting it is a Classic change.
- Status: **OWNER DECISION** (content source, M5 lock, commits)

## DEC-026 — M6.1 Origin Sanctum design approved ("proceed")
- Date: 2026-11-22 · Owner: "proceed", in reply to the M6.1 gate report, which asked four questions (direction, copy, camera, assets) and recommended an answer for each.
- **Taken as approving the proposal as written** (`proposals/M6-1-origin-sanctum-design-proposal.md`) with its recommendations:
  1. **Direction:** "The Quiet Court" as proposed.
  2. **Copy:** the DRAFT copy in §2.5 is approved. No text was supplied for the problem-solving approach, the creator and game-development ambitions, or availability, so all three are **left out**, as the proposal said they would be.
  3. **Camera:** the Sanctum's settled view turns to look back toward the Forge, a change to P5's framing for this stop only.
  4. **Assets:** procedural only.
- **Not taken as:** link testing, Classic changes, or push/merge/deploy.
- Next: M6.1 stages 3–8 autonomously, committed stage by stage, with non-blocking screenshot checkpoints after the blockout and the environment. **M6.1 QA and lock is the owner's stop.**
- Status: **OWNER DECISION** (design gate)

## DEC-027 — M6.1 locked; M6.2 begins at its gate
- Date: 2026-11-22 · Owner: "Proceed, M6.1 Locked and good" (in reply to the M6.1 QA report).
- **M6.1 Origin Sanctum is LOCKED** as built (commits `09e2dae`, `7e5d2eb`).
- **"Proceed"** is taken as starting M6.2 Blueprint Archive at its first gate (doc 16): skills inventory verification, categorization, and a design proposal for owner approval. **No Archive code until that approval.**
- Not taken as: link testing, Classic changes, or push/merge/deploy.
- Status: **OWNER DECISION** (lock)

## Open items carried forward (not decided)
- **World Map:** master doc §8/§9 make it the "primary navigation entry" (a clean illustrated SVG map), and the master M3 lists "World map reflecting geography". Not built (doc 05: not in M1). It needs a design and scheduling decision.
- **Controls fading after inactivity** (master doc §9): not implemented. It's UI polish with rules (no fading while focused, open or interacting).
- **Mobile "simplified camera / reduced camera travel":** depends on DEC-001.
- **Worlds Beyond target is dark** at its distance because of the world fog: an M7 design item.
- **Display typography:** the master doc locks an "elegant cinematic display font"; the World Forge still uses the inherited fonts.
