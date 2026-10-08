import React, { useEffect } from 'react';

export default function CertificateInspectionModal({ cert, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !cert) return null;

  return (
    <div
      className="cert-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} Inspection Modal`}
    >
      <div
        className="cert-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Folio Bar */}
        <div className="cert-modal-folio-bar">
          <div className="cert-folio-left-group">
            <span className="cert-modal-kanji">免状</span>
            <span className="cert-modal-title">CREDENTIAL ARTIFACT INSPECTION // {cert.year}</span>
          </div>
          <button
            type="button"
            className="cert-modal-close-btn"
            onClick={onClose}
            aria-label="Close Certificate Preview and Return"
          >
            RETURN TO CREDENTIALS ✕
          </button>
        </div>

        {/* Scrollable Viewport */}
        <div className="cert-modal-viewport">
          <div className="cert-modal-meta-top">
            <div className="cert-modal-badge-row">
              <span className="cert-badge-issuer">{cert.issuer}</span>
              <span className="cert-badge-year">YEAR {cert.year}</span>
            </div>
            <h3 className="cert-modal-headline">{cert.title}</h3>
          </div>

          {/* High-Res Certificate Image Container */}
          <div className="cert-modal-image-frame">
            <img
              src={cert.file}
              alt={`${cert.title} full high resolution credential`}
              className="cert-modal-full-img"
            />
          </div>

          {/* Tags & Competencies */}
          <div className="cert-modal-competencies-section">
            <span className="cert-modal-label">COVERED DOMAIN PROTOCOLS:</span>
            <div className="cert-modal-chips-list">
              {cert.tags.map((tag) => (
                <span key={tag} className="cert-modal-chip">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="cert-modal-actions-toolbar">
            <a
              href={cert.file}
              target="_blank"
              rel="noreferrer"
              className="cert-modal-action-btn primary-action"
            >
              <span className="btn-kanji">原紙</span>
              <span className="btn-text">OPEN RAW CREDENTIAL ASSET ↗</span>
            </a>

            <button
              type="button"
              className="cert-modal-action-btn return-action"
              onClick={onClose}
            >
              RETURN TO LIST ↩
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
