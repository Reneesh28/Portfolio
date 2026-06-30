import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileData from '../data/profile';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';
import TiltCard from '../components/comic/TiltCard';
import StampReveal from '../components/comic/StampReveal';
import FrameStutter from '../components/comic/FrameStutter';
import codewalkerImg from "../assets/images/codewalker.webp";
import { SectionPortal } from '../components/comic/PortalTransition';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for panels
      gsap.from('.about-panel', {
        y: 100,
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -5 : 5),
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <ComicSpread id="about" className="bg-[var(--color-paper)] text-[var(--color-text-on-paper)] border-t-8 border-b-8 border-[var(--color-ink-black)] z-20" ref={sectionRef}>
      <SectionPortal colorA="var(--color-miles-red)" colorB="var(--color-saffron)" />

      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none mix-blend-multiply"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <FrameStutter steps={5}>
          <StampReveal sfx="ORIGIN!" color="var(--color-dimension-magenta)" rotation={-4}>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-[var(--color-ink-black)] mb-12 tracking-wider text-center print-offset-both">
              THE ORIGIN STORY
            </h2>
          </StampReveal>
        </FrameStutter>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Panel 1: Profile Image */}
          <div className="about-panel lg:col-span-4">
            <TiltCard maxTilt={8}>
              <ComicPanel theme="light" rotation="-2deg" className="h-full p-4 flex flex-col bg-white">
                <div className="flex-grow bg-[var(--color-ink-black)] relative overflow-hidden border-4 border-[var(--color-ink-black)] shadow-inner">
                  <img src={codewalkerImg} alt="The Codewalker Desk Variant" className="w-full h-auto object-cover opacity-80 mix-blend-screen" />
                </div>
                <div className="mt-4 border-t-4 border-[var(--color-ink-black)] pt-2 flex justify-between font-label uppercase font-bold text-sm">
                  <span>IDENTITY_FILE_01</span>
                  <span>EARTH-28</span>
                </div>
              </ComicPanel>
            </TiltCard>
          </div>

          {/* Panel 2: Biography */}
          <div className="about-panel lg:col-span-8">
            <ComicPanel theme="dark" rotation="1deg" className="h-full p-6 md:p-8 flex flex-col justify-center">
              <div className="font-label text-[var(--color-comic-yellow)] tracking-widest mb-4 border-l-4 border-[var(--color-comic-yellow)] pl-4 text-xl md:text-2xl font-bold">
                CIVILIAN LOG
              </div>
              <div className="font-body text-base md:text-lg text-[var(--color-text-on-dark)] space-y-4 opacity-90 leading-relaxed whitespace-pre-line">
                {profileData.biography}
              </div>
            </ComicPanel>
          </div>

          {/* Panel 3: Quick Facts */}
          <div className="about-panel lg:col-span-7 lg:row-start-2">
            <ComicPanel theme="light" rotation="-1deg" className="h-full p-6 md:p-8 bg-[var(--color-paper-light)]">
              <h3 className="font-display text-3xl md:text-4xl text-[var(--color-dimension-magenta)] mb-6 tracking-wide">
                CHARACTER PROFILE
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 font-body text-sm md:text-base">
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Alias</span>
                  <span className="font-bold text-[var(--color-ink-black)]">{profileData.alias}</span>
                </div>
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Base</span>
                  <span className="font-bold text-[var(--color-ink-black)]">{profileData.base}</span>
                </div>
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Role</span>
                  <span className="font-bold text-[var(--color-ink-black)]">{profileData.role}</span>
                </div>
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Education</span>
                  <span className="font-bold text-[var(--color-ink-black)]">{profileData.education}</span>
                </div>
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2 sm:col-span-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Specialization</span>
                  <span className="font-bold text-[var(--color-ink-black)]">{profileData.specialization}</span>
                </div>
                <div className="border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-2 sm:col-span-2">
                  <span className="font-label font-bold uppercase text-[var(--color-pencil-gray)] block text-xs">Availability</span>
                  <StampReveal sfx={null} color="var(--color-success-green)" rotation={-12} className="mt-1">
                    <span className="font-bold text-[var(--color-success-green)] bg-[var(--color-ink-black)] px-2 py-0.5 inline-block">{profileData.availability}</span>
                  </StampReveal>
                </div>
              </div>
            </ComicPanel>
          </div>

          {/* Panel 4: Action */}
          <div className="about-panel lg:col-span-5 lg:row-start-2">
            <ComicPanel theme="dark" rotation="2deg" className="h-full p-6 md:p-8 flex flex-col justify-center items-center text-center">
              <p className="font-label font-bold text-xl md:text-2xl text-[var(--color-text-on-dark)] mb-8 tracking-widest leading-relaxed">
                ACCESS COMPLETE ARCHIVE
              </p>
              <a href="/resume.pdf" target="_blank" rel="noreferrer" className="block w-full max-w-sm comic-focus">
                <InkButton variant="yellow" className="w-full text-lg shadow-[8px_8px_0_var(--color-portal-cyan)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all">
                  OPEN ORIGIN FILE
                </InkButton>
              </a>
            </ComicPanel>
          </div>

        </div>
      </div>
    </ComicSpread>
  );
};

export default About;