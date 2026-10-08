import React from 'react';

export default function ProjectsHeader() {
  return (
    <header className="projects-editorial-header" aria-label="Chapter 05 Editorial Header">
      {/* Top Folio Bar */}
      <div className="projects-top-folio">
        <div className="projects-folio-left">
          <span className="projects-folio-tag">TANKŌBON VOL. 01</span>
          <span className="projects-folio-sep">/</span>
          <span className="projects-folio-chapter">第五話 // CHAPTER 05</span>
        </div>
        <div className="projects-folio-center">
          <span>MANGA ANTHOLOGY OF CREATIONS & BUILDS // 作品集</span>
        </div>
        <div className="projects-folio-right">
          <span className="projects-folio-page">P. 024-025</span>
          <span className="projects-folio-badge">VOL. 05</span>
        </div>
      </div>

      {/* Chapter 05 Headline */}
      <div className="projects-chapter-headline">
        <div className="projects-chapter-badge">
          <span className="badge-kanji">五</span>
          <span className="badge-en">CHAPTER 05</span>
        </div>
        <div className="projects-title-group">
          <h2 className="projects-main-title">THE WORK</h2>
          <div className="projects-japanese-accent">
            <span className="kanji-accent">実戦記録 · 作品集</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">MAJOR ARCS / PRODUCTION ARTIFACTS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
