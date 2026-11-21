# Stage Report — M4.8 Responsive and performance pass

## Objective
Reduced detail and quality scaling where needed; test all views.

## Implemented
- **Narrow-screen framing** (DEC-008):
  - `RegionFraming.narrow` is an optional variant used below aspect 5/4 (the same threshold as the Void layout and CSS);
  - its vertical field of view comes from a fixed horizontal coverage (33°, minimum 50°, cap 72°);
  - the World Forge uses it to centre the whole silhouette, pulled back and higher, above the bottom navigation;
  - every other region is unchanged (no `narrow` entry, so the existing `responsiveFov` behaviour applies).
- **Quality tier** (from M4.4/M4.6): on viewports whose smallest side is under 600 px, 3 orbit fragments and 110 embers. Structure, lighting and silhouette are identical on every tier.
- **Reduced motion:** no orbit motion, no breathing, no activation, no embers. The demand frameloop renders still images.

## Performance (dev renderer counters, whole visible scene)
**Correction to the first version of this report:** it estimated the Forge's own share at about 35 draw calls without measuring. Counting properly against the pre-M4 scene showed **65**, above the approved budget of 40.
- **Fix (follow-up commit):** `regions/forge/mergeStatic.ts` bakes every static piece that shares a material into one geometry, using three.js's own `BufferGeometryUtils` (part of the installed `three` package; no new dependency).
- **Merged per layer:** Foundation 4 draws, Core 4, Crown 3, Orbit 3, Terraces 3, Atmosphere 2.
- **Visual change:** the orbit fragments now turn together as one ring and no longer tumble individually. Otherwise the result is identical: the Void comparison numbers match the unbaked build exactly, and the World Forge stop differs only by motion.

| View | Before baking | After baking |
|---|---|---|
| Void stop, 1440×900 (whole scene) | 143 calls | **97 calls**, 10.8k triangles, 640 points, 10 programs |
| World Forge stop, 1440×900 | 84 calls | **38 calls**, 10.8k triangles, 320 points, 11 programs |
| World Forge stop, 390×844 | 81 calls | **30 calls**, 9.5k triangles, 110 points |
| **Forge's own share** | 65 | **19** (budget ≤ 40), about 5.5k triangles (budget ≤ 40k) |

There is 1 new light (range-limited) and 1 particle draw.

## Validation
| Check | Result |
|---|---|
| `npm test` | 70/70 (new: at 390×844, 360×640 and 820×1180 the whole Forge is in frame and the narrow journey path stays above ground and clear of the Forge) |
| typecheck / lint / build | exit 0. Main chunk 441.20 kB (unchanged); WorldCanvas chunk 904.34 kB (was 888.95, so +15 kB). Index CSS +0.23 kB: Tailwind's automatic source scan picks up a few class-like words from the new 3D files. Unused, and harmless to Classic |
| Dev handle and renderer stats in production | 0 bundle files reference them |
| Real-input regression (M1 suites: scroll, navigation, arbitration, accessibility) | **All passed**, 0 console problems, including "reduced motion: idle region view is a still image" |
| All 7 stops at 390×844 and 820×1180 | Forge centred and complete; other regions as in M1 |
| Classic `?mode=classic` | Pixel-identical (Δ 0); 8/8 sections; no canvas |
| Full-motion Void (desktop and mobile), legacy `?mode=world` | 1 canvas, 0 console problems |

## Git checkpoint
Committed as "M4.8 …" plus the follow-up "M4.8 bake static Forge geometry …".
