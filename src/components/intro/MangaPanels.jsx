import React from 'react';

export default function MangaPanels({ panelsRef }) {
  return (
    <div ref={panelsRef} className="manga-panels-container">
      {/* =========================================================
          BEAT 01 & IDENTITY (0:00 → 3.75s): DARK VOID / BRUSH / 憧 / 憧れ / 一匹狼 / IPPIKI ŌKAMI
      ========================================================= */}
      <div className="manga-phase-1 intro-sublayer">
        <div className="ink-mist-bg" />

        {/* Chapter marker */}
        <div className="prologue-header">
          <span className="kanji-chapter">第壱巻</span>
          <span className="kanji-separator">／</span>
          <span className="prologue-sub">序章 · 胎動</span>
        </div>

        {/* Large dry-brush stroke sweeping across rough paper */}
        <div className="brush-stroke-wrapper">
          <svg viewBox="0 0 800 120" className="brush-svg" aria-hidden="true">
            <path
              className="brush-path"
              d="M30,60 C200,20 400,90 770,55"
              fill="none"
              stroke="#F4EFE6"
              strokeWidth="18"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Primary Mark 憧 (large, expressive, brush-based, negative space) */}
        <div className="primary-akogare-stage">
          <div className="akogare-ink-aura" />
          <h1 className="primary-akogare-char">憧</h1>
          <div className="akogare-full-text">
            <span className="full-kanji">憧れ</span>
            <span className="full-sep">—</span>
            <span className="full-romaji">Akogare</span>
          </div>
        </div>

        {/* Thematic Japanese Motif 一匹狼 & Latin IPPIKI ŌKAMI */}
        <div className="ippiki-identity-strip">
          <span className="strip-kanji">一匹狼</span>
          <span className="strip-dot">·</span>
          <span className="strip-latin">IPPIKI ŌKAMI</span>
        </div>
      </div>

      {/* =========================================================
          BEAT 02 (Around 3.75s): HANKO SEAL IMPRESSION ON PAPER
      ========================================================= */}
      <div className="manga-phase-hanko intro-sublayer">
        <div className="screentone-dot-matrix" />
        <div className="hanko-seal-slam-target">
          <div className="hanko-ink-spread-ring" />
          <div className="hanko-seal-box">
            <span className="hanko-seal-char">憧</span>
          </div>
          <span className="hanko-seal-caption">落款印 // AKOGARE</span>
        </div>
      </div>

      {/* =========================================================
          BEAT 05 & STAMPS (6.5s → 12.5s): RAPID MANGA PAGES & PANELS
      ========================================================= */}
      <div className="manga-phase-spread intro-sublayer">
        <div className="manga-page-frame">
          {/* Top Panel: Diagonal Speed Cut */}
          <div className="panel-box panel-top">
            <div className="panel-screentone-bg" />
            <div className="speedlines-radial" />
            <div className="panel-content">
              <span className="panel-tag">PANEL 01 // 覚醒</span>
              <h3 className="panel-heading">AWAKENING OF THE SYSTEM</h3>
              <p className="panel-jp-text">思考が次元を超え、美学と論理が息づく。</p>
            </div>
            <div className="manga-sfx sfx-gogogo">ゴゴゴゴ…</div>

            {/* Identity Stamp 01: CEO */}
            <div className="identity-stamp stamp-ceo">
              <div className="stamp-inner">
                <span className="stamp-num">01</span>
                <span className="stamp-text">CEO</span>
              </div>
            </div>
          </div>

          {/* Middle 2-Column Split Panels */}
          <div className="panel-row-split">
            {/* Left Box: Seeker of Logic */}
            <div className="panel-box panel-mid-left">
              <div className="halftone-overlay" />
              <div className="kanji-calligraphy-burst">探求</div>
              <div className="panel-meta-caption">
                <span>SEEKER OF LOGIC</span>
                <span>AI · SYSTEMS ARCHITECTURE</span>
              </div>

              {/* Identity Stamp 02: STARTUP INTERN */}
              <div className="identity-stamp stamp-intern">
                <div className="stamp-inner">
                  <span className="stamp-num">02</span>
                  <span className="stamp-text">STARTUP INTERN</span>
                </div>
              </div>

              {/* Identity Stamp 03: FREELANCER */}
              <div className="identity-stamp stamp-freelancer">
                <div className="stamp-inner">
                  <span className="stamp-num">03</span>
                  <span className="stamp-text">FREELANCER</span>
                </div>
              </div>
            </div>

            {/* Right Box: Dynamic Impact Slash */}
            <div className="panel-box panel-mid-right">
              <div className="hatch-screentone" />
              <div className="manga-sfx sfx-don">ドォッ!!</div>
              <div className="panel-quote">
                “Building systems that learn, remember, and respond.”
              </div>

              {/* Identity Stamp 04: CO-FOUNDER */}
              <div className="identity-stamp stamp-cofounder">
                <div className="stamp-inner">
                  <span className="stamp-num">04</span>
                  <span className="stamp-text">CO-FOUNDER</span>
                </div>
              </div>

              {/* Identity Stamp 05: INDIE GAME DEVELOPER */}
              <div className="identity-stamp stamp-gamedev">
                <div className="stamp-inner">
                  <span className="stamp-num">05</span>
                  <span className="stamp-text">INDIE GAME DEVELOPER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner Panel */}
          <div className="panel-box panel-bottom">
            <div className="speedlines-horizontal" />
            <div className="panel-bottom-content">
              <div className="bottom-kanji-stamp">一閃</div>
              <div className="bottom-text-group">
                <span className="bottom-en">DIMENSIONAL SYNCHRONIZATION COMPLETE</span>
                <span className="bottom-jp">ポートフォリオ展開へ移行</span>
              </div>
              <div className="manga-sfx sfx-zuba">ズバッ!!</div>
            </div>

            {/* Identity Stamp 06: 憧れ / Akogare */}
            <div className="identity-stamp stamp-akogare">
              <div className="stamp-inner">
                <span className="stamp-num">06</span>
                <span className="stamp-text">憧れ · AKOGARE</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7 SHORT ABSTRACT VISUAL INK MARKS (Rhythmic punctuation ~7.5s - 11.25s) */}
        <div className="abstract-ink-marks-layer" aria-hidden="true">
          <div className="ink-mark mark-0" />
          <div className="ink-mark mark-1" />
          <div className="ink-mark mark-2" />
          <div className="ink-mark mark-3" />
          <div className="ink-mark mark-4" />
          <div className="ink-mark mark-5" />
          <div className="ink-mark mark-6" />
        </div>
      </div>

      {/* =========================================================
          BEAT 06 & 07 (12.5s → 15.0s): MAJOR IMPACT / FINAL DOUBLE-PAGE SPREAD / PORTFOLIO TRANSFORMATION
      ========================================================= */}
      <div className="manga-phase-climax intro-sublayer">
        <div className="climax-speed-burst" />
        <div className="climax-vignette-ink" />

        {/* Final Double-Page Spread */}
        <div className="manga-double-page-spread">
          {/* Left Spread: Manga Art World & Six Stamps Archive */}
          <div className="spread-page spread-left">
            <div className="spread-screentone" />
            <div className="spread-art-center">
              <div className="spread-hanko-seal">
                <span className="spread-hanko-glyph">憧</span>
              </div>
              <div className="spread-japanese-title">憧れ · 一匹狼</div>
              <div className="spread-latin-sub">IPPIKI ŌKAMI // VOL. 01</div>
            </div>

            {/* Subtle integrated archive of the 6 stamps */}
            <div className="spread-stamps-grid">
              <span className="mini-stamp">01 CEO</span>
              <span className="mini-stamp">02 INTERN</span>
              <span className="mini-stamp">03 FREELANCE</span>
              <span className="mini-stamp">04 CO-FOUNDER</span>
              <span className="mini-stamp">05 INDIE DEV</span>
              <span className="mini-stamp">06 憧れ</span>
            </div>
          </div>

          {/* Gutter Center Line */}
          <div className="spread-gutter" />

          {/* Right Spread: English Portfolio Identity */}
          <div className="spread-page spread-right">
            <div className="spread-right-content">
              <div className="spread-author-badge">AUTHOR & BUILDER</div>
              <h1 className="spread-author-name">BALAM RENEESH</h1>
              <div className="spread-author-role">AI SYSTEMS ENGINEER & FULL-STACK DEVELOPER</div>
              <p className="spread-author-mission">
                “Turning complex generative AI and machine learning architectures into responsive, production-ready interfaces.”
              </p>
              <div className="spread-tech-pills">
                <span className="pill">GENERATIVE AI</span>
                <span className="pill">SYSTEMS ARCHITECTURE</span>
                <span className="pill">FULL-STACK WEB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manga Frame Border Break Lines that expand outward into the website */}
        <div className="frame-break-line break-top" />
        <div className="frame-break-line break-bottom" />
        <div className="frame-break-line break-left" />
        <div className="frame-break-line break-right" />
      </div>
    </div>
  );
}
