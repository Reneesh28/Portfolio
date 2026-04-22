import { useEffect, useRef } from "react";
import gsap from "gsap";

const name = "BALAM RENEESH";
const tagline = "技の道 — The Way of Craft";

const Intro = ({ onFinish }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const taglineRef = useRef(null);
  const brushLineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    /* ===============================
       1️⃣ BRUSH-STROKE LINE DRAWS IN
    =============================== */
    tl.fromTo(
      brushLineRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.6, ease: "power2.inOut" }
    );

    /* ===============================
       2️⃣ NAME LETTERS RISE — Ink dropping onto paper
    =============================== */
    tl.fromTo(
      lettersRef.current,
      {
        y: 80,
        opacity: 0,
        rotateX: 40,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "power3.out",
      },
      "-=0.2"
    );

    /* ===============================
       3️⃣ TAGLINE FADES IN
    =============================== */
    tl.fromTo(
      taglineRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
      },
      "-=0.15"
    );

    /* ===============================
       4️⃣ CONTEMPLATIVE PAUSE
    =============================== */
    tl.to({}, { duration: 0.5 });

    /* ===============================
       5️⃣ INK DISSOLVE — Fades into the void
    =============================== */
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      filter: "blur(8px)",
      duration: 0.8,
      ease: "power2.in",
      onComplete: onFinish,
    });

    return () => tl.kill();
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center"
      style={{ backgroundColor: "var(--bg-void)" }}
    >
      {/* Subtle radial warm glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(194,65,12,0.06) 0%, transparent 60%)"
        }}
      />

      <div className="text-center overflow-hidden relative">
        {/* Decorative brush-stroke line above name */}
        <div
          ref={brushLineRef}
          className="mx-auto mb-6 h-[2px] w-24 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)"
          }}
        />

        {/* NAME */}
        <div
          className="flex justify-center font-display font-bold tracking-tight"
          style={{ perspective: "600px" }}
        >
          {name.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block text-4xl md:text-7xl"
              style={{ color: "var(--text-main)" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* TAGLINE */}
        <p
          ref={taglineRef}
          className="mt-6 font-accent font-medium text-xs md:text-sm tracking-[0.25em]"
          style={{ color: "var(--accent)" }}
        >
          {tagline}
        </p>
      </div>
    </div>
  );
};

export default Intro;
