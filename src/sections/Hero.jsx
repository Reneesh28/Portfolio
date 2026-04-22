import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);


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
      className="relative min-h-screen w-screen overflow-hidden washi-texture"
    >
      {/* Background Kanji Watermark — 侍 (Samurai) */}
      <div
        ref={kanjiRef}
        className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none select-none opacity-0"
      >
        <span
          className="font-display text-[30vw] md:text-[25vw] font-bold"
          style={{ color: "var(--text-ink)" }}
        >
          侍
        </span>
      </div>

      {/* Vertical Japanese Name (Far Left) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col items-center opacity-40">
        <span className="font-display text-4xl tracking-[1em]" style={{ writingMode: 'vertical-rl' }}>
          バラム・レニッシュ
        </span>
      </div>

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
          className="w-24 h-[1px] mb-12 opacity-30 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        />

        <h1
          ref={titleRef}
          className="font-display font-bold tracking-tight leading-[1.1]
                     text-5xl sm:text-7xl md:text-9xl
                     cursor-default select-none
                     transition-colors duration-1000"
          style={{ color: "var(--text-muted)", filter: "blur(4px)" }}
        >
          Balam Reneesh
        </h1>

        <h2
          ref={roleRef}
          className="mt-8 font-accent font-medium tracking-[0.2em] uppercase
                     text-xs sm:text-base md:text-xl"
          style={{ color: "var(--accent)", filter: "blur(3px)" }}
        >
          Craftsman of Code <span className="mx-4 text-[var(--text-ink)]">/</span> Architect of Systems
        </h2>

        <p
          ref={descRef}
          className="mt-10 text-sm sm:text-lg max-w-2xl font-body leading-relaxed opacity-60"
          style={{ color: "var(--text-muted)", filter: "blur(3px)" }}
        >
          Forging high-precision digital artifacts with discipline and focus.
        </p>

        {/* The Gateway — Unsheathe Button */}
        {!isRevealed && (
          <div ref={revealBtnRef} className="mt-20 z-30">
            <Button
              onClick={handleReveal}
              variant="primary"
              size="lg"
              className="group relative px-12"
            >
              <span className="relative z-10 font-accent tracking-[0.4em] uppercase text-xs">
                Unsheathe
              </span>
              {/* Button inner highlight */}
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </Button>
          </div>
        )}

        {/* Revealed Actions */}
        <div ref={actionsRef} className="mt-16 gap-8 z-30 hidden opacity-0">
          <Button as="a" href="#projects" variant="primary" size="md" className="min-w-[200px]">
            <span className="font-accent tracking-widest uppercase text-xs">The Armory</span>
          </Button>

          <Button as="a" href="#contact" variant="secondary" size="md" className="min-w-[200px]">
            <span className="font-accent tracking-widest uppercase text-xs">Summon</span>
          </Button>
        </div>

        {/* Decorative brush line below content */}
        <div
          className="w-16 h-[1px] mt-20 opacity-20 bg-gradient-to-r from-transparent via-[var(--text-ink)] to-transparent"
        />
      </div>
    </section>
  );
}
