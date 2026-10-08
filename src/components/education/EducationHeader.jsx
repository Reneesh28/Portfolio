import React from 'react';

export default function EducationHeader() {
  return (
    <header className="edu-editorial-header" aria-label="Chapter 07 Editorial Header">
      {/* Top Folio Bar */}
      <div className="edu-top-folio">
        <div className="edu-folio-left">
          <span className="edu-folio-tag">TANKŌBON VOL. 01</span>
          <span className="edu-folio-sep">/</span>
          <span className="edu-folio-chapter">第七話 // CHAPTER 07</span>
        </div>
        <div className="edu-folio-center">
          <span>ORIGIN RECORDS & TRAINING GROUNDS // 修学記録・学問の礎</span>
        </div>
        <div className="edu-folio-right">
          <span className="edu-folio-page">P. 028-029</span>
          <span className="edu-folio-badge">VOL. 07</span>
        </div>
      </div>

      {/* Chapter 07 Headline */}
      <div className="edu-chapter-headline">
        <div className="edu-chapter-badge">
          <span className="badge-kanji">七</span>
          <span className="badge-en">CHAPTER 07</span>
        </div>
        <div className="edu-title-group">
          <h2 className="edu-main-title">ACADEMIC FOUNDATION</h2>
          <div className="edu-japanese-accent">
            <span className="kanji-accent">修学記録 · 学問の礎</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">THE SCHOLASTIC ROOTS & CORE TRAINING</span>
          </div>
        </div>
      </div>
    </header>
  );
}
