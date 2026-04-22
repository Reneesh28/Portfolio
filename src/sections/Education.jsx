import { useRef, useEffect, useState } from "react";
import education from "../data/education";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { Book, Scroll as ScrollIcon, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const AcademicScroll = ({ edu, index }) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 60%",
      end: "bottom 40%",
      onToggle: (self) => setIsOpen(self.isActive)
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-[60vh] flex items-center justify-center py-20">
      <div className="relative flex items-center justify-center">
        {/* Left Handle */}
        <motion.div
          animate={{ x: isOpen ? "-45vw" : "0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-2 h-64 md:h-80 bg-[#111] border-x border-[#D4AF37]/20 z-30"
        />

        {/* The Scholarly Content */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isOpen ? "90vw" : "0px",
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-64 md:h-80 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent overflow-hidden border-y border-[#D4AF37]/5 flex items-center justify-center relative"
        >
          <div className="max-w-6xl w-full px-12 md:px-20 flex flex-col md:flex-row items-center justify-between gap-16">

            {/* Academy Identification */}
            <div className="flex flex-col gap-6 text-left md:w-1/3">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.8em] text-[#D4AF37]/40 uppercase">Academy_Volume_0{index + 1}</span>
                <h3 className="font-shippori text-3xl md:text-5xl text-white tracking-[0.2em] uppercase leading-tight">{edu.institution}</h3>
              </div>
              <div className="flex items-center gap-4 text-[#D4AF37]/60 font-mono text-[10px] tracking-widest uppercase">
                <ScrollIcon size={14} /> Era: {edu.period}
              </div>
            </div>

            {/* Mastery Details */}
            <div className="flex flex-col gap-6 md:w-1/2 border-l border-[#D4AF37]/10 pl-12">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Book size={14} className="text-[#D4AF37]/40" />
                  <span className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase">Mastery_Directive</span>
                </div>
                <h4 className="font-shippori text-xl md:text-3xl text-white tracking-widest uppercase">{edu.degree}</h4>
              </div>

              <p className="font-shippori text-[#888] text-sm md:text-md italic leading-relaxed">
                "{edu.description}"
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="w-10 h-10 border border-[#D4AF37]/20 flex items-center justify-center rotate-45">
                  <Award size={16} className="text-[#D4AF37] rotate-[-45deg]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] tracking-[0.4em] text-[#444] uppercase">Scholarly_Weight</span>
                  <span className="font-mono text-lg text-[#D4AF37] tracking-widest">{edu.score}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Handle */}
        <motion.div
          animate={{ x: isOpen ? "45vw" : "0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-2 h-64 md:h-80 bg-[#111] border-x border-[#D4AF37]/20 z-30"
        />

        {/* Closed Label */}
        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-shippori text-xs tracking-[1.5em] text-[#D4AF37]/40 rotate-90 whitespace-nowrap uppercase">
              {edu.degree}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Education() {
  const containerRef = useRef(null);

  return (
    <section
      id="education"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-40"
    >
      <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
        {/* Section Header */}
        <div className="mb-40 flex flex-col items-center gap-4 text-center px-4">
          <p className="font-mono text-[10px] tracking-[1em] text-[#D4AF37] uppercase">The_Ancestral_Lineage</p>
          <h2 className="font-shippori text-white text-5xl md:text-8xl tracking-widest uppercase opacity-20">Scholars</h2>
        </div>

        {/* THE SCROLLS STACK */}
        <div className="w-full flex flex-col">
          {education.map((edu, i) => (
            <AcademicScroll key={i} edu={edu} index={i} />
          ))}
        </div>
      </div>

      {/* Decorative Atmosphere */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent opacity-20 pointer-events-none" />

      {/* HUD Label */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-1 opacity-20">
        <p className="font-mono text-[10px] tracking-[0.5em] text-white">ACT: THE_SCHOLAR_SCROLLS</p>
        <p className="font-mono text-[10px] tracking-[0.5em] text-[#D4AF37]">SYSTEM_LOAD: ACADEMIC_STABLE</p>
      </div>
    </section>
  );
}
