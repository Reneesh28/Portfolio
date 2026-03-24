import img1 from "../assets/images/nutrifit_ai.png";
import img2 from "../assets/images/game_stats_dashboard.png";
import img3 from "../assets/images/smart_cities.png";
import img4 from "../assets/images/sales_analytics.png";

const projects = [
  {
    title: "NutriFit AI – Personalized Fitness & Nutrition Assistant",
    description:
      "An AI-powered assistant that delivers personalized fitness and nutrition recommendations using health data. Built with multi-turn conversational memory and Retrieval-Augmented Generation (RAG).",
    tech: [
      "Python",
      "LangChain",
      "FAISS",
      "Streamlit",
      "FastAPI",
      "Sentence Transformers",
      "Groq API"
    ],
    codeLink: "https://github.com/Reneesh28/Nutrifit-AI",
    status: "completed",
    image: img1
  },
  {
    title: "Game Stats Dashboard & Recommender",
    description:
      "An interactive Streamlit dashboard that analyzes gameplay data from Excel files and generates personalized game recommendations using LLMs.",
    tech: [
      "Python",
      "Streamlit",
      "Pandas",
      "NumPy",
      "Groq API",
      "Matplotlib",
      "Plotly"
    ],
    codeLink:
      "https://github.com/Reneesh28/Game_Stats_Dashboard_Recommendation-System",
    status: "completed",
    image: img2
  },
  {
    title: "AETHERION - Real-Time Markets. Intelligent Decisions.",
    description:
      "AETHERION is an AI-powered trading intelligence engine that reads the market in real time and adapts strategies instantly.",
    tech: ["REACT", "TAILWIND", "DJANGO", "FASTAPI", "MONGODB", "FLASK", "MYSQL"],
    codeLinkBackend: "https://github.com/Reneesh28/AETHERION_BACKEND",
    codeLinkFrontend: "https://github.com/Reneesh28/AETHERION_FRONTEND",
    status: "completed",
    image: img3
  },
  {
    title: "Sales Performance Analytics Engine (SPAE)",
    description:
      "An advanced Machine Learning–powered statistics dashboard designed to analyze sales performance, uncover trends, and generate predictive insights using large-scale datasets.",
    tech: [
      "Python",
      "Machine Learning",
      "Data Analytics",
      "Statistics",
      "Dashboarding"
    ],
    codeLink: "https://github.com/Reneesh28/Project_ML",
    status: "completed",
    image: img4
  }
];

export default projects;
