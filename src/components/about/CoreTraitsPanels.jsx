import React, { useState } from 'react';
import buildImg from '../../assets/images/manga_about_build.jpg';
import createImg from '../../assets/images/manga_about_create.jpg';
import leadImg from '../../assets/images/manga_about_lead_explore.jpg';
import exploreImg from '../../assets/images/manga_about_portrait.jpg';

const TRAIT_PANELS = [
  {
    id: 'build',
    num: '01',
    kanji: '構築',
    title: 'BUILD',
    headline: 'SYSTEMS & AI ARCHITECTURE',
    description: 'Turning complex mathematical models, machine learning pipelines, and generative AI into practical, responsive software that people rely on.',
    image: buildImg,
    aspect: '4 / 3',
    rotation: -1.5,
    tag: 'CODE · AI · LOGIC',
    sfx: 'カタカタ…',
    sfxMeaning: 'Rapid Keyboard Clatter'
  },
  {
    id: 'create',
    num: '02',
    kanji: '創造',
    title: 'CREATE',
    headline: 'WORLDBUILDING & GAME FORGE',
    description: 'Designing interactive game environments, mechanics, and visual narratives where creative aesthetics and computational logic intersect.',
    image: createImg,
    aspect: '4 / 3',
    rotation: 2,
    tag: 'WORLDBUILDING · GAMES · ART',
    sfx: 'ザッ…',
    sfxMeaning: 'Pencil Sketch on Paper'
  },
  {
    id: 'lead',
    num: '03',
    kanji: '牽引',
    title: 'LEAD',
    headline: 'COLLABORATION & COMMUNITY',
    description: 'Bringing multidisciplinary builders and student communities together, coordinating complex operations, and aligning collective energy toward a shared goal.',
    image: leadImg,
    aspect: '4 / 3',
    rotation: -1,
    tag: 'COMMUNITY · COORDINATION · EXECUTION',
    sfx: 'ドォン!!',
    sfxMeaning: 'Collective Energy'
  },
  {
    id: 'explore',
    num: '04',
    kanji: '探求',
    title: 'EXPLORE',
    headline: 'CONTINUOUS EXPERIMENTATION',
    description: 'Pushing past established comfort zones to test nascent technologies, unproven concepts, and discover what lies on the next frontier.',
    image: exploreImg,
    aspect: '4 / 3',
    rotation: 1.5,
    tag: 'RESEARCH · RAPID LEARNING · HORIZONS',
    sfx: 'シン…',
    sfxMeaning: 'Focused Deep Thought'
  }
];

export default function CoreTraitsPanels({ onSelectTrait }) {
  const [hoveredTrait, setHoveredTrait] = useState(null);

  return (
    <section className="about-traits-section" aria-label="Four Core Character Traits">
      {/* Section Header */}
      <div className="traits-section-header">
        <div className="traits-kicker">
          <span className="traits-kicker-kanji">行動規範</span>
          <span className="traits-kicker-text">CREATIVE OPERATING PRINCIPLES</span>
        </div>
        <h3 className="traits-section-title">FOUR CORE TRAITS</h3>
        <p className="traits-section-subtitle">
          “Not formal job descriptions, but the fundamental creative instincts that guide how I work, build, and explore.”
        </p>
      </div>

      {/* Asymmetrical Manga Panels Composition */}
      <div className="traits-panels-composition-grid">
        {TRAIT_PANELS.map((panel, idx) => {
          const isHovered = hoveredTrait === panel.id;

          return (
            <article
              key={panel.id}
              className={`trait-manga-panel panel-${panel.id} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                transform: `rotate(${panel.rotation}deg)`
              }}
              onMouseEnter={() => setHoveredTrait(panel.id)}
              onMouseLeave={() => setHoveredTrait(null)}
              onClick={() => onSelectTrait?.(panel)}
              tabIndex={0}
              role="button"
              aria-label={`Trait Panel: ${panel.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTrait?.(panel);
                }
              }}
            >
              <div className="trait-panel-inner">
                {/* Top Panel Manga Banner */}
                <div className="trait-panel-top-bar">
                  <div className="trait-num-kanji">
                    <span className="trait-idx">PANEL {panel.num}</span>
                    <span className="trait-kanji-badge">{panel.kanji}</span>
                  </div>
                  <span className="trait-tag-label">{panel.tag}</span>
                </div>

                {/* Trait Visual Artwork Frame */}
                <div className="trait-art-viewport">
                  <img
                    src={panel.image}
                    alt={`${panel.title} manga illustration`}
                    className="trait-panel-img"
                    loading="lazy"
                  />
                  <div className="trait-screentone-overlay" />
                  
                  {/* SFX Manga Sound Stamp */}
                  <div className="trait-manga-sfx" title={panel.sfxMeaning} aria-hidden="true">
                    <span>{panel.sfx}</span>
                  </div>
                </div>

                {/* Trait Content Block */}
                <div className="trait-panel-content">
                  <div className="trait-title-row">
                    <h4 className="trait-title-main">{panel.title}</h4>
                    <span className="trait-sub-headline">{panel.headline}</span>
                  </div>
                  <p className="trait-description-text">{panel.description}</p>
                </div>

                {/* Panel Footer Registration Line */}
                <div className="trait-panel-footer">
                  <span className="trait-reg-code">REG: 0{idx + 1}-SEINEN</span>
                  <span className="trait-inspect-prompt">INSPECT ↗</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
