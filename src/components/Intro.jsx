import { useEffect, useRef } from "react";
import gsap from "gsap";
import AtmosphericBackground from "./AtmosphericBackground";

const name = "BALAM RENEESH";
const tagline = "THE WARRIOR-ENGINEER";

const Intro = ({ onFinish }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
    });

    // Initial state: Blurred and dark
    gsap.set(contentRef.current, { filter: "blur(20px)", opacity: 0 });

    tl.to(contentRef.current, {
      filter: "blur(0px)",
      opacity: 1,
      duration: 2.5,
      ease: "power1.inOut"
    })
      .fromTo(nameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
        "-=1.5"
      )
      .fromTo(taglineRef.current,
        { opacity: 0, letterSpacing: "1em" },
        { opacity: 0.6, letterSpacing: "0.4em", duration: 2, ease: "power2.out" },
        "-=1.0"
      )
      .to(containerRef.current, {
        opacity: 0,
        duration: 1.2,
        delay: 0.5,
        onComplete: onFinish
      });

    return () => tl.kill();
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0D0D]"
    >
      <div className="absolute inset-0 opacity-40">
        <AtmosphericBackground />
      </div>

      <div ref={contentRef} className="relative z-10 text-center">
        <h1
          ref={nameRef}
          className="text-5xl md:text-8xl font-serif text-[#F5F5F5] tracking-tight mb-4"
        >
          {name}
        </h1>
        <p
          ref={taglineRef}
          className="text-[#C5A059] font-medium text-xs md:text-sm uppercase"
        >
          {tagline}
        </p>
      </div>
    </div>
  );
};

export default Intro;
