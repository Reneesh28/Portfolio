import {
  FaPython,
  FaReact,
  FaNodeJs,
  FaGit,
  FaDocker,
  FaGithub,
  FaDatabase
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
  SiExpress
} from "react-icons/si";

const skills = [
  {
    category: "Programming Languages",
    items: [
      { name: "Python", icon: FaPython },
      { name: "JavaScript", icon: SiJavascript },
      { name: "C", icon: SiC },
      { name: "C++", icon: SiCplusplus },
      { name: "SQL", icon: FaDatabase }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", icon: FaReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Bootstrap", icon: SiBootstrap },
      { name: "Chart.js", icon: SiChartdotjs },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss3 }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "Node.js", icon: FaNodeJs },
      { name: "Express.js", icon: SiExpress }
    ]
  },
  {
    category: "Machine Learning & Data Science",
    items: [
      { name: "NumPy", icon: SiNumpy },
      { name: "Pandas", icon: SiPandas },
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "Matplotlib", icon: FaPython }, // Using Python icon as fallback/related
      { name: "Seaborn", icon: FaPython },    // Using Python icon as fallback/related
      { name: "PyTorch", icon: SiPytorch }
    ]
  },
  {
    category: "Generative AI",
    items: [
      { name: "LangChain", icon: SiLangchain },
      { name: "LangGraph", icon: SiLangchain } // Using LangChain icon as it's part of ecosystem
    ]
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
      { name: "FAISS", icon: FaDatabase }
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", icon: FaGit },
      { name: "GitHub", icon: FaGithub },
      { name: "GitLab", icon: SiGitlab },
      { name: "Docker", icon: FaDocker },
      { name: "Postman", icon: SiPostman },
      { name: "Streamlit", icon: SiStreamlit },
      { name: "Render", icon: SiRender },
      { name: "Hugging Face", icon: SiHuggingface }
    ]
  }
];

export default skills;
