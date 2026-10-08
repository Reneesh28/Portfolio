import React from 'react';

export default function CoreSystemBlueprint({ activeCategoryId, onSelectCategory }) {
  const NODES = [
    { id: 'ai_ml', name: 'AI / ML', kanji: '人工知能', angle: 0, x: 50, y: 15 },
    { id: 'software', name: 'SOFTWARE', kanji: '基幹開発', angle: 72, x: 85, y: 45 },
    { id: 'data_infra', name: 'DATA / INFRA', kanji: '情報基盤', angle: 144, x: 72, y: 85 },
    { id: 'creative_tech', name: 'CREATIVE', kanji: '電脳表現', angle: 216, x: 28, y: 85 },
    { id: 'tools_workflow', name: 'DEV TOOLS', kanji: '道具一式', angle: 288, x: 15, y: 45 },
  ];

  return (
    <div className="core-system-blueprint-container" aria-label="Core System Technical Schematic">
      <div className="blueprint-top-reg-bar">
        <div className="blueprint-reg-left">
          <span className="blueprint-stamp-kanji">系統図</span>
          <span className="blueprint-reg-title">CORE SYSTEM SCHEMATIC // BLUEPRINT</span>
        </div>
        <span className="blueprint-serial">SYS-ARC: 2026.V3</span>
      </div>

      <div className="blueprint-canvas-viewport">
        {/* Technical Grid & Halftone */}
        <div className="blueprint-grid-overlay" />

        {/* SVG Circuit Traces */}
        <svg className="blueprint-circuit-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {NODES.map((node) => {
            const isActive = activeCategoryId === node.id;
            return (
              <g key={`trace-${node.id}`}>
                <line
                  x1="50"
                  y1="50"
                  x2={node.x}
                  y2={node.y}
                  stroke={isActive ? '#111116' : 'rgba(17,17,22,0.22)'}
                  strokeWidth={isActive ? '2' : '1.2'}
                  strokeDasharray={isActive ? 'none' : '3 3'}
                  className="blueprint-node-trace"
                />
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="2"
                    fill="#111116"
                    className="blueprint-active-pulse-dot"
                  />
                )}
              </g>
            );
          })}
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(17,17,22,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(17,17,22,0.25)" strokeWidth="1" />
        </svg>

        {/* Central Engine Node */}
        <div className="blueprint-center-hub">
          <div className="center-hub-inner">
            <span className="center-hub-kanji">核</span>
            <span className="center-hub-title">CORE SYSTEM</span>
            <span className="center-hub-sub">BALAM RENEESH</span>
          </div>
        </div>

        {/* Peripheral Capability Nodes */}
        <div className="blueprint-nodes-constellation">
          {NODES.map((node) => {
            const isActive = activeCategoryId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                className={`blueprint-node-btn node-${node.id} ${isActive ? 'is-active' : ''}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                }}
                onClick={() => onSelectCategory(node.id)}
                aria-label={`Select ${node.name} category`}
              >
                <span className="node-kanji-tag">{node.kanji}</span>
                <span className="node-name-text">{node.name}</span>
                {isActive && <span className="node-active-pin">●</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="blueprint-footer-bar">
        <span className="blueprint-footer-note">CLICK ANY NODE TO ENGAGE SUBSYSTEM</span>
        <span className="blueprint-status-indicator">STATUS: ARMED & ACTIVE</span>
      </div>
    </div>
  );
}
