import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import MangaBook3D from '../components/intro/MangaBook3D';
import MangaPanels from '../components/intro/MangaPanels';
import MangaOverlay from '../components/intro/MangaOverlay';
import { introAudio } from '../components/intro/IntroAudio';
import './Intro.css';

export default function Intro({ onFinish }) {
  const rootRef = useRef(null);
  const panelsRef = useRef(null);
  const timelineRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    isMuted: false,
    autoplayBlocked: false,
  });

  // 3D Book State driven by GSAP
  const [bookState, setBookState] = useState({
    openProgress: 0,
    bookRotation: [0.25, -0.35, 0.05],
    scale: 1,
    opacity: 0,
  });

  const reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Clean finish handler
  const handleFinish = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    introAudio.fadeAndStop(500);

    if (rootRef.current) {
      gsap.to(rootRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: reducedMotion ? 0.3 : 0.6,
        ease: 'power3.inOut',
        onComplete: () => {
          introAudio.cleanup();
          onFinish?.();
        },
      });
    } else {
      introAudio.cleanup();
      onFinish?.();
    }
  }, [onFinish, reducedMotion]);

  // Toggle audio mute & start playback if paused
  const toggleMute = useCallback((e) => {
    e?.stopPropagation?.();
    const currentSyncTime = timelineRef.current ? timelineRef.current.time() : 0;
    const muted = introAudio.toggleMute(currentSyncTime);
    setIsMuted(muted);
  }, []);

  // Keyboard accessibility: ESC to skip
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFinish]);

  // Autoplay audio with interaction fallback for browser restrictions
  useEffect(() => {
    introAudio.onStateChange = (state) => {
      setAudioState(state);
      setIsMuted(state.isMuted);
    };

    // Attempt autoplay immediately
    introAudio.play(0);

    const handleFirstInteraction = () => {
      if (!introAudio.isPlaying && !introAudio.isMuted) {
        const currentSyncTime = timelineRef.current ? timelineRef.current.time() : 0;
        introAudio.play(currentSyncTime);
      }
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    window.addEventListener('pointerdown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('pointerdown', handleFirstInteraction);
      introAudio.onStateChange = null;
    };
  }, []);

  // Master GSAP Animation Timeline
  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // Reduced motion timeline
      if (reducedMotion) {
        const tl = gsap.timeline({
          paused: false,
          onComplete: handleFinish,
        });

        tl.set('.manga-phase-climax', { opacity: 1, display: 'flex' })
          .fromTo('.manga-double-page-spread', { opacity: 0 }, { opacity: 1, duration: 1.2 })
          .to({}, { duration: 2.0 });

        timelineRef.current = tl;
        return;
      }

      // Full Master Manga Cinematic Sequence (~15.0 seconds matching the music structure)
      const tl = gsap.timeline({
        paused: false,
        defaults: { ease: 'power3.out' },
        onUpdate: () => {
          setTimelineProgress(tl.progress());
        },
        onComplete: handleFinish,
      });

      // Initial States
      gsap.set('.intro-sublayer', { opacity: 0, display: 'none' });
      gsap.set('.manga-book-3d-wrapper', { opacity: 0 });
      gsap.set('.identity-stamp', { opacity: 0, scale: 2.2 });
      gsap.set('.ink-mark', { opacity: 0, scale: 0 });

      // =========================================================
      // BEAT 01 & IDENTITY (0.0s → ~3.75s): BRUSH REVEAL / 憧 / 憧れ / 一匹狼 / IPPIKI ŌKAMI
      // =========================================================
      tl.set('.manga-phase-1', { display: 'flex', opacity: 1 })
        .fromTo(
          '.prologue-header',
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          0.1
        )
        .fromTo(
          '.brush-path',
          { strokeDasharray: 800, strokeDashoffset: 800 },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut' },
          0.2
        )
        // Primary 憧 mark emerges organically from ink in negative space
        .fromTo(
          '.primary-akogare-stage',
          { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' },
          0.8
        )
        .fromTo(
          '.akogare-ink-aura',
          { scale: 0.5, opacity: 0 },
          { scale: 1.4, opacity: 0.25, duration: 1.2, ease: 'power2.out' },
          0.8
        )
        .fromTo(
          '.ippiki-identity-strip',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          2.0
        )
        .to('.manga-phase-1', { opacity: 0, duration: 0.35, ease: 'power2.in' }, 3.35);

      // =========================================================
      // BEAT 02 (Around 3.75s → 5.0s): HANKO SEAL VISUAL IMPRESSION
      // =========================================================
      tl.set('.manga-phase-hanko', { display: 'flex', opacity: 1 }, 3.7)
        .fromTo(
          '.hanko-seal-slam-target',
          { opacity: 0, scale: 2.6, rotation: -12 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.32, ease: 'back.out(2.4)' },
          3.75
        )
        .fromTo(
          '.hanko-ink-spread-ring',
          { scale: 0.5, opacity: 1 },
          { scale: 2.0, opacity: 0, duration: 0.45, ease: 'power2.out' },
          3.75
        )
        .to('.manga-phase-hanko', { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in' }, 4.7);

      // =========================================================
      // BEAT 03 & 04 (5.0s → 6.5s): 3D MANGA VOLUME & BOOK OPENS
      // =========================================================
      const bookProxy = {
        rotX: 0.28,
        rotY: -0.45,
        rotZ: 0.05,
        scale: 0.85,
        open: 0,
        opacity: 0,
      };

      tl.set('.manga-book-3d-wrapper', { display: 'block', opacity: 1 }, 5.0)
        // Book appears & camera approaches (5.0s -> 5.8s)
        .to(bookProxy, {
          opacity: 1,
          scale: 1,
          rotX: 0.15,
          rotY: -0.2,
          duration: 0.8,
          ease: 'power2.out',
          onUpdate: () => {
            setBookState({
              openProgress: bookProxy.open,
              bookRotation: [bookProxy.rotX, bookProxy.rotY, bookProxy.rotZ],
              scale: bookProxy.scale,
              opacity: bookProxy.opacity,
            });
          },
        }, 5.0)
        // BEAT 04: Book cover swings open naturally on spine (5.8s -> 6.5s)
        .to(bookProxy, {
          open: 1,
          rotX: 0.0,
          rotY: 0.0,
          scale: 1.4,
          duration: 0.7,
          ease: 'power2.inOut',
          onUpdate: () => {
            setBookState({
              openProgress: bookProxy.open,
              bookRotation: [bookProxy.rotX, bookProxy.rotY, bookProxy.rotZ],
              scale: bookProxy.scale,
              opacity: bookProxy.opacity,
            });
          },
        }, 5.8)
        .to('.manga-book-3d-wrapper', { opacity: 0, duration: 0.25, ease: 'power2.in' }, 6.5);

      // =========================================================
      // BEAT 05 & STAMPS (6.5s → 12.5s): RAPID PAGES, 6 STAMPS, 7 INK MARKS
      // =========================================================
      tl.set('.manga-phase-spread', { display: 'flex', opacity: 1 }, 6.5)
        // Panels enter
        .fromTo(
          '.panel-top',
          { opacity: 0, y: -40, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
          { opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.45, ease: 'power3.out' },
          6.6
        )
        .fromTo(
          '.sfx-gogogo',
          { opacity: 0, scale: 0.5, rotation: -10 },
          { opacity: 1, scale: 1, rotation: 0, duration: 0.25, ease: 'back.out(2)' },
          6.8
        )
        // Stamp 01: CEO
        .fromTo(
          '.stamp-ceo',
          { opacity: 0, scale: 2.2, rotation: -8 },
          { opacity: 1, scale: 1, rotation: -3, duration: 0.28, ease: 'back.out(2.2)' },
          7.1
        )
        .fromTo(
          '.panel-mid-left',
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
          7.3
        )
        // Stamp 02: STARTUP INTERN & Stamp 03: FREELANCER
        .fromTo(
          '.stamp-intern',
          { opacity: 0, scale: 2.2, rotation: 10 },
          { opacity: 1, scale: 1, rotation: 4, duration: 0.28, ease: 'back.out(2.2)' },
          7.8
        )
        .fromTo(
          '.stamp-freelancer',
          { opacity: 0, scale: 2.2, rotation: -6 },
          { opacity: 1, scale: 1, rotation: -2, duration: 0.28, ease: 'back.out(2.2)' },
          8.4
        )
        .fromTo(
          '.panel-mid-right',
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
          8.5
        )
        .fromTo(
          '.sfx-don',
          { opacity: 0, scale: 2.2 },
          { opacity: 1, scale: 1, duration: 0.2, ease: 'steps(4)' },
          8.7
        )
        // Stamp 04: CO-FOUNDER & Stamp 05: INDIE GAME DEVELOPER
        .fromTo(
          '.stamp-cofounder',
          { opacity: 0, scale: 2.2, rotation: 8 },
          { opacity: 1, scale: 1, rotation: 2, duration: 0.28, ease: 'back.out(2.2)' },
          9.1
        )
        .fromTo(
          '.stamp-gamedev',
          { opacity: 0, scale: 2.2, rotation: -10 },
          { opacity: 1, scale: 1, rotation: -5, duration: 0.28, ease: 'back.out(2.2)' },
          9.7
        )
        .fromTo(
          '.panel-bottom',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' },
          10.0
        )
        .fromTo(
          '.sfx-zuba',
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 0.25, ease: 'power4.out' },
          10.2
        )
        // Stamp 06: 憧れ / Akogare
        .fromTo(
          '.stamp-akogare',
          { opacity: 0, scale: 2.2, rotation: 6 },
          { opacity: 1, scale: 1, rotation: 1, duration: 0.28, ease: 'back.out(2.2)' },
          10.5
        );

      // SEVEN SHORT ABSTRACT VISUAL INK MARKS (Rhythmic punctuation ~7.5s - 11.25s)
      const inkMarkTimings = [7.5, 8.125, 8.75, 9.375, 10.0, 10.625, 11.25];
      inkMarkTimings.forEach((startTime, idx) => {
        tl.fromTo(
          `.mark-${idx}`,
          { opacity: 0, scale: 0.3, rotation: idx * 45 },
          { opacity: 1, scale: 1.2, duration: 0.12, ease: 'power4.out' },
          startTime
        ).to(
          `.mark-${idx}`,
          { opacity: 0, scale: 1.6, duration: 0.18, ease: 'power2.in' },
          startTime + 0.12
        );
      });

      // Panels collide & accelerate toward major impact
      tl.to(
        '.manga-page-frame',
        { scale: 1.18, duration: 1.1, ease: 'power2.in' },
        11.4
      ).to('.manga-phase-spread', { opacity: 0, duration: 0.15 }, 12.45);

      // =========================================================
      // BEAT 06 & 07 (12.5s → 15.0s): MAJOR IMPACT / FREEZE / FINAL SPREAD / TRANSFORMATION
      // =========================================================
      tl.set('.manga-phase-climax', { display: 'flex', opacity: 1 }, 12.5)
        // Major Visual Impact on downbeat at 12.5s
        .fromTo(
          '.climax-speed-burst',
          { opacity: 0, scale: 0.4 },
          { opacity: 1, scale: 1.5, duration: 0.2, ease: 'power4.out' },
          12.5
        )
        // Sudden Freeze & Final Double-Page Spread Appearance
        .fromTo(
          '.manga-double-page-spread',
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' },
          12.55
        )
        .fromTo(
          '.spread-left, .spread-right',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: 'power2.out' },
          12.65
        )
        // BEAT 07 (13.25s → 15.0s): Final Ink/Paper Transition into the Website
        .fromTo(
          '.break-top, .break-bottom',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power4.out' },
          13.25
        )
        .fromTo(
          '.break-left, .break-right',
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: 'power4.out' },
          13.25
        )
        .to(
          '.manga-double-page-spread',
          { scale: 1.04, duration: 1.4, ease: 'power1.inOut' },
          13.4
        )
        .to({}, { duration: 0.2 }, 15.0);

      timelineRef.current = tl;
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [handleFinish, reducedMotion]);

  // Clean up audio and timeline on component unmount
  useEffect(() => {
    return () => {
      introAudio.cleanup();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="manga-intro-root"
      role="region"
      aria-label="Portfolio Manga Intro Cinematic"
      onClick={() => {
        if (!introAudio.isPlaying && !introAudio.isMuted) {
          const currentSyncTime = timelineRef.current ? timelineRef.current.time() : 0;
          introAudio.play(currentSyncTime);
        }
      }}
    >
      {/* 2D Manga Panels Layer */}
      <MangaPanels panelsRef={panelsRef} />

      {/* 3D Manga Volume Canvas Layer (Rendered only during 3D phase for high performance) */}
      <div
        className="manga-book-3d-wrapper"
        style={{
          opacity: bookState.opacity,
          pointerEvents: 'none',
        }}
      >
        {!reducedMotion && (
          <MangaBook3D
            openProgress={bookState.openProgress}
            bookRotation={bookState.bookRotation}
            scale={bookState.scale}
          />
        )}
      </div>

      {/* Overlay & Interactive Controls */}
      <MangaOverlay
        onSkip={handleFinish}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        progress={timelineProgress}
        isPlaying={audioState.isPlaying}
        autoplayBlocked={audioState.autoplayBlocked}
      />
    </div>
  );
}