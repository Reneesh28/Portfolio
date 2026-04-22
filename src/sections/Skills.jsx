import { useState, useEffect, useRef } from "react";
import skills from "../data/skills";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".vault-bar",
        { opacity: 0, y: 15 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full min-h-screen py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden flex flex-col items-center border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        color: "var(--text-main)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div className="w-full max-w-4xl relative z-10 flex flex-col">
        {/* Section Label */}
        <p
          className="vault-bar font-accent font-semibold uppercase tracking-[0.2em] text-sm mb-12 sm:mb-16"
          style={{ color: "var(--accent)" }}
        >
          DISCIPLINES
        </p>

        {/* Skill Scrolls */}
        <div className="flex flex-col gap-4">
          {skills.map((categoryData, idx) => (
            <SkillScroll key={idx} data={categoryData} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillScroll({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(itemsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [isOpen]);

  return (
    <div
      className="vault-bar border overflow-hidden transition-colors duration-300 rounded-md"
      style={{
        borderColor: isOpen ? "var(--border-hover)" : "var(--border-subtle)",
        backgroundColor: "var(--bg-panel)"
      }}
    >
      {/* Scroll Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          {/* Seal indicator */}
          <div
            className="w-2 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: isOpen ? "var(--accent)" : "var(--text-ink)",
              boxShadow: isOpen ? "0 0 6px var(--accent)" : "none"
            }}
          />
          <h3
            className="font-accent tracking-widest text-sm sm:text-base transition-colors"
            style={{ color: isOpen ? "var(--accent)" : "var(--text-muted)" }}
          >
            {isOpen ? `[ REVEALED: ${data.category.toUpperCase()} ]` : `[ SEALED: ${data.category.toUpperCase()} ]`}
          </h3>
        </div>

        <div className="flex items-center gap-4" style={{ color: "var(--text-muted)" }}>
          <span className="font-accent text-xs opacity-50 hidden sm:block">
            {data.items.length} Arts
          </span>
          <span className="w-px h-4 hidden sm:block" style={{ backgroundColor: "var(--border-subtle)" }} />
          <ChevronDown
            size={18}
            className={`transition-all duration-300 ease-out ${isOpen ? "rotate-180" : "rotate-0"}`}
            style={{ color: isOpen ? "var(--accent)" : "var(--text-muted)" }}
          />
        </div>
      </button>

      {/* Scroll Content (Accordion) */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 sm:p-6 pt-0" style={{ backgroundColor: "var(--bg-panel)" }}>
          <div className="w-full h-px mb-6" style={{ backgroundColor: "var(--border-subtle)" }} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.items.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div
                  key={idx}
                  ref={el => itemsRef.current[idx] = el}
                  className="flex items-center gap-3 p-3 border transition-all group cursor-default rounded-sm"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.backgroundColor = "var(--bg-surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <Icon
                    className="text-xl transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span
                    className="font-accent text-xs sm:text-sm tracking-wide truncate"
                    style={{ color: "var(--text-main)" }}
                  >
                    {skill.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}