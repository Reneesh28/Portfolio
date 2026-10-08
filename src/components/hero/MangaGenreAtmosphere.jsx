import React from 'react';

/**
 * Visual background & atmosphere generator for the 7 Manga Genres.
 * Renders pure monochrome/ink/screentone SVG elements that physically morph
 * and adapt based on the active genre lens.
 */
export default function MangaGenreAtmosphere({ activeGenre }) {
  return (
    <div className={`manga-genre-atmosphere genre-${activeGenre}`} aria-hidden="true">
      {/* Universal Manga Screentone Texture */}
      <div className="screentone-base-grid"></div>

      {/* SHŌNEN: Speed lines and explosive radial velocity */}
      {activeGenre === 'shonen' && (
        <svg className="atmosphere-svg speed-lines-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <radialGradient id="shonenSpeed" cx="60%" cy="50%" r="50%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor="#111116" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#111116" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <g stroke="#111116" strokeWidth="2.5" opacity="0.6">
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              const x1 = 600 + Math.cos(angle) * 180;
              const y1 = 500 + Math.sin(angle) * 180;
              const x2 = 600 + Math.cos(angle) * 900;
              const y2 = 500 + Math.sin(angle) * 900;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  strokeWidth={i % 2 === 0 ? '3.5' : '1.5'}
                  strokeDasharray={i % 3 === 0 ? '120 40' : 'none'}
                />
              );
            })}
          </g>
          {/* Action Impact Kanji Watermark */}
          <text
            x="85%"
            y="88%"
            fontFamily="'Dela Gothic One', sans-serif"
            fontSize="72"
            fill="#111116"
            opacity="0.15"
            textAnchor="end"
          >
            限界突破 // ACCELERATION
          </text>
        </svg>
      )}

      {/* SEINEN: Architectural framing & mature deep shadows */}
      {activeGenre === 'seinen' && (
        <svg className="atmosphere-svg seinen-grid-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#111116" strokeWidth="1" opacity="0.25">
            {/* Perspective grid lines */}
            <line x1="0" y1="200" x2="1000" y2="200" strokeDasharray="6 6" />
            <line x1="0" y1="500" x2="1000" y2="500" strokeDasharray="6 6" />
            <line x1="0" y1="800" x2="1000" y2="800" strokeDasharray="6 6" />
            <line x1="250" y1="0" x2="250" y2="1000" strokeDasharray="6 6" />
            <line x1="750" y1="0" x2="750" y2="1000" strokeDasharray="6 6" />
            {/* Cinematic cross-hatch shadows */}
            <rect x="0" y="0" width="1000" height="1000" fill="none" stroke="#111116" strokeWidth="1" />
          </g>
          <text
            x="92%"
            y="94%"
            fontFamily="'Shippori Mincho', serif"
            fontSize="48"
            fill="#111116"
            opacity="0.18"
            textAnchor="end"
            letterSpacing="0.2em"
          >
            構造的深淵 // ARCHITECTURE
          </text>
        </svg>
      )}

      {/* SLICE OF LIFE: Quiet workspace, coffee & human touch */}
      {activeGenre === 'slice_of_life' && (
        <svg className="atmosphere-svg sol-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#111116" strokeWidth="1.2" opacity="0.2">
            {/* Notebook margins and soft measurement ticks */}
            <line x1="60" y1="0" x2="60" y2="1000" stroke="#888894" strokeWidth="1.5" />
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={i} x1="40" y1={i * 50 + 40} x2="980" y2={i * 50 + 40} strokeDasharray="3 8" />
            ))}
          </g>
          <text
            x="90%"
            y="92%"
            fontFamily="'Yuji Syuku', serif"
            fontSize="42"
            fill="#111116"
            opacity="0.25"
            textAnchor="end"
          >
            日常の試行錯誤 // COFFEE & REPO
          </text>
        </svg>
      )}

      {/* DARK FANTASY: Heavy gothic ink silhouettes and textured abyss */}
      {activeGenre === 'dark_fantasy' && (
        <svg className="atmosphere-svg dark-fantasy-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <defs>
            <filter id="inkRough">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="18" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <path
            d="M0,0 L1000,0 L1000,400 Q750,550 500,380 T0,600 Z"
            fill="#0A0A0E"
            opacity="0.45"
            filter="url(#inkRough)"
          />
          <text
            x="85%"
            y="90%"
            fontFamily="'Yuji Boku', serif"
            fontSize="64"
            fill="#F4EFE6"
            opacity="0.15"
            textAnchor="end"
          >
            深淵の構築 // FORGE
          </text>
        </svg>
      )}

      {/* ISEKAI: Dimensional threshold runes & astral geometry */}
      {activeGenre === 'isekai' && (
        <svg className="atmosphere-svg isekai-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#111116" strokeWidth="1.5" fill="none" opacity="0.35">
            {/* Concentric transmutation circle */}
            <circle cx="650" cy="500" r="320" strokeDasharray="8 6" />
            <circle cx="650" cy="500" r="280" strokeWidth="2" />
            <circle cx="650" cy="500" r="240" strokeDasharray="16 8" />
            <polygon points="650,220 927,660 373,660" strokeWidth="1.5" />
            <polygon points="650,780 927,340 373,340" strokeWidth="1.5" />
          </g>
          <text
            x="88%"
            y="92%"
            fontFamily="'Dela Gothic One', sans-serif"
            fontSize="48"
            fill="#111116"
            opacity="0.2"
            textAnchor="end"
          >
            境界線突破 // ISEKAI TRANSIT
          </text>
        </svg>
      )}

      {/* SCI-FI: AI Schematics, Neural Node graph, CAD Bounding Boxes */}
      {activeGenre === 'sci_fi' && (
        <svg className="atmosphere-svg scifi-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#111116" strokeWidth="1" fill="none" opacity="0.4">
            {/* Coordinate axes */}
            <line x1="50" y1="50" x2="950" y2="50" strokeDasharray="4 4" />
            <line x1="50" y1="950" x2="950" y2="950" strokeDasharray="4 4" />
            {/* Neural Net Graph nodes */}
            <circle cx="700" cy="300" r="6" fill="#111116" />
            <circle cx="780" cy="240" r="4" fill="#111116" />
            <circle cx="820" cy="360" r="5" fill="#111116" />
            <circle cx="880" cy="300" r="6" fill="#111116" />
            <line x1="700" y1="300" x2="780" y2="240" />
            <line x1="700" y1="300" x2="820" y2="360" />
            <line x1="780" y1="240" x2="880" y2="300" />
            <line x1="820" y1="360" x2="880" y2="300" />
            {/* Crosshair marks */}
            <path d="M 680,280 L 680,320 M 660,300 L 700,300" />
            <rect x="660" y="200" width="260" height="200" strokeDasharray="2 4" />
          </g>
          <text
            x="92%"
            y="94%"
            fontFamily="'Noto Sans JP', sans-serif"
            fontWeight="900"
            fontSize="36"
            fill="#111116"
            opacity="0.3"
            textAnchor="end"
            letterSpacing="0.25em"
          >
            NEURAL SYSTEM // TENSOR: [512, 1024, 7]
          </text>
        </svg>
      )}

      {/* PSYCHOLOGICAL: Fractured mirrors, diagonal cuts & recursive strips */}
      {activeGenre === 'psychological' && (
        <svg className="atmosphere-svg psych-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <g stroke="#111116" strokeWidth="2" opacity="0.35">
            {/* Psychological shard fissures */}
            <line x1="0" y1="300" x2="1000" y2="600" />
            <line x1="300" y1="0" x2="700" y2="1000" strokeWidth="3" />
            <line x1="600" y1="0" x2="200" y2="1000" strokeDasharray="10 5" />
          </g>
          <text
            x="90%"
            y="92%"
            fontFamily="'Yuji Boku', serif"
            fontSize="54"
            fill="#111116"
            opacity="0.2"
            textAnchor="end"
          >
            再帰的思考の深淵 // INTERNAL MONOLOGUE
          </text>
        </svg>
      )}
    </div>
  );
}
