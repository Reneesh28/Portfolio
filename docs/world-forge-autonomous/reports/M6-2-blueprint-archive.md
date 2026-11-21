# M6.2 report: The Blueprint Archive ("The Drafting Hall")

Date: 2026-11-22. Branch `the-world-forge`, committed when QA passes. Decision: DEC-028.
Status: **M6.2 stages 4–8 done; QA done. Waiting on your M6.2 lock.**

## What you'll see
- **The island.** After the overview pan, the camera settles over the blue archive island from the hub side.
- **The Drafting Hall.** A pale stone drafting floor is etched with a glowing blueprint: a grid, rings, and each structure's outline. Low gabled archive halls with lit inlays stand on the rim, with blue crystal outcrops between them.
- **Four category structures** stand on the floor as luminous blueprint drawings, each with a small blue crystal:
  - **AI & Intelligence:** a spire of stacked, offset rings joined by struts.
  - **Software Engineering:** a stepped tower of interlocking blocks.
  - **Data & Infrastructure:** silos linked by bridges and a pipe.
  - **Creative & Game Development:** an arch with pieces orbiting inside it.
- **Choosing a category builds its structure.** Pale solid stone rises through the lines from the base up in 0.8 s, the lines brighten and the crystal flares. Choosing another switches the build. **The camera never moves between categories.**
- **Archive card:** "The Blueprint Archive", with AI · Software · Data · Games.
  - Desktop: lower left.
  - Phones: above the navigation.
  - Phones turned sideways: top left.
- **Archive panel:** the shared panel, in blue.
  - **In use:** one row per skill: the name, then the works that use it (buttons) and the roles behind it (Freelance, Internship, Training, Certificate).
  - **Exploring:** listed separately. Only Three.js is exploring.
  - No percentages, levels, stars or logos.
- **Work buttons** (e.g. AETHERION under React) close the panel, travel to the World Forge and open that work's dossier on arrival.

## Skills shown (DEC-028: the CV plus your tech-stack image)
| Category | In use | Exploring |
|---|---|---|
| AI & Intelligence | Machine learning · LLM applications · RAG · Embeddings and vector search · AI agents (LangGraph) · LangChain · Clustering (HDBSCAN) · Scikit-learn · Computer vision | — |
| Software Engineering | Python · JavaScript · C++ · C · React · Next.js · Node.js and Express · FastAPI · Django and DRF · Flask · WebSockets · Streamlit · HTML and CSS · Tailwind CSS and Bootstrap | — |
| Data & Infrastructure | MongoDB · MySQL · FAISS · Redis · Kafka · Task queues (Celery, BullMQ) · Docker · AWS (EC2, RDS, S3) · Git and GitHub · Netlify · Pandas and NumPy · Matplotlib, Plotly and Chart.js | — |
| Creative & Game Development | Gameplay data and analysis · Design (Canva) | Three.js and WebGL |

**Left out,** because they're in neither the CV nor the image: TypeScript, fine-tuning, PyTorch, Hugging Face, GitLab, Postman, Render, Seaborn.

## Stages
| Stage (doc 16 M6.2) | Done |
|---|---|
| Blockout and layout | `regions/archive/archiveLayout.ts`: pure layout in the Archive's own frame (+Z toward the hub). The floor, four structures in an arc, and halls and outcrops kept inside the island's measured rim; everything under 40 m. |
| Visual presentation | `regions/archive/archiveGeometry.ts` and `ArchiveRegion.tsx`. Blueprint lines are thin glowing geometry with per-structure vertex-colour ranges. Each structure's solid form is its own mesh, revealed by a clipping plane rising from its base; a faint ghost fill sits under the drawings. The P2 placeholder is removed, and the random draws it used are still consumed, so the later blockouts are unchanged. |
| Interaction and readability | `content/skills.ts` (tiers, evidence, sources) and `ui/ArchivePanel.tsx` (card and panel). Store: `archiveCategory`, `openArchive` and `visitWork`, which opens a work's dossier once the camera arrives idle at the Forge. Other navigation, or arriving elsewhere, cancels it. |
| Camera and journey integration | `ARCHIVE_VIEW` (wide and narrow). No camera travel between categories. Phones frame the structures in the upper part, above the sheet. |
| Responsive, accessibility, performance | See below. |

## Checks
| Check | Result |
|---|---|
| Unit tests | **122/122**. New: render budget, line and crystal ranges, placement inside the rim and under 40 m, all four structures framed at 5 sizes (left of centre and clear of the panel on wide screens, above the sheet on narrow ones), the four categories with sources and no ratings, every named work existing and mentioning its skill, the dropped skills absent, panel state, the work hand-off and its cancellation. |
| Typecheck · lint · production build | clean · 0 problems · built |
| Production bundle | no dev handle, probe helper, LookDev or DRAFT note |
| M6.2 Archive probe, high quality (4 sizes) | **105/105**. Covers: no card during travel; card, 44 px targets, nav clearance; each category opening with in-use skills, works and roles and no ratings; the camera still when opening and through all four categories; focus on the heading; scroll blocked; panel clearance and target sizes; Exploring under Games; Previous/Next labels; Escape returning focus; 3D hover and click; tapping the dimmed world; a work button travelling to the Forge and opening AETHERION's dossier on arrival; the bottom navigation over the open panel; refusal away from the Archive; reduced motion; console clean. |
| M6.2 Archive probe, low quality | **105/105** |
| After the desktop framing fix (below) | desktop re-run **27/27** on high and on low |
| Regression | M6.1 Sanctum 105/105 · M5 41/41 · M5.7 39/39 · M5.8 19/19 (high and low) · World Map 21/21 · input 70/70 |
| Classic `?mode=classic` | pixel-identical to the M6.1 capture (Δ 0); no file outside `src/world-forge/` changed |

**Render cost at the Archive stop** (scene totals, facing out over open sky): high quality 29 draw calls (22k triangles) on desktop, phone and tablet, 28 on the landscape phone; low quality 13 / 13 / 12 / 13. Within the budget of 8 net extra draws and 25k triangles (unit-tested). Seen from the Forge (desktop), the Forge's totals rose from 83 to 86 calls.

## Changes made during the stages
- **Floor rings.** A scaled unit ring thickened with its radius, so the outer etched ring looked heavy. The floor rings now have a fixed line width.
- **Structures.** They overlapped from the camera, so they're spread further apart.
- **Built state.** The built solid read too dark, so it's now pale stone. The floor and halls are a lighter slate, so the floor separates from the island.
- **Framing.**
  - The desktop camera is closer. Phones frame the hall higher, so a built structure stays visible above the sheet.
  - **Found in QA:** on desktop, the rightmost structure (Games) sat at the panel's edge, half under the dimmed scrim when built. The desktop view now keeps the whole arc left of the panel. A new unit test checks every structure clears the panel on wide screens.

## Known limits
- Headless Chrome with software rendering only; no real device or GPU.
- On low-resolution screens, the thinnest blueprint lines can look dashed at a distance.
- The probes live in the session scratchpad, not the repository.

## Files
- New:
  - `content/skills.ts`
  - `regions/archive/archiveLayout.ts`, `archiveGeometry.ts`, `ArchiveRegion.tsx`
  - `ui/ArchivePanel.tsx`
  - `tests/world-forge/archive.test.ts`
- Changed:
  - `camera/cameraTargets.ts` (Archive framing)
  - `core/WorldCanvas.tsx` (local clipping on)
  - `core/WorldScene.tsx`
  - `experience/experienceStore.ts`
  - `world/RegionLandmarks.tsx`
  - `WorldForge.tsx`, `WorldForge.css`
  - tests `experienceStore.test.ts`, `journeyPath.test.ts`

Review images (`m6-review/`):
- desktop: `m62-archive-desktop.jpg`, `m62-ai-desktop.jpg`, `m62-software-desktop.jpg`, `m62-games-desktop.jpg`, `m62-handoff-dossier-desktop.jpg` (AETHERION's dossier, opened from the Archive);
- other sizes: `m62-archive-phone.jpg`, `m62-software-phone.jpg`, `m62-archive-landscape-phone.jpg`, `m62-ai-tablet.jpg`.

## For the lock
To lock M6.2, look at the images in `m6-review/` (`m62-*`) and confirm the Drafting Hall, the build-on-select, the skills panel and the work hand-off. After the lock, M6.3 Path of Ascension starts at its own gate: timeline and content verification, then a design proposal.
