import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '../data/projects';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('All');
  
  // Extract unique categories
  const categories = ['All', ...new Set(projectsData.map(p => p.category))];
  
  const filteredProjects = filter === 'All' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.project-card', {
        y: 100,
        opacity: 0,
        rotation: () => (Math.random() - 0.5) * 10,
        duration: 0.8,
        stagger: 0.1,
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

  // Re-animate when filter changes
  useEffect(() => {
    gsap.fromTo('.project-card', 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "back.out(1.5)" }
    );
  }, [filter]);

  return (
    <ComicSpread id="projects" className="bg-[var(--color-ink-black)] text-[var(--color-text-on-dark)] border-t-8 border-b-8 border-[var(--color-paper)] z-30" ref={sectionRef}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-cyan opacity-10 pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col items-center">
        
        <div className="text-center mb-8 relative">
          <p className="font-label uppercase tracking-[0.3em] font-bold text-[var(--color-dimension-magenta)] mb-2">EXPLORE THE MULTIVERSE</p>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-text-on-dark)] relative z-10 text-shadow-magenta">
            THE UNIVERSES
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              className={`font-label uppercase font-bold tracking-widest text-sm md:text-base px-4 py-2 border-4 transition-all duration-200 comic-focus ${
                filter === cat 
                  ? 'bg-[var(--color-comic-yellow)] border-[var(--color-comic-yellow)] text-[var(--color-ink-black)] transform -translate-y-1 shadow-[4px_4px_0_var(--color-portal-cyan)]' 
                  : 'bg-transparent border-[var(--color-text-muted-dark)] text-[var(--color-text-on-dark)] hover:border-[var(--color-portal-cyan)] hover:text-[var(--color-portal-cyan)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid / Splash Page */}
        <div className="w-full px-4 md:px-8 lg:px-12">
          {/* Asymmetrical Grid layout simulating a comic page */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-min">
            
            {filteredProjects.map((project, index) => {
              // Determine size based on featured status and index for asymmetrical look
              const isLarge = project.featured;
              const colSpan = isLarge ? 'lg:col-span-8 md:col-span-2' : 'lg:col-span-4';
              const rowSpan = isLarge ? 'lg:row-span-2' : 'lg:row-span-1';
              
              // Get color theme
              let themeColor = 'var(--color-comic-yellow)';
              if (project.palette === 'cyan') themeColor = 'var(--color-portal-cyan)';
              if (project.palette === 'red') themeColor = 'var(--color-signal-red)';
              if (project.palette === 'magenta') themeColor = 'var(--color-dimension-magenta)';
              if (project.palette === 'acid') themeColor = 'var(--color-acid-green)';

              return (
                <div key={index} className={`project-card ${colSpan} ${rowSpan} h-full flex`}>
                  <ComicPanel 
                    theme="dark" 
                    className="w-full h-full flex flex-col p-0 overflow-hidden group cursor-pointer border-4 hover:border-8 transition-all duration-300 relative bg-[var(--color-deep-navy)]"
                    style={{ borderColor: 'var(--color-ink-black)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.zIndex = 10;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-ink-black)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.zIndex = 1;
                    }}
                  >
                    {/* Image Header with Halftone Filter */}
                    <div className={`relative ${isLarge ? 'h-64 lg:h-96' : 'h-48'} overflow-hidden border-b-4 border-[var(--color-ink-black)]`}>
                      <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105 origin-center"
                      />
                      <div className="absolute inset-0 bg-halftone-cyan opacity-40 mix-blend-overlay pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink-black)] to-transparent opacity-90"></div>
                      
                      {/* Project Type Badge */}
                      <div className="absolute top-4 left-4 bg-[var(--color-ink-black)] text-white font-label font-bold text-xs uppercase px-3 py-1 border-2 border-white transform -rotate-3">
                        {project.category}
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 bg-white text-[var(--color-ink-black)] font-label font-bold text-xs uppercase px-3 py-1 transform rotate-2">
                        {project.status}
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <h3 className={`font-display text-3xl ${isLarge ? 'md:text-5xl lg:text-6xl' : 'md:text-4xl'} leading-tight`} style={{ color: themeColor }}>
                          {project.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <p className="font-body text-base md:text-lg text-[var(--color-text-on-dark)] opacity-90 mb-6 line-clamp-3">
                        {project.description}
                      </p>
                      
                      <div>
                        {/* Powers / Tech */}
                        <div className="mb-6">
                          <p className="font-label uppercase font-bold text-xs text-[var(--color-text-muted-dark)] mb-2">POWERS EXTRACTED</p>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((t, i) => (
                              <span key={i} className="font-mono text-xs font-bold text-[var(--color-ink-black)] px-2 py-1" style={{ backgroundColor: themeColor }}>
                                [{t.toUpperCase()}]
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-dashed border-[var(--color-ink-black)]/50">
                          {(project.codeLink && project.codeLink !== "#") && (
                            <a href={project.codeLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px]">
                              <InkButton variant="white" className="w-full text-xs md:text-sm py-2">
                                READ SOURCE
                              </InkButton>
                            </a>
                          )}
                          {(project.codeLinkBackend && project.codeLinkFrontend) && (
                            <>
                              <a href={project.codeLinkBackend} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px]">
                                <InkButton variant="white" className="w-full text-xs md:text-sm py-2">
                                  BACKEND LOG
                                </InkButton>
                              </a>
                              <a href={project.codeLinkFrontend} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px]">
                                <InkButton variant="cyan" className="w-full text-xs md:text-sm py-2">
                                  FRONTEND LOG
                                </InkButton>
                              </a>
                            </>
                          )}
                          {(project.liveLink && project.liveLink !== "#") && (
                            <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[140px]">
                              <InkButton variant="yellow" className="w-full text-xs md:text-sm py-2">
                                ENTER UNIVERSE
                              </InkButton>
                            </a>
                          )}
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
      
      <style dangerouslySetInnerHTML={{__html: `
        .text-shadow-magenta {
          text-shadow: 4px 4px 0 var(--color-dimension-magenta);
        }
      `}} />
    </ComicSpread>
  );
};

export default Projects;
