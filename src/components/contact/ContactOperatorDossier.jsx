import React from 'react';
import profileData from '../../data/profile';

export default function ContactOperatorDossier({ logs }) {
  return (
    <div className="contact-operator-dossier">
      {/* Top Dossier Header */}
      <div className="dossier-top-bar">
        <div className="dossier-label-left">
          <span className="dossier-kanji-tag">人物</span>
          <span className="dossier-header-title">PROTAGONIST CHANNELS</span>
        </div>
        <span className="dossier-status-pill">ONLINE // READY</span>
      </div>

      {/* Operator Data Body */}
      <div className="dossier-content-body">
        <div className="dossier-info-grid">
          <div className="dossier-info-item">
            <span className="info-label">PROTAGONIST</span>
            <span className="info-value-strong">{profileData.name}</span>
          </div>

          <div className="dossier-info-item">
            <span className="info-label">DIRECT EMAIL</span>
            <a
              href="mailto:reneesh3508925@gmail.com"
              className="info-email-link"
              aria-label="Send direct email to Reneesh"
            >
              reneesh3508925@gmail.com
            </a>
          </div>

          <div className="dossier-info-item">
            <span className="info-label">OPEN NETWORKS</span>
            <div className="dossier-links-row">
              <a
                href="https://github.com/Reneesh28"
                target="_blank"
                rel="noreferrer"
                className="dossier-network-btn"
              >
                GITHUB ↗
              </a>
              <a
                href="https://www.linkedin.com/in/balam-reneesh"
                target="_blank"
                rel="noreferrer"
                className="dossier-network-btn"
              >
                LINKEDIN ↗
              </a>
            </div>
          </div>

          <div className="dossier-info-item">
            <span className="info-label">COORDINATES</span>
            <span className="info-value">Punjab / Andhra Pradesh, India</span>
          </div>
        </div>

        {/* Live Terminal Message Log Box */}
        <div className="dossier-terminal-box">
          <div className="terminal-top-status">
            <span className="terminal-pulse-dot" />
            <span className="terminal-title">TELEMETRY_LOG // STREAM</span>
          </div>
          <div className="terminal-logs-window" aria-live="polite">
            {logs.map((log, i) => (
              <div key={i} className={`terminal-log-line ${i === logs.length - 1 ? 'is-latest' : ''}`}>
                <span className="line-arrow">&gt;</span> {log}
              </div>
            ))}
            <div className="terminal-cursor" aria-hidden="true">
              _
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
