import { useEffect, useRef } from "react";
import experience from "../data/experience";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Line draws down
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // 2. Sequential card reveal
      const items = gsap.utils.toArray(".timeline-item");
      gsap.fromTo(items,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes("training") || lower.includes("education")) {
      return <GraduationCap size={18} />;
    }
    return <Briefcase size={18} />;
  };

  return (
    <section
      id="experience"
      className="relative w-full px-6 md:px-12 py-32 overflow-hidden washi-texture border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-32 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[var(--accent)]" />
            <p className="font-accent font-semibold uppercase tracking-[0.4em] text-xs text-[var(--accent)]">
              The Journey
            </p>
            <div className="w-12 h-[1px] bg-[var(--accent)]" />
          </div>
          <h2 className="font-display text-4xl md:text-7xl font-bold text-[var(--text-main)] text-center leading-tight">
            Chapters of <span className="italic text-[var(--text-muted)]">Growth</span>.
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Vertical Line — The Blade Path */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[1px] origin-top z-0"
            style={{
              background: "linear-gradient(to bottom, var(--accent), var(--border-subtle), transparent)"
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-32">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`timeline-item flex flex-col md:flex-row items-start md:items-center relative ${isEven ? "md:flex-row-reverse" : ""
                    }`}
                >
                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />

                  {/* Icon Node (The Seal) */}
                  <div
                    className="
                      absolute left-8 md:left-1/2 transform -translate-x-1/2 
                      w-10 h-10
                      border-2
                      flex items-center justify-center
                      z-10
                      transition-all duration-500
                      rounded-sm rotate-45
                    "
                    style={{
                      backgroundColor: "var(--bg-panel)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--accent)"
                    }}
                  >
                    <div className="-rotate-45">
                      {getIcon(item.type)}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-24 md:pl-0 perspective-1000">
                    <div
                      className={`
                        group
                        relative
                        p-8
                        border bg-[var(--bg-panel)]
                        transition-all duration-500
                        rounded-sm
                        ${isEven
                          ? "md:mr-16 text-left md:text-right"
                          : "md:ml-16 text-left"
                        }
                      `}
                      style={{
                        borderColor: "var(--border-subtle)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Period Badge */}
                      <div className={`flex items-center gap-3 mb-6 ${isEven ? "md:flex-row-reverse" : ""}`}>
                        <div className="w-2 h-2 bg-[var(--accent)]" />
                        <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-[var(--text-ink)]">
                          {item.period}
                        </span>
                      </div>

                      {/* Role & Organization */}
                      <h3 className="text-2xl font-display font-bold mb-2 tracking-tight text-[var(--text-main)]">
                        {item.role}
                      </h3>
                      <p className="font-accent text-xs mb-8 uppercase tracking-[0.2em] text-[var(--accent)]">
                        {item.organization}
                      </p>

                      {/* Sealed Description */}
                      <div className="relative overflow-hidden pt-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                        {/* Seal Overlay */}
                        <div className={`
                          absolute inset-0 z-10
                          flex items-center ${isEven ? "md:justify-end" : "justify-start"}
                          transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                          group-hover:-translate-y-full
                        `}
                          style={{
                            backgroundColor: "var(--bg-panel)"
                          }}
                        >
                          <div className={`px-4 flex items-center gap-3 opacity-40 ${isEven ? "md:flex-row-reverse" : ""}`}>
                            <span className="font-display text-xs tracking-widest text-[var(--text-ink)] group-hover:text-[var(--accent)] transition-colors">
                              印 — UNSEAL
                            </span>
                          </div>
                        </div>

                        {/* Description Text */}
                        <p className="relative z-0 text-sm leading-relaxed font-body text-[var(--text-muted)]">
                          {item.description}
                        </p>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--accent)] opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
