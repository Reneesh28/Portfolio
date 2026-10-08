import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ContactHeader from '../components/contact/ContactHeader';
import ContactMangaForm from '../components/contact/ContactMangaForm';
import ContactOperatorDossier from '../components/contact/ContactOperatorDossier';
import VolumeEndSeal from '../components/contact/VolumeEndSeal';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [logs, setLogs] = useState(['AWAITING MULTIVERSE SIGNAL...', 'FREQUENCY: 28.000 MHZ [READY]']);

  const handleLogUpdate = useCallback((newLog) => {
    setLogs((prev) => [...prev.slice(-4), newLog]);
  }, []);

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
      id="contact"
      ref={sectionRef}
      className="contact-section-root"
      aria-label="Chapter 08: Direct Transmission & Open Channels"
    >
      {/* Ambient Grain Overlay */}
      <div className="contact-ambient-grain" aria-hidden="true" />

      {/* Main Manga Anthology Spread Container */}
      <div className="contact-manga-spread-container" ref={containerRef}>
        {/* Chapter 08 Folio & Headline */}
        <ContactHeader />

        {/* Transmission Double Spread (Form + Dossier) */}
        <div className="contact-transmission-spread">
          {/* Left Page: Manga Transmission Form */}
          <ContactMangaForm onLogUpdate={handleLogUpdate} />

          {/* Right Page: Operator Channels & Live Log */}
          <ContactOperatorDossier logs={logs} />
        </div>

        {/* Tankōbon Volume 01 End Seal */}
        <VolumeEndSeal />
      </div>
    </section>
  );
}