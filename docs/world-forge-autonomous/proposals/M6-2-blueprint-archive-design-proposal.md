# M6.2 Blueprint Archive: skills inventory and design proposal (design gate)

Status: **PROPOSED, waiting on your approval.** No Archive geometry, panel or skills module will be coded until you approve it (doc 16 M6.2; doc 06 approval protocol).
Date: 2026-11-22.
Governing rules:
- master doc §6 Region 03, §8 Blueprint Archive, M6B acceptance;
- doc 06; doc 08 (panels, mobile, accessibility); doc 11 (content);
- DEC-010 (the blueprint images are the look reference);
- DEC-025 (the CV is the content source).

## 1. Skills inventory and categories (M6.2 steps 1–2)
The full table is in `../content/CONTENT_INVENTORY.md` under "Blueprint Archive", with the evidence for every line.

**Categories:** the master doc's four, unchanged.

| Category | In use (with evidence) | Exploring |
|---|---|---|
| **AI & Intelligence** | machine learning · LLM applications · RAG · embeddings and vector search · AI agents (LangGraph) · LangChain · clustering (HDBSCAN) · scikit-learn · computer vision | deep learning (PyTorch) · Hugging Face |
| **Software Engineering** | Python · JavaScript · C++ · React · Next.js · Node.js and Express · FastAPI · Django and DRF · Flask · WebSockets · Streamlit · HTML and CSS, Tailwind CSS, Bootstrap | — |
| **Data & Infrastructure** | MongoDB, MySQL · FAISS · Redis · Kafka · Celery, BullMQ · Docker · AWS (EC2, RDS, S3; Certified Cloud Practitioner) · Git and GitHub · Pandas, NumPy · Matplotlib, Plotly | — |
| **Game Development** | gameplay data and analysis (NeuroPlay Engine, Game Stats Dashboard) | Three.js / WebGL |

**What the audit found:**
- **No ratings.**
  - Classic's levels (Core / Applied / Exploring) and its logo grid are not carried over.
  - Each skill is either **in use**, shown with what it was used in, or **exploring**. This is the master doc's "experience vs learning clear".
- **Evidence links to the works.** A skill used in a work shows that work. Choosing it travels to the World Forge and opens that work's dossier (master §8: "Related project opens dossier").
  - Example: FastAPI → NeuroPlay Engine, AETHERION, NutriFit AI, FinLit AI.
  - Roles, training and the certificate show as plain labels: Freelance, Internship, Training, Certificate.
- **Left out**, because no source has them:
  - fine-tuning;
  - TypeScript.
- **Left out by default**, because they appear only in Classic's list, with nothing behind them:
  - C;
  - GitLab, Postman, Render, Netlify, Seaborn, Chart.js, Canva.

  Say if any should stay.
- **Game Development has no engine in any source.** I propose it shows what is real:
  - gameplay data and analysis (two works) as experience;
  - Three.js / WebGL as exploring.

  If you use or are learning an engine, name it and it goes in.

## 2. Recommended direction: "The Drafting Hall"
**Idea in one line:** the blue archive island keeps the world's plans. Four great structures stand on a glowing drafting floor as luminous blueprint drawings. Choosing a category *builds* its structure: solid stone and crystal rise through the lines.

That is the master doc's "controlled lines and architecture transformations", and its "select → structure lights".

### 2.1 Environment, composition and scale
```
         settled view (desktop)                          plan (top view)
┌─────────────────────────────┬─────────────┐        hub (Forge) ←
│ sky                         │             │      ┌──────────────────┐
│   ◇        ◇       ◇     ◇  │   panel     │      │  ▢AI   ▢SE        │
│   ▲AI    ▥SE    ⌸DATA  ⌒GAME│   space     │      │  ( drafting floor )│
│ ══ glowing drafting floor ══│             │      │  ▢DATA  ▢GAME     │
│ ▒▒ archive halls, colonnade │             │      │ halls on the rim  │
└─────────────────────────────┴─────────────┘      └──────────────────┘
```
- **Island:** the existing blue archive island from P2. This is the look of the blueprint's "Aether Cliffs" (development, tech, blue): dark cliffs with blue crystal spires.
- **The drafting floor:** a circular stone floor about 50 m across. A blueprint is etched into it in pale blue lines: a grid, concentric rings, and the four structures' footprints.
- **Archive halls:** a low ring of solid stone halls and arches on the island's rim. They give the island a solid silhouette from afar (the World Map, the overview, the Forge) and frame the floor.
- **Four category structures**, in an arc facing the camera. Each has its own silhouette, under about 40 m, so the Forge stays dominant:

  | Category | Structure | Idea |
  |---|---|---|
  | AI & Intelligence | a spire of stacked, offset rings joined by struts | layers of a network |
  | Software Engineering | a stepped tower of interlocking blocks | modules composed into a system |
  | Data & Infrastructure | a cluster of silos linked by bridges and pipes | stores and the flows between them |
  | Game Development | an open arch with pieces orbiting inside it | play, assembled |

- **At rest**, each structure is a **drawing**: thin glowing blue lines, a faint translucent fill, and a small blue crystal on top.
- **Selected**, its solid form **rises through its lines from the base up** (about 0.8 s). Its lines brighten and its crystal flares. The others stay drawings.
- **Lines are thin glowing geometry**, as in M5 and M6.1, not 1-pixel GL lines, so they read at every screen size.

### 2.2 Materials, palette, lighting
- **Colours:**
  - deep slate-blue stone;
  - pale blue-white lines;
  - the Archive's region blue (`#4fb4ff`) for crystals and the built state;
  - amber only on the golden route.
- **Lighting:** no new lights or textures. It uses emissive lines and crystals, and the existing sky and fog.
- The density is medium (master doc), more ordered and technical than the Sanctum.

### 2.3 Camera
- **Arrival:** after the overview pan, the camera settles on the P5 three-quarter view from the hub side. On desktop, the four structures sit in an arc left of centre and the right ~40% stays clear for the panel. Phones centre them, pulled back.
- **No camera travel between categories** (master §8: "switch categories without camera travel"). Selection is shown by the structure building, not by moving.
- **Exit:** to the Path of Ascension, as today.
- **Reduced motion:**
  - a structure appears built at once, with no rise;
  - no drift;
  - the panel opens without its slide.

### 2.4 Content presentation (screen-space, readable)
- **No text in the world.**
- **Archive card:** screen-space; lower left on desktop, above the navigation on phones, top left on phones turned sideways. It uses the same pattern as the Sanctum card. It shows "The Blueprint Archive · Skills" and the four category buttons.
- **Panel:** the shared panel (right side on desktop, a sheet on phones), in the Archive's blue. One view per category:
  - **In use:** one row per skill: the name, then what it was used in. Works show as small buttons; roles, training and the certificate show as plain labels.
  - **Exploring:** a short list, clearly labelled.

  Previous/next and ← → switch categories (the structures rebuild in place). Escape or ✕ closes; scrolling continues the journey.
- **A work button** (e.g. "NeuroPlay Engine") closes the panel, travels to the World Forge and opens that work's dossier on arrival.

### 2.5 Interaction flow (master §8)
1. **Arrive.** The camera settles and the Archive card fades in.
2. **Choose a category**, from the card or by clicking a structure in 3D. The structure builds and the panel opens on that category.
3. **Switch** with previous/next or ← →. The previous structure returns to a drawing and the next one builds. The camera stays.
4. **Evidence.** Choosing a work travels to the Forge and opens its dossier.
5. **Close** with ✕, Escape or the dimmed world. The structure returns to a drawing.
6. **Existing rules apply:** scroll travel is blocked while the panel is open, and the bottom navigation or World Map closes it first and then travels.

### 2.6 Mobile, accessibility
- **Phones:**
  - the four structures are framed in the upper half;
  - the card shows the four categories in one scrollable row;
  - the panel is a full-height sheet;
  - tap targets are at least 44 px.
- **Accessibility:**
  - the card is a labelled region;
  - the panel is a labelled dialog: focus moves in and is trapped, Escape closes it, and focus returns afterwards;
  - skills are a real list, readable in full by screen readers;
  - work buttons say they open the work in the World Forge;
  - hover is never required.

### 2.7 Architecture (extends the existing contracts; nothing replaced)
- **Skills content:** `content/skills.ts`, typed. Each skill has a category, a tier (in use / exploring), evidence and a source.
  - Evidence names works by id. A test checks each named work exists and actually lists the technology, so evidence can't drift from the dossiers.
- **Scene:** `regions/archive/` holds:
  - the floor, halls, structures and crystals;
  - a pure `archiveLayout.ts` with unit tests.

  Lines are baked into one mesh, with per-structure vertex-colour ranges, as in M5 and M6.1. Each structure's solid form is its own mesh, so it can rise. The P2 Archive placeholder is removed.
- **Store:** `archiveCategory` and `openArchive` (honoured only at the idle Archive; direct navigation clears it), mirroring the Sanctum.
  - "Open a work's dossier on arrival" becomes a small store addition: navigate to the Forge with a work to focus once idle.
- **Camera:** `CameraRig` stays the only writer. It is unchanged apart from the Archive framing.
- **Panel:** the shared `FocusPanel`.

### 2.8 Performance budget and risks
- **Budget:**
  - at most 8 extra draw calls at the Archive, net of the removed placeholder, with typically only one structure's solid form drawn at a time;
  - at most 25k triangles;
  - no new lights and no textures.
- **Risks:**
  - Wireframe structures can look thin from far away. The solid halls, the floor and the crystals carry the silhouette at a distance.
  - Some skills have long evidence lists (Python is in seven works), so the panel groups evidence compactly and wraps.
  - The arrival-to-Forge dossier hand-off needs care with the existing travel and focus rules. It will be tested in the browser like the M5 routes.

### 2.9 Assets
Procedural only, as in M2–M6.1, with no downloads and no new dependencies. No technology logos are used: names are text.

### 2.10 Explicit non-goals
- No percentages, star ratings, "levels" or progress bars.
- No logo cloud and no 3D text.
- No camera travel between categories.
- No certificates list or timeline: those belong to the Path of Ascension (M6.3).

## 3. Stage plan after approval (doc 16 M6.2)
1. Skills inventory verification: **done here**, finalised with your answers.
2. Categorization: **done here**.
3. Design proposal and approval: **this gate**.
4. Blockout and layout.
5. Visual presentation: the drawing and built states, and the transformation.
6. Interaction and readability: card, panel, evidence links, the dossier hand-off.
7. Camera and journey integration.
8. Responsive, accessibility and performance.
9. QA and lock: **your stop**.

I'll send screenshots after the blockout and after the visual stage, so you can redirect early. They don't pause the work. Each stage is committed when it passes its checks.

## 4. Decisions requested
1. **Direction:** approve "The Drafting Hall", or redirect any part. The four structures' forms can be changed one by one. The build-on-select transformation can stay, or be replaced by a simpler light-up.
2. **Skills list:** approve the inventory. Two choices are yours:
   - Should any Classic-only items stay (C, GitLab, Postman, Render, Netlify, Seaborn, Chart.js, Canva)? The default is to leave them out.
   - TypeScript and fine-tuning are left out because no source lists them. Add them if they're yours.
3. **Game Development:** show gameplay data and analysis plus Three.js (exploring), as proposed? Or name the engines you use or are learning? Or drop the category?
4. **Evidence links:** may a work button take visitors from the Archive to that work's dossier in the World Forge (recommended)?
