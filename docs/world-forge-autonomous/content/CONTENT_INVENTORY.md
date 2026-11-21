# Content Inventory — World Forge projects (M5.1) and Origin Sanctum (M6.1)

Doc 11 rules apply: no invented facts, metrics, descriptions, links or media.

**Sources, in priority order:**
1. Owner confirmation. The owner named the CV as the source of truth ("Everything is in CV", DEC-025), so CV text counts as owner-confirmed.
2. The repository: `src/data/projects.js`, Classic's data.
3. The owner's CV: `public/resume.pdf`.

**Status values:** VERIFIED / DRAFT / NEEDS OWNER / OMIT.

The external links were **not opened**: fetching them would send your GitHub username to outside services, which needs your permission (decision 4 in the M5 proposal).

## Project-by-project
| Project | Item | Current content (source) | Issue | Status |
|---|---|---|---|---|
| NeuroPlay Engine | Description | The CV's Digital Twin platform for behavioural gameplay analysis (the site's "generative AI engine" text is dropped) | Resolved: "Cv" (DEC-025) | VERIFIED |
| NeuroPlay Engine | Tech | CV: Python, FastAPI, MERN, LangGraph, FAISS, Machine Learning | Resolved (DEC-025) | VERIFIED |
| NeuroPlay Engine | Status / dates | CV: Jan – May 2026 | Resolved (DEC-025) | VERIFIED |
| NeuroPlay Engine | Links | Code `github.com/…/NeuroPlay`, live `neuroplay.vercel.app` (repo) | Not tested | NEEDS OWNER |
| NeuroPlay Engine | Image | `sales_analytics.webp` (repo) | **Wrong image** (it is SPAE's) | OMIT unless replaced |
| NeuroPlay Engine | Approach / Architecture | CV bullets, figures included (200+ tasks, ~28,000 samples) | Shown (DEC-025) | VERIFIED |
| AETHERION | Description | "AI-powered trading intelligence engine …" (repo); the CV agrees on the substance | Consistent | DRAFT (confirm) |
| AETHERION | Tech | CV: Python, Machine Learning, FastAPI, Django, Flask, React, Kafka, Redis, MongoDB, MySQL, Docker, WebSockets | Resolved: the CV's list (DEC-025) | VERIFIED |
| AETHERION | Status | "Prototype" (repo); CV: Jan 2026 – present | Consistent | DRAFT (confirm) |
| AETHERION | Links | Frontend and backend repositories (repo); no live demo | Not tested | NEEDS OWNER |
| AETHERION | Image | `smart_cities.webp` (repo) | **Wrong image** (shared with FinLit, unrelated subject) | OMIT unless replaced |
| AETHERION | Approach / Architecture | CV bullets, figures included (~30%, <200 ms) | Shown (DEC-025) | VERIFIED |
| NutriFit AI | Description, tech, status | RAG fitness and nutrition assistant; Python, LangChain, FAISS, Streamlit, FastAPI, Sentence Transformers, Groq API; "Source Available" (repo) | Repo only | DRAFT (confirm) |
| NutriFit AI | Links | Code repository (repo) | Not tested | NEEDS OWNER |
| NutriFit AI | Image | `nutrifit_ai.webp` | Matches the project | DRAFT (confirm) |
| FinLit AI | Description, tech, status | LLM financial-literacy platform; Python, Pandas, LLMs, FastAPI; "In Development" (repo) | Repo only | DRAFT (confirm) |
| FinLit AI | Links | Code repository (repo) | Not tested | NEEDS OWNER |
| FinLit AI | Image | `smart_cities.webp` | **Wrong image** | OMIT unless replaced |
| PARAS System | Description, tech, status | Real-time CV safety and anomaly platform; Python, Computer Vision, Real-Time Processing; "Prototype" (repo) | Repo only; tech list is generic | DRAFT (confirm) |
| PARAS System | Links | Code repository (repo) | Not tested | NEEDS OWNER |
| PARAS System | Image | `game_stats_dashboard.webp` | **Wrong image** | OMIT unless replaced |
| Game Stats Dashboard & Recommender | Description, tech, status | Streamlit gameplay analytics plus LLM recommendations; Python, Streamlit, Pandas, NumPy, Groq API, Matplotlib, Plotly; "Source Available" (repo) | Repo only | DRAFT (confirm) |
| Game Stats Dashboard & Recommender | Links | Code repository (repo) | Not tested | NEEDS OWNER |
| Game Stats Dashboard & Recommender | Image | `game_stats_dashboard.webp` | Matches the project | DRAFT (confirm) |
| Sales Performance Analytics Engine (SPAE) | Description, tech, status | ML sales analytics dashboard; Python, ML, Data Analytics, Statistics, Dashboarding; "Source Available" (repo) | Repo only. "Large-scale datasets" is an unverified claim | DRAFT (confirm) |
| Sales Performance Analytics Engine (SPAE) | Links | Code repository (repo) | Not tested | NEEDS OWNER |
| Sales Performance Analytics Engine (SPAE) | Image | `sales_analytics.webp` | Matches the project | DRAFT (confirm) |

## Fields with no content anywhere
Problem/motivation, contribution, challenges, gallery and demo video exist for no project, except partial CV text for AETHERION and NeuroPlay.

Per the master doc, empty fields are simply not shown. Nothing will be invented to fill them.

## Classic portfolio note
The image mismatches above also appear in the Classic portfolio, which reads the same `projects.js`. Correcting Classic is a Classic change and needs your approval (M5 proposal, decision 5).

## Origin Sanctum (M6.1 audit, 2026-11-22)
Columns follow doc 11: Region | Item | Proposed content | Source | Owner confirmation | Status. The exact copy is in `../proposals/M6-1-origin-sanctum-design-proposal.md` §2.5.

| Region | Item | Proposed content | Source | Owner confirmation | Status |
|---|---|---|---|---|---|
| Origin Sanctum | Name | Balam Reneesh | CV; Classic `profile.js` (`name`) | CV is the source (DEC-025) | VERIFIED |
| Origin Sanctum | Identity line | Engineer · Creator · World Builder | Master doc §1 | Owner-written | VERIFIED |
| Origin Sanctum | Hero statement | "I build systems, create experiences, and explore ideas that haven't yet taken form." | Master doc §1 | Owner-written | VERIFIED |
| Origin Sanctum | Role | AI Systems Engineer & Full-Stack Developer | Classic `profile.js` (published) | Pending (M6.1 gate) | DRAFT |
| Origin Sanctum | Mission | "Building systems that learn, remember, and respond." | Classic `profile.js` (published) | Pending (M6.1 gate) | DRAFT |
| Origin Sanctum | Biography | Two paragraphs; paragraph 1 without its opening "I'm Reneesh Balam," because the name is the heading | Classic `profile.js` (published) | Pending (M6.1 gate) | DRAFT |
| Origin Sanctum | Education (summary) | B.Tech, Computer Science and Engineering, Lovely Professional University, Aug 2023 – present | CV | CV is the source (DEC-025) | VERIFIED |
| Origin Sanctum | CGPA | 6.86 (CV) vs 6.91 (Classic) | CV wins (DEC-025) | — | Path of Ascension (M6.3), not the Sanctum |
| Origin Sanctum | Current work | Machine Learning Intern, MacBease Connections (Nov 2025 – present); Full Stack Developer, freelance (Jan 2026 – present) | CV | CV is the source (DEC-025) | VERIFIED |
| Origin Sanctum | Specialization and languages | Generative AI, ML, React architecture; C++, JavaScript, Python | Classic `profile.js`; CV | Partly (CV) | DRAFT |
| Origin Sanctum | Problem-solving approach | — | None | — | NEEDS OWNER (omitted unless supplied) |
| Origin Sanctum | Creator and game-development ambitions | — | None | — | NEEDS OWNER (omitted unless supplied) |
| Origin Sanctum | Availability | "Actively seeking roles" | Classic, marked in code as a placeholder to verify; not in the CV | — | OMIT unless confirmed |
| Origin Sanctum | Resume link | `/resume.pdf` | Repository file | — | VERIFIED (local file) |
| Origin Sanctum | Phone, email | — | CV | — | OMIT here (contact belongs to the Horizon, M8) |
