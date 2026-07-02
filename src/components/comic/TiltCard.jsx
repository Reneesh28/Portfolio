import React, { useRef } from 'react';
import gsap from 'gsap';

/**
 * TiltCard
 * Wraps any block-level content and gives it genuine 3D perspective tilt that
 * tracks the pointer — like a panel floating just off the page. Uses CSS 3D
 * transforms (no WebGL), so it's cheap to drop onto many cards at once.
 *
 * Props:
 *  - maxTilt: max rotation in degrees (default 10)
 *  - glare: show a moving specular highlight layer (default true)
 *  - scaleOnHover: subtle lift scale on hover (default 1.015)
 */
const TiltCard = ({
  children,
  maxTilt = 10,
  glare = true,
  scaleOnHover = 1.015,
  className = '',
  style = {},
}) => {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);
  const reducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = typeof window !== 'undefined' && 
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  const handleMove = (e) => {
    if (reducedMotion || isTouch || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    const rotY = (px - 0.5) * 2 * maxTilt; // left/right
    const rotX = -(py - 0.5) * 2 * maxTilt; // up/down

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      gsap.to(cardRef.current, {
        rotateX: rotX,
        rotateY: rotY,
        scale: scaleOnHover,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
      if (glare && glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 0.18,
          x: `${px * 100}%`,
          y: `${py * 100}%`,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    });
  };

  const handleLeave = () => {
    if (reducedMotion || isTouch || !cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
    if (glare && glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.5 });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative will-change-transform [transform-style:preserve-3d] ${className}`}
      style={{ ...style }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-0 z-30"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 60%)',
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </div>
  );
};

export default TiltCard;
