import React from 'react';

export default function ContactHeader() {
  return (
    <header className="contact-editorial-header" aria-label="Chapter 08 Editorial Header">
      {/* Top Folio Bar */}
      <div className="contact-top-folio">
        <div className="contact-folio-left">
          <span className="contact-folio-tag">TANKŌBON VOL. 01</span>
          <span className="contact-folio-sep">/</span>
          <span className="contact-folio-chapter">第八話 // CHAPTER 08</span>
        </div>
        <div className="contact-folio-center">
          <span>DIRECT TRANSMISSION & FREQUENCY // 通信回線・次章への扉</span>
        </div>
        <div className="contact-folio-right">
          <span className="contact-folio-page">P. 030-031</span>
          <span className="contact-folio-badge">FINAL ARC</span>
        </div>
      </div>

      {/* Chapter 08 Headline */}
      <div className="contact-chapter-headline">
        <div className="contact-chapter-badge">
          <span className="badge-kanji">八</span>
          <span className="badge-en">CHAPTER 08</span>
        </div>
        <div className="contact-title-group">
          <h2 className="contact-main-title">DIRECT TRANSMISSION</h2>
          <div className="contact-japanese-accent">
            <span className="kanji-accent">通信回線 · 次章の扉</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">OPEN CHANNELS & MULTIVERSE SIGNALS</span>
          </div>
        </div>
      </div>
    </header>
  );
}
