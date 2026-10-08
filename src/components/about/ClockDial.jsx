import React, { useRef, useCallback } from 'react';
import { IDENTITY_MARKS } from '../../data/aboutActs';

/**
 * ClockDial - 24-Hour Manga Chronometer & Notch Selector
 * Modes:
 *  - "progress": Mini dial on left edge during acts (follows scroll hour)
 *  - "select": Interactive 560px dial in finale around WolfStage
 */
export default function ClockDial({
  mode = 'progress',
  hour = 6.0,
  activeMarkId = 'intern',
  onSelectMark = () => {},
  onConfirmSpread = () => {},
  className = '',
}) {
  const dialRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Convert hour (0-24/25) to degrees (00:00 at top = 0 deg)
  const hourToDegrees = (h) => {
    const norm = (h % 24);
    return (norm / 24) * 360;
  };

  const angle = hourToDegrees(hour);

  // Hand path generator - slightly wavering vermilion thread
  const generateThreadPath = (deg, radius = 160) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const endX = 200 + radius * Math.cos(rad);
    const endY = 200 + radius * Math.sin(rad);

    // Subtle natural wavering control points
    const midRad1 = (((deg - 90) + 4) * Math.PI) / 180;
    const midX1 = 200 + (radius * 0.35) * Math.cos(midRad1) + (Math.sin(deg * 0.1) * 3);
    const midY1 = 200 + (radius * 0.35) * Math.sin(midRad1) - (Math.cos(deg * 0.1) * 3);

    const midRad2 = (((deg - 90) - 3) * Math.PI) / 180;
    const midX2 = 200 + (radius * 0.72) * Math.cos(midRad2) - (Math.sin(deg * 0.08) * 4);
    const midY2 = 200 + (radius * 0.72) * Math.sin(midRad2) + (Math.cos(deg * 0.08) * 4);

    return `M 200 200 Q ${midX1.toFixed(1)} ${midY1.toFixed(1)}, ${midX2.toFixed(1)} ${midY2.toFixed(1)} T ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  };

  // Drag interaction in select mode
  const handlePointerDown = (e) => {
    if (mode !== 'select') return;
    isDraggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || mode !== 'select' || !dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Angle in degrees from top (00:00) clockwise
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    // Find nearest notch by angle
    let closestMark = IDENTITY_MARKS[0];
    let minDiff = Infinity;

    IDENTITY_MARKS.forEach((mark) => {
      const markAngle = mark.angle % 360;
      let diff = Math.abs(deg - markAngle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestMark = mark;
      }
    });

    if (closestMark.id !== activeMarkId) {
      onSelectMark(closestMark);
    }
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Keyboard navigation across notches in select mode
  const handleKeyDown = useCallback(
    (e) => {
      if (mode !== 'select') return;
      const currentIndex = IDENTITY_MARKS.findIndex((m) => m.id === activeMarkId);

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentIndex + 1) % IDENTITY_MARKS.length;
        onSelectMark(IDENTITY_MARKS[nextIdx]);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentIndex - 1 + IDENTITY_MARKS.length) % IDENTITY_MARKS.length;
        onSelectMark(IDENTITY_MARKS[prevIdx]);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const mark = IDENTITY_MARKS.find((m) => m.id === activeMarkId);
        if (mark) onConfirmSpread(mark);
      }
    },
    [mode, activeMarkId, onSelectMark, onConfirmSpread]
  );

  // Time format helper (06:00, 12:30, 20:00, 01:00)
  const formatTime = (h) => {
    const rawH = Math.floor(h) % 24;
    const mins = Math.round((h - Math.floor(h)) * 60);
    const hh = String(rawH).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const activeMark = IDENTITY_MARKS.find((m) => m.id === activeMarkId) || IDENTITY_MARKS[0];

  // =========================================================
  // PROGRESS MODE (Mini Left-Edge Dial)
  // =========================================================
  if (mode === 'progress') {
    return (
      <aside className={`about-clock-progress ${className}`} aria-label="Chapter 02 Timeline Progress">
        <svg
          viewBox="0 0 400 400"
          className="about-clock-progress-svg"
          aria-hidden="true"
        >
          {/* Outer Ring */}
          <circle cx="200" cy="200" r="185" className="about-dial-outer-ring" />
          <circle cx="200" cy="200" r="172" className="about-dial-inner-ring" strokeDasharray="3 4" />

          {/* 24-Hour Markers */}
          {Array.from({ length: 24 }).map((_, i) => {
            const rad = ((i * 15 - 90) * Math.PI) / 180;
            const x1 = 200 + 172 * Math.cos(rad);
            const y1 = 200 + 172 * Math.sin(rad);
            const isMajor = i % 6 === 0;
            const tickLen = isMajor ? 12 : 6;
            const x2 = 200 + (172 - tickLen) * Math.cos(rad);
            const y2 = 200 + (172 - tickLen) * Math.sin(rad);
            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isMajor ? 'about-dial-tick-major' : 'about-dial-tick'}
              />
            );
          })}

          {/* Notches */}
          {IDENTITY_MARKS.map((mark) => {
            const rad = ((mark.angle - 90) * Math.PI) / 180;
            const nx = 200 + 172 * Math.cos(rad);
            const ny = 200 + 172 * Math.sin(rad);
            return (
              <circle
                key={mark.id}
                cx={nx}
                cy={ny}
                r="5"
                className="about-dial-mini-notch"
              />
            );
          })}

          {/* The Vermilion Thread Hand */}
          <path
            d={generateThreadPath(angle, 155)}
            className="about-dial-hand-thread"
          />

          {/* Center Pivot */}
          <circle cx="200" cy="200" r="7" className="about-dial-pivot-outer" />
          <circle cx="200" cy="200" r="3" className="about-dial-pivot-inner" />
        </svg>

        {/* Current Time Display Box */}
        <div className="about-clock-time-badge">
          <span className="about-time-kanji">時</span>
          <span className="about-time-digits">{formatTime(hour)}</span>
        </div>
      </aside>
    );
  }

  // =========================================================
  // SELECT MODE (Finale Full-Size Dial with Interactive Notches)
  // =========================================================
  return (
    <div
      ref={dialRef}
      className={`about-clock-select-container ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="radiogroup"
      aria-label="Choose an hour to inspect authentic character marks"
    >
      {/* Live region for screen readers */}
      <div className="sr-only" aria-live="polite">
        Selected mark: {activeMark.name} at {formatTime(activeMark.hour)}, {activeMark.subtitle}.
      </div>

      <svg
        viewBox="0 0 400 400"
        className="about-clock-select-svg"
      >
        {/* Outer Screentone Track */}
        <circle cx="200" cy="200" r="190" className="about-dial-select-track" />
        <circle cx="200" cy="200" r="176" className="about-dial-outer-ring" strokeWidth="3" />
        <circle cx="200" cy="200" r="148" className="about-dial-inner-ring" strokeDasharray="4 6" />

        {/* 24-Hour Hour Labels and Ticks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = ((i * 15 - 90) * Math.PI) / 180;
          const x1 = 200 + 176 * Math.cos(rad);
          const y1 = 200 + 176 * Math.sin(rad);
          const isMajor = i % 6 === 0;
          const tickLen = isMajor ? 14 : 7;
          const x2 = 200 + (176 - tickLen) * Math.cos(rad);
          const y2 = 200 + (176 - tickLen) * Math.sin(rad);

          // Hour numbers: 00, 06, 12, 18
          const labelRad = ((i * 15 - 90) * Math.PI) / 180;
          const lx = 200 + 134 * Math.cos(labelRad);
          const ly = 200 + 134 * Math.sin(labelRad);

          return (
            <g key={`select-tick-${i}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={isMajor ? 'about-dial-tick-major' : 'about-dial-tick'}
              />
              {isMajor && (
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor="middle"
                  className="about-dial-hour-label"
                >
                  {String(i).padStart(2, '0')}
                </text>
              )}
            </g>
          );
        })}

        {/* Six Interactive Notches (Kanji Hanko Seals) */}
        {IDENTITY_MARKS.map((mark) => {
          const rad = ((mark.angle - 90) * Math.PI) / 180;
          const nx = 200 + 176 * Math.cos(rad);
          const ny = 200 + 176 * Math.sin(rad);
          const isSelected = activeMarkId === mark.id;

          return (
            <g
              key={mark.id}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${formatTime(mark.hour)}, ${mark.name} - ${mark.subtitle}`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMark(mark);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onConfirmSpread(mark);
                }
              }}
              className={`about-dial-notch-group ${isSelected ? 'is-selected' : ''}`}
            >
              {/* Notch Glow / Active Border */}
              <circle
                cx={nx}
                cy={ny}
                r={isSelected ? 18 : 14}
                className={`about-notch-bg ${isSelected ? 'is-active-notch-bg' : ''}`}
              />
              <circle
                cx={nx}
                cy={ny}
                r={isSelected ? 18 : 14}
                className="about-notch-border"
              />
              {/* Seal Kanji */}
              <text
                x={nx}
                y={ny + 5}
                textAnchor="middle"
                className={`about-notch-kanji ${isSelected ? 'is-active-kanji' : ''}`}
              >
                {mark.kanji}
              </text>
            </g>
          );
        })}

        {/* Vermilion Thread Hand */}
        <path
          d={generateThreadPath(activeMark.angle, 172)}
          className="about-dial-hand-thread is-selectable"
        />

        {/* Center Hub */}
        <circle cx="200" cy="200" r="16" className="about-dial-center-hub" />
        <circle cx="200" cy="200" r="8" className="about-dial-center-vermilion" />
        <circle cx="200" cy="200" r="3" fill="#F4EFE6" />
      </svg>
    </div>
  );
}
