import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import skillsData from '../data/skills';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';

gsap.registerPlugin(ScrollTrigger);

// Map categories to colors based on prompt
const getCategoryColor = (catName) => {
  if (catName.includes('Generative')) return 'var(--color-portal-cyan)';
  if (catName.includes('Machine Learning') || catName.includes('Data Science')) return 'var(--color-comic-yellow)';
  if (catName.includes('Frontend')) return 'var(--color-dimension-magenta)';
  if (catName.includes('Backend') || catName.includes('Programming')) return 'var(--color-signal-red)';
  return 'var(--color-acid-green)'; // Databases, Tools
};

const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-category-panel', {
        y: 50,
        opacity: 0,
        rotation: () => (Math.random() - 0.5) * 4,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <ComicSpread id="skills" className="bg-[var(--color-deep-navy)] z-10" ref={sectionRef}>

      <div className="absolute inset-0 bg-halftone-dark opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--color-text-on-dark)] mb-12 tracking-wider text-center print-offset-cyan">
          POWERS & TOOLS
        </h2>

        {/* Capability Matrix - Masonry Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 w-full px-4 md:px-0">

          {skillsData.map((cat, idx) => {
            const catColor = getCategoryColor(cat.category);
            return (
              <div key={idx} className="skill-category-panel break-inside-avoid">
                <ComicPanel
                  theme="dark"
                  className="p-6 relative bg-[var(--color-ink-black)] group hover:scale-[1.02] transition-transform duration-300"
                  style={{ borderColor: catColor }}
                >
                  <div className="border-b-4 pb-3 mb-6 flex justify-between items-end relative z-10" style={{ borderBottomColor: catColor }}>
                    <h3 className="font-display text-3xl tracking-widest uppercase" style={{ color: catColor }}>
                      {cat.category}
                    </h3>
                  </div>

                  {/* Decorative background blast on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 blur-2xl pointer-events-none transition-opacity duration-500"
                    style={{ backgroundColor: catColor }}
                  ></div>

                  <div className="flex flex-wrap gap-3 relative z-10">
                    {cat.items.map((skill, sIdx) => {
                      const Icon = skill.icon;
                      return (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 bg-[var(--color-deep-navy)] border-2 px-3 py-2 hover:-translate-y-1 transition-transform shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                          style={{ borderColor: catColor }}
                        >
                          <Icon className="text-xl" style={{ color: catColor }} />
                          <span className="font-label uppercase font-bold text-sm text-[var(--color-text-on-dark)]">{skill.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </ComicPanel>
              </div>
            );
          })}

        </div>
      </div>
    </ComicSpread>
  );
};

export default Skills;