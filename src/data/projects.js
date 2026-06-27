import img1 from "../assets/images/nutrifit_ai.png";
import img2 from "../assets/images/game_stats_dashboard.png";
import img3 from "../assets/images/smart_cities.png";
import img4 from "../assets/images/sales_analytics.png";

const placeholderImg = img1; // Using existing image as placeholder for new projects

const projects = [
  {
    title: "NeuroPlay Engine",
    description: "[PLACEHOLDER] An advanced Generative AI engine for dynamic experiences.",
    category: "Generative AI",
    tech: ["Python", "LangChain", "Generative AI", "React"],
    codeLink: "#",
    liveLink: "#",
    status: "In Development",
    image: placeholderImg,
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
    title: "NutriFit AI – Personalized Fitness & Nutrition Assistant",
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
    description: "[PLACEHOLDER] AI-driven financial literacy and advisory platform.",
    category: "Machine Learning",
    tech: ["Python", "Pandas", "LLMs", "FastAPI"],
    codeLink: "#",
    status: "In Development",
    image: placeholderImg,
    featured: false,
    palette: "yellow"
  },
  {
    title: "PARAS System",
    description: "[PLACEHOLDER] Real-time safety and behavioral intelligence platform.",
    category: "Machine Learning",
    tech: ["Python", "Computer Vision", "Real-Time Processing"],
    codeLink: "#",
    status: "Prototype",
    image: placeholderImg,
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
    description: "An advanced Machine Learning–powered statistics dashboard designed to analyze sales performance, uncover trends, and generate predictive insights using large-scale datasets.",
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
