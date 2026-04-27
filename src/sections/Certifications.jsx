import { useEffect, useRef, useState } from "react";
import certifications from "../data/certifications";
import { FiAward, FiChevronDown, FiExternalLink } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const ScrollCard = ({ cert }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      {/* THE IMPERIAL SEAL (BUTTON) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full relative z-20 p-8 bg-[#111111] border border-white/5 flex items-center justify-between group-hover:border-[#C5A059]/40 transition-all duration-500 shadow-xl"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-14 h-14 bg-[#8B0000] flex items-center justify-center text-[#F5F5F5] border border-white/10 shadow-lg group-hover:rotate-12 transition-transform">
              <FiAward size={28} />
            </div>
            {/* Wax drip effect (conceptual) */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#8B0000] rounded-full blur-[2px] opacity-40" />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-serif font-bold text-[#F5F5F5] group-hover:text-[#C5A059] transition-colors tracking-tight">
              {cert.title}
            </h3>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#A3A3A3] font-bold">
              {cert.issuer} • {cert.year}
            </p>
          </div>
        </div>
        <div className={`p-2 rounded-full border border-[#C5A059]/20 transition-all duration-500 ${isOpen ? 'rotate-180 bg-[#C5A059] text-black' : 'text-[#C5A059]'}`}>
          <FiChevronDown size={20} />
        </div>
      </button>

      {/* THE UNROLLING SCROLL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 0.3 }
            }}
            className="relative z-10 overflow-hidden"
          >
            {/* Top Dowel (Fixed at the top of the unroll) */}
            <div className="h-4 w-full bg-gradient-to-b from-[#222] to-[#111] border-b border-white/10 rounded-full" />

            <div className="relative p-10 md:p-16 bg-[#F5F5F5] text-[#0D0D0D] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] shadow-inner">
              {/* Decorative Border */}
              <div className="absolute inset-4 border border-[#8B0000]/10 pointer-events-none" />

              <div className="relative z-10 space-y-8">
                <div className="flex flex-wrap gap-3">
                  {cert.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 bg-[#8B0000] text-white">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-lg md:text-xl font-serif leading-relaxed italic text-[#333]">
                  "This scroll certifies the mastery of the arts mentioned herein, forged through discipline and strategic execution."
                </p>

                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent" />

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#8B0000]">Issued By</p>
                    <p className="text-xl font-serif font-bold uppercase">{cert.issuer}</p>
                  </div>
                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 py-3 px-8 bg-[#0D0D0D] text-white font-serif tracking-[0.3em] text-xs hover:bg-[#8B0000] transition-colors group shadow-lg"
                  >
                    WITNESS SEAL
                    <FiExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Dowel (Falls with the scroll) */}
            <div className="h-6 w-full bg-gradient-to-t from-[#222] to-[#111] border-t border-white/10 rounded-full shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Certifications() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cert-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="w-full bg-[#0D0D0D] text-[#F5F5F5] px-6 md:px-12 py-24 sm:py-32 border-t border-white/5 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-24 text-center md:text-left">
          <p className="text-[#8B0000] uppercase tracking-[0.6em] text-xs mb-4 font-bold">
            The Clearances
          </p>
          <h2 className="text-5xl md:text-9xl font-serif font-bold text-[#F5F5F5]">
            Imperial Seals
          </h2>
        </div>

        <div className="space-y-10">
          {certifications.map((cert, index) => (
            <div key={index} className="cert-item">
              <ScrollCard cert={cert} />
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Large Seal in Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-serif text-white/[0.02] pointer-events-none select-none z-0">
        印
      </div>
    </section>
  );
}
