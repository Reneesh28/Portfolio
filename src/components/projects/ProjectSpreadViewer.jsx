import React, { useState } from 'react';

export default function ProjectSpreadViewer({ project, onExploreProject }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!project) return null;

  return (
    <article className="project-spread-viewer" aria-label={`Project Spread: ${project.title}`}>
      {/* Left Page: Project Metadata, Volume Kicker & Description */}
      <div className="project-page-meta">
        <div className="project-volume-strip">
          <div className="volume-badge-group">
            <span className="volume-num-tag">{project.volume}</span>
            <span className="volume-kanji-stamp">{project.kanji}</span>
          </div>
          {project.featured && <span className="featured-work-badge">★ FEATURED WORK</span>}
        </div>

        <div className="project-title-block">
          <h3 className="project-headline">{project.title}</h3>
          <p className="project-sub-headline">{project.subtitle}</p>
        </div>

        {/* Status & Role Editorial Strip */}
        <div className="project-editorial-meta-strip">
          <div className="meta-item">
            <span className="meta-label">STATUS</span>
            <span className="meta-val status-val">{project.status}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">ROLE</span>
            <span className="meta-val">{project.role}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">YEAR</span>
            <span className="meta-val">{project.year}</span>
          </div>
        </div>

        {/* Short Factual Description */}
        <p className="project-brief-paragraph">{project.description}</p>

        {/* Technologies Arsenal Chips */}
        <div className="project-tech-arsenal-block">
          <span className="arsenal-label">TECHNICAL POWERS</span>
          <div className="tech-chips-list">
            {project.technologies.map((t) => (
              <span key={t} className="tech-chip-item">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Explore CTA Button */}
        <div className="project-action-cta-row">
          <button
            type="button"
            className="project-explore-btn"
            onClick={onExploreProject}
            aria-label={`Explore Case Study for ${project.title}`}
          >
            <span className="btn-kanji">展開</span>
            <span className="btn-text">EXPLORE PROJECT →</span>
          </button>
        </div>
      </div>

      {/* Right Page: Dominant Manga Cover Artwork Frame */}
      <div className="project-page-art">
        <div
          className="project-artwork-card"
          onClick={onExploreProject}
          role="button"
          tabIndex={0}
          aria-label={`Open cover artwork for ${project.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onExploreProject();
            }
          }}
        >
          <div className="artwork-top-bar">
            <div className="art-label-left">
              <span className="art-kanji-tag">表紙</span>
              <span className="art-label-text">ANTHOLOGY COVER // {project.volume}</span>
            </div>
            <span className="art-reg-num">SPEC: #{project.number}</span>
          </div>

          <div className="project-art-viewport">
            <img
              src={project.image}
              alt={`${project.title} manga world illustration`}
              className={`project-cover-img ${imageLoaded ? 'is-loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
              loading="eager"
            />
            <div className="project-screentone-overlay" />
            <div className="project-vignette-overlay" />

            {/* Manga Sound Effect Stamp */}
            {project.sfx && (
              <div className="project-manga-sfx" title={project.sfxMeaning} aria-hidden="true">
                <span>{project.sfx}</span>
              </div>
            )}

            {/* Prompt to Enter */}
            <div className="project-enter-hint">
              <span>ENTER THE WORLD 🔍</span>
            </div>
          </div>

          <div className="artwork-bottom-bar">
            <span className="art-bottom-category">{project.category}</span>
            <span className="art-bottom-prompt">CLICK TO OPEN CASE STUDY ➔</span>
          </div>
        </div>
      </div>
    </article>
  );
}
