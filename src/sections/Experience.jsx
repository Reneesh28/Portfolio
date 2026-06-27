import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import experienceData from '../data/experience';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';

gsap.registerPlugin(ScrollTrigger);

const getPaletteClasses = (palette) => {
  switch (palette) {
    case 'cyan': return { bg: 'bg-[var(--color-portal-cyan)]', text: 'text-[var(--color-portal-cyan)]', border: 'border-[var(--color-portal-cyan)]' };
    case 'red': return { bg: 'bg-[var(--color-signal-red)]', text: 'text-[var(--color-signal-red)]', border: 'border-[var(--color-signal-red)]' };
    case 'magenta': return { bg: 'bg-[var(--color-dimension-magenta)]', text: 'text-[var(--color-dimension-magenta)]', border: 'border-[var(--color-dimension-magenta)]' };
    default: return { bg: 'bg-[var(--color-comic-yellow)]', text: 'text-[var(--color-comic-yellow)]', border: 'border-[var(--color-comic-yellow)]' };
  }
};

const Experience = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const [activeIssue, setActiveIssue] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline draw animation
      gsap.fromTo(timelineRef.current, 
        { scaleY: 0 }, 
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center",
            end: "bottom bottom",
            scrub: true
          }
        }
      );

      // Issues stagger entrance
      gsap.from('.issue-cover', {
        y: 100,
        opacity: 0,
        rotation: (i) => i % 2 === 0 ? -2 : 2,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <ComicSpread id="experience" className="bg-[var(--color-paper-light)] text-[var(--color-ink-black)] relative z-20" ref={sectionRef}>
      
      {/* Texture Layer */}
      <div className="absolute inset-0 bg-halftone-light opacity-30 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute inset-0 bg-halftone-dark opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12 relative flex flex-col items-center">
          <p className="font-label uppercase tracking-[0.3em] font-bold text-[var(--color-pencil-gray)] mb-2">OPERATIONAL HISTORY</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-ink-black)] relative z-10">
            PREVIOUS ISSUES
          </h2>
          {/* Scratchy pencil underline */}
          <svg className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 text-[var(--color-dimension-magenta)]" viewBox="0 0 200 10" preserveAspectRatio="none">
            <path d="M0,5 Q50,0 100,6 T200,4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          
          <div className="mt-8 flex gap-4 bg-[var(--color-ink-black)] p-1 rounded-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 font-label font-bold text-sm uppercase transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)]' : 'text-white hover:text-[var(--color-comic-yellow)]'}`}
            >
              Issue Covers
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 font-label font-bold text-sm uppercase transition-colors ${viewMode === 'timeline' ? 'bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)]' : 'text-white hover:text-[var(--color-comic-yellow)]'}`}
            >
              Timeline
            </button>
          </div>
        </div>

        {/* Desktop View: Horizontal Covers, Mobile View: Vertical Stack */}
        <div className={`relative w-full px-4 md:px-12 ${viewMode === 'timeline' ? 'max-w-4xl' : ''}`}>
          
          {/* Horizontal Timeline Ink Line (Desktop) */}
          <div className={`hidden lg:block absolute top-1/2 left-0 w-full h-2 bg-[var(--color-ink-black)] z-0 transform -translate-y-1/2 ${viewMode === 'timeline' ? 'hidden' : ''}`}></div>
          {/* Vertical Timeline Ink Line */}
          <div ref={timelineRef} className={`absolute top-0 left-8 md:left-12 w-2 h-full bg-[var(--color-ink-black)] z-0 transform origin-top ${viewMode === 'timeline' ? 'block' : 'block lg:hidden'}`}></div>

          <div className={`grid relative z-10 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8' : 'grid-cols-1 gap-12'}`}>
            {experienceData.map((item, index) => {
              const colors = getPaletteClasses(item.palette);
              const isActive = activeIssue === index;
              
              return (
                <div 
                  key={index} 
                  className={`issue-cover relative group cursor-pointer transition-all duration-500 pl-16 ${viewMode === 'timeline' ? '' : 'lg:pl-0'} ${isActive && viewMode === 'grid' ? 'lg:scale-105 z-20' : (viewMode === 'grid' ? 'lg:scale-95 z-10 lg:opacity-70 lg:hover:opacity-100' : 'z-20')}`}
                  onClick={() => setActiveIssue(index)}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-[-8px] top-8 w-6 h-6 rounded-full border-4 border-[var(--color-ink-black)] bg-[var(--color-paper)] z-10 ${viewMode === 'timeline' ? 'block' : 'lg:hidden'}`}></div>
                  
                  {/* Issue Cover Panel */}
                  <ComicPanel 
                    theme={isActive ? 'dark' : 'light'} 
                    rotation={isActive ? '0deg' : (index % 2 === 0 ? '-2deg' : '2deg')}
                    className={`h-full flex flex-col p-0 overflow-hidden shadow-2xl transition-all duration-300 ${isActive ? `shadow-[12px_12px_0_var(--color-ink-black)]` : ''}`}
                    style={{ borderColor: 'var(--color-ink-black)' }}
                  >
                    {/* Cover Header */}
                    <div className={`${colors.bg} text-[var(--color-ink-black)] border-b-4 border-[var(--color-ink-black)] p-4 relative`}>
                      <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="font-display text-3xl">ISSUE #{String(experienceData.length - index).padStart(2, '0')}</span>
                        <span className="font-label uppercase font-bold text-xs bg-[var(--color-ink-black)] text-white px-2 py-1 transform rotate-3">{item.status}</span>
                      </div>
                      <h3 className="font-label uppercase font-bold text-xl md:text-2xl leading-tight relative z-10">{item.role}</h3>
                      <h4 className="font-body font-bold text-sm opacity-90 mt-1 relative z-10">{item.organization}</h4>
                    </div>

                    {/* Cover Body / Metadata */}
                    <div className="p-6 flex-grow flex flex-col bg-[var(--color-paper-light)] text-[var(--color-ink-black)]">
                      <div className="font-label font-bold text-sm text-[var(--color-pencil-gray)] mb-4 pb-2 border-b-2 border-dashed border-[var(--color-pencil-gray)]">
                        {item.period}
                      </div>

                      <div className={`space-y-4 mb-6 transition-all duration-300 ${isActive || viewMode === 'timeline' ? 'opacity-100' : 'opacity-100 lg:opacity-0 lg:h-0 lg:overflow-hidden'}`}>
                        <div>
                          <span className={`font-label uppercase font-bold text-xs block mb-1 ${colors.text}`}>Mission</span>
                          <p className="font-body text-sm font-bold leading-tight">{item.mission}</p>
                        </div>
                        <div>
                          <span className={`font-label uppercase font-bold text-xs block mb-1 ${colors.text}`}>Action</span>
                          <p className="font-body text-sm leading-tight">{item.action}</p>
                        </div>
                        <div>
                          <span className={`font-label uppercase font-bold text-xs block mb-1 ${colors.text}`}>Impact</span>
                          <p className="font-body text-sm italic font-medium leading-tight border-l-4 pl-2" style={{ borderColor: 'currentColor' }}>{item.impact}</p>
                        </div>
                      </div>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {item.tools.slice(0, 3).map((tool, i) => (
                            <span key={i} className="font-mono text-xs font-bold border-2 border-[var(--color-ink-black)] px-2 py-1 bg-white">
                              {tool}
                            </span>
                          ))}
                          {item.tools.length > 3 && <span className="font-mono text-xs font-bold border-2 border-transparent px-2 py-1 opacity-50">+{item.tools.length - 3}</span>}
                        </div>
                      </div>
                    </div>
                  </ComicPanel>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </ComicSpread>
  );
};

export default Experience;
