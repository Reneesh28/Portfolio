import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';

/**
 * SpiderWebBackground
 *
 * Spider-Verse multiverse portal — concentric irregular glowing polygons
 * radiating from a bright core, with energy streaks and particle effects.
 * Inspired by the dimensional rift / portal aesthetic from Across the Spider-Verse.
 *
 * Features:
 *  - Concentric irregular polygons (hex/oct) with slight rotation offsets
 *  - Color gradient: white core → cyan/blue → magenta/pink → orange/saffron
 *  - SVG glow filters for neon luminosity
 *  - Radiating energy streaks shooting outward
 *  - Floating particle sparkles
 *  - GSAP scale/rotation/opacity entrance + continuous breathing animation
 *  - Respects prefers-reduced-motion
 *
 * Props:
 *  - ringCount   : concentric polygon rings (default 8)
 *  - sides       : polygon sides per ring (default 7)
 *  - originX/Y   : portal center as % (default 82%, 28%)
 *  - maxRadius   : outermost ring radius in SVG units (default 450)
 *  - streakCount : number of energy streaks (default 14)
 *  - particleCount: sparkle particles (default 30)
 *  - className   : additional class names
 */

// Deterministic seeded pseudo-random
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Generate an irregular polygon path
function irregularPolygon(cx, cy, radius, sides, rotation, rand, irregularity = 0.12) {
  const angleStep = (Math.PI * 2) / sides;
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = angleStep * i + rotation;
    const rJitter = radius * (1 + (rand() - 0.5) * irregularity);
    const aJitter = angle + (rand() - 0.5) * 0.08;
    points.push({
      x: cx + Math.cos(aJitter) * rJitter,
      y: cy + Math.sin(aJitter) * rJitter,
    });
  }

  // Build closed path with slight curves between vertices
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i <= sides; i++) {
    const curr = points[i % sides];
    const prev = points[(i - 1) % sides];
    // Control point slightly pulled outward for organic curvature
    const midAngle = Math.atan2(
      (prev.y + curr.y) / 2 - cy,
      (prev.x + curr.x) / 2 - cx
    );
    const midDist = Math.sqrt(
      ((prev.x + curr.x) / 2 - cx) ** 2 + ((prev.y + curr.y) / 2 - cy) ** 2
    );
    const cpDist = midDist + radius * 0.04 * (rand() - 0.3);
    const cpx = cx + Math.cos(midAngle) * cpDist;
    const cpy = cy + Math.sin(midAngle) * cpDist;
    d += ` Q ${cpx} ${cpy} ${curr.x} ${curr.y}`;
  }
  d += ' Z';
  return d;
}

// Color stops for rings (inner → outer) — thick strokes + colored fills like the reference
const RING_COLORS = [
  { stroke: '#FFFFFF',   fill: '#CCEEFF', fillOpacity: 0.25, opacity: 0.95, width: 8  },  // core — bright white
  { stroke: '#B0D4FF',   fill: '#6688CC', fillOpacity: 0.20, opacity: 0.85, width: 9  },  // pale blue
  { stroke: '#00E5FF',   fill: '#0088AA', fillOpacity: 0.18, opacity: 0.80, width: 10 },  // cyan
  { stroke: '#B070FF',   fill: '#6633AA', fillOpacity: 0.20, opacity: 0.75, width: 11 },  // purple
  { stroke: '#FF2DAA',   fill: '#AA1177', fillOpacity: 0.22, opacity: 0.80, width: 12 },  // magenta
  { stroke: '#FF3D7F',   fill: '#CC2255', fillOpacity: 0.22, opacity: 0.80, width: 13 },  // rose pink
  { stroke: '#FF7A1A',   fill: '#CC5500', fillOpacity: 0.25, opacity: 0.85, width: 15 },  // saffron/orange
  { stroke: '#FFB627',   fill: '#CC8800', fillOpacity: 0.28, opacity: 0.85, width: 16 },  // marigold/gold
  { stroke: '#FFD447',   fill: '#CCAA22', fillOpacity: 0.22, opacity: 0.70, width: 18 },  // yellow outer
  { stroke: '#FF7A1A',   fill: '#AA5500', fillOpacity: 0.15, opacity: 0.55, width: 14 },  // fading saffron
];

const SpiderWebBackground = ({
  ringCount = 8,
  sides = 7,
  originX = 82,
  originY = 28,
  maxRadius = 450,
  streakCount = 14,
  particleCount = 30,
  className = '',
}) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // --- Generate geometry ---
  const { rings, streaks, particles } = useMemo(() => {
    const rand = seededRandom(42);
    const cx = (originX / 100) * 1000;
    const cy = (originY / 100) * 1000;

    // Rings: inner to outer, each slightly rotated
    const ringsData = [];
    for (let i = 0; i < ringCount; i++) {
      const t = i / (ringCount - 1); // 0 → 1
      const r = 30 + t * maxRadius;
      const rotation = i * 0.18 + rand() * 0.3; // progressive twist
      const colorIdx = Math.min(i, RING_COLORS.length - 1);
      const color = RING_COLORS[colorIdx];

      ringsData.push({
        path: irregularPolygon(cx, cy, r, sides, rotation, rand, 0.08 + t * 0.06),
        color,
        radius: r,
        index: i,
      });
    }

    // Energy streaks: diagonal lines radiating from center
    const streaksData = [];
    for (let i = 0; i < streakCount; i++) {
      const angle = (Math.PI * 2 * i) / streakCount + (rand() - 0.5) * 0.4;
      const startR = maxRadius * (0.5 + rand() * 0.3);
      const endR = maxRadius * (1.1 + rand() * 0.8);
      const sx = cx + Math.cos(angle) * startR;
      const sy = cy + Math.sin(angle) * startR;
      const ex = cx + Math.cos(angle) * endR;
      const ey = cy + Math.sin(angle) * endR;

      // Slight perpendicular offset for "comet" shape
      const perpAngle = angle + Math.PI / 2;
      const thickness = 1.5 + rand() * 3;

      streaksData.push({
        x1: sx, y1: sy, x2: ex, y2: ey,
        angle: (angle * 180) / Math.PI,
        thickness,
        color: RING_COLORS[Math.floor(rand() * 6) + 2].stroke,
        opacity: 0.3 + rand() * 0.5,
        length: endR - startR,
      });
    }

    // Sparkle particles
    const particlesData = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = maxRadius * (0.2 + rand() * 1.2);
      particlesData.push({
        cx: cx + Math.cos(angle) * dist,
        cy: cy + Math.sin(angle) * dist,
        r: 1 + rand() * 3,
        color: RING_COLORS[Math.floor(rand() * RING_COLORS.length)].stroke,
        opacity: 0.3 + rand() * 0.7,
        delay: rand() * 3,
      });
    }

    return { rings: ringsData, streaks: streaksData, particles: particlesData };
  }, [ringCount, sides, originX, originY, maxRadius, streakCount, particleCount]);

  // --- Animations ---
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !svgRef.current) return;

    const svg = svgRef.current;
    const ringEls = svg.querySelectorAll('.portal-ring');
    const streakEls = svg.querySelectorAll('.portal-streak');
    const particleEls = svg.querySelectorAll('.portal-particle');
    const coreEl = svg.querySelector('.portal-core');

    // --- Entrance: rings scale in from center with stagger ---
    gsap.set(ringEls, { scale: 0, opacity: 0, transformOrigin: 'center center' });
    gsap.set(streakEls, { opacity: 0, scaleX: 0 });
    gsap.set(particleEls, { opacity: 0, scale: 0 });

    const entranceTl = gsap.timeline({ delay: 0.4 });

    // Core flash
    if (coreEl) {
      entranceTl.fromTo(
        coreEl,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', transformOrigin: 'center center' },
        0
      );
    }

    // Rings expand outward with stagger
    entranceTl.to(ringEls, {
      scale: 1,
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      stagger: { each: 0.08, from: 'start' },
    }, 0.1);

    // Streaks fly in
    entranceTl.to(streakEls, {
      opacity: 1,
      scaleX: 1,
      duration: 0.5,
      ease: 'power3.out',
      stagger: { each: 0.04, from: 'random' },
    }, 0.5);

    // Particles pop in
    entranceTl.to(particleEls, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(2)',
      stagger: { each: 0.02, from: 'random' },
    }, 0.6);

    // --- Continuous breathing: slow rotation + scale pulse ---
    const breathTl = gsap.timeline({ repeat: -1, yoyo: true });

    ringEls.forEach((el, i) => {
      // Alternate rotation direction per ring
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.to(el, {
        rotation: `+=${dir * 3}`,
        duration: 8 + i * 1.5,
        ease: 'none',
        repeat: -1,
        transformOrigin: 'center center',
      });
    });

    // Scale breathe on outermost rings
    breathTl.to(ringEls, {
      scale: 1.02,
      duration: 3,
      ease: 'sine.inOut',
      stagger: { each: 0.1 },
    });

    // Particle twinkle
    particleEls.forEach((el, i) => {
      gsap.to(el, {
        opacity: 0.1 + Math.random() * 0.3,
        scale: 0.5 + Math.random() * 0.5,
        duration: 1.5 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    });

    // Streak shimmer
    streakEls.forEach((el) => {
      gsap.to(el, {
        opacity: `random(0.15, 0.6)`,
        duration: `random(1.5, 3)`,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    });

    return () => {
      entranceTl.kill();
      breathTl.kill();
      gsap.killTweensOf(ringEls);
      gsap.killTweensOf(particleEls);
      gsap.killTweensOf(streakEls);
    };
  }, [rings, streaks, particles]);

  const cx = (originX / 100) * 1000;
  const cy = (originY / 100) * 1000;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          {/* Glow filters — one per color intensity tier */}
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-core" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial gradient for the core flash */}
          <radialGradient id="core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="20%" stopColor="#D0E8FF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#B070FF" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#FF2DAA" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2B1B4D" stopOpacity="0" />
          </radialGradient>

          {/* Deep indigo/purple background wash behind the portal */}
          <radialGradient id="bg-wash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4B2080" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#2B1B4D" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#1A1040" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#08080A" stopOpacity="0" />
          </radialGradient>

          {/* Streak gradient: bright → transparent */}
          <linearGradient id="streak-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="30%" stopColor="#FFB627" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* === Deep purple/indigo background wash === */}
        <circle
          cx={cx} cy={cy}
          r={maxRadius * 1.4}
          fill="url(#bg-wash)"
          opacity="0.8"
        />

        {/* === Inner radial glow === */}
        <circle
          cx={cx} cy={cy}
          r={maxRadius * 0.8}
          fill="url(#core-gradient)"
          opacity="0.25"
        />

        {/* === Energy streaks (behind rings) === */}
        <g style={{ mixBlendMode: 'screen' }}>
          {streaks.map((s, i) => (
            <line
              key={`streak-${i}`}
              className="portal-streak"
              x1={s.x1} y1={s.y1}
              x2={s.x2} y2={s.y2}
              stroke={s.color}
              strokeWidth={s.thickness}
              strokeLinecap="round"
              opacity={s.opacity}
              filter="url(#glow-soft)"
            />
          ))}
        </g>

        {/* === Concentric portal rings (outer → inner for correct z-order) === */}
        {/* Ring fills — colored band backgrounds */}
        <g style={{ mixBlendMode: 'screen' }}>
          {[...rings].reverse().map((ring) => (
            <path
              key={`ring-fill-${ring.index}`}
              d={ring.path}
              fill={ring.color.fill}
              fillOpacity={ring.color.fillOpacity}
              stroke="none"
              filter="url(#glow-soft)"
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
        </g>
        {/* Ring strokes — bold glowing outlines on top */}
        <g style={{ mixBlendMode: 'screen' }}>
          {[...rings].reverse().map((ring) => (
            <path
              key={`ring-${ring.index}`}
              className="portal-ring"
              d={ring.path}
              fill="none"
              stroke={ring.color.stroke}
              strokeWidth={ring.color.width}
              opacity={ring.color.opacity}
              strokeLinejoin="round"
              filter={ring.index < 3 ? 'url(#glow-strong)' : 'url(#glow-soft)'}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}
        </g>

        {/* === Bright core === */}
        <circle
          className="portal-core"
          cx={cx} cy={cy}
          r={32}
          fill="white"
          opacity="0.95"
          filter="url(#glow-core)"
        />

        {/* === Sparkle particles === */}
        <g style={{ mixBlendMode: 'screen' }}>
          {particles.map((p, i) => (
            <circle
              key={`particle-${i}`}
              className="portal-particle"
              cx={p.cx}
              cy={p.cy}
              r={p.r}
              fill={p.color}
              opacity={p.opacity}
              filter="url(#glow-soft)"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SpiderWebBackground;
