import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectsData from '../data/projects';
import { Network, Cpu, Layout, Play, Github } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const linkButtonClass = "inline-flex w-full justify-center items-center gap-2 px-4 py-3 rounded-md text-xs md:text-sm font-medium transition-opacity hover:opacity-90";

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
        gsap.set('.project-card', { opacity: 1 });
        return;
      }

      gsap.from('.project-card', {
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

  const modeButtonClass = (active) =>
    `px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${active ? 'bg-accent text-accent-contrast' : 'text-text-muted hover:text-text'}`;

  return (
    <section ref={sectionRef} id="projects" className="relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-surface text-text border-y border-border z-30">
      <div className="relative w-full max-w-[1920px] mx-auto flex flex-col items-center">

        <div className="text-center mb-8 relative flex flex-col items-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text">
            Projects
          </h2>

          <div className="mt-8 flex gap-2 bg-bg p-1 rounded-md border border-border">
            <button
              onClick={() => setTechMode(false)}
              className={modeButtonClass(!techMode)}
              aria-pressed={!techMode}
            >
              <Layout size={16} /> Simplify Mode
            </button>
            <button
              onClick={() => setTechMode(true)}
              className={modeButtonClass(techMode)}
              aria-pressed={techMode}
            >
              <Cpu size={16} /> Technical Mode
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-16 px-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`text-sm md:text-base font-medium px-4 py-2 rounded-full border transition-colors duration-200 ${filter === cat
                ? 'bg-accent border-accent text-accent-contrast'
                : 'bg-transparent border-border text-text hover:bg-surface-raised'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col gap-12">
          {filteredProjects.map((project, index) => {
            const hasCodeLink = project.codeLink && project.codeLink !== "#" && !project.codeLink.includes("syncing");
            const hasLiveLink = project.liveLink && project.liveLink !== "#" && !project.liveLink.includes("syncing");
            const linksUnavailable = (!project.codeLink && !project.codeLinkBackend && !project.liveLink) || project.codeLink?.includes("syncing");

            return (
              <article
                key={index}
                className="project-card w-full rounded-lg border border-border bg-bg p-4 md:p-6"
              >
                <div className="flex flex-wrap justify-between items-end gap-3 border-b border-border pb-3 mb-4">
                  <h3 className="text-2xl md:text-4xl font-bold">{project.title}</h3>
                  <span className="text-xs font-medium rounded border border-border px-2 py-1 text-text-muted">{project.category}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Cover Image */}
                  <div className="md:col-span-2 lg:col-span-1 rounded-md border border-border relative overflow-hidden min-h-[250px]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <span className="absolute top-3 right-3 text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1 bg-bg/80 text-text border border-border">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Overview */}
                  <div className="rounded-md border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Overview</p>
                    <p className="text-base md:text-lg mt-3 leading-snug">
                      {project.description}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase text-text-muted">
                      Status: {project.status}
                    </p>
                  </div>

                  {/* Architecture or Impact */}
                  <div className="md:col-span-3 lg:col-span-1 rounded-md border border-border bg-surface p-6 flex flex-col">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{techMode ? "Architecture" : "Impact"}</p>

                    {techMode ? (
                      <div className="flex-grow rounded border border-dashed border-border mt-3 p-4 flex flex-col items-center justify-center text-center">
                        <Network size={32} className="text-text-muted mb-2" />
                        <span className="text-xs text-text-muted">Architecture diagram coming soon</span>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <h4 className="text-xl font-semibold">User Value</h4>
                        <p className="text-sm mt-2 text-text-muted">Delivered streamlined experiences reducing manual friction and creating scalable digital solutions.</p>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack */}
                  <div className="rounded-md border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Tech Stack</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.tech.map((t, i) => (
                        <span key={i} className="font-mono text-xs px-2 py-1 rounded border border-border bg-bg">
                          {techMode ? t.toUpperCase() : t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="md:col-span-2 rounded-md border border-border bg-surface p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-text-muted mb-3">Links</p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      {hasCodeLink && (
                        <a href={project.codeLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                          <span className={`${linkButtonClass} bg-accent text-accent-contrast`}>
                            <Github size={16} /> Source Code
                          </span>
                        </a>
                      )}
                      {(project.codeLinkBackend && project.codeLinkFrontend) && (
                        <>
                          <a href={project.codeLinkBackend} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                            <span className={`${linkButtonClass} bg-accent text-accent-contrast`}>
                              <Github size={16} /> Backend Code
                            </span>
                          </a>
                          <a href={project.codeLinkFrontend} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                            <span className={`${linkButtonClass} border border-border text-text`}>
                              <Github size={16} /> Frontend Code
                            </span>
                          </a>
                        </>
                      )}
                      {hasLiveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex-1 min-w-[150px]">
                          <span className={`${linkButtonClass} border border-border text-text`}>
                            <Play size={16} /> Live Demo
                          </span>
                        </a>
                      )}
                      {linksUnavailable ? (
                        <div className="text-sm text-text-muted border border-border rounded px-4 py-2">
                          Links not yet available
                        </div>
                      ) : null}
                    </div>
                  </div>

                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
