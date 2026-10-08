import React from 'react';

export default function JourneyHeader() {
  return (
    <header className="journey-editorial-header" aria-label="Chapter 04 Editorial Header">
      {/* Top Folio Bar */}
      <div className="journey-top-folio">
        <div className="journey-folio-left">
          <span className="journey-folio-tag">TANKŌBON VOL. 01</span>
          <span className="journey-folio-sep">/</span>
          <span className="journey-folio-chapter">第四話 // CHAPTER 04</span>
        </div>
        <div className="journey-folio-center">
          <span>CHRONICLES OF GROWTH & EXPERIENCE // 軌跡・旅路</span>
        </div>
        <div className="journey-folio-right">
          <span className="journey-folio-page">P. 022-023</span>
          <span className="journey-folio-badge">CHRONICLE 04</span>
        </div>
      </div>

      {/* Chapter 04 Headline */}
      <div className="journey-chapter-headline">
        <div className="journey-chapter-badge">
          <span className="badge-kanji">四</span>
          <span className="badge-en">CHAPTER 04</span>
        </div>
        <div className="journey-title-group">
          <h2 className="journey-main-title">JOURNEY</h2>
          <div className="journey-japanese-accent">
            <span className="kanji-accent">軌跡 · 成長の旅路</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">TABIJI // HOW THE PROTAGONIST DEVELOPED</span>
          </div>
        </div>
      </div>
    </header>
  );
}
