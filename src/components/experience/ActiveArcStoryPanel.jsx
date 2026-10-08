import React from 'react';

export default function ActiveArcStoryPanel({ arc }) {
  if (!arc) return null;

  return (
    <div
      id={`arc-panel-${arc.id}`}
      role="tabpanel"
      aria-labelledby={`arc-tab-${arc.id}`}
      className={`active-arc-story-panel ${arc.isCurrent ? 'is-current-panel' : ''}`}
    >
      {/* Top Banner & Serial Registration */}
      <div className="arc-panel-top-banner">
        <div className="arc-banner-left">
          <span className="arc-stage-kanji">{arc.arcKanji}</span>
          <span className="arc-stage-name">ARC {arc.arcNumber} // {arc.arcStage}</span>
        </div>
        <div className="arc-banner-right">
          <span className="arc-status-stamp">{arc.status}</span>
        </div>
      </div>

      {/* Main Story Panel Body */}
      <div className="arc-panel-body-grid">
        {/* Layer 01 & 02: Role & Organization Header */}
        <div className="arc-main-role-header">
          <div className="arc-env-kicker">
            <span>ENVIRONMENT // {arc.environment}</span>
          </div>

          <h3 className="arc-role-title">{arc.role}</h3>

          <div className="arc-org-strip">
            <span className="org-bullet">◆</span>
            <span className="org-name-text">{arc.organization}</span>
            <span className="org-period-text">[{arc.period}]</span>
          </div>
        </div>

        {/* Layer 04: Contribution Narrative & Impact */}
        <div className="arc-narrative-block">
          <div className="narrative-section-label">
            <span className="label-kanji">記録</span>
            <span className="label-text">CHRONICLE & CONTRIBUTION</span>
          </div>

          <p className="arc-narrative-text">{arc.narrative}</p>

          <div className="arc-impact-highlight">
            <span className="impact-badge">OUTCOME & IMPACT</span>
            <p className="impact-text">{arc.impact}</p>
          </div>
        </div>

        {/* Technical Focus & Toolkit */}
        <div className="arc-toolkit-block">
          <div className="toolkit-section-label">
            <span className="label-kanji">技術</span>
            <span className="label-text">TECHNICAL FOCUS & METHODS</span>
          </div>

          <div className="arc-focus-chips-list">
            {arc.focus.map((f) => (
              <span key={f} className="focus-chip">
                {f}
              </span>
            ))}
          </div>

          <div className="arc-tools-chips-list">
            {arc.tools.map((t) => (
              <span key={t} className="tool-chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Special Layer: Leadership Progression Ladder (If present) */}
        {arc.progression && (
          <div className="arc-progression-ladder-block">
            <div className="ladder-header">
              <span className="ladder-kanji">昇格</span>
              <span className="ladder-title">ORGANIZATIONAL PROGRESSION TIMELINE</span>
            </div>

            <div className="ladder-steps-grid">
              {arc.progression.map((step) => (
                <div key={step.step} className="ladder-step-card">
                  <div className="step-num-badge">{step.step}</div>
                  <div className="step-title-text">{step.title}</div>
                  <div className="step-year-tag">{step.year}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Special Layer: Current Arc Ongoing Vision (If present) */}
        {arc.isCurrent && (
          <div className="arc-current-vision-block">
            <div className="vision-header">
              <span className="vision-kanji">未完</span>
              <span className="vision-title">THE STORY IS STILL BEING WRITTEN</span>
            </div>
            <p className="vision-text">
              “Continuously iterating across intelligent architectures, creative simulations, and real-world software products. The journey moves forward with relentless curiosity and dedication to craft mastery.”
            </p>
          </div>
        )}
      </div>

      {/* Panel Bottom Folio Registration */}
      <div className="arc-panel-bottom-folio">
        <span className="folio-chapter-sign">CHRONICLE ARCHIVE // VOL. 01</span>
        <span className="folio-auth-sign">VERIFIED HISTORY OF CRAFT</span>
      </div>
    </div>
  );
}
