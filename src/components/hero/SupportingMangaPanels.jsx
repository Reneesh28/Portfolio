import React from 'react';

/**
 * 2-3 Supporting Asymmetrical Manga Panels
 * Interactive panels:
 * - Panel 02: AI & Systems Architecture (Click -> opens AI preview)
 * - Panel 03: Creative Worldbuilding (Click -> opens Creative / Game preview)
 * - Panel 04: Akogare / First Principles (Click -> opens Akogare philosophy spread)
 */
export default function SupportingMangaPanels({
  activeGenre,
  onOpenAI,
  onOpenCreative,
  onOpenAkogare,
}) {
  // Genre-reactive presentation mapping (Section 28)
  const genreData = {
    shonen: {
      aiKanji: '限界突破',
      aiTitle: 'LIMIT BREAK ARCHITECTURE',
      aiDesc: 'High Velocity AI Engines & Action Systems',
      creativeKanji: '闘志創造',
      creativeTitle: 'ACTION COMBAT FORGE',
      creativeDesc: 'High-Impact Interactive Game Mechanics',
      akogareKanji: '熱意',
      akogareTitle: 'BURST AMBITION',
      akogareDesc: 'Unyielding Will to Build & Accelerate',
    },
    seinen: {
      aiKanji: '演算機構',
      aiTitle: 'AI & SYSTEM ARCHITECTURE',
      aiDesc: 'Generative Intelligence & Autonomous Engines',
      creativeKanji: '世界創造',
      creativeTitle: 'CREATIVE WORLDBUILDING',
      creativeDesc: 'Interactive Narrative, 3D Web & Game Systems',
      akogareKanji: '憧',
      akogareTitle: 'AKOGARE // 憧れ',
      akogareDesc: 'Yearning for Mastery // Lone Wolf Engineering',
    },
    slice_of_life: {
      aiKanji: '日常試作',
      aiTitle: 'DAILY CRAFT & SYSTEMS',
      aiDesc: 'Clean Code, Refactoring & Engineering Routine',
      creativeKanji: '創作空間',
      creativeTitle: 'CREATIVE WORKSPACE',
      creativeDesc: 'Thoughtful Human-Centered Polish & Interaction',
      akogareKanji: '心静',
      akogareTitle: 'QUIET DEDICATION',
      akogareDesc: 'Deep Work & Continuous Daily Practice',
    },
    dark_fantasy: {
      aiKanji: '深淵演算',
      aiTitle: 'FORGE OF LOGIC',
      aiDesc: 'Robust Fault-Tolerant Distributed Architectures',
      creativeKanji: '闇の世界',
      creativeTitle: 'SHADOW REALM FORGE',
      creativeDesc: 'Gothic Atmospheres, Shaders & Dark Worldbuilding',
      akogareKanji: '誓い',
      akogareTitle: 'ABYSS MASTERY',
      akogareDesc: 'Relentless Pursuit Across the Unknown',
    },
    isekai: {
      aiKanji: '境界演算',
      aiTitle: 'DIMENSIONAL COMPUTATION',
      aiDesc: 'Frontier AI, Multimodal Models & Tech Transit',
      creativeKanji: '異界構築',
      creativeTitle: 'TRANSMUTATION WORLDS',
      creativeDesc: 'Procedural Generation, Portals & 3D Web',
      akogareKanji: '新生',
      akogareTitle: 'NEW FRONTIERS',
      akogareDesc: 'Exploring and Building Beyond Boundaries',
    },
    sci_fi: {
      aiKanji: '電脳機構',
      aiTitle: 'NEURAL CORE & AGENTS',
      aiDesc: 'Tensor Systems, Autonomous Graphs & Architectures',
      creativeKanji: 'サイバー空間',
      creativeTitle: 'FUTURISTIC WORLDBUILDING',
      creativeDesc: 'Cybernetic Interfaces, WebGL Shaders & Real-time Web',
      akogareKanji: '究極',
      akogareTitle: 'CYBERNETIC MASTERY',
      akogareDesc: 'Mastering Algorithmic Intelligence',
    },
    psychological: {
      aiKanji: '認知深層',
      aiTitle: 'FIRST PRINCIPLES LOGIC',
      aiDesc: 'Cognitive Graphs, Deductive Systems & Analysis',
      creativeKanji: '心理空間',
      creativeTitle: 'RECURSIVE WORLDS',
      creativeDesc: 'Nonlinear Interactive Narratives & Internal Monologue',
      akogareKanji: '内省',
      akogareTitle: 'INTROSPECTION',
      akogareDesc: 'Deep Reflection & Methodical Problem Solving',
    },
  }[activeGenre] || {
    aiKanji: '演算機構',
    aiTitle: 'AI & SYSTEM ARCHITECTURE',
    aiDesc: 'Generative Intelligence & Autonomous Engines',
    creativeKanji: '世界創造',
    creativeTitle: 'CREATIVE WORLDBUILDING',
    creativeDesc: 'Interactive Narrative, 3D Web & Game Systems',
    akogareKanji: '憧',
    akogareTitle: 'AKOGARE // 憧れ',
    akogareDesc: 'Yearning for Mastery // Lone Wolf Engineering',
  };

  const createKeyHandler = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn?.();
    }
  };

  return (
    <div className="supporting-manga-panels-container">
      {/* Supporting Panel 02: AI / Systems Engine */}
      <article
        className="manga-subpanel subpanel-ai is-interactive"
        onClick={onOpenAI}
        onKeyDown={createKeyHandler(onOpenAI)}
        tabIndex={0}
        role="button"
        aria-label={`Open ${genreData.aiTitle} panel`}
      >
        <div className="subpanel-frame">
          <div className="subpanel-header">
            <span className="subpanel-tag">PANEL 02 // 領域</span>
            <span className="subpanel-kanji">{genreData.aiKanji}</span>
          </div>

          <div className="subpanel-viewport">
            <div className="subpanel-screentone"></div>
            {/* Visual content: Tech linework & neural schematic */}
            <div className="subpanel-visual-content">
              <div className="schematic-code-snippet">
                <code>{`> AGENT_STATE = "ACTIVE"`}</code>
                <code>{`> LATENT_SPACE.SAMPLE()`}</code>
                <code>{`> SYNAPSE_WEIGHT: 0.984`}</code>
              </div>
              <div className="subpanel-ink-graphic">
                <svg viewBox="0 0 160 80" className="w-full h-full">
                  <line x1="10" y1="40" x2="150" y2="40" stroke="#111116" strokeWidth="2" />
                  <circle cx="40" cy="40" r="12" fill="#111116" />
                  <circle cx="80" cy="20" r="8" fill="#111116" />
                  <circle cx="80" cy="60" r="8" fill="#111116" />
                  <circle cx="120" cy="40" r="12" fill="#111116" />
                  <line x1="40" y1="40" x2="80" y2="20" stroke="#111116" strokeWidth="1.5" />
                  <line x1="40" y1="40" x2="80" y2="60" stroke="#111116" strokeWidth="1.5" />
                  <line x1="80" y1="20" x2="120" y2="40" stroke="#111116" strokeWidth="1.5" />
                  <line x1="80" y1="60" x2="120" y2="40" stroke="#111116" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>

          <div className="subpanel-footer">
            <div className="subpanel-footer-row">
              <span className="subpanel-title">{genreData.aiTitle}</span>
              <span className="subpanel-inspect-tag">[INSPECT ⊕]</span>
            </div>
            <span className="subpanel-desc">{genreData.aiDesc}</span>
          </div>
        </div>
      </article>

      {/* Supporting Panel 03: Creative & Worldbuilding / Game Creation */}
      <article
        className="manga-subpanel subpanel-creative is-interactive"
        onClick={onOpenCreative}
        onKeyDown={createKeyHandler(onOpenCreative)}
        tabIndex={0}
        role="button"
        aria-label={`Open ${genreData.creativeTitle} panel`}
      >
        <div className="subpanel-frame">
          <div className="subpanel-header">
            <span className="subpanel-tag">PANEL 03 // 領域</span>
            <span className="subpanel-kanji">{genreData.creativeKanji}</span>
          </div>

          <div className="subpanel-viewport">
            <div className="subpanel-screentone-diagonal"></div>
            {/* Visual content: Isometric dimension cut & artistic lineart */}
            <div className="subpanel-visual-content">
              <div className="world-poly-wireframe">
                <svg viewBox="0 0 160 80" className="w-full h-full">
                  <polygon
                    points="80,10 140,40 80,70 20,40"
                    fill="none"
                    stroke="#111116"
                    strokeWidth="2"
                  />
                  <polygon
                    points="80,25 120,45 80,65 40,45"
                    fill="#111116"
                    opacity="0.1"
                  />
                  <line x1="80" y1="10" x2="80" y2="70" stroke="#111116" strokeWidth="1.5" strokeDasharray="3 3" />
                  <line x1="20" y1="40" x2="140" y2="40" stroke="#111116" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="subpanel-footer">
            <div className="subpanel-footer-row">
              <span className="subpanel-title">{genreData.creativeTitle}</span>
              <span className="subpanel-inspect-tag">[INSPECT ⊕]</span>
            </div>
            <span className="subpanel-desc">{genreData.creativeDesc}</span>
          </div>
        </div>
      </article>

      {/* Supporting Panel 04: The Core Drive & Akogare Seal */}
      <article
        className="manga-subpanel subpanel-core is-interactive"
        onClick={onOpenAkogare}
        onKeyDown={createKeyHandler(onOpenAkogare)}
        tabIndex={0}
        role="button"
        aria-label="Open Akogare Philosophy Panel"
      >
        <div className="subpanel-frame">
          <div className="subpanel-header">
            <span className="subpanel-tag">PANEL 04 // 哲学</span>
            <span className="subpanel-kanji">一匹狼</span>
          </div>

          <div className="subpanel-viewport washi-bg">
            <div className="akogare-seal-stamp">
              <span className="seal-kanji">{genreData.akogareKanji}</span>
              <div className="seal-sub-text">
                <span className="seal-en">AKOGARE</span>
                <span className="seal-desc">YEARNING FOR MASTERY</span>
              </div>
            </div>
          </div>

          <div className="subpanel-footer">
            <div className="subpanel-footer-row">
              <span className="subpanel-title">{genreData.akogareTitle}</span>
              <span className="subpanel-inspect-tag">[PHILOSOPHY ⊕]</span>
            </div>
            <span className="subpanel-desc">{genreData.akogareDesc}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
