import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Intro = ({ onFinish }) => {
  const containerRef = useRef(null);
  const sequenceRef = useRef(null);
  
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const coverTitleRef = useRef(null);
  
  const [reducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const tl = gsap.timeline({ onComplete: onFinish });
      tl.to(containerRef.current, { opacity: 0, duration: 1, delay: 0.5 });
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onFinish
        });
      }
    });

    // 1. Blank Page
    tl.to(containerRef.current, { backgroundColor: 'var(--color-paper)', duration: 0.5, ease: "power2.inOut" })
      .to(text1Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "+=0.2")
      .to(text1Ref.current, { opacity: 0, y: -20, duration: 0.3 }, "+=1.0");

    // 2. Origin
    tl.to(text2Ref.current, { opacity: 1, y: 0, duration: 0.5 })
      .to(text2Ref.current, { opacity: 0, y: -20, duration: 0.3 }, "+=1.5");

    // 3. Identity Printing
    tl.to(containerRef.current, { backgroundColor: 'var(--color-ink-black)', duration: 0.3 })
      .to(coverTitleRef.current, { opacity: 1, scale: 1, duration: 0.1 })
      .to('.cmyk-layer-m', { x: 0, y: 0, duration: 0.15, ease: "steps(3)" }, "+=0.1")
      .to('.cmyk-layer-c', { x: 0, y: 0, duration: 0.15, ease: "steps(3)" }, "<")
      .to('.cmyk-layer-y', { x: 0, y: 0, duration: 0.15, ease: "steps(3)" }, "<")
      .to({}, { duration: 0.8 }); // Hold for impact

    sequenceRef.current = tl;

    return () => {
      if (sequenceRef.current) sequenceRef.current.kill();
    };
  }, [reducedMotion, onFinish]);

  const handleSkip = () => {
    if (sequenceRef.current) sequenceRef.current.kill();
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: onFinish
    });
  };

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
      <button 
        onClick={(e) => { e.stopPropagation(); handleSkip(); }}
        className="absolute bottom-8 right-8 z-50 font-label uppercase text-sm font-bold tracking-widest text-[var(--color-text-muted-dark)] hover:text-[var(--color-text-on-dark)] transition-colors comic-focus"
      >
        [SKIP INTRO]
      </button>

      <div className="relative z-10 w-full h-full flex items-center justify-center max-w-3xl px-6 pointer-events-none">
        
        <p ref={text1Ref} className="absolute flex items-center justify-center font-body text-xl md:text-3xl text-[var(--color-ink-black)] opacity-0 translate-y-4 font-medium italic text-center">
          "Every universe begins with a blank page."
        </p>
        
        <p ref={text2Ref} className="absolute flex items-center justify-center font-body text-lg md:text-2xl text-[var(--color-ink-black)] opacity-0 translate-y-4 font-medium leading-relaxed text-center">
          "Mine began with curiosity. One question became a thousand.<br/>So I started building answers."
        </p>

        <div ref={coverTitleRef} className="absolute opacity-0 scale-90 flex flex-col items-center justify-center w-full">
          <p className="font-label uppercase tracking-[0.3em] text-[var(--color-comic-yellow)] mb-4 text-sm md:text-base">Issue #01 · Earth-28</p>
          <div className="relative w-full text-center">
            <h1 className="font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-text-on-dark)] relative z-10 mix-blend-normal">RENEESH</h1>
            <h1 className="cmyk-layer-m absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-dimension-magenta)] -translate-x-6 translate-y-4 z-0 mix-blend-screen">RENEESH</h1>
            <h1 className="cmyk-layer-c absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-portal-cyan)] translate-x-6 -translate-y-4 z-0 mix-blend-screen">RENEESH</h1>
            <h1 className="cmyk-layer-y absolute top-0 left-0 w-full font-display text-5xl md:text-7xl lg:text-9xl tracking-wider text-[var(--color-comic-yellow)] -translate-x-2 -translate-y-6 z-0 mix-blend-screen">RENEESH</h1>
          </div>
          <h2 className="font-display text-2xl md:text-4xl lg:text-5xl tracking-widest text-[var(--color-text-on-dark)] mt-4 text-center">ACROSS THE CODEVERSE</h2>
        </div>
      </div>
    </div>
  );
};

export default Intro;
