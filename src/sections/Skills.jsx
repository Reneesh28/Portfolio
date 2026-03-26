import { useState, useEffect, useRef } from "react";
import skills from "../data/skills";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock, Unlock, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance Animation for the Vault bars
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
      className="w-full min-h-screen bg-[#0A0A0A] text-[#E0E0E0] border-t border-white/5 py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden flex flex-col items-center"
    >
      <div className="w-full max-w-4xl relative z-10 flex flex-col">
        {/* Section Label */}
        <p className="vault-bar text-[#00BFA5] font-semibold uppercase tracking-[0.2em] text-sm mb-12 sm:mb-16">
          CAPABILITY MATRIX
        </p>

        {/* Encrypted Category Vaults */}
        <div className="flex flex-col gap-4">
          {skills.map((categoryData, idx) => (
            <SkillVault key={idx} data={categoryData} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillVault({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      // Wait for the accordion to slightly open before staggering items
      gsap.fromTo(itemsRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.03, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [isOpen]);

  return (
    <div className="vault-bar border border-white/10 bg-[#111111] overflow-hidden transition-colors duration-300 hover:border-[#00BFA5]/30">

      {/* Vault Header Bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-4">
          {isOpen ? (
            <Unlock size={18} className="text-[#00BFA5]" />
          ) : (
            <Lock size={18} className="text-[#A3A3A3] group-hover:text-[#E0E0E0] transition-colors" />
          )}
          <h3 className={`font-mono tracking-widest text-sm sm:text-base transition-colors ${isOpen ? 'text-[#00BFA5]' : 'text-[#A3A3A3] group-hover:text-[#E0E0E0]'}`}>
            {isOpen ? `[ UNLOCKED: ${data.category.toUpperCase()} ]` : `[ ENCRYPTED: ${data.category.toUpperCase()} ]`}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-[#A3A3A3]">
          <span className="font-mono text-xs opacity-50 hidden sm:block">
            {data.items.length} MODULES
          </span>
          <span className="w-px h-4 bg-white/10 hidden sm:block"></span>
          <ChevronDown
            size={18}
            className={`transition-all duration-300 ease-out ${isOpen ? "rotate-180 text-[#00BFA5]" : "rotate-0 text-[#A3A3A3]"}`}
          />
        </div>
      </button>

      {/* Vault Content (Accordion) */}
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="p-5 sm:p-6 pt-0 bg-[#111111]">
          {/* Subtle separator inside the open vault */}
          <div className="w-full h-px bg-white/5 mb-6" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {data.items.map((skill, idx) => {
              const Icon = skill.icon;
              return (
                <div
                  key={idx}
                  ref={el => itemsRef.current[idx] = el}
                  className="flex items-center gap-3 p-3 bg-[#1A1A1A] border border-white/5 hover:border-[#00BFA5]/40 hover:bg-[#222222] transition-colors group cursor-default"
                >
                  <Icon className="text-xl text-[#A3A3A3] group-hover:text-[#00BFA5] transition-colors" />
                  <span className="font-mono text-xs sm:text-sm tracking-wide text-[#E0E0E0] truncate">
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