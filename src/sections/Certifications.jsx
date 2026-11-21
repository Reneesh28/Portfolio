import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import certificationsData from '../data/certifications';
import { X, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Certifications = () => {
  const sectionRef = useRef(null);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from('.cert-card', {
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        stagger: 0.1,
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
    <section ref={sectionRef} id="certifications" className="relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 bg-bg text-text z-20">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center">

        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-text">
            Certifications
          </h2>
        </div>

        <div className="w-full px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">

          {certificationsData.map((cert, index) => (
            <div key={index} className="cert-card h-full">
              <div
                className="h-full flex flex-col rounded-lg border border-border bg-surface overflow-hidden group cursor-pointer transition-colors hover:border-text-muted"
                onClick={() => openPreview(cert)}
              >
                <div className="h-40 bg-bg relative overflow-hidden flex items-center justify-center border-b border-border">
                  <img src={cert.file} alt={cert.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <span className="font-medium text-white border border-white rounded px-3 py-1">Preview</span>
                  </div>
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold leading-tight mb-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      {cert.issuer}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {cert.tags.map((tag, i) => (
                        <span key={i} className="font-mono text-xs rounded border border-border bg-bg px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-medium text-text-muted">
                      {cert.year}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openPreview(cert); }}
                      className="text-sm font-medium underline underline-offset-4 hover:text-text-muted transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm" onClick={closePreview}>
          <div
            className="relative bg-surface border border-border rounded-lg max-w-4xl w-full max-h-full flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b border-border">
              <h3 className="text-xl font-semibold">{previewCert.title}</h3>
              <button onClick={closePreview} className="hover:text-text-muted transition-colors" aria-label="Close preview">
                <X size={28} />
              </button>
            </div>

            <div className="bg-bg p-4 overflow-auto flex-grow flex items-center justify-center relative min-h-[300px]">
              <img src={previewCert.file} alt={previewCert.title} className="max-w-full max-h-[60vh] object-contain rounded border border-border" />
            </div>

            <div className="p-4 border-t border-border flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs font-medium uppercase text-text-muted">Issued by</p>
                <p className="text-lg font-semibold">{previewCert.issuer}</p>
              </div>
              <a
                href={previewCert.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-accent text-accent-contrast font-medium hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={18} /> Open Certificate
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Certifications;
