import {
  FaPython,
  FaReact,
  FaNodeJs,
  FaGit,
  FaDocker,
  FaGithub,
  FaDatabase,
  FaServer
} from "react-icons/fa";

import {
  SiJavascript,
  SiTailwindcss,
  SiBootstrap,
  SiChartdotjs,
  SiHtml5,
  SiCss3,
  SiFastapi,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
  SiPytorch,
  SiMongodb,
  SiMysql,
  SiPostman,
  SiStreamlit,
  SiRender,
  SiHuggingface,
  SiGitlab,
  SiLangchain,
  SiC,
  SiCplusplus,
  SiExpress,
  SiDjango,
  SiFlask,
  SiNetlify,
  SiThreedotjs,
  SiCanva,
  SiPlotly
} from "react-icons/si";

const skills = [
  {
    category: "Programming Languages",
    items: [
      { name: "Python", icon: FaPython, level: "Core", evidence: "Used in NeuroPlay Engine & NutriFit AI." },
      { name: "JavaScript", icon: SiJavascript, level: "Core", evidence: "Used in AETHERION & Portfolio." },
      { name: "C", icon: SiC, level: "Applied", evidence: "Academic projects and algorithms." },
      { name: "C++", icon: SiCplusplus, level: "Applied", evidence: "Data structures and competitive programming." },
      { name: "SQL", icon: FaDatabase, level: "Core", evidence: "Used in AETHERION backend." }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", icon: FaReact, level: "Core", evidence: "AETHERION and comic portfolio." },
      { name: "Tailwind CSS", icon: SiTailwindcss, level: "Core", evidence: "Primary styling framework." },
      { name: "Bootstrap", icon: SiBootstrap, level: "Applied", evidence: "Legacy projects." },
      { name: "Chart.js", icon: SiChartdotjs, level: "Exploring", evidence: "Data visualizations." },
      { name: "HTML5", icon: SiHtml5, level: "Core", evidence: "Semantic web structure." },
      { name: "CSS3", icon: SiCss3, level: "Core", evidence: "Advanced animations and layout." },
      { name: "Three.js", icon: SiThreedotjs, level: "Exploring", evidence: "Web GL rendering." }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "FastAPI", icon: SiFastapi, level: "Core", evidence: "AETHERION & FinLit AI backends." },
      { name: "Node.js", icon: FaNodeJs, level: "Applied", evidence: "Express.js APIs." },
      { name: "Express.js", icon: SiExpress, level: "Applied", evidence: "RESTful services." },
      { name: "Django", icon: SiDjango, level: "Applied", evidence: "AETHERION secondary backend." },
      { name: "Flask", icon: SiFlask, level: "Applied", evidence: "Microservices." },
      { name: "REST API", icon: FaServer, level: "Core", evidence: "Standard architecture pattern." }
    ]
  },
  {
    category: "Machine Learning & Data Science",
    items: [
      { name: "NumPy", icon: SiNumpy, level: "Core", evidence: "Data manipulation." },
      { name: "Pandas", icon: SiPandas, level: "Core", evidence: "SPAE & FinLit AI datasets." },
      { name: "Scikit-learn", icon: SiScikitlearn, level: "Applied", evidence: "SPAE ML models." },
      { name: "Matplotlib", icon: FaPython, level: "Applied", evidence: "Static plotting." }, // Using Python icon as fallback/related
      { name: "Seaborn", icon: FaPython, level: "Applied", evidence: "Statistical visualization." },    // Using Python icon as fallback/related
      { name: "PyTorch", icon: SiPytorch, level: "Exploring", evidence: "Deep learning models." },
      { name: "Plotly", icon: SiPlotly, level: "Applied", evidence: "Interactive dashboards." }
    ]
  },
  {
    category: "Generative AI",
    items: [
      { name: "LangChain", icon: SiLangchain, level: "Core", evidence: "NutriFit AI logic." },
      { name: "LangGraph", icon: SiLangchain, level: "Exploring", evidence: "Agentic workflows." } // Using LangChain icon as it's part of ecosystem
    ]
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", icon: SiMongodb, level: "Core", evidence: "NoSQL document storage." },
      { name: "MySQL", icon: SiMysql, level: "Applied", evidence: "Relational data management." },
      { name: "FAISS", icon: FaDatabase, level: "Core", evidence: "Vector similarity search for RAG." }
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", icon: FaGit, level: "Core", evidence: "Version control." },
      { name: "GitHub", icon: FaGithub, level: "Core", evidence: "Source hosting & CI/CD." },
      { name: "GitLab", icon: SiGitlab, level: "Applied", evidence: "Enterprise repos." },
      { name: "Docker", icon: FaDocker, level: "Applied", evidence: "Containerization." },
      { name: "Postman", icon: SiPostman, level: "Core", evidence: "API testing." },
      { name: "Streamlit", icon: SiStreamlit, level: "Core", evidence: "Dashboard prototyping." },
      { name: "Render", icon: SiRender, level: "Applied", evidence: "Cloud deployment." },
      { name: "Hugging Face", icon: SiHuggingface, level: "Exploring", evidence: "Model hosting." },
      { name: "Netlify", icon: SiNetlify, level: "Applied", evidence: "Frontend deployment." },
      { name: "Canva", icon: SiCanva, level: "Applied", evidence: "Asset design." }
    ]
  }
];

export default skills;
