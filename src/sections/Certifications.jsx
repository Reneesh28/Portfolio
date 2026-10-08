import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import certificationsData from '../data/certifications';
import CertificationsHeader from '../components/certifications/CertificationsHeader';
import CertificateSpreadViewer from '../components/certifications/CertificateSpreadViewer';
import CertificateNavigationControls from '../components/certifications/CertificateNavigationControls';
import CertificateInspectionModal from '../components/certifications/CertificateInspectionModal';
import EducationTransitionFooter from '../components/certifications/EducationTransitionFooter';
import './Certifications.css';

gsap.registerPlugin(ScrollTrigger);

export default function Certifications() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExamining, setIsExamining] = useState(false);

  const currentCert = certificationsData[currentIndex] || certificationsData[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? certificationsData.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === certificationsData.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelectIndex = useCallback((idx) => {
    if (idx >= 0 && idx < certificationsData.length) {
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
      } else if (e.key === 'Enter' && !isExamining) {
        e.preventDefault();
        setIsExamining(true);
      } else if (e.key === 'Escape' && isExamining) {
        e.preventDefault();
        setIsExamining(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isExamining]);

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
      id="certifications"
      ref={sectionRef}
      className="cert-section-root"
      aria-label="Chapter 06: Credentials & Verified Scrolls"
    >
      {/* Ambient Grain Overlay */}
      <div className="cert-ambient-grain" aria-hidden="true" />

      {/* Main Manga Anthology Spread Container */}
      <div className="cert-manga-spread-container" ref={containerRef}>
        {/* Chapter 06 Folio & Headline */}
        <CertificationsHeader />

        {/* Dominant Certificate Viewer */}
        <CertificateSpreadViewer
          cert={currentCert}
          index={currentIndex}
          total={certificationsData.length}
          onExamineCert={() => setIsExamining(true)}
        />

        {/* Navigation Controls */}
        <CertificateNavigationControls
          certifications={certificationsData}
          currentIndex={currentIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectIndex={handleSelectIndex}
        />

        {/* Page-Turn Transition Footer to Chapter 07: Education */}
        <EducationTransitionFooter />
      </div>

      {/* High-Res Examination Modal */}
      <CertificateInspectionModal
        cert={currentCert}
        isOpen={isExamining}
        onClose={() => setIsExamining(false)}
      />
    </section>
  );
}