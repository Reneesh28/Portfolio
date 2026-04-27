import { useState, useEffect, useRef } from "react";
import skills from "../data/skills";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { StoneIcon, WaterIcon, WindIcon, MoonIcon } from "../components/StanceIcons";

gsap.registerPlugin(ScrollTrigger);

const STANCES = [
  { id: "stone", name: "STONE", label: "The Foundation", color: "#C5A059", icon: StoneIcon, categories: ["Programming Languages", "Databases"] },
  { id: "water", name: "WATER", label: "The Flow", color: "#F5F5F5", icon: WaterIcon, categories: ["Frontend"] },
  { id: "wind", name: "WIND", label: "The Unseen", color: "#A3A3A3", icon: WindIcon, categories: ["Backend", "Tools & Forge"] },
  { id: "moon", name: "MOON", label: "The Visionary", color: "#8B0000", icon: MoonIcon, categories: ["Data Science", "Generative AI"] },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const [activeStance, setActiveStance] = useState(STANCES[0]);
  const flashRef = useRef(null);

  const handleStanceChange = (stance) => {
    if (stance.id === activeStance.id) return;

    // Blade Flash Animation
    gsap.fromTo(flashRef.current,
      { scaleX: 0, opacity: 1, left: "0%" },
      { scaleX: 1, opacity: 0, left: "100%", duration: 0.6, ease: "power4.inOut" }
    );

    setActiveStance(stance);
  };

  const activeData = skills.filter(cat => activeStance.categories.includes(cat.category));

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full min-h-screen bg-[#0D0D0D] text-[#F5F5F5] py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Blade Flash Overlay */}
      <div ref={flashRef} className="absolute top-1/2 left-0 w-full h-[2px] bg-white z-50 opacity-0 pointer-events-none origin-left" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">

        {/* LEFT: STANCE SELECTOR (CIRCULAR ASSETS) */}
        <div className="md:w-1/3 flex flex-col gap-12">
          <div>
            <p className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] mb-4 font-bold">
              Combat Mastery
            </p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">
              The Arts
            </h2>
          </div>

          <nav className="grid grid-cols-2 gap-8 md:flex md:flex-col md:gap-10">
            {STANCES.map((stance) => {
              const Icon = stance.icon;
              const isActive = activeStance.id === stance.id;

              return (
                <button
                  key={stance.id}
                  onClick={() => handleStanceChange(stance)}
                  className={`
                    group relative flex items-center gap-6 text-left transition-all duration-500
                    ${isActive ? "opacity-100" : "opacity-30 hover:opacity-60"}
                  `}
                >
                  {/* Circular Icon Container */}
                  <div className={`
                    relative w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-500
                    ${isActive ? 'border-[#C5A059] scale-110 shadow-[0_0_20px_rgba(197,160,89,0.2)]' : 'border-white/10'}
                  `}>
                    <Icon active={isActive} />

                    {/* Active Indicator Dots (Mastery) */}
                    {isActive && (
                      <div className="absolute inset-0 border-2 border-transparent border-t-[#C5A059] rounded-full animate-[spin_4s_linear_infinite]" />
                    )}
                  </div>

                  <div className="hidden md:block">
                    <div className="flex overflow-hidden">
                      {stance.name.split("").map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ y: 10, opacity: 0 }}
                          animate={isActive ? { y: 0, opacity: 1 } : { y: 0, opacity: 0.4 }}
                          transition={{ delay: i * 0.03, duration: 0.5 }}
                          className={`font-serif text-2xl tracking-[0.2em] transition-colors ${isActive ? 'text-[#C5A059]' : 'text-white'}`}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                    <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">{stance.label}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT: SKILLS DISPLAY (CHARM STYLE) */}
        <div className="md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStance.id}
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="space-y-20"
            >
              {activeData.map((category) => (
                <div key={category.category} className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-px w-8 bg-[#C5A059]" />
                      <h4 className="text-[#C5A059] font-serif text-3xl tracking-tight uppercase">
                        {category.category}
                      </h4>
                    </div>
                    <p className="text-[#A3A3A3] font-serif text-lg leading-relaxed max-w-xl italic opacity-70">
                      "{category.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {category.items.map((skill) => {
                      const SkillIcon = skill.icon;
                      return (
                        <div
                          key={skill.name}
                          className="
                            relative flex flex-col items-center justify-center p-6 
                            bg-[#111111] border border-white/5 
                            hover:border-[#C5A059]/40 hover:bg-[#161616] 
                            transition-all duration-300 group cursor-default
                            before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] before:opacity-0 hover:before:opacity-100
                          "
                        >
                          <SkillIcon size={32} className="text-[#A3A3A3] group-hover:text-[#C5A059] transition-all duration-500 mb-4 group-hover:scale-110" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 text-center">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}