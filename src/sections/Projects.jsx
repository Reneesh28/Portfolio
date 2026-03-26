import { useEffect, useRef, useState, useMemo, memo } from "react";
import projects from "../data/projects";
import { FiClock, FiArrowUpRight, FiSearch, FiX, FiTerminal } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

// Memoized Tech Badge to prevent redundant renders
const TechBadge = memo(({ item }) => (
  <Badge variant="accent" className="bg-[#1A1A1A] text-[10px] py-0 px-2 border-white/5 whitespace-nowrap">
    {item}
  </Badge>
));
TechBadge.displayName = "TechBadge";

// Memoized Project Card
const ProjectCard = memo(({ project, onAccess }) => {
  const isComingSoon = project.status?.toLowerCase() === "coming-soon";
  const hexId = useMemo(() => 
    `0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`, 
    []
  );

  return (
    <button
      onClick={() => !isComingSoon && onAccess(project)}
      className={`
        project-card relative group text-left
        h-full flex flex-col justify-between
        p-8 md:p-10
        bg-[#111111]
        border border-white/5
        ${!isComingSoon ? "hover:border-[#00BFA5]/30 cursor-pointer active:scale-[0.98]" : "border-dashed opacity-50 cursor-not-allowed"}
        transition-all duration-300 ease-out
      `}
      style={{ transform: "translateZ(0)" }}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((item) => (
              <TechBadge key={item} item={item} />
            ))}
          </div>
          {!isComingSoon && (
            <FiSearch className="text-[#A3A3A3] group-hover:text-[#00BFA5] transition-colors" />
          )}
        </div>

        <h3 className={`text-xl font-bold mb-4 tracking-tight ${!isComingSoon ? 'text-[#E0E0E0]' : 'text-[#A3A3A3]'}`}>
          {project.title}
        </h3>

        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-8 line-clamp-3 font-mono opacity-80 group-hover:opacity-100 transition-opacity">
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        {isComingSoon ? (
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500">
            <FiClock />
            <span>[ INITIALIZING... ]</span>
          </div>
        ) : (
          <span className="text-[10px] font-mono text-[#00BFA5] tracking-widest uppercase font-bold">
            [ ACCESS DEPLOYMENT ]
          </span>
        )}
        <span className="text-[10px] font-mono text-[#333] group-hover:text-[#666] transition-colors">
          {hexId}
        </span>
      </div>
    </button>
  );
});
ProjectCard.displayName = "ProjectCard";

export default function Projects() {
  const containerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });

      tl.fromTo(".projects-header",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(".project-card",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      className="w-full bg-[#0A0A0A] text-white px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t border-white/5"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="projects-header mb-20 text-center md:text-left">
          <p className="text-[#00BFA5] font-semibold uppercase tracking-[0.2em] text-sm mb-4">
            SYSTEM ARCHIVES
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-[#E0E0E0]">
            Deployed Modules
          </h2>
        </div>

        <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.title + index}
              project={project}
              onAccess={setSelectedProject}
            />
          ))}
        </div>
      </div>

      {selectedProject && (
        <MainframeModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function MainframeModal({ project, onClose }) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    // 1. Unified GSAP Entrance (Backdrop + Modal)
    const tl = gsap.timeline();
    
    tl.fromTo(backdropRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, ease: "none" }
    ).fromTo(modalRef.current,
      { opacity: 0, scale: 0.98, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power4.out" },
      "-=0.1"
    );

    // 2. High-Frequency GSAP Typing Engine (Smooth 120Hz compatible)
    const typingProxy = { length: 0 };
    const fullText = project.description;
    
    gsap.to(typingProxy, {
      length: fullText.length,
      duration: fullText.length * 0.012, // Dynamic speed based on length
      ease: "none",
      onUpdate: () => {
        setDisplayText(fullText.substring(0, Math.round(typingProxy.length)));
      },
      onComplete: () => setIsTypingComplete(true)
    });

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
      gsap.killTweensOf(typingProxy);
    };
  }, [project]);

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 lg:p-12 bg-black/95 transition-none"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-[#0D0D0D] border border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,1)]"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 bg-[#161616] border-b border-white/5">
          <div className="flex items-center gap-3">
            <FiTerminal className="text-[#00BFA5] animate-pulse" />
            <span className="font-mono text-[10px] text-[#A3A3A3] tracking-[0.3em] font-bold">
              [ ACCESSING_FILE: {project.title.substring(0, 15).toUpperCase()}... ]
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A3A3A3] hover:text-[#00BFA5] transition-colors p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-2">
            <div className="space-y-6">
              <div>
                <p className="text-[#00BFA5] font-mono text-[10px] uppercase tracking-widest mb-3 opacity-60 font-bold">[ IDENTIFIER ]</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E0E0E0] tracking-tight leading-tight">{project.title}</h3>
              </div>
              <div>
                <p className="text-[#00BFA5] font-mono text-[10px] uppercase tracking-wider mb-1 opacity-60 font-bold">[ ASSET_TYPE ]</p>
                <p className="text-white/90 font-mono text-sm tracking-wider uppercase">ARCHIVE_NODE // PRODUCTION</p>
              </div>
            </div>

            <div>
              <p className="text-[#00BFA5] font-mono text-[10px] uppercase tracking-widest mb-4 opacity-60 font-bold">[ SYSTEM_PROTOCOLS ]</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech.map(t => (
                  <TechBadge key={t} item={t} />
                ))}
              </div>
            </div>
          </div>

          {/* Console Area */}
          <div className="bg-[#050505] border border-white/5 p-6 md:p-10 font-mono text-sm leading-8 relative min-h-[120px]">
            <div className="absolute top-4 right-6 text-[10px] text-[#222] select-none uppercase tracking-widest">ENCRYPTION: 256_BIT</div>
            
            <div className="flex items-start gap-5">
              <span className="text-[#00BFA5] select-none text-xs font-bold pt-1">{">"}</span>
              <div className="text-[#A3A3A3] flex-1 whitespace-pre-wrap">
                {displayText}
                {!isTypingComplete && <span className="inline-block w-2.5 h-5 bg-[#00BFA5] animate-pulse ml-2 align-middle" />}
              </div>
            </div>

            {isTypingComplete && (
              <div className="mt-16 border-t border-white/5 pt-10">
                <p className="text-[#00BFA5] font-mono text-[10px] uppercase tracking-widest mb-8 font-bold opacity-60">[ EXTERNAL_UPLINKS ]</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.codeLink && <TerminalLink label="RECON SOURCE CODE" href={project.codeLink} />}
                  {project.codeLinkFrontend && <TerminalLink label="ACCESS INTERFACE" href={project.codeLinkFrontend} />}
                  {project.codeLinkBackend && <TerminalLink label="ACCESS SERVICES" href={project.codeLinkBackend} />}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center opacity-20 transition-opacity">
            <p className="text-[10px] font-mono text-[#444] tracking-[0.5em] uppercase">
              END OF FILE // SECURE_LOG_EXIT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalLink({ label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-5 bg-[#0F0F0F] border border-white/5 hover:border-[#00BFA5]/40 hover:bg-[#151515] transition-all duration-300"
    >
      <span className="text-[#A3A3A3] group-hover:text-[#00BFA5] transition-colors font-mono text-[10px] tracking-widest uppercase font-bold">
        {label}
      </span>
      <FiArrowUpRight className="text-[#333] group-hover:text-[#00BFA5] transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    </a>
  );
}
