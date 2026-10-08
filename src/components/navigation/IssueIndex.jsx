import React, { useState, useEffect, useRef } from 'react';
import './MangaNavbar.css';

const chapters = [
  { id: 'hero', number: '01', kanji: '一', title: 'THE PROTAGONIST', subtitle: 'Who is he? // Origin & Hero Spread', page: 'P. 001-005' },
  { id: 'about', number: '02', kanji: '二', title: 'CHARACTER PROFILE', subtitle: 'Who is the person? // Dossier & Stats', page: 'P. 006-011' },
  { id: 'skills', number: '03', kanji: '三', title: 'ARSENAL & POWERS', subtitle: 'What can he build with? // Technical Dossier', page: 'P. 012-017' },
  { id: 'experience', number: '04', kanji: '四', title: 'JOURNEY & STORY ARCS', subtitle: 'Where has he applied it? // Chronicles', page: 'P. 018-023' },
  { id: 'projects', number: '05', kanji: '五', title: 'THE WORK', subtitle: 'What has he built? // Project Anthology', page: 'P. 024-025' },
  { id: 'certifications', number: '06', kanji: '六', title: 'CREDENTIALS', subtitle: 'Verified mastery // Authenticated Scrolls', page: 'P. 026-027' },
  { id: 'education', number: '07', kanji: '七', title: 'ACADEMIC FOUNDATION', subtitle: 'Scholastic roots // Origin Protocols', page: 'P. 028-029' },
  { id: 'contact', number: '08', kanji: '八', title: 'DIRECT TRANSMISSION', subtitle: 'Open frequencies // Final Signal', page: 'P. 030-031' },
];

export default function IssueIndex() {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);
  const prevFocusRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState('hero');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setProgress(scrolled);

      if (currentScrollY > lastScrollY && currentScrollY > 120 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);

      // Determine active section
      const sectionElements = chapters.map((c) => document.getElementById(c.id));
      let currentId = 'hero';
      sectionElements.forEach((section) => {
        if (section) {
          const sectionTop = section.offsetTop;
          if (window.scrollY >= sectionTop - 240) {
            currentId = section.id;
          }
        }
      });
      setActiveChapter(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Trap focus and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      prevFocusRef.current = document.activeElement;

      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length) focusable[0].focus();
      }

      const handleTab = (e) => {
        if (e.key !== 'Tab' || !dialogRef.current) return;
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      window.addEventListener('keydown', handleTab);
      return () => window.removeEventListener('keydown', handleTab);
    } else {
      document.body.style.overflow = '';
      if (prevFocusRef.current) prevFocusRef.current.focus();
    }
  }, [isOpen]);

  const scrollTo = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeItem = chapters.find((c) => c.id === activeChapter) || chapters[0];

  return (
    <>
      {/* Top Manga Navigation Folio Bar */}
      <nav
        className={`manga-top-navbar ${isVisible || isOpen ? 'is-visible' : 'is-hidden'}`}
        aria-label="Tankōbon Manga Navigation Bar"
      >
        <div className="manga-nav-inner">
          {/* Left: Identity & Active Chapter Badge */}
          <div className="manga-nav-left">
            <button
              type="button"
              className="manga-logo-btn"
              onClick={() => scrollTo('hero')}
              aria-label="Return to Cover"
            >
              <span className="logo-kanji">巻一</span>
              <span className="logo-text">BALAM RENEESH</span>
            </button>
            <span className="manga-nav-sep" aria-hidden="true">/</span>
            <div className="manga-current-indicator">
              <span className="indicator-vol">第{activeItem.kanji}話</span>
              <span className="indicator-title">{activeItem.title}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="manga-nav-right">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="manga-nav-link resume-link"
              aria-label="Open Resume Document"
            >
              <span className="link-kanji">履歴</span>
              <span className="link-text">[ RESUME ↗ ]</span>
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="manga-nav-btn toc-btn"
              aria-label="Open Table of Contents (目次)"
            >
              <span className="btn-kanji">目次</span>
              <span className="btn-text">[ CONTENTS ☰ ]</span>
            </button>
          </div>
        </div>

        {/* Ink Progress Rule */}
        <div className="manga-nav-progress-track" aria-hidden="true">
          <div
            className="manga-nav-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </nav>

      {/* Full-Screen Japanese Table of Contents (目次) Spread Modal */}
      {isOpen && (
        <div
          ref={dialogRef}
          className="manga-toc-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Manga Table of Contents"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="manga-toc-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Folio Header */}
            <div className="manga-toc-folio-bar">
              <div className="toc-folio-left">
                <span className="toc-kanji-badge">目次</span>
                <span className="toc-folio-text">
                  TANKŌBON VOL. 01 // TABLE OF CONTENTS · 全八話
                </span>
              </div>
              <button
                type="button"
                className="toc-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Table of Contents"
              >
                CLOSE [ ✕ ]
              </button>
            </div>

            {/* Chapters Grid Viewport */}
            <div className="manga-toc-grid-viewport">
              <div className="manga-toc-intro-header">
                <h2 className="toc-main-headline">TABLE OF CONTENTS</h2>
                <p className="toc-sub-headline">
                  SELECT A CHAPTER VOLUME TO JUMP ACROSS THE STORY SPREAD
                </p>
              </div>

              <div className="manga-toc-chapters-grid">
                {chapters.map((chap) => {
                  const isActive = activeChapter === chap.id;
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => scrollTo(chap.id)}
                      className={`manga-toc-card ${isActive ? 'is-active' : ''}`}
                    >
                      <div className="toc-card-top">
                        <div className="toc-card-num-group">
                          <span className="toc-kanji-num">{chap.kanji}</span>
                          <span className="toc-num-tag">CHAPTER {chap.number}</span>
                        </div>
                        <span className="toc-page-tag">{chap.page}</span>
                      </div>

                      <div className="toc-card-body">
                        <h3 className="toc-chapter-title">{chap.title}</h3>
                        <p className="toc-chapter-subtitle">{chap.subtitle}</p>
                      </div>

                      <div className="toc-card-bottom">
                        <span className="toc-jump-prompt">READ SPREAD ➔</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}