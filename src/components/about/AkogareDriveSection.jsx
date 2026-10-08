import React, { useState } from 'react';

export default function AkogareDriveSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section 
      className={`about-akogare-section ${isExpanded ? 'is-expanded' : ''}`}
      aria-label="Character Motivation and Philosophy"
    >
      {/* Generous Washi Paper Negative Space Container */}
      <div className="akogare-negative-space-wrapper">
        <div className="akogare-screentone-subtle" />

        {/* Top Minimalist Editorial Indicator */}
        <div className="akogare-indicator-top">
          <span className="indicator-kanji">原動力</span>
          <span className="indicator-line" />
          <span className="indicator-en">THE INTERNAL DRIVE // CORE PHILOSOPHY</span>
        </div>

        {/* Central Calligraphic Stage */}
        <div 
          className="akogare-center-stage"
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label="Toggle Akogare Philosophy Exploration"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {/* Giant Brush Mark 憧れ */}
          <div className="akogare-giant-kanji-wrap">
            <h3 className="akogare-giant-glyph">憧れ</h3>
          </div>

          <div className="akogare-romaji-headline">
            <span className="romaji-text">AKOGARE</span>
          </div>

          <div className="akogare-subtitle-badge">
            <span>ASPIRATION · YEARNING FOR MASTERY</span>
          </div>

          <div className="akogare-interactive-hint">
            <span>{isExpanded ? 'CLICK TO CLOSE ARCHIVE ✕' : 'CLICK TO REVEAL INTERNAL ENGINE ✦'}</span>
          </div>
        </div>

        {/* Expanded Philosophical Statement */}
        <div className={`akogare-statement-reveal ${isExpanded ? 'is-visible' : ''}`}>
          <div className="akogare-statement-card">
            <div className="statement-card-header">
              <span className="statement-badge">PHILOSOPHICAL ANCHOR</span>
              <span className="statement-quote-symbol">“</span>
            </div>

            <p className="statement-body-text">
              In Japanese manga philosophy, every enduring protagonist is propelled by an innate, quiet aspiration—<strong>憧れ (Akogare)</strong>. It is not the pursuit of empty accolades, but an unrelenting yearning to master the craft: to engineer systems that run with elegance, to forge worlds that spark imagination, and to turn raw curiosity into enduring software.
            </p>

            <div className="statement-footer-signature">
              <span className="sig-kanji">一匹狼の道</span>
              <span className="sig-name">BALAM RENEESH</span>
              <span className="sig-year">2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
