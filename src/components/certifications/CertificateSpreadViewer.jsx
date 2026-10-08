import React, { useState } from 'react';

export default function CertificateSpreadViewer({ cert, index, total, onExamineCert }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!cert) return null;

  const certNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="cert-spread-viewer" aria-label={`Certificate Spread: ${cert.title}`}>
      {/* Left Page: Credential Metadata, Issuer & Tags */}
      <div className="cert-page-meta">
        <div className="cert-volume-strip">
          <div className="cert-badge-group">
            <span className="cert-num-tag">SCROLL #{certNumber}</span>
            <span className="cert-kanji-stamp">認証</span>
          </div>
          <span className="cert-verified-badge">★ VERIFIED CREDENTIAL</span>
        </div>

        <div className="cert-title-block">
          <h3 className="cert-headline">{cert.title}</h3>
          <p className="cert-issuer-text">ISSUED BY: {cert.issuer}</p>
        </div>

        {/* Editorial Metadata Strip */}
        <div className="cert-editorial-meta-strip">
          <div className="cert-meta-item">
            <span className="cert-meta-label">YEAR</span>
            <span className="cert-meta-val">{cert.year}</span>
          </div>
          <div className="cert-meta-item">
            <span className="cert-meta-label">STATUS</span>
            <span className="cert-meta-val status-val">AUTHENTICATED // COMPLETED</span>
          </div>
          <div className="cert-meta-item">
            <span className="cert-meta-label">RECORD</span>
            <span className="cert-meta-val">ACCREDITED</span>
          </div>
        </div>

        {/* Competencies / Tags Chips */}
        <div className="cert-tech-arsenal-block">
          <span className="cert-arsenal-label">ACCREDITED COMPETENCIES</span>
          <div className="cert-chips-list">
            {cert.tags.map((tag) => (
              <span key={tag} className="cert-chip-item">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Examine CTA Button */}
        <div className="cert-action-cta-row">
          <button
            type="button"
            className="cert-explore-btn"
            onClick={onExamineCert}
            aria-label={`Examine credential scroll for ${cert.title}`}
          >
            <span className="btn-kanji">検証</span>
            <span className="btn-text">EXAMINE SCROLL →</span>
          </button>
        </div>
      </div>

      {/* Right Page: Dominant Certificate Preview Frame */}
      <div className="cert-page-art">
        <div
          className="cert-artwork-card"
          onClick={onExamineCert}
          role="button"
          tabIndex={0}
          aria-label={`Click to inspect certificate: ${cert.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onExamineCert();
            }
          }}
        >
          <div className="cert-artwork-top-bar">
            <div className="cert-art-label-left">
              <span className="cert-art-kanji-tag">免状</span>
              <span className="cert-art-label-text">OFFICIAL PROOF // SPEC: #{certNumber}</span>
            </div>
            <span className="cert-art-reg-num">YEAR {cert.year}</span>
          </div>

          <div className="cert-art-viewport">
            <img
              src={cert.file}
              alt={`${cert.title} official certificate`}
              className={`cert-cover-img ${imageLoaded ? 'is-loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
              loading="eager"
            />
            <div className="cert-screentone-overlay" />
            <div className="cert-vignette-overlay" />

            {/* Official Manga Stamp */}
            <div className="cert-manga-stamp" aria-hidden="true">
              <span>公認済</span>
            </div>

            {/* Inspection Prompt */}
            <div className="cert-enter-hint">
              <span>CLICK TO EXAMINE FULL ARTIFACT 🔍</span>
            </div>
          </div>

          <div className="cert-artwork-bottom-bar">
            <span className="cert-bottom-issuer">{cert.issuer}</span>
            <span className="cert-bottom-prompt">HIGH-RES PREVIEW AVAILABLE ➔</span>
          </div>
        </div>
      </div>
    </article>
  );
}
