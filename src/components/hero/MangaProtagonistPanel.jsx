import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import profileImg from '../../assets/profile.jpg';
import shonenImg from '../../assets/images/manga_protagonist_shonen.jpg';
import scifiImg from '../../assets/images/manga_protagonist_scifi.jpg';
import darkFantasyImg from '../../assets/images/manga_protagonist_dark_fantasy.jpg';
import isekaiImg from '../../assets/images/manga_protagonist_isekai.jpg';
import psychImg from '../../assets/images/manga_protagonist_psychological.jpg';
import solImg from '../../assets/images/manga_protagonist_slice_of_life.jpg';

const GENRE_ARTWORKS = {
  seinen: profileImg,
  shonen: shonenImg,
  slice_of_life: solImg,
  dark_fantasy: darkFantasyImg,
  isekai: isekaiImg,
  sci_fi: scifiImg,
  psychological: psychImg,
};

/**
 * Dominant Main Character Panel — The Protagonist Introduction
 * Displays Balam Reneesh through the 7 authentic manga genre lenses.
 */
export default function MangaProtagonistPanel({ activeGenre, onOpenProfile }) {
  const currentArtRef = useRef(null);
  const prevGenreRef = useRef(activeGenre);

  // Genre specific visual badges & metadata
  const genreMeta = {
    shonen: {
      badge: 'BATTLE / AMBITION',
      jpMark: '野望',
      auraClass: 'aura-shonen',
      panelAngle: '-rotate-1',
      screentoneDensity: 'screentone-coarse',
      specVal: 'AI CREATOR // HIGH VELOCITY ENGINE',
    },
    seinen: {
      badge: 'MATURITY / DEPTH',
      jpMark: '深淵',
      auraClass: 'aura-seinen',
      panelAngle: 'rotate-0',
      screentoneDensity: 'screentone-fine',
      specVal: 'AI ARCHITECT & CREATIVE ENGINEER',
    },
    slice_of_life: {
      badge: 'THE PERSON / WORKSPACE',
      jpMark: '日常',
      auraClass: 'aura-sol',
      panelAngle: 'rotate-1',
      screentoneDensity: 'screentone-soft',
      specVal: 'SOFTWARE BUILDER // DAILY CRAFT',
    },
    dark_fantasy: {
      badge: 'WORLDBUILDING / FORGE',
      jpMark: '暗黒',
      auraClass: 'aura-dark-fantasy',
      panelAngle: '-rotate-2',
      screentoneDensity: 'screentone-heavy',
      specVal: 'GAME FORGE & SHADOW ARCHITECT',
    },
    isekai: {
      badge: 'DIMENSIONAL / BOUNDARY',
      jpMark: '異界',
      auraClass: 'aura-isekai',
      panelAngle: 'rotate-1',
      screentoneDensity: 'screentone-radial',
      specVal: 'FRONTIER TECH & WORLD BUILDER',
    },
    sci_fi: {
      badge: 'NEURAL / AI SYSTEMS',
      jpMark: '電脳',
      auraClass: 'aura-scifi',
      panelAngle: 'rotate-0',
      screentoneDensity: 'screentone-grid',
      specVal: 'NEURAL SYSTEMS & COMPUTATION',
    },
    psychological: {
      badge: 'LOGIC / RECURSION',
      jpMark: '思索',
      auraClass: 'aura-psychological',
      panelAngle: '-rotate-1',
      screentoneDensity: 'screentone-diagonal',
      specVal: 'FIRST PRINCIPLES & DEDUCTIVE LOGIC',
    },
  }[activeGenre] || {
    badge: 'MATURITY / DEPTH',
    jpMark: '深淵',
    auraClass: 'aura-seinen',
    panelAngle: 'rotate-0',
    screentoneDensity: 'screentone-fine',
    specVal: 'AI ARCHITECT & CREATIVE ENGINEER',
  };

  // GSAP Physical Manga Artwork Reveal Transition on genre switch
  useEffect(() => {
    if (!currentArtRef.current || prevGenreRef.current === activeGenre) return;

    prevGenreRef.current = activeGenre;

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.fromTo(
      currentArtRef.current,
      { scale: 1.06, filter: 'contrast(180%) brightness(120%) blur(2px)', opacity: 0.7 },
      { scale: 1, filter: 'contrast(140%) brightness(95%) blur(0px)', opacity: 1, duration: 0.5 }
    );
  }, [activeGenre]);

  const activeImgSrc = GENRE_ARTWORKS[activeGenre] || profileImg;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpenProfile?.();
    }
  };

  return (
    <div
      className={`manga-protagonist-panel-wrapper is-interactive ${genreMeta.panelAngle}`}
      onClick={onOpenProfile}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Expand Balam Reneesh Protagonist Profile"
    >
      {/* Outer Manga Cutout Frame */}
      <div className="protagonist-frame-border">
        {/* Top Manga Header Strip */}
        <div className="protagonist-panel-top-bar">
          <div className="protagonist-label-group">
            <span className="protagonist-kanji-stamp">主人公</span>
            <span className="protagonist-romaji-stamp">SHUJINKŌ // PROTAGONIST</span>
          </div>
          <div className="protagonist-serial-stamp">
            <span className="serial-num">ACT.01 // SPREAD P.03</span>
            <span className="genre-dynamic-badge">{genreMeta.badge}</span>
          </div>
        </div>

        {/* Main Artwork Container */}
        <div className={`protagonist-art-viewport ${genreMeta.auraClass}`}>
          {/* Halftone Screentone Overlay */}
          <div className={`manga-screentone-layer ${genreMeta.screentoneDensity}`}></div>

          {/* Actual Protagonist Portrait across 7 Genres */}
          <div className="protagonist-image-frame">
            <img
              ref={currentArtRef}
              src={activeImgSrc}
              alt={`Balam Reneesh — Protagonist (${activeGenre})`}
              className="protagonist-img"
              loading="eager"
            />
          </div>

          {/* Genre-Specific SVG Ink / Tech Bleeds Over Character */}
          <div className="genre-reactive-ink-layer">
            {activeGenre === 'sci_fi' && (
              <div className="scifi-target-reticle" aria-hidden="true">
                <span className="reticle-box"></span>
                <span className="reticle-tag">ID: RENEESH_B // NEURAL_LINK: ACTIVE</span>
              </div>
            )}
            {activeGenre === 'shonen' && (
              <div className="shonen-impact-slash" aria-hidden="true"></div>
            )}
            {activeGenre === 'dark_fantasy' && (
              <div className="dark-ink-vignette" aria-hidden="true"></div>
            )}
            {activeGenre === 'isekai' && (
              <div className="isekai-portal-halo" aria-hidden="true"></div>
            )}
          </div>

          {/* Japanese Thematic Overlay Stamp in Panel */}
          <div className="protagonist-inner-stamp" aria-hidden="true">
            <span className="stamp-inner-kanji">{genreMeta.jpMark}</span>
          </div>

          {/* Click to Expand Hover Prompt */}
          <div className="panel-inspect-prompt" aria-hidden="true">
            <span>[ EXPAND PROFILE // 開く ⊕ ]</span>
          </div>

          {/* Authentic Ink Splatter / Screentone Border Vignette */}
          <div className="manga-ink-edge-shading"></div>
        </div>

        {/* Bottom Panel Caption & Registration Grid */}
        <div className="protagonist-panel-bottom-bar">
          <div className="protagonist-role-spec">
            <span className="spec-label">SPECIFICATION:</span>
            <span className="spec-val">{genreMeta.specVal}</span>
          </div>
          <div className="manga-printer-reg-marks">
            <span className="reg-cross">+</span>
            <span className="reg-circle">◎</span>
            <span className="reg-cross">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
