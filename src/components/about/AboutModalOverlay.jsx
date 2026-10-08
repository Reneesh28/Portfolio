import React, { useEffect } from 'react';

export default function AboutModalOverlay({ activeModal, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!activeModal) return null;

  return (
    <div 
      className="about-modal-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={activeModal.title || 'Manga Spread Inspection'}
    >
      <div 
        className="about-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Folio Bar */}
        <div className="about-modal-folio-bar">
          <div className="modal-folio-left">
            <span className="modal-folio-kanji">{activeModal.kanji || '調書'}</span>
            <span className="modal-folio-title">{activeModal.title || 'ARCHIVE SPREAD'}</span>
          </div>
          <button 
            type="button" 
            className="about-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal dialog"
          >
            CLOSE ✕
          </button>
        </div>

        {/* Modal Viewport */}
        <div className="about-modal-viewport">
          <div className="modal-image-container">
            <img 
              src={activeModal.image} 
              alt={activeModal.title}
              className="modal-zoom-image"
            />
            <div className="modal-screentone-overlay" />
          </div>

          <div className="modal-content-details">
            <div className="modal-category-tag">
              <span>{activeModal.tag || 'CHARACTER ARCHIVE // SEINEN'}</span>
            </div>

            <h3 className="modal-headline">{activeModal.headline || activeModal.title}</h3>
            
            <p className="modal-body-text">{activeModal.description}</p>

            {activeModal.tags && (
              <div className="modal-tags-list">
                {activeModal.tags.map((t) => (
                  <span key={t} className="modal-tag-pill">{t}</span>
                ))}
              </div>
            )}

            <div className="modal-actions-row">
              <button
                type="button"
                className="about-modal-dismiss-btn"
                onClick={onClose}
              >
                RETURN TO PROFILE ↩
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
