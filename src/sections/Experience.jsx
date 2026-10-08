import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Subcomponents
import JourneyHeader from '../components/experience/JourneyHeader';
import JourneyPathMap from '../components/experience/JourneyPathMap';
import ActiveArcStoryPanel from '../components/experience/ActiveArcStoryPanel';
import WorkTransitionFooter from '../components/experience/WorkTransitionFooter';

import { JOURNEY_ARCS } from '../data/journeyArcs';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef(null);
  const spreadRef = useRef(null);
  const [activeArcId, setActiveArcId] = useState('current_arc');

  const activeArc =
    JOURNEY_ARCS.find((arc) => arc.id === activeArcId) ||
    JOURNEY_ARCS[JOURNEY_ARCS.length - 1];

  // GSAP ScrollTrigger Page-Turn Animation & Progressive Ink Path Reveal
  useEffect(() => {
    if (!sectionRef.current || !spreadRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 641px) and (max-width: 1023px)',
        isMobile: '(max-width: 640px)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set(spreadRef.current, { opacity: 1, y: 0, scale: 1 });
          return;
        }

        // Physical Manga Page Turn on entering Journey
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 25%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          spreadRef.current,
          {
            opacity: 0,
            y: isDesktop ? 60 : 30,
            scale: 0.97,
            rotateX: isDesktop ? 4 : 0,
            transformOrigin: 'top center',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.85,
            ease: 'power3.out',
          }
        );

        // Progressive Ink Path Draw & Node Reveal
        gsap.from('.journey-main-ink-path', {
          strokeDashoffset: 600,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.journey-path-map-container',
            start: 'top 85%',
          },
        });

        gsap.from('.journey-arc-node-btn', {
          opacity: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.6,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.journey-nodes-track',
            start: 'top 85%',
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  const handleSelectArc = (arcId) => {
    setActiveArcId(arcId);
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="journey-section-root"
      role="region"
      aria-label="Chapter 04: Journey (Experience & Progression Arcs)"
    >
      {/* Ambient Grain Screentone */}
      <div className="journey-ambient-grain" aria-hidden="true" />

      {/* Main Manga Double-Page Spread */}
      <div ref={spreadRef} className="journey-manga-spread-container">
        {/* Chapter 04 Editorial Folio Bar & Title */}
        <JourneyHeader />

        {/* The Ink Progression Path (Visual Metaphor) */}
        <JourneyPathMap
          arcs={JOURNEY_ARCS}
          activeArcId={activeArcId}
          onSelectArc={handleSelectArc}
        />

        {/* Active Arc Manga Story Panel (Layered Narrative & Toolkit) */}
        <ActiveArcStoryPanel arc={activeArc} />

        {/* Chapter 05 The Work Transition Footer */}
        <WorkTransitionFooter />
      </div>
    </section>
  );
}