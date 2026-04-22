import { useRef, useEffect, useState } from "react";
import certifications from "../data/certifications";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { FiShield, FiLock, FiExternalLink } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const InkanSeal = ({ cert, index }) => {
  const [isStamped, setIsStamped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-12 group">
      {/* THE SEAL */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsStamped(!isStamped)}
        className="relative w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-[#D4AF37]/20 flex items-center justify-center bg-[#0D0D0D] hover:border-[#D4AF37]/60 transition-all duration-500 shadow-2xl overflow-hidden"
      >
        <div className={`absolute inset-0 bg-[#D4AF37]/5 transition-opacity duration-700 ${isStamped ? "opacity-100" : "opacity-0"}`} />

        {/* Seal Icon / Symbol */}
        <div className="flex flex-col items-center gap-2 z-10">
          <span className="font-shippori text-3xl md:text-5xl text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors duration-700">
            {["令", "信", "証", "盟"][index % 4]}
          </span>
          <span className="font-mono text-[8px] tracking-[0.4em] text-[#333] uppercase">Seal_No.{index + 1}</span>
        </div>

        {/* Decorative Ring */}
        <div className="absolute inset-2 border border-dashed border-[#D4AF37]/10 rounded-full animate-spin-slow opacity-20" />
      </motion.button>

      {/* THE VERIFICATION DOSSIER */}
      <AnimatePresence>
        {isStamped && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden w-full max-w-md"
          >
            <div className="bg-[#111] border border-[#D4AF37]/20 p-8 flex flex-col gap-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-mono text-[9px] tracking-[0.4em] text-[#D4AF37]/60 uppercase">{cert.house}</p>
                  <h4 className="font-shippori text-xl text-white tracking-widest uppercase">{cert.title}</h4>
                </div>
                <FiShield className="text-[#D4AF37]/40" size={20} />
              </div>

              <div className="grid grid-cols-2 gap-6 py-4 border-y border-white/5">
                <div className="space-y-1">
                  <p className="font-mono text-[8px] tracking-widest text-[#444] uppercase">Identity_Hash</p>
                  <p className="font-mono text-[10px] text-[#888]">{cert.hash}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[8px] tracking-widest text-[#444] uppercase">Decree_ID</p>
                  <p className="font-mono text-[10px] text-[#888]">{cert.id}</p>
                </div>
              </div>

              <p className="font-shippori text-[#666] text-sm italic">
                "Acknowledged by the High Authorities as a master of the mentioned disciplines."
              </p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2">
                  {cert.tags.map((tag, i) => (
                    <span key={i} className="text-[8px] font-mono text-[#333] border border-white/5 px-2 py-0.5">{tag}</span>
                  ))}
                </div>
                <a href={cert.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors">
                  <span className="font-mono text-[9px] tracking-widest uppercase">Validate</span>
                  <FiExternalLink size={12} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Validation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".validation-header",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="validation"
      ref={containerRef}
      className="relative w-full bg-[#050505] py-40 border-y border-white/5 px-6"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="validation-header mb-32 flex flex-col items-center text-center">
          <div className="flex items-center gap-4 mb-4">
            <FiLock className="text-[#D4AF37]/40" size={14} />
            <span className="font-mono text-[10px] text-[#D4AF37] tracking-[0.8em] uppercase">Validation_Subsystem</span>
          </div>
          <h2 className="font-shippori text-5xl md:text-8xl text-white tracking-widest uppercase">
            Hall <span className="text-[#D4AF37]/20">of Seals</span>
          </h2>
          <p className="mt-8 font-shippori text-[#888] text-lg md:text-xl italic max-w-2xl">
            "Verification of professional identity through external cryptographic authority handshakes."
          </p>
        </div>

        {/* THE SEALS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-12">
          {certifications.map((cert, i) => (
            <InkanSeal key={i} cert={cert} index={i} />
          ))}
        </div>
      </div>

      {/* Decorative Floor Kanji */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 opacity-[0.02] pointer-events-none">
        <span className="font-shippori text-[30rem] text-white">証</span>
      </div>
    </section>
  );
}
