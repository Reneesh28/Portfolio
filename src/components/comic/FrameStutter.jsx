import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * FrameStutter
 * Recreates the Spider-Verse "off-model" trick: instead of smooth 60fps
 * easing, the wrapped element animates in via discrete stepped frames
 * (steps() easing) so it visibly judders into place — like the movie
 * dropping to 12fps for impact beats. Pair with StampReveal on the same
 * element's parent for a stamp THEN a stutter-settle, or use standalone
 * for a quieter "panel snapping into the grid" effect.
 *
 * Props:
 *  - steps: number of discrete animation frames (default 6, lower = choppier)
 *  - distance: px the element travels in from (default 40)
 *  - direction: 'up' | 'down' | 'left' | 'right' (default 'up')
 */
const FrameStutter = ({
    children,
    steps = 6,
    distance = 40,
    direction = 'up',
    duration = 0.5,
    className = '',
    as = 'div',
}) => {
    const ref = useRef(null);
    const Tag = as;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            gsap.set(el, { opacity: 1, x: 0, y: 0 });
            return;
        }

        const offsets = {
            up: { y: distance, x: 0 },
            down: { y: -distance, x: 0 },
            left: { x: distance, y: 0 },
            right: { x: -distance, y: 0 },
        };
        const from = offsets[direction] || offsets.up;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                { opacity: 0, ...from },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration,
                    ease: `steps(${steps})`,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        once: true,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, [steps, distance, direction, duration]);

    return (
        <Tag ref={ref} className={className} style={{ opacity: 0 }}>
            {children}
        </Tag>
    );
};

export default FrameStutter;