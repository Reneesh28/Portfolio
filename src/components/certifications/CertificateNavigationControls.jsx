import React from 'react';

export default function CertificateNavigationControls({
  certifications,
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex,
}) {
  return (
    <nav className="cert-navigation-controls" aria-label="Credentials Scroll Navigation">
      {/* Upper Navigation Bar: Previous / Next & Volume Progress */}
      <div className="cert-nav-top-row">
        <button
          type="button"
          className="cert-nav-arrow-btn prev-btn"
          onClick={onPrev}
          aria-label="Previous Certificate Scroll"
        >
          <span className="arrow-text">← PREVIOUS</span>
        </button>

        {/* Progress Counter & Dots Chain */}
        <div className="cert-nav-progress">
          <span className="cert-counter-text">
            {String(currentIndex + 1).padStart(2, '0')} / {String(certifications.length).padStart(2, '0')}
          </span>
          <div className="cert-dots-chain" aria-hidden="true">
            {certifications.map((c, idx) => (
              <React.Fragment key={c.title}>
                <span className={`cert-dot ${idx === currentIndex ? 'is-active' : ''} ${idx < currentIndex ? 'is-past' : ''}`} />
                {idx < certifications.length - 1 && <span className="cert-chain-line" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="cert-nav-arrow-btn next-btn"
          onClick={onNext}
          aria-label="Next Certificate Scroll"
        >
          <span className="arrow-text">NEXT →</span>
        </button>
      </div>

      {/* Direct Jump Index Track */}
      <div className="cert-nav-index-bar">
        <div className="cert-index-label">
          <span className="cert-index-kanji">目録</span>
          <span className="cert-index-title">CREDENTIAL INDEX:</span>
        </div>

        <div className="cert-index-buttons-track" role="tablist">
          {certifications.map((cert, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={cert.title}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={`cert-jump-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectIndex(idx)}
              >
                <span className="jump-num">0{idx + 1}</span>
                <span className="jump-title">{cert.issuer.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Keyboard Helper Notice */}
      <div className="cert-keyboard-hint">
        <span>KEYBOARD CONTROLS: [ ← PREV ] [ → NEXT ] [ ENTER: EXAMINE ] [ ESC: RETURN ]</span>
      </div>
    </nav>
  );
}
