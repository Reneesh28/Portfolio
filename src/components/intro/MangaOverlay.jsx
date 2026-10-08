import React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function MangaOverlay({
  onSkip,
  isMuted,
  onToggleMute,
  progress = 0,
  isPlaying = false,
  autoplayBlocked = false,
}) {
  return (
    <>
      {/* Top Controls: Sound Toggle & Skip */}
      <div className="manga-intro-controls">
        {autoplayBlocked && !isPlaying && (
          <button
            type="button"
            onClick={onToggleMute}
            className="manga-ctrl-btn sound-prompt-btn"
            aria-label="Click to enable sound"
          >
            <Music size={14} className="animate-pulse" />
            <span className="ctrl-label-jp">♫ 音声再生</span>
            <span className="ctrl-label">[ TAP FOR SOUND ]</span>
          </button>
        )}

        <button
          type="button"
          onClick={onToggleMute}
          className={`manga-ctrl-btn sound-btn ${!isPlaying || isMuted ? 'is-muted-ctrl' : 'is-playing-ctrl'}`}
          aria-label={isMuted || !isPlaying ? '音声オン (Unmute intro audio)' : '音声ミュート (Mute intro audio)'}
          title={isMuted || !isPlaying ? 'Play / Unmute Audio' : 'Mute Audio'}
        >
          {isMuted || !isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span className="ctrl-label">
            {isMuted ? 'MUTED' : isPlaying ? 'BGM: ON' : 'SOUND: OFF'}
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
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

