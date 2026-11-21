# M6.3 Path of Ascension: timeline audit and design proposal (design gate)

Status: **PROPOSED, waiting on your approval.** No Path geometry, timeline panel or timeline module will be coded until you approve it (doc 16 M6.3; doc 06 approval protocol).
Date: 2026-11-22.
Governing rules:
- master doc §6 Region 04, §8 Path of Ascension, M6C acceptance;
- doc 06; doc 08; doc 11;
- DEC-010 (the blueprint images are the look reference);
- DEC-025 (the CV is the content source).

## 1. Timeline audit (M6.3 step 1)
The full table is in `../content/CONTENT_INVENTORY.md` under "Path of Ascension", with a source for every fact.

**Verified, in order** (all from the CV):

| When | What |
|---|---|
| Jun 2021 – Mar 2023 | Intermediate, FIITJEE Junior College, Hyderabad · 83.5% |
| Aug 2023 – present | B.Tech, Computer Science and Engineering, Lovely Professional University · CGPA 6.86 |
| over two years | AniCos Student Organization: Volunteer → Board Member → Co-CEO |
| Sep and Oct 2024 | The Bits and Bytes of Computer Networking; Fundamentals of Network Communication (Coursera) |
| Nov 2025 – present | Machine Learning Intern, MacBease Connections (admin dashboard, data pipelines, performance; ~35%, ~40%, ~25%) |
| Jan 2026 – present | Full Stack Developer, freelance (B2B + B2C marketplace, ledger, Redis / Celery / AWS; 40–60% faster APIs) |
| Jan 2026 – present · Jan – May 2026 | AETHERION · NeuroPlay Engine |
| Apr 2026 | AWS Certified Cloud Practitioner (CLF-C02) |
| undated | HackerRank: 5 stars in various programming languages |

**Conflicts, settled by the CV (DEC-025):**
- AniCos: **Co-CEO**, not Classic's "CEO".
- CGPA: **6.86**, not Classic's 6.91.

**Only in Classic.** These are left out by default, as with the skills (DEC-028). Say if any should stay:
- Secondary school (10th, 2016–2021, 99.6%).
- freeCodeCamp's Legacy Responsive Web Design certificate (2023).
- AniCos dates (Aug 2023 – present). The CV says only "over two years".
- The Algo Tutor Academy generative AI training (Jun – Aug 2025). It also backs the Archive's "Training" label on RAG and Docker. Keeping it adds it here; dropping it also removes that label from the Archive.

**"Future development"** (the master doc's sixth candidate milestone) belongs to the Horizon (M8), with your ambitions. The Path ends by pointing onward.

## 2. Recommended direction: "The Lit Ascent"
**Idea in one line:** a pale stone path climbs the four snow-capped islands, carried over the gaps by bridges. Five waystones mark the milestones along it. Choosing one draws the camera to it, and the path's lanterns light from the start up to that point: progress you can see.

### 2.1 Environment, composition and scale
```
   settled view (desktop: the climb rising left to right, panel space right)
┌──────────────────────────────────────────────┬──────────────┐
│                                   ⛰ summit ✦ │              │
│                         ⛰ pa-3  ═bridge═⑤    │    panel     │
│              ⛰ pa-2 ═bridge═④③               │    space     │
│   ⛰ pa-1 ═bridge═②                           │              │
│     ①  ·  ·  ·  lanterns along the path       │              │
└──────────────────────────────────────────────┴──────────────┘
```
- **Islands:** the four Path islands from P2, unchanged in position. This is the look of the blueprint's snow-capped rising peaks. Each island gets a jagged pale rock pinnacle with a snow cap, replacing the P2 cones.
- **The path:** pale stone steps winding up each island's top. Stone bridges cross each gap beside the golden links (the links stay), plus one small floating platform between pa-3 and the summit for the fifth milestone.
- **Lanterns** line the path at a steady spacing.
  - At rest they glow faintly.
  - When a milestone is chosen, they light from the foot of the path up to it.
- **Five waystones**, one family (a pale standing stone with a lantern crown). They grow in height up the climb, each with its own top:

  | # | Milestone | Waystone | Site |
  |---|---|---|---|
  | 1 | **Foundations**: Intermediate, FIITJEE (2021–2023) | a low cairn of stacked stones | pa-1 |
  | 2 | **University**: B.Tech at LPU (2023–), networking certificates (2024), HackerRank | an open arch | pa-2 |
  | 3 | **Leadership**: AniCos, Volunteer → Board Member → Co-CEO | twin pillars joined by a lantern beam | between pa-2 and pa-3 |
  | 4 | **Professional**: ML internship (Nov 2025–), freelance full-stack (Jan 2026–), AWS certification (Apr 2026) | a stepped stone frame | pa-3 |
  | 5 | **Building**: AETHERION and NeuroPlay Engine (2026) | the summit beacon, the tallest, with a light pointing up | summit platform |

- **Order:** the milestones follow the order things began. The summit is what you're building now. You can reorder or regroup them.
- **Scale:** waystones stay under about 20 m. The summit beacon reuses the P2 summit's height, so the Path's silhouette from afar stays the same.

### 2.2 Materials, palette, lighting
- **Colours:**
  - pale grey-blue rock;
  - white snow caps;
  - the Path's region colour (pale white-blue `#dfe9ff`) for lanterns and waystone lights;
  - amber stays on the golden routes only.
- **Lighting:** no new lights or textures. It uses emissive lanterns, and the existing sky and fog.
- The density is medium-low (master doc).

### 2.3 Camera
- **Arrival:** the P5 framing that already frames the whole climb, with the climb left of centre on desktop so the panel has the right side.
- **Choosing a milestone focuses the camera** (master §6): a three-quarter view of its waystone from beside the path, left of centre on desktop, in the upper part on phones.
- **Switching milestones** glides up or down the climb, slightly lifted, as works do in M5.
- **Closing** returns to the settled view.
- **No compulsory traversal** (M6C): any milestone can be chosen directly, in any order.
- **Reduced motion:** short moves, and the lanterns light at once with no climb.

### 2.4 Content presentation (screen-space, readable)
- **No text in the world.**
- **The Path card** shows "The Path of Ascension" and a direct **timeline selector**: five stops in order, each named (Foundations, University, Leadership, Professional, Building) with its years. Desktop: lower left; phones: above the navigation; phones turned sideways: top left.
- **The panel** (the shared panel, in the Path's pale white-blue) shows for the chosen milestone:
  - its title and years;
  - the place;
  - a few concise lines of what was done, taken from the CV, figures included (DEC-025).

  Works (AETHERION, NeuroPlay Engine) are buttons that open their dossiers in the World Forge, as in the Archive. Previous/next and ← → walk the timeline.
- The last milestone ends with "Continue to the Worlds Beyond".

### 2.5 Interaction flow (master §8)
1. **Arrive.** The camera settles and the Path card fades in.
2. **Choose a milestone**, from the timeline selector or by clicking a waystone in 3D. The lanterns light up to it, the camera glides to it, and the panel opens.
3. **Switch** with previous/next, ← →, or by choosing another stop. The camera glides along the climb and the lanterns follow.
4. **Close** with ✕, Escape or the dimmed world. The view returns and the lanterns dim.
5. **Existing rules apply:** scroll travel is blocked while the panel is open, and the bottom navigation or World Map closes it first and then travels.

### 2.6 Mobile, accessibility
- **Phones:**
  - the climb is framed so a focused waystone sits above the sheet;
  - the timeline selector is a single scrollable row;
  - tap targets are at least 44 px.
- **Accessibility:**
  - the timeline is an ordered list of buttons naming each milestone and its years;
  - the panel is a labelled dialog: focus moves in and is trapped, Escape closes it, and focus returns to the stop that opened it;
  - hover is never required.

### 2.7 Architecture (extends the existing contracts)
- **Content:** `content/timeline.ts`, typed: milestones with years, place, lines and works, each line sourced. Tests check dates are ordered and every line has a source.
- **Scene:** `regions/ascension/` holds:
  - the path, bridges, pinnacles, waystones and lanterns;
  - a pure `ascensionLayout.ts` with unit tests (on the islands, under the height limit, the path continuous).

  Geometry is baked per material. Lanterns sit in one mesh, with vertex colours lit in path order. The P2 Path placeholders are removed, keeping their random draws so other blockouts stay unchanged.
- **Store:** `ascensionMilestone` and `openAscension` (honoured only at the idle Path; navigation clears it). Milestone focus poses sit beside the fragment and monument poses. `CameraRig` stays the only camera writer.
- **Panel:** the shared `FocusPanel`. Work buttons use the existing `visitWork`.

### 2.8 Performance budget and risks
- **Budget:** at most 8 extra draw calls (net of the removed placeholder), at most 20k triangles, no new lights or textures.
- **Risks:**
  - The Path is the most spread-out region (four islands over about 130 m of climb), so waystones must read at the settled distance. The lanterns and waystone lights carry them.
  - Glides between milestones cross open sky, so the journey tests will check clearance.
  - The professional milestone has the most text, so lines are kept concise, with the CV's figures.

### 2.9 Assets
Procedural only, as in M2–M6.2, with no downloads and no new dependencies.

### 2.10 Explicit non-goals
- No stairs that must be walked, and no compulsory order.
- No 3D text, no skill content (the Archive has it) and no contact details (the Horizon).
- No invented milestones, dates or descriptions.

## 3. Stage plan after approval (doc 16 M6.3)
1. Timeline and content verification: **done here**, finalised with your answers.
2. Design proposal and approval: **this gate**.
3. Spatial progression blockout.
4. Milestone structures.
5. Information presentation.
6. Navigation and interaction.
7. Responsive, accessibility and performance.
8. QA and lock: **your stop**.

I'll send screenshots after the blockout and after the milestone stage, so you can redirect early; they don't pause the work. Each stage is committed when it passes its checks.

## 4. Decisions requested
1. **Direction:** approve "The Lit Ascent", or redirect any part. Each waystone's form, the lantern progression, and the five-milestone grouping and order can each be changed.
2. **Classic-only items:**
   - Keep or drop secondary school, the freeCodeCamp certificate, and the AniCos dates? The default is to drop all three.
   - Keep the Algo Tutor training? If you drop it, the Archive's "Training" label goes too.
3. **Content:** confirm the CV-based lines, figures included, per milestone. HackerRank sits under University by default.
