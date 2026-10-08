import React, { useState } from 'react';

export default function MangaTechDossierPanel({ activeCategory }) {
  const [selectedSkillName, setSelectedSkillName] = useState(() => {
    return activeCategory.items[0]?.name || null;
  });

  const selectedSkill = activeCategory.items.find((item) => item.name === selectedSkillName) || activeCategory.items[0];

  const handleSelectSkill = (skill) => {
    setSelectedSkillName(skill.name);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PRIMARY':
        return 'status-primary';
      case 'ACTIVE':
        return 'status-active';
      case 'WORKING':
        return 'status-working';
      case 'EXPLORING':
        return 'status-exploring';
      default:
        return 'status-active';
    }
  };

  return (
    <div
      id={`panel-${activeCategory.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${activeCategory.id}`}
      className="manga-tech-dossier-panel"
    >
      {/* Dossier Top Header Banner */}
      <div className="dossier-panel-header">
        <div className="dossier-header-left">
          <div className="dossier-kanji-badge">{activeCategory.kanji}</div>
          <div className="dossier-heading-group">
            <h3 className="dossier-category-name">{activeCategory.name}</h3>
            <span className="dossier-subtitle">{activeCategory.subtitle}</span>
          </div>
        </div>

        <div className="dossier-header-right">
          {activeCategory.sfx && (
            <div className="dossier-manga-sfx" title={activeCategory.sfxMeaning} aria-hidden="true">
              <span>{activeCategory.sfx}</span>
            </div>
          )}
          <span className="dossier-serial-code">{activeCategory.serial}</span>
        </div>
      </div>

      {/* Dossier Main Content: 2-Column Split (Left: Technologies Grid | Right: Inline Context Annotation) */}
      <div className="dossier-split-layout">
        {/* Left Column: Interactive Skills List */}
        <div className="dossier-technologies-col">
          <div className="dossier-tech-kicker">
            <span>ARMORY INVENTORY // CLICK TO ENGAGE CONTEXT</span>
            <span className="dossier-item-counter">{activeCategory.items.length} ITEMS</span>
          </div>

          <div className="technologies-grid">
            {activeCategory.items.map((skill) => {
              const isSelected = selectedSkill?.name === skill.name;
              const statusClass = getStatusBadgeClass(skill.status);

              return (
                <button
                  key={skill.name}
                  type="button"
                  className={`tech-item-card ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelectSkill(skill)}
                  aria-pressed={isSelected}
                  aria-label={`Inspect ${skill.name} (${skill.status})`}
                >
                  <div className="tech-card-top">
                    <span className="tech-name">{skill.name}</span>
                    <span className={`tech-status-badge ${statusClass}`}>
                      {skill.status}
                    </span>
                  </div>

                  <div className="tech-card-meta">
                    <span className="tech-domains">{skill.domains}</span>
                    {isSelected && <span className="tech-active-indicator">◀ ACTIVE</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Inline Technical Annotation Dossier (Level 3 Context) */}
        <div className="dossier-annotation-col">
          {selectedSkill ? (
            <div className="tech-context-annotation-card" role="region" aria-label={`Context for ${selectedSkill.name}`}>
              {/* Annotation Header */}
              <div className="annotation-header">
                <div className="annotation-tag-group">
                  <span className="annotation-kanji-stamp">調書</span>
                  <span className="annotation-tag-text">TECHNICAL ANNOTATION // SPECIFICATION</span>
                </div>
                <span className="annotation-reg-num">REG: #{selectedSkill.name.toUpperCase()}</span>
              </div>

              {/* Title & Status */}
              <div className="annotation-title-block">
                <h4 className="annotation-tech-name">{selectedSkill.name}</h4>
                <div className="annotation-status-strip">
                  <span className={`status-pill ${getStatusBadgeClass(selectedSkill.status)}`}>
                    STATUS: {selectedSkill.status}
                  </span>
                  <span className="category-pill">{activeCategory.name}</span>
                </div>
              </div>

              {/* Technical Domain Badges */}
              <div className="annotation-domains-section">
                <span className="annotation-section-label">APPLICATION DOMAINS</span>
                <div className="domains-pills-list">
                  {selectedSkill.domainList?.map((d) => (
                    <span key={d} className="domain-chip">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture & Role Note */}
              <div className="annotation-role-section">
                <span className="annotation-section-label">SYSTEM PLACEMENT & ARCHITECTURE</span>
                <p className="annotation-body-text">{selectedSkill.context}</p>
              </div>

              {/* Real Project Evidence / Application */}
              {selectedSkill.evidence && (
                <div className="annotation-evidence-section">
                  <div className="evidence-header">
                    <span className="evidence-icon">◆</span>
                    <span className="annotation-section-label">PRACTICAL IMPLEMENTATION & EVIDENCE</span>
                  </div>
                  <p className="evidence-text">{selectedSkill.evidence}</p>
                </div>
              )}

              {/* Footer Stamp */}
              <div className="annotation-footer-bar">
                <span className="annotation-seal-text">VERIFIED IN ARSENAL</span>
                <span className="annotation-year">2026 // PROTAGONIST CRAFT</span>
              </div>
            </div>
          ) : (
            <div className="tech-context-empty-state">
              <span className="empty-state-kanji">選択</span>
              <p>SELECT A TECHNOLOGY FROM THE INVENTORY TO ENGAGE ITS TECHNICAL SPECIFICATION.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
