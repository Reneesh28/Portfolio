# Content Inventory — World Forge projects (M5.1 audit)

Doc 11 rules apply: no invented facts, metrics, descriptions, links or media.

**Sources, in priority order:**
1. Owner confirmation (none yet).
2. The repository: `src/data/projects.js`, Classic's data.
3. The owner's CV: `public/resume.pdf`.

**Status values:** VERIFIED / DRAFT / NEEDS OWNER / OMIT.

The external links were **not opened**: fetching them would send your GitHub username to outside services, which needs your permission (decision 4 in the M5 proposal).

## Project-by-project
| Project | Item | Current content (source) | Issue | Status |
|---|---|---|---|---|
| NeuroPlay Engine | Description | "Generative AI engine … dynamic interactive experiences" (repo) | **Conflicts with the CV**, which describes a Digital Twin intelligence platform for behavioural gameplay analysis | NEEDS OWNER |
| NeuroPlay Engine | Tech | Repo: Python, LangChain, Generative AI, React. CV: Python, FastAPI, MERN, LangGraph, FAISS, ML (BullMQ, HDBSCAN in text) | Two different stacks | NEEDS OWNER |
| NeuroPlay Engine | Status / dates | Repo: "In Development". CV: Jan–May 2026 (ended) | Conflict | NEEDS OWNER |
| NeuroPlay Engine | Links | Code `github.com/…/NeuroPlay`, live `neuroplay.vercel.app` (repo) | Not tested | NEEDS OWNER |
| NeuroPlay Engine | Image | `sales_analytics.webp` (repo) | **Wrong image** (it is SPAE's) | OMIT unless replaced |
| NeuroPlay Engine | Detail fields | The CV has architecture, approach and figures (200+ tasks, ~28,000 samples) | Figures need your confirmation before display | NEEDS OWNER |
| AETHERION | Description | "AI-powered trading intelligence engine …" (repo); the CV agrees on the substance | Consistent | DRAFT (confirm) |
| AETHERION | Tech | Repo: React, Tailwind, Django, FastAPI, MongoDB, Flask, MySQL. The CV adds ML, Kafka, Redis, Docker, WebSockets | The repo list is incomplete | NEEDS OWNER |
| AETHERION | Status | "Prototype" (repo); CV: Jan 2026 – present | Consistent | DRAFT (confirm) |
| AETHERION | Links | Frontend and backend repositories (repo); no live demo | Not tested | NEEDS OWNER |
| AETHERION | Image | `smart_cities.webp` (repo) | **Wrong image** (shared with FinLit, unrelated subject) | OMIT unless replaced |
| AETHERION | Results | CV: "~30%" accuracy improvement, "<200 ms" latency | Metrics shown only if you confirm them | NEEDS OWNER |
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
