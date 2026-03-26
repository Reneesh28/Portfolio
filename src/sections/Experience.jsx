import { useEffect, useRef } from "react";
import experience from "../data/experience";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Briefcase, GraduationCap, Calendar, Lock } from "lucide-react";

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
            start: "top 60%", // Start animating when section is near center
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // 2. Linear Timeline Sequential Load
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
      className="relative w-full bg-transparent text-white px-6 md:px-12 py-24 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <p className="text-[#00BFA5] font-semibold uppercase tracking-[0.2em] text-sm mb-4">
            OPERATIONAL HISTORY
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#E0E0E0]">
            Service Records
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative mt-12">
          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-white/20 via-[#00BFA5]/20 to-transparent origin-top z-0"
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
                  {/* Spacer for Desktop (occupies 50% width) */}
                  <div className="hidden md:block w-1/2" />

                  {/* Icon Node (Center) */}
                  <div
                    className="
                      absolute left-8 md:left-1/2 transform -translate-x-1/2 
                      w-8 h-8 md:w-10 md:h-10
                      bg-[#0A0A0A] border border-white/20
                      flex items-center justify-center
                      text-[#A3A3A3] z-10
                      transition-colors duration-300
                    "
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
                        bg-[#111111]
                        border border-white/5
                        hover:border-[#00BFA5]/30 hover:bg-[#161616]
                        transition-all duration-300
                        ${isEven
                          ? "md:mr-12 text-left md:text-right"
                          : "md:ml-12 text-left"
                        }
                      `}
                    >
                      {/* Sub-Metadata */}
                      <span
                        className={`
                          inline-flex items-center gap-2
                          text-xs font-mono px-3 py-1
                          bg-[#0A0A0A] border border-white/5 text-[#A3A3A3] mb-4
                          transition-colors
                          ${isEven ? "md:flex-row-reverse" : ""}
                        `}
                      >
                        <Calendar size={12} />
                        {item.period}
                      </span>

                      {/* Header Data */}
                      <h3 className="text-xl font-bold mb-1 text-[#E0E0E0] tracking-tight">
                        {item.role}
                      </h3>
                      <p className="text-sm font-mono text-[#00BFA5] mb-6 uppercase tracking-widest opacity-80">
                        {item.organization}
                      </p>

                      {/* REDACTED DESCRIPTION BLOCK (Option C) */}
                      <div className="relative overflow-hidden pt-4 border-t border-white/5 cursor-crosshair">

                        {/* Redaction Scanner Overlay */}
                        <div className={`
                          absolute inset-0 z-10
                          flex items-center ${isEven ? "md:justify-end" : "justify-start"}
                          bg-[#0A0A0A] border border-white/5
                          transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                          group-hover:scale-x-0
                          ${isEven ? "origin-left md:origin-right" : "origin-left"}
                        `}>
                          <div className={`px-4 flex items-center gap-3 opacity-60 ${isEven ? "md:flex-row-reverse" : ""}`}>
                            <Lock size={14} className="text-red-500" />
                            <span className="text-red-500 font-mono text-xs tracking-widest font-bold">
                              [ RESTRICTED: HOVER TO CLEAR ]
                            </span>
                          </div>
                        </div>

                        {/* Payload Text */}
                        <p className="
                          relative z-0 text-sm text-[#A3A3A3] leading-relaxed 
                          transition-all duration-700 font-mono
                          blur-md opacity-20 group-hover:blur-none group-hover:opacity-100
                        ">
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
