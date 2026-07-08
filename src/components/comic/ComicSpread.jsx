import React, { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ComicSpread — Fusion Edition
 * Every section now gets:
 *  - Diagonal web-line motion streaks (Miles/Brooklyn)
 *  - A dimension-membrane tear seam at the top edge (Spider-Verse dimension boundary)
 *  - A scroll-scrubbed torn-paper page-turn at the bottom edge (comic page flip),
 *    layered underneath/alongside the rangoli SectionPortal bloom each section
 *    already fires. Pass `tearColor` = the *next* section's background colour
 *    so the tear reads as "this page lifts, revealing the next page beneath".
 */
const ComicSpread = forwardRef(({ children, id, className = '', tearColor, ...props }, ref) => {
  const tearRef = useRef(null);

  useEffect(() => {
    if (!tearColor || !tearRef.current) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const tearEl = tearRef.current;
    const shadowEl = tearEl.previousElementSibling;
    const section = tearEl.closest('section');
    if (!section) return;

    const ctx = gsap.context(() => {
      // Scroll-scrubbed, not a fixed-duration timer — the page only turns as
      // fast as the person actually scrolls, which is what sells the "physical
      // page" feel. rotateX + scaleY only (both compositor-cheap transforms);
      // the shadow beneath is a plain opacity fade on a gradient, never box-shadow.
      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'bottom 90%', end: 'bottom 20%', scrub: 0.3 },
      })
        .fromTo(tearEl, { scaleY: 0, rotateX: -22 }, { scaleY: 1, rotateX: 0, ease: 'none', duration: 1 }, 0)
        .fromTo(shadowEl, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.35 }, 0)
        .to(shadowEl, { opacity: 0, ease: 'none', duration: 0.65 }, 0.35);
    }, section);

    return () => ctx.revert();
  }, [tearColor]);

  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 overflow-hidden ${className}`}
      {...props}
    >
      {/* Miles Morales — diagonal web-motion streaks */}
      <div className="web-lines pointer-events-none" aria-hidden="true" />
      {/* Spider-Verse — dimension membrane bleed seam at section boundary */}
      <div
        className="bleed-seam absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: '3px', opacity: 0.45 }}
        aria-hidden="true"
      />
      {children}

      {/* Comic page-turn — torn paper edge lifts as you scroll past, revealing
          the next section's colour underneath, like flipping a physical page. */}
      {tearColor && (
        <div
          className="absolute bottom-0 left-0 w-full z-30 pointer-events-none"
          style={{ perspective: '700px' }}
          aria-hidden="true"
        >
          <div
            className="tear-shadow absolute left-0 w-full h-8 bottom-16 md:bottom-24 lg:bottom-32"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35), transparent)', opacity: 0 }}
          />
          <div
            ref={tearRef}
            className="torn-edge-bottom absolute bottom-0 left-0 w-full h-16 md:h-24 lg:h-32 scale-y-0 transform-gpu"
            style={{ background: tearColor, transformOrigin: 'bottom', willChange: 'transform' }}
          />
        </div>
      )}
    </section>
  );
});

ComicSpread.displayName = 'ComicSpread';
export default ComicSpread;