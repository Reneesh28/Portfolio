import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const LatticeBackground = lazy(() =>
  import("../components/LatticeBackground")
);

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const revealBtnRef = useRef(null);
  const kanjiRef = useRef(null);

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ===============================
         CINEMATIC ENTRY — Ink fading in
      =============================== */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Background kanji watermark fades in
      tl.fromTo(
        kanjiRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 0.04, scale: 1, duration: 2, ease: "power2.out" }
      );

      // Title — appears blurred, like ink bleeding through paper
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 30, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(4px)", duration: 1.2 },
        "-=1.5"
      );

      // Role — dim and blurred
      tl.fromTo(
        roleRef.current,
        { opacity: 0, y: 15, filter: "blur(6px)" },
        { opacity: 0.4, y: 0, filter: "blur(3px)", duration: 0.8 },
        "-=0.6"
      );

      // Description — very dim and blurred
      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 10, filter: "blur(6px)" },
        { opacity: 0.25, y: 0, filter: "blur(3px)", duration: 0.8 },
        "-=0.5"
      );

      // Reveal button fades in
      tl.fromTo(
        revealBtnRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8 },
        "-=0.2"
      );

      /* ===============================
         SCROLL EXIT — Parallax departure
      =============================== */
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -80,
        scale: 0.95,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        ease: "none",
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleReveal = () => {
    // 1. Hide reveal button with a graceful exit
    gsap.to(revealBtnRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.4,
      onComplete: () => setIsRevealed(true)
    });

    // 2. Ink-brush reveal — text sharpens from blur to crystal clear
    gsap.to(titleRef.current, {
      filter: "blur(0px)",
      opacity: 1,
      color: "var(--text-main)",
      duration: 1.2,
      ease: "power2.out"
    });
    gsap.to(roleRef.current, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.0,
      delay: 0.15,
      ease: "power2.out"
    });
    gsap.to(descRef.current, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 1.0,
      delay: 0.3,
      ease: "power2.out"
    });

    // 3. Warm flash — kanji watermark pulses
    gsap.fromTo(kanjiRef.current,
      { opacity: 0.04 },
      { opacity: 0.08, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );

    // 4. Reveal action buttons
    gsap.fromTo(
      actionsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: "power3.out", display: "flex" }
    );
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-void)" }}
    >
      {/* Three.js Background — Sakura + Embers + Fog */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <LatticeBackground isDecrypted={isRevealed} />
        </Suspense>
      </div>

      {/* Background Kanji Watermark — 侍 (Samurai) */}
      <div
        ref={kanjiRef}
        className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none select-none opacity-0"
      >
        <span
          className="font-display text-[30vw] md:text-[25vw] font-bold"
          style={{ color: "var(--text-muted)" }}
        >
          侍
        </span>
      </div>

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            rgba(12,10,9,0.2) 0%, 
            rgba(12,10,9,0.6) 50%, 
            rgba(12,10,9,0.95) 100%
          )`
        }}
      />

      {/* HERO CONTENT */}
      <div
        ref={contentRef}
        className="
          relative z-20
          min-h-screen
          flex flex-col
          items-center
          justify-center
          text-center
          px-6
          will-change-transform
        "
      >
        {/* Decorative brush line above title */}
        <div
          className="w-16 h-[2px] mb-8 opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)"
          }}
        />

        <h1
          ref={titleRef}
          className="font-display font-bold tracking-tight leading-[1.1]
                     text-4xl sm:text-6xl md:text-8xl lg:text-9xl
                     cursor-default select-none
                     transition-colors duration-1000"
          style={{ color: "var(--text-muted)", filter: "blur(4px)" }}
        >
          Balam Reneesh
        </h1>

        <h2
          ref={roleRef}
          className="mt-6 font-accent font-medium tracking-[0.15em] uppercase
                     text-sm sm:text-lg md:text-2xl"
          style={{ color: "var(--accent)", filter: "blur(3px)" }}
        >
          Craftsman of Code · Architect of Systems
        </h2>

        <p
          ref={descRef}
          className="mt-8 text-sm sm:text-lg max-w-2xl font-body leading-relaxed"
          style={{ color: "var(--text-muted)", filter: "blur(3px)" }}
        >
          Forging intelligent systems with discipline and precision.
        </p>

        {/* The Gateway — Unsheathe Button */}
        {!isRevealed && (
          <div ref={revealBtnRef} className="mt-16 z-30">
            <Button
              onClick={handleReveal}
              variant="primary"
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 font-accent tracking-[0.2em] uppercase text-sm">
                Unsheathe
              </span>
            </Button>
          </div>
        )}

        {/* Revealed Actions */}
        <div ref={actionsRef} className="mt-12 gap-6 z-30 hidden opacity-0">
          <Button as="a" href="#projects" variant="primary" size="md">
            <span className="font-accent tracking-wide">View My Works</span>
          </Button>

          <Button as="a" href="#contact" variant="secondary" size="md">
            <span className="font-accent tracking-wide">Summon Me</span>
          </Button>
        </div>

        {/* Decorative brush line below content */}
        <div
          className="w-12 h-[1px] mt-16 opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent-warm), transparent)"
          }}
        />
      </div>
    </section>
  );
}
