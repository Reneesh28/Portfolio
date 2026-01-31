import { useEffect, useRef } from "react";
import projects from "../data/projects";
import { FiGithub, FiClock, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Fade In
      gsap.fromTo(
        ".projects-header",
        { opacity: 0, y: 40 },
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

      // Staggered Card Reveal
      gsap.fromTo(
        ".project-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".project-grid",
            start: "top 85%",
          },
        }
      );
      // Floating Animation for Cards
      gsap.to(".project-card", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        stagger: {
          each: 0.2,
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
      y: -10, // Lift sensation
      scale: 1.02, // Subtle scale up
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
      id="projects"
      className="w-full bg-transparent text-white px-6 sm:px-12 lg:px-24 py-28 overflow-hidden"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="projects-header mb-20">
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
            Selected Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Projects & Work
          </h2>
        </div>

        {/* Project Grid */}
        <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 perspective-1000">
          {projects.map((project, index) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const cardRef = useRef(null);
            const isComingSoon = project.status === "coming-soon";

            return (
              <div
                key={project.title + index}
                className="project-card relative group perspective-1000"
              >
                <div
                  ref={cardRef}
                  onMouseMove={(e) => !isComingSoon && handleMouseMove(e, cardRef)}
                  onMouseLeave={() => !isComingSoon && handleMouseLeave(cardRef)}
                  className={`
                    relative
                    h-full
                    flex flex-col justify-between
                    p-8 md:p-10
                    rounded-2xl
                    bg-neutral-900/80
                    backdrop-blur-xl
                    border border-white/10
                    ${!isComingSoon ? "hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-dashed opacity-80"}
                    transition-colors duration-300
                    will-change-transform
                  `}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Hover Image Background */}
                  {project.image && !isComingSoon && (
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                      style={{
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transform: "translateZ(0)",
                      }}
                    />
                  )}

                  {/* Internal Glow for interactive cards */}
                  {!isComingSoon && (
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ transform: "translateZ(0)" }}
                    />
                  )}

                  <div>
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((item) => (
                        <span
                          key={item}
                          className={`
                            text-[10px] font-medium tracking-wide
                            px-3 py-1
                            rounded-full
                            border
                            ${isComingSoon ? 'bg-neutral-800/50 border-neutral-700 text-neutral-400' : 'bg-white/5 border-white/10 text-neutral-300 group-hover:bg-white/10'}
                            transition-colors
                          `}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <h3 className={`text-xl font-bold mb-3 ${!isComingSoon ? 'bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent inline-block' : 'text-neutral-300'}`}>
                      {project.title}
                    </h3>

                    <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div>
                    {!isComingSoon ? (
                      <a
                        href={project.codeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex items-center gap-2
                          text-sm font-medium text-white
                          group/link
                        "
                      >
                        <span className="border-b border-transparent group-hover/link:border-white transition-colors">
                          View Code
                        </span>
                        <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-2 text-sm text-neutral-500 cursor-not-allowed">
                        <FiClock />
                        <span>Coming Soon</span>
                      </div>
                    )}
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
