import React from 'react';

export default function ContactTransitionFooter() {
  const handleScrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="edu-transition-footer" aria-label="Transition to Chapter 08 Contact">
      {/* Manga Page Turn Divider */}
      <div className="page-turn-gutter">
        <div className="gutter-line-left" />
        <div className="gutter-center-stamp">
          <span className="gutter-kanji">次章予告</span>
          <span className="gutter-en">PAGE TURN // NEXT CHAPTER</span>
        </div>
        <div className="gutter-line-right" />
      </div>

      {/* Chapter 08 Teaser Spread Card */}
      <div className="chapter-next-teaser-card">
        <div className="teaser-left-meta">
          <div className="teaser-chapter-badge">
            <span className="badge-kanji">八</span>
            <span className="badge-en">CHAPTER 08</span>
          </div>
          <h3 className="teaser-title">DIRECT TRANSMISSION</h3>
          <p className="teaser-sub-text">
            COMMUNICATIONS / COLLABORATION / OPEN FREQUENCIES
          </p>
        </div>

        <div className="teaser-right-action">
          <button
            type="button"
            className="edu-manga-cta-btn"
            onClick={handleScrollToContact}
            aria-label="Proceed to Chapter 08: Contact Section"
          >
            <span className="btn-jp">通信回線</span>
            <span className="btn-text">OPEN TRANSMISSION →</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
