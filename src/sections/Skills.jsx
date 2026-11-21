import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutGrid, List } from 'lucide-react';
import skillsData from '../data/skills';

gsap.registerPlugin(ScrollTrigger);

const getLevelStyle = (level) => {
  switch (level) {
    case 'Core': return 'bg-accent text-accent-contrast border-accent';
    case 'Applied': return 'bg-surface-raised text-text border-border';
    case 'Exploring': return 'bg-transparent text-text-muted border-border';
    default: return 'bg-transparent text-text-muted border-border';
  }
};

const Skills = () => {
  const sectionRef = useRef(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { isDesktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.skill-category-panel', { opacity: 1 });
        return;
      }

      gsap.from('.skill-category-panel', {
        y: isDesktop ? 50 : 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });
    });

    return () => mm.revert();
  }, []);

  const toggleClass = (active) =>
    `p-2 rounded transition-colors ${active ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:bg-surface-raised'}`;

  return (
    <section ref={sectionRef} id="skills" className="relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-bg z-10">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">

        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-12 px-4 md:px-0 gap-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text text-center md:text-left">
            Skills
          </h2>

          <div className="flex items-center gap-2 bg-surface border border-border rounded-md p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={toggleClass(viewMode === 'grid')}
              aria-label="Grid View"
              aria-pressed={viewMode === 'grid'}
            >
              <LayoutGrid size={22} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={toggleClass(viewMode === 'list')}
              aria-label="List View"
              aria-pressed={viewMode === 'list'}
            >
              <List size={22} />
            </button>
          </div>
        </div>

        {/* Capability Matrix Layout */}
        <div className={`w-full px-4 md:px-0 ${viewMode === 'grid' ? 'columns-1 lg:columns-2 gap-8 space-y-8' : 'flex flex-col gap-6'}`}>

          {skillsData.map((cat, idx) => (
            <div key={idx} className="skill-category-panel break-inside-avoid">
              <div className="p-6 md:p-8 rounded-lg border border-border bg-surface">
                <div className="border-b border-border pb-3 mb-6">
                  <h3 className="text-2xl md:text-3xl font-semibold">
                    {cat.category}
                  </h3>
                </div>

                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {cat.items.map((skill, sIdx) => {
                    const Icon = skill.icon;
                    return (
                      <div
                        key={sIdx}
                        className="flex flex-col gap-3 bg-bg border border-border rounded-md p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Icon className="text-2xl shrink-0 text-text-muted" />
                            <span className="font-semibold text-lg text-text">{skill.name}</span>
                          </div>
                          <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded border ${getLevelStyle(skill.level)}`}>
                            {skill.level}
                          </span>
                        </div>

                        <div className="mt-1 pt-2 border-t border-border">
                          <p className="text-sm text-text-muted line-clamp-2">
                            <span className="uppercase text-xs font-medium mr-2">Evidence:</span>
                            {skill.evidence}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Skills;
