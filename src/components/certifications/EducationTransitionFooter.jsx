import React from 'react';

export default function EducationTransitionFooter() {
  const handleScrollToEducation = () => {
    const eduSection = document.getElementById('education');
    if (eduSection) {
      eduSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="cert-transition-footer" aria-label="Transition to Chapter 07 Education">
      {/* Manga Page Turn Divider */}
      <div className="page-turn-gutter">
        <div className="gutter-line-left" />
        <div className="gutter-center-stamp">
          <span className="gutter-kanji">次章予告</span>
          <span className="gutter-en">PAGE TURN // NEXT CHAPTER</span>
        </div>
        <div className="gutter-line-right" />
      </div>

      {/* Chapter 07 Teaser Spread Card */}
      <div className="chapter-next-teaser-card">
        <div className="teaser-left-meta">
          <div className="teaser-chapter-badge">
            <span className="badge-kanji">七</span>
            <span className="badge-en">CHAPTER 07</span>
          </div>
          <h3 className="teaser-title">ACADEMIC FOUNDATION</h3>
          <p className="teaser-sub-text">
            ORIGIN RECORDS / TRAINING GROUNDS / SCHOLASTIC ROOTS
          </p>
        </div>

        <div className="teaser-right-action">
          <button
            type="button"
            className="cert-manga-cta-btn"
            onClick={handleScrollToEducation}
            aria-label="Proceed to Chapter 07: Education Section"
          >
            <span className="btn-jp">記録展開</span>
            <span className="btn-text">INSPECT ORIGINS →</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
