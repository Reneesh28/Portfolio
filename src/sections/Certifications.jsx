import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import certificationsData from '../data/certifications';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.artifact-card', {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)",
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
    <ComicSpread id="certifications" className="bg-[var(--color-paper-light)] text-[var(--color-ink-black)] z-20" ref={sectionRef}>
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-halftone-light opacity-50 pointer-events-none mix-blend-multiply"></div>
      
      {/* Large faint background text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-display text-[15rem] md:text-[25rem] text-[var(--color-ink-black)] opacity-5 pointer-events-none whitespace-nowrap">
        ARTIFACTS
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16 relative">
          <div className="font-label uppercase font-bold text-[var(--color-pencil-gray)] mb-2 tracking-[0.3em] bg-[var(--color-ink-black)] text-[var(--color-paper-light)] px-4 py-1 inline-block transform -rotate-1">
            TROPHY ROOM
          </div>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-ink-black)] mt-4">
            COLLECTED ARTIFACTS
          </h2>
        </div>

        {/* Inventory Grid */}
        <div className="w-full px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {certificationsData.map((cert, index) => (
            <div key={index} className="artifact-card h-full">
              <ComicPanel 
                theme="light"
                rotation={index % 2 === 0 ? '1deg' : '-1deg'}
                className="h-full flex flex-col p-0 bg-white group hover:z-10 transition-transform duration-300 hover:scale-105"
              >
                {/* Artifact Header / Image placeholder area */}
                <div className="h-32 bg-[var(--color-ink-black)] relative overflow-hidden flex items-center justify-center border-b-4 border-[var(--color-ink-black)]">
                  <div className="absolute inset-0 bg-halftone-cyan opacity-20 mix-blend-screen pointer-events-none"></div>
                  
                  {/* Decorative circuit/badge pattern */}
                  <svg width="60" height="60" viewBox="0 0 100 100" className="text-[var(--color-comic-yellow)] opacity-80 group-hover:scale-110 transition-transform duration-500">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                  </svg>
                  
                  <div className="absolute top-2 left-2 font-mono text-[10px] text-white opacity-50">
                    ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}
                  </div>
                  <div className="absolute bottom-2 right-2 font-mono text-[10px] text-[var(--color-success-green)] font-bold">
                    [ AUTHORIZED ]
                  </div>
                </div>

                {/* Artifact Details */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl leading-tight mb-2 text-[var(--color-ink-black)] group-hover:text-[var(--color-dimension-magenta)] transition-colors">
                      {cert.title}
                    </h3>
                    <p className="font-label uppercase font-bold text-[var(--color-pencil-gray)] mb-4 border-l-2 border-[var(--color-pencil-gray)] pl-2">
                      {cert.issuer}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cert.tags.map((tag, i) => (
                        <span key={i} className="font-mono text-xs font-bold bg-[var(--color-paper-light)] border border-[var(--color-ink-black)] px-2 py-1">
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t-2 border-dashed border-[var(--color-ink-black)]/30 flex justify-between items-center">
                    <span className="font-label font-bold text-sm bg-[var(--color-ink-black)] text-white px-3 py-1 transform -rotate-2">
                      {cert.year}
                    </span>
                    <a href={cert.file} target="_blank" rel="noreferrer">
                      <button className="font-label uppercase font-bold text-xs tracking-widest text-[var(--color-portal-cyan)] hover:text-[var(--color-dimension-magenta)] transition-colors underline decoration-2 underline-offset-4">
                        VERIFY ARTIFACT
                      </button>
                    </a>
                  </div>
                </div>
              </ComicPanel>
            </div>
          ))}

        </div>
      </div>
    </ComicSpread>
  );
};

export default Certifications;
