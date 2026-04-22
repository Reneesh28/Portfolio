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
      className="w-full min-h-screen py-32 px-6 md:px-12 relative overflow-hidden flex flex-col items-center border-t washi-texture"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
    >
      <div className="w-full max-w-5xl relative z-10 flex flex-col">
        {/* Section Label */}
        <div className="vault-bar flex items-center gap-4 mb-16">
          <div className="w-12 h-[1px] bg-[var(--accent)]" />
          <p className="font-accent font-semibold uppercase tracking-[0.4em] text-xs text-[var(--accent)]">
            The Armory
          </p>
        </div>

        <h2 className="vault-bar font-display text-4xl md:text-6xl font-bold text-[var(--text-main)] mb-20 leading-[1.1]">
          Forging the <span className="italic text-[var(--text-muted)]">Tools</span> <br />
          of Digital Warfare.
        </h2>

        {/* Skill Scrolls */}
        <div className="flex flex-col gap-6">
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

  return (
    <div
      className="vault-bar border overflow-hidden transition-all duration-500 rounded-sm"
      style={{
        borderColor: isOpen ? "var(--border-hover)" : "var(--border-subtle)",
        backgroundColor: "var(--bg-panel)"
      }}
    >
      {/* Scroll Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none group relative overflow-hidden"
      >
        <div className="flex items-center gap-6 relative z-10">
          <div
            className="w-10 h-10 border flex items-center justify-center transition-all duration-500 rounded-sm"
            style={{
              backgroundColor: isOpen ? "var(--accent)" : "transparent",
              borderColor: isOpen ? "var(--accent)" : "var(--border-subtle)"
            }}
          >
             <span className={`font-display text-lg ${isOpen ? 'text-white' : 'text-[var(--text-ink)]'}`}>
               {isOpen ? '解' : '封'}
             </span>
          </div>
          <h3
            className="font-display text-xl md:text-2xl tracking-wide transition-colors"
            style={{ color: isOpen ? "var(--text-main)" : "var(--text-muted)" }}
          >
            {data.category}
          </h3>
        </div>

        <div className="flex items-center gap-6 relative z-10" style={{ color: "var(--text-muted)" }}>
          <span className="font-accent text-[10px] tracking-[0.3em] uppercase opacity-40 hidden sm:block">
            {data.items.length} Modules
          </span>
          <ChevronDown
            size={18}
            className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-180 text-[var(--accent)]" : "rotate-0"}`}
          />
        </div>

        {/* Background Highlight */}
        <div className={`absolute inset-0 bg-[var(--accent)]/5 transition-transform duration-700 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} />
      </button>

      {/* Scroll Content (Accordion) */}
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="p-8 pt-0">
          <div className="w-full h-px mb-8 bg-gradient-to-r from-[var(--border-subtle)] via-[var(--border-subtle)] to-transparent" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.items.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div
                  key={idx}
                  ref={el => itemsRef.current[idx] = el}
                  className="flex flex-col gap-4 p-5 border transition-all group cursor-default relative overflow-hidden rounded-sm"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Icon
                    className="text-2xl transition-colors group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text-ink)" }}
                  />
                  <span
                    className="font-accent text-[10px] tracking-[0.2em] uppercase text-[var(--text-main)]"
                  >
                    {skill.name}
                  </span>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--accent)] opacity-0 group-hover:opacity-40 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}