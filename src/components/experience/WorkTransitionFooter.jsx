import React from 'react';

export default function WorkTransitionFooter() {
  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="journey-transition-footer" aria-label="Transition to Chapter 05 The Work">
      {/* Manga Page Turn Divider */}
      <div className="page-turn-gutter">
        <div className="gutter-line-left" />
        <div className="gutter-center-stamp">
          <span className="gutter-kanji">次章予告</span>
          <span className="gutter-en">PAGE TURN // NEXT MAJOR ARCS</span>
        </div>
        <div className="gutter-line-right" />
      </div>

      {/* Chapter 05 Teaser Spread Card */}
      <div className="chapter-next-teaser-card">
        <div className="teaser-left-meta">
          <div className="teaser-chapter-badge">
            <span className="badge-kanji">五</span>
            <span className="badge-en">CHAPTER 05</span>
          </div>
          <h3 className="teaser-title">THE WORK</h3>
          <p className="teaser-sub-text">
            MAJOR ARCS / PRODUCTION ARTIFACTS / REAL-WORLD SYSTEMS
          </p>
        </div>

        <div className="teaser-right-action">
          <button
            type="button"
            className="journey-manga-cta-btn"
            onClick={handleScrollToProjects}
            aria-label="Proceed to Chapter 05: The Work (Projects Section)"
          >
            <span className="btn-jp">実戦記録</span>
            <span className="btn-text">VIEW THE WORK →</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
