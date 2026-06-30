import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, List } from 'lucide-react';
import skillsData from '../data/skills';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import TiltCard from '../components/comic/TiltCard';
import StampReveal from '../components/comic/StampReveal';
import FrameStutter from '../components/comic/FrameStutter';
import { SectionPortal } from '../components/comic/PortalTransition';

gsap.registerPlugin(ScrollTrigger);

// Map categories to colors based on prompt
const getCategoryColor = (catName) => {
  if (catName.includes('Generative')) return 'var(--color-portal-cyan)';
  if (catName.includes('Machine Learning') || catName.includes('Data Science')) return 'var(--color-comic-yellow)';
  if (catName.includes('Frontend')) return 'var(--color-dimension-magenta)';
  if (catName.includes('Backend') || catName.includes('Programming')) return 'var(--color-signal-red)';
  return 'var(--color-acid-green)'; // Databases, Tools
};

const getLevelStyle = (level) => {
  switch (level) {
    case 'Core': return 'bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)]';
    case 'Applied': return 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)]';
    case 'Exploring': return 'bg-[var(--color-dimension-magenta)] text-[var(--color-ink-black)]';
    default: return 'bg-[var(--color-pencil-gray)] text-[var(--color-ink-black)]';
  }
};

const Skills = () => {
  const sectionRef = useRef(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

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
      <SectionPortal colorA="var(--color-saffron)" colorB="var(--color-portal-cyan)" />

      <div className="absolute inset-0 bg-halftone-dark opacity-20 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">

        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12 px-4 md:px-0 gap-6">
          <FrameStutter steps={5}>
            <StampReveal sfx="ZAP!" color="var(--color-portal-cyan)" rotation={-4}>
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--color-text-on-dark)] tracking-wider text-center md:text-left print-offset-cyan">
                POWERS & TOOLS
              </h2>
            </StampReveal>
          </FrameStutter>

          <div className="flex items-center gap-4 bg-[var(--color-ink-black)] border-4 border-[var(--color-portal-cyan)] p-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)]' : 'text-[var(--color-portal-cyan)] hover:bg-[var(--color-portal-cyan)] hover:bg-opacity-20'}`}
              aria-label="Grid View"
            >
              <LayoutGrid size={24} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)]' : 'text-[var(--color-portal-cyan)] hover:bg-[var(--color-portal-cyan)] hover:bg-opacity-20'}`}
              aria-label="List View"
            >
              <List size={24} />
            </button>
          </div>
        </div>

        {/* Capability Matrix Layout */}
        <div className={`w-full px-4 md:px-0 ${viewMode === 'grid' ? 'columns-1 lg:columns-2 gap-8 space-y-8' : 'flex flex-col gap-6'}`}>

          {skillsData.map((cat, idx) => {
            const catColor = getCategoryColor(cat.category);
            return (
              <div key={idx} className="skill-category-panel break-inside-avoid">
                <TiltCard maxTilt={4} scaleOnHover={1.01}>
                  <ComicPanel
                    theme="dark"
                    className="p-6 md:p-8 relative bg-[var(--color-ink-black)] transition-transform duration-300 hover:-translate-y-1"
                    style={{ borderColor: catColor }}
                  >
                    <div className="border-b-4 pb-3 mb-6 flex justify-between items-end relative z-10" style={{ borderBottomColor: catColor }}>
                      <h3 className="font-display text-3xl md:text-4xl tracking-widest uppercase" style={{ color: catColor }}>
                        {cat.category}
                      </h3>
                    </div>

                    {/* Decorative background blast on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 blur-2xl pointer-events-none transition-opacity duration-500"
                      style={{ backgroundColor: catColor }}
                    ></div>

                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} relative z-10`}>
                      {cat.items.map((skill, sIdx) => {
                        const Icon = skill.icon;
                        return (
                          <div
                            key={sIdx}
                            className={`flex flex-col gap-3 bg-[var(--color-deep-navy)] border-2 p-4 transition-transform shadow-[4px_4px_0_rgba(0,0,0,0.5)] ${viewMode === 'grid' ? 'hover:scale-[1.02]' : 'hover:-translate-y-1'}`}
                            style={{ borderColor: catColor }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Icon className="text-3xl shrink-0" style={{ color: catColor }} />
                                <span className="font-label uppercase font-bold text-lg md:text-xl text-[var(--color-text-on-dark)]">{skill.name}</span>
                              </div>
                              <StampReveal
                                sfx={null}
                                color="var(--color-comic-yellow)"
                                rotation={sIdx % 2 === 0 ? -10 : 10}
                                delay={0.03 * sIdx}
                              >
                                <span className={`font-mono text-xs font-bold px-2 py-1 uppercase tracking-wider ${getLevelStyle(skill.level)}`}>
                                  {skill.level}
                                </span>
                              </StampReveal>
                            </div>

                            <div className="mt-2 pt-2 border-t-2 border-dashed border-[var(--color-ink-black)]">
                              <p className="font-body text-sm text-[var(--color-text-muted-dark)] line-clamp-2">
                                <span className="font-label uppercase text-[var(--color-pencil-gray)] text-xs mr-2">EVIDENCE:</span>
                                {skill.evidence}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ComicPanel>
                </TiltCard>
              </div>
            );
          })}

        </div>
      </div>
    </ComicSpread>
  );
};

export default Skills;