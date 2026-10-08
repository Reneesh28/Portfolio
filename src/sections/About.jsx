import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Subcomponents
import CharacterProfileHeader from '../components/about/CharacterProfileHeader';
import MainCharacterSpread from '../components/about/MainCharacterSpread';
import IdentityMap from '../components/about/IdentityMap';
import CoreTraitsPanels from '../components/about/CoreTraitsPanels';
import AkogareDriveSection from '../components/about/AkogareDriveSection';
import ArsenalTransitionFooter from '../components/about/ArsenalTransitionFooter';
import AboutModalOverlay from '../components/about/AboutModalOverlay';

import portraitImg from '../assets/images/manga_about_portrait.jpg';
import './About.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const spreadRef = useRef(null);
  const [activeModal, setActiveModal] = useState(null);

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

        // Physical Manga Page Turn Effect on Entering About
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

        // Progressive stagger for inner sections
        gsap.from('.about-identity-map-section', {
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-identity-map-section',
            start: 'top 85%',
          },
        });

        gsap.from('.traits-panels-composition-grid .trait-manga-panel', {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.traits-panels-composition-grid',
            start: 'top 85%',
          },
        });

        gsap.from('.about-akogare-section', {
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-akogare-section',
            start: 'top 85%',
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  const handleOpenPortraitModal = () => {
    setActiveModal({
      title: 'DESK ARCHIVE // QUIET SEINEN',
      headline: 'THE PERSON BEHIND THE PROTAGONIST',
      kanji: '日常',
      tag: 'SEINEN × SLICE OF LIFE // P. 018',
      image: portraitImg,
      description:
        'A quiet everyday moment of contemplation and craft: Balam Reneesh working at a dedicated desk with open laptop, design blueprints, notebooks, and tea. Here, the boundary between computational logic and creative worldbuilding is forged through relentless curiosity and daily discipline.',
      tags: ['SEINEN', 'SLICE OF LIFE', 'WORKSPACE', 'DEEP FOCUS'],
    });
  };

  const handleSelectTrait = (trait) => {
    setActiveModal({
      title: `${trait.title} // CHARACTER TRAIT ${trait.num}`,
      headline: trait.headline,
      kanji: trait.kanji,
      tag: trait.tag,
      image: trait.image,
      description: trait.description,
      tags: [trait.title, 'OPERATING PRINCIPLE', 'CRAFT'],
    });
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section-root"
      role="region"
      aria-label="Chapter 02: Character Profile"
    >
      {/* Ambient Grain Screentone */}
      <div className="about-ambient-grain" aria-hidden="true" />

      {/* Main Manga Double-Page Spread */}
      <div ref={spreadRef} className="about-manga-spread-container">
        {/* Chapter 02 Editorial Top Folio & Headline */}
        <CharacterProfileHeader />

        {/* Double-Page Spread (Portrait & Biography & Character File) */}
        <MainCharacterSpread onOpenPortraitModal={handleOpenPortraitModal} />

        {/* Identity Map (Non-Chronological 6 Marks System) */}
        <IdentityMap />

        {/* Four Core Manga Trait Panels (BUILD, CREATE, LEAD, EXPLORE) */}
        <CoreTraitsPanels onSelectTrait={handleSelectTrait} />

        {/* Akogare Philosophy Motivation Drive Section */}
        <AkogareDriveSection />

        {/* Chapter 03 Arsenal Transition Footer */}
        <ArsenalTransitionFooter />
      </div>

      {/* Modal Overlay for Deep Spread Inspection */}
      <AboutModalOverlay
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </section>
  );
}