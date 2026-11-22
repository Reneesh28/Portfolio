# Content Inventory — World Forge projects (M5.1), Origin Sanctum (M6.1), Blueprint Archive (M6.2), Path of Ascension (M6.3), Worlds Beyond (M7.1)

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

## Blueprint Archive (M6.2 skills inventory, 2026-11-22)
**Sources:**
- the CV (`public/resume.pdf`, owner-confirmed, DEC-025);
- the works' content (`src/world-forge/content/projects.ts`: CV text for NeuroPlay and AETHERION, repository text for the others);
- Classic's `src/data/skills.js` and `experience.js`, which carry Classic's own levels: Core, Applied, Exploring.

**Rule** (master doc §6 and M6B; doc 06):
- no percentages or ratings;
- every skill shown is backed by a work, a role, training, a certificate or the CV's skills list;
- skills in use are kept apart from skills being explored.

**Categories:** the master doc's four. The fourth reads "Creative & Game Development", because it also holds Canva (DEC-028).

**Owner's tech-stack image** (DEC-028): a profile page listing CSS3, C, C++, HTML5, JavaScript, Python, Netlify, Chart.js, Django, Django REST, Express.js, FastAPI, Flask, Node.js, Bootstrap, React, Streamlit, Three.js, Tailwind CSS, MongoDB, MySQL, Canva, Pandas, NumPy, Matplotlib, Plotly, Scikit-learn and GitHub. Skills = the CV plus this list.

| Region | Item | Proposed content | Source / evidence | Owner confirmation | Status |
|---|---|---|---|---|---|
| **AI & Intelligence** | Machine learning | In use | AETHERION (CV: ML-based regime detection), NeuroPlay (CV), SPAE (repo); ML internship (CV) | CV (DEC-025) | VERIFIED |
| AI & Intelligence | LLM applications | In use | NutriFit (Groq API), FinLit (LLMs), Game Stats (LLM recommendations) (repo) | — | DRAFT (repo) |
| AI & Intelligence | Retrieval-augmented generation (RAG) | In use | NutriFit (repo); AI-powered NLP and generative AI training, Algo Tutor Academy (Classic `experience.js`) | — | DRAFT (repo) |
| AI & Intelligence | Embeddings and vector search | In use | NeuroPlay (CV: 8D behavioural embeddings, FAISS retrieval); NutriFit (Sentence Transformers, FAISS) | CV (DEC-025) | VERIFIED |
| AI & Intelligence | AI agents (LangGraph) | In use | NeuroPlay (CV: LangGraph agents); CV skills | CV (DEC-025) | VERIFIED |
| AI & Intelligence | LangChain | In use | NutriFit (repo); CV skills | CV (DEC-025) | VERIFIED |
| AI & Intelligence | Clustering (HDBSCAN) | In use | NeuroPlay (CV) | CV (DEC-025) | VERIFIED |
| AI & Intelligence | Scikit-learn | In use | CV skills; owner's image | DEC-025/028 | VERIFIED |
| AI & Intelligence | Computer vision | In use | PARAS System (repo) | — | DRAFT (repo) |
| AI & Intelligence | Deep learning (PyTorch) | — | Classic only; not in the CV or the owner's image | DEC-028 | OMIT |
| AI & Intelligence | Hugging Face | — | Classic only; not in the CV or the owner's image | DEC-028 | OMIT |
| AI & Intelligence | Fine-tuning | — | No source (only the master doc's candidate list) | — | OMIT |
| **Software Engineering** | Python | In use | Every work with content; CV | CV (DEC-025) | VERIFIED |
| Software Engineering | JavaScript | In use | CV; MERN in NeuroPlay and the internship (CV) | CV (DEC-025) | VERIFIED |
| Software Engineering | C++ | In use | CV skills (no work names it) | CV (DEC-025) | VERIFIED |
| Software Engineering | React | In use | AETHERION (CV); internship admin dashboard, React + Node.js (CV) | CV (DEC-025) | VERIFIED |
| Software Engineering | Next.js | In use | Freelance marketplace (CV) | CV (DEC-025) | VERIFIED |
| Software Engineering | Node.js and Express (MERN) | In use | Internship (CV); NeuroPlay (CV: MERN) | CV (DEC-025) | VERIFIED |
| Software Engineering | FastAPI | In use | NeuroPlay, AETHERION (CV); NutriFit, FinLit (repo) | CV (DEC-025) | VERIFIED |
| Software Engineering | Django and Django REST Framework | In use | AETHERION (CV: Django); freelance (CV: Django, DRF) | CV (DEC-025) | VERIFIED |
| Software Engineering | Flask | In use | AETHERION (CV) | CV (DEC-025) | VERIFIED |
| Software Engineering | WebSockets | In use | AETHERION (CV) | CV (DEC-025) | VERIFIED |
| Software Engineering | Streamlit | In use | NutriFit, Game Stats (repo); CV skills | CV (DEC-025) | VERIFIED |
| Software Engineering | HTML and CSS, Tailwind CSS, Bootstrap | In use | CV skills (no work names them) | CV (DEC-025) | VERIFIED |
| Software Engineering | TypeScript | — | Listed by no source | — | OMIT unless confirmed |
| Software Engineering | C | In use | Owner's tech-stack image | DEC-028 | VERIFIED |
| **Data & Infrastructure** | MongoDB, MySQL | In use | AETHERION (CV); CV skills | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | FAISS (vector store) | In use | NeuroPlay (CV), NutriFit (repo); CV skills | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Redis | In use | AETHERION, freelance (CV) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Kafka | In use | AETHERION (CV) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Task queues (Celery, BullMQ) | In use | Freelance (CV: Celery); NeuroPlay (CV: BullMQ) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Docker | In use | AETHERION (CV); Algo Tutor training (Classic) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | AWS (EC2, RDS, S3) | In use | Freelance (CV); AWS Certified Cloud Practitioner, Apr 2026 (CV) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Git and GitHub | In use | Freelance stack (CV: GitHub); every work's repository | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Pandas, NumPy | In use | FinLit, Game Stats (repo); CV skills | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Matplotlib, Plotly | In use | Game Stats (repo); CV skills (Matplotlib) | CV (DEC-025) | VERIFIED |
| Data & Infrastructure | Netlify; Chart.js (with Matplotlib, Plotly) | In use | Owner's tech-stack image | DEC-028 | VERIFIED |
| Data & Infrastructure | GitLab, Postman, Render, Seaborn | — | Classic only; not in the CV or the owner's image | DEC-028 | OMIT |
| **Game Development** | Gameplay data and analysis | Experience | NeuroPlay (CV: behavioural gameplay analysis, ~28,000 gameplay samples); Game Stats Dashboard (repo) | CV (DEC-025) | VERIFIED |
| Game Development | Three.js / WebGL | Exploring | Owner's image (Three.js); Classic: "Exploring"; no work uses it | DEC-028 | VERIFIED (exploring) |
| Game Development | Canva (design) | In use | Owner's tech-stack image | DEC-028 | VERIFIED |
| Game Development | Game engines | — | No source names any engine | DEC-028 | OMIT |

Notes:
- No percentages, levels or logos are carried over. Classic's Core / Applied labels are replaced by the honest split: **in use** (with its evidence) or **exploring**.
- Chronoshift appears in the blueprint infographic as an "ML + RAG Platform". That is illustration text, not owner content, so it is not used as evidence.

## Path of Ascension (M6.3 timeline audit, 2026-11-22)
**Sources:**
- the CV (owner-confirmed, DEC-025; it wins conflicts);
- Classic's `education.js`, `experience.js` and `certifications.js`.

**Rule** (master doc §6, M6C): verified facts and accurate dates only; concise. Items only Classic has are left out by default, as for the skills (DEC-028), unless the owner keeps them.

| Region | Item | Proposed content | Source | Owner confirmation | Status |
|---|---|---|---|---|---|
| Path of Ascension | Intermediate | FIITJEE Junior College, Hyderabad, Telangana · Jun 2021 – Mar 2023 · Percentage 83.5% | CV (Classic agrees: 2021–2023, 83.5%) | CV (DEC-025) | VERIFIED |
| Path of Ascension | B.Tech | Computer Science and Engineering, Lovely Professional University, Phagwara, Punjab · Aug 2023 – present · CGPA 6.86 | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | CGPA conflict | 6.86 (CV) vs 6.91 (Classic) | CV wins (DEC-025) | — | Resolved |
| Path of Ascension | Certificates (2024) | The Bits and Bytes of Computer Networking (Sep 2024); Fundamentals of Network Communication, Coursera (Oct 2024) | CV (Classic agrees: Google and University of Colorado, via Coursera, 2024) | CV (DEC-025) | VERIFIED |
| Path of Ascension | AniCos leadership | AniCos Student Organization: Volunteer → Board Member → Co-CEO, over two years | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | AniCos title conflict | Co-CEO (CV) vs "CEO" (Classic) | CV wins (DEC-025) | — | Resolved |
| Path of Ascension | AniCos dates | Classic: Aug 2023 – present; the CV says only "over two years" | Classic only | DEC-030 | OMIT (shown as "over two years") |
| Path of Ascension | HackerRank | 5 stars in various programming languages (undated) | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | Machine Learning Intern | MacBease Connections Private Limited · Nov 2025 – present · admin dashboard (React + Node.js), ~35% better data visibility and decision-making efficiency; data visualisation pipelines and user management, ~40% less manual processing; testing and backend tuning, ~25% faster load times | CV (Classic agrees on role and start) | CV (DEC-025) | VERIFIED |
| Path of Ascension | Full Stack Developer (freelance) | Jan 2026 – present · hybrid B2B + B2C marketplace (role-based access, catalogue, checkout; 1000+ projected users); credit-based ledger and order lifecycle pipelines; Redis, Celery and AWS (EC2, RDS, S3), API responses 40–60% faster under load | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | AWS Certified Cloud Practitioner | CLF-C02 · Apr 2026 | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | Projects | AETHERION (Jan 2026 – present); NeuroPlay Engine (Jan – May 2026) | CV | CV (DEC-025) | VERIFIED |
| Path of Ascension | Secondary school (10th) | Vedanta Childhood High School, Anantapur · 2016 – 2021 · 99.6% | Classic only | DEC-030 | OMIT |
| Path of Ascension | Generative AI training | AI-Powered NLP & Generative AI Training, Algo Tutor Academy · Jun – Aug 2025 | Classic only | DEC-030 | OMIT (here, and as the Archive's "Training" label) |
| Path of Ascension | freeCodeCamp certificate | Legacy Responsive Web Design (2023) | Classic only | DEC-030 | OMIT |
| Path of Ascension | "Future development" | — | Belongs to the Horizon (M8), with the owner's ambitions | — | Not here |

## Worlds Beyond (M7.1 interest audit, 2026-11-22)
**Sources:**
- the master doc §6 Region 05 (owner-written: it names the six zones and what each should reveal);
- the CV (AniCos only);
- Classic: nothing about interests.

doc 06: "Audit content to verify six interests. Do not invent hobbies."

| Region | Item | Proposed content | Source | Owner confirmation | Status |
|---|---|---|---|---|---|
| Worlds Beyond | The six interests | Anime & Manga · Story-driven Games · Formula 1 · Gaming & Content Creation · The Guild (AniCos) · The Training Grounds (fitness) | Master doc §6 | Owner-written | VERIFIED (names only) |
| Worlds Beyond | Anime & Manga | One Piece | Owner (DEC-032) | Owner | VERIFIED |
| Worlds Beyond | Story-driven Games | — | No text yet | — | NEEDS OWNER (territory stays closed) |
| Worlds Beyond | Formula 1 | "It's not over until it's over" · the Max Verstappen mentality | Owner (DEC-032) | Owner | VERIFIED |
| Worlds Beyond | Gaming & Content Creation | Void Ronin (renamed; not "Amarok") · Instagram void_ronin.exe (link not tested) | Owner (DEC-032) | Owner | VERIFIED |
| Worlds Beyond | The Guild: AniCos progression | Volunteer → Board Member → Co-CEO, over two years | CV (DEC-025) | CV | VERIFIED |
| Worlds Beyond | The Guild: members and events | Leading 50+ members · CosCon 2.0 · Spooky Nights 2.0 | Owner (DEC-032) | Owner | VERIFIED |
| Worlds Beyond | The Guild: title | Master doc says "leadership/CEO"; the CV says Co-CEO | CV wins (DEC-025) | — | Resolved: Co-CEO |
| Worlds Beyond | Training Grounds | "A king never wavers. A king never bends. A king never relies on others. A king never gives up." | Owner (DEC-032; placement inferred from order) | Owner | VERIFIED |
