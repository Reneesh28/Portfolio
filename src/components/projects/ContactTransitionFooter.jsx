import React from 'react';

export default function ContactTransitionFooter() {
  const handleScrollToCertifications = () => {
    const certSection = document.getElementById('certifications');
    if (certSection) {
      certSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="projects-transition-footer" aria-label="Transition to Chapter 06 Credentials">
      {/* Manga Page Turn Divider */}
      <div className="page-turn-gutter">
        <div className="gutter-line-left" />
        <div className="gutter-center-stamp">
          <span className="gutter-kanji">次章予告</span>
          <span className="gutter-en">PAGE TURN // NEXT CHAPTER</span>
        </div>
        <div className="gutter-line-right" />
      </div>

      {/* Chapter 06 Teaser Spread Card */}
      <div className="chapter-next-teaser-card">
        <div className="teaser-left-meta">
          <div className="teaser-chapter-badge">
            <span className="badge-kanji">六</span>
            <span className="badge-en">CHAPTER 06</span>
          </div>
          <h3 className="teaser-title">CREDENTIALS</h3>
          <p className="teaser-sub-text">
            VERIFIED SCROLLS / LICENSES / PROVEN ACCREDITATION
          </p>
        </div>

        <div className="teaser-right-action">
          <button
            type="button"
            className="projects-manga-cta-btn"
            onClick={handleScrollToCertifications}
            aria-label="Proceed to Chapter 06: Certifications Section"
          >
            <span className="btn-jp">免状確認</span>
            <span className="btn-text">INSPECT SCROLLS →</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
