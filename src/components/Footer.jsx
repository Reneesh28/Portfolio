import React from 'react';
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from 'react-icons/fi';
import './MangaFooter.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="manga-colophon-footer" aria-label="Tankōbon Colophon and Publication Credits">
      {/* Ambient Grain Texture */}
      <div className="manga-colophon-grain" aria-hidden="true" />

      <div className="manga-colophon-container">
        {/* Top Folio Bar */}
        <div className="colophon-top-folio">
          <div className="colophon-folio-left">
            <span className="colophon-folio-tag">TANKŌBON VOL. 01</span>
            <span className="colophon-folio-sep">/</span>
            <span className="colophon-folio-chapter">奥付 // PUBLICATION COLOPHON</span>
          </div>
          <div className="colophon-folio-right">
            <span className="colophon-folio-page">END OF VOLUME</span>
            <span className="colophon-folio-badge">全8話完結</span>
          </div>
        </div>

        {/* Main Colophon Spread Card */}
        <div className="colophon-main-card">
          <div className="colophon-left-block">
            <div className="colophon-series-title-row">
              <span className="colophon-kanji-seal">奥付</span>
              <div>
                <h3 className="colophon-title">ACROSS THE CODEVERSE</h3>
                <p className="colophon-sub">単行本 第1巻 // SEINEN MANGA EDITION</p>
              </div>
            </div>

            {/* Publication Specification Table */}
            <div className="colophon-spec-grid">
              <div className="spec-row">
                <span className="spec-label">AUTHOR / PROTAGONIST</span>
                <span className="spec-value">BALAM RENEESH (レン・バラム)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">SERIALIZATION</span>
                <span className="spec-value">EARTH-28 / DIGITAL EDITION</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">TOTAL CHAPTERS</span>
                <span className="spec-value">8 CHAPTERS (PROLOGUE → TRANSMISSION)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">TECHNICAL MEDIUM</span>
                <span className="spec-value">REACT · THREE.JS · GSAP · PYTHON AI</span>
              </div>
            </div>
          </div>

          <div className="colophon-right-block">
            {/* Social Channels Row */}
            <div className="colophon-channels-box">
              <span className="channels-box-label">OPEN TRANSMISSION FREQUENCIES</span>
              <div className="colophon-social-icons">
                <a
                  href="mailto:reneesh3508925@gmail.com"
                  className="colophon-social-btn"
                  aria-label="Send Email"
                  title="Direct Email"
                >
                  <FiMail size={18} />
                  <span className="btn-name">EMAIL</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/balam-reneesh"
                  target="_blank"
                  rel="noreferrer"
                  className="colophon-social-btn"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <FiLinkedin size={18} />
                  <span className="btn-name">LINKEDIN</span>
                </a>
                <a
                  href="https://github.com/Reneesh28"
                  target="_blank"
                  rel="noreferrer"
                  className="colophon-social-btn"
                  aria-label="GitHub Profile"
                  title="GitHub"
                >
                  <FiGithub size={18} />
                  <span className="btn-name">GITHUB</span>
                </a>
              </div>
            </div>

            {/* Return to Cover Action */}
            <div className="colophon-action-row">
              <button
                type="button"
                className="colophon-return-btn"
                onClick={scrollToTop}
                aria-label="Return to Cover Page"
              >
                <span className="btn-kanji">巻頭</span>
                <span className="btn-text">RETURN TO COVER ↑</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="colophon-bottom-bar">
          <p className="colophon-copyright">
            &copy; {new Date().getFullYear()} BALAM RENEESH. ALL RIGHTS RESERVED IN THIS UNIVERSE.
          </p>
          <div className="colophon-end-mark">
            <span>[ 完 / FIN ]</span>
          </div>
        </div>
      </div>
    </footer>
  );
}