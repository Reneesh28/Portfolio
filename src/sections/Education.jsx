import { useEffect, useRef, useState, memo } from "react";
import education from "../data/education";
import { FiBookOpen, FiTerminal } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

const MaterializingCard = memo(({ edu, index }) => {
  const [isMaterialized, setIsMaterialized] = useState(false);
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 85%",
      onEnter: () => {
        setIsMaterialized(true);
        // Glitchy Entrance Animation
        const tl = gsap.timeline();
        tl.fromTo(contentRef.current, 
          { opacity: 0, x: -10, filter: "brightness(2) contrast(2)" },
          { opacity: 1, x: 0, filter: "brightness(1) contrast(1)", duration: 0.6, ease: "power2.out" }
        ).to(contentRef.current, {
           skewX: 10, duration: 0.05, repeat: 3, yoyo: true, ease: "none"
        }).to(contentRef.current, {
           skewX: 0, duration: 0.05
        });
      }
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={cardRef}
      className="edu-card relative h-64 md:h-72"
    >
      {/* Wireframe Buffer State */}
      <div className={`
        absolute inset-0 border transition-all duration-700 ease-in-out
        ${isMaterialized ? "border-white/10 bg-[#111111]" : "border-dashed border-white/5 bg-transparent"}
      `}>
         {!isMaterialized && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
               <FiTerminal className="text-white/5 animate-pulse" size={24} />
               <span className="text-[10px] font-mono text-white/10 uppercase tracking-[0.4em] animate-pulse">
                  BUFFERING_SCHEMA_{index}...
               </span>
            </div>
         )}
      </div>

      {/* Materialized Content */}
      <div 
        ref={contentRef}
        className={`relative h-full p-8 flex flex-col justify-between transition-opacity duration-300 ${isMaterialized ? "opacity-100" : "opacity-0"}`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-[#0A0A0A] border border-white/10 text-[#00BFA5]">
              <FiBookOpen size={20} />
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="text-[10px] bg-[#1A1A1A] border-white/5 lowercase font-mono">
                {edu.period}
              </Badge>
              <Badge variant="accent" className="text-[10px] border-[#00BFA5]/20 text-[#00BFA5]">
                {edu.score}
              </Badge>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-[#E0E0E0] tracking-tight">
            {edu.degree}
          </h3>

          <p className="text-sm text-[#00BFA5] mb-6 font-bold uppercase tracking-widest font-mono">
            {edu.institution}
          </p>

          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3 font-mono opacity-80">
            {edu.description}
          </p>
        </div>
      </div>
    </div>
  );
});
MaterializingCard.displayName = "MaterializingCard";

export default function Education() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".edu-header", 
        { opacity: 0, y: 15 }, 
        { 
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      className="w-full bg-[#0A0A0A] text-white px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="edu-header mb-20 text-center md:text-left">
          <p className="text-[#00BFA5] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 opacity-70">
            CORE_DIRECTIVES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[#E0E0E0] mb-6">
            Foundational Algorithms
          </h2>
          <p className="text-neutral-500 max-w-2xl font-mono text-sm leading-relaxed uppercase tracking-wider">
            Academic data ingestion and structural formatting of base-level logic systems.
          </p>
        </div>

        {/* Grid */}
        <div className="edu-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {education.map((edu, index) => (
             <MaterializingCard key={edu.degree + index} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

