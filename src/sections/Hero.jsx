import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InkButton from '../components/comic/InkButton';
import StampReveal from '../components/comic/StampReveal';
import KineticTitle from '../components/comic/KineticTitle';
import SpeedBurst from '../components/comic/SpeedBurst';
import FrameStutter from '../components/comic/FrameStutter';
import { SectionPortal } from '../components/comic/PortalTransition';
import { lazy, Suspense } from 'react';
const DimensionRift = lazy(() => import('../components/three/DimensionRift'));
import codewalkerImg from '../assets/images/codewalker.webp'; // Generated Codewalker art

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const tearRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from(leftColRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.from(rightColRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4
      });

      // Parallax mouse effect (subtle)
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 20;
        const yPos = (clientY / window.innerHeight - 0.5) * 20;

        gsap.to('.parallax-layer', {
          x: xPos,
          y: yPos,
          duration: 1,
          ease: "power2.out"
        });
      };

      // Only attach mousemove if not reduced motion
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      // Scroll out effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true,
        }
      });

      tl.to('.print-layer-m', { x: -20, y: 10, duration: 1 }, 0)
        .to('.print-layer-c', { x: 20, y: -10, duration: 1 }, 0)
        .to('.hero-character', { x: 30, scale: 1.05, duration: 1 }, 0)
        .to(tearRef.current, { scaleY: 1, duration: 1 }, 0.2);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen w-full bg-[var(--color-ink-black)] overflow-hidden flex items-center justify-center">
      <SectionPortal colorA="var(--color-miles-red)" colorB="var(--color-saffron)" threshold={0.2} />

      <div className="absolute inset-0 bg-halftone-dark opacity-10 pointer-events-none"></div>

      {/* 3D dimension-rift backdrop — floating glitch shards behind everything */}
      <div className="absolute inset-0 -z-0 opacity-70">
        <Suspense fallback={null}><DimensionRift density={16} /></Suspense>
      </div>


      <div className="relative z-10 w-full h-full min-h-screen max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center px-6 md:px-12 pt-24 pb-12">

        {/* Left Column - Metadata & Copy */}
        <div ref={leftColRef} className="lg:col-span-5 flex flex-col order-2 lg:order-1 relative z-20">
          <div className="font-label uppercase font-bold tracking-widest text-[var(--color-comic-yellow)] mb-4 md:mb-6">
            ISSUE #01 &middot; EARTH-28
          </div>

          <FrameStutter steps={6} distance={50} direction="left">
            <StampReveal sfx="THWIP!" color="var(--color-miles-red)" rotation={-6} className="block w-full">
              <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-wider text-[var(--color-text-on-dark)] mb-6 relative z-10">
                <span className="relative inline-block w-full">
                  <SpeedBurst color="var(--color-saffron)" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] -z-20" />
                  <KineticTitle as="span">RENEESH</KineticTitle>
                </span>
                <span className="block text-3xl md:text-5xl lg:text-5xl mt-4 text-[var(--color-text-muted-dark)] tracking-wide">
                  ACROSS THE CODEVERSE
                </span>
              </h1>
            </StampReveal>
          </FrameStutter>

          <div className="caption-box mb-6 w-fit" style={{ borderColor: 'var(--color-miles-black)', boxShadow: '4px 4px 0 var(--color-miles-red)' }}>
            <h2 className="font-label uppercase font-bold text-sm md:text-base leading-tight m-0">
              AI Systems Engineer building intelligent, full-stack experiences.
            </h2>
          </div>

          <p className="font-body text-base md:text-lg text-[var(--color-text-on-dark)] mb-10 max-w-xl opacity-90 leading-relaxed">
            I combine generative AI, machine learning and modern interfaces to turn ambitious ideas into working systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <StampReveal sfx="BAM!" color="var(--color-saffron)" rotation={-10} delay={0.15}>
              <InkButton variant="cyan" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore the Codeverse
              </InkButton>
            </StampReveal>
            <StampReveal sfx="POW!" color="var(--color-miles-red)" rotation={8} delay={0.3}>
              <InkButton variant="magenta" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                Send a Signal
              </InkButton>
            </StampReveal>
            <a href="/resume.pdf" target="_blank" rel="noreferrer" className="flex items-center justify-center font-label uppercase font-bold tracking-widest px-6 py-3 border-4 border-transparent hover:border-[var(--color-comic-yellow)] hover:bg-[var(--color-ink-black)] transition-colors comic-focus text-[var(--color-text-on-dark)]">
              Open Origin File
            </a>
          </div>
        </div>

        {/* Right Column - Character Art */}
        <div ref={rightColRef} className="lg:col-span-7 order-1 lg:order-2 relative h-[40vh] lg:h-[80vh] flex items-center justify-center mt-12 lg:mt-0">
          {/* Comic Panel Frame — fused Miles spray-edge + Pavitr rangoli/sash, same frame */}
          <div className="jagged-panel spray-edge absolute inset-0 border-8 border-[var(--color-ink-black)] bg-[var(--color-deep-navy)] transform rotate-2 overflow-hidden shadow-2xl mx-4 lg:mx-0">
            <div className="absolute inset-0 bg-halftone-fusion opacity-15 mix-blend-overlay"></div>
            {/* Dimension-bleed seam where the rift punches through */}
            <div className="bleed-seam absolute top-0 left-0 w-full h-3 opacity-60"></div>
            {/* Suit-block sash — Miles blocking + Pavitr dhoti-sash diagonal */}
            <div className="suit-block-sash"></div>
            {/* Rangoli corner mark — Pavitr/Mumbai */}
            <div className="rangoli-corner top-3 left-3"></div>
            {/* Background elements */}
            <div className="parallax-layer absolute top-10 left-10 w-32 h-32 bg-[var(--color-miles-red)] rounded-full blur-3xl opacity-25"></div>
            <div className="parallax-layer absolute bottom-10 right-10 w-48 h-48 bg-[var(--color-saffron)] rounded-full blur-3xl opacity-25"></div>
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[var(--color-ink-black)] to-transparent opacity-80"></div>
          </div>

          {/* Character breaking out of panel */}
          <div className="hero-character drip-edge relative z-10 w-2/3 max-w-sm lg:max-w-md parallax-layer transform -rotate-1 text-[var(--color-miles-black)]">
            <img
              src={codewalkerImg}
              alt="The Codewalker"
              className="w-full h-auto object-cover rounded-sm border-4 border-[var(--color-ink-black)] shadow-[8px_8px_0_var(--color-miles-red)] grayscale contrast-125"
            />
          </div>
        </div>

      </div>

      {/* Torn paper transition at bottom */}
      <div
        ref={tearRef}
        className="absolute bottom-0 left-0 w-full h-16 md:h-24 lg:h-32 bg-[var(--color-paper)] scale-y-0 torn-edge-bottom z-30 transform-gpu"
        style={{ transformOrigin: 'bottom' }}
      ></div>

    </section>
  );
};

export default Hero;