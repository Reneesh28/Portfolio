import { useRef, useEffect, useState } from "react";
import skills from "../data/skills";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ScrollChapter = ({ cat, index }) => {
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
          className="w-2 h-64 md:h-80 bg-[#111] border-x border-[#D4AF37]/20 z-30 flex items-center justify-center"
        >
          <div className="w-[1px] h-1/2 bg-[#D4AF37]/10" />
        </motion.div>

        {/* The Paper / Content */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isOpen ? "90vw" : "0px",
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-64 md:h-80 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent overflow-hidden border-y border-[#D4AF37]/5 flex items-center justify-center relative"
        >
          <div className="max-w-6xl w-full px-12 md:px-20 flex flex-col md:flex-row items-center justify-between gap-16">
            {/* TEXT CONTENT */}
            <div className="flex flex-col gap-6 text-left md:w-1/3">
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-[0.8em] text-[#D4AF37]/40 uppercase">Chapter_0{index + 1}</span>
                <h3 className="font-shippori text-3xl md:text-5xl text-white tracking-[0.2em] uppercase leading-tight">{cat.category}</h3>
              </div>
              <p className="font-shippori text-[#888] text-sm md:text-md italic leading-relaxed border-l border-[#D4AF37]/20 pl-6">
                "{cat.description}"
              </p>
            </div>

            {/* ICONS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-8 md:w-1/2 justify-items-center">
              {cat.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 group w-20">
                    <div className="w-14 h-14 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#D4AF37]/40 transition-all duration-500 bg-[#0A0A0A] shadow-inner">
                      <Icon size={28} className="text-[#333] group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#222] group-hover:text-[#888] uppercase text-center transition-colors">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Handle */}
        <motion.div
          animate={{ x: isOpen ? "45vw" : "0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-2 h-64 md:h-80 bg-[#111] border-x border-[#D4AF37]/20 z-30 flex items-center justify-center"
        >
          <div className="w-[1px] h-1/2 bg-[#D4AF37]/10" />
        </motion.div>

        {/* Closed Label (Visible when scroll is closed) */}
        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-shippori text-xs tracking-[1em] text-[#D4AF37]/60 rotate-90 whitespace-nowrap uppercase">
              {cat.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative w-full bg-[#050505] py-20"
    >
      {/* Background Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#111_0%,_#050505_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-20 w-full flex flex-col items-center px-4">
        {/* Narrative Header */}
        <div className="mb-40 flex flex-col items-center gap-4">
          <p className="font-mono text-[10px] tracking-[1em] text-[#D4AF37] uppercase">The_Technical_Archives</p>
          <h2 className="font-shippori text-white text-5xl md:text-8xl tracking-widest uppercase opacity-20">Arsenal</h2>
        </div>

        {/* THE SCROLLS STACK */}
        <div className="w-full flex flex-col">
          {skills.map((cat, i) => (
            <ScrollChapter key={i} cat={cat} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-40 flex flex-col items-center gap-2 opacity-20">
        <div className="w-px h-24 bg-gradient-to-b from-[#D4AF37] to-transparent" />
        <p className="font-mono text-[10px] tracking-[0.5em] text-white">END_OF_ARCHIVE</p>
      </div>
    </section>
  );
}
