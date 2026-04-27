import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const centerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Entrance: The Slice
      tl.fromTo(leftRef.current, { x: "-100%" }, { x: "0%", duration: 1.5 })
        .fromTo(rightRef.current, { x: "100%" }, { x: "0%", duration: 1.5 }, "-=1.5")
        .fromTo(centerRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.5");

      // Scroll Parallax
      gsap.to(leftRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      gsap.to(rightRef.current, {
        y: 100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-[#0D0D0D] flex"
    >
      {/* THE WARRIOR (LEFT) */}
      <div
        ref={leftRef}
        className="relative flex-1 bg-[#121212] flex items-center justify-center overflow-hidden border-r border-[#C5A059]/20"
      >
        {/* Subtle Traditional Motif Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/seigaiha.png')]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D] to-transparent opacity-40" />
      </div>

      {/* THE MACHINE (RIGHT) */}
      <div
        ref={rightRef}
        className="relative flex-1 bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
      >
        {/* Subtle Data Stream Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none font-mono text-[10px] text-[#F5F5F5] overflow-hidden whitespace-pre leading-none select-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="opacity-[0.1]">
              {"01".repeat(100)}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-l from-[#0D0D0D] to-transparent opacity-40" />
      </div>

      {/* CENTER CONTENT (THE DUEL) */}
      <div
        ref={centerRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        <p className="text-[#C5A059] uppercase tracking-[0.5em] text-xs mb-4 font-medium animate-pulse">
          Establish Path
        </p>

        <h1 className="text-6xl md:text-9xl font-serif text-[#F5F5F5] leading-none mb-6">
          BALAM RENEESH
        </h1>

        <div className="h-px w-24 bg-[#C5A059] mb-8" />

        <h2 className="text-[#A3A3A3] text-xl md:text-3xl tracking-widest font-light mb-12">
          THE <span className="text-[#F5F5F5] font-serif">WARRIOR</span> - ENGINEER
        </h2>

        <div className="flex gap-8 pointer-events-auto">
          <Button as="a" href="#projects" variant="primary" size="lg" className="bg-[#8B0000] border-none text-[#F5F5F5] hover:bg-[#A30000] transition-all">
            ENTER THE JOURNEY
          </Button>
          <Button as="a" href="#about" variant="secondary" size="lg" className="border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10">
            KNOW THE LEGEND
          </Button>
        </div>
      </div>

      {/* Cinematic Letterboxing */}
      <div className="absolute top-0 left-0 w-full h-12 bg-black/40 z-30 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-12 bg-black/40 z-30 pointer-events-none" />
    </section>
  );
}
