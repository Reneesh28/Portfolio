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
            start: "top 60%", // Start animating when section is near center
            end: "bottom 80%",
            scrub: 1,
          },
        }
      );

      // 2. Cards fade in & slide up
      const items = gsap.utils.toArray(".timeline-item");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getIcon = (type) => {
    const lower = type.toLowerCase();
    if (lower.includes("training") || lower.includes("education")) {
      return <GraduationCap size={20} />;
    }
    return <Briefcase size={20} />;
  };

  // 3D Tilt Handler
  const handleMouseMove = (e, cardRef) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(card, {
      duration: 0.5,
      rotateX: rotateX,
      rotateY: rotateY,
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
      ease: "power2.out",
      overwrite: "auto",
    });
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
          <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
            Path So Far
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Experience & Training
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line Line */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neutral-700 via-neutral-500 to-transparent origin-top z-0"
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experience.map((item, index) => {
              const isEven = index % 2 === 0;
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const cardRef = useRef(null); // Create a ref for each independent card

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
                      w-10 h-10
                      bg-[#0A0A0A] border border-[#00BFA5]
                      flex items-center justify-center
                      text-[#00BFA5] z-10
                    "
                  >
                    {getIcon(item.type)}
                  </div>

                  {/* Content Card */}
                  <div className="w-full md:w-1/2 pl-24 md:pl-0 perspective-1000">
                    <div
                      ref={cardRef}
                      onMouseMove={(e) => handleMouseMove(e, cardRef)}
                      onMouseLeave={() => handleMouseLeave(cardRef)}
                      className={`
                        group
                        relative
                        p-6 sm:p-8
                        bg-[#1A1A1A]
                        border border-white/5
                        hover:border-white/20
                        transition-colors duration-300
                        will-change-transform
                        ${isEven
                          ? "md:mr-12 text-left md:text-right"
                          : "md:ml-12 text-left"
                        }
                      `}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Removed Subtle Glow Gradient */}

                      {/* Arrow / Connector (Desktop Only) */}
                      <div
                        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#1A1A1A] border-t border-r border-white/5 transform rotate-45 group-hover:border-white/20 transition-colors ${isEven
                          ? "-right-2 border-l-0 border-b-0"
                          : "-left-2 border-r-0 border-t-0 border-l border-b"
                          } z-0`}
                      />

                      <span
                        className={`
                          inline-flex items-center gap-2
                          text-xs font-medium px-3 py-1
                          bg-[#0A0A0A] border border-white/5 text-[#A3A3A3] mb-4
                          transition-colors
                          ${isEven ? "md:flex-row-reverse" : ""}
                        `}
                      >
                        <Calendar size={12} />
                        {item.period}
                      </span>

                      <h3 className="text-xl font-bold mb-1 text-[#E0E0E0]">
                        {item.role}
                      </h3>
                      <p className="text-sm font-medium text-[#00BFA5] mb-4 uppercase tracking-wide">
                        {item.organization}
                      </p>

                      <p className="text-sm text-[#A3A3A3] leading-relaxed">
                        {item.description}
                      </p>
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
