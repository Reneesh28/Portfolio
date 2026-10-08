import React from 'react';

export default function VolumeEndSeal() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="volume-end-seal-container" aria-label="End of Volume 01 Seal">
      <div className="end-seal-divider">
        <div className="seal-line-left" />
        <div className="seal-center-badge">
          <span className="seal-kanji">完</span>
          <span className="seal-en">TANKŌBON VOL. 01 COMPLETE</span>
        </div>
        <div className="seal-line-right" />
      </div>

      <div className="end-seal-content-card">
        <div className="seal-card-left">
          <h3 className="seal-main-headline">ACROSS THE CODEVERSE</h3>
          <p className="seal-sub-paragraph">
            ALL 8 CHAPTERS EXPLORED. THE STORY CONTINUES WITH YOUR TRANSMISSION.
          </p>
        </div>

        <div className="seal-card-right">
          <button
            type="button"
            className="return-to-cover-btn"
            onClick={scrollToTop}
            aria-label="Return to Chapter 01 Cover"
          >
            <span className="btn-kanji">表紙</span>
            <span className="btn-text">RETURN TO COVER ↑</span>
          </button>
        </div>
      </div>
    </div>
  );
}
