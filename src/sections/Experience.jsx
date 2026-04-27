import { useEffect, useRef } from "react";
import experience from "../data/experience";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MapPin, Shield, Sword, Anchor, Flag } from "lucide-react";

const FortressNode = ({ item, index, isLast }) => {
  return (
    <div className="relative pl-12 md:pl-24 group">
      {/* The Fortress Marker */}
      <div className="absolute left-0 top-0 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-[#111111] border border-[#C5A059]/40 group-hover:border-[#C5A059] group-hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-500 z-10">
        <div className="text-[#C5A059] group-hover:scale-110 transition-transform">
          {index === 0 ? <Anchor size={20} /> : index === 1 ? <Shield size={20} /> : <Flag size={20} />}
        </div>
        {/* Ink Blot Splatter (Decorative) */}
        <div className="absolute inset-0 bg-[#8B0000]/10 scale-150 opacity-0 group-hover:opacity-100 rounded-full blur-xl transition-opacity duration-700" />
      </div>

      <div className="space-y-4 pb-20">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#C5A059]">
            {item.period}
          </span>
          <span className="hidden md:block w-8 h-px bg-white/10" />
          <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#8B0000]">
            {item.type}
          </span>
        </div>

        <h3 className="text-3xl md:text-5xl font-serif font-bold text-[#F5F5F5] group-hover:text-[#C5A059] transition-colors">
          {item.role}
        </h3>

        <p className="text-[#A3A3A3] font-serif tracking-[0.2em] text-xs uppercase opacity-80">
          {item.organization}
        </p>

        <div className="max-w-2xl relative">
          <p className="text-[#A3A3A3] font-serif text-lg leading-relaxed italic border-l border-[#C5A059]/30 pl-8 py-2 relative z-10">
            "{item.description}"
          </p>
          {/* Subtle Japanese script background (conceptual) */}
          <div className="absolute -top-4 -right-10 text-4xl font-serif text-white/5 pointer-events-none select-none">
            戦士
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Experience() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section
      id="experience"
      className="relative w-full bg-[#0D0D0D] text-[#F5F5F5] px-6 md:px-12 py-24 sm:py-48 overflow-hidden"
      ref={containerRef}
    >
      {/* SVG FILTERS FOR INK EFFECT */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <filter id="ink-bleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
      </svg>

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="mb-32 text-center">
          <p className="text-[#8B0000] uppercase tracking-[0.6em] text-xs mb-4 font-bold">
            The Chronicle
          </p>
          <h2 className="text-5xl md:text-9xl font-serif font-bold text-[#F5F5F5]">
            The Journey
          </h2>
        </div>

        {/* The Map (Timeline) */}
        <div className="relative">
          {/* The Ink Trail */}
          <div className="absolute left-5 md:left-7 top-0 bottom-0 w-[2px] bg-white/5 z-0" />

          <svg
            className="absolute left-5 md:left-7 top-0 h-full w-20 -translate-x-1/2 pointer-events-none z-0"
            preserveAspectRatio="none"
            style={{ filter: 'url(#ink-bleed)' }}
          >
            <motion.path
              d="M 10 0 Q 40 100 10 200 T 10 400 T 40 600 T 10 800 T 10 1000"
              stroke="#C5A059"
              strokeWidth="3"
              fill="none"
              style={{ pathLength }}
              strokeDasharray="1"
            />
          </svg>

          <div className="space-y-12">
            {experience.map((item, index) => (
              <FortressNode
                key={index}
                item={item}
                index={index}
                isLast={index === experience.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Corner Ink Splats */}
      <div className="absolute top-20 right-[-5%] w-96 h-96 bg-[#8B0000]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-[-5%] w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
