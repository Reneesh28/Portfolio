import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * StampReveal
 * Wraps any element and "stamps" it into existence: it slams down from an
 * oversized rotated scale, overshoots, settles with a tiny shake, and fires
 * an ink-burst ring + optional onomatopoeia word at impact — like a comic
 * panel sound-effect stamp (THWIP! / BAM! / POW!).
 *
 * Props:
 *  - sfx: string|null  optional onomatopoeia text shown at impact (e.g. "THWIP!")
 *  - color: css color for the ink burst / sfx text (defaults to portal-cyan)
 *  - delay: seconds before the stamp fires once in view
 *  - rotation: starting rotation offset in degrees (adds character per instance)
 *  - once: only animate the first time it scrolls into view (default true)
 *  - as: element tag for the wrapper (default 'div')
 */
const StampReveal = ({
  children,
  sfx = null,
  color = 'var(--color-portal-cyan)',
  delay = 0,
  rotation = -8,
  once = true,
  className = '',
  as = 'div',
}) => {
  const wrapRef = useRef(null);
  const burstRef = useRef(null);
  const sfxRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = wrapRef.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, scale: 1, rotation: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, scale: 2.4, rotation, transformOrigin: '50% 50%' });
      if (burstRef.current) gsap.set(burstRef.current, { opacity: 0, scale: 0.2 });
      if (sfxRef.current) gsap.set(sfxRef.current, { opacity: 0, scale: 0.5, rotation: rotation * 1.5 });

      const tl = gsap.timeline({
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      });

      // The slam
      tl.to(el, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.32,
        ease: 'power4.in',
      })
        // Impact: overshoot + micro shake
        .to(el, { scale: 1.08, duration: 0.08, ease: 'power1.out' })
        .to(el, { scale: 0.97, rotation: rotation * 0.06, duration: 0.07 })
        .to(el, { scale: 1, rotation: 0, duration: 0.18, ease: 'elastic.out(1, 0.4)' });

      if (burstRef.current) {
        tl.to(burstRef.current, { opacity: 0.9, scale: 1.6, duration: 0.18, ease: 'power2.out' }, '<')
          .to(burstRef.current, { opacity: 0, duration: 0.35 }, '>-0.05');
      }

      if (sfxRef.current) {
        tl.to(sfxRef.current, { opacity: 1, scale: 1, rotation: 0, duration: 0.18, ease: 'back.out(3)' }, '<-0.1')
          .to(sfxRef.current, { opacity: 0, scale: 1.3, duration: 0.4, ease: 'power1.in' }, '+=0.25');
      }

      tl.to(
          el,
          {
            x: 'random(-4,4)',
            y: 'random(-3,3)',
            duration: 0.05,
            repeat: 3,
            yoyo: true,
          },
          '<'
        )
        .set(el, { x: 0, y: 0 });
    });

    return () => ctx.revert();
  }, [delay, rotation, once, sfx]);

  const Tag = as;

  return (
    <Tag ref={wrapRef} className={`relative inline-block ${className}`} style={{ opacity: 0 }}>
      {/* Ink burst ring, sits behind content, centered */}
      <span
        ref={burstRef}
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: '140%',
          height: '140%',
          border: `4px solid ${color}`,
          boxShadow: `0 0 24px ${color}`,
        }}
      />
      {sfx && (
        <span
          ref={sfxRef}
          aria-hidden="true"
          className="absolute -top-6 -right-8 font-display uppercase pointer-events-none whitespace-nowrap z-20"
          style={{
            color,
            fontSize: '1.5rem',
            textShadow: '2px 2px 0 var(--color-ink-black, #000)',
          }}
        >
          {sfx}
        </span>
      )}
      {children}
    </Tag>
  );
};

export default StampReveal;
