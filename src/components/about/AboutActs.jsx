import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ABOUT_ACTS, SERIES_INFO } from '../../data/aboutActs';
import ClockDial from './ClockDial';

gsap.registerPlugin(ScrollTrigger);

/**
 * AboutActs - Four Acts of A Day in the Life (06:00 → 01:00)
 * Pinned 100vh GSAP ScrollTrigger Stage with diagonal clip-path page cuts.
 */
export default function AboutActs({ onHourUpdate, currentHour = 6.0 }) {
  const stageRef = useRef(null);
  const actsWrapperRef = useRef(null);

  useEffect(() => {
    if (!stageRef.current || !actsWrapperRef.current) return;

    const mm = gsap.matchMedia(stageRef);

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        // 1. Reduced Motion: Static Stack
        if (reduceMotion) {
          gsap.set('.about-act-page', { opacity: 1, display: 'block', clipPath: 'none' });
          gsap.set('.about-manga-panel', { opacity: 1, y: 0, clipPath: 'none' });
          return;
        }

        // 2. Mobile: Vertical Stack with Individual Page Triggers
        if (!isDesktop) {
          gsap.set('.about-act-page', { opacity: 1, display: 'flex', clipPath: 'none' });
          gsap.set('.about-manga-panel', { opacity: 1, y: 0, clipPath: 'none' });

          ABOUT_ACTS.forEach((act) => {
            const pageEl = document.querySelector(`.about-act-page-${act.id}`);
            if (!pageEl) return;

            ScrollTrigger.create({
              trigger: pageEl,
              start: 'top 70%',
              end: 'bottom 30%',
              onEnter: () => onHourUpdate(act.hour),
              onEnterBack: () => onHourUpdate(act.hour),
            });

            const panels = pageEl.querySelectorAll('.about-manga-panel');
            if (panels.length > 0) {
              gsap.fromTo(
                panels,
                { opacity: 0.2, y: 16 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.08,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: pageEl,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                  },
                }
              );
            }
          });
          return;
        }

        // 3. Desktop: Pinned 100vh Stage with Master Scrub Timeline (+400%)
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top top',
            end: '+=400%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Map scroll progress (0.0 to 1.0) to hour range (6.0 to 25.0)
              const p = self.progress;
              let targetHour = 6.0;
              if (p <= 0.25) {
                targetHour = 6.0 + (p / 0.25) * 6.5; // 6.0 -> 12.5
              } else if (p <= 0.5) {
                targetHour = 12.5 + ((p - 0.25) / 0.25) * 7.5; // 12.5 -> 20.0
              } else if (p <= 0.75) {
                targetHour = 20.0 + ((p - 0.5) / 0.25) * 5.0; // 20.0 -> 25.0
              } else {
                targetHour = 25.0;
              }
              onHourUpdate(targetHour);
            },
          },
        });

        // Set initial page states
        gsap.set('.about-act-page', { opacity: 0, display: 'none', zIndex: 1 });
        gsap.set('.about-act-page-act1', { opacity: 1, display: 'flex', zIndex: 2 });
        gsap.set('.about-act-page-act1 .about-manga-panel', {
          opacity: 0,
          y: 12,
          clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        });

        // ACT 1 Reveal (0.0 -> 0.22)
        masterTl
          .to('.about-act-page-act1 .about-manga-panel', {
            opacity: 1,
            y: 0,
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            stagger: 0.05,
            duration: 0.18,
            ease: 'power2.out',
          }, 0.0)
          // Act 1 -> Act 2 Diagonal Page Cut (0.22 -> 0.25)
          .set('.about-act-page-act2', { display: 'flex', zIndex: 3 }, 0.22)
          .fromTo(
            '.about-act-page-act2',
            { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 1 },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.06, ease: 'none' },
            0.22
          )
          .set('.about-act-page-act1', { display: 'none' }, 0.25);

        // ACT 2 Reveal (0.25 -> 0.47)
        masterTl
          .fromTo(
            '.about-act-page-act2 .about-manga-panel',
            { opacity: 0, y: 12, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {
              opacity: 1,
              y: 0,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              stagger: 0.05,
              duration: 0.18,
              ease: 'power2.out',
            },
            0.25
          )
          // Act 2 -> Act 3 Shutter / Halftone Diagonal Cut (0.47 -> 0.50)
          .set('.about-act-page-act3', { display: 'flex', zIndex: 4 }, 0.47)
          .fromTo(
            '.about-act-page-act3',
            { clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)', opacity: 1 },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.06, ease: 'none' },
            0.47
          )
          .set('.about-act-page-act2', { display: 'none' }, 0.50);

        // ACT 3 Reveal (0.50 -> 0.72)
        masterTl
          .fromTo(
            '.about-act-page-act3 .about-manga-panel',
            { opacity: 0, y: 12, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {
              opacity: 1,
              y: 0,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              stagger: 0.05,
              duration: 0.18,
              ease: 'power2.out',
            },
            0.50
          )
          // Act 3 -> Act 4 Midnight Negative Black Page Cut (0.72 -> 0.75)
          .set('.about-act-page-act4', { display: 'flex', zIndex: 5 }, 0.72)
          .fromTo(
            '.about-act-page-act4',
            { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', opacity: 1 },
            { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 0.06, ease: 'none' },
            0.72
          )
          .set('.about-act-page-act3', { display: 'none' }, 0.75);

        // ACT 4 Reveal (0.75 -> 0.98)
        masterTl
          .fromTo(
            '.about-act-page-act4 .about-manga-panel',
            { opacity: 0, y: 12, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {
              opacity: 1,
              y: 0,
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
              stagger: 0.05,
              duration: 0.18,
              ease: 'power2.out',
            },
            0.75
          )
          .to('.about-act-akogare-thread', { strokeDashoffset: 0, duration: 0.12, ease: 'power1.inOut' }, 0.82);
      }
    );

    return () => mm.revert();
  }, [onHourUpdate]);

  return (
    <div ref={stageRef} className="about-acts-stage" aria-label="A Day in the Life: Four Manga Acts">
      {/* Mini Left-Edge Clock Dial (Progress Mode) */}
      <ClockDial mode="progress" hour={currentHour} />

      {/* Pages Viewport */}
      <div ref={actsWrapperRef} className="about-acts-viewport">
        {ABOUT_ACTS.map((act) => {
          const isNegative = act.isNegative;

          return (
            <article
              key={act.id}
              className={`about-act-page about-act-page-${act.id} ${isNegative ? 'is-negative-page' : ''}`}
              aria-label={`Act ${act.actNum}: ${act.traitTitle} (${act.timeDisplay})`}
            >
              {/* Folio Top Header Bar */}
              <div className="about-act-folio-bar">
                <div className="about-folio-left">
                  <span className="about-folio-tag">{SERIES_INFO.seriesKanji} // {SERIES_INFO.chapterKanji}</span>
                  <span className="about-folio-sep">/</span>
                  <span className="about-folio-act">ACT {act.actNum} · {act.timePeriod}</span>
                </div>
                <div className="about-folio-center">
                  <span className="about-folio-trait">{act.traitTitle} 【{act.traitKanji}】</span>
                </div>
                <div className="about-folio-right">
                  <span className="about-folio-time">{act.timeDisplay}</span>
                  <span className="about-folio-stamp">CHRONO-P.{act.actNum}</span>
                </div>
              </div>

              {/* Four Panels Asymmetrical Manga Grid */}
              <div className={`about-act-grid grid-${act.id}`}>
                {act.panels.map((p, pIdx) => {
                  return (
                    <div
                      key={`act-${act.id}-p-${pIdx}`}
                      className={`about-manga-panel panel-type-${p.type} panel-pos-${pIdx + 1}`}
                    >
                      {/* Panel Number Circled Badge (①②③④) */}
                      <div className="about-panel-num-badge" aria-hidden="true">
                        <span>{p.num}</span>
                      </div>

                      {/* Panel Type 1: Standard Image */}
                      {p.type === 'image' && (
                        <div className="about-panel-image-wrap">
                          <img src={p.image} alt={p.alt || ''} className="about-panel-img" loading="lazy" />
                          <div className="about-panel-screentone" aria-hidden="true" />
                          {p.caption && <p className="about-panel-caption">{p.caption}</p>}
                        </div>
                      )}

                      {/* Panel Type 2: Thought Bubble */}
                      {p.type === 'thought' && (
                        <div className="about-panel-thought-wrap">
                          <img src={p.image} alt={p.alt || ''} className="about-panel-img" loading="lazy" />
                          <div className="about-panel-screentone" aria-hidden="true" />
                          <div className="about-thought-bubble">
                            <span className="thought-tail-dot-1" aria-hidden="true" />
                            <span className="thought-tail-dot-2" aria-hidden="true" />
                            <p className="thought-text">{p.thoughtText}</p>
                          </div>
                        </div>
                      )}

                      {/* Panel Type 3: Image with Hanko Stamp */}
                      {p.type === 'image-stamp' && (
                        <div className="about-panel-stamp-wrap">
                          <img src={p.image} alt={p.alt || ''} className="about-panel-img" loading="lazy" />
                          <div className="about-panel-screentone" aria-hidden="true" />
                          {p.seal && (
                            <div className="about-panel-hanko-seal" aria-label={`Stamp: ${p.sealLabel}`}>
                              <span className="seal-kanji">{p.seal}</span>
                              <span className="seal-label">{p.sealLabel}</span>
                            </div>
                          )}
                          {p.caption && <p className="about-panel-caption">{p.caption}</p>}
                        </div>
                      )}

                      {/* Panel Type 4: Dialogue / Speech Bubbles */}
                      {p.type === 'dialogue' && (
                        <div className="about-panel-dialogue-wrap">
                          <div className="about-dialogue-inner">
                            {p.speechBubbles.map((b, bIdx) => (
                              <div key={`bubble-${bIdx}`} className={`about-speech-bubble bubble-${b.style}`}>
                                <span className="bubble-speaker-tag">{b.speaker}</span>
                                <p className="bubble-text">{b.text}</p>
                              </div>
                            ))}
                            {p.seal && (
                              <div className="about-dialogue-seal">
                                <span className="seal-kanji">{p.seal}</span>
                                <span className="seal-label">{p.sealLabel}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Panel Type 5: Image with SFX Burst */}
                      {p.type === 'image-sfx' && (
                        <div className="about-panel-sfx-wrap">
                          <img src={p.image} alt={p.alt || ''} className="about-panel-img" loading="lazy" />
                          <div className="about-panel-screentone" aria-hidden="true" />
                          <div className="about-sfx-burst" title={p.sfxMeaning} aria-hidden="true">
                            <span className="sfx-glyph">{p.sfx}</span>
                          </div>
                          {p.caption && <p className="about-panel-caption">{p.caption}</p>}
                        </div>
                      )}

                      {/* Panel Type 6: Staircase Progression (Act 2) */}
                      {p.type === 'staircase' && (
                        <div className="about-panel-staircase-wrap">
                          <div className="about-staircase-steps">
                            {p.steps.map((step, sIdx) => (
                              <div key={step.rank} className={`about-stair-step step-${sIdx + 1}`}>
                                <div className="step-rank-badge">{step.rank}</div>
                                <div className="step-text-group">
                                  <span className="step-title">{step.title}</span>
                                  <span className="step-jp">{step.jp}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          {p.seal && (
                            <div className="about-staircase-seal">
                              <span className="seal-kanji">{p.seal}</span>
                              <span className="seal-label">{p.sealLabel}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Panel Type 7: Missing Art Placeholder Slot */}
                      {p.type === 'placeholder-slot' && (
                        <div className="about-panel-placeholder-slot">
                          {import.meta.env.DEV && (
                            <div className="about-placeholder-dev-badge" aria-hidden="true">
                              PLACEHOLDER: {p.slotId}
                            </div>
                          )}
                          {p.slotId === 'act4-rooftop' ? (
                            // Code-drawn SVG Rooftop Wolf Silhouette
                            <div className="about-rooftop-svg-wrap" aria-hidden="true">
                              <svg viewBox="0 0 300 200" className="about-rooftop-svg">
                                <circle cx="230" cy="50" r="30" fill="#F4EFE6" opacity="0.9" />
                                <polygon points="0,180 120,130 180,150 300,110 300,200 0,200" fill="#111116" />
                                {/* Lone wolf sitting silhouette */}
                                <path
                                  d="M 125 125 Q 120 100 130 90 Q 135 85 140 92 Q 148 100 145 125 Q 155 135 150 145 L 125 145 Z"
                                  fill="#111116"
                                />
                                <circle cx="132" cy="92" r="1.5" fill="#D7331F" />
                              </svg>
                            </div>
                          ) : (
                            // Technical Schematic Diagram Placeholder
                            <div className="about-schematic-placeholder" aria-hidden="true">
                              <div className="schematic-grid-line" />
                              <span className="schematic-kanji">{p.seal}</span>
                              <span className="schematic-title">{p.placeholderTitle}</span>
                            </div>
                          )}
                          {p.seal && (
                            <div className="about-panel-hanko-seal">
                              <span className="seal-kanji">{p.seal}</span>
                              <span className="seal-label">{p.sealLabel}</span>
                            </div>
                          )}
                          {p.caption && <p className="about-panel-caption">{p.caption}</p>}
                        </div>
                      )}

                      {/* Panel Type 8: Giant Akogare Double Spread (Act 4) */}
                      {p.type === 'akogare-spread' && (
                        <div className="about-panel-akogare-stage">
                          {/* Low opacity background portrait */}
                          <img
                            src={p.bgImage}
                            alt=""
                            className="about-akogare-bg-img"
                            loading="lazy"
                            aria-hidden="true"
                          />

                          {/* Giant Yuji Boku Kanji Glyph */}
                          <div className="about-akogare-glyph-center">
                            <span className="about-akogare-giant-kanji">{p.glyph}</span>
                            <span className="about-akogare-sub-caption">{p.subCaption}</span>
                          </div>

                          {/* Vermilion Thread Crossing Across Glyph */}
                          <svg className="about-akogare-thread-svg" aria-hidden="true">
                            <path
                              d="M -20 180 Q 200 160 450 190 T 900 170"
                              className="about-act-akogare-thread"
                            />
                          </svg>

                          {/* Akogare Statement Box */}
                          <div className="about-akogare-statement-box">
                            <p className="akogare-text">{p.statement}</p>
                            <div className="akogare-sig-row">
                              <span className="sig-kanji">{p.signature.kanji}</span>
                              <span className="sig-name">{p.signature.name}</span>
                              <span className="sig-year">{p.signature.year}</span>
                            </div>
                          </div>

                          {/* Hanko Seal */}
                          <div className="about-panel-hanko-seal akogare-seal">
                            <span className="seal-kanji">{p.seal}</span>
                            <span className="seal-label">{p.sealLabel}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
