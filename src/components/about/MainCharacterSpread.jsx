import React, { useState } from 'react';
import portraitImg from '../../assets/images/manga_about_portrait.jpg';

export default function MainCharacterSpread({ onOpenPortraitModal }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="about-main-spread-grid">
      {/* =========================================================
          LEFT PAGE: SEINEN × SLICE OF LIFE MANGA PORTRAIT
          ========================================================= */}
      <div className="about-page-left">
        <div className="about-portrait-frame-container">
          <div 
            className="about-portrait-card"
            onClick={onOpenPortraitModal}
            role="button"
            tabIndex={0}
            aria-label="Inspect Character Portrait Spread"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenPortraitModal?.();
              }
            }}
          >
            {/* Top Frame Label */}
            <div className="portrait-frame-top-bar">
              <div className="portrait-frame-label">
                <span className="portrait-kanji-stamp">日常</span>
                <span className="portrait-label-text">SLICE OF LIFE // DESK ARCHIVE</span>
              </div>
              <span className="portrait-serial-tag">FIG. 02-A</span>
            </div>

            {/* Art Viewport */}
            <div className="about-art-viewport">
              <img 
                src={portraitImg} 
                alt="Balam Reneesh working quietly at workspace desk with laptop and design sketches" 
                className={`about-portrait-image ${imageLoaded ? 'is-loaded' : ''}`}
                onLoad={() => setImageLoaded(true)}
                loading="eager"
              />
              
              {/* Halftone Screentone Overlay */}
              <div className="about-screentone-layer" />
              <div className="about-vignette-layer" />

              {/* Ink Registration & Japanese Seal */}
              <div className="portrait-seal-stamp" aria-hidden="true">
                <span className="seal-kanji">静</span>
                <span className="seal-sub">QUIET</span>
              </div>

              {/* Inspect prompt */}
              <div className="portrait-inspect-hint">
                <span>INSPECT SPREAD 🔍</span>
              </div>
            </div>

            {/* Bottom Editorial Caption */}
            <div className="portrait-frame-bottom-bar">
              <span className="caption-jp">思索と創造の作業場にて</span>
              <span className="caption-en">THE WORKSPACE // LOGIC & CRAFT</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          RIGHT PAGE: IDENTITY, EDITORIAL BIOGRAPHY & CHARACTER FILE
          ========================================================= */}
      <div className="about-page-right">
        {/* Name & Title Identity */}
        <div className="about-identity-header">
          <div className="about-protagonist-pill">
            <span className="pill-kanji">人物</span>
            <span className="pill-text">PROTAGONIST FILE // 02</span>
          </div>

          <h3 className="about-name-title">
            <span className="about-name-first">BALAM</span>
            <span className="about-name-last">RENEESH</span>
          </h3>

          <div className="about-role-strip">
            <span className="role-strip-bullet">◆</span>
            <span className="role-strip-text">AI / SOFTWARE / CREATIVE BUILDER</span>
          </div>
        </div>

        {/* Factual Biography (80-120 words) */}
        <div className="about-story-editorial">
          <p className="about-bio-paragraph">
            I am Reneesh Balam, an AI systems engineer and software builder dedicated to transforming complex generative architectures into responsive, dependable software products. Working across machine learning, system pipelines, and modern web engineering, I bridge intelligent computational models with interfaces people can intuitively navigate.
          </p>
          <p className="about-bio-paragraph">
            Beyond engineering systems, my creative passion lies in indie game development and worldbuilding—designing interactive environments where rigorous computational logic and narrative aesthetics meet. I am driven by the discipline of building, learning rapidly, and continuously evolving.
          </p>
        </div>

        {/* Character File Metadata Block */}
        <div className="about-character-file-block">
          <div className="char-file-header">
            <span className="char-file-kanji">人物調書</span>
            <span className="char-file-title">CHARACTER FILE</span>
            <span className="char-file-serial">REF: BR-2026</span>
          </div>

          <div className="char-file-grid">
            <div className="char-file-item">
              <span className="file-label">NAME</span>
              <span className="file-value">BALAM RENEESH</span>
            </div>

            <div className="char-file-item">
              <span className="file-label">ROLE</span>
              <span className="file-value">AI / SOFTWARE / CREATIVE BUILDER</span>
            </div>

            <div className="char-file-item file-col-2">
              <span className="file-label">DOMAINS</span>
              <div className="file-domain-pills">
                <span className="domain-pill">GENERATIVE AI</span>
                <span className="domain-pill">SYSTEMS ARCHITECTURE</span>
                <span className="domain-pill">FULL-STACK WEB</span>
                <span className="domain-pill">INDIE GAME DEV</span>
              </div>
            </div>

            <div className="char-file-item file-col-2 char-file-highlight">
              <div className="arc-header-row">
                <span className="file-label">CURRENT ARC</span>
                <span className="arc-jp-badge">進行中</span>
              </div>
              <p className="arc-content-text">
                Building intelligent systems, creating interactive worlds, and figuring out what comes next.
              </p>
            </div>

            <div className="char-file-item">
              <span className="file-label">CREATIVE DIRECTION</span>
              <span className="file-value">INDIE GAME DEVELOPMENT & EXPERIMENTATION</span>
            </div>

            <div className="char-file-item">
              <span className="file-label">STATUS</span>
              <span className="file-value status-active">
                <span className="status-dot" /> IN PROGRESS // CONTINUOUS EVOLUTION
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
