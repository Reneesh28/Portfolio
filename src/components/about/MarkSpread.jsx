import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { STAT_DIMENSIONS, STAT_LEVEL_PERCENT } from '../../data/aboutActs';

/**
 * MarkSpread - Two-Page Manga Spread with Physical Page-Turn Flip
 * Covers the finale when a notch/class panel is confirmed.
 */
export default function MarkSpread({ mark, onClose, lastFocusedElement }) {
  const containerRef = useRef(null);
  const leafRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Time format helper
  const formatTime = (h) => {
    const rawH = Math.floor(h) % 24;
    const mins = Math.round((h - Math.floor(h)) * 60);
    return `${String(rawH).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  // 1. Page Turn Entrance & Exit Animation (GSAP, 0.9s, perspective 1800px)
  useEffect(() => {
    if (!containerRef.current || !leafRef.current) return;

    // Lock body scroll
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on mount
    closeBtnRef.current?.focus();

    // GSAP Page-Turn Flip (Spine on right, turns from right to left)
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(
      leafRef.current,
      { rotateY: 90, opacity: 0, scale: 0.95 },
      { rotateY: 0, opacity: 1, scale: 1, duration: 0.85 }
    ).fromTo(
      '.about-spread-content-fade',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' },
      '-=0.3'
    );

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Handle smooth close transition
  const handleClose = useCallback(() => {
    if (!leafRef.current) {
      onClose();
      return;
    }

    gsap.to(leafRef.current, {
      rotateY: 90,
      opacity: 0,
      scale: 0.96,
      duration: 0.65,
      ease: 'power2.in',
      onComplete: () => {
        onClose();
        // Return focus to previous element
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
          lastFocusedElement.focus();
        }
      },
    });
  }, [onClose, lastFocusedElement]);

  // Keyboard accessibility: ESC to close & Focus trapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }

      // Focus trap
      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  if (!mark) return null;

  return (
    <div
      ref={containerRef}
      className="about-mark-spread-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Manga Spread: ${mark.name}`}
      onClick={(e) => {
        if (e.target === containerRef.current) handleClose();
      }}
    >
      {/* 3D Perspective Flip Container */}
      <div className="about-spread-perspective-stage">
        <div ref={leafRef} className="about-spread-double-page">
          {/* Close Corner Tab (Drawn text: 13:00 ↺) */}
          <button
            ref={closeBtnRef}
            type="button"
            className="about-spread-close-corner-tab"
            onClick={handleClose}
            aria-label={`Close spread and return to ${formatTime(mark.hour)}`}
          >
            <span className="about-tab-time">{formatTime(mark.hour)}</span>
            <span className="about-tab-arrow" aria-hidden="true">↺</span>
            <span className="about-tab-close-text">[ CLOSE / 閉じる ]</span>
          </button>

          {/* =========================================================
              LEFT PAGE: TREATED MANGA ARTWORK & STAMP
              ========================================================= */}
          <section className="about-spread-page about-spread-page-left">
            <div className="about-spread-folio-bar">
              <span className="about-folio-kanji">{mark.kanji}</span>
              <span className="about-folio-label">TANKŌBON VOL. 01 // MARK {mark.kanji}</span>
              <span className="about-folio-hour">{formatTime(mark.hour)}</span>
            </div>

            <div className="about-spread-art-frame about-spread-content-fade">
              {mark.isPlaceholderSlot && import.meta.env.DEV && (
                <div className="about-placeholder-dev-badge" aria-hidden="true">
                  PLACEHOLDER: {mark.isPlaceholderSlot}
                </div>
              )}

              <img
                src={mark.spreadImage}
                alt={`${mark.name} manga artwork`}
                className="about-spread-img"
              />
              <div className="about-spread-screentone-overlay" aria-hidden="true" />

              {/* Physical Hanko Stamp Impression */}
              <div className="about-spread-hanko-seal">
                <span className="about-hanko-kanji">{mark.kanji}</span>
                <span className="about-hanko-sub">{mark.shortName}</span>
              </div>
            </div>

            <p className="about-spread-art-caption about-spread-content-fade">
              {mark.caption}
            </p>
          </section>

          {/* Spine Divider Center */}
          <div className="about-spread-center-spine" aria-hidden="true" />

          {/* =========================================================
              RIGHT PAGE: DOSSIER, DESCRIPTION & INK-BRUSH STAT BARS
              ========================================================= */}
          <section className="about-spread-page about-spread-page-right">
            {/* Header Identity */}
            <div className="about-spread-right-header about-spread-content-fade">
              <div className="about-spread-tagline-kicker">
                <span className="about-kicker-num">CHRONO NOTCH // {formatTime(mark.hour)}</span>
                <span className="about-kicker-kanji">{mark.kanji}</span>
              </div>

              <h2 className="about-spread-title">
                {mark.name}
              </h2>

              <p className="about-spread-subtitle">
                {mark.subtitle}
              </p>
            </div>

            {/* Verbatim Description Paragraph */}
            <div className="about-spread-body-desc about-spread-content-fade">
              <p>{mark.description}</p>
            </div>

            {/* Tag Chips */}
            <div className="about-spread-tags-row about-spread-content-fade">
              {mark.tags.map((tag) => (
                <span key={tag} className="about-spread-tag-chip">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Ink-Brush Stat Bars Matrix (BUILD, CREATE, LEAD, EXPLORE) */}
            <div className="about-spread-stats-matrix about-spread-content-fade">
              <div className="about-stats-header">
                <span className="about-stats-title">ATTRIBUTE EMPHASIS MATRIX</span>
                <span className="about-stats-kanji">能力傾向</span>
              </div>

              <div className="about-stats-bars-grid">
                {STAT_DIMENSIONS.map((dim) => {
                  const level = mark.stats?.[dim.key] || 'Applied';
                  const percent = STAT_LEVEL_PERCENT[level] || 66;

                  return (
                    <div key={dim.key} className="about-stat-bar-item">
                      <div className="about-stat-label-row">
                        <span className="about-stat-dim-name">
                          <span className="about-stat-kanji">{dim.kanji}</span>
                          {dim.key} <span className="about-stat-dim-sub">({dim.label})</span>
                        </span>
                        <span className={`about-stat-level-tag level-${level.toLowerCase()}`}>
                          [{level.toUpperCase()}]
                        </span>
                      </div>

                      {/* Ink Bar Gauge Track */}
                      <div className="about-stat-track" aria-hidden="true">
                        <div
                          className={`about-stat-fill fill-${level.toLowerCase()}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Folio Close Action */}
            <div className="about-spread-bottom-folio about-spread-content-fade">
              <span className="about-bottom-note">BALAM RENEESH · MANGA DOSSIER</span>
              <button
                type="button"
                className="about-spread-bottom-close-btn"
                onClick={handleClose}
              >
                RETURN TO CLOCK [ ✕ ]
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
