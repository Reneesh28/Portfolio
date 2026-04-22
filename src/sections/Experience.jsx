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
      className="relative w-full px-6 md:px-12 py-24 overflow-hidden"
      style={{ backgroundColor: "transparent", color: "var(--text-main)" }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <p
            className="font-accent font-semibold uppercase tracking-[0.2em] text-sm mb-4"
            style={{ color: "var(--accent)" }}
          >
            THE JOURNEY
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight"
            style={{ color: "var(--text-main)" }}
          >
            Chapters Walked
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Vertical Line — ink brush stroke */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[1px] origin-top z-0"
            style={{
              background: "linear-gradient(to bottom, var(--border-subtle), rgba(194,65,12,0.2), transparent)"
            }}
          />

          {/* Timeline Items */}
          <div className="space-y-12">
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

                  {/* Icon Node */}
                  <div
                    className="
                      absolute left-8 md:left-1/2 transform -translate-x-1/2 
                      w-8 h-8 md:w-10 md:h-10
                      border
                      flex items-center justify-center
                      z-10
                      transition-colors duration-300
                      rounded-full
                    "
                    style={{
                      backgroundColor: "var(--bg-void)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-muted)"
                    }}
                  >
                    <div className="opacity-80">
                      {getIcon(item.type)}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-24 md:pl-0 perspective-1000">
                    <div
                      className={`
                        group
                        relative
                        p-6 sm:p-8
                        border
                        transition-all duration-300
                        rounded-md
                        ${isEven
                          ? "md:mr-12 text-left md:text-right"
                          : "md:ml-12 text-left"
                        }
                      `}
                      style={{
                        backgroundColor: "var(--bg-panel)",
                        borderColor: "var(--border-subtle)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-hover)";
                        e.currentTarget.style.backgroundColor = "#1f1b19";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.backgroundColor = "var(--bg-panel)";
                      }}
                    >
                      {/* Period Badge */}
                      <span
                        className={`
                          inline-flex items-center gap-2
                          text-xs font-accent px-3 py-1
                          border mb-4
                          transition-colors rounded-sm
                          ${isEven ? "md:flex-row-reverse" : ""}
                        `}
                        style={{
                          backgroundColor: "var(--bg-void)",
                          borderColor: "var(--border-subtle)",
                          color: "var(--text-muted)"
                        }}
                      >
                        <Calendar size={12} />
                        {item.period}
                      </span>

                      {/* Role & Organization */}
                      <h3
                        className="text-xl font-display font-bold mb-1 tracking-tight"
                        style={{ color: "var(--text-main)" }}
                      >
                        {item.role}
                      </h3>
                      <p
                        className="text-sm font-accent mb-6 uppercase tracking-widest opacity-80"
                        style={{ color: "var(--accent)" }}
                      >
                        {item.organization}
                      </p>

                      {/* Sealed Description — hover to reveal */}
                      <div className="relative overflow-hidden pt-4 border-t cursor-crosshair" style={{ borderColor: "var(--border-subtle)" }}>
                        {/* Seal Overlay */}
                        <div className={`
                          absolute inset-0 z-10
                          flex items-center ${isEven ? "md:justify-end" : "justify-start"}
                          border
                          transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                          group-hover:scale-x-0
                          ${isEven ? "origin-left md:origin-right" : "origin-left"}
                          rounded-sm
                        `}
                          style={{
                            backgroundColor: "var(--bg-void)",
                            borderColor: "var(--border-subtle)"
                          }}
                        >
                          <div className={`px-4 flex items-center gap-3 opacity-60 ${isEven ? "md:flex-row-reverse" : ""}`}>
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: "var(--accent)" }}
                            />
                            <span
                              className="font-accent text-xs tracking-widest font-bold"
                              style={{ color: "var(--accent)" }}
                            >
                              [ SEALED: HOVER TO READ ]
                            </span>
                          </div>
                        </div>

                        {/* Description Text */}
                        <p className="
                          relative z-0 text-sm leading-relaxed font-body
                          transition-all duration-700
                          blur-md opacity-20 group-hover:blur-none group-hover:opacity-100
                        "
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.description}
                        </p>
                      </div>
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
