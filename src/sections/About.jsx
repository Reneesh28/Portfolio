import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import profileData from '../data/profile';

gsap.registerPlugin(ScrollTrigger);

const FactItem = ({ label, children, wide = false }) => (
  <div className={`border-b border-border pb-2 ${wide ? 'sm:col-span-2' : ''}`}>
    <span className="font-medium uppercase text-text-muted block text-xs tracking-wider">{label}</span>
    <span className="font-semibold text-text">{children}</span>
  </div>
);

const About = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia(sectionRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      const { isDesktop, reduceMotion } = context.conditions;

      if (reduceMotion) {
        gsap.set('.about-panel', { opacity: 1 });
        return;
      }

      gsap.from('.about-panel', {
        y: isDesktop ? 60 : 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-surface border-y border-border z-20">
      <div className="relative w-full max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text mb-12 text-center">
          About
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Biography */}
          <div className="about-panel lg:col-span-12">
            <div className="h-full p-6 md:p-8 rounded-lg border border-border bg-bg">
              <h3 className="text-xl md:text-2xl font-semibold mb-4">Biography</h3>
              <div className="text-base md:text-lg text-text space-y-4 opacity-90 leading-relaxed whitespace-pre-line">
                {profileData.biography}
              </div>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="about-panel lg:col-span-7">
            <div className="h-full p-6 md:p-8 rounded-lg border border-border bg-bg">
              <h3 className="text-xl md:text-2xl font-semibold mb-6">Profile</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm md:text-base">
                <FactItem label="Name">{profileData.name}</FactItem>
                <FactItem label="Role">{profileData.role}</FactItem>
                <FactItem label="Education" wide>{profileData.education}</FactItem>
                <FactItem label="Specialization" wide>{profileData.specialization}</FactItem>
                <FactItem label="Availability" wide>
                  <span className="text-success">{profileData.availability}</span>
                </FactItem>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="about-panel lg:col-span-5">
            <div className="h-full p-6 md:p-8 rounded-lg border border-border bg-bg flex flex-col justify-center items-center text-center">
              <p className="font-semibold text-xl md:text-2xl text-text mb-8">
                Full resume
              </p>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full max-w-sm px-6 py-3 rounded-md bg-accent text-accent-contrast font-medium text-lg hover:opacity-90 transition-opacity"
              >
                Open Resume
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
