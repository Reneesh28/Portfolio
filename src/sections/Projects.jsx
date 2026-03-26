import { useEffect, useRef } from "react";
import projects from "../data/projects";
import { FiGithub, FiClock, FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

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
      y: -10,
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
      id="projects"
      className="w-full bg-transparent text-white px-6 md:px-12 py-24 overflow-hidden"
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
            const isComingSoon = project.status?.toLowerCase() === "coming-soon";

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
                    bg-[#1A1A1A]
                    border border-white/5
                    ${!isComingSoon ? "hover:border-white/20" : "border-dashed opacity-50"}
                    transition-colors duration-300
                    will-change-transform
                  `}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Removed Hover Image Background and Internal Glow to maintain rigid institutional look */}

                  <div>
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((item) => (
                        <Badge 
                          key={item} 
                          variant={isComingSoon ? "default" : "accent"}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <h3 className={`text-xl font-bold mb-3 ${!isComingSoon ? 'text-[#E0E0E0]' : 'text-[#A3A3A3]'}`}>
                      {project.title}
                    </h3>

                    <p className="text-sm text-[#A3A3A3] leading-relaxed mb-8">
                      {project.description}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div>
                    {!isComingSoon ? (
                      <div className="flex flex-wrap gap-5">
                        {project.codeLink && (
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
                        )}
                        {project.codeLinkFrontend && (
                          <a
                            href={project.codeLinkFrontend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              inline-flex items-center gap-2
                              text-sm font-medium text-white
                              group/link
                            "
                          >
                            <span className="border-b border-transparent group-hover/link:border-white transition-colors">
                              Frontend Code
                            </span>
                            <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                        {project.codeLinkBackend && (
                          <a
                            href={project.codeLinkBackend}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              inline-flex items-center gap-2
                              text-sm font-medium text-white
                              group/link
                            "
                          >
                            <span className="border-b border-transparent group-hover/link:border-white transition-colors">
                              Backend Code
                            </span>
                            <FiArrowUpRight className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
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
