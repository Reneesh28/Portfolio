import React from 'react';

export default function ArsenalTransitionFooter() {
  const handleScrollToSkills = () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="about-transition-footer" aria-label="Transition to Chapter 03 Arsenal">
      {/* Manga Page Turn Divider */}
      <div className="page-turn-gutter">
        <div className="gutter-line-left" />
        <div className="gutter-center-stamp">
          <span className="gutter-kanji">次章予告</span>
          <span className="gutter-en">PAGE TURN // NEXT CHAPTER</span>
        </div>
        <div className="gutter-line-right" />
      </div>

      {/* Chapter 03 Teaser Spread Card */}
      <div className="chapter-next-teaser-card">
        <div className="teaser-left-meta">
          <div className="teaser-chapter-badge">
            <span className="badge-kanji">参</span>
            <span className="badge-en">CHAPTER 03</span>
          </div>
          <h3 className="teaser-title">ARSENAL</h3>
          <p className="teaser-sub-text">
            ABILITIES / TOOLS / TECHNOLOGY / WEAPONS OF CREATION
          </p>
        </div>

        <div className="teaser-right-action">
          <button
            type="button"
            className="about-manga-cta-btn"
            onClick={handleScrollToSkills}
            aria-label="Proceed to Chapter 03: Arsenal (Skills Section)"
          >
            <span className="btn-jp">武装展開</span>
            <span className="btn-text">VIEW ARSENAL →</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
