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
    description: "The ancestral scripts upon which all digital logic is etched. Precision in the first stroke determines the integrity of the empire.",
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
    description: "The sharp edge of the interface. Masterful strokes of light and shadow that define how the world perceives the machine.",
    items: [
      { name: "React.js", icon: FaReact },
      { name: "Tailwind CSS", icon: SiTailwindcss },
      { name: "Three.js", icon: SiThreedotjs },
      { name: "HTML5 & CSS3", icon: SiHtml5 }
    ]
  },
  {
    category: "Backend",
    description: "The hidden clockwork behind the silk. Silent, efficient protocols that govern the flow of data across the realm.",
    items: [
      { name: "FastAPI", icon: SiFastapi },
      { name: "Node.js", icon: FaNodeJs },
      { name: "Express.js", icon: SiExpress },
      { name: "Django", icon: SiDjango },
      { name: "Flask", icon: SiFlask }
    ]
  },
  {
    category: "Data Science",
    description: "Reading the patterns in the mist. Transforming chaotic noise into strategic insight with the focus of a zen master.",
    items: [
      { name: "NumPy", icon: SiNumpy },
      { name: "Pandas", icon: SiPandas },
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "PyTorch", icon: SiPytorch }
    ]
  },
  {
    category: "Generative AI",
    description: "Forging the digital soul. Where ancient wisdom meets autonomous action to create life from silicon.",
    items: [
      { name: "LangChain", icon: SiLangchain },
      { name: "LLM Orchestration", icon: SiHuggingface }
    ]
  },
  {
    category: "Databases",
    description: "The eternal archives. Secure, structured scrolls that preserve the history of every transaction and thought.",
    items: [
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
      { name: "FAISS", icon: FaDatabase }
    ]
  },
  {
    category: "Tools & Forge",
    description: "The swordsmith's workshop. The hammers, anvils, and fire required to temper raw code into a legendary blade.",
    items: [
      { name: "Git & GitHub", icon: FaGithub },
      { name: "Docker", icon: FaDocker },
      { name: "Postman", icon: SiPostman },
      { name: "Cloud Deployment", icon: SiRender }
    ]
  }
];

export default skills;