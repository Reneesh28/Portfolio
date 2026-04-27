import { useRef } from "react";
import projects from "../data/projects";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import { AI_Tsuba, Web_Tsuba, Battle_Tsuba, Neural_Tsuba } from "../components/TsubaIcons";

const TSUBA_MAP = {
  AI_KATANA: AI_Tsuba,
  AI_KODACHI: AI_Tsuba,
  FULLSTACK_KATANA: Web_Tsuba,
  BATTLE_KODACHI: Battle_Tsuba,
  NEURAL_TANTO: Neural_Tsuba,
};

const ProjectSection = ({ project, index }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yNumber = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const Tsuba = TSUBA_MAP[project.bladeType] || Web_Tsuba;
  const isEven = index % 2 === 0;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center py-20 overflow-hidden"
    >
      {/* GIANT BRUSH NUMBER (BACKGROUND) */}
      <motion.div 
        style={{ y: yNumber, opacity: 0.05 }}
        className={`absolute inset-0 flex items-center ${isEven ? 'justify-start' : 'justify-end'} pointer-events-none px-12`}
      >
        <span className="text-[40rem] font-serif font-bold text-[#F5F5F5] select-none leading-none">
          {String(index + 1).padStart(2, '0')}
        </span>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className={`relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 md:gap-24`}
      >
        {/* WEAPON ICON (TSUBA) */}
        <div className="w-48 h-48 md:w-80 md:h-80 flex-shrink-0 relative">
           <div className="absolute inset-0 bg-[#C5A059]/5 rounded-full animate-pulse" />
           <Tsuba />
           {/* Decorative Blade Label */}
           <div className={`absolute top-0 ${isEven ? '-left-8' : '-right-8'} h-full flex flex-col justify-center`}>
              <span className="font-serif text-[10px] tracking-[0.5em] text-[#8B0000] uppercase rotate-90 whitespace-nowrap">
                {project.bladeType.replace("_", " ")}
              </span>
           </div>
        </div>

        {/* CONTENT */}
        <motion.div style={{ y: yText }} className="flex-1 space-y-8">
          <div className="space-y-4">
            <p className="text-[#C5A059] font-medium tracking-[0.5em] text-xs uppercase">
               Project // {project.status}
            </p>
            <h3 className="text-5xl md:text-8xl font-serif font-bold text-[#F5F5F5] leading-tight">
              {project.title}
            </h3>
            <div className={`h-[2px] w-24 bg-[#8B0000] ${isEven ? 'mr-auto' : 'ml-auto'}`} />
          </div>

          <p className="text-xl md:text-2xl text-[#A3A3A3] leading-relaxed font-serif italic max-w-2xl">
            "{project.description}"
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            {project.tech.map((t) => (
              <span key={t} className="text-xs uppercase tracking-widest px-4 py-2 bg-white/5 text-[#F5F5F5] border border-white/10">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-8 pt-8">
            {project.codeLink && (
              <a href={project.codeLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#C5A059] transition-colors group">
                <Github size={24} />
                <span className="text-xs uppercase tracking-widest font-bold">Extract Logic</span>
              </a>
            )}
            {project.demoLink && (
              <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#C5A059] transition-colors group">
                <ExternalLink size={24} />
                <span className="text-xs uppercase tracking-widest font-bold">Witness Forge</span>
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative Horizontal Divider */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
};

export default function Projects() {
  return (
    <section id="projects" className="w-full bg-[#0D0D0D]">
      {/* Header (Sticky-like) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 mb-10">
        <p className="text-[#8B0000] uppercase tracking-[0.6em] text-xs mb-4 font-bold text-center">
          The Chronicles
        </p>
        <h2 className="text-6xl md:text-9xl font-serif font-bold text-[#F5F5F5] text-center">
          Battles
        </h2>
      </div>

      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectSection key={index} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
