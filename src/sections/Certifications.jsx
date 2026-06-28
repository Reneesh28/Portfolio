import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import certificationsData from '../data/certifications';
import ComicSpread from '../components/comic/ComicSpread';
import ComicPanel from '../components/comic/ComicPanel';
import InkButton from '../components/comic/InkButton';
import TiltCard from '../components/comic/TiltCard';
import StampReveal from '../components/comic/StampReveal';
import { X, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  const sectionRef = useRef(null);
  const [previewCert, setPreviewCert] = useState(null);

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

  // Modal handlers
  const openPreview = (cert) => {
    setPreviewCert(cert);
  };

  const closePreview = () => {
    setPreviewCert(null);
  };

  useEffect(() => {
    if (previewCert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [previewCert]);

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
          <StampReveal sfx="VERIFIED!" color="var(--color-success-green)" rotation={-4}>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider text-[var(--color-ink-black)] mt-4">
              COLLECTED ARTIFACTS
            </h2>
          </StampReveal>
        </div>

        {/* Inventory Grid */}
        <div className="w-full px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {certificationsData.map((cert, index) => (
            <div key={index} className="artifact-card h-full">
              <TiltCard maxTilt={7}>
                <ComicPanel
                  theme="light"
                  rotation={index % 2 === 0 ? '1deg' : '-1deg'}
                  className="h-full flex flex-col p-0 bg-white group hover:z-10 transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => openPreview(cert)}
                >
                  {/* Artifact Header / Image placeholder area */}
                  <div className="h-40 bg-[var(--color-ink-black)] relative overflow-hidden flex items-center justify-center border-b-4 border-[var(--color-ink-black)]">
                    <img src={cert.file} alt={cert.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-halftone-cyan opacity-20 mix-blend-screen pointer-events-none"></div>

                    <div className="absolute top-2 left-2 font-mono text-[10px] text-white opacity-80 bg-black px-1">
                      ID: {cert.year}-{cert.title.substring(0, 3).toUpperCase()}
                    </div>
                    <StampReveal sfx={null} color="var(--color-success-green)" rotation={-16} className="absolute bottom-2 right-2" delay={0.1 * (index % 4)}>
                      <div className="font-mono text-[10px] text-[var(--color-success-green)] font-bold bg-black px-1 border border-[var(--color-success-green)]">
                        [ AUTHORIZED ]
                      </div>
                    </StampReveal>

                    {/* Overlay text on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <span className="font-label font-bold text-white tracking-widest border-2 border-white px-3 py-1">PREVIEW</span>
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
                      <button
                        onClick={(e) => { e.stopPropagation(); openPreview(cert); }}
                        className="font-label uppercase font-bold text-xs tracking-widest text-[var(--color-portal-cyan)] hover:text-[var(--color-dimension-magenta)] transition-colors underline decoration-2 underline-offset-4"
                      >
                        EXAMINE
                      </button>
                    </div>
                  </div>
                </ComicPanel>
              </TiltCard>
            </div>
          ))}

        </div>
      </div>

      {/* Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm" onClick={closePreview}>
          <div
            className="relative bg-white border-8 border-[var(--color-ink-black)] max-w-4xl w-full max-h-full flex flex-col shadow-[16px_16px_0_var(--color-portal-cyan)] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[var(--color-ink-black)] text-white p-4 flex justify-between items-center border-b-4 border-[var(--color-ink-black)]">
              <h3 className="font-display text-2xl tracking-wider">{previewCert.title}</h3>
              <button onClick={closePreview} className="hover:text-[var(--color-signal-red)] transition-colors" aria-label="Close preview">
                <X size={28} />
              </button>
            </div>

            {/* Modal Body - Image */}
            <div className="bg-[var(--color-paper-light)] p-4 overflow-auto flex-grow flex items-center justify-center relative min-h-[300px]">
              <div className="absolute inset-0 bg-halftone-light opacity-10 pointer-events-none"></div>
              <img src={previewCert.file} alt={previewCert.title} className="max-w-full max-h-[60vh] object-contain border-2 border-[var(--color-ink-black)] relative z-10 shadow-lg" />
            </div>

            {/* Modal Footer - Actions */}
            <div className="bg-white p-4 border-t-4 border-[var(--color-ink-black)] flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="font-label font-bold text-[var(--color-pencil-gray)] uppercase text-sm">ISSUED BY</p>
                <p className="font-display text-xl text-[var(--color-ink-black)]">{previewCert.issuer}</p>
              </div>
              <a href={previewCert.file} target="_blank" rel="noreferrer">
                <InkButton variant="yellow" className="flex items-center gap-2">
                  <ExternalLink size={18} /> VERIFY CREDENTIAL SOURCE
                </InkButton>
              </a>
            </div>
          </div>
        </div>
      )}

    </ComicSpread>
  );
};

export default Certifications;