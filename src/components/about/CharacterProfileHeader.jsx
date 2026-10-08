import React from 'react';

export default function CharacterProfileHeader() {
  return (
    <header className="about-editorial-header" aria-label="Chapter 02 Editorial Header">
      {/* Top Folio Bar */}
      <div className="about-top-folio">
        <div className="about-folio-left">
          <span className="about-folio-tag">TANKŌBON VOL. 01</span>
          <span className="about-folio-sep">/</span>
          <span className="about-folio-chapter">第弐話 // CHAPTER 02</span>
        </div>
        <div className="about-folio-center">
          <span>CHARACTER PROFILE SPREAD // 人物紹介</span>
        </div>
        <div className="about-folio-right">
          <span className="about-folio-page">P. 018-019</span>
          <span className="about-folio-badge">FILE NO. 02</span>
        </div>
      </div>

      {/* Chapter Title Headline */}
      <div className="about-chapter-headline">
        <div className="about-chapter-badge">
          <span className="badge-kanji">弐</span>
          <span className="badge-en">CHAPTER 02</span>
        </div>
        <div className="about-title-group">
          <h2 className="about-main-title">
            CHARACTER PROFILE
          </h2>
          <div className="about-japanese-accent">
            <span className="kanji-accent">人物紹介</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">JINBUTSU SHŌKAI</span>
          </div>
        </div>
      </div>
    </header>
  );
}
