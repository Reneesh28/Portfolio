import { useEffect, useRef } from "react";
import gsap from "gsap";

const name = "BALAM RENEESH";
const tagline = "AI ENGINEER · FULL-STACK DEVELOPER";

const Intro = ({ onFinish }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const taglineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    tl.fromTo(
      lettersRef.current,
      {
        y: 220,
        scale: 1.5,
        opacity: 0,
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.26,
        stagger: 0.035,
      }
    );

    /* ===============================
       2️⃣ TAGLINE SNAP
    =============================== */
    tl.fromTo(
      taglineRef.current,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.35,
      },
      "-=0.2"
    );

    /* ===============================
       3️⃣ IMPACT PAUSE (IMPORTANT)
    =============================== */
    tl.to({}, { duration: 0.3 });

    /* ===============================
       4️⃣ CAMERA PUSH — INTO SCREEN
    =============================== */
    tl.to(containerRef.current, {
      scale: 1.6,
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      onComplete: onFinish,
    });

    return () => tl.kill();
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0A0A0A] text-[#E0E0E0]"
    >
      <div className="text-center overflow-hidden">
        {/* NAME */}
        <div
          className="flex justify-center font-bold tracking-tight"
        >
          {name.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => (lettersRef.current[i] = el)}
              className="inline-block text-4xl md:text-7xl"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* TAGLINE */}
        <p
          ref={taglineRef}
          className="mt-6 text-[#00BFA5] font-semibold text-xs md:text-sm tracking-[0.2em]"
        >
          {tagline}
        </p>
      </div>
    </div>
  );
};

export default Intro;
