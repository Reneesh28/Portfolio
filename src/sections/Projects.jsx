import { useRef, useEffect, useState } from "react";
import projects from "../data/projects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { Swords, Code2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const VerticalScroll = ({ project, index }) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 70%",
      end: "bottom 30%",
      onToggle: (self) => setIsOpen(self.isActive)
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[80vh] flex flex-col items-center py-20">
      {/* Scroll Header (The Handle) */}
      <div className="w-64 h-2 bg-[#1A1A1A] border-x border-[#D4AF37]/40 rounded-full relative z-30 shadow-2xl">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#D4AF37]/20" />
      </div>

      {/* The Hanging Paper */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isOpen ? "auto" : "0px",
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl bg-gradient-to-b from-white/[0.01] to-transparent border-x border-white/5 overflow-hidden relative"
      >
        <div className="p-12 md:p-24 flex flex-col items-center text-center gap-12">

          {/* Section Kanji Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="font-shippori text-[15rem] text-white select-none">
              {["術", "戦", "智", "策", "力", "技", "心"][index % 7]}
            </span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-[#D4AF37]/20" />
              <span className="font-mono text-[10px] tracking-[0.8em] text-[#D4AF37] uppercase">Mission_0{index + 1}</span>
              <div className="w-12 h-px bg-[#D4AF37]/20" />
            </div>

            <h3 className="font-shippori text-4xl md:text-7xl text-white tracking-[0.2em] uppercase font-bold">
              {project.title}
            </h3>

            <div className="flex items-center gap-2 text-[#D4AF37]/40 font-mono text-[9px] tracking-[0.4em] uppercase">
              <Swords size={12} /> {project.bladeType || "FORGED_UNIT"}
            </div>
          </div>

          <p className="relative z-10 font-shippori text-[#888] text-lg md:text-2xl leading-relaxed italic max-w-2xl border-y border-white/5 py-12">
            "{project.description}"
          </p>

          <div className="relative z-10 flex flex-col items-center gap-10">
            {/* TECH STACK - ENHANCED VISIBILITY */}
            <div className="flex flex-wrap justify-center gap-4">
              {project.tech.map((t, i) => (
                <span key={i} className="px-5 py-1.5 border border-[#D4AF37]/10 bg-[#D4AF37]/5 font-mono text-[10px] text-[#D4AF37]/60 tracking-widest uppercase hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-500">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-12 pt-10 border-t border-white/5 w-full justify-center">
              {project.codeLink && (
                <a href={project.codeLink} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                  <FiGithub size={28} className="text-[#888] group-hover:text-[#D4AF37] transition-all" />
                  <span className="font-mono text-[9px] tracking-[0.4em] text-[#444] group-hover:text-[#D4AF37] uppercase font-bold">Access_Source_Archive</span>
                </a>
              )}
              {(project.codeLinkFrontend || project.codeLinkBackend) && (
                <div className="flex items-center gap-8">
                  {project.codeLinkFrontend && (
                    <a href={project.codeLinkFrontend} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                      <FiGithub size={28} className="text-[#888] group-hover:text-[#D4AF37] transition-all" />
                      <span className="font-mono text-[9px] tracking-[0.4em] text-[#444] group-hover:text-[#D4AF37] uppercase font-bold">Frontend_Blade</span>
                    </a>
                  )}
                  {project.codeLinkBackend && (
                    <a href={project.codeLinkBackend} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                      <FiGithub size={28} className="text-[#888] group-hover:text-[#D4AF37] transition-all" />
                      <span className="font-mono text-[9px] tracking-[0.4em] text-[#444] group-hover:text-[#D4AF37] uppercase font-bold">Backend_Blade</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Bottom Handle (Weight) */}
      <motion.div
        animate={{ y: isOpen ? 0 : -20 }}
        className="w-72 h-1.5 bg-[#1A1A1A] border-x border-[#D4AF37]/20 rounded-full shadow-2xl relative z-30"
      />
    </div>
  );
};

export default function Projects() {
  const containerRef = useRef(null);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-40"
    >
      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
        {/* Section Header */}
        <div className="mb-40 flex flex-col items-center gap-4 text-center px-4">
          <p className="font-mono text-[10px] tracking-[1em] text-[#D4AF37] uppercase">The_Imperial_Archives</p>
          <h2 className="font-shippori text-white text-5xl md:text-8xl tracking-widest uppercase opacity-20">Campaigns</h2>
          <div className="w-px h-24 bg-gradient-to-b from-[#D4AF37]/40 to-transparent mt-8" />
        </div>

        {/* THE VERTICAL SCROLLS */}
        <div className="w-full flex flex-col">
          {projects.map((project, i) => (
            <VerticalScroll key={i} project={project} index={i} />
          ))}
        </div>
      </div>

      {/* HUD Label */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-1 opacity-20">
        <p className="font-mono text-[10px] tracking-[0.5em] text-white">ACT_IV: THE_VERTICAL_DESCENT</p>
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#D4AF37]">SYSTEM_STATUS: PURE_TYPOGRAPHY</p>
      </div>
    </section>
  );
}
