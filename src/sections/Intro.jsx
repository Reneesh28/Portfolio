import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Volume2, VolumeX } from 'lucide-react';
import { lazy, Suspense } from 'react';
const DimensionRift = lazy(() => import('../components/three/DimensionRift'));

const Intro = ({ onFinish }) => {
  const containerRef = useRef(null);
  const sequenceRef = useRef(null);

  // Refs for sequence elements
  const gridLinesRef = useRef(null);
  const panel1Ref = useRef(null);
  const panel2Ref = useRef(null);
  const panel3Ref = useRef(null);
  const universeRef = useRef(null);
  const titleRef = useRef(null);
  const breakoutRef = useRef(null);
  const riftRef = useRef(null);
  const impactStampRef = useRef(null);

  const [reducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleSkip = React.useCallback(() => {
    if (sequenceRef.current) sequenceRef.current.kill();
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onFinish
    });
  }, [onFinish]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  useEffect(() => {
    if (reducedMotion) {
      const tl = gsap.timeline({ onComplete: onFinish });
      tl.to(containerRef.current, { opacity: 0, duration: 1, delay: 0.5 });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Seamless transition - fade out intro layer to reveal Hero underneath
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: onFinish
        });
      }
    });

    // 1. Pencil-drawn page construction (grid lines animating in)
    tl.to(containerRef.current, { backgroundColor: 'var(--color-paper)', duration: 0.2 })
      .to('.pencil-line-h', { scaleX: 1, duration: 0.4, stagger: 0.1, ease: "power2.inOut" })
      .to('.pencil-line-v', { scaleY: 1, duration: 0.4, stagger: 0.1, ease: "power2.inOut" }, "-=0.3");

    // 2. Student / Builder / Engineer Panels
    tl.to(panel1Ref.current, { opacity: 1, y: 0, duration: 0.3 })
      .to(panel2Ref.current, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
      .to(panel3Ref.current, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
      .to([panel1Ref.current, panel2Ref.current, panel3Ref.current, gridLinesRef.current], { opacity: 0, duration: 0.3, delay: 0.5 });

    // 3. Three colliding technical universes — now with a real 3D dimension-rift bleeding through
    tl.set(universeRef.current, { opacity: 1 })
      .to(riftRef.current, { opacity: 1, duration: 0.3 }, "<")
      .fromTo('.universe-c', { x: -300, y: -300, scale: 0 }, { x: -20, y: -20, scale: 1, opacity: 0.8, duration: 0.4, ease: "back.out(1.7)" })
      .fromTo('.universe-m', { x: 300, y: -300, scale: 0 }, { x: 20, y: 20, scale: 1, opacity: 0.8, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2")
      .fromTo('.universe-y', { x: 0, y: 300, scale: 0 }, { x: 0, y: 0, scale: 1, opacity: 0.8, duration: 0.4, ease: "back.out(1.7)" }, "-=0.2")
      .to('.universe-circle', { scale: 15, opacity: 0, duration: 0.4, ease: "power2.in" }, "+=0.3")
      // Collision climax: camera-shake punch through the whole frame
      .to(containerRef.current, { x: 'random(-10,10)', y: 'random(-8,8)', duration: 0.04, repeat: 5, yoyo: true }, "<")
      .set(containerRef.current, { x: 0, y: 0 });

    // 4. Cover Title — stamped in like an impact panel
    tl.set(containerRef.current, { backgroundColor: 'var(--color-ink-black)' })
      .fromTo(titleRef.current, { opacity: 0, scale: 2.2, rotation: -6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.28, ease: "power4.in" })
      .to(titleRef.current, { scale: 1.06, duration: 0.06 })
      .to(titleRef.current, { scale: 1, duration: 0.16, ease: "elastic.out(1, 0.4)" })
      .to(containerRef.current, { x: 'random(-6,6)', y: 'random(-5,5)', duration: 0.04, repeat: 3, yoyo: true }, "<")
      .set(containerRef.current, { x: 0, y: 0 })
      .to('.cmyk-title', { x: (i) => (i === 0 ? -6 : i === 1 ? 6 : -2), y: (i) => (i === 0 ? 4 : i === 1 ? -4 : -6), duration: 0.1, stagger: 0.05 }, "+=0.1");

    // 5. Codewalker breaking through the cover — glass shatter + impact stamp + rift fade
    tl.set(breakoutRef.current, { opacity: 1 })
      .fromTo('.breakout-glass', { scale: 0, opacity: 1 }, { scale: 2, opacity: 0, duration: 0.3, ease: "power2.out" })
      .fromTo('.codewalker-intro', { scale: 0.5, y: 200, opacity: 0 }, { scale: 1.5, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" })
      .fromTo(impactStampRef.current, { opacity: 0, scale: 2.5, rotation: -14 }, { opacity: 1, scale: 1, rotation: -8, duration: 0.18, ease: "power4.in" }, "<")
      .to(containerRef.current, { x: 'random(-8,8)', y: 'random(-6,6)', duration: 0.05, repeat: 4, yoyo: true }, "<")
      .set(containerRef.current, { x: 0, y: 0 })
      .to(impactStampRef.current, { opacity: 0, scale: 1.4, duration: 0.4, ease: "power1.in" }, "+=0.3")
      .to(riftRef.current, { opacity: 0, duration: 0.4 }, "<")
      .to({}, { duration: 0.4 }); // Hold for impact before fading

    sequenceRef.current = tl;

    return () => {
      if (sequenceRef.current) sequenceRef.current.kill();
    };
  }, [reducedMotion, onFinish]);

  const handleAccelerate = () => {
    if (sequenceRef.current && sequenceRef.current.timeScale() < 3) {
      sequenceRef.current.timeScale(sequenceRef.current.timeScale() * 1.5);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleAccelerate}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-ink-black)] overflow-hidden cursor-pointer"
    >
      {/* Controls */}
      <div className="absolute top-8 right-8 z-50 flex gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); setSoundEnabled(!soundEnabled); }}
          className="p-2 bg-[var(--color-paper)] border-2 border-[var(--color-ink-black)] text-[var(--color-ink-black)] hover:bg-[var(--color-comic-yellow)] transition-colors comic-focus"
          aria-label={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleSkip(); }}
          className="px-4 py-2 bg-[var(--color-paper)] border-2 border-[var(--color-ink-black)] text-[var(--color-ink-black)] hover:bg-[var(--color-portal-cyan)] font-label uppercase font-bold transition-colors comic-focus"
        >
          SKIP
        </button>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">

        {/* Phase 1: Pencil Grid */}
        <div ref={gridLinesRef} className="absolute inset-0 opacity-50">
          <div className="pencil-line-h absolute top-1/3 left-0 w-full h-[2px] bg-[var(--color-pencil-gray)] origin-left scale-x-0"></div>
          <div className="pencil-line-h absolute top-2/3 left-0 w-full h-[2px] bg-[var(--color-pencil-gray)] origin-left scale-x-0"></div>
          <div className="pencil-line-v absolute top-0 left-1/3 w-[2px] h-full bg-[var(--color-pencil-gray)] origin-top scale-y-0"></div>
          <div className="pencil-line-v absolute top-0 left-2/3 w-[2px] h-full bg-[var(--color-pencil-gray)] origin-top scale-y-0"></div>
        </div>

        {/* 3D dimension-rift: bleeds through from the universe-collision onward */}
        <div ref={riftRef} className="absolute inset-0 opacity-0 pointer-events-none">
          <Suspense fallback={null}><DimensionRift density={20} /></Suspense>
        </div>


        {/* Phase 2: Panels */}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <div ref={panel1Ref} className="opacity-0 translate-y-8 bg-white border-4 border-[var(--color-ink-black)] p-4 shadow-[8px_8px_0_var(--color-ink-black)] rotate-[-5deg]">
            <h2 className="font-display text-4xl text-[var(--color-ink-black)]">STUDENT</h2>
          </div>
          <div ref={panel2Ref} className="opacity-0 translate-y-8 bg-[var(--color-comic-yellow)] border-4 border-[var(--color-ink-black)] p-4 shadow-[8px_8px_0_var(--color-ink-black)] rotate-[2deg]">
            <h2 className="font-display text-4xl text-[var(--color-ink-black)]">BUILDER</h2>
          </div>
          <div ref={panel3Ref} className="opacity-0 translate-y-8 bg-[var(--color-portal-cyan)] border-4 border-[var(--color-ink-black)] p-4 shadow-[8px_8px_0_var(--color-ink-black)] rotate-[-3deg]">
            <h2 className="font-display text-4xl text-[var(--color-ink-black)]">ENGINEER</h2>
          </div>
        </div>

        {/* Phase 3: Colliding Universes */}
        <div ref={universeRef} className="absolute inset-0 flex items-center justify-center opacity-0 mix-blend-screen">
          <div className="universe-circle universe-c absolute w-64 h-64 rounded-full bg-[var(--color-portal-cyan)] mix-blend-screen"></div>
          <div className="universe-circle universe-m absolute w-64 h-64 rounded-full bg-[var(--color-dimension-magenta)] mix-blend-screen"></div>
          <div className="universe-circle universe-y absolute w-64 h-64 rounded-full bg-[var(--color-comic-yellow)] mix-blend-screen"></div>
        </div>

        {/* Phase 4 & 5: Cover and Breakout */}
        <div ref={titleRef} className="absolute opacity-0 scale-90 flex flex-col items-center justify-center w-full z-20">
          <p className="font-label uppercase tracking-[0.3em] text-[var(--color-comic-yellow)] mb-4 text-sm md:text-base">Issue #01 &middot; Earth-28</p>
          <div className="relative w-full text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-text-on-dark)] relative z-10 mix-blend-normal">RENEESH</h1>
            <h1 className="cmyk-title absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-dimension-magenta)] z-0 mix-blend-screen">RENEESH</h1>
            <h1 className="cmyk-title absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-portal-cyan)] z-0 mix-blend-screen">RENEESH</h1>
            <h1 className="cmyk-title absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-comic-yellow)] z-0 mix-blend-screen">RENEESH</h1>
          </div>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl tracking-widest text-[var(--color-text-on-dark)] mt-4 text-center">ACROSS THE CODEVERSE</h2>
        </div>

        {/* Codewalker Breakout */}
        <div ref={breakoutRef} className="absolute inset-0 flex items-center justify-center opacity-0 z-30 pointer-events-none overflow-visible">
          <div className="breakout-glass absolute w-full h-full bg-white opacity-0"></div>
          <img
            src="/src/assets/images/codewalker.webp"
            alt="The Codewalker"
            className="codewalker-intro max-h-[80vh] object-contain drop-shadow-[0_0_30px_rgba(0,255,255,0.8)]"
          />
          <span
            ref={impactStampRef}
            aria-hidden="true"
            className="absolute top-1/4 right-[10%] font-display uppercase text-4xl md:text-6xl opacity-0 pointer-events-none z-40"
            style={{ color: 'var(--color-signal-red)', textShadow: '3px 3px 0 var(--color-ink-black)' }}
          >
            CRASH!
          </span>
        </div>

      </div>
    </div>
  );
};

export default Intro;