import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import educationData from '../data/education';
import EducationHeader from '../components/education/EducationHeader';
import EducationSpreadViewer from '../components/education/EducationSpreadViewer';
import EducationNavigationControls from '../components/education/EducationNavigationControls';
import ContactTransitionFooter from '../components/education/ContactTransitionFooter';
import './Education.css';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = educationData[currentIndex] || educationData[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? educationData.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === educationData.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelectIndex = useCallback((idx) => {
    if (idx >= 0 && idx < educationData.length) {
      setCurrentIndex(idx);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // GSAP ScrollTrigger Entrance
  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set(containerRef.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          }
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="edu-section-root"
      aria-label="Chapter 07: Academic Foundation & Origin Records"
    >
      {/* Ambient Grain Overlay */}
      <div className="edu-ambient-grain" aria-hidden="true" />

      {/* Main Manga Anthology Spread Container */}
      <div className="edu-manga-spread-container" ref={containerRef}>
        {/* Chapter 07 Folio & Headline */}
        <EducationHeader />

        {/* Dominant Academic Record Viewer */}
        <EducationSpreadViewer
          item={currentItem}
          index={currentIndex}
          total={educationData.length}
        />

        {/* Navigation Controls */}
        <EducationNavigationControls
          educationList={educationData}
          currentIndex={currentIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectIndex={handleSelectIndex}
        />

        {/* Page-Turn Transition Footer to Chapter 08: Contact */}
        <ContactTransitionFooter />
      </div>
    </section>
  );
}