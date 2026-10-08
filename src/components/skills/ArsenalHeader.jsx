import React from 'react';

export default function ArsenalHeader() {
  return (
    <header className="skills-editorial-header" aria-label="Chapter 03 Editorial Header">
      {/* Top Folio Bar */}
      <div className="skills-top-folio">
        <div className="skills-folio-left">
          <span className="skills-folio-tag">TANKŌBON VOL. 01</span>
          <span className="skills-folio-sep">/</span>
          <span className="skills-folio-chapter">第参話 // CHAPTER 03</span>
        </div>
        <div className="skills-folio-center">
          <span>TECHNICAL DOSSIER & ARSENAL // 武装展開</span>
        </div>
        <div className="skills-folio-right">
          <span className="skills-folio-page">P. 020-021</span>
          <span className="skills-folio-badge">SPEC NO. 03</span>
        </div>
      </div>

      {/* Chapter 03 Headline */}
      <div className="skills-chapter-headline">
        <div className="skills-chapter-badge">
          <span className="badge-kanji">参</span>
          <span className="badge-en">CHAPTER 03</span>
        </div>
        <div className="skills-title-group">
          <h2 className="skills-main-title">ARSENAL</h2>
          <div className="skills-japanese-accent">
            <span className="kanji-accent">武装展開 · 技術調書</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">BUSŌ TENKAI // WEAPONS OF CREATION</span>
          </div>
        </div>
      </div>
    </header>
  );
}
