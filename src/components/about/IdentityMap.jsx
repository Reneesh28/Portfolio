import React, { useState } from 'react';

const IDENTITY_STAMPS = [
  {
    id: 'ceo',
    num: '01',
    kanji: '統括',
    name: 'CEO',
    subtitle: 'STUDENT ORGANIZATION LEADERSHIP',
    rotation: -4,
    xOffset: '-18%',
    yOffset: '-35%',
    description: 'Advanced from Volunteer to Board Member and ultimately CEO of AniCos Student Organization. Led organizational operations, managed large-scale community events, and coordinated cross-functional student teams.',
    tags: ['LEADERSHIP', 'OPERATIONS', 'TEAM COORDINATION', 'COMMUNITY']
  },
  {
    id: 'intern',
    num: '02',
    kanji: '実習',
    name: 'STARTUP INTERN',
    subtitle: 'MACHINE LEARNING & ANALYTICS',
    rotation: 5,
    xOffset: '18%',
    yOffset: '-35%',
    description: 'Worked as a Machine Learning Intern at MacBease Connections Pvt. Ltd., building data preprocessing pipelines, evaluating predictive models, and delivering analytics-driven intelligence for real-world use cases.',
    tags: ['MACHINE LEARNING', 'DATA PIPELINES', 'SCIKIT-LEARN', 'ANALYTICS']
  },
  {
    id: 'freelancer',
    num: '03',
    kanji: '独立',
    name: 'FREELANCER',
    subtitle: 'FULL-STACK & CLIENT SYSTEMS',
    rotation: -3,
    xOffset: '-32%',
    yOffset: '0%',
    description: 'Built customized full-stack web applications, interactive interfaces, and intelligent backends for independent clients, translating specific requirements into dependable software.',
    tags: ['FULL-STACK', 'REACT ARCHITECTURE', 'API INTEGRATION', 'CLIENT WORK']
  },
  {
    id: 'cofounder',
    num: '04',
    kanji: '共同',
    name: 'CO-FOUNDER',
    subtitle: 'TECHNICAL INITIATIVES & PROJECTS',
    rotation: 4,
    xOffset: '32%',
    yOffset: '0%',
    description: 'Collaborated with engineering peers to co-found and build early-stage technical projects, architecting core features, setting up deployment pipelines, and managing rapid product iterations.',
    tags: ['SYSTEM ARCHITECTURE', 'PRODUCT LAUNCH', 'DEV COLLABORATION']
  },
  {
    id: 'gamedev',
    num: '05',
    kanji: '遊戯',
    name: 'INDIE GAME DEVELOPER',
    subtitle: 'WORLDBUILDING & SIMULATION',
    rotation: -5,
    xOffset: '-16%',
    yOffset: '35%',
    description: 'Dedicated to creative worldbuilding, designing game mechanics, 3D/2D interactive environments, and gameplay systems that blend storytelling with computational design.',
    tags: ['GAME MECHANICS', 'WORLDBUILDING', 'INTERACTIVE MEDIA', 'CREATIVE FORGE']
  },
  {
    id: 'akogare',
    num: '06',
    kanji: '憧れ',
    name: '憧れ · AKOGARE',
    subtitle: 'ASPIRATION · YEARNING FOR MASTERY',
    rotation: 2,
    xOffset: '16%',
    yOffset: '35%',
    isSpecial: true,
    description: 'The fundamental philosophical engine of the portfolio: an unyielding aspiration and yearning for craft mastery that drives every line of code, system architecture, and creative pursuit.',
    tags: ['CORE PHILOSOPHY', 'YEARNING FOR MASTERY', 'CREATIVE DRIVE']
  }
];

export default function IdentityMap({ onSelectStamp }) {
  const [activeStamp, setActiveStamp] = useState(null);

  const handleStampClick = (stamp) => {
    setActiveStamp(stamp);
    onSelectStamp?.(stamp);
  };

  return (
    <section className="about-identity-map-section" aria-label="Protagonist Identity Map">
      {/* Section Sub-Header */}
      <div className="identity-map-header">
        <div className="identity-map-kicker">
          <span className="map-kicker-kanji">多面的視点</span>
          <span className="map-kicker-text">MULTIFACETED IDENTITY // NON-CHRONOLOGICAL</span>
        </div>
        <h3 className="identity-map-title">IDENTITY MAP</h3>
        <p className="identity-map-subtitle">
          “Reneesh is not defined by a single title. Each mark represents an authentic dimension of craft, leadership, and exploration.”
        </p>
      </div>

      {/* Main Interactive Radial Map Container */}
      <div className="identity-map-canvas">
        {/* Background Screentone & Compass Grid Lines */}
        <div className="identity-map-grid-bg" />
        <svg className="identity-map-connecting-lines" aria-hidden="true">
          <line x1="50%" y1="50%" x2="32%" y2="20%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="68%" y2="20%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="18%" y2="50%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="82%" y2="50%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="34%" y2="80%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="66%" y2="80%" stroke="rgba(17,17,22,0.25)" strokeDasharray="4 4" strokeWidth="2" />
          <circle cx="50%" cy="50%" r="42%" fill="none" stroke="rgba(17,17,22,0.12)" strokeWidth="1.5" strokeDasharray="6 6" />
        </svg>

        {/* Central Core Protagonist Hub */}
        <div className="identity-map-core-hub">
          <div className="core-hub-inner">
            <span className="core-hub-kanji">主人公</span>
            <span className="core-hub-name">BALAM RENEESH</span>
            <span className="core-hub-role">BUILDER CORE</span>
          </div>
        </div>

        {/* Six Manga Physical Identity Stamps */}
        <div className="identity-stamps-constellation">
          {IDENTITY_STAMPS.map((stamp) => {
            const isSelected = activeStamp?.id === stamp.id;

            return (
              <button
                key={stamp.id}
                type="button"
                className={`map-stamp-node stamp-${stamp.id} ${stamp.isSpecial ? 'is-special' : ''} ${isSelected ? 'is-selected' : ''}`}
                style={{
                  transform: `rotate(${stamp.rotation}deg)`
                }}
                onClick={() => handleStampClick(stamp)}
                aria-label={`Inspect Identity Stamp: ${stamp.name}`}
              >
                <div className="stamp-node-border">
                  <div className="stamp-node-header">
                    <span className="stamp-node-num">{stamp.num}</span>
                    <span className="stamp-node-kanji">{stamp.kanji}</span>
                  </div>
                  <div className="stamp-node-title">{stamp.name}</div>
                  <div className="stamp-node-sub">{stamp.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Stamp Active Dossier Panel */}
      {activeStamp && (
        <div className="stamp-dossier-card" role="region" aria-label="Identity Stamp Details">
          <div className="dossier-top-bar">
            <div className="dossier-badge-group">
              <span className="dossier-num">{activeStamp.num}</span>
              <span className="dossier-kanji">{activeStamp.kanji}</span>
              <span className="dossier-title">{activeStamp.name}</span>
            </div>
            <button
              type="button"
              className="dossier-close-btn"
              onClick={() => setActiveStamp(null)}
              aria-label="Close identity details"
            >
              CLOSE ✕
            </button>
          </div>
          <div className="dossier-body">
            <p className="dossier-description">{activeStamp.description}</p>
            <div className="dossier-tags">
              {activeStamp.tags.map((tag) => (
                <span key={tag} className="dossier-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
