import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * PortalTransition — Rangoli Mandala Edition
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Replaces the generic conic-gradient circle swirl with a genuine
 * rangoli mandala transition — the geometric floor art (kolam/rangoli)
 * created during Indian festivals, animated as if being drawn live
 * with coloured powder, then dissolved.
 *
 * Animation sequence (0.9–1.1s total):
 *   1. Seed dot appears at viewport centre (saffron)
 *   2. 4 concentric rings of geometric petals bloom outward via
 *      SVG stroke-dashoffset (drawn live, one ring per frame beat)
 *   3. Fill colours flood each ring in Pavitr's palette
 *   4. Warm golden radial glow pulses at peak
 *   5. Everything dissolves outward and fades — new section visible
 *
 * Palette — Pavitr Prabhakar / Mumbattan:
 *   Ring 1 (innermost): saffron   #FF7A1A
 *   Ring 2:             marigold  #FFB627
 *   Ring 3:             rose-pink #FF3D7F
 *   Ring 4 (outer):     gold      #E8B33D
 *
 * Exports:
 *   PortalOverlay  — mount once in App.jsx
 *   SectionPortal  — drop at the top of each major section
 *   triggerPortal  — imperative trigger via CustomEvent
 */

// ── Rangoli SVG geometry ─────────────────────────────────────────────────────
// Each ring is a set of petals/triangles arranged radially around the centre.
// We use SVG path arcs for petal shapes and polygons for geometric diamonds.

const CX = 200; // SVG centre x
const CY = 200; // SVG centre y
const SIZE = 400; // SVG viewBox size

/** Build a single petal (lens / vesica shape) pointing outward from centre */
function petalPath(cx, cy, innerR, outerR, angleDeg, spreadDeg) {
    const toRad = (d) => (d * Math.PI) / 180;
    const halfSpread = spreadDeg / 2;

    const x1 = cx + innerR * Math.cos(toRad(angleDeg - halfSpread));
    const y1 = cy + innerR * Math.sin(toRad(angleDeg - halfSpread));
    const x2 = cx + innerR * Math.cos(toRad(angleDeg + halfSpread));
    const y2 = cy + innerR * Math.sin(toRad(angleDeg + halfSpread));
    const xTip = cx + outerR * Math.cos(toRad(angleDeg));
    const yTip = cy + outerR * Math.sin(toRad(angleDeg));

    const rx = (outerR - innerR) * 0.55;
    const ry = (outerR - innerR) * 0.55;

    return `M ${x1} ${y1} Q ${xTip} ${yTip} ${x2} ${y2} Q ${cx} ${cy} ${x1} ${y1} Z`;
}

/** Build a diamond/rhombus at given angle and radius */
function diamondPath(cx, cy, r, angleDeg, size) {
    const toRad = (d) => (d * Math.PI) / 180;
    const a = toRad(angleDeg);
    const perp = toRad(angleDeg + 90);
    const ox = cx + r * Math.cos(a);
    const oy = cy + r * Math.sin(a);
    return [
        `M ${ox + size * Math.cos(a)} ${oy + size * Math.sin(a)}`,
        `L ${ox + size * 0.5 * Math.cos(perp)} ${oy + size * 0.5 * Math.sin(perp)}`,
        `L ${ox - size * Math.cos(a)} ${oy - size * Math.sin(a)}`,
        `L ${ox - size * 0.5 * Math.cos(perp)} ${oy - size * 0.5 * Math.sin(perp)}`,
        'Z',
    ].join(' ');
}

// Build the 4 rings of rangoli geometry
function buildRings() {
    const rings = [];

    // Ring 1 — innermost, 8 round petals at r=28→52
    const r1 = { petals: [], count: 8, color: '#FF7A1A', r1: 22, r2: 52 };
    for (let i = 0; i < r1.count; i++) {
        r1.petals.push(petalPath(CX, CY, r1.r1, r1.r2, (i * 360) / r1.count, 28));
    }
    rings.push(r1);

    // Ring 2 — 8 pointed diamond tips at r=55→85
    const r2 = { petals: [], count: 8, color: '#FFB627', r1: 52, r2: 85 };
    for (let i = 0; i < r2.count; i++) {
        const angleDeg = (i * 360) / r2.count + 22.5; // offset by half-step
        r2.petals.push(diamondPath(CX, CY, (r2.r1 + r2.r2) / 2, angleDeg, 16));
    }
    rings.push(r2);

    // Ring 3 — 12 petals at r=88→130
    const r3 = { petals: [], count: 12, color: '#FF3D7F', r1: 85, r2: 130 };
    for (let i = 0; i < r3.count; i++) {
        r3.petals.push(petalPath(CX, CY, r3.r1, r3.r2, (i * 360) / r3.count, 22));
    }
    rings.push(r3);

    // Ring 4 — 16 slender petals at r=132→180
    const r4 = { petals: [], count: 16, color: '#E8B33D', r1: 130, r2: 178 };
    for (let i = 0; i < r4.count; i++) {
        r4.petals.push(petalPath(CX, CY, r4.r1, r4.r2, (i * 360) / r4.count, 14));
    }
    rings.push(r4);

    return rings;
}

const RINGS = buildRings();

// ── PortalOverlay component ───────────────────────────────────────────────────
export const PortalOverlay = () => {
    const overlayRef = useRef(null);
    const svgRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !overlayRef.current) return;

        const handler = () => {
            const overlay = overlayRef.current;
            const svg = svgRef.current;
            if (!svg || !overlay) return;

            // Kill any running animation
            gsap.killTweensOf([overlay, ...svg.querySelectorAll('[data-ring]'), glowRef.current]);

            const tl = gsap.timeline();

            // Show overlay
            tl.set(overlay, { opacity: 1, display: 'flex' });

            // Reset all ring elements
            const allPetals = svg.querySelectorAll('[data-petal]');
            const seedDot = svg.querySelector('[data-seed]');
            tl.set(allPetals, { opacity: 0, scale: 0, transformOrigin: `${CX}px ${CY}px` });
            tl.set(seedDot, { opacity: 0, scale: 0, transformOrigin: `${CX}px ${CY}px` });
            tl.set(glowRef.current, { opacity: 0 });

            // 1. Seed dot
            tl.to(seedDot, {
                opacity: 1,
                scale: 1,
                duration: 0.08,
                ease: 'back.out(3)',
                transformOrigin: `${CX}px ${CY}px`,
            });

            // 2. Rings bloom outward, one after another with a tight stagger
            RINGS.forEach((ring, ri) => {
                const ringPetals = svg.querySelectorAll(`[data-ring="${ri}"]`);
                tl.to(
                    ringPetals,
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 0.12,
                        ease: 'back.out(2)',
                        stagger: { amount: 0.08, from: 'random' },
                        transformOrigin: `${CX}px ${CY}px`,
                    },
                    ri === 0 ? '+=0.04' : `-=0.04`
                );
            });

            // 3. Warm glow pulse at peak
            tl.to(
                glowRef.current,
                { opacity: 0.7, duration: 0.15, ease: 'power2.out' },
                '-=0.1'
            ).to(glowRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' });

            // 4. Whole mandala dissolves — expands + fades
            tl.to(
                svg,
                {
                    scale: 1.35,
                    opacity: 0,
                    duration: 0.38,
                    ease: 'power2.in',
                    transformOrigin: `${CX}px ${CY}px`,
                },
                '-=0.2'
            );

            // 5. Hide overlay
            tl.set(overlay, { opacity: 0, display: 'none' });
            tl.set(svg, { scale: 1, opacity: 1 });
        };

        window.addEventListener('portal-transition', handler);
        return () => window.removeEventListener('portal-transition', handler);
    }, []);

    return (
        <div
            ref={overlayRef}
            aria-hidden="true"
            style={{ display: 'none', opacity: 0 }}
            className="fixed inset-0 z-[200] pointer-events-none items-center justify-center"
        >
            {/* Warm radial glow behind the mandala */}
            <div
                ref={glowRef}
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse at center, rgba(255,182,39,0.55) 0%, rgba(255,122,26,0.25) 40%, transparent 70%)',
                    opacity: 0,
                    willChange: 'opacity',
                }}
            />

            {/* Rangoli mandala SVG */}
            <svg
                ref={svgRef}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                width="min(90vmin, 640px)"
                height="min(90vmin, 640px)"
                style={{ overflow: 'visible', willChange: 'transform, opacity' }}
            >
                {/* Seed dot */}
                <circle
                    data-seed
                    cx={CX}
                    cy={CY}
                    r={12}
                    fill="#FF7A1A"
                    opacity={0}
                />

                {/* Concentric rings of petals */}
                {RINGS.map((ring, ri) =>
                    ring.petals.map((d, pi) => (
                        <path
                            key={`${ri}-${pi}`}
                            data-petal
                            data-ring={ri}
                            d={d}
                            fill={ring.color}
                            opacity={0}
                            style={{ willChange: 'transform, opacity' }}
                        />
                    ))
                )}

                {/* Centre decorative dot ring */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const a = (i * Math.PI * 2) / 8;
                    return (
                        <circle
                            key={`dot-${i}`}
                            data-petal
                            data-ring={0}
                            cx={CX + 15 * Math.cos(a)}
                            cy={CY + 15 * Math.sin(a)}
                            r={3.5}
                            fill="#FFB627"
                            opacity={0}
                            style={{ willChange: 'transform, opacity' }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

// ── Trigger helper ────────────────────────────────────────────────────────────
export function triggerPortal() {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('portal-transition'));
}

// ── SectionPortal ─────────────────────────────────────────────────────────────
export const SectionPortal = ({ threshold = 0.3 }) => {
    const markerRef = useRef(null);

    useEffect(() => {
        const el = markerRef.current;
        if (!el) return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    triggerPortal();
                    obs.disconnect();
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);

    return (
        <div ref={markerRef} aria-hidden="true" className="absolute top-0 left-0 w-px h-px" />
    );
};

export default PortalOverlay;