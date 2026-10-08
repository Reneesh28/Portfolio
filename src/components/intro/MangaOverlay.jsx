import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MangaOverlay({
  onSkip,
  isMuted,
  onToggleMute,
  progress = 0
}) {
  return (
    <>
      {/* Top Controls: Sound Toggle & Skip */}
      <div className="manga-intro-controls">
        <button
          type="button"
          onClick={onToggleMute}
          className="manga-ctrl-btn sound-btn"
          aria-label={isMuted ? '音声オン (Unmute intro audio)' : '音声ミュート (Mute intro audio)'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="ctrl-label">{isMuted ? 'MUTED' : 'AUDIO'}</span>
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="manga-ctrl-btn skip-btn"
          aria-label="イントロをスキップ (Skip Intro)"
        >
          <span className="skip-jp">スキップ</span>
          <span className="skip-en">SKIP</span>
          <span className="skip-kbd">ESC</span>
        </button>
      </div>

      {/* Bottom Subtle Ink Timeline Progress */}
      <div className="manga-timeline-bar" aria-hidden="true">
        <div
          className="manga-timeline-fill"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Textures */}
      <div className="manga-grain-overlay" aria-hidden="true" />
      <div className="manga-vignette-overlay" aria-hidden="true" />
    </>
  );
}
