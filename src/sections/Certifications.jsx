import { useEffect, useRef } from "react";
import certifications from "../data/certifications";
import { FiExternalLink, FiAward } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

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
      className="w-full bg-transparent text-white px-6 md:px-12 py-24 overflow-hidden"
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
                    bg-[#1A1A1A]
                    border border-white/5
                    hover:border-white/20
                    transition-colors duration-300
                    will-change-transform
                  "
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Removed Background Glow and Image Hover Reveal for Flat Precise Look */}

                  <div>
                    {/* Icon & Year */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-[#0A0A0A] border border-white/5 text-[#E0E0E0] group-hover:bg-[#1A1A1A] transition-colors">
                        <FiAward size={20} />
                      </div>
                      <Badge variant="default">{cert.year}</Badge>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-[#E0E0E0]">
                      {cert.title}
                    </h3>

                    <p className="text-sm text-[#00BFA5] mb-6 font-medium">
                      {cert.issuer}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {cert.tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
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
