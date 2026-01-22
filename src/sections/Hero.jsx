import { useEffect, useRef, lazy, Suspense } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NeuralFieldBackground = lazy(() =>
  import("../components/NeuralFieldBackground")
);

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // HERO EXIT — SCROLL CONTROLLED
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 1,
          y: 0,
        },
        {
          opacity: 0,
          y: -60,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          ease: "none",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-screen overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <NeuralFieldBackground />
        </Suspense>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 z-10" />

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
        <h1 className="text-white font-extrabold tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
          Balam Reneesh
        </h1>

        <h2 className="mt-4 text-neutral-300 font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl">
          AI Engineer
        </h2>

        <p className="mt-6 text-neutral-300 text-lg sm:text-xl max-w-2xl">
          Machine Learning · GenAI · Web Development · Scalable Systems
        </p>

        <div className="mt-10 flex gap-8">
          <a
            href="#projects"
            className="text-white font-medium border-b border-white pb-1 hover:opacity-70 transition"
          >
            View Projects
          </a>

          <a
            href="#contact"
            className="text-neutral-300 font-medium hover:text-white transition"
          >
            Contact Me
          </a>
        </div>

        {/* Scroll Hint — subtle, not animated */}
        <div className="mt-16 text-neutral-400">
          <ArrowDown size={22} />
        </div>
      </div>
    </section>
  );
}
