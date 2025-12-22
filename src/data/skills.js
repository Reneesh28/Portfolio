import {
  FaPython,
  FaReact,
  FaNodeJs,
  FaGit,
  FaDocker
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
  SiLangchain
} from "react-icons/si";

const skills = [
  {
    category: "Programming Languages",
    items: [
      { name: "Python", level: "90%", icon: FaPython },
      { name: "JavaScript", level: "80%", icon: SiJavascript },
      { name: "C", level: "65%" },
      { name: "C++", level: "70%" },
      { name: "SQL", level: "85%" }
    ]
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", level: "85%", icon: FaReact },
      { name: "Tailwind CSS", level: "85%", icon: SiTailwindcss },
      { name: "Bootstrap", level: "80%", icon: SiBootstrap },
      { name: "Chart.js", level: "75%", icon: SiChartdotjs },
      { name: "HTML5", level: "90%", icon: SiHtml5 },
      { name: "CSS3", level: "85%", icon: SiCss3 }
    ]
  },
  {
    category: "Backend",
    items: [
      { name: "FastAPI", level: "75%", icon: SiFastapi },
      { name: "Node.js", level: "70%", icon: FaNodeJs },
      { name: "Express.js", level: "70%" }
    ]
  },
  {
    category: "Machine Learning & Data Science",
    items: [
      { name: "NumPy", level: "80%", icon: SiNumpy },
      { name: "Pandas", level: "85%", icon: SiPandas },
      { name: "Scikit-learn", level: "75%", icon: SiScikitlearn },
      { name: "Matplotlib", level: "80%" },
      { name: "Seaborn", level: "75%" },
      { name: "PyTorch", level: "70%", icon: SiPytorch }
    ]
  },
  {
    category: "Generative AI",
    items: [
      { name: "LangChain", level: "70%", icon: SiLangchain },
      { name: "LangGraph", level: "65%" }
    ]
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", level: "80%", icon: SiMongodb },
      { name: "MySQL", level: "85%", icon: SiMysql },
      { name: "FAISS", level: "70%" }
    ]
  },
  {
    category: "Tools & Platforms",
    items: [
      { name: "Git", level: "85%", icon: FaGit },
      { name: "GitHub", level: "85%" },
      { name: "GitLab", level: "80%", icon: SiGitlab },
      { name: "Docker", level: "75%", icon: FaDocker },
      { name: "Postman", level: "80%", icon: SiPostman },
      { name: "Streamlit", level: "80%", icon: SiStreamlit },
      { name: "Render", level: "75%", icon: SiRender },
      { name: "Hugging Face", level: "70%", icon: SiHuggingface }
    ]
  }
];

export default skills;
