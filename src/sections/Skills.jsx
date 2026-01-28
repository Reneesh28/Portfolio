import { useEffect, useRef } from "react";
import skills from "../data/skills";
import { FiCode } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      className="scroll-mt-16 w-full bg-transparent text-white px-6 sm:px-12 lg:px-24 py-28"
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto"
        style={{ willChange: "transform" }}
      >
        {/* Section Header */}
        <p className="text-neutral-400 uppercase tracking-[0.3em] text-xs mb-4">
          Skills
        </p>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-16">
          Technical Expertise
        </h2>

        {/* Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((group) => (
            <div
              key={group.category}
              className="
                bg-neutral-900/60
                border border-neutral-800
                rounded-2xl
                p-6
              "
            >
              <h3 className="text-lg font-medium mb-6 text-neutral-200">
                {group.category}
              </h3>

              <div className="space-y-4">
                {group.items.map((skill) => {
                  const Icon = skill.icon;

                  return (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between"
                    >
                      {/* Left */}
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            w-10 h-10
                            rounded-full
                            border border-neutral-700
                            flex items-center justify-center
                            text-neutral-300
                            hover:border-neutral-400
                            hover:text-white
                            transition-colors duration-200
                          "
                        >
                          {Icon ? (
                            <Icon className="text-lg" />
                          ) : (
                            <FiCode className="text-lg opacity-70" />
                          )}
                        </span>

                        <span className="text-sm text-neutral-200">
                          {skill.name}
                        </span>
                      </div>

                      {/* Right */}
                      <span
                        className="
                          text-xs
                          px-3 py-1
                          rounded-full
                          bg-neutral-800
                          text-neutral-100
                        "
                      >
                        {skill.level}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
