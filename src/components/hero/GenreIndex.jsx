import React from 'react';

/**
 * Editorial Manga Genre Index
 * Formatted as a classic Tankobon table of contents / genre classification index
 * Accessible with mouse, keyboard (arrows/enter), and mobile touch.
 */
export const GENRES = [
  {
    id: 'shonen',
    index: '01',
    name: 'SHŌNEN',
    kanji: '少年',
    sub: 'Ambition / Action / Building',
    tagline: 'HIGH VELOCITY & LIMIT BREAK',
  },
  {
    id: 'seinen',
    index: '02',
    name: 'SEINEN',
    kanji: '青年',
    sub: 'Engineering / Maturity / Depth',
    tagline: 'SYSTEM MASTERY & CRAFT',
  },
  {
    id: 'slice_of_life',
    index: '03',
    name: 'SLICE OF LIFE',
    kanji: '日常',
    sub: 'The Person Behind the Work',
    tagline: 'WORKSPACE & HUMAN DETAIL',
  },
  {
    id: 'dark_fantasy',
    index: '04',
    name: 'DARK FANTASY',
    kanji: '暗黒幻想',
    sub: 'Worldbuilding / Story / Game Forge',
    tagline: 'SHADOW REALMS & WORLDBUILDING',
  },
  {
    id: 'isekai',
    index: '05',
    name: 'ISEKAI',
    kanji: '異世界',
    sub: 'Creating Worlds / New Tech',
    tagline: 'DIMENSIONAL BOUNDARY TRANSIT',
  },
  {
    id: 'sci_fi',
    index: '06',
    name: 'SCI-FI',
    kanji: 'SF',
    sub: 'AI / Technology / Systems',
    tagline: 'NEURAL NETWORKS & COMPUTATION',
  },
  {
    id: 'psychological',
    index: '07',
    name: 'PSYCHOLOGICAL',
    kanji: '心理',
    sub: 'Thinking / Experimentation / Logic',
    tagline: 'FIRST PRINCIPLES & RECURSION',
  },
];

export default function GenreIndex({ activeGenre, onSelectGenre }) {
  return (
    <nav
      className="manga-genre-index-card"
      aria-label="Manga Genre Classification Index"
    >
      {/* Index Header */}
      <div className="genre-index-header">
        <div className="genre-index-title-row">
          <span className="genre-index-kicker">GENRE CLASSIFICATION</span>
          <span className="genre-index-kanji">分類目録</span>
        </div>
        <p className="genre-index-instruction">
          [SELECT LENS TO RECOMPOSE SPREAD]
        </p>
      </div>

      {/* Editorial Manga List */}
      <ul className="genre-index-list" role="tablist">
        {GENRES.map((g) => {
          const isActive = activeGenre === g.id;
          return (
            <li key={g.id} role="presentation" className="genre-index-item">
              <button
                role="tab"
                aria-selected={isActive}
                tabIndex={0}
                onClick={() => onSelectGenre(g.id)}
                onMouseEnter={() => onSelectGenre(g.id)}
                className={`genre-index-btn ${isActive ? 'is-active' : ''}`}
              >
                {/* Active Indicator Stamp */}
                <div className="genre-btn-indicator">
                  <span className="genre-index-num">{g.index}</span>
                  <span className="genre-index-dash">-</span>
                </div>

                <div className="genre-btn-text-group">
                  <div className="genre-btn-name-row">
                    <span className="genre-btn-name">{g.name}</span>
                    <span className="genre-btn-kanji">{g.kanji}</span>
                  </div>
                  <span className="genre-btn-sub">{g.sub}</span>
                </div>

                {isActive && (
                  <span className="genre-active-seal" aria-hidden="true">
                    現
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer Registration Marks */}
      <div className="genre-index-footer" aria-hidden="true">
        <span>INDEX REF: VOL.01 // ACT.1</span>
        <span>+ ⊕ +</span>
      </div>
    </nav>
  );
}
