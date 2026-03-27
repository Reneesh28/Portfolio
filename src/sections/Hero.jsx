import { useEffect, useRef, useState, lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/ui/Button";
import HeroHUD from "../components/HeroHUD";

gsap.registerPlugin(ScrollTrigger);

const LatticeBackground = lazy(() =>
  import("../components/LatticeBackground")
);

const TARGET_TITLE = "Balam Reneesh";
const TARGET_ROLE = "SYSTEMS ARCHITECT & UI ENGINEER";
const TARGET_DESC = "Deploying robust machine learning models and scalable structural interfaces.";

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const decryptBtnRef = useRef(null);
  const flashRef = useRef(null);

  const [isDecrypted, setIsDecrypted] = useState(false);

  // Initial scrambled states
  const [titleText, setTitleText] = useState("0x0F82A0F82A0F");
  const [roleText, setRoleText] = useState("0x000F82A000F82A000F82A");
  const [descText, setDescText] = useState("0x00000000000000000000000000000000000");

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ===============================
         CINEMATIC ENTRY SEQUENCE (SCRAMBLED)
      =============================== */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 }
      )
        .fromTo(
          roleRef.current,
          { opacity: 0, y: 15 },
          { opacity: 0.5, y: 0, duration: 0.8 }, // Dimmer until decrypted
          "-=0.6"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          { opacity: 0.3, y: 0, duration: 0.8 }, // Very dim until decrypted
          "-=0.5"
        )
        .fromTo(
          decryptBtnRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.8 },
          "-=0.2"
        );

      /* ===============================
         SCROLL EXIT — NATURAL DEPARTURE
      =============================== */
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -100,
        scale: 0.9,
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

  const scramble = (target, setText, duration) => {
    let iterations = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const maxIterations = target.length;

    const interval = setInterval(() => {
      setText(
        target.split("").map((char, index) => {
          if (char === " ") return " ";
          if (index < iterations) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );

      if (iterations >= maxIterations) {
        clearInterval(interval);
      }
      iterations += duration; // Speed control
    }, 60);
  };
  const handleDecrypt = () => {
    // 0. System Flash
    gsap.fromTo(flashRef.current,
      { opacity: 0 },
      { opacity: 0.4, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" }
    );

    // 1. Hide Decrypt Button
    gsap.to(decryptBtnRef.current, { opacity: 0, y: 10, duration: 0.4, onComplete: () => setIsDecrypted(true) });

    // 2. Brighten text elements
    gsap.to([roleRef.current, descRef.current], { opacity: 1, duration: 0.5 });
    gsap.to(titleRef.current, { color: "#E0E0E0", duration: 1 }); // From muted to bright

    // 3. Run Scramblers
    scramble(TARGET_TITLE, setTitleText, 1 / 3);
    setTimeout(() => scramble(TARGET_ROLE, setRoleText, 1 / 2), 200);
    setTimeout(() => scramble(TARGET_DESC, setDescText, 1 / 2), 400);

    // 4. Reveal actual actions
    gsap.fromTo(
      actionsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: "power3.out", display: "flex" }
    );
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-screen overflow-hidden bg-[#0A0A0A]"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <LatticeBackground isDecrypted={isDecrypted} />
        </Suspense>
      </div>

      {/* Cinematic Interface Layer */}
      <HeroHUD isDecrypted={isDecrypted} />

      {/* Decryption Flash Overlay */}
      <div ref={flashRef} className="absolute inset-0 bg-[#00E5FF] z-40 pointer-events-none opacity-0" />

      {/* Overlay - precise gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-[#0A0A0A]/70 to-[#0A0A0A] z-10 pointer-events-none" />

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
        <h1
          ref={titleRef}
          className="text-[#A3A3A3] font-mono font-bold tracking-tight leading-[1.1]
                     text-4xl sm:text-6xl md:text-8xl lg:text-9xl
                     cursor-default select-none perspective-500
                     transition-colors duration-1000"
        >
          {titleText}
        </h1>

        <h2
          ref={roleRef}
          className="mt-6 text-[#00BFA5] font-semibold tracking-[0.2em] uppercase
                     text-sm sm:text-xl md:text-3xl font-mono"
        >
          {roleText}
        </h2>

        <p
          ref={descRef}
          className="mt-8 text-[#A3A3A3] text-sm sm:text-xl max-w-2xl font-mono leading-relaxed"
        >
          {descText}
        </p>

        {/* The Gateway Decryption Button */}
        {!isDecrypted && (
          <div ref={decryptBtnRef} className="mt-16 z-30">
            <Button onClick={handleDecrypt} variant="primary" size="lg" className="animate-pulse">
              [ DECRYPT PROTOCOLS ]
            </Button>
          </div>
        )}

        {/* Validated Actions (Hidden until decrypted) */}
        <div ref={actionsRef} className="mt-12 gap-6 z-30 hidden opacity-0">
          <Button as="a" href="#projects" variant="primary" size="md">
            ACCESS ARCHIVES
          </Button>

          <Button as="a" href="#contact" variant="secondary" size="md">
            ESTABLISH UPLINK
          </Button>
        </div>
      </div>
    </section>
  );
}
