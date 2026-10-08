import React from 'react';

export default function CertificationsHeader() {
  return (
    <header className="cert-editorial-header" aria-label="Chapter 06 Editorial Header">
      {/* Top Folio Bar */}
      <div className="cert-top-folio">
        <div className="cert-folio-left">
          <span className="cert-folio-tag">TANKŌBON VOL. 01</span>
          <span className="cert-folio-sep">/</span>
          <span className="cert-folio-chapter">第六話 // CHAPTER 06</span>
        </div>
        <div className="cert-folio-center">
          <span>CREDENTIALS & VERIFIED SCROLLS // 免状・資格証</span>
        </div>
        <div className="cert-folio-right">
          <span className="cert-folio-page">P. 026-027</span>
          <span className="cert-folio-badge">VOL. 06</span>
        </div>
      </div>

      {/* Chapter 06 Headline */}
      <div className="cert-chapter-headline">
        <div className="cert-chapter-badge">
          <span className="badge-kanji">六</span>
          <span className="badge-en">CHAPTER 06</span>
        </div>
        <div className="cert-title-group">
          <h2 className="cert-main-title">CREDENTIALS</h2>
          <div className="cert-japanese-accent">
            <span className="kanji-accent">免状 · 公式認証</span>
            <span className="accent-sep">―</span>
            <span className="romaji-accent">VERIFIED ARTIFACTS & PROVEN MASTERY</span>
          </div>
        </div>
      </div>
    </header>
  );
}
