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

// Memoized Project Card
const ProjectCard = memo(({ project, onAccess }) => {
  const isComingSoon = project.status?.toLowerCase() === "coming-soon";

  return (
    <button
      onClick={() => !isComingSoon && onAccess(project)}
      className={`
        project-card relative group text-left
        h-full flex flex-col justify-between
        p-8 md:p-10
        border
        rounded-md
        ${!isComingSoon ? "cursor-pointer active:scale-[0.98]" : "border-dashed opacity-50 cursor-not-allowed"}
        transition-all duration-300 ease-out
      `}
      style={{
        backgroundColor: "var(--bg-panel)",
        borderColor: isComingSoon ? "var(--border-subtle)" : "var(--border-subtle)",
        transform: "translateZ(0)"
      }}
      onMouseEnter={(e) => { if (!isComingSoon) e.currentTarget.style.borderColor = "var(--border-hover)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 3).map((item) => (
              <TechBadge key={item} item={item} />
            ))}
          </div>
          {!isComingSoon && (
            <FiSearch style={{ color: "var(--text-muted)" }} className="group-hover:text-[var(--accent)] transition-colors" />
          )}
        </div>

        <h3
          className="text-xl font-display font-bold mb-4 tracking-tight"
          style={{ color: !isComingSoon ? "var(--text-main)" : "var(--text-muted)" }}
        >
          {project.title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-8 line-clamp-3 font-body opacity-80 group-hover:opacity-100 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          {project.description}
        </p>
      </div>

      <div className="flex items-center justify-between border-t pt-6" style={{ borderColor: "var(--border-subtle)" }}>
        {isComingSoon ? (
          <div className="flex items-center gap-2 text-[10px] font-accent" style={{ color: "var(--text-ink)" }}>
            <FiClock />
            <span>[ FORGING... ]</span>
          </div>
        ) : (
          <span
            className="text-[10px] font-accent tracking-widest uppercase font-bold"
            style={{ color: "var(--accent)" }}
          >
            [ EXAMINE CRAFT ]
          </span>
        )}
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
      className="w-full px-6 md:px-12 py-24 sm:py-32 overflow-hidden border-t"
      style={{
        backgroundColor: "var(--bg-void)",
        color: "var(--text-main)",
        borderColor: "var(--border-subtle)"
      }}
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="projects-header mb-20 text-center md:text-left">
          <p
            className="font-accent font-semibold uppercase tracking-[0.2em] text-sm mb-4"
            style={{ color: "var(--accent)" }}
          >
            FORGED WORKS
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-6xl font-display font-extrabold tracking-tight"
            style={{ color: "var(--text-main)" }}
          >
            Crafted Creations
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
        <ScrollModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

/* ── Scroll Modal (replaces Mainframe Terminal) ── */
function ScrollModal({ project, onClose }) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const modalRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline();

    tl.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "none" }
    ).fromTo(modalRef.current,
      { opacity: 0, scale: 0.98, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power4.out" },
      "-=0.1"
    );

    // Typing effect — ink flowing onto paper
    const typingProxy = { length: 0 };
    const fullText = project.description;

    gsap.to(typingProxy, {
      length: fullText.length,
      duration: fullText.length * 0.012,
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
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8 lg:p-12 transition-none"
      style={{ backgroundColor: "rgba(12,10,9,0.95)" }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl border flex flex-col rounded-lg overflow-hidden"
        style={{
          backgroundColor: "var(--bg-panel)",
          borderColor: "var(--border-subtle)",
          boxShadow: "0 0 60px rgba(0,0,0,0.8)",
          transform: "translateZ(0)"
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span
              className="font-accent text-[10px] tracking-[0.3em] font-bold uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              [ READING SCROLL: {project.title.substring(0, 20).toUpperCase()}... ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="transition-colors p-1 rounded"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-12 overflow-y-auto max-h-[85vh] custom-scrollbar">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-2">
            <div className="space-y-6">
              <div>
                <p className="font-accent text-[10px] uppercase tracking-widest mb-3 opacity-60 font-bold" style={{ color: "var(--accent)" }}>[ TITLE ]</p>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight leading-tight" style={{ color: "var(--text-main)" }}>{project.title}</h3>
              </div>
            </div>

            <div>
              <p className="font-accent text-[10px] uppercase tracking-widest mb-4 opacity-60 font-bold" style={{ color: "var(--accent)" }}>[ DISCIPLINES USED ]</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tech.map(t => (
                  <TechBadge key={t} item={t} />
                ))}
              </div>
            </div>
          </div>

          {/* Description Area */}
          <div
            className="border p-6 md:p-10 font-body text-sm leading-8 relative min-h-[120px] rounded-md"
            style={{ backgroundColor: "var(--bg-void)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-start gap-5">
              <span className="select-none text-xs font-bold pt-1" style={{ color: "var(--accent)" }}>{">"}</span>
              <div className="flex-1 whitespace-pre-wrap" style={{ color: "var(--text-muted)" }}>
                {displayText}
                {!isTypingComplete && <span className="inline-block w-2.5 h-5 animate-pulse ml-2 align-middle rounded-sm" style={{ backgroundColor: "var(--accent)" }} />}
              </div>
            </div>

            {isTypingComplete && (
              <div className="mt-16 border-t pt-10" style={{ borderColor: "var(--border-subtle)" }}>
                <p className="font-accent text-[10px] uppercase tracking-widest mb-8 font-bold opacity-60" style={{ color: "var(--accent)" }}>[ PATHS ]</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.codeLink && <ScrollLink label="View the Blueprint" href={project.codeLink} />}
                  {project.codeLinkFrontend && <ScrollLink label="View the Interface" href={project.codeLinkFrontend} />}
                  {project.codeLinkBackend && <ScrollLink label="View the Foundation" href={project.codeLinkBackend} />}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 text-center opacity-20 transition-opacity">
            <p className="text-[10px] font-accent tracking-[0.5em] uppercase" style={{ color: "var(--text-ink)" }}>
              — End of Scroll —
            </p>
          </div>
        </div>
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
