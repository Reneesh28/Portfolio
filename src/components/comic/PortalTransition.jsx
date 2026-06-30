import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * PortalTransition
 * A fixed, full-viewport overlay that briefly swirls/flashes with a
 * dimension-portal effect when the wrapped section scrolls into view —
 * the "stepping through a rift into a new universe" beat used at major
 * chapter breaks in Spider-Verse. Mount ONE instance near the root (e.g.
 * in App.jsx) and call its imperative trigger via a custom event, OR use
 * the simpler self-contained SectionPortal wrapper below for per-section use.
 *
 * This file exports two things:
 *  - PortalOverlay: the global fixed swirl layer (mount once)
 *  - triggerPortal(): fire the swirl from anywhere via a DOM CustomEvent
 */

export function triggerPortal(colorA = 'var(--color-miles-red)', colorB = 'var(--color-saffron)') {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('portal-transition', { detail: { colorA, colorB } }));
}

export const PortalOverlay = () => {
    const ref = useRef(null);
    const ringRef = useRef(null);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !ref.current) return;

        const handler = (e) => {
            const { colorA, colorB } = e.detail || {};
            if (ringRef.current) {
                gsap.set(ringRef.current, {
                    background: `conic-gradient(${colorA || 'var(--color-miles-red)'}, ${colorB || 'var(--color-saffron)'}, ${colorA || 'var(--color-miles-red)'})`,
                });
            }
            gsap.timeline()
                .set(ref.current, { opacity: 1 })
                .fromTo(
                    ringRef.current,
                    { scale: 0, rotate: 0, opacity: 0.9 },
                    { scale: 3.2, rotate: 220, opacity: 0, duration: 0.55, ease: 'power3.in' }
                )
                .set(ref.current, { opacity: 0 });
        };

        window.addEventListener('portal-transition', handler);
        return () => window.removeEventListener('portal-transition', handler);
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center opacity-0"
        >
            <div
                ref={ringRef}
                style={{
                    width: '60vmax',
                    height: '60vmax',
                    borderRadius: '50%',
                    filter: 'blur(2px)',
                    mixBlendMode: 'screen',
                }}
            />
        </div>
    );
};

/**
 * SectionPortal
 * Self-contained per-section wrapper: fires the global portal swirl the
 * first time this section scrolls into view. Use at the top of any major
 * section to mark it as a "dimension jump" beat. Requires <PortalOverlay />
 * to be mounted once near the app root (see App.jsx).
 */
export const SectionPortal = ({ colorA, colorB, threshold = 0.3 }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        const el = markerRef.current;
        if (!el) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    triggerPortal(colorA, colorB);
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [colorA, colorB, threshold]);

    return <div ref={markerRef} aria-hidden="true" className="absolute top-0 left-0 w-px h-px" />;
};

export default PortalOverlay;