import { useEffect, useRef, useState, useMemo, memo } from "react";
import projects from "../data/projects";
import { FiClock, FiArrowUpRight, FiSearch, FiX } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "../components/ui/Badge";

gsap.registerPlugin(ScrollTrigger);

// Memoized Tech Badge
const TechBadge = memo(({ item }) => (
  <Badge variant="accent" className="text-[10px] py-0 px-2 whitespace-nowrap" style={{ backgroundColor: "var(--bg-panel)", borderColor: "var(--border-subtle)" }}>
    {item}
  </Badge>
));
TechBadge.displayName = "TechBadge";

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
      className="w-full px-6 md:px-12 py-32 overflow-hidden border-t washi-texture"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Background Watermark */}
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none select-none hidden lg:block">
          <span className="font-display text-[20vw]" style={{ writingMode: 'vertical-rl' }}>傑作</span>
        </div>

        <div className="projects-header mb-32 flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-[1px] bg-[var(--accent)]" />
            <p className="font-accent font-semibold uppercase tracking-[0.4em] text-xs text-[var(--accent)]">
              The Masterpieces
            </p>
          </div>
          <h2 className="font-display text-4xl md:text-7xl font-bold text-[var(--text-main)] leading-tight">
            Forged in the <br />
            <span className="italic text-[var(--text-muted)]">Fires of Code</span>.
          </h2>
        </div>

        <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
        <ScrollModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

// Updated Project Card
const ProjectCard = memo(({ project, onAccess }) => {
  const isComingSoon = project.status?.toLowerCase() === "coming-soon";

  return (
    <button
      onClick={() => !isComingSoon && onAccess(project)}
      className={`
        project-card relative group text-left
        h-full flex flex-col justify-between
        p-10
        border bg-[var(--bg-panel)]
        rounded-sm
        ${!isComingSoon ? "cursor-pointer" : "border-dashed opacity-50 cursor-not-allowed"}
        transition-all duration-500
      `}
      style={{
        borderColor: "var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        if (!isComingSoon) {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.transform = "translateY(-8px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Tactical Corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((item) => (
              <span key={item} className="font-accent text-[9px] tracking-widest uppercase px-2 py-1 border border-[var(--border-subtle)] text-[var(--text-ink)] bg-[var(--bg-void)]">
                {item}
              </span>
            ))}
          </div>
          {!isComingSoon && (
            <FiSearch className="text-[var(--text-ink)] group-hover:text-[var(--accent)] transition-colors" size={18} />
          )}
        </div>

        <h3
          className="text-2xl md:text-3xl font-display font-bold mb-6 tracking-tight text-[var(--text-main)]"
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-12 font-body text-[var(--text-muted)] opacity-80 group-hover:opacity-100 transition-opacity line-clamp-3"
        >
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t pt-8" style={{ borderColor: "var(--border-subtle)" }}>
        {isComingSoon ? (
          <div className="flex items-center gap-3 text-[10px] font-accent text-[var(--text-ink)]">
            <FiClock />
            <span className="tracking-[0.3em] uppercase">[ Forging... ]</span>
          </div>
        ) : (
          <span
            className="text-[10px] font-accent tracking-[0.4em] uppercase font-bold text-[var(--accent)]"
          >
            Examine Craft
          </span>
        )}
      </div>
    </button>
  );
});
ProjectCard.displayName = "ProjectCard";

function ScrollModal({ project, onClose }) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(modalRef.current, { opacity: 0, y: 50, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power4.out" });

    const fullText = project.description;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [project]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[var(--bg-void)]/95 backdrop-blur-md" />

      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl h-full max-h-[90vh] border border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col rounded-sm overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-subtle)] flex justify-between items-center bg-[var(--bg-surface)]">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-[var(--accent)] animate-pulse" />
            <span className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--text-ink)]">
              Tactical Analysis // {project.title}
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-ink)] hover:text-[var(--accent)] transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
          <div className="grid lg:grid-cols-3 gap-16">

            {/* Left: Metadata */}
            <div className="space-y-12">
              <div>
                <h4 className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] mb-4">Objective</h4>
                <h3 className="font-display text-3xl font-bold text-[var(--text-main)]">{project.title}</h3>
              </div>

              <div>
                <h4 className="font-accent text-[10px] tracking-[0.4em] uppercase text-[var(--accent)] mb-6">Components</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="font-accent text-[9px] tracking-widest uppercase px-3 py-1.5 border border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-void)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Center & Right: Description & Links */}
            <div className="lg:col-span-2 space-y-16">
              <div className="relative p-8 border border-[var(--border-subtle)] bg-[var(--bg-void)] rounded-sm">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--accent)]" />
                <p className="font-body text-lg leading-relaxed text-[var(--text-muted)] min-h-[100px]">
                  {displayText}
                  {!isTypingComplete && <span className="inline-block w-1.5 h-5 bg-[var(--accent)] ml-2 animate-pulse" />}
                </p>
              </div>

              {isTypingComplete && (
                <div className="grid md:grid-cols-2 gap-6">
                  {project.codeLink && <ScrollLink label="Blueprint" href={project.codeLink} />}
                  {project.codeLinkFrontend && <ScrollLink label="Interface" href={project.codeLinkFrontend} />}
                  {project.codeLinkBackend && <ScrollLink label="Foundation" href={project.codeLinkBackend} />}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Decoration */}
        <div className="h-2 bg-gradient-to-r from-transparent via-[var(--accent)]/20 to-transparent" />
      </div>
    </div>
  );
}

function ScrollLink({ label, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-5 border transition-all duration-300 rounded-md"
      style={{
        backgroundColor: "var(--bg-void)",
        borderColor: "var(--border-subtle)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
      }}
    >
      <span
        className="font-accent text-[10px] tracking-widest uppercase font-bold transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <FiArrowUpRight
        className="transition-all transform group-hover:translate-x-1 group-hover:-translate-y-1"
        style={{ color: "var(--text-ink)" }}
      />
    </a>
  );
}
