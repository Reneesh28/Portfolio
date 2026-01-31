import { useEffect, useRef } from "react";
import certifications from "../data/certifications";
import { FiExternalLink, FiAward } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Header Fade In
      gsap.fromTo(
        ".cert-header",
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
        ".cert-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cert-grid",
            start: "top 85%",
          },
        }
      );

      // 3. Floating Animation (Idle)
      gsap.to(".cert-card", {
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
      id="certifications"
      className="w-full bg-transparent text-white px-6 sm:px-12 lg:px-24 py-28 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Header */}
        <div className="cert-header mb-16">
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
            Qualifications
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
            Certifications
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Continuous learning and professional development.
          </p>
        </div>

        {/* Grid */}
        <div className="cert-grid grid grid-cols-1 md:grid-cols-3 gap-8 text-left perspective-1000">
          {certifications.map((cert, index) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const cardRef = useRef(null);

            return (
              <div
                key={cert.title + index}
                className="cert-card relative group perspective-1000"
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

                  {/* Optional Background Image Reveal */}
                  {cert.file && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
                      style={{
                        backgroundImage: `url(${cert.file})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: "translateZ(0)",
                      }}
                    />
                  )}

                  <div>
                    {/* Icon & Year */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-white group-hover:bg-white/10 transition-colors">
                        <FiAward size={20} />
                      </div>
                      <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800">
                        {cert.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-neutral-100 group-hover:text-white transition-colors">
                      {cert.title}
                    </h3>

                    <p className="text-sm text-neutral-400 mb-6 font-medium">
                      {cert.issuer}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {cert.tags.map((tag) => (
                        <span
                          key={tag}
                          className="
                            text-[10px] uppercase tracking-wider
                            px-2 py-1
                            rounded-md
                            bg-white/5
                            text-neutral-400
                            border border-transparent
                            group-hover:border-white/10
                            transition-colors
                          "
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-sm
                      font-medium
                      text-neutral-300
                      group-hover:text-white
                      transition-colors
                      mt-auto
                    "
                  >
                    View Credential <FiExternalLink />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
