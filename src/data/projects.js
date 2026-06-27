import img1 from "../assets/images/nutrifit_ai.webp";
import img2 from "../assets/images/game_stats_dashboard.webp";
import img3 from "../assets/images/smart_cities.webp";
import img4 from "../assets/images/sales_analytics.webp";


const projects = [
  {
    title: "NeuroPlay Engine",
    description: "An advanced Generative AI engine designed for dynamic interactive experiences, utilizing robust architecture for rapid processing.",
    category: "Generative AI",
    tech: ["Python", "LangChain", "Generative AI", "React"],
    codeLink: "https://github.com/Reneesh28/NeuroPlay",
    liveLink: "https://neuroplay.vercel.app",
    status: "In Development",
    image: img4,
    featured: true,
    palette: "cyan"
  },
  {
    title: "AETHERION - Real-Time Markets. Intelligent Decisions.",
    description: "AETHERION is an AI-powered trading intelligence engine that reads the market in real time and adapts strategies instantly.",
    category: "Full Stack",
    tech: ["REACT", "TAILWIND", "DJANGO", "FASTAPI", "MONGODB", "FLASK", "MYSQL"],
    codeLinkBackend: "https://github.com/Reneesh28/AETHERION_BACKEND",
    codeLinkFrontend: "https://github.com/Reneesh28/AETHERION_FRONTEND",
    status: "Prototype",
    image: img3,
    featured: true,
    palette: "red"
  },
  {
    title: "NutriFit AI - Personalized Fitness & Nutrition Assistant",
    description: "An AI-powered assistant that delivers personalized fitness and nutrition recommendations using health data. Built with multi-turn conversational memory and Retrieval-Augmented Generation (RAG).",
    category: "Generative AI",
    tech: ["Python", "LangChain", "FAISS", "Streamlit", "FastAPI", "Sentence Transformers", "Groq API"],
    codeLink: "https://github.com/Reneesh28/Nutrifit-AI",
    status: "Source Available",
    image: img1,
    featured: true,
    palette: "acid"
  },
  {
    title: "FinLit AI",
    description: "An AI-driven financial literacy and advisory platform leveraging LLMs to simplify complex economic principles into personalized advice.",
    category: "Machine Learning",
    tech: ["Python", "Pandas", "LLMs", "FastAPI"],
    codeLink: "https://github.com/Reneesh28/FinLit-AI",
    status: "In Development",
    image: img3,
    featured: false,
    palette: "yellow"
  },
  {
    title: "PARAS System",
    description: "A real-time safety and behavioral intelligence platform that processes live video feeds using computer vision to detect anomalies.",
    category: "Machine Learning",
    tech: ["Python", "Computer Vision", "Real-Time Processing"],
    codeLink: "https://github.com/Reneesh28/PARAS",
    status: "Prototype",
    image: img2,
    featured: false,
    palette: "red"
  },
  {
    title: "Game Stats Dashboard & Recommender",
    description: "An interactive Streamlit dashboard that analyzes gameplay data from Excel files and generates personalized game recommendations using LLMs.",
    category: "Data",
    tech: ["Python", "Streamlit", "Pandas", "NumPy", "Groq API", "Matplotlib", "Plotly"],
    codeLink: "https://github.com/Reneesh28/Game_Stats_Dashboard_Recommendation-System",
    status: "Source Available",
    image: img2,
    featured: false,
    palette: "magenta"
  },
  {
    title: "Sales Performance Analytics Engine (SPAE)",
    description: "An advanced Machine Learning-powered statistics dashboard designed to analyze sales performance, uncover trends, and generate predictive insights using large-scale datasets.",
    category: "Data",
    tech: ["Python", "Machine Learning", "Data Analytics", "Statistics", "Dashboarding"],
    codeLink: "https://github.com/Reneesh28/Project_ML",
    status: "Source Available",
    image: img4,
    featured: false,
    palette: "yellow"
  }
];

export default projects;
