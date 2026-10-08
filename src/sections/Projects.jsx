import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MANGA_PROJECTS } from '../data/mangaProjectsData';
import ProjectsHeader from '../components/projects/ProjectsHeader';
import ProjectSpreadViewer from '../components/projects/ProjectSpreadViewer';
import ProjectCaseStudyModal from '../components/projects/ProjectCaseStudyModal';
import ProjectNavigationControls from '../components/projects/ProjectNavigationControls';
import ContactTransitionFooter from '../components/projects/ContactTransitionFooter';
import './Projects.css';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  const currentProject = MANGA_PROJECTS[currentIndex] || MANGA_PROJECTS[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? MANGA_PROJECTS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === MANGA_PROJECTS.length - 1 ? 0 : prev + 1));
  }, []);

  const handleSelectIndex = useCallback((idx) => {
    if (idx >= 0 && idx < MANGA_PROJECTS.length) {
      setCurrentIndex(idx);
    }
  }, []);

  // Keyboard Navigation: Left/Right, Enter (Explore), Escape (Return)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' && !isCaseStudyOpen) {
        e.preventDefault();
        setIsCaseStudyOpen(true);
      } else if (e.key === 'Escape' && isCaseStudyOpen) {
        e.preventDefault();
        setIsCaseStudyOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isCaseStudyOpen]);

  // GSAP Entrance ScrollTrigger Animation
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
      id="projects"
      ref={sectionRef}
      className="projects-section-root"
      aria-label="Chapter 05: The Work - Manga Project Anthology"
    >
      {/* Ambient Grain Overlay */}
      <div className="projects-ambient-grain" aria-hidden="true" />

      {/* Main Manga Anthology Double-Page Spread Container */}
      <div className="projects-manga-spread-container" ref={containerRef}>
        {/* Chapter 05 Folio & Editorial Header */}
        <ProjectsHeader />

        {/* Selected Project Spread (Dominant Volume Spread Viewer) */}
        <ProjectSpreadViewer
          project={currentProject}
          onExploreProject={() => setIsCaseStudyOpen(true)}
        />

        {/* Project Navigation Controls (Previous/Next, Volume Dots, Direct Jump Index) */}
        <ProjectNavigationControls
          projects={MANGA_PROJECTS}
          currentIndex={currentIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectIndex={handleSelectIndex}
        />

        {/* Transition Footer to Chapter 06: Contact */}
        <ContactTransitionFooter />
      </div>

      {/* Deep Case Study Volume Modal */}
      <ProjectCaseStudyModal
        project={currentProject}
        isOpen={isCaseStudyOpen}
        onClose={() => setIsCaseStudyOpen(false)}
      />
    </section>
  );
}