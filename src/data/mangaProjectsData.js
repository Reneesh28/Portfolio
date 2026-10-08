import aetherionImg from '../assets/images/manga_ai_architecture.jpg';
import neuroplayImg from '../assets/images/manga_creative_worldbuilding.jpg';
import nutrifitImg from '../assets/images/nutrifit_ai.webp';
import spaeImg from '../assets/images/sales_analytics.webp';
import gamestatsImg from '../assets/images/game_stats_dashboard.webp';

export const MANGA_PROJECTS = [
  {
    id: 'aetherion',
    number: '01',
    volume: 'VOL. 01',
    kanji: '電脳市場',
    title: 'AETHERION',
    subtitle: 'REAL-TIME MARKETS. INTELLIGENT DECISIONS.',
    category: 'FULL-STACK & AI SYSTEMS',
    status: 'PROTOTYPE // SOURCE AVAILABLE',
    year: '2026',
    role: 'SYSTEM ARCHITECT & BUILDER',
    featured: true,
    image: aetherionImg,
    sfx: 'ゴゴゴ…',
    sfxMeaning: 'Market Engine Rumble',
    description: 'An AI-driven quantitative trading and market intelligence engine designed to analyze market fluctuations in real time, evaluate predictive indicators, and deliver responsive decision support.',
    technologies: ['React.js', 'Tailwind CSS', 'FastAPI', 'Django', 'MongoDB', 'MySQL', 'Machine Learning'],
    githubFrontend: 'https://github.com/Reneesh28/AETHERION_FRONTEND',
    githubBackend: 'https://github.com/Reneesh28/AETHERION_BACKEND',
    demo: null,
    architecture: [
      { node: 'MARKET DATA STREAM', sub: 'Real-Time Ingestion' },
      { node: 'FASTAPI & DJANGO', sub: 'Asynchronous Microservices' },
      { node: 'PREDICTIVE ML CORE', sub: 'Trend & Risk Strategy' },
      { node: 'REACT TELEMETRY UI', sub: 'High-Density Dashboard' }
    ],
    overview: 'AETHERION bridges quantitative machine learning models with high-density frontend interfaces. It processes market feeds asynchronously through Python backends, computes strategy indicators, and visualizes market analytics with institutional precision.',
    impact: 'Engineered modular multi-backend microservices (FastAPI & Django), optimized database schemas across MongoDB and MySQL, and implemented responsive telemetry components.'
  },
  {
    id: 'neuroplay',
    number: '02',
    volume: 'VOL. 02',
    kanji: '神経遊戯',
    title: 'NEUROPLAY ENGINE',
    subtitle: 'ADAPTIVE GAME INTELLIGENCE & GENERATIVE AI',
    category: 'GENERATIVE AI & GAME FORGE',
    status: 'IN DEVELOPMENT // SOURCE AVAILABLE',
    year: '2025 — 2026',
    role: 'CREATOR & DEVELOPER',
    featured: true,
    image: neuroplayImg,
    sfx: 'ザッ…',
    sfxMeaning: 'Interactive World Generation',
    description: 'An advanced Generative AI engine designed for dynamic interactive game experiences, utilizing robust agentic architecture for rapid contextual processing and procedural generation.',
    technologies: ['Python', 'LangChain', 'Generative AI', 'React.js', 'LLM Agents', 'FastAPI'],
    github: 'https://github.com/Reneesh28/NeuroPlay',
    demo: 'https://neuroplay.vercel.app',
    architecture: [
      { node: 'PLAYER STATE & INPUT', sub: 'Interactive Context' },
      { node: 'LANGCHAIN ENGINE', sub: 'Prompt Memory & Chains' },
      { node: 'GENERATIVE LLM', sub: 'Dynamic World Content' },
      { node: 'REACT GAMEPLAY UI', sub: 'Kinetic Game Rendering' }
    ],
    overview: 'NeuroPlay Engine explores the intersection of artificial intelligence and interactive game storytelling. It utilizes LangChain reasoning chains to dynamically adapt gameplay narratives and NPC responses based on continuous player choices.',
    impact: 'Deployed live interactive web demonstration, integrating multi-turn conversational agents with stateful frontend game rendering.'
  },
  {
    id: 'nutrifit_ai',
    number: '03',
    volume: 'VOL. 03',
    kanji: '健康知能',
    title: 'NUTRIFIT AI',
    subtitle: 'PERSONALIZED HEALTH & NUTRITION ASSISTANT',
    category: 'GENERATIVE AI & RAG',
    status: 'SOURCE AVAILABLE',
    year: '2025',
    role: 'AI ENGINEER',
    featured: false,
    image: nutrifitImg,
    sfx: 'ギュィン…',
    sfxMeaning: 'Retrieval Computation',
    description: 'An AI-powered assistant that delivers tailored fitness and dietary recommendations using personal biometric data, featuring multi-turn conversational memory and Retrieval-Augmented Generation (RAG).',
    technologies: ['Python', 'LangChain', 'FAISS', 'Streamlit', 'FastAPI', 'Sentence Transformers', 'Groq API'],
    github: 'https://github.com/Reneesh28/Nutrifit-AI',
    demo: null,
    architecture: [
      { node: 'BIOMETRIC INPUTS', sub: 'User Dietary & Fitness Data' },
      { node: 'FAISS VECTOR STORE', sub: 'Domain Nutrition Embeddings' },
      { node: 'LANGCHAIN RAG PIPELINE', sub: 'Context-Injected Prompting' },
      { node: 'GROQ LLM INFERENCE', sub: 'Ultra-Fast Adaptive Advice' }
    ],
    overview: 'NutriFit AI implements a complete RAG pipeline where clinical health guidelines and nutritional knowledge bases are embedded and indexed with FAISS, enabling grounded, hallucination-resistant fitness counseling.',
    impact: 'Implemented sub-second inference with Groq API, multi-turn memory buffers, and interactive Streamlit diagnostic dashboards.'
  },
  {
    id: 'spae_engine',
    number: '04',
    volume: 'VOL. 04',
    kanji: '統計分析',
    title: 'SPAE ENGINE',
    subtitle: 'SALES PERFORMANCE ANALYTICS & ML PIPELINES',
    category: 'DATA SCIENCE & PREDICTIVE ML',
    status: 'SOURCE AVAILABLE',
    year: '2025',
    role: 'ML DEVELOPER',
    featured: false,
    image: spaeImg,
    sfx: 'ズズズ…',
    sfxMeaning: 'Data Aggregation Pipeline',
    description: 'A Machine Learning-powered statistical analytics engine engineered to uncover sales trends, evaluate predictive customer metrics, and generate actionable revenue forecasts from large datasets.',
    technologies: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Data Analytics', 'Matplotlib'],
    github: 'https://github.com/Reneesh28/Project_ML',
    demo: null,
    architecture: [
      { node: 'RAW DATASET INGESTION', sub: 'Tabular Enterprise Data' },
      { node: 'PANDAS PREPROCESSING', sub: 'Feature Engineering & Cleaning' },
      { node: 'SCIKIT-LEARN MODELS', sub: 'Supervised Regression & Classifiers' },
      { node: 'ANALYTIC TELEMETRY', sub: 'Visual Forecast Dashboards' }
    ],
    overview: 'SPAE demonstrates data preprocessing rigor, feature scaling, model cross-validation, and predictive modeling on enterprise sales datasets to identify key revenue drivers and churn patterns.',
    impact: 'Achieved high predictive accuracy through hyperparameter tuning and delivered clean statistical visualizations of customer segmentation.'
  },
  {
    id: 'game_stats_dashboard',
    number: '05',
    volume: 'VOL. 05',
    kanji: '遊戯推薦',
    title: 'GAME STATS & RECOMMENDER',
    subtitle: 'DATA DASHBOARD & INTELLIGENT RECOMMENDATION',
    category: 'DATA VISUALIZATION & AI',
    status: 'SOURCE AVAILABLE',
    year: '2025',
    role: 'FULL-STACK DEVELOPER',
    featured: false,
    image: gamestatsImg,
    sfx: 'カチッ…',
    sfxMeaning: 'Data Metric Rendering',
    description: 'An interactive Streamlit analytics platform that processes gameplay metrics from spreadsheet datasets and synthesizes personalized gaming recommendations using LLM inference.',
    technologies: ['Python', 'Streamlit', 'Pandas', 'NumPy', 'Groq API', 'Plotly', 'Matplotlib'],
    github: 'https://github.com/Reneesh28/Game_Stats_Dashboard_Recommendation-System',
    demo: null,
    architecture: [
      { node: 'EXCEL / CSV INGESTION', sub: 'Gameplay Metrics & Scores' },
      { node: 'NUMPY & PANDAS AGG', sub: 'Statistical Metrics Analysis' },
      { node: 'GROQ LLM RECOMMENDER', sub: 'Contextual Preference Matching' },
      { node: 'STREAMLIT & PLOTLY', sub: 'Interactive Dynamic Charts' }
    ],
    overview: 'Combines statistical data visualization with generative AI recommendations, providing gamers with interactive telemetry breakdown of their in-game performance and genre affinities.',
    impact: 'Constructed custom Plotly charts with interactive filtering, and connected LLM prompts for natural language preference matching.'
  }
];
