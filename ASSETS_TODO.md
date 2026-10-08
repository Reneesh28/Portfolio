# Manga Portfolio Asset Inventory & Missing Art Slots

This document tracks all missing art assets and 3D models for Chapter 02 (About Section), their expected dimensions, aesthetic treatments, and current placeholder fallbacks.

## 1. 3D Assets
| Slot Name | Target File Path | Target Dimensions / Polycount | Material / Treatment | Current Status & Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `wolf.glb` | `src/assets/models/wolf.glb` | Low-to-mid poly (<15k triangles), centered pivot, single mesh or named hierarchy | Standard MeshToonMaterial compatible, clean UVs for rim/emissive | **Placeholder Active**: Procedural 3D wolf head geometry constructed from primitives (`ConeGeometry`, `SphereGeometry`) with vermilion emissive eyes and toon shader. Swappable via `WOLF_GLB_URL` in `WolfStage.jsx`. |

## 2. 2D Manga Panel Art Slots (Chapter 02 Acts & Spreads)
| Slot Identifier | Expected Filename | Recommended Resolution | Manga Treatment | Narrative Context | Current Placeholder Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `act2-cofounder` | `src/assets/images/manga_act2_cofounder.jpg` | 1200 × 900 (4:3) | `sharp` (High contrast, bold inks) | Act 2, Panel ④: Startup co-founder workspace, system architecture whiteboard, deployment orchestration. | Code-rendered technical architecture SVG schematic with stamp `共同` and halftone screentone. |
| `act4-rooftop` | `src/assets/images/manga_act4_rooftop.jpg` | 1200 × 900 (4:3) | `negative` (Deep night, white ink, ink-wash tone) | Act 4, Panel ①: Lone wolf silhouette on an urban rooftop under moonlight with night sky screentone. | Code-drawn 2.5D SVG rooftop silhouette with lone wolf and moon in negative ink-wash tone. |
| `spread-freelance` | `src/assets/images/manga_spread_freelance.jpg` | 1200 × 900 (4:3) | `noir` (Coarse halftone, heavy blacks) | Finale Mark 02 (10:00 独立): Full-stack client engineering and custom software craft. | `manga_about_portrait.noir.webp` with `独立` seal impression. |
| `spread-cofounder` | `src/assets/images/manga_spread_cofounder.jpg` | 1200 × 900 (4:3) | `sharp` (High contrast, clean lines) | Finale Mark 04 (16:00 共同): Rapid iteration, team collaboration, technical leadership. | `manga_protagonist_scifi.sharp.webp` with `共同` seal impression. |

## 3. How to Replace Placeholders
1. **3D Wolf Model**:
   - Place `wolf.glb` in `src/assets/models/wolf.glb`.
   - Update `const WOLF_GLB_URL = wolfModelUrl;` at the top of `src/components/about/WolfStage.jsx`.
2. **2D Manga Art**:
   - Place the new JPG image in `src/assets/images/{name}.jpg`.
   - Run `npm run treat:about` to generate the optimized WebP variants in `src/assets/about/`.
   - Update the respective import in `src/data/aboutActs.js`.
