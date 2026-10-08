import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profile from '../../data/profile';
import { SERIES_INFO } from '../../data/aboutActs';

/**
 * SpineTab - Persistent Tankōbon Spine Tab along the right edge
 * Shows series identity, role, specialization, mission, and vermilion resume hanko seal.
 */
export default function SpineTab({ sectionRef }) {
  const tabRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Show only when About section is in viewport
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => setIsVisible(true),
      onEnterBack: () => setIsVisible(true),
      onLeave: () => setIsVisible(false),
      onLeaveBack: () => setIsVisible(false),
    });

    return () => trigger.kill();
  }, [sectionRef]);

  return (
    <aside
      ref={tabRef}
      className={`about-spine-tab ${isVisible ? 'is-visible' : 'is-hidden'}`}
      aria-label="Character Dossier Spine Folio"
    >
      {/* =========================================================
          DESKTOP VERTICAL SPINE BAR (≥ 768px)
          ========================================================= */}
      <div className="about-spine-desktop-content">
        {/* Top: Protagonist Japanese Alias */}
        <div className="about-spine-top">
          <span className="about-spine-alias-kanji">{SERIES_INFO.aliasKanji}</span>
          <span className="about-spine-series-tag">{SERIES_INFO.seriesKanji}</span>
        </div>

        <div className="about-spine-divider" aria-hidden="true" />

        {/* Vertical Text Stack: Role, Specialization, Mission */}
        <div className="about-spine-vertical-stack">
          <div className="about-spine-text-block role-block">
            <span className="about-spine-vertical-label">ROLE</span>
            <span className="about-spine-vertical-text">{profile.role}</span>
          </div>

          <div className="about-spine-text-block spec-block">
            <span className="about-spine-vertical-label">SPECIALIZATION</span>
            <span className="about-spine-vertical-text">{profile.specialization}</span>
          </div>

          <div className="about-spine-text-block mission-block">
            <span className="about-spine-vertical-label">MISSION</span>
            <span className="about-spine-vertical-mission">{profile.mission}</span>
          </div>
        </div>

        <div className="about-spine-divider" aria-hidden="true" />

        {/* Bottom Vermilion Hanko Seal Resume Button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="about-spine-resume-hanko"
          aria-label="Open Resume Document (/resume.pdf)"
        >
          <div className="about-hanko-box">
            <span className="about-hanko-kanji">履歴書</span>
            <span className="about-hanko-en">RESUME ↗</span>
          </div>
        </a>
      </div>

      {/* =========================================================
          MOBILE BOTTOM DOCK (< 768px)
          ========================================================= */}
      <div className="about-spine-mobile-dock">
        {/* Top Mission Ticker */}
        <div className="about-spine-mobile-ticker">
          <div className="about-spine-ticker-track">
            <span>{SERIES_INFO.aliasKanji} // {profile.mission} —— {profile.specialization} —— </span>
            <span>{SERIES_INFO.aliasKanji} // {profile.mission} —— {profile.specialization} —— </span>
          </div>
        </div>

        {/* Bottom Bar: Role on Left, Hanko Resume on Right */}
        <div className="about-spine-mobile-bar">
          <div className="about-spine-mobile-info">
            <span className="mobile-info-alias">{SERIES_INFO.aliasKanji} · {profile.name}</span>
            <span className="mobile-info-role">{profile.role}</span>
          </div>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="about-spine-mobile-resume-btn"
            aria-label="Open Resume Document"
          >
            <span className="mobile-resume-kanji">履歴</span>
            <span className="mobile-resume-en">[ RESUME ↗ ]</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
