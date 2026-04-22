import { useEffect, useRef, useState, memo } from "react";
import education from "../data/education";
import { FiBookOpen } from "react-icons/fi";
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
        // Ink-brush entrance
        const tl = gsap.timeline();
        tl.fromTo(contentRef.current, 
          { opacity: 0, x: -10, filter: "blur(4px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
        );
      }
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      ref={cardRef}
      className="edu-card relative h-64 md:h-72"
    >
      {/* Scaffold State */}
      <div
        className="absolute inset-0 border transition-all duration-700 ease-in-out rounded-md"
        style={{
          borderColor: isMaterialized ? "var(--border-subtle)" : "var(--border-subtle)",
          borderStyle: isMaterialized ? "solid" : "dashed",
          backgroundColor: isMaterialized ? "var(--bg-panel)" : "transparent"
        }}
      >
         {!isMaterialized && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
               <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent)", opacity: 0.3 }} />
               <span
                 className="text-[10px] font-accent uppercase tracking-[0.4em] animate-pulse"
                 style={{ color: "var(--text-ink)", opacity: 0.3 }}
               >
                  Inscribing...
               </span>
            </div>
         )}
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className={`relative h-full p-8 flex flex-col justify-between transition-opacity duration-300 ${isMaterialized ? "opacity-100" : "opacity-0"}`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <div
              className="p-3 border rounded-md"
              style={{
                backgroundColor: "var(--bg-void)",
                borderColor: "var(--border-subtle)",
                color: "var(--accent)"
              }}
            >
              <FiBookOpen size={20} />
            </div>
            <div className="flex gap-2">
              <Badge variant="default" className="text-[10px] lowercase font-accent" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}>
                {edu.period}
              </Badge>
              <Badge variant="accent" className="text-[10px]" style={{ borderColor: "var(--border-hover)" }}>
                {edu.score}
              </Badge>
            </div>
          </div>

          <h3
            className="text-xl font-display font-bold mb-2 tracking-tight"
            style={{ color: "var(--text-main)" }}
          >
            {edu.degree}
          </h3>

          <p
            className="text-sm font-accent font-bold mb-6 uppercase tracking-widest"
            style={{ color: "var(--accent)" }}
          >
            {edu.institution}
          </p>

          <p
            className="text-sm font-body leading-relaxed line-clamp-3 opacity-80"
            style={{ color: "var(--text-muted)" }}
          >
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
      className="w-full px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        color: "var(--text-main)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="edu-header mb-20 text-center md:text-left">
          <p
            className="font-accent uppercase tracking-[0.3em] text-[10px] font-bold mb-4 opacity-70"
            style={{ color: "var(--accent)" }}
          >
            FOUNDATIONS
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-display font-extrabold tracking-tight mb-6"
            style={{ color: "var(--text-main)" }}
          >
            Roots of Knowledge
          </h2>
          <p
            className="max-w-2xl font-body text-sm leading-relaxed"
            style={{ color: "var(--text-ink)" }}
          >
            The bedrock upon which all craft is built.
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
