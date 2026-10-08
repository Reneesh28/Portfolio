import React, { useEffect } from 'react';

export default function ProjectCaseStudyModal({ project, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div
      className="project-case-study-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} Case Study Volume`}
    >
      <div
        className="project-case-study-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Folio Bar */}
        <div className="case-study-folio-bar">
          <div className="folio-left-group">
            <span className="case-kanji">{project.kanji}</span>
            <span className="case-vol">{project.volume} // DEEP CASE STUDY</span>
          </div>
          <button
            type="button"
            className="case-close-btn"
            onClick={onClose}
            aria-label="Close Case Study and Return to Anthology"
          >
            RETURN TO ANTHOLOGY ✕
          </button>
        </div>

        {/* Scrollable Content Viewport */}
        <div className="case-study-content-viewport">
          {/* Top Headline */}
          <div className="case-headline-section">
            <div className="case-badge-row">
              <span className="case-category-pill">{project.category}</span>
              <span className="case-status-pill">{project.status}</span>
            </div>
            <h3 className="case-title">{project.title}</h3>
            <p className="case-subtitle">{project.subtitle}</p>
          </div>

          {/* Section 01: The Idea & Overview */}
          <div className="case-section-block">
            <div className="case-section-header">
              <span className="section-kanji">概要</span>
              <h4 className="section-title">THE IDEA & OVERVIEW</h4>
            </div>
            <p className="case-body-text">{project.overview}</p>
          </div>

          {/* Section 02: Miniature System Architecture Diagram */}
          {project.architecture && (
            <div className="case-section-block">
              <div className="case-section-header">
                <span className="section-kanji">構成</span>
                <h4 className="section-title">SYSTEM ARCHITECTURE & DATA FLOW</h4>
              </div>

              <div className="case-architecture-flow-diagram">
                {project.architecture.map((step, idx) => (
                  <React.Fragment key={step.node}>
                    <div className="arch-node-box">
                      <span className="arch-node-step">0{idx + 1}</span>
                      <div className="arch-node-title">{step.node}</div>
                      <div className="arch-node-sub">{step.sub}</div>
                    </div>
                    {idx < project.architecture.length - 1 && (
                      <div className="arch-flow-arrow" aria-hidden="true">
                        ➔
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Section 03: Technology Stack */}
          <div className="case-section-block">
            <div className="case-section-header">
              <span className="section-kanji">武装</span>
              <h4 className="section-title">TECHNOLOGY ARSENAL</h4>
            </div>
            <div className="case-tech-pills-list">
              {project.technologies.map((tech) => (
                <span key={tech} className="case-tech-chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Section 04: Real Outcome & Impact */}
          <div className="case-section-block">
            <div className="case-section-header">
              <span className="section-kanji">成果</span>
              <h4 className="section-title">ENGINEERING OUTCOME & IMPACT</h4>
            </div>
            <p className="case-body-text">{project.impact}</p>
          </div>

          {/* Section 05: Action Links (GitHub, Demo, etc.) */}
          <div className="case-actions-toolbar">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="case-action-btn primary-action"
              >
                <span className="btn-kanji">原典</span>
                <span className="btn-text">READ SOURCE (GITHUB) ↗</span>
              </a>
            )}

            {project.githubFrontend && (
              <a
                href={project.githubFrontend}
                target="_blank"
                rel="noreferrer"
                className="case-action-btn primary-action"
              >
                <span className="btn-kanji">表層</span>
                <span className="btn-text">FRONTEND SOURCE ↗</span>
              </a>
            )}

            {project.githubBackend && (
              <a
                href={project.githubBackend}
                target="_blank"
                rel="noreferrer"
                className="case-action-btn secondary-action"
              >
                <span className="btn-kanji">基幹</span>
                <span className="btn-text">BACKEND SOURCE ↗</span>
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="case-action-btn live-action"
              >
                <span className="btn-kanji">稼働</span>
                <span className="btn-text">ENTER LIVE UNIVERSE ↗</span>
              </a>
            )}

            <button
              type="button"
              className="case-action-btn return-action"
              onClick={onClose}
            >
              RETURN TO ANTHOLOGY ↩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
