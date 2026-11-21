# Milestone Report — M4 The World Forge

## Scope completed
The approved centrepiece, "The Crucible of Worlds" (DEC-007), was built in its six layers on the M1 journey without redesigning the opening. It is the same object, in the same place and orientation, as the distant Forge in the locked Void shot.

## Stages
| Stage | Status | Report | Commit |
|---|---|---|---|
| Design gate | Owner-approved ("approve all") | `../proposals/M4-world-forge-design-proposal.md` | `dd349d0` (proposal) |
| M4.1 Blockout and silhouette | Implemented, tested, agent-inspected | `M4-1-blockout-silhouette.md` | `8a282eb` |
| M4.2 Core architecture | Implemented, tested, agent-inspected | `M4-2-core-architecture.md` | `e08925e` |
| M4.3 Crown | Implemented, tested, agent-inspected | `M4-3-crown.md` | `51429b2` |
| M4.4 Orbit | Implemented, tested, agent-inspected | `M4-4-orbit.md` | `02cb0fd` |
| M4.5 Terraces and routes | Implemented, tested, agent-inspected | `M4-5-terraces-routes.md` | `4b009b2` |
| M4.6 Materials, lighting, atmosphere (+ world sky, DEC-002) | Implemented, tested, agent-inspected | `M4-6-materials-lighting-atmosphere.md` | `d813836` |
| M4.7 Reveal and interaction | Implemented, tested, real-navigation inspected | `M4-7-reveal-interaction.md` | `efde112` |
| M4.8 Responsive and performance | Implemented, tested, real-input regression | `M4-8-responsive-performance.md` | `1495932`, `f78f267` |
| M4.9 Acceptance and lock | **Owner-approved 2026-11-21 (DEC-009)** | this report | `12f8ed7` |

## Master-plan M4 acceptance (§15)
| Criterion | Evidence |
|---|---|
| Recognizable at distance | The approved silhouette envelope is unchanged. The Void comparison shows the same Forge in the gate at all 6 viewports |
| Integrated into geography | The stairs face the Void and the Archive avenue; paving joins both M3 route ends exactly (tested); everything stays inside the ward; M3 data untouched |
| Clear visual hierarchy | The seam is the single warm focal point. Crown, then pillars, then terraces step down in brightness and detail; amber is used only where core light reaches |
| Monuments distinguishable | 7 plinth sites reserved on the T1 ring with amber inlays (tested clearances). The monuments themselves are M5 |
| Effects do not obscure | Glow, embers and orbit are sparse. All ambient motion is off under reduced motion |
| Acceptable performance before high-detail assets | The Forge costs 19 draw calls (budget 40) and about 5.5k triangles (budget 40k), with 1 range-limited light and 1 particle draw |

## Changes visible in the locked Void opening (for your review)
The Forge is the same object seen from the Void, so building it shows in the opening. Measured against the pre-M4 build:
- **How much changed:** 0.41–0.77% of pixels changed by more than 3. The gateway, framing, horizon glow and hero are unchanged.
- **What changed, all inside the gate around the Forge:**
  - the seam is the same width and slightly brighter, with a soft warm halo;
  - the pillar tips are fractured and carry faint bracing bands;
  - the crown ring shows its segment breaks and one strut;
  - a few small dark orbit fragments sit near the crown;
  - faint amber tier lines appear at the Forge base.
- **Where to look:** `m4-review/01-void-desktop-before-after.jpg`, `02-void-gate-detail-before-after.jpg` and `03-void-mobile-before-after.jpg` (left is before, right is after).

If any of these should not appear in the opening, each is isolated and reversible. For example, the opening could keep plain pillar tips or an unbroken ring as seen from the Void.

## Review images
`m4-review/`:
- `04-forge-settled-desktop.jpg`: the settled World Forge view.
- `05-forge-arrival-desktop.jpg`: mid-arrival from the Sanctum.
- `06-forge-settled-mobile.jpg`: the settled view on mobile.
- `07-world-sky-horizon.jpg`: the world sky at the Horizon stop.

## Validation summary
- `npm test`: 70/70.
- typecheck, lint and build: exit 0. Main chunk 441.20 kB (unchanged); WorldCanvas chunk 908.39 kB (+19 kB over M1).
- Dev handle and renderer stats are absent from production.
- Real-input regression (M1 suites): **70/70 in three consecutive runs.**
  - The probe harness now stamps wheel events the way hardware does.
  - The old dispatch-time stamps faked gesture gaps under software rendering: 1, 3 and 2 steps for one gesture, against exactly 1 step 3/3 with hardware stamps.
  - The product's reduced-motion "one gesture, one step" behaviour was correct throughout.
- Classic: pixel-identical; 0 console problems.

## How to review
```
cd portfolio
npm run dev
```
1. Scroll or press PageDown once to reach the Origin Sanctum, then once more to arrive at the World Forge.
   - Watch the low approach, the rise into the settled view and the one-time swell of the seam.
2. Use the bottom-centre menu to jump to "02 THE WORLD FORGE" directly.
3. Try a phone-sized window.
4. Try your system's reduce-motion setting: everything is still and travel is a short step.
5. Compare the Void opening against your memory of the approved shot (see "Changes visible in the locked Void opening").

## Decisions for you
1. **Approve M4** (lock), or list changes.
2. **The Void-opening changes listed above:** accept, or keep any element unchanged from the Void.
3. Carried from DEC-008: monument plinths on the T1 ring (not T2), and stairs aligned to the octagon faces.

## Milestone status: COMPLETE — owner-approved and LOCKED (DEC-009), including the listed Void-opening changes

## Next milestone
**M5 Project System.** It starts with its required content and interaction design gate: audit the real project content, then design the monument treatment and the selection/dossier behaviour, then your approval before coding.
