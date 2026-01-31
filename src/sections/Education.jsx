import { useEffect, useRef } from "react";
import education from "../data/education";
import { FiBookOpen } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Fade In
      gsap.fromTo(
        ".edu-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // 2. Cards Staggered Reveal
      gsap.fromTo(
        ".edu-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".edu-grid",
            start: "top 85%",
          },
        }
      );

      // 3. Floating Animation (Idle)
      gsap.to(".edu-card", {
        y: -5,
        duration: 3,
        ease: "sine.inOut",
        stagger: {
          each: 0.5,
          yoyo: true,
          repeat: -1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 3D Tilt Logic
  const handleMouseMove = (e, cardRef) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      duration: 0.5,
      rotateX: rotateX,
      rotateY: rotateY,
      y: -10, // Lift
      scale: 1.02,
      transformPerspective: 1000,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = (cardRef) => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      duration: 0.5,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      id="education"
      className="w-full bg-transparent text-white px-6 sm:px-12 lg:px-24 py-28 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Header */}
        <div className="edu-header mb-16">
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
            Education
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
            Academic Background
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Foundational knowledge and specialized studies.
          </p>
        </div>

        {/* Grid */}
        <div className="edu-grid grid grid-cols-1 md:grid-cols-2 gap-8 text-left perspective-1000">
          {education.map((edu, index) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const cardRef = useRef(null);

            return (
              <div
                key={edu.degree + index}
                className="edu-card relative group perspective-1000"
              >
                <div
                  ref={cardRef}
                  onMouseMove={(e) => handleMouseMove(e, cardRef)}
                  onMouseLeave={() => handleMouseLeave(cardRef)}
                  className="
                    relative
                    h-full
                    flex flex-col justify-between
                    p-8
                    rounded-2xl
                    bg-neutral-900/80
                    backdrop-blur-xl
                    border border-white/10
                    hover:border-white/20
                    hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]
                    transition-colors duration-300
                    will-change-transform
                  "
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Subtle Glow */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ transform: "translateZ(0)" }}
                  />

                  <div>
                    {/* Badges */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                        <FiBookOpen size={20} />
                      </div>
                      <div className="flex gap-2">
                        <span className="text-xs font-mono text-neutral-400 bg-neutral-800 px-2 py-1 rounded border border-neutral-700">
                          {edu.period}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-900/30">
                          {edu.score}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-neutral-100 group-hover:text-white transition-colors">
                      {edu.degree}
                    </h3>

                    <p className="text-sm text-neutral-400 mb-6 font-medium uppercase tracking-wide">
                      {edu.institution}
                    </p>

                    <p className="text-sm text-neutral-500 leading-relaxed group-hover:text-neutral-400 transition-colors">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
