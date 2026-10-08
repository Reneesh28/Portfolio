import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import profileImg from '../../assets/profile.jpg';
import aiArchImg from '../../assets/images/manga_ai_architecture.jpg';
import worldbuildingImg from '../../assets/images/manga_creative_worldbuilding.jpg';
import solImg from '../../assets/images/manga_slice_of_life.jpg';

/**
 * MangaExpandedModal
 * Renders authentic full Tankobon manga spreads when panels are clicked:
 * - 'protagonist': Expanded Character Profile (About Me CTA)
 * - 'ai': AI & System Architecture technical spread (View Skills CTA)
 * - 'creative': Creative Worldbuilding spread (View Projects CTA)
 * - 'akogare': Emotional/Philosophical Akogare spread (Continue Reading CTA)
 * - 'identity_seal': Japanese Identity Seal Animation callback
 */
export default function MangaExpandedModal({ modalType, onClose, activeGenre }) {
  const modalRootRef = useRef(null);
  const cardRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Entrance & Exit animation with GSAP
  useEffect(() => {
    if (!cardRef.current || !modalRootRef.current) return;

    gsap.fromTo(
      modalRootRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo(
      cardRef.current,
      { scale: 0.94, y: 20, opacity: 0 },
      { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
    );
  }, [modalType]);

  // Smooth scroll handler for CTAs
  const handleNavigate = (targetId) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  if (!modalType) return null;

  return (
    <div
      ref={modalRootRef}
      className="manga-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={cardRef}
        className="manga-expanded-spread-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Folio Header Bar */}
        <div className="modal-folio-bar">
          <div className="modal-folio-left">
            <span className="modal-kanji-tag">特報</span>
            <span className="modal-folio-title">
              {modalType === 'protagonist' && 'PROTAGONIST PROFILE // 主人公記録'}
              {modalType === 'ai' && 'TECHNICAL SCHEMATIC // 演算機構詳細'}
              {modalType === 'creative' && 'WORLDBUILDING ARCHIVE // 世界創造記録'}
              {modalType === 'akogare' && 'PHILOSOPHICAL EMBLEM // 憧れの根源'}
              {modalType === 'identity_seal' && 'IDENTITY SEAL // 一匹狼の証'}
            </span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close Expanded Manga Panel"
          >
            <span className="close-kanji">閉</span>
            <span className="close-text">× CLOSE [ESC]</span>
          </button>
        </div>

        {/* Modal Body Content depending on Type */}
        <div className="modal-content-viewport">
          {/* ================= PROTAGONIST EXPANDED PROFILE ================= */}
          {modalType === 'protagonist' && (
            <div className="expanded-grid-protagonist">
              <div className="expanded-art-column">
                <div className="expanded-art-frame">
                  <img
                    src={profileImg}
                    alt="Balam Reneesh — Protagonist"
                    className="expanded-portrait-img"
                  />
                  <div className="expanded-screentone-overlay"></div>
                  <span className="art-corner-seal">主人公</span>
                </div>
              </div>

              <div className="expanded-details-column">
                <div className="protagonist-kicker-strip">
                  <span className="kicker-kanji">主人公</span>
                  <span className="kicker-en">PROTAGONIST FILE // ACT.01</span>
                </div>

                <h2 className="expanded-title-name">BALAM RENEESH</h2>
                <div className="expanded-role-pill">
                  AI / SOFTWARE / CREATIVE BUILDER
                </div>

                <p className="expanded-bio-paragraph">
                  Engineer and builder focused on architecting intelligent systems,
                  machine learning architectures, and immersive interactive web environments.
                  Bridging the gap between computational rigor and expressive creative spatial storytelling.
                </p>

                <div className="expanded-domain-breakdown">
                  <div className="domain-item">
                    <span className="domain-index">01</span>
                    <div className="domain-text">
                      <strong>AI & Machine Learning:</strong> Autonomous agents, neural pipelines, and LLM orchestration.
                    </div>
                  </div>
                  <div className="domain-item">
                    <span className="domain-index">02</span>
                    <div className="domain-text">
                      <strong>Full-Stack Architecture:</strong> High-performance React, TypeScript, scalable backends.
                    </div>
                  </div>
                  <div className="domain-item">
                    <span className="domain-index">03</span>
                    <div className="domain-text">
                      <strong>Creative Engineering:</strong> Three.js, WebGL shaders, interactive game mechanics.
                    </div>
                  </div>
                </div>

                <div className="expanded-modal-cta-row">
                  <button
                    type="button"
                    className="manga-cta-action-btn"
                    onClick={() => handleNavigate('about')}
                  >
                    <span>ABOUT ME →</span>
                    <span className="cta-jp">自己紹介へ</span>
                  </button>
                  <button
                    type="button"
                    className="manga-cta-secondary-btn"
                    onClick={onClose}
                  >
                    RETURN TO SPREAD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 02: AI & SYSTEM ARCHITECTURE ================= */}
          {modalType === 'ai' && (
            <div className="expanded-grid-technical">
              <div className="expanded-schematic-column">
                <div className="schematic-img-frame">
                  <img
                    src={aiArchImg}
                    alt="AI System Architecture Manga Schematic"
                    className="schematic-illustration"
                  />
                  <div className="expanded-screentone-overlay"></div>
                  <div className="schematic-reg-overlay">
                    <span>SYS_CORE: ONLINE</span>
                    <span>TENSOR: [512, 1024, 7]</span>
                  </div>
                </div>
              </div>

              <div className="expanded-details-column">
                <div className="protagonist-kicker-strip">
                  <span className="kicker-kanji">演算</span>
                  <span className="kicker-en">DOMAIN 01 // SYSTEM SCHEMATICS</span>
                </div>

                <h2 className="expanded-title-name">AI & SYSTEM ARCHITECTURE</h2>
                <div className="expanded-role-pill">
                  GENERATIVE INTELLIGENCE & AUTONOMOUS ENGINES
                </div>

                <p className="expanded-bio-paragraph">
                  Designing resilient computational systems from first principles.
                  Specializing in neural network inference, autonomous multi-agent tool-calling workflows,
                  and scalable software architecture that transforms complex data into seamless experiences.
                </p>

                <div className="technical-specs-list">
                  <div className="spec-card">
                    <span className="spec-num">01</span>
                    <div>
                      <strong>Autonomous Agent Systems:</strong> Multi-agent coordination, memory retrieval, task routing.
                    </div>
                  </div>
                  <div className="spec-card">
                    <span className="spec-num">02</span>
                    <div>
                      <strong>Generative Intelligence:</strong> Custom fine-tuning, embeddings, real-time streaming architectures.
                    </div>
                  </div>
                  <div className="spec-card">
                    <span className="spec-num">03</span>
                    <div>
                      <strong>System Architecture:</strong> Microservices, distributed pipelines, zero-latency state synchronization.
                    </div>
                  </div>
                </div>

                <div className="expanded-modal-cta-row">
                  <button
                    type="button"
                    className="manga-cta-action-btn"
                    onClick={() => handleNavigate('skills')}
                  >
                    <span>VIEW SKILLS →</span>
                    <span className="cta-jp">技術一覧へ</span>
                  </button>
                  <button
                    type="button"
                    className="manga-cta-secondary-btn"
                    onClick={onClose}
                  >
                    RETURN TO SPREAD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 03: CREATIVE WORLDBUILDING ================= */}
          {modalType === 'creative' && (
            <div className="expanded-grid-technical">
              <div className="expanded-schematic-column">
                <div className="schematic-img-frame">
                  <img
                    src={worldbuildingImg}
                    alt="Creative Worldbuilding Manga Scene"
                    className="schematic-illustration"
                  />
                  <div className="expanded-screentone-overlay"></div>
                  <div className="schematic-reg-overlay">
                    <span>DIMENSION: ISEKAI × DARK FANTASY</span>
                    <span>WORLD_COORD: (0.0, 1.0, 0.0)</span>
                  </div>
                </div>
              </div>

              <div className="expanded-details-column">
                <div className="protagonist-kicker-strip">
                  <span className="kicker-kanji">創造</span>
                  <span className="kicker-en">DOMAIN 02 // CREATIVE REALMS</span>
                </div>

                <h2 className="expanded-title-name">CREATIVE WORLDBUILDING</h2>
                <div className="expanded-role-pill">
                  INTERACTIVE NARRATIVES, 3D WEB & GAME SYSTEMS
                </div>

                <p className="expanded-bio-paragraph">
                  Crafting worlds where code, art, and interaction converge.
                  Building spatial game systems, procedural environments, and cinematic web experiences
                  that push the boundaries of browser rendering and interactive narrative.
                </p>

                <div className="technical-specs-list">
                  <div className="spec-card">
                    <span className="spec-num">01</span>
                    <div>
                      <strong>Spatial Game Engines:</strong> Physics simulation, collision graphs, procedural terrain.
                    </div>
                  </div>
                  <div className="spec-card">
                    <span className="spec-num">02</span>
                    <div>
                      <strong>3D Web & WebGL:</strong> Custom GLSL shaders, Three.js pipelines, interactive particles.
                    </div>
                  </div>
                  <div className="spec-card">
                    <span className="spec-num">03</span>
                    <div>
                      <strong>Interactive Narrative:</strong> Non-linear manga spreads, kinetic typography, dynamic cameras.
                    </div>
                  </div>
                </div>

                <div className="expanded-modal-cta-row">
                  <button
                    type="button"
                    className="manga-cta-action-btn"
                    onClick={() => handleNavigate('projects')}
                  >
                    <span>VIEW PROJECTS →</span>
                    <span className="cta-jp">主要作品へ</span>
                  </button>
                  <button
                    type="button"
                    className="manga-cta-secondary-btn"
                    onClick={onClose}
                  >
                    RETURN TO SPREAD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= PANEL 04: AKOGARE (PHILOSOPHY) ================= */}
          {modalType === 'akogare' && (
            <div className="expanded-akogare-layout">
              <div className="akogare-monochrome-seal-stage">
                <div className="akogare-giant-kanji">憧</div>
                <div className="akogare-kanji-full">憧れ</div>
                <div className="akogare-romaji-bold">AKOGARE</div>
              </div>

              <div className="akogare-philosophical-text">
                <div className="akogare-quote-heading">
                  “Aspiration. Admiration. The pursuit of mastery.”
                </div>
                <p className="akogare-quote-sub">
                  An enduring yearning to reach the highest standard of craftsmanship-turning
                  ideas into working systems with unrelenting dedication and deep technical discipline.
                </p>
                <div className="akogare-seal-signature">
                  <span className="sig-kanji">匹狼の信念</span>
                  <span className="sig-text">LONE WOLF PHILOSOPHY // BALAM RENEESH</span>
                </div>
              </div>

              <div className="expanded-modal-cta-row center-cta">
                <button
                  type="button"
                  className="manga-cta-action-btn"
                  onClick={() => {
                    onClose();
                    window.scrollBy({ top: 300, behavior: 'smooth' });
                  }}
                >
                  <span>CONTINUE READING ↓</span>
                  <span className="cta-jp">次頁へ進む</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= BOTTOM-LEFT: IDENTITY SEAL ANIMATION ================= */}
          {modalType === 'identity_seal' && (
            <div className="identity-seal-animation-container">
              <div className="seal-anim-step-1">
                <span className="seal-anim-char">憧</span>
              </div>
              <div className="seal-anim-step-2">
                <span className="seal-anim-word">憧れ</span>
                <span className="seal-anim-romaji">AKOGARE</span>
              </div>
              <div className="seal-anim-step-3">
                <span className="seal-anim-ippiki">一匹狼</span>
                <span className="seal-anim-ippiki-en">IPPIKI ŌKAMI // LONE WOLF</span>
              </div>
              <p className="seal-anim-caption">
                [ THE PROMISE OF MASTERY & INDEPENDENT ENGINEERING ]
              </p>
              <button
                type="button"
                className="manga-cta-secondary-btn"
                style={{ marginTop: '1.5rem' }}
                onClick={onClose}
              >
                RETURN TO SPREAD // 閉じる
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Registration Folio */}
        <div className="modal-folio-footer">
          <span>VOL.01 // EXPANDED SPREAD INSPECTION</span>
          <span>+ ⊕ +</span>
        </div>
      </div>
    </div>
  );
}
