# M4 THE WORLD FORGE: design proposal (design gate)

Status: **PROPOSED, waiting on owner approval.** No centrepiece geometry will be created or replaced until you approve it.
Date: 2026-11-21 · Governing rules: doc 06 §02, doc 16 M4 design gate, master doc M4.

## 1. Audit summary (what exists today)
| Item | Current state | Constraint it creates |
|---|---|---|
| Forge placeholder | `regions/void/DistantForge.tsx`, at the world origin, rotated by `REFERENCE_YAW`. It has three octagonal terraces (r 32→11, top at y 16), three leaning fractured pillars (y 14–48) around an amber core shaft (y 16–42), a crown ring (r 8.5, y 45), four flanking towers on the terraces (r 15, 14–20 tall) and a faint light column up to y 165. | It is **part of the locked M2 opening**: you see this silhouette framed inside the gateway from the Void. The final Forge must keep this distant read. |
| Forge ward (M3) | Broken ring wall, r 58, open to the south (−62°…62°, Void approach and Sanctum avenue) and the east (94°…116°, Archive avenue). | The Forge has two "fronts": south (arrival) and east (departure toward the Archive). |
| Routes (M3) | `sanctum-forge` arrives from the south-east to about [38, 0, 31]. `forge-archive` leaves east from about [46, 0, −14]. | The terraces must meet these route ends; no new routes are needed. |
| Region footprint | `world-forge` anchor [0, 0, 0], footprint 60. | The Forge stays inside r ≈ 58. Nothing moves. |
| Camera (M1, provisional) | The World Forge stop looks from offset [48, 30, 82] at y 20. Today that view is a dark octagon with a bright yellow shaft and an empty dark sky (see audit captures). | Arrival framing is set per region in `REGION_FRAMINGS`; M4.7 replaces this entry. |
| Look today, up close | It reads as a placeholder: flat terraces, unlit stone, a saturated yellow core, no scale cues, no warmth on the stone, a flat black sky. | This is what M4 has to solve. |
| Projects | `src/data/projects.js` holds 7 projects (verification belongs to M5). | Reserve space for about 7 monuments (6–8), without building them. Monuments are M5. |

## 2. Directions considered
The locked distant silhouette rules out most alternatives, so I'm presenting one direction and listing what I rejected:
- **Rejected: a new shape** (for example a floating orrery, a crystal spire or a hollow sphere). It would change the approved Void opening and needs an M2 unlock.
- **Rejected: an industrial forge/foundry** (furnaces, chimneys, anvils). Doc 02 forbids literal blacksmith imagery.
- **Recommended: "The Crucible of Worlds"**. Keep the approved silhouette and develop it, up close, into a monumental stone engine where worlds are made. Every element below already exists in the placeholder; M4 gives it architecture, light and purpose.

## 3. Recommended direction: The Crucible of Worlds
**Idea in one line:** three ancient stone pillars hold a molten seam of light; above them a broken crown ring catches it and sends it skyward. The terraces around them are where finished works stand (the project monuments, M5). It is a place of making, without any tools.

### 3.1 Spatial composition (top view, south = Void side)
```
                         N (Horizon behind)
                    .  ward wall  .
               .                      .
            .      T1 outer terrace      .          E opening ──► Archive avenue
          .     ┌──── T2 monument ring ───┐  ═══════════════════════
         .      │   T3 core dais          │   east stair
         .      │     ▲ pillar  ▲ pillar  │
         .      │        ◉ core seam      │
          .     │          ▲ pillar       │
            .   └─────────────────────────┘
               .   ▒ south grand stair ▒  .
                    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
                 (open to the Void approach + Sanctum route from SE)
                         S (Void)
```
- **One axis, two fronts.** A wide south grand stair rises from the Void approach through all three terraces to the core dais. A narrower east stair links T2 to the Archive avenue. The north and west faces are sheer terrace walls, so the Forge looks finished from the Void but reads as a working structure, not a building lobby.
- **Monument ring (T2).** About 7 plinth sites (6–8) on an arc facing south and south-east, so they sit in the arrival view and the M5 focus camera can frame each one against the core. M4 builds empty plinths only.

### 3.2 Layers, scale and silhouette (envelope stays as approved)
| Layer | Form | Scale (world units, ≈ metres) |
|---|---|---|
| **Foundation** | The three octagonal terraces become cut-stone tiers with chamfered edges, buttressed retaining walls and a thin amber seam where each tier meets the next (echoing the amber slit in the Void gateway). The bottom tier merges into the ground with rubble skirts, so it doesn't sit on the plain like a cake. | Same radii and heights as today: T1 r 32, T2 r 20, T3 r 13.5, top y 16 |
| **Core** | Three fractured pillars keep their inward lean. Each gets carved faces, broken edges near the top and bracing bands. Between them, a **molten seam**: a narrow vertical slot of amber light, not a glowing cylinder. Its brightness falls off toward the top and pulses very slowly (static under reduced motion). | Pillars y 14–48; seam y 16–42 |
| **Crown** | The ring becomes a segmented stone halo with gaps (deliberately unfinished: "still being made"). It's carried on the three pillar tips with a thin inner filament of amber. It is static by default; a very slow drift is optional (your call). | Ring r 8.5 at y 45 |
| **Orbit** | Restrained, two parts. (a) The four flanking towers stay as obelisk-like sentinels on T1/T2. (b) **At most 5 worked-stone fragments** (the same cut-block language as the Void's floating stones) hang at crown height and turn slowly around the axis. No planets, no random props. | Fragments 1.5–3 units, r 14–20, y 38–52 |
| **Terraces** | The stairs, landings and monument plinths above, plus low parapets. The route ends from M3 meet the stair feet exactly. No floating slabs. | Within the ward r 58 |
| **Atmosphere** | See 3.4. | — |

The silhouette is kept by construction: every new element stays inside the current outline seen from the Void. I'll check this with the existing Void pixel comparison at 7 viewports. Any visible change in the opening shot comes back to you before it's kept.

### 3.3 Materials
- **Stone:** the existing cold stone and dark stone (unchanged colour family) with more variety from geometry (chamfers, carved faces) and a few tint variants per tier, not textures. Optionally, subtle vertex-colour weathering at the bases.
- **Accent:** amber only where light comes from the core (seam, tier seams, crown filament, plinth inlays). It's tuned down from today's saturated yellow toward the gateway's warm amber `#d8a35c` family. Pale blue/white stays as the cold moon rim light.
- No metal tools, no neon, no glossy surfaces.

### 3.4 Lighting and atmosphere
- **Core light.** One warm point light inside the core, with a limited distance, that lights the inner pillar faces and the upper terraces. This makes the Forge the first warm light in the world. Everything else stays cold.
- **Moon rim.** The existing key light keeps rimming the silhouette.
- **Embers.** A few hundred faint ember points rise slowly through the seam and vanish below the crown. They're hidden under reduced motion and on low-power mobile.
- **Sky (DEC-002).** I propose a subtle world sky gradient: dark zenith, faint cold horizon band. It fades in exactly as the Void's horizon glow fades out, so the opening stays pixel-identical. It fixes the flat black sky behind the Forge and every other non-Void view. This is optional, so tick it separately in §6.

### 3.5 Camera reveal and interaction (connects to the M1 system)
- **Arrival from the Sanctum.** The camera follows the south-east avenue in low, then rises as it reaches the ward opening, so the crown crosses the top of the frame. That's the reveal.
- **Settled view.** A three-quarter view from the south-south-east, about level with T2. The Forge fills about 55–60% of the frame height, the seam sits slightly left of centre, and the monument ring sits in the lower foreground. The right side stays clear for the M5 dossier panel.
- **Activation (master P1 "Forge activation").** On arrival the seam brightens and the embers swell once over about 1.2 s, then settle. This is skipped under reduced motion. It's purely visual and never blocks input.
- **Departure to the Archive.** The camera swings around the east side and exits through the east opening.
- **Interaction.** The Forge itself isn't clickable. The monuments (M5) are the interactive targets. The M1 single-camera rule is unchanged: only `REGION_FRAMINGS` and the journey path change.

### 3.6 Mobile and responsive simplification
- **Portrait framing.** Pulled back and higher, so the whole vertical silhouette (dais to crown) fits, with monuments at the bottom.
- **Low-power tier.** Ember count reduced or removed, orbit fragments 5 → 3, crown drift off. The structure and lighting stay the same, so the landmark reads identically.

### 3.7 Asset needs
**None external.** Everything is procedural in code, like M2 and M3: no downloads, no licences, no new dependencies. The master doc allows "sourced architectural details", but I recommend not adding any for M4 and revisiting at M9 only if something is clearly missing.

### 3.8 Performance budget and risks
| Budget | Target |
|---|---|
| Forge draw calls | ≤ 40, using instancing for repeated parts (buttresses, plinths, steps) |
| Forge triangles | ≤ 40k |
| New lights | 1 point light, with a limited range |
| Particles | ≤ 400 points, 1 draw call |

**Risks:**
- The point light adds a cost to every lit material. I'll measure it, and fall back to a baked emissive glow if it's too expensive.
- Detail could clutter the distant read. I'll keep detail mostly near the dais and check the silhouette every stage.
- The orbit fragments could look like "random floating props". There are at most 5, all in one language, and you decide whether to include them.

## 4. Stage plan after approval (doc 16)
- **M4.1** Blockout and silhouette: Void silhouette check.
- **M4.2** Core architecture.
- **M4.3** Crown.
- **M4.4** Orbit (if approved).
- **M4.5** Terraces, stairs and plinths, plus the route connection.
- **M4.6** Materials, lighting and atmosphere (plus the sky, if approved).
- **M4.7** Arrival framing, reveal and activation.
- **M4.8** Responsive and performance pass.
- **M4.9** Acceptance and your visual review.

Each stage gets a report and regression checks: Void pixel comparison, M3 geography unchanged, all tests.

## 5. Not in M4
- Project monuments' content and dossiers (M5).
- Changes to other regions.
- The World Map.
- Audio.
- Changes to the Void beyond the silhouette-preserving refinement of the same Forge object.

## 6. Decisions requested
1. **Approve "The Crucible of Worlds"** as the M4 direction, or redirect.
2. **Orbit fragments:** include up to 5 slow fragments, or the sentinels only?
3. **Crown:** static, or a very slow drift?
4. **World sky gradient (DEC-002):** include in M4.6, or defer to M8?
5. **Monument plinths:** reserve 7 sites (matching today's projects), with the final count confirmed in M5?
