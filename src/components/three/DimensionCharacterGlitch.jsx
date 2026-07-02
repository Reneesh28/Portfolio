import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * DimensionCharacterGlitch
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * The actual Spider-Verse core mechanic — other-universe Spider-People
 * bleed through the dimensional membrane as chromatic ghost silhouettes.
 *
 * How it works (matching the film technique exactly):
 *   1. A Spider-Person silhouette appears at a random position
 *   2. Three RGB-separated shadow copies offset in magenta/cyan/saffron
 *      simulate the chromatic aberration of dimension-bleed
 *   3. The figure flickers using GSAP steps() — the same off-model
 *      12fps frame-drop the films use for "wrong-universe" characters
 *   4. Horizontal datamosh scan-lines (animated clipPath slices) tear
 *      across the figure as it tries to stabilise and fails
 *   5. The figure destabilises and vanishes — leaving only a brief
 *      chromatic after-image
 *
 * Four silhouette poses (abstract superhero humanoids — no licensed IP):
 *   • LEAPING   — arms out, one leg up (swinging between buildings)
 *   • CROUCHING — low stance, arms back (ready to pounce)
 *   • WALLCRAWL — spread-eagle, body tilted 45° (clinging to a surface)
 *   • SHOOTING  — one arm extended, body twisted (web-shot release)
 *
 * Usage:
 *   <DimensionCharacterGlitch />   ← mount once near root (fixed overlay)
 *
 * Or inside a section for localised hauntings:
 *   <div className="absolute inset-0 overflow-hidden pointer-events-none">
 *     <DimensionCharacterGlitch interval={[6000, 14000]} maxVisible={1} />
 *   </div>
 */

// ── Silhouette SVG paths ─────────────────────────────────────────────────────
// All defined in a 100×170 viewBox (portrait aspect).
// Each path traces a distinct superhero pose so the silhouettes read as
// different characters even when filled as solid colour shapes.

const POSES = {
    // Miles Morales — midair leap, arms spread, cape/web-wings implied
    LEAPING: `
    M 50 8 C 56 8 62 13 62 21 L 72 10 L 78 18 L 64 32
    C 68 40 70 50 68 58 L 80 52 L 84 62 L 70 70
    L 66 100 L 60 140 L 56 140 L 52 105 L 48 105 L 44 140
    L 40 140 L 34 100 L 30 70 L 16 62 L 20 52 L 32 58
    C 30 50 32 40 36 32 L 22 18 L 28 10 L 38 21
    C 38 13 44 8 50 8 Z
  `,
    // Ghost-Spider / Gwen — balletic, one leg extended behind, arms graceful
    CROUCHING: `
    M 50 6 C 57 6 63 12 63 20 L 63 20 C 66 14 74 12 76 18
    L 68 28 C 72 36 73 46 70 55
    L 84 48 L 87 60 L 72 66 L 68 90 L 62 130 L 56 130
    L 52 92 L 48 92 L 44 130 L 38 130 L 32 90 L 28 66
    L 13 60 L 16 48 L 30 55 C 27 46 28 36 32 28
    L 24 18 C 26 12 34 14 37 20 C 37 12 43 6 50 6 Z
  `,
    // Spider-Man 2099 (Miguel) — wall-crawl spread-eagle, tilted pose
    WALLCRAWL: `
    M 50 10 C 57 10 63 15 63 23
    L 82 6 L 88 16 L 72 30 C 76 38 77 50 74 60
    L 90 72 L 88 84 L 72 76 L 65 110 L 59 155 L 52 155
    L 48 155 L 41 155 L 35 110 L 28 76 L 12 84 L 10 72
    L 26 60 C 23 50 24 38 28 30 L 12 16 L 18 6 L 37 23
    C 37 15 43 10 50 10 Z
  `,
    // Peni Parker / SP//dr — chibi proportions, slightly wider head, mecha-hinted
    SHOOTING: `
    M 50 4 C 59 4 66 11 66 21 C 70 15 78 15 80 22
    L 76 30 L 88 38 L 84 50 L 70 45
    C 72 55 71 66 68 74 L 78 68 L 82 80 L 66 86
    L 60 128 L 54 128 L 50 94 L 46 94 L 40 128 L 34 128
    L 28 86 L 12 80 L 16 68 L 26 74 C 23 66 22 55 24 45
    L 10 50 L 6 38 L 18 30 L 14 22 C 16 15 24 15 28 21
    C 28 11 35 4 50 4 Z
  `,
};

const POSE_KEYS = Object.keys(POSES);

// Palette: each "universe" gets a primary colour + its RGB-split shadows
const UNIVERSE_PALETTES = [
    // Miles Morales universe — red/black
    { primary: '#E0122A', shadowA: '#FF2DAA', shadowB: '#00E5FF', label: 'E-1610' },
    // Ghost-Spider universe — cool white/blue
    { primary: '#B8F0FF', shadowA: '#FF7A1A', shadowB: '#FF2DAA', label: 'E-65' },
    // Spider-Man 2099 universe — deep blue
    { primary: '#287BFF', shadowA: '#E0122A', shadowB: '#FF7A1A', label: 'E-928' },
    // Pavitr Prabhakar universe — saffron/marigold
    { primary: '#FFB627', shadowA: '#00E5FF', shadowB: '#E0122A', label: 'E-50101' },
];

// ── Datamosh scan-line generator ─────────────────────────────────────────────
// Returns a random set of horizontal clip-path "slices" to simulate
// pixel-row displacement when a dimension tears
function buildDatamoshClip(sliceCount = 8) {
    // Build a clipPath polygon that cuts irregular horizontal bands
    const lines = [];
    const h = 170;
    const step = h / sliceCount;
    lines.push('polygon(');
    for (let i = 0; i < sliceCount; i++) {
        const y0 = (i * step).toFixed(1);
        const y1 = ((i + 1) * step - 1).toFixed(1);
        const xShift = (Math.random() - 0.5) * 14; // horizontal tear offset
        lines.push(
            `${(xShift > 0 ? xShift : 0).toFixed(1)}% ${y0}px, ` +
            `${(100 + (xShift < 0 ? xShift : 0)).toFixed(1)}% ${y0}px, ` +
            `${(100 + (xShift < 0 ? xShift : 0)).toFixed(1)}% ${y1}px, ` +
            `${(xShift > 0 ? xShift : 0).toFixed(1)}% ${y1}px` +
            (i < sliceCount - 1 ? ',' : '')
        );
    }
    lines.push(')');
    return lines.join(' ');
}

// ── Single character haunting ─────────────────────────────────────────────────
function spawnHaunt(container, reducedMotion) {
    if (reducedMotion || !container) return;

    // Pick random pose, palette, position
    const pose = POSES[POSE_KEYS[Math.floor(Math.random() * POSE_KEYS.length)]];
    const pal = UNIVERSE_PALETTES[Math.floor(Math.random() * UNIVERSE_PALETTES.length)];
    const scale = 0.6 + Math.random() * 0.7; // 0.6 – 1.3×
    const x = 5 + Math.random() * 80; // 5–85% from left
    const y = 5 + Math.random() * 75; // 5–80% from top
    const flipX = Math.random() > 0.5 ? -1 : 1;
    const tiltDeg = (Math.random() - 0.5) * 24;

    // Build DOM
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
    position: absolute;
    left: ${x}%;
    top: ${y}%;
    transform: translate(-50%, -50%) scaleX(${flipX}) rotate(${tiltDeg}deg);
    pointer-events: none;
    will-change: transform, opacity;
    z-index: 10;
  `;

    // SVG — three layers: shadowA (offset left), shadowB (offset right), primary (centre)
    const w = 100 * scale;
    const h = 170 * scale;
    const offPx = Math.round(4 * scale);

    wrapper.innerHTML = `
    <svg
      viewBox="0 0 100 170"
      width="${w}"
      height="${h}"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      class="dimension-haunt-svg"
      style="display:block;overflow:visible;"
    >
      <defs>
        <clipPath id="dc-clip-a-${Date.now()}-r">
          <path d="${pose}" />
        </clipPath>
        <clipPath id="dc-clip-b-${Date.now()}-r">
          <path d="${pose}" />
        </clipPath>
        <clipPath id="dc-clip-main-${Date.now()}-r">
          <path d="${pose}" />
        </clipPath>
      </defs>
      <!-- Shadow A — chromatic layer, offset left -->
      <g transform="translate(${-offPx}, ${offPx * 0.5})"
         style="mix-blend-mode:screen; opacity:0.75;">
        <rect x="-10" y="-10" width="120" height="190"
              fill="${pal.shadowA}"
              clip-path="url(#dc-clip-a-${Date.now()}-r)" />
      </g>
      <!-- Shadow B — chromatic layer, offset right -->
      <g transform="translate(${offPx}, ${-offPx * 0.5})"
         style="mix-blend-mode:screen; opacity:0.75;">
        <rect x="-10" y="-10" width="120" height="190"
              fill="${pal.shadowB}"
              clip-path="url(#dc-clip-b-${Date.now()}-r)" />
      </g>
      <!-- Primary silhouette — centre layer -->
      <g style="mix-blend-mode:screen; opacity:0.9;">
        <rect x="-10" y="-10" width="120" height="190"
              fill="${pal.primary}"
              clip-path="url(#dc-clip-main-${Date.now()}-r)" />
      </g>
      <!-- Universe label — tiny caption box below character -->
      <text
        x="50" y="168"
        text-anchor="middle"
        font-family="monospace"
        font-size="7"
        font-weight="bold"
        fill="${pal.primary}"
        style="opacity:0.6; letter-spacing:1px;"
      >EARTH-${pal.label.replace('E-', '')}</text>
    </svg>
  `;

    container.appendChild(wrapper);

    // ── GSAP flicker sequence ──────────────────────────────────────────────────
    // Mirrors the film technique: rapid stepped on/off → hold with datamosh
    // scan-line displacement → destabilise → chromatic after-image → gone
    const tl = gsap.timeline({
        onComplete: () => {
            wrapper.remove();
        },
    });

    // Phase 1: Flicker in — stepped, off-model
    tl.set(wrapper, { opacity: 0, scaleY: 1.06 })
        .to(wrapper, { opacity: 1, duration: 0.06, ease: 'steps(1)' })
        .to(wrapper, { opacity: 0, duration: 0.04, ease: 'steps(1)' })
        .to(wrapper, { opacity: 1, duration: 0.06, ease: 'steps(1)' })
        .to(wrapper, { opacity: 0, duration: 0.03, ease: 'steps(1)' })
        .to(wrapper, { opacity: 1, duration: 0.06, ease: 'steps(1)' });

    // Phase 2: Unstable hold — datamosh clip-path slice displacement
    const datamoshDuration = 0.4 + Math.random() * 0.5;
    const tl2 = gsap.timeline({ repeat: 3 });
    tl2.to(wrapper, {
        clipPath: buildDatamoshClip(6),
        duration: 0.07,
        ease: 'steps(1)',
    }).to(wrapper, {
        clipPath: buildDatamoshClip(8),
        duration: 0.07,
        ease: 'steps(1)',
    }).to(wrapper, {
        clipPath: buildDatamoshClip(5),
        duration: 0.07,
        ease: 'steps(1)',
    }).to(wrapper, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.06,
        ease: 'steps(1)',
    });

    tl.add(tl2, '+=0.05');

    // Phase 3: Ghostly hold — partially visible, drifting upward
    tl.to(wrapper, {
        y: -8,
        opacity: 0.7,
        scaleX: flipX * (1 + Math.random() * 0.05),
        duration: datamoshDuration,
        ease: `steps(${Math.floor(datamoshDuration / 0.08)})`,
    });

    // Phase 4: Final destabilise flicker + vanish
    tl.to(wrapper, { opacity: 0, duration: 0.04, ease: 'steps(1)' })
        .to(wrapper, { opacity: 0.5, duration: 0.04, ease: 'steps(1)' })
        .to(wrapper, { opacity: 0, duration: 0.04, ease: 'steps(1)' })
        .to(wrapper, { opacity: 0.2, duration: 0.04, ease: 'steps(1)' })
        .to(wrapper, {
            opacity: 0,
            scaleY: 0.92,
            duration: 0.12,
            ease: 'steps(3)',
        });

    return tl;
}

// ── Main Component ────────────────────────────────────────────────────────────
const DimensionCharacterGlitch = ({
    interval = [5000, 12000], // ms between hauntings [min, max]
    maxVisible = 2,           // max simultaneous ghost characters
    className = '',
}) => {
    const containerRef = useRef(null);
    const activeRef = useRef(0);
    const timerRef = useRef(null);
    const reducedMotion = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scheduleNext = useCallback(() => {
        const delay = interval[0] + Math.random() * (interval[1] - interval[0]);
        timerRef.current = setTimeout(() => {
            if (activeRef.current < maxVisible) {
                activeRef.current++;
                const tl = spawnHaunt(containerRef.current, reducedMotion);
                if (tl) {
                    tl.eventCallback('onComplete', () => {
                        activeRef.current = Math.max(0, activeRef.current - 1);
                    });
                }
            }
            scheduleNext();
        }, delay);
    }, [interval, maxVisible, reducedMotion]);

    useEffect(() => {
        if (reducedMotion) return;
        // First haunting starts sooner so users see it quickly
        timerRef.current = setTimeout(() => scheduleNext(), 2000);
        return () => clearTimeout(timerRef.current);
    }, [scheduleNext, reducedMotion]);

    if (reducedMotion) return null;

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={`pointer-events-none overflow-hidden ${className}`}
            style={{ position: 'absolute', inset: 0, zIndex: 5 }}
        />
    );
};

export default DimensionCharacterGlitch;