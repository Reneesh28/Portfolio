# Stage Report — M5.2 Monument system architecture · M5.3 Prototype (P6)

## Objective
Build the typed, data-driven project system and one representative monument with its dossier (doc 16 M5.2–M5.3), then stop for the required owner review (M5.4). Direction: "The Forged Works" (DEC-016/021). Text only (DEC-015); nothing invented (doc 11).

## Implemented
- **`content/projects.ts`:** all **8 projects**, Chronoshift included (DEC-013).
  - Every field records its **source and status**: `owner` / `repo` / `cv` / `conflict` / `missing`.
  - `isDisplayable` lets a field reach the dossier only if it is owner-confirmed, or is repository text the Classic portfolio already publishes.
  - **Hidden:**
    - NeuroPlay's description, tech and status (they conflict with the CV);
    - AETHERION's tech list (incomplete versus the CV);
    - all CV figures;
    - everything for Chronoshift.
  - There are no image fields at all.
  - **Plinth assignment** (left to right, seen from the Projects gate):
    - 0 SPAE · 1 PARAS · 2 AETHERION · 3 NutriFit · 4 NeuroPlay · 5 FinLit · 6 Game Stats · 7 Chronoshift;
    - the featured works take the centre.
- **Store:** `focusProject(id | null)`, with `focusedProject` in the snapshot.
  - It only applies at the idle World Forge.
  - Direct navigation clears it, since navigation outranks an open panel.
  - It requests frames (demand frameloop).
- **Camera:** `computeProjectFocusPose` sets each monument's focus view.
  - **Wide screens:** about 34 m out, the work left of centre and the city rising behind it, with the dossier on the right.
  - **Narrow screens:** centred in the upper part, above the dossier sheet.
  - `CameraRig` eases into it and back (1.1 s; 0.3 s under reduced motion) and is still the only camera writer.
- **Monuments** (`regions/forge/Monuments.tsx`):
  - **Shared stele:** stone, cap and an amber foot inlay.
  - **Emblems:** built from an emblem registry.
  - **States:**
    - at rest, dim amber edges;
    - hovered, warm;
    - selected, bright edges with a gentle shimmer (still under reduced motion), plus a **thread of the Forge's light** from the core to the emblem.
  - Click or tap focuses a monument; hover shows a pointer cursor.
  - **Prototype: NutriFit AI**, with the "spiralling column of stacked discs" emblem.
- **Works index** (`ui/WorksPanel.tsx`): at the World Forge stop, a compact "WORKS" list above the bottom bar. It's the keyboard and touch equivalent of clicking a monument, so 3D picking is never required.
- **Dossier** (`ui/ProjectDossier.tsx`):
  - a modal dialog, on the right on desktop (it ends above the bottom bar) and as a bottom sheet on phones;
  - shows the index count, name, category · status, overview, tech chips and links (new tab, `noreferrer`, an announced "opens in a new tab");
  - previous/next and ← → keys switch works (disabled while only one is built);
  - Escape, Close or the scrim close it and restore focus to the work's button (or to the region button if the monument was clicked in 3D);
  - scroll travel is blocked while it's open, and its content scrolls on its own (`data-wf-own-scroll`).
  - **DRAFT note:** development builds show "DRAFT — repository text awaiting owner confirmation"; production builds don't.
- **Layering:** the bottom navigation stays above the dossier, so direct navigation always works.

## Display-name note
The repository titles are shortened for the monuments: "AETHERION - Real-Time Markets. Intelligent Decisions." becomes **AETHERION**, and "NutriFit AI - Personalized Fitness & Nutrition Assistant" becomes **NutriFit AI**. These need your confirmation.

## Validation
| Check | Result |
|---|---|
| `npm test` | **85/85**. New `projects.test.ts`: 8 projects on unique plinths, featured in the centre; no conflicting, unconfirmed or missing field is displayable (NeuroPlay, AETHERION tech, Chronoshift); no pictures; HTTPS links only; only the prototype built; the focus view puts the work left of centre on wide screens and centred above the sheet on narrow ones; the camera is clear of the plinths. Store tests cover focus only at the idle Forge and direct navigation clearing it |
| typecheck / lint / build | exit 0. Main chunk 454.33 kB (+7.8 kB for content and dossier); WorldCanvas chunk 936.50 kB |
| M5 probe (real input, 1440 and 390) | **25/25**: Works index only at the Forge; dossier modal with focus on its heading; only displayable fields; no images; safe links; DRAFT marker in dev; scroll blocked; Escape closes and restores focus; direct navigation from the dossier travels; no overflow; 0 console errors |
| World Map and quick bar probe | All passed |
| Real-input regression (M1 suites) | **70/70** |
| Production bundle | Dev handle, look-dev page and DRAFT marker all absent |
| Classic | Pixel-identical |

Review images in `m5-review/`:
- `m5-forge-works-index.jpg`
- `m5-nutrifit-dossier-desktop.jpg`
- `m5-nutrifit-dossier-mobile.jpg`

## Known gaps
- **Clicking a monument in 3D** isn't automated (it's hard to target headlessly). The Works index path is fully tested. Please try clicking the NutriFit monument during review.
- **Terrace lighting:** the Forge's core light gives the terrace a warm wash in the focus view.
- **No real-GPU check.**

## Git checkpoint
**Not committed.** Commit permission hasn't been given explicitly.

## M5.4 — owner review and design lock (required stop)
1. **The prototype:** approve the monument style (stele, emblem, states, light thread), the focus view, the Works index and the dossier, or list changes.
2. **Content** (needed before M5.5 builds the other 7):
   - **NeuroPlay:** is the site's description current, or the CV's (description, tech, status)?
   - **AETHERION:** use the CV's fuller tech list?
   - **CV figures** (~30%, <200 ms, 200+ tasks, ~28,000 samples): show them or not?
   - **Chronoshift:** description, tech stack, status and links.
   - **Display names:** confirm the shortened names (AETHERION, NutriFit AI).
   - **Links:** may I test the GitHub and Vercel links?
   - Should the other repo descriptions (FinLit, PARAS, Game Stats, SPAE) be used as they are?
3. **The emblems for the other 7** (from the M5 proposal): approve as proposed, or change any.
4. **Commit permission** (still open).
