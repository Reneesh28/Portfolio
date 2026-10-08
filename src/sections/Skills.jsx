import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Subcomponents
import ArsenalHeader from '../components/skills/ArsenalHeader';
import CoreSystemBlueprint from '../components/skills/CoreSystemBlueprint';
import CategorySelectorBar from '../components/skills/CategorySelectorBar';
import MangaTechDossierPanel from '../components/skills/MangaTechDossierPanel';
import ProjectsTransitionFooter from '../components/skills/ProjectsTransitionFooter';

import { ARSENAL_CATEGORIES } from '../data/arsenalCategories';
import './Skills.css';

gsap.registerPlugin(ScrollTrigger);

export default function Skills() {
  const sectionRef = useRef(null);
  const spreadRef = useRef(null);
  const [activeCategoryId, setActiveCategoryId] = useState('ai_ml');

  const activeCategory =
    ARSENAL_CATEGORIES.find((cat) => cat.id === activeCategoryId) ||
    ARSENAL_CATEGORIES[0];

  // GSAP ScrollTrigger Page-Turn Animation
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

        // Physical Manga Page Turn on entering Skills
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

        // Progressive stagger for Core System and Category Selector
        gsap.from('.core-system-blueprint-container', {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.core-system-blueprint-container',
            start: 'top 85%',
          },
        });

        gsap.from('.skills-category-tab-btn', {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.skills-category-buttons-list',
            start: 'top 85%',
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setActiveCategoryId(categoryId);
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="skills-section-root"
      role="region"
      aria-label="Chapter 03: Arsenal (Skills & Technologies)"
    >
      {/* Ambient Screentone Texture */}
      <div className="skills-ambient-grain" aria-hidden="true" />

      {/* Main Manga Double-Page Spread */}
      <div ref={spreadRef} className="skills-manga-spread-container">
        {/* Chapter 03 Editorial Folio Bar & Title */}
        <ArsenalHeader />

        {/* Central Core System Technical Blueprint Visual Anchor */}
        <CoreSystemBlueprint
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Category Selector Bar (Manga Chapter Annotations) */}
        <CategorySelectorBar
          categories={ARSENAL_CATEGORIES}
          activeCategoryId={activeCategoryId}
          onSelectCategory={handleSelectCategory}
        />

        {/* Manga Tech Dossier Panel (Level 2 Tech Inventory & Level 3 Inline Context) */}
        <MangaTechDossierPanel activeCategory={activeCategory} />

        {/* Chapter 04 The Work Transition Footer */}
        <ProjectsTransitionFooter />
      </div>
    </section>
  );
}