import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GenreIndex from '../components/hero/GenreIndex';
import MangaProtagonistPanel from '../components/hero/MangaProtagonistPanel';
import SupportingMangaPanels from '../components/hero/SupportingMangaPanels';
import MangaGenreAtmosphere from '../components/hero/MangaGenreAtmosphere';
import MangaExpandedModal from '../components/hero/MangaExpandedModal';
import { heroAudio } from '../components/hero/HeroAudio';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ isIntroActive = false }) {
  const sectionRef = useRef(null);
  const spreadRef = useRef(null);
  const identityColRef = useRef(null);
  const protagonistColRef = useRef(null);
  const systemsColRef = useRef(null);

  // Default genre is SEINEN (Engineering / Maturity / Depth)
  const [activeGenre, setActiveGenre] = useState('seinen');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Active expanded panel modal: null | 'protagonist' | 'ai' | 'creative' | 'akogare' | 'identity_seal'
  const [activeModal, setActiveModal] = useState(null);

  // Toggle Audio Play / Pause
  const handleToggleAudio = useCallback(() => {
    if (heroAudio.isPlaying) {
      heroAudio.pause();
      setIsAudioPlaying(false);
    } else {
      heroAudio.play().then((playing) => {
        setIsAudioPlaying(playing);
      });
    }
  }, []);

  // Audio Playback Lifecycle — Only triggers after Intro completes and lands on Hero
  useEffect(() => {
    // Listen for playback state changes (e.g. track ends)
    heroAudio.onStateChange = (playing) => {
      setIsAudioPlaying(playing);
    };

    // If Intro is currently active, prevent Hero audio
    if (isIntroActive) {
      heroAudio.pause();
      setIsAudioPlaying(false);
      return;
    }

    heroAudio.playOnceOnFirstLanding().then((playing) => {
      setIsAudioPlaying(playing);
    });

    const handleFirstUserInteraction = () => {
      if (isIntroActive) return;
      heroAudio.playOnceOnFirstLanding().then((playing) => {
        setIsAudioPlaying(playing);
      });
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      heroAudio.onStateChange = null;
    };
  }, [isIntroActive]);

  // Stop audio as soon as the user scrolls away from Hero section
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Re-enter Hero section: resume if previously active, not finished, and not muted
            if (heroAudio.hasAutoPlayed && !heroAudio.hasFinishedPlaying && !heroAudio.isMuted) {
              heroAudio.play().then((playing) => {
                setIsAudioPlaying(playing);
              });
            }
          } else {
            // Scrolled away from Hero section: pause immediately
            heroAudio.pause();
            setIsAudioPlaying(false);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      heroAudio.pause();
    };
  }, []);

  // GSAP MatchMedia & Scroll Experience
  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set([identityColRef.current, protagonistColRef.current, systemsColRef.current], {
            opacity: 1,
            y: 0,
          });
          return;
        }

        // Entrance animation on initial load / intro completion
        const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        entranceTl
          .fromTo(
            spreadRef.current,
            { scale: 0.96, opacity: 0, y: 30 },
            { scale: 1, opacity: 1, y: 0, duration: 0.9 }
          )
          .fromTo(
            identityColRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7 },
            '-=0.5'
          )
          .fromTo(
            protagonistColRef.current,
            { scale: 0.92, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8 },
            '-=0.6'
          )
          .fromTo(
            systemsColRef.current,
            { x: 30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.7 },
            '-=0.6'
          );

        // Subtle Mouse Parallax on Desktop
        if (isDesktop) {
          const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xOffset = (clientX / window.innerWidth - 0.5) * 12;
            const yOffset = (clientY / window.innerHeight - 0.5) * 12;

            gsap.to(protagonistColRef.current, {
              x: xOffset * 1.2,
              y: yOffset * 1.2,
              duration: 0.8,
              ease: 'power1.out',
            });
            gsap.to(identityColRef.current, {
              x: -xOffset * 0.5,
              y: -yOffset * 0.5,
              duration: 0.8,
              ease: 'power1.out',
            });
            gsap.to(systemsColRef.current, {
              x: xOffset * 0.6,
              y: yOffset * 0.6,
              duration: 0.8,
              ease: 'power1.out',
            });
          };

          window.addEventListener('mousemove', handleMouseMove);

          // Scroll-driven manga spread expansion leading toward About
          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=80%',
              scrub: 0.6,
            },
          });

          scrollTl
            .to(
              protagonistColRef.current,
              {
                scale: 1.04,
                y: -20,
                duration: 1,
              },
              0
            )
            .to(
              identityColRef.current,
              {
                opacity: 0.85,
                x: -25,
                duration: 1,
              },
              0
            )
            .to(
              systemsColRef.current,
              {
                opacity: 0.85,
                x: 25,
                duration: 1,
              },
              0
            );

          return () => {
            window.removeEventListener('mousemove', handleMouseMove);
          };
        }
      }
    );

    return () => mm.revert();
  }, []);

  // Handle Genre Transition Animation
  const handleSelectGenre = (genreId) => {
    if (genreId === activeGenre) return;

    setActiveGenre(genreId);

    // Subtle physical panel ink impulse
    if (protagonistColRef.current) {
      gsap.fromTo(
        protagonistColRef.current,
        { scale: 0.98 },
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="manga-hero-root"
      aria-label="Protagonist Character Introduction"
    >
      {/* Genre Visual Atmosphere & Screentone Layer */}
      <MangaGenreAtmosphere activeGenre={activeGenre} />

      {/* Main Manga Double Spread Container */}
      <div ref={spreadRef} className="manga-hero-spread">
        {/* Top Folio Header (Tankobon Publishing Format) */}
        <header className="manga-spread-top-folio">
          <div className="folio-left">
            <span className="folio-kanji">第壱話</span>
            <span className="folio-title">CHAPTER 01 // PROTAGONIST INTRODUCTION</span>
          </div>
          <div className="folio-center">
            <span>BALAM RENEESH · MANGA PORTFOLIO</span>
          </div>
          <div className="folio-right">
            {/* Manga Audio BGM Controller */}
            <button
              type="button"
              className={`hero-audio-folio-btn ${isAudioPlaying ? 'is-playing' : ''}`}
              onClick={handleToggleAudio}
              aria-label="Toggle Hero Background Music"
              title={isAudioPlaying ? 'Turn BGM OFF' : 'Turn BGM ON'}
            >
              <span className="hero-audio-glyph">{isAudioPlaying ? '♪' : '✕'}</span>
              <span className="hero-audio-text">{isAudioPlaying ? 'BGM: ON' : 'BGM: OFF'}</span>
            </button>
            <span>VOL.01 SPREAD [02-03]</span>
            <span className="folio-kanji">開館</span>
          </div>
        </header>

        {/* Spread Body: 3-Column Asymmetrical Manga Grid */}
        <div className="manga-spread-body">
          {/* Col 1: Identity, Name & Japanese Marks */}
          <div ref={identityColRef} className="manga-hero-col-identity">
            <div className="manga-identity-block">
              {/* Subtle Manga Character Designation */}
              <div className="protagonist-kicker-strip">
                <span className="kicker-kanji">主人公</span>
                <span className="kicker-en">SHUJINKŌ · PROTAGONIST</span>
              </div>

              {/* Primary Name Typography */}
              <h1 className="protagonist-name-headline">
                <span className="name-first">BALAM</span>
                <span className="name-last">
                  RENEESH
                  <span className="name-last-accent" aria-hidden="true"></span>
                </span>
              </h1>

              {/* Professional Identity */}
              <div className="protagonist-role-banner">
                <span className="role-banner-text">
                  AI / SOFTWARE / CREATIVE BUILDER
                </span>
              </div>

              {/* Editorial Introduction Summary */}
              <p className="protagonist-bio-editorial">
                Architecting intelligent software systems, generative intelligence architectures,
                and immersive interactive experiences across the computational frontier.
              </p>
            </div>

            {/* Japanese Artistic Identity Area: 憧れ (Akogare) & 一匹狼 (Ippiki Ōkami) - Clickable */}
            <div
              className="japanese-emblem-box is-interactive"
              onClick={() => setActiveModal('identity_seal')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModal('identity_seal');
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Trigger Japanese Identity Seal Animation"
            >
              <div className="emblem-top-row">
                <span className="emblem-title">JAPANESE IDENTITY MARK</span>
                <span className="emblem-ippiki">一匹狼 // LONE WOLF</span>
              </div>
              <div className="emblem-main-visual">
                <span className="emblem-kanji-huge">憧れ</span>
                <div className="emblem-romaji-group">
                  <span className="emblem-romaji">AKOGARE</span>
                  <span className="emblem-meaning">ASPIRATION · YEARNING FOR MASTERY</span>
                </div>
              </div>
              <div className="emblem-inspect-tag" aria-hidden="true">
                <span>[ IDENTITY SEAL ⊕ ]</span>
              </div>
            </div>
          </div>

          {/* Col 2: Dominant Main Manga Character Panel - Clickable */}
          <div ref={protagonistColRef} className="manga-hero-col-protagonist">
            <MangaProtagonistPanel
              activeGenre={activeGenre}
              onOpenProfile={() => setActiveModal('protagonist')}
            />
          </div>

          {/* Col 3: Editorial Genre Classification Index & Supporting Panels */}
          <div ref={systemsColRef} className="manga-hero-col-systems">
            {/* Genre Classification Index (7 Manga Genres) */}
            <GenreIndex
              activeGenre={activeGenre}
              onSelectGenre={handleSelectGenre}
            />

            {/* 2-3 Asymmetrical Supporting Manga Panels - Clickable */}
            <SupportingMangaPanels
              activeGenre={activeGenre}
              onOpenAI={() => setActiveModal('ai')}
              onOpenCreative={() => setActiveModal('creative')}
              onOpenAkogare={() => setActiveModal('akogare')}
            />
          </div>
        </div>

        {/* Bottom Folio Gutter & Reading Advance Indicator */}
        <footer className="manga-spread-bottom-gutter">
          <div className="gutter-left">
            <span>© 2026 BALAM RENEESH · ALL CHAPTERS REGISTERED</span>
          </div>
          <div className="scroll-indicator-manga">
            <span>[ SCROLL TO ADVANCE MANGA SPREAD // 次頁へ </span>
            <span aria-hidden="true">↓ ]</span>
          </div>
          <div className="gutter-right">
            <span>TANKOBON FORMAT // 1560 × 980</span>
          </div>
        </footer>
      </div>

      {/* Expanded Manga Spread Modal Overlay */}
      <MangaExpandedModal
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
        activeGenre={activeGenre}
      />
    </section>
  );
}