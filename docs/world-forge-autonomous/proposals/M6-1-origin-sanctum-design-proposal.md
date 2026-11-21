# M6.1 Origin Sanctum: content audit and design proposal (design gate)

Status: **PROPOSED, waiting on your approval.** No Sanctum geometry, panel or content module will be coded until you approve it (doc 16 M6.1; doc 06 approval protocol).
Date: 2026-11-22.
Governing rules:
- master doc §6 Region 01, §8 Origin Sanctum, M6A acceptance
- doc 06 (region template)
- doc 08 (panels, mobile, accessibility)
- doc 11 (content)
- doc 12 (assets)
- DEC-010 (the blueprint images are the look reference)
- DEC-025 (the CV is the content source)

## 1. Content audit (M6.1 step 1)
The full table is in `../content/CONTENT_INVENTORY.md` under "Origin Sanctum".

**Available, with sources:**
- **Identity line** "Engineer · Creator · World Builder" and the **hero statement** "I build systems, create experiences, and explore ideas that haven't yet taken form." Both are owner-written in the master doc.
- **Name:** "Balam Reneesh" (CV and Classic).
- **Role, specialization and mission** (Classic's `profile.js`, already published):
  - role: "AI Systems Engineer & Full-Stack Developer";
  - specialization: "Generative AI, ML, React Architecture";
  - mission: "Building systems that learn, remember, and respond."
- **Biography:** two paragraphs (Classic, published).
- **Education:** B.Tech, Computer Science and Engineering, Lovely Professional University, Aug 2023 – present (CV).
- **Current work** (CV):
  - Machine Learning Intern, MacBease Connections, Nov 2025 – present;
  - Full Stack Developer, freelance, Jan 2026 – present.
- **Languages:** C++, JavaScript, Python (CV).

**Conflict, settled by DEC-025:** the CGPA is 6.91 in Classic and 6.86 in the CV, so the CV wins. The full education record belongs to the Path of Ascension anyway (M6.3).

**Missing everywhere:** the master doc lists these for the Sanctum, but no source has them:
- the **problem-solving approach**;
- the **creator and game-development ambitions**;
- **availability**: Classic's "Actively seeking roles" is marked in its own code as a placeholder to verify, and the CV doesn't mention it.

All three are left out unless you supply text.

**Privacy:** the CV's phone number and email don't appear in the Sanctum. Contact belongs to the Horizon (M8).

## 2. Recommended direction: "The Quiet Court"
**Idea in one line:** an open-air sanctum on the emerald island. A ring of weathered pillars surrounds a still pool, three identity fragments hang above it, and waterfalls spill off the island's edge. The golden Forge stands on the horizon: the origin, looking toward the work.

### 2.1 Environment, composition and scale
```
            settled view (desktop)                         plan (top view)
┌──────────────────────────────┬────────────┐         Forge (hub) ↑
│ sky          ▲ Forge beam    │            │      ≋ waterfalls ≋
│      ◇ Explorer              │            │   ◇ Engineer   ◇ Creator
│ ◇ Engineer ⌒halo⌒ ◇ Creator  │   panel    │     ┃  ( pool )  ┃   court ≈ 36 m
│   ┃ ┃ ┃  ( pool )  ┃ ┃ ┃     │   space    │     ┃ ┃  ┃ ┃  ┃ ┃   pillar ring
│ ══ court, pillars, terraces ═│            │       ◇ Explorer
│                              │            │   terraces step down
└──────────────────────────────┴────────────┘       camera ● (outer side)
```
- **Island:** the existing emerald island from P2. Its top becomes two or three low, grassy terraces stepping up to the court. This is the look of the blueprint's verdant island: terraced green, mossy ruins and waterfalls.
- **The court:** a circular stone floor about 36 m across. A ring of 10–12 weathered pillars surrounds it; two or three are broken short to suggest a ruin, and a few carry a fragment of lintel. It replaces the P2 placeholder (colonnade, obelisk and crystal).
- **The origin:** a still, dark reflecting pool at the centre with a thin emerald rim of light. A few faint emerald motes rise from it, as ambient "subtle energy".
- **Three identity fragments:** three floating stone platforms around the court at different heights. Each is linked to the court by a few floating stepping stones and carries one abstract suspended form, with no text:

  | Fragment | Form | Idea |
  |---|---|---|
  | The Engineer | three nested rings around a cube core, like a gyroscope | order, systems |
  | The Creator | an open arch with a crystal shard half-assembled inside it | something taking form |
  | The Explorer | a tall lantern mast whose pointer slowly turns outward, over the archipelago | reaching outward |

- **Suspended architecture:** a broken stone halo, half a ring, hangs above the court and drifts very slowly. A handful of floating rocks hang beneath the island.
- **Waterfalls:** two, off the far edge (reusing the M4 waterfall).
- **Scale:**
  - every structure stays under about 30 m tall, so the Sanctum reads as quiet beside the 320 m Forge;
  - the island's footprint on the map and in the overview doesn't change.

### 2.2 Materials, palette, lighting
- **Colours:**
  - moss and grass greens (the P2 island top);
  - pale weathered stone;
  - emerald (`#3fd08a`, the Sanctum's region colour) for all energy and edge light;
  - amber appears only on the golden route, so the Forge stays the brightest thing.
- **Lighting:** no new lights or textures. It uses emissive edges, the existing sky and fog, and the M4 rim-light approach.
- This is the calmest of the central regions, with the lowest visual density.

### 2.3 Camera
- **Arrival.** After the reveal, the camera descends to the island and settles on its **outer side, looking back across the court toward the hub**: the court in the foreground, the fragments in a triangle, the Forge's beam on the horizon.
  - Today's P5 framing for this stop looks from the hub side, which leaves the Forge behind the camera.
  - On desktop the court sits left of centre, keeping the right ~40% clear for the panel, as at the Forge.
- **Fragment focus** ("minimal focus", master §8):
  - a short ease of about 1 s, no more than about 20% closer, toward the chosen fragment, with no orbit;
  - switching fragments glides as works do in M5;
  - closing returns exactly to the settled view.
- **Exit to the Forge:** the camera lifts and follows the golden route to the hub, with the Forge ahead the whole way.
- **Reduced motion:** moves of 0.35 s or less, and no drift, motes or turning pointer.

### 2.4 Content presentation (screen-space, readable)
- **No text in the world.**
- **Sanctum card:** screen-space, lower left. It appears only when the camera has settled at the Sanctum, using the same pattern as the M5 Works index. It shows:
  - the name, the identity line and the mission;
  - **About**, which opens the overview;
  - a fragment index: **Engineer · Creator · Explorer**.

  It works fully by keyboard and touch; clicking the fragments in 3D is optional.
- **Panel:** the same panel system as the project dossier (right side on desktop, a sheet on phones). It has four views: Overview, The Engineer, The Creator and The Explorer.
  - Previous/next and ← → switch views; Escape or ✕ closes.
  - The overview opens directly, without visiting any fragment (M6A acceptance).
  - A "Continue to the World Forge" button sits at the panel's foot; scrolling also continues.

### 2.5 Exact copy (DRAFT: assembled only from the sources; nothing invented)
| View | Copy | Source |
|---|---|---|
| Overview | **Balam Reneesh** | CV, Classic |
| | Engineer · Creator · World Builder | master doc (locked) |
| | AI Systems Engineer & Full-Stack Developer | Classic |
| | "A Computer Science student and AI systems builder focused on turning complex ideas into practical products. I work across generative AI, machine learning and full-stack development, connecting intelligent backends with interfaces people can actually use." | Classic biography, paragraph 1. Its opening "I'm Reneesh Balam," is dropped because the name is the heading. |
| | "Building systems that learn, remember, and respond." | Classic (mission) |
| | Resume ↗ (opens `/resume.pdf` in a new tab) | repository file |
| The Engineer | Studying: B.Tech, Computer Science and Engineering, Lovely Professional University (Aug 2023 – present) | CV |
| | Now: Machine Learning Intern, MacBease Connections (Nov 2025 – present) · Full Stack Developer, freelance (Jan 2026 – present) | CV |
| | Works across generative AI, machine learning and React architecture, in C++, JavaScript and Python | Classic (specialization), CV (languages) |
| | *Problem-solving approach* | **none: supply it, or it's left out** |
| The Creator | Eight works stand in the World Forge, led by NeuroPlay Engine, AETHERION and NutriFit AI. Button: "See the works" (travels to the Forge) | M5 (the works themselves) |
| | *Creator and game-development ambitions* | **none: supply them, or they're left out** |
| The Explorer | "I build systems, create experiences, and explore ideas that haven't yet taken form." | master doc (hero statement) |
| | "I'm most interested in systems that learn, remember and respond, whether that means building AI assistants, behavioural intelligence engines or real-time safety platforms." | Classic biography, paragraph 2 |
| | Button: "Continue to the Worlds Beyond" (interests, M7) | navigation only |

Headings such as "The Engineer" come from the master doc. Classic itself stays unchanged.

### 2.6 Interaction flow (master §8: select → highlight, light, minimal focus, panel)
1. **Arrive.** The camera settles and the Sanctum card fades in.
2. **Select a fragment**, from the card or by clicking it in 3D. Its emerald edges brighten, the camera eases a little toward it, and the panel opens on that view.
3. **Switch** with previous/next or ← →. The camera glides between fragments; "Overview" moves the camera back to the settled view.
4. **Close** with ✕, Escape or the dimmed world. The view and focus are restored.
5. **Existing rules apply:** scroll travel is blocked while the panel is open (M1), and the bottom navigation or World Map closes the panel first and then travels (M5).

### 2.7 Mobile, accessibility, reduced motion
- **Phones:**
  - the settled view pulls back so the court sits in the upper half;
  - the card is compact above the bottom navigation: name, identity line, and a row with About plus the three fragments;
  - the panel is a full-height sheet;
  - tap targets are at least 44 px.
- **Accessibility:**
  - the card is a labelled region;
  - the panel is a labelled dialog, with focus moved in and trapped, Escape closing the topmost layer, and focus returned afterwards;
  - links say they open in a new tab;
  - hover is never required.
- **Reduced motion:** no drift, motes, turning pointer or panel slide, and short camera moves.

### 2.8 Architecture (extends the M1/M4/M5 contracts; nothing replaced)
- **Content:** `content/sanctum.ts`, typed, with a source and status for every line. It uses the same `isDisplayable` rule as `projects.ts`.
- **Scene:** `regions/sanctum/` holds:
  - the court, pillars, pool, fragments, halo and waterfalls;
  - a pure `sanctumLayout.ts` with unit tests.

  Geometry is baked per material, as in M4/M5. The P2 Sanctum placeholder is removed from `RegionLandmarks.tsx`.
- **Store:** project focus is generalised so a fragment can be focused at the idle Sanctum stop, just as a work can at the idle Forge stop. `focusProject` keeps its current behaviour.
- **Camera:** `CameraRig` stays the only camera writer. Fragment focus poses sit beside the project focus poses, and the Sanctum framing changes as described in 2.3.
- **Panel:** the dossier's shell (scrim, dialog, header, footer, focus trap and dismiss layer) is shared by both panels. The dossier's behaviour, and the M5 probes that check it, stay the same.

### 2.9 Performance budget and risks
- **Budget:**
  - at most 8 extra draw calls at the Sanctum stop, net of the removed placeholder;
  - at most 20k triangles;
  - no new lights and no textures;
  - motes capped at 60 points, and off on the low tier.
- **Risks:**
  - The Sanctum is also seen from afar, in the reveal and the overview. Its silhouette has to stay quiet beside the Forge.
  - Panel text has to stay short on phones.
  - The new camera framing changes the reveal → Sanctum → Forge path, so the journey tests and probes run again.

### 2.10 Assets
- Recommended: procedural only, as in M2–M5. That means no downloads, no licences and no new dependencies.
- The master doc suggests sourced ruins and pillars for the Sanctum. CC0 candidates can be presented instead if you prefer (still an open item in STATUS).

### 2.11 Explicit non-goals
- No 3D text, card wall, portrait, puzzles or unlocks.
- No audio and no free roam.
- No full timeline, CGPA, certificates or AniCos story: those belong to the Path of Ascension (M6.3).
- No contact details: those belong to the Horizon (M8).

## 3. Stage plan after approval (doc 16 M6.1)
1. Content audit: **done here**, finalised with your answers.
2. Design proposal and approval: **this gate**.
3. Blockout and layout.
4. Architecture and environment.
5. Content presentation.
6. Arrival, exit and camera.
7. Interaction.
8. Responsive, accessibility and performance.
9. QA and lock: **your stop**.

I'll send screenshots after the blockout stage and after the environment stage, so you can redirect early. They don't pause the work. Each stage is committed when it passes its checks.

## 4. Decisions requested
1. **Direction:** approve "The Quiet Court", or redirect it. The court and pool, the three suspended fragments, the waterfalls and the Forge on the horizon can each be changed on their own, as can each fragment's form.
2. **Copy:** approve the DRAFT copy in 2.5. Three items have no source anywhere: your **problem-solving approach**, your **creator and game-development ambitions**, and **availability**. Supply text, or they're left out.
3. **Camera:** may the Sanctum's settled view turn to look back toward the Forge? This changes the P5-approved framing for this one stop.
4. **Assets:** procedural only (recommended), or present sourced CC0 ruins?
