# Phase Report — P4 The Void (portal realm)

## Objective
Rebuild the opening as the blueprint's portal realm (plan §2, §9; DEC-016/019): a glowing purple portal ring of about 24 m, an arrival platform of about 60 m, floating ruins and a void horizon. Keep the locked hero text, compose the opening against the new golden hub, and add the approved short intro.

## Implemented
- **`regions/void/Portal.tsx`:** the portal:
  - 22 irregular dark rock segments (varied thickness, depth and gaps) around a glowing violet ring;
  - a faint swirling energy film near the rim, with the centre left clear so the Forge shows through;
  - a low violet light;
  - it **ignites over the intro**, and is simply lit and still under reduced motion.
- **`regions/void/VoidEnvironment.tsx` (rewritten):**
  - the **arrival platform**: a two-tier dais 60 m across with a violet rune ring, portal footings and steps toward the visitor;
  - **16 standing ruin spires** (taller on the portal side) and broken columns on the platform rim;
  - **11 drifting ruins** (column drums and blocks) kept out of the portal opening. Those on the text side stay low, never over the hero text;
  - violet dust.

  Static parts are baked.
- **`regions/void/layout.ts`:**
  - the portal (`PORTAL`, radius 12 m) replaces the gateway on the same sight line, so **the whole golden Forge is framed inside the portal at every viewport**;
  - wide screens: camera 46 m away, portal on the right, clear of the hero text;
  - narrow screens: portal centred above the text, camera 40–52 m away;
  - eye height 6.4 m on the steps.
- **The Void moved to about 800 m** (`FORGE_Z` −780). **The Horizon moved to 880 m** so it stays the farthest island (DEC-019).
- **Intro** (`camera/intro.ts` and `CameraRig`):
  - a **3.5 s camera letdown** from high behind the platform into the opening, as the portal ignites;
  - any journey input (scroll, key, swipe, menu) skips it with a 0.35 s fade;
  - never under reduced motion;
  - `CameraRig` is still the only camera writer.
- **Retired:** `VoidGateway.tsx`, the causeway and the flank rocks (recoverable from git history).
- **Unchanged:** the hero text, scrim, Classic link and bottom navigation.

## Composition checks and fixes
1. **First pass:** the portal's base was cut off at 1440×900, and from a 2.2 m eye height the Forge's base sat below the ring. I raised the eye height to 6.4 m, lowered the wide-screen frame and capped narrow distances at 52 m.
2. **The exact ray test** (each Forge point's ray must cross the portal plane inside the ring) showed the outer observation ring touching the rim (1.01). I moved the Void from 700 m to 780 m.
3. **Visual pass:**
   - The stone ring read as a flat lavender cog. It's now dark, irregular rock, with a dimmer, lower light.
   - The energy film tinted the city purple. Its centre is now clear.
   - Floating blocks crossed the hero text. The text-side ruins now stay low.
   - The inner glow showed false breaks where stone overlapped it in depth. It's now drawn over the stone's inner edge.

## Validation
| Check | Result |
|---|---|
| `npm test` | **70/70**. New `voidPortal.test.ts`, at 7 viewports (1440, 1920, 1280, 3440 wide; 820, 390, 360 narrow), checks that the camera and the 60 m platform are on the Void island, the portal is fully in frame and clear of the text column on wide screens, and the Forge's base, spire top, ring edges and island rim are seen through the portal (exact ray-plane test). It also checks the intro is ≤ 4 s, monotonic and skips within its fade. The existing Void-pose tests still equal the rig at 7 viewports |
| typecheck / lint / build | exit 0. Main chunk 442.03 kB; WorldCanvas chunk 930.52 kB |
| Real-input regression (M1 suites) | **70/70**, 0 console problems (intro skipping works under real input) |
| Void at 6 viewports, intro frames, all 7 stops | Composed as intended; the return to the Void is exact |
| Renderer (whole scene) | Void stop 93 draws / 44k triangles (was 133); Forge stop 79 / 40k |
| Classic | Pixel-identical |
| Dev handle and look-dev page in production | 0 references |

Review images in `p4-review/`:
- `p4-void-desktop.jpg`, `p4-void-tablet.jpg`, `p4-void-mobile.jpg`
- `p4-intro-sequence.jpg` (0.3 s, 1.3 s, 2.3 s, 4.5 s)
- `p4-all-stops-desktop.jpg`

## Known gaps
- **The cloaked figure** from the images is not added (DEC-016 default). Your decision is below.
- **The inner glow now always draws over nearby geometry.** Only the portal's own stone overlaps it today.
- **The journey's reveal** (rising out of the Void toward the Forge) and the overview pan are P5.
- **No real-GPU check.**

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly.

## Decisions for you
1. **Approve P4** (the portal opening and intro), or list changes: portal size or colour, ring style, platform, ruins, intro length or feel.
2. **Cloaked figure:** add a stylised silhouette standing on the platform facing the portal, as in the images, or leave it out?
3. **Commit permission** (still open).
