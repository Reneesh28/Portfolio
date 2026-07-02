import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '../data/projects';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';
import TiltCard from '../components/comic/TiltCard';
import StampReveal from '../components/comic/StampReveal';
import FrameStutter from '../components/comic/FrameStutter';
import KineticTitle from '../components/comic/KineticTitle';
import { Network, FileText, Cpu, Layout, Play, Github } from 'lucide-react';
import { SectionPortal } from '../components/comic/PortalTransition';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const [filter, setFilter] = useState('All');
  const [techMode, setTechMode] = useState(false); // false = Simplify, true = Technical

  const categories = ['All', ...new Set(projectsData.map(p => p.category))];
  const filteredProjects = filter === 'All'
    ? projectsData
    : projectsData.filter(p => p.category === filter);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      let { isDesktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.project-6panel', { opacity: 1 });
        return;
      }

      gsap.from('.project-6panel', {
        y: isDesktop ? 100 : 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <ComicSpread id="projects" className="bg-[var(--color-ink-black)] text-[var(--color-text-on-dark)] border-t-8 border-b-8 border-[var(--color-paper)] z-30" ref={sectionRef}>
      <SectionPortal colorA="var(--color-portal-cyan)" colorB="var(--color-saffron)" />

      <div className="absolute inset-0 bg-halftone-cyan opacity-10 pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col items-center">

        <div className="text-center mb-8 relative flex flex-col items-center">
          <p className="font-label uppercase tracking-[0.3em] font-bold text-[var(--color-dimension-magenta)] mb-2">EXPLORE THE MULTIVERSE</p>
          <FrameStutter steps={5}>
            <StampReveal sfx="SNAP!" color="var(--color-dimension-magenta)" rotation={-5}>
              <h2 className="font-display text-4xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-text-on-dark)] relative z-10 text-shadow-magenta">
                <KineticTitle as="span">CASE STUDIES</KineticTitle>
              </h2>
            </StampReveal>
          </FrameStutter>

          <div className="mt-8 flex gap-4 bg-[var(--color-deep-navy)] p-1 rounded-sm border-2 border-[var(--color-portal-cyan)]">
            <button
              onClick={() => setTechMode(false)}
              className={`px-4 py-2 font-label font-bold text-sm uppercase transition-colors flex items-center gap-2 ${!techMode ? 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)]' : 'text-white hover:text-[var(--color-portal-cyan)]'}`}
            >
              <Layout size={16} /> Simplify Mode
            </button>
            <button
              onClick={() => setTechMode(true)}
              className={`px-4 py-2 font-label font-bold text-sm uppercase transition-colors flex items-center gap-2 ${techMode ? 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)]' : 'text-white hover:text-[var(--color-portal-cyan)]'}`}
            >
              <Cpu size={16} /> Technical Mode
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16 px-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              className={`font-label uppercase font-bold tracking-widest text-sm md:text-base px-4 py-2 border-4 transition-all duration-200 comic-focus ${filter === cat
                ? 'bg-[var(--color-comic-yellow)] border-[var(--color-comic-yellow)] text-[var(--color-ink-black)] transform -translate-y-1 shadow-[4px_4px_0_var(--color-portal-cyan)]'
                : 'bg-transparent border-[var(--color-text-muted-dark)] text-[var(--color-text-on-dark)] hover:border-[var(--color-portal-cyan)] hover:text-[var(--color-portal-cyan)]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col gap-16">
          {filteredProjects.map((project, index) => {
            let themeColor = 'var(--color-comic-yellow)';
            if (project.palette === 'cyan') themeColor = 'var(--color-portal-cyan)';
            if (project.palette === 'red') themeColor = 'var(--color-signal-red)';
            if (project.palette === 'magenta') themeColor = 'var(--color-dimension-magenta)';
            if (project.palette === 'acid') themeColor = 'var(--color-acid-green)';

            return (
              <TiltCard
                key={index}
                maxTilt={5}
                className="project-6panel w-full bg-[var(--color-deep-navy)] border-4 p-4 shadow-[12px_12px_0_rgba(0,0,0,1)]"
                style={{ borderColor: themeColor }}
              >
                {/* Comic page header */}
                <div className="flex justify-between items-end border-b-4 pb-2 mb-4" style={{ borderColor: themeColor }}>
                  <h3 className="font-display text-3xl md:text-5xl uppercase" style={{ color: themeColor }}>{project.title}</h3>
                  <span className="font-label uppercase font-bold text-sm bg-white text-[var(--color-ink-black)] px-2 py-1 transform rotate-2">{project.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Panel 1: Cover Image (Spans 2 cols on tablet, 1 on desktop) */}
                  <div className="md:col-span-2 lg:col-span-1 border-4 border-[var(--color-ink-black)] relative overflow-hidden group min-h-[250px]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-halftone-cyan opacity-40 mix-blend-overlay"></div>
                    <div className="absolute top-2 left-2 bg-[var(--color-ink-black)] text-white text-xs font-bold px-2 py-1 border-2 border-white">COVER</div>
                    {project.featured && (
                      <StampReveal
                        sfx={null}
                        color="var(--color-signal-red)"
                        rotation={-18}
                        className="absolute top-3 right-3 z-20"
                      >
                        <span
                          className="inline-block font-display uppercase text-xs md:text-sm px-3 py-1 border-3 rounded-full"
                          style={{
                            color: 'var(--color-signal-red)',
                            borderColor: 'var(--color-signal-red)',
                            borderWidth: '3px',
                            backgroundColor: 'rgba(8,8,10,0.7)',
                            letterSpacing: '0.1em',
                          }}
                        >
                          FEATURED
                        </span>
                      </StampReveal>
                    )}
                  </div>

                  {/* Panel 2: The Brief (Overview) */}
                  <div className="border-4 border-[var(--color-ink-black)] bg-[var(--color-paper-light)] text-[var(--color-ink-black)] p-6 relative">
                    <div className="absolute top-2 left-2 font-label font-bold text-xs text-[var(--color-pencil-gray)]">PANEL 2: THE BRIEF</div>
                    <p className="font-body text-base md:text-lg mt-4 font-medium leading-tight">
                      {project.description}
                    </p>
                    <div className="mt-4 font-label font-bold uppercase text-xs" style={{ color: themeColor }}>
                      Status: {project.status}
                    </div>
                  </div>

                  {/* Panel 3: Architecture Map or Simplified Impact */}
                  <div className="md:col-span-3 lg:col-span-1 border-4 border-[var(--color-ink-black)] bg-white p-6 relative flex flex-col justify-center items-center text-center overflow-hidden">
                    <div className="absolute top-2 left-2 font-label font-bold text-xs text-[var(--color-pencil-gray)] z-10">PANEL 3: {techMode ? "ARCHITECTURE" : "IMPACT"}</div>

                    {techMode ? (
                      <div className="w-full h-full border-2 border-dashed border-[var(--color-portal-cyan)] mt-4 p-4 flex flex-col items-center justify-center bg-[var(--color-deep-navy)] text-white bg-halftone-light bg-blend-overlay">
                        <Network size={32} className="text-[var(--color-portal-cyan)] mb-2" />
                        <span className="font-mono text-xs text-[var(--color-portal-cyan)]">SYSTEM_ARCH_MAP</span>
                        <div className="text-[10px] font-mono opacity-50 mt-2">[Awaiting Data Uplink...]</div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <h4 className="font-display text-3xl text-[var(--color-ink-black)]">USER VALUE</h4>
                        <p className="font-body text-sm font-bold mt-2">Delivered streamlined experiences reducing manual friction and creating scalable digital solutions.</p>
                      </div>
                    )}
                  </div>

                  {/* Panel 4: Tech Stack (Only visible in Tech Mode or simplified in Simple Mode) */}
                  <div className={`border-4 border-[var(--color-ink-black)] p-6 relative ${techMode ? 'bg-[var(--color-ink-black)] text-white' : 'bg-[var(--color-paper)] text-[var(--color-ink-black)]'}`}>
                    <div className="absolute top-2 left-2 font-label font-bold text-xs opacity-50">PANEL 4: POWERS</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <span key={i} className={`font-mono text-xs font-bold px-2 py-1 ${techMode ? 'border-2 border-white' : 'bg-[var(--color-ink-black)] text-white'}`}>
                          {techMode ? `[${t.toUpperCase()}]` : t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Panel 5: Links & Actions */}
                  <div className="md:col-span-2 border-4 border-[var(--color-ink-black)] bg-[var(--color-ink-black)] p-6 relative flex items-center justify-center gap-4 flex-wrap">
                    <div className="absolute top-2 left-2 font-label font-bold text-xs text-white opacity-50">PANEL 5: ACTIONS</div>

                    {(project.codeLink && project.codeLink !== "#" && !project.codeLink.includes("syncing")) && (
                      <a href={project.codeLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                        <InkButton variant="white" className="w-full text-xs md:text-sm py-3 flex justify-center items-center gap-2">
                          <Github size={16} /> READ SOURCE
                        </InkButton>
                      </a>
                    )}
                    {(project.codeLinkBackend && project.codeLinkFrontend) && (
                      <>
                        <a href={project.codeLinkBackend} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                          <InkButton variant="white" className="w-full text-xs md:text-sm py-3 flex justify-center items-center gap-2">
                            <Github size={16} /> BACKEND LOG
                          </InkButton>
                        </a>
                        <a href={project.codeLinkFrontend} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                          <InkButton variant="cyan" className="w-full text-xs md:text-sm py-3 flex justify-center items-center gap-2">
                            <Github size={16} /> FRONTEND LOG
                          </InkButton>
                        </a>
                      </>
                    )}
                    {(project.liveLink && project.liveLink !== "#" && !project.liveLink.includes("syncing")) && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                        <InkButton variant="yellow" className="w-full text-xs md:text-sm py-3 flex justify-center items-center gap-2">
                          <Play size={16} /> ENTER UNIVERSE
                        </InkButton>
                      </a>
                    )}
                    {(!project.codeLink && !project.codeLinkBackend && !project.liveLink) || project.codeLink?.includes("syncing") ? (
                      <div className="font-mono text-sm text-[var(--color-signal-red)] uppercase border-2 border-[var(--color-signal-red)] px-4 py-2">
                        Classified / Awaiting Sync
                      </div>
                    ) : null}
                  </div>

                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .text-shadow-magenta {
          text-shadow: 4px 4px 0 var(--color-dimension-magenta);
        }
      `}} />
    </ComicSpread>
  );
};

export default Projects;