import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import educationData from '../data/education';
import ComicSpread from '../components/comic/ComicSpread';
import PaperTexture from '../components/comic/PaperTexture';

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
  const sectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.folder-container', {
        y: 100,
        opacity: 0,
        rotation: -2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          once: true
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // When tab changes, animate the content
  useEffect(() => {
    gsap.fromTo('.dossier-content', 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo('.approved-stamp',
      { scale: 3, opacity: 0, rotation: 15 },
      { scale: 1, opacity: 0.8, rotation: -10, duration: 0.5, ease: "back.out(2)", delay: 0.2 }
    );
  }, [activeTab]);

  return (
    <ComicSpread id="education" className="bg-[var(--color-deep-navy)] z-10" ref={sectionRef}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-cyan opacity-20 mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16 relative">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-text-on-dark)] relative z-10 text-shadow-cyan print-offset-magenta">
            ORIGIN RECORDS
          </h2>
        </div>

        {/* Dossier Folder */}
        <div className="folder-container w-full relative pt-12">
          
          {/* File Tabs */}
          <div className="absolute top-0 left-4 md:left-8 flex gap-2 z-0">
            {educationData.map((edu, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`font-label uppercase font-bold text-sm md:text-base px-6 py-3 rounded-t-lg transition-all duration-300 transform origin-bottom border-t-2 border-l-2 border-r-2 ${
                  activeTab === idx 
                    ? 'bg-[var(--color-paper)] text-[var(--color-ink-black)] z-20 scale-110 border-[var(--color-ink-black)] shadow-[4px_0_0_rgba(0,0,0,0.1)]' 
                    : 'bg-[#b8a99a] text-[var(--color-ink-black)]/60 z-10 hover:bg-[#c9bba9] hover:text-[var(--color-ink-black)]/80 border-[var(--color-ink-black)]/30 translate-y-2'
                }`}
              >
                {edu.degree.split(' ')[0]} {edu.degree.includes('High') ? 'School' : ''}
              </button>
            ))}
          </div>

          {/* Folder Body */}
          <div className="relative z-10 bg-[var(--color-paper)] border-4 border-[var(--color-ink-black)] min-h-[500px] shadow-[16px_16px_0_var(--color-dimension-magenta)] transform rotate-1 overflow-hidden">
            <PaperTexture theme="light" />
            
            {/* Folder crease lines */}
            <div className="absolute left-10 top-0 bottom-0 w-px bg-[var(--color-ink-black)]/20"></div>
            <div className="absolute left-12 top-0 bottom-0 w-px bg-[var(--color-ink-black)]/10"></div>
            
            {/* Top secret label */}
            <div className="absolute top-6 right-6 border-2 border-[var(--color-signal-red)] text-[var(--color-signal-red)] font-label font-bold uppercase tracking-widest px-2 py-1 text-xs transform rotate-2 opacity-80">
              CLASSIFIED // LEVEL 5
            </div>

            <div className="dossier-content p-8 md:p-12 lg:p-16 pl-16 md:pl-20 text-[var(--color-ink-black)] h-full flex flex-col">
              
              <div className="mb-8 border-b-2 border-dashed border-[var(--color-ink-black)]/30 pb-6 relative">
                
                {/* The "APPROVED" stamp */}
                <div className="approved-stamp absolute -top-4 right-4 md:right-12 lg:right-24 border-4 border-[var(--color-success-green)] text-[var(--color-success-green)] font-display text-4xl md:text-5xl lg:text-6xl px-4 py-2 transform -rotate-12 opacity-80 mix-blend-multiply pointer-events-none z-20" style={{ filter: 'url(#rough-stamp)' }}>
                  APPROVED
                </div>
                
                <h3 className="font-mono font-bold text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight mb-2 max-w-[80%]">
                  {educationData[activeTab].degree}
                </h3>
                <p className="font-label text-[var(--color-pencil-gray)] font-bold uppercase tracking-widest text-lg">
                  {educationData[activeTab].institution}
                </p>
              </div>

              <div className="flex-grow">
                <p className="font-mono text-base md:text-lg leading-relaxed whitespace-pre-line opacity-90 max-w-2xl">
                  {/* Typewriter style text */}
                  {">"} EXTRACTING RECORD...
                  <br/><br/>
                  {educationData[activeTab].description}
                </p>

                {/* Coursework Expandable Section */}
                {educationData[activeTab].coursework && (
                  <div className="mt-8 border-l-4 border-[var(--color-comic-yellow)] pl-4">
                    <p className="font-label uppercase font-bold text-sm text-[var(--color-pencil-gray)] mb-2">KEY TRAINING PROTOCOLS</p>
                    <div className="flex flex-wrap gap-2">
                      {educationData[activeTab].coursework.map((course, i) => (
                        <span key={i} className="font-mono text-xs bg-white border-2 border-[var(--color-ink-black)] px-2 py-1 shadow-[2px_2px_0_var(--color-ink-black)]">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-12 flex flex-wrap gap-8 font-mono border-t-2 border-[var(--color-ink-black)] pt-6">
                <div>
                  <span className="block text-[var(--color-pencil-gray)] text-xs uppercase tracking-widest mb-1">TIMEFRAME</span>
                  <span className="font-bold border border-[var(--color-ink-black)] px-2 py-1 inline-block">{educationData[activeTab].period}</span>
                </div>
                <div>
                  <span className="block text-[var(--color-pencil-gray)] text-xs uppercase tracking-widest mb-1">PERFORMANCE METRIC</span>
                  <span className="font-bold border border-[var(--color-ink-black)] px-2 py-1 inline-block">{educationData[activeTab].score}</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      
      {/* SVG Filter for realistic stamp effect */}
      <svg style={{ height: 0, width: 0, position: 'absolute' }}>
        <filter id="rough-stamp">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      
      <style dangerouslySetInnerHTML={{__html: `
        .text-shadow-cyan {
          text-shadow: 4px 4px 0 var(--color-portal-cyan);
        }
      `}} />
    </ComicSpread>
  );
};

export default Education;
