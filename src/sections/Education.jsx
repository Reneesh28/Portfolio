import { useEffect, useRef, useState, memo } from "react";
import education from "../data/education";
import { FiBookOpen } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);



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
      className="w-full px-6 md:px-12 py-32 overflow-hidden border-t washi-texture"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="edu-header mb-32 flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[var(--accent)]" />
            <p className="font-accent font-semibold uppercase tracking-[0.4em] text-xs text-[var(--accent)]">
              The Foundations
            </p>
          </div>
          <h2 className="font-display text-4xl md:text-7xl font-bold text-[var(--text-main)] leading-tight">
            Roots of <span className="italic text-[var(--text-muted)]">Legacy</span>.
          </h2>
        </div>

        {/* Grid */}
        <div className="edu-grid grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.map((edu, index) => (
            <MaterializingCard key={edu.degree + index} edu={edu} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
        gsap.fromTo(contentRef.current,
          { opacity: 0, x: -20, filter: "blur(10px)" },
          { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power4.out" }
        );
      }
    });
    return () => trigger.kill();
  }, []);

  return (
    <div ref={cardRef} className="edu-card relative h-80 group">
      {/* Background Tablet */}
      <div
        className="absolute inset-0 border bg-[var(--bg-panel)] rounded-sm transition-all duration-1000"
        style={{
          borderColor: isMaterialized ? "var(--border-subtle)" : "transparent",
          opacity: isMaterialized ? 1 : 0,
        }}
      >
        {/* Tactical Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--accent)] opacity-40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--accent)] opacity-40" />
      </div>

      {!isMaterialized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-1.5 h-1.5 bg-[var(--accent)] animate-ping" />
          <span className="font-accent text-[9px] tracking-[0.5em] uppercase text-[var(--text-ink)] opacity-30">Inscribing Foundations...</span>
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className={`relative h-full p-10 flex flex-col justify-between transition-opacity duration-500 ${isMaterialized ? "opacity-100" : "opacity-0"}`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="w-10 h-10 border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent)] rounded-sm">
              <FiBookOpen size={20} />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-accent text-[9px] tracking-[0.3em] uppercase text-[var(--text-ink)]">
                {edu.period}
              </span>
              <div className="w-px h-4 bg-[var(--border-subtle)]" />
              <span className="font-display text-xl text-[var(--accent)]">
                {edu.score}
              </span>
            </div>
          </div>

          <h3 className="text-2xl font-display font-bold mb-3 tracking-tight text-[var(--text-main)]">
            {edu.degree}
          </h3>

          <p className="font-accent text-[10px] mb-8 uppercase tracking-[0.2em] text-[var(--accent)]">
            {edu.institution}
          </p>

          <p className="font-body text-sm leading-relaxed text-[var(--text-muted)] line-clamp-3">
            {edu.description}
          </p>
        </div>
      </div>
    </div>
  );
});
MaterializingCard.displayName = "MaterializingCard";
