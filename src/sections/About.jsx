import React, { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IDENTITY_MARKS, STAT_DIMENSIONS, STAT_LEVEL_PERCENT, SERIES_INFO } from '../data/aboutActs';
import AboutActs from '../components/about/AboutActs';
import ClockDial from '../components/about/ClockDial';
import WolfStage from '../components/about/WolfStage';
import MarkSpread from '../components/about/MarkSpread';
import SpineTab from '../components/about/SpineTab';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const hourRef = useRef(6.0);
  const [displayHour, setDisplayHour] = useState(6.0);
  const [activeMarkId, setActiveMarkId] = useState('intern');
  const [openedSpreadMark, setOpenedSpreadMark] = useState(null);
  const [lastFocusedEl, setLastFocusedEl] = useState(null);
  const [isWolfHovered, setIsWolfHovered] = useState(false);

  // Hour update callback driven by GSAP ScrollTrigger in AboutActs
  const handleHourUpdate = useCallback((newHour) => {
    hourRef.current = newHour;
    setDisplayHour(newHour);
  }, []);

  const handleSelectMark = useCallback((mark) => {
    setActiveMarkId(mark.id);
  }, []);

  const handleOpenSpread = useCallback((mark, event) => {
    setLastFocusedEl(event?.currentTarget || document.activeElement);
    setOpenedSpreadMark(mark);
  }, []);

  const handleCloseSpread = useCallback(() => {
    setOpenedSpreadMark(null);
  }, []);

  const activeMark = IDENTITY_MARKS.find((m) => m.id === activeMarkId) || IDENTITY_MARKS[0];
  const activeMarkIndex = IDENTITY_MARKS.findIndex((m) => m.id === activeMarkId);

  // Mobile prev/next navigation
  const handlePrevMark = () => {
    const prevIdx = (activeMarkIndex - 1 + IDENTITY_MARKS.length) % IDENTITY_MARKS.length;
    setActiveMarkId(IDENTITY_MARKS[prevIdx].id);
  };

  const handleNextMark = () => {
    const nextIdx = (activeMarkIndex + 1) % IDENTITY_MARKS.length;
    setActiveMarkId(IDENTITY_MARKS[nextIdx].id);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-root"
      role="region"
      aria-label="Chapter 02: Character Profile & Chronicle of Kokurō"
    >
      {/* Persistent Vertical Spine Tab (Right Edge / Mobile Bottom Dock) */}
      <SpineTab sectionRef={sectionRef} />

      {/* =========================================================
          STAGE 1: FOUR PINNED MANGA ACTS (06:00 → 01:00)
          ========================================================= */}
      <AboutActs
        onHourUpdate={handleHourUpdate}
        currentHour={displayHour}
      />

      {/* =========================================================
          STAGE 2: THE FINALE CLOCK & WOLF SANCTUARY (Unpinned Section)
          ========================================================= */}
      <div className="about-finale-section" aria-label="Finale: The 24-Hour Chronometer of Kokurō">
        {/* Top Folio Gutter */}
        <header className="about-finale-header">
          <div className="about-finale-kicker">
            <span className="finale-kanji-stamp">時計</span>
            <span className="finale-kicker-text">{SERIES_INFO.seriesKanji} // {SERIES_INFO.chapterKanji} FINALE</span>
          </div>

          <h2 className="about-finale-heading">
            {SERIES_INFO.tagline.toUpperCase()}
          </h2>

          <p className="about-finale-subheading">
            SELECT A CHRONO-NOTCH AROUND THE 24-HOUR DIAL TO INSPECT THE AUTHENTIC MARKS OF THE PROTAGONIST.
          </p>
        </header>

        {/* Main Clock Dial + Wolf Stage Composition */}
        <div className="about-finale-stage-wrapper">
          {/* Mobile Step Controls */}
          <div className="about-finale-mobile-nav">
            <button
              type="button"
              className="about-arrow-btn"
              onClick={handlePrevMark}
              aria-label="Previous Mark Notch"
            >
              ← PREV
            </button>
            <div className="about-mobile-active-tag">
              <span className="mobile-active-kanji">{activeMark.kanji}</span>
              <span className="mobile-active-title">{activeMark.name}</span>
            </div>
            <button
              type="button"
              className="about-arrow-btn"
              onClick={handleNextMark}
              aria-label="Next Mark Notch"
            >
              NEXT →
            </button>
          </div>

          {/* Central Dial & Wolf Stage Core */}
          <div
            className="about-finale-center-hub"
            onMouseEnter={() => setIsWolfHovered(true)}
            onMouseLeave={() => setIsWolfHovered(false)}
          >
            {/* 3D / 2.5D Toon Wolf inside the Dial Center */}
            <div className="about-finale-wolf-enclosure">
              <WolfStage
                hour={activeMark.hour}
                activeMarkId={activeMark.id}
                isHovered={isWolfHovered}
              />
            </div>

            {/* 24-Hour SVG Clock Dial Hand & Notches */}
            <ClockDial
              mode="select"
              hour={activeMark.hour}
              activeMarkId={activeMark.id}
              onSelectMark={handleSelectMark}
              onConfirmSpread={(m) => handleOpenSpread(m)}
            />
          </div>

          {/* Six Class Panels Constellation around the Clock */}
          <div className="about-class-panels-grid">
            {IDENTITY_MARKS.map((mark) => {
              const isActive = mark.id === activeMarkId;

              return (
                <button
                  key={`panel-${mark.id}`}
                  type="button"
                  className={`about-class-panel-card ${isActive ? 'is-active-card' : ''}`}
                  onClick={() => {
                    handleSelectMark(mark);
                  }}
                  onDoubleClick={(e) => {
                    handleOpenSpread(mark, e);
                  }}
                  aria-label={`Inspect ${mark.name} (${mark.shortName})`}
                >
                  <div className="about-card-top-bar">
                    <span className="about-card-kanji">{mark.kanji}</span>
                    <span className="about-card-notch-time">
                      {String(Math.floor(mark.hour) % 24).padStart(2, '0')}:00
                    </span>
                  </div>

                  <div className="about-card-art-thumb">
                    <img
                      src={mark.spreadImage}
                      alt=""
                      className="about-card-thumb-img"
                      loading="lazy"
                    />
                    <div className="about-card-thumb-overlay" />
                    {isActive && (
                      <div className="about-card-active-seal">
                        <span>{mark.kanji}</span>
                      </div>
                    )}
                  </div>

                  <div className="about-card-body">
                    <h3 className="about-card-title">{mark.name}</h3>
                    <p className="about-card-sub">{mark.subtitle}</p>
                  </div>

                  <div className="about-card-footer">
                    <button
                      type="button"
                      className="about-card-open-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSpread(mark, e);
                      }}
                      aria-label={`Open spread for ${mark.name}`}
                    >
                      OPEN SPREAD [ ↗ ]
                    </button>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Mark Ink-Brush Stat Bar Emphasis Matrix */}
          <div className="about-finale-active-dossier">
            <div className="about-dossier-header">
              <div className="about-dossier-title-wrap">
                <span className="about-dossier-kanji-badge">{activeMark.kanji}</span>
                <div className="about-dossier-names">
                  <h3 className="about-dossier-headline">{activeMark.name}</h3>
                  <span className="about-dossier-sub">{activeMark.subtitle}</span>
                </div>
              </div>

              <button
                type="button"
                className="about-dossier-inspect-cta"
                onClick={(e) => handleOpenSpread(activeMark, e)}
              >
                READ DOUBLE-PAGE SPREAD ➔
              </button>
            </div>

            <div className="about-dossier-stats-bars">
              {STAT_DIMENSIONS.map((dim) => {
                const level = activeMark.stats?.[dim.key] || 'Applied';
                const percent = STAT_LEVEL_PERCENT[level] || 66;

                return (
                  <div key={`dossier-bar-${dim.key}`} className="about-dossier-stat-item">
                    <div className="dossier-stat-label-line">
                      <span className="dossier-stat-dim">{dim.key} 【{dim.kanji}】</span>
                      <span className={`dossier-stat-lvl lvl-${level.toLowerCase()}`}>
                        {level}
                      </span>
                    </div>
                    <div className="dossier-stat-track" aria-hidden="true">
                      <div
                        className={`dossier-stat-fill lvl-fill-${level.toLowerCase()}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vermilion Thread Leaving Finale Toward Next Chapter (Skills) */}
        <footer className="about-finale-exit-thread-gutter">
          <svg className="about-exit-thread-svg" aria-hidden="true">
            <path
              d="M 200 0 Q 210 50 190 90 T 200 140"
              className="about-exit-thread-line"
            />
          </svg>
          <div className="about-exit-caption">
            <span className="exit-next-tag">次章へ進む</span>
            <span className="exit-next-title">NEXT: ARSENAL (CHAPTER 03) ↓</span>
          </div>
        </footer>
      </div>

      {/* =========================================================
          PHYSICAL PAGE-TURN MARK SPREAD (Overlay Covering Finale)
          ========================================================= */}
      {openedSpreadMark && (
        <MarkSpread
          mark={openedSpreadMark}
          onClose={handleCloseSpread}
          lastFocusedElement={lastFocusedEl}
        />
      )}
    </section>
  );
}