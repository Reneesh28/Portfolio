export const ARSENAL_CATEGORIES = [
  {
    id: 'ai_ml',
    name: 'AI / MACHINE LEARNING',
    kanji: '人工知能',
    subtitle: 'INTELLIGENCE, AGENTS & NEURAL PIPELINES',
    serial: 'SPEC-01 // COGNITIVE',
    sfx: 'ギュィン…',
    sfxMeaning: 'Neural Computation Humming',
    items: [
      {
        name: 'Python',
        status: 'PRIMARY',
        domains: 'AI/ML · BACKEND · DATA',
        domainList: ['Generative AI', 'Data Pipelines', 'Deep Learning', 'Backend Services'],
        context: 'Primary engineering language utilized across machine learning pipelines, LLM agent architectures, vector similarity search, and computational backends.',
        evidence: 'Core language in NutriFit AI, NeuroPlay Engine, and predictive analytics pipelines at MacBease Connections.'
      },
      {
        name: 'LangChain',
        status: 'ACTIVE',
        domains: 'GENERATIVE AI · AGENTS · RAG',
        domainList: ['Prompt Engineering', 'Chains', 'Retrieval QA', 'Tool Calling'],
        context: 'Orchestrating multi-turn conversational agents, prompt memory structures, and retrieval-augmented generation pipelines.',
        evidence: 'Implemented conversational logic and nutritional advisory pipelines in NutriFit AI.'
      },
      {
        name: 'LangGraph',
        status: 'EXPLORING',
        domains: 'AGENTIC WORKFLOWS · STATE MACHINES',
        domainList: ['Cyclic Graphs', 'Multi-Agent State', 'Human-in-the-Loop'],
        context: 'Building cyclical graph-based multi-agent workflows with state persistence, conditional branching, and agentic reflection.',
        evidence: 'Architecting experimental autonomous multi-agent reasoning graphs.'
      },
      {
        name: 'RAG & FAISS',
        status: 'ACTIVE',
        domains: 'VECTOR RETRIEVAL · EMBEDDINGS',
        domainList: ['Similarity Indexing', 'Context Injection', 'Dense Embeddings'],
        context: 'Developing vector similarity retrieval systems using FAISS to power contextual search and grounded document-QA engines.',
        evidence: 'Deployed FAISS vector store indexing for fast multi-document retrieval.'
      },
      {
        name: 'Scikit-Learn',
        status: 'ACTIVE',
        domains: 'PREDICTIVE MODELING · ML ALGORITHMS',
        domainList: ['Classification', 'Regression', 'Feature Engineering', 'Model Evaluation'],
        context: 'Training, tuning, and evaluating classical machine learning models with rigorous cross-validation and metric telemetry.',
        evidence: 'Used in SPAE predictive modeling and internship machine learning tasks at MacBease Connections.'
      },
      {
        name: 'Pandas & NumPy',
        status: 'PRIMARY',
        domains: 'DATA SCIENCE · MATRIX COMPUTATION',
        domainList: ['Data Wrangling', 'Vectorization', 'Statistical Preprocessing'],
        context: 'Essential toolkit for large-scale tabular data manipulation, feature matrix preparation, and mathematical array computations.',
        evidence: 'Preprocessed datasets across financial, nutritional, and predictive enterprise analytics.'
      },
      {
        name: 'PyTorch',
        status: 'EXPLORING',
        domains: 'DEEP LEARNING · TENSORS',
        domainList: ['Neural Networks', 'Loss Optimization', 'Custom Layers'],
        context: 'Experimenting with neural network topologies, gradient computations, and tensor operations for bespoke architectures.',
        evidence: 'Deep learning exploratory implementations and neural layer prototyping.'
      },
      {
        name: 'Hugging Face',
        status: 'ACTIVE',
        domains: 'TRANSFORMERS · MODEL HUB',
        domainList: ['Pretrained Models', 'Tokenizers', 'Inference APIs'],
        context: 'Integrating open-source transformer checkpoints, sentence transformers for dense embeddings, and Hugging Face inference pipelines.',
        evidence: 'Integrated open-source transformer models in NLP and multimodal training coursework.'
      }
    ]
  },
  {
    id: 'software',
    name: 'SOFTWARE ENGINEERING',
    kanji: '基幹開発',
    subtitle: 'FULL-STACK, APIS & RUNTIME ARCHITECTURE',
    serial: 'SPEC-02 // CORE_STACK',
    sfx: 'カタカタ…',
    sfxMeaning: 'Rapid Keyboard Execution',
    items: [
      {
        name: 'FastAPI',
        status: 'PRIMARY',
        domains: 'HIGH-PERF APIS · ASYNC BACKEND',
        domainList: ['Asynchronous Python', 'Pydantic Schemas', 'OpenAPI Specs', 'Model Serving'],
        context: 'High-performance asynchronous backend framework used for building production-ready REST APIs, microservices, and serving machine learning models.',
        evidence: 'Engineered primary backend microservices in AETHERION and FinLit AI platforms.'
      },
      {
        name: 'React.js',
        status: 'PRIMARY',
        domains: 'FRONTEND ARCHITECTURE · UI STATE',
        domainList: ['Component Composition', 'Custom Hooks', 'Virtual DOM', 'Performance Optimization'],
        context: 'Core frontend library used to build complex, responsive, stateful web applications with seamless interaction hierarchies.',
        evidence: 'Architected the interactive manga portfolio, AETHERION client interfaces, and dashboard UIs.'
      },
      {
        name: 'JavaScript (ES6+)',
        status: 'PRIMARY',
        domains: 'WEB RUNTIME · ASYNC LOGIC',
        domainList: ['Promises & Async/Await', 'Event Loop', 'DOM Manipulation', 'Modular Architecture'],
        context: 'Foundational programming language for web architectures, asynchronous event orchestration, and dynamic browser logic.',
        evidence: 'Utilized across all modern web development projects, interactive portals, and client web apps.'
      },
      {
        name: 'Node.js & Express',
        status: 'ACTIVE',
        domains: 'SERVER RUNTIME · REST ROUTING',
        domainList: ['Middleware Pipelines', 'REST APIs', 'Server-Side Events'],
        context: 'Building lightweight server-side services, API gateways, and custom backend utilities.',
        evidence: 'Constructed custom RESTful backend endpoints and authentication services.'
      },
      {
        name: 'Tailwind CSS & Vanilla CSS',
        status: 'PRIMARY',
        domains: 'DESIGN SYSTEMS · RESPONSIVE UX',
        domainList: ['CSS Variables', 'Fluid Typography', 'Custom Tokens', 'Monochrome Aesthetics'],
        context: 'Crafting high-precision design systems, fluid responsive typography, and tailored manga-inspired visual aesthetics.',
        evidence: 'Engineered the bespoke Tankobon manga styling system across Intro, Hero, and About spreads.'
      },
      {
        name: 'C / C++',
        status: 'WORKING',
        domains: 'SYSTEMS PROGRAMMING · ALGORITHMS',
        domainList: ['Data Structures', 'Memory Management', 'Algorithmic Optimization'],
        context: 'Developing fundamental algorithmic thinking, data structures, and computational optimization.',
        evidence: 'Used in academic computer science coursework and algorithmic problem-solving.'
      },
      {
        name: 'Django & Flask',
        status: 'WORKING',
        domains: 'PYTHON WEB PLATFORMS',
        domainList: ['ORM Management', 'Microservices', 'Templating'],
        context: 'Secondary Python web frameworks utilized for rapid prototyping and monolithic backend architectures.',
        evidence: 'Implemented microservice routes and database ORM integrations.'
      }
    ]
  },
  {
    id: 'data_infra',
    name: 'DATA & INFRASTRUCTURE',
    kanji: '情報基盤',
    subtitle: 'STORAGE, CONTAINERS & DEPLOYMENT PIPELINES',
    serial: 'SPEC-03 // INFRA',
    sfx: 'ズズズ…',
    sfxMeaning: 'Heavy Data Pipeline Movement',
    items: [
      {
        name: 'MongoDB',
        status: 'PRIMARY',
        domains: 'NOSQL DATABASE · DOCUMENT STORE',
        domainList: ['Document Modeling', 'Aggregation Framework', 'Index Optimization'],
        context: 'Primary NoSQL database for flexible data structures, user state caching, and rapid document persistence.',
        evidence: 'Employed in full-stack web applications for dynamic document storage.'
      },
      {
        name: 'MySQL / SQL',
        status: 'ACTIVE',
        domains: 'RELATIONAL DATABASES · SCHEMAS',
        domainList: ['ACID Compliance', 'Relational Schemas', 'Complex Joins', 'Query Tuning'],
        context: 'Structured database management for relational integrity, schema normalization, and transactional data processing.',
        evidence: 'Structured backend storage and analytical reporting queries in academic and enterprise environments.'
      },
      {
        name: 'Docker',
        status: 'ACTIVE',
        domains: 'CONTAINERIZATION · DEVOPS',
        domainList: ['Dockerfile Architecture', 'Container Isolation', 'Multi-Stage Builds'],
        context: 'Packaging application services, dependencies, and FastAPI backends into reproducible container environments.',
        evidence: 'Containerized AI-powered applications during intensive generative AI training modules.'
      },
      {
        name: 'Git & GitHub / GitLab',
        status: 'PRIMARY',
        domains: 'VERSION CONTROL · COLLABORATION',
        domainList: ['Branching Strategies', 'Pull Requests', 'Version Tagging', 'CI/CD Automation'],
        context: 'Standard source control system for versioning, collaborative peer reviews, and automated build checks.',
        evidence: 'Primary version control infrastructure across all personal, academic, and organization repositories.'
      },
      {
        name: 'Render & Netlify',
        status: 'ACTIVE',
        domains: 'CLOUD HOSTING · EDGE NETWORKS',
        domainList: ['Continuous Deployment', 'HTTPS Automation', 'Static Hosting'],
        context: 'Deploying live full-stack services and client-side applications with zero-downtime deployment pipelines.',
        evidence: 'Configured automated continuous deployment for live client sites and API backends.'
      }
    ]
  },
  {
    id: 'creative_tech',
    name: 'CREATIVE TECHNOLOGY',
    kanji: '電脳表現',
    subtitle: '3D GRAPHICS, STORYTELLING & SIMULATION',
    serial: 'SPEC-04 // CREATIVE',
    sfx: 'シャッ…',
    sfxMeaning: 'Dynamic Motion & Ink Flow',
    items: [
      {
        name: 'GSAP & ScrollTrigger',
        status: 'PRIMARY',
        domains: 'KINETIC ANIMATION · CINEMATICS',
        domainList: ['Timeline Sequencing', 'Scroll Physics', 'SVG Transforms', 'MatchMedia'],
        context: 'Precision animation engine used for complex narrative sequences, page-turn scroll mechanics, and responsive timeline orchestration.',
        evidence: 'Drives the cinematic Manga Intro, Hero interactive spread, and Character Profile reveals.'
      },
      {
        name: 'Three.js & WebGL',
        status: 'EXPLORING',
        domains: '3D CANVAS · SHADERS',
        domainList: ['Scene Graphs', 'Mesh Geometry', 'Perspective Camera', 'WebGL Rendering'],
        context: 'Rendering real-time 3D geometry, interactive 3D books, and spatial graphics within the browser.',
        evidence: 'Powering the 3D Manga Volume open-sequence in the cinematic intro.'
      },
      {
        name: 'Interactive Simulation',
        status: 'ACTIVE',
        domains: 'GAME DESIGN · MECHANICS',
        domainList: ['Worldbuilding Rules', 'Simulation Physics', 'State Management'],
        context: 'Designing interactive simulation loops, player state machines, and procedural mechanics for indie game projects.',
        evidence: 'Applied in indie game forge prototypes and interactive game mechanics development.'
      },
      {
        name: 'Streamlit',
        status: 'ACTIVE',
        domains: 'RAPID PROTOTYPING · AI UI',
        domainList: ['Live Telemetry', 'Model Dashboards', 'Quick Exploration'],
        context: 'Rapid UI framework for prototyping machine learning models and creating interactive data-driven dashboards.',
        evidence: 'Built experimental dashboards and interactive ML diagnostic tools.'
      },
      {
        name: 'Plotly & Chart.js',
        status: 'ACTIVE',
        domains: 'DATA VISUALIZATION · TELEMETRY',
        domainList: ['Interactive Plots', 'Real-time Metrics', 'Statistical Charts'],
        context: 'Visualizing multi-dimensional analytics, loss curves, and operational telemetry through interactive charts.',
        evidence: 'Integrated into analytics dashboards for performance evaluation.'
      }
    ]
  },
  {
    id: 'tools_workflow',
    name: 'DEV TOOLS & WORKFLOW',
    kanji: '道具一式',
    subtitle: 'ENGINEERING UTILITIES & CRAFT DISCIPLINE',
    serial: 'SPEC-05 // WORKFLOW',
    sfx: 'カチッ…',
    sfxMeaning: 'Tool Click & Verification',
    items: [
      {
        name: 'Postman',
        status: 'PRIMARY',
        domains: 'API VALIDATION · PAYLOAD TESTING',
        domainList: ['Endpoint Verification', 'Mock Servers', 'Automated Collections'],
        context: 'Validating API endpoints, inspecting payload structures, and testing error handling across RESTful microservices.',
        evidence: 'Essential tool for testing and debugging all FastAPI and Express backend routes.'
      },
      {
        name: 'VS Code & CLI Workflows',
        status: 'PRIMARY',
        domains: 'DEVELOPMENT WORKSPACE · TERMINAL',
        domainList: ['Custom Keybindings', 'Integrated Debugging', 'Git Tooling'],
        context: 'Main development cockpit configured for rapid code authoring, linting, git operations, and terminal orchestration.',
        evidence: 'Primary IDE for writing, debugging, and maintaining the portfolio codebase.'
      },
      {
        name: 'Linux / Bash Scripting',
        status: 'ACTIVE',
        domains: 'SHELL AUTOMATION · OS ENVIRONMENT',
        domainList: ['Shell Scripting', 'Process Management', 'Build Automation'],
        context: 'Navigating Unix environments, automating repetitive build tasks, and managing cloud container workflows.',
        evidence: 'Daily command-line usage for git, package management, and server administration.'
      },
      {
        name: 'Canva & Visual Asset Forge',
        status: 'ACTIVE',
        domains: 'DIGITAL ASSETS · WIREFRAMING',
        domainList: ['Concept Wireframes', 'Asset Layouts', 'Graphic Styling'],
        context: 'Drafting initial visual layouts, creating graphic templates, and preparing vector iconography for projects.',
        evidence: 'Used to layout visual presentation materials and project documentation diagrams.'
      }
    ]
  }
];
