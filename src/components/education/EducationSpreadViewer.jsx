import React from 'react';

export default function EducationSpreadViewer({ item, index, total }) {
  if (!item) return null;

  const itemNumber = String(index + 1).padStart(2, '0');

  return (
    <article className="edu-spread-viewer" aria-label={`Academic Record: ${item.degree}`}>
      {/* Left Page: Degree, Institution, Timeline & Typewriter Transcript */}
      <div className="edu-page-meta">
        <div className="edu-volume-strip">
          <div className="edu-badge-group">
            <span className="edu-num-tag">ARCHIVE #{itemNumber}</span>
            <span className="edu-kanji-stamp">学歴</span>
          </div>
          <span className="edu-status-badge">★ ACCREDITED RECORD</span>
        </div>

        <div className="edu-title-block">
          <h3 className="edu-headline">{item.degree}</h3>
          <p className="edu-institution-text">{item.institution}</p>
        </div>

        {/* Editorial Strip: Timeframe & Performance Metric */}
        <div className="edu-editorial-meta-strip">
          <div className="edu-meta-item">
            <span className="edu-meta-label">TIMEFRAME</span>
            <span className="edu-meta-val">{item.period}</span>
          </div>
          <div className="edu-meta-item">
            <span className="edu-meta-label">PERFORMANCE METRIC</span>
            <span className="edu-meta-val score-val">{item.score}</span>
          </div>
          <div className="edu-meta-item">
            <span className="edu-meta-label">CLASSIFICATION</span>
            <span className="edu-meta-val">VERIFIED</span>
          </div>
        </div>

        {/* Typewriter Description Box */}
        <div className="edu-dossier-transcript-box">
          <div className="transcript-terminal-header">
            <span className="terminal-dot" />
            <span className="terminal-title">ORIGIN_LOG // RECORD_EXTRACTION</span>
          </div>
          <p className="transcript-body-text">{item.description}</p>
        </div>
      </div>

      {/* Right Page: Core Coursework Protocols & Accreditation Seal */}
      <div className="edu-page-protocols">
        <div className="edu-protocol-card">
          <div className="protocol-top-bar">
            <div className="protocol-label-left">
              <span className="protocol-kanji-tag">課程</span>
              <span className="protocol-title">CORE CURRICULUM & PROTOCOLS</span>
            </div>
            <span className="protocol-spec-tag">#{itemNumber}</span>
          </div>

          <div className="protocol-content-body">
            <p className="protocol-intro-prompt">
              VERIFIED KNOWLEDGE BASES & TECHNICAL FOUNDATIONS:
            </p>

            {/* Coursework Chips List */}
            <div className="protocol-chips-grid">
              {item.coursework.map((course, idx) => (
                <div key={course} className="protocol-course-pill">
                  <span className="course-idx">0{idx + 1}</span>
                  <span className="course-name">{course}</span>
                </div>
              ))}
            </div>

            {/* Japanese Academic Approval Seal */}
            <div className="edu-manga-approval-seal" aria-hidden="true">
              <div className="seal-outer-border">
                <span className="seal-kanji">修了承認</span>
                <span className="seal-sub">APPROVED</span>
              </div>
            </div>
          </div>

          <div className="protocol-bottom-bar">
            <span className="protocol-bottom-inst">{item.institution.split(',')[0]}</span>
            <span className="protocol-bottom-status">PERFORMANCE: {item.score} ➔</span>
          </div>
        </div>
      </div>
    </article>
  );
}
