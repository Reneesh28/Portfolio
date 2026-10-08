import React from 'react';

export default function EducationNavigationControls({
  educationList,
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex,
}) {
  return (
    <nav className="edu-navigation-controls" aria-label="Academic Records Navigation">
      {/* Upper Navigation Bar: Previous / Next & Volume Progress */}
      <div className="edu-nav-top-row">
        <button
          type="button"
          className="edu-nav-arrow-btn prev-btn"
          onClick={onPrev}
          aria-label="Previous Academic Record"
        >
          <span className="arrow-text">← PREVIOUS</span>
        </button>

        {/* Progress Counter & Dots Chain */}
        <div className="edu-nav-progress">
          <span className="edu-counter-text">
            {String(currentIndex + 1).padStart(2, '0')} / {String(educationList.length).padStart(2, '0')}
          </span>
          <div className="edu-dots-chain" aria-hidden="true">
            {educationList.map((edu, idx) => (
              <React.Fragment key={edu.degree}>
                <span className={`edu-dot ${idx === currentIndex ? 'is-active' : ''} ${idx < currentIndex ? 'is-past' : ''}`} />
                {idx < educationList.length - 1 && <span className="edu-chain-line" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="edu-nav-arrow-btn next-btn"
          onClick={onNext}
          aria-label="Next Academic Record"
        >
          <span className="arrow-text">NEXT →</span>
        </button>
      </div>

      {/* Direct Jump Tabs Track */}
      <div className="edu-nav-index-bar">
        <div className="edu-index-label">
          <span className="edu-index-kanji">目録</span>
          <span className="edu-index-title">ACADEMIC TIMELINE:</span>
        </div>

        <div className="edu-index-buttons-track" role="tablist">
          {educationList.map((edu, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={edu.degree}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={`edu-jump-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectIndex(idx)}
              >
                <span className="jump-num">0{idx + 1}</span>
                <span className="jump-title">{edu.degree.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Keyboard Helper Notice */}
      <div className="edu-keyboard-hint">
        <span>KEYBOARD CONTROLS: [ ← PREV ] [ → NEXT ]</span>
      </div>
    </nav>
  );
}
