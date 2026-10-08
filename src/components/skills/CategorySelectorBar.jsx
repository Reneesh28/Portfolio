import React from 'react';

export default function CategorySelectorBar({ categories, activeCategoryId, onSelectCategory }) {
  return (
    <nav className="skills-category-selector-nav" aria-label="Arsenal Category Selector">
      <div className="selector-kicker-strip">
        <span className="selector-kicker-kanji">区分選択</span>
        <span className="selector-kicker-text">ARSENAL CLASSIFICATION // SELECT WEAPONRY</span>
      </div>

      <div className="skills-category-buttons-list" role="tablist">
        {categories.map((cat, idx) => {
          const isActive = activeCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              role="tab"
              type="button"
              id={`tab-${cat.id}`}
              aria-controls={`panel-${cat.id}`}
              aria-selected={isActive}
              className={`skills-category-tab-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="tab-btn-header">
                <span className="tab-num">0{idx + 1}</span>
                <span className="tab-kanji">{cat.kanji}</span>
              </div>
              <div className="tab-title">{cat.name}</div>
              <div className="tab-sub-count">{cat.items.length} TECHNOLOGIES</div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
