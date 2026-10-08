import React from 'react';

export default function JourneyPathMap({ arcs, activeArcId, onSelectArc }) {
  return (
    <div className="journey-path-map-container" aria-label="Protagonist Progression Ink Path">
      <div className="path-top-bar">
        <div className="path-reg-left">
          <span className="path-kanji-stamp">行程図</span>
          <span className="path-reg-title">INK PROGRESSION PATH // CHRONOLOGICAL ARCS</span>
        </div>
        <span className="path-serial">FLOW: 2023 → 2026+</span>
      </div>

      {/* Main Interactive Brush Path Stage */}
      <div className="path-stage-viewport">
        {/* Washi Paper Background Texture */}
        <div className="path-washi-grid-bg" />

        {/* Dynamic Sumi-e Ink Brush Stroke Path */}
        <svg
          className="journey-brush-path-svg"
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Broad brush stroke shadow */}
          <path
            d="M 50 60 C 220 20, 360 100, 500 60 C 640 20, 780 90, 950 60"
            fill="none"
            stroke="rgba(17, 17, 22, 0.12)"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Main calligraphic ink line */}
          <path
            className="journey-main-ink-path"
            d="M 50 60 C 220 20, 360 100, 500 60 C 640 20, 780 90, 950 60"
            fill="none"
            stroke="#111116"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        </svg>

        {/* Four Experience Arc Nodes */}
        <div className="journey-nodes-track" role="tablist">
          {arcs.map((arc, idx) => {
            const isActive = activeArcId === arc.id;
            const isCurrent = arc.isCurrent;

            return (
              <button
                key={arc.id}
                role="tab"
                type="button"
                id={`arc-tab-${arc.id}`}
                aria-controls={`arc-panel-${arc.id}`}
                aria-selected={isActive}
                className={`journey-arc-node-btn node-${arc.id} ${isActive ? 'is-active' : ''} ${isCurrent ? 'is-current-arc' : ''}`}
                onClick={() => onSelectArc(arc.id)}
              >
                {/* Physical Node Pin */}
                <div className="node-pin-wrapper">
                  <div className="node-pin-dot">
                    <span className="pin-kanji">{arc.arcKanji}</span>
                  </div>
                  {isCurrent && <div className="node-current-pulse-ring" />}
                </div>

                {/* Node Label Block */}
                <div className="node-label-card">
                  <div className="node-header-row">
                    <span className="node-arc-num">ARC {arc.arcNumber}</span>
                    <span className="node-stage-badge">{arc.arcStage}</span>
                  </div>
                  <div className="node-role-title">{arc.role}</div>
                  <div className="node-org-name">{arc.organization}</div>
                  <div className="node-period-tag">{arc.period}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Path Bottom Prompt Bar */}
      <div className="path-footer-prompt-bar">
        <span className="path-hint-text">SELECT AN ARC TO ENGAGE STORY DETAILS</span>
        <span className="path-direction-marker">FOLLOW THE INK ➔</span>
      </div>
    </div>
  );
}
