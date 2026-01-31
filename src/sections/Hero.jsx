import { useEffect, useRef, lazy, Suspense, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NeuralFieldBackground = lazy(() =>
  import("../components/NeuralFieldBackground")
);

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const roleRef = useRef(null);
  const descRef = useRef(null);

  const [roleText, setRoleText] = useState("AI Engineer");
  const originalRole = "AI Engineer";

  // --- Scramble Effect Helper ---
  const scrambleText = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setRoleText((prev) =>
        originalRole
          .split("")
          .map((letter, index) => {
            if (index < iterations) {
              return originalRole[index];
            }
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iterations >= originalRole.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3; // speed of decoding
    }, 30);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ===============================
         TITLE STAGGER ENTRY
      =============================== */
      // Animate letters individually if we split them, but here we treat lines/words
      // For character staggered, we'd need to map them in JSX. Let's do that below. 
      // But first, general fade-in

      const titleChars = titleRef.current.querySelectorAll(".char");

      gsap.fromTo(
        titleChars,
        {
          opacity: 0,
          y: 100,
          rotateX: -90,
          filter: "blur(10px)"
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.05,
          ease: "power4.out",
        }
      );

      // Role Entry (with scramble trigger potentially)
      gsap.fromTo(
        roleRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          delay: 0.5,
          ease: "back.out(1.7)",
          onStart: scrambleText, // Trigger scramble on logic start
        }
      );

      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.8,
          ease: "power2.out",
        }
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

  // Split title helper
  const renderTitle = (text) => {
    return text.split("").map((char, index) => (
      <span
        key={index}
        className="char inline-block"
        style={{ minWidth: char === " " ? "0.3em" : "auto" }}
        onMouseEnter={(e) => {
          gsap.to(e.target, {
            color: "#4488ff",
            y: -10,
            duration: 0.2,
            ease: "power2.out"
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.target, {
            color: "white",
            y: 0,
            duration: 0.2,
            ease: "power2.in"
          });
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-screen overflow-hidden bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralFieldBackground />
        </Suspense>
      </div>

      {/* Overlay - subtle gradient to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10 pointer-events-none" />

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
          className="text-white font-extrabold tracking-tight leading-[0.95]
                     text-6xl sm:text-7xl md:text-8xl lg:text-9xl
                     cursor-default select-none perspective-500"
        >
          {renderTitle("Balam Reneesh")}
        </h1>

        <h2
          ref={roleRef}
          className="mt-6 text-blue-400 font-bold tracking-widest uppercase
                     text-xl sm:text-2xl md:text-3xl font-mono"
          onMouseEnter={scrambleText}
        >
          {roleText}
        </h2>

        <p
          ref={descRef}
          className="mt-8 text-neutral-400 text-lg sm:text-xl max-w-2xl font-light"
        >
          Machine Learning · GenAI · Web Development · Scalable Systems
        </p>

        <div className="mt-12 flex gap-8 z-30">
          <a
            href="#projects"
            className="group relative px-6 py-3 overflow-hidden rounded-full bg-white text-black font-semibold shadow-lg shadow-white/20 transition-all hover:scale-105 hover:shadow-white/40"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-gray-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </a>

          <a
            href="#contact"
            className="group px-6 py-3 rounded-full border border-neutral-700 text-neutral-300 font-medium hover:border-white hover:text-white transition-all hover:bg-white/5"
          >
            Contact Me
          </a>
        </div>

      </div>
    </section>
  );
}
