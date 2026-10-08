import React from 'react';

export default function ProjectNavigationControls({
  projects,
  currentIndex,
  onPrev,
  onNext,
  onSelectIndex,
}) {
  const currentProject = projects[currentIndex];

  return (
    <nav className="project-navigation-controls" aria-label="Anthology Volume Navigation">
      {/* Upper Navigation Bar: Previous / Next & Volume Progress */}
      <div className="nav-controls-top-row">
        <button
          type="button"
          className="nav-arrow-btn prev-btn"
          onClick={onPrev}
          aria-label="Previous Project Volume"
        >
          <span className="arrow-text">← PREVIOUS</span>
        </button>

        {/* Volume Progress Indicator */}
        <div className="nav-volume-progress">
          <span className="vol-counter-text">
            {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
          <div className="vol-dots-chain" aria-hidden="true">
            {projects.map((p, idx) => (
              <React.Fragment key={p.id}>
                <span className={`vol-dot ${idx === currentIndex ? 'is-active' : ''} ${idx < currentIndex ? 'is-past' : ''}`} />
                {idx < projects.length - 1 && <span className="vol-chain-line" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="nav-arrow-btn next-btn"
          onClick={onNext}
          aria-label="Next Project Volume"
        >
          <span className="arrow-text">NEXT →</span>
        </button>
      </div>

      {/* Compact Project Direct Jump Index */}
      <div className="nav-project-index-bar">
        <div className="index-label">
          <span className="index-kanji">目録</span>
          <span className="index-title">ANTHOLOGY INDEX:</span>
        </div>

        <div className="index-buttons-track" role="tablist">
          {projects.map((proj, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={proj.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                className={`index-jump-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onSelectIndex(idx)}
              >
                <span className="jump-num">{proj.number}</span>
                <span className="jump-title">{proj.title.split(' - ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Keyboard Helper Notice */}
      <div className="nav-keyboard-hint">
        <span>KEYBOARD CONTROLS: [ ← PREV ] [ → NEXT ] [ ENTER: EXPLORE ] [ ESC: RETURN ]</span>
      </div>
    </nav>
  );
}
