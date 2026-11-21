# M5 Project System: design proposal (content and interaction design gate)

Status: **PROPOSED, waiting on owner approval.** No monument geometry, dossier UI or project data module will be coded until you approve it (doc 16 M5).
Date: 2026-11-21 · Governing rules: master doc §M5 (monument selection, dossier fields, acceptance), doc 08 (panels, mobile, accessibility), doc 11 (content), doc 12 (assets).

## 1. Content audit summary (M5.1, full table in `../content/CONTENT_INVENTORY.md`)
- **7 projects** exist in the repository, the same 7 Classic shows, and they map onto the 7 plinths reserved in M4.
- **Images:** only 3 of the 4 images in use match their projects (NutriFit, Game Stats, SPAE). NeuroPlay, AETHERION, FinLit and PARAS show other projects' images. I'll use no image that you haven't confirmed.
- **Conflicts:** NeuroPlay's description, tech stack and status differ between the site and your CV. AETHERION's tech list is incomplete on the site, and the CV quotes figures (~30% accuracy, <200 ms latency) that need your confirmation before they appear.
- **Fields with no content anywhere:** problem, contribution, challenges and results exist for no project, except partial CV text for 2. Following the master doc, the dossier shows only fields with real content.
- **Links:** not tested yet. Testing sends requests to GitHub and Vercel, which needs your permission.

## 2. Recommended direction: "The Forged Works"
**Idea in one line:** each project is a finished work standing on the Forge's terrace. All seven share one stone base, and each carries its own carved emblem. When you choose one, the Forge's light flows into it and its dossier opens.

### 2.1 Monument treatment (one family, seven distinct works)
- **Shared base**, a stele on the M4 plinth: a dark cut-stone block about 1.6 wide and 2.6 tall, with the M4 amber inlay at its foot. The shared base is what makes them read as a set rather than random props.
- **Distinct emblem** on top, a low-poly abstract form drawn from each project's idea. There is no text, logo or 3D lettering (doc 08):

| Project | Emblem (abstract, procedural) |
|---|---|
| NeuroPlay Engine | Two interlocking rings, a twin: the "digital twin" idea (the wording waits on your content decision) |
| AETHERION | A rising stepped shard: markets and momentum |
| NutriFit AI | A spiralling column of stacked discs: daily growth |
| FinLit AI | A balanced arch over a keystone: clarity and balance |
| PARAS System | An open lens ring around a still core: watchfulness |
| Game Stats Dashboard | A faceted, die-like polyhedron: play and chance |
| SPAE | Three ascending columns: performance over time (no data implied) |

- **Hierarchy:** featured projects (NeuroPlay, AETHERION, NutriFit) stand slightly taller and take the three most visible central sites from the settled camera (world bearings 27°, 42° and 57°). The others fill the remaining sites.
- **Scale:** each monument stays below about 5 units, so the Forge stays dominant and the M4 silhouette from the Void is unaffected. They sit inside the M4 parapet line.
- **States:** at rest the inlay is dim. On hover or keyboard focus, the inlay and emblem edges warm. When selected, the emblem catches a thin amber thread of light from the core seam. That thread is the "Forge's light flows into it" moment.

### 2.2 Selection flow (master §M5: react → subdue → focus → dossier → switch/close)
1. **Choose.** Click or tap a monument, or use the **Works index**: a compact screen-space list of the 7 project names. It appears only at the World Forge stop, beside the bottom navigation, and works fully by keyboard and touch. 3D picking is never required.
2. **React.** The monument's inlay and emblem warm (0.3 s).
3. **Subdue.** The world dims slightly behind a screen-space scrim, and the Forge's glow quietens. The environment stays visible but quiet.
4. **Focus.** The camera eases to a per-monument focus view: three-quarter, emblem left of centre, the Forge's seam behind it. The dossier takes the right side.
5. **Dossier opens** (see 2.3). Scroll travel is blocked while it is open; this is the existing M1 panel rule.
6. **Switch.** Previous and next buttons, or ← → keys, move the camera from monument to monument without closing the dossier or returning to the world.
7. **Close.** Close button, Escape, or the scrim. The camera returns to the settled Forge view and focus returns to whatever opened the dossier.
   - Direct navigation from the bottom menu also works while a dossier is open. It closes the dossier first, then travels (M1 priority order).

### 2.3 Dossier layout (near-fullscreen, screen-space, readable)
```
 desktop (≥ 5/4)                                      mobile / portrait
┌──────────────────────────────┬───────────────────┐  ┌───────────────────┐
│                              │ 03 / 07      ✕    │  │ (world, dimmed)   │
│   world, dimmed;             │ NUTRIFIT AI       │  ├───────────────────┤
│   camera on the monument     │ Generative AI ·   │  │ 03 / 07        ✕  │
│                              │ Source available  │  │ NUTRIFIT AI       │
│                              │ ───────────────── │  │ Generative AI ·…  │
│                              │ Overview          │  │ Overview …        │
│                              │ (verified text)   │  │ Approach …        │
│                              │ Approach* …       │  │ Tech  [chips]     │
│                              │ Tech  [chips]     │  │ [GitHub ↗]        │
│                              │ [GitHub ↗] [Live ↗]│  │ ‹ prev    next ›  │
│                              │ ‹ prev    next ›  │  └───────────────────┘
└──────────────────────────────┴───────────────────┘   full-height sheet,
 panel ≈ 44% width; scrolls internally               scrolls internally
 * only fields with real content are shown
```
- **Fields** (master list, shown only when filled): name, category, status, overview, problem, contribution, approach, architecture, tech stack, challenges, results, GitHub (or frontend/backend), live demo, gallery.
- **Links** are clearly labelled, open in a new tab with `rel="noreferrer"`, and are shown only after you confirm them.
- **No autoplay.** A gallery appears only for confirmed images.
- **Accessibility:** `role="dialog"` with a labelled heading, focus moved into the panel and trapped while open, Escape closes, contents selectable, and `data-wf-own-scroll` so its internal scroll never drives the journey.

### 2.4 Architecture (extends the locked M1/M4 contracts; nothing replaced)
- **Data:** a typed, data-driven `src/world-forge/content/projects.ts`, seeded from the audited content.
  - Each field carries its verification status, and only VERIFIED fields reach the dossier.
  - Classic's `projects.js` stays untouched unless you approve a correction (decision 5).
- **Store:** `focusProject(id | null)`, with the focused project in the snapshot. Opening a dossier uses the existing `blockScroll()` and `useDismissLayer()`.
- **Camera:** `CameraRig` stays the only camera writer.
  - When a project is focused, it eases from the journey pose to that monument's focus pose (registered beside `REGION_FRAMINGS`).
  - On close, it eases back to the settled view.
  - The journey position itself never changes, so returning is exact.
- **Monuments:** one component that takes project data plus a plinth site, and builds base and emblem procedurally. Static parts are baked per material (the M4 approach), so all 7 together add about 4–6 draw calls.
- **Picking:** R3F pointer events on the monuments; the DOM Works index is the accessible equivalent.

### 2.5 Mobile, reduced motion, performance
- **Mobile:**
  - the focus view is pulled back so the monument sits in the upper half;
  - the dossier is a full-height sheet;
  - the Works index is a single toggle beside the navigation;
  - tap targets are at least 44 px.
- **Reduced motion:** camera focus is a short ≤ 0.35 s move, with no emblem shimmer or light-thread animation (a static warm state instead).
- **Performance budget:** at most 8 extra draw calls and at most 15k triangles for all monuments, with no new lights and no textures. The light thread is one additive line.

### 2.6 Assets
None external. Everything is procedural, like M2–M4: no downloads, no licences, no new dependencies. Project images are optional and used only where you confirm them.

## 3. Stage plan after approval (doc 16)
- **M5.1** Content inventory and validation: done as part of this gate, finalised with your answers.
- **M5.2** Monument system architecture: typed data, store focus, camera focus poses.
- **M5.3** One representative monument prototype (proposed: NutriFit, whose content and image are both consistent).
- **M5.4** Your visual and interaction review, and design lock. **This is a required stop.**
- **M5.5** The remaining six monuments and their content.
- **M5.6** Dossier panel and focus/close behaviour.
- **M5.7** Navigation and camera integration (prev/next, direct navigation while open).
- **M5.8** Responsive, accessibility and performance.
- **M5.9** QA and milestone lock.

## 4. Decisions requested
1. **Direction:** approve "The Forged Works" (shared stele plus a distinct emblem per project, Works index, focus and dossier as above), or redirect it. The emblem ideas in 2.1 can be changed one by one.
2. **Content:** confirm or correct each project's description, tech stack, status and links. Two need a ruling:
   - **NeuroPlay:** which description, stack and status is current, the site's or the CV's?
   - **AETHERION:** use the fuller CV tech list?

   Also: should the CV figures (~30%, <200 ms, 200+ tasks, ~28,000 samples) be shown?
3. **Projects and order:** all 7 as monuments, with NeuroPlay, AETHERION and NutriFit featured at the central sites? Or a different selection or order?
4. **Link testing:** may I open the 7 GitHub links and the NeuroPlay demo to check they work? This sends requests to GitHub and Vercel.
5. **Images:** use only the 3 matching images and no image for the other 4, or provide correct images? Also, should I fix the same image mismatches in Classic? That is a Classic change.
6. **Detail fields:** keep dossiers concise with today's content, or will you supply problem, contribution and results text for some projects? Any text I draft would be marked DRAFT and shown only after your approval.
