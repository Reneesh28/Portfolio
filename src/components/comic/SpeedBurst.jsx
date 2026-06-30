import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * SpeedBurst
 * A radiating speed-line burst (pure CSS conic-gradient), meant to sit
 * absolutely positioned behind/around a StampReveal target for extra
 * kinetic punch — like the action lines behind a Spider-Verse impact panel.
 *
 * Fires once when scrolled into view (or pass `trigger` to control timing
 * manually, e.g. syncing with a button click).
 *
 * Props:
 *  - color: CSS color for the lines (defaults to saffron)
 *  - trigger: optional boolean — when provided, burst fires on trigger
 *    becoming true instead of on scroll-into-view
 */
const SpeedBurst = ({ color = 'var(--color-saffron)', trigger, className = '' }) => {
    const ref = useRef(null);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !ref.current) return;

        const fire = () => {
            gsap.fromTo(
                ref.current,
                { opacity: 0, scale: 0.4, rotation: 0 },
                { opacity: 0.8, scale: 1, rotation: 18, duration: 0.22, ease: 'power2.out' }
            );
            gsap.to(ref.current, { opacity: 0, scale: 1.3, duration: 0.4, delay: 0.18, ease: 'power1.in' });
        };

        if (trigger === undefined) {
            // Self-driven via IntersectionObserver
            const obs = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        fire();
                        obs.disconnect();
                    }
                },
                { threshold: 0.6 }
            );
            obs.observe(ref.current);
            return () => obs.disconnect();
        }
    }, [trigger]);

    // Manual trigger mode
    useEffect(() => {
        if (trigger) {
            gsap.fromTo(
                ref.current,
                { opacity: 0, scale: 0.4, rotation: 0 },
                { opacity: 0.8, scale: 1, rotation: 18, duration: 0.22, ease: 'power2.out' }
            );
            gsap.to(ref.current, { opacity: 0, scale: 1.3, duration: 0.4, delay: 0.18, ease: 'power1.in' });
        }
    }, [trigger]);

    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={`speed-burst ${className}`}
            style={{ '--speed-burst-color': color, opacity: 0 }}
        />
    );
};

export default SpeedBurst;