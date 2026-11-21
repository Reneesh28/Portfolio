import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Hero = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set(contentRef.current, { opacity: 1 });
        return;
      }

      // Entrance animation
      gsap.from(contentRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen w-full bg-bg flex items-center justify-center">
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
        <div ref={contentRef} className="flex flex-col max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text mb-6">
            Reneesh
          </h1>

          <h2 className="text-lg md:text-2xl font-semibold text-text-muted mb-6">
            AI Systems Engineer building intelligent, full-stack experiences.
          </h2>

          <p className="text-base md:text-lg text-text mb-10 max-w-xl opacity-90 leading-relaxed">
            I combine generative AI, machine learning and modern interfaces to turn ambitious ideas into working systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-accent text-accent-contrast font-medium hover:opacity-90 transition-opacity"
            >
              View Projects
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border text-text font-medium hover:bg-surface-raised transition-colors"
            >
              Contact Me
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-md text-text font-medium hover:bg-surface-raised transition-colors"
            >
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
