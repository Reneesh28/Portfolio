import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import HeroHUD from "../components/HeroHUD";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_TITLE = "BALAM RENEESH";
const TARGET_ROLE = "ARCHITECT OF THE DIGITAL BLADE";
const TARGET_DESC = "I forge systems with the precision of a master swordsmith. Where complexity burns, I find structure.";

export default function Hero({ active }) {
  const sectionRef = useRef(null);
  const [isUnrolled, setIsUnrolled] = useState(false);
  const flashRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const ctx = gsap.context(() => {
      // Initial Flash Entry
      gsap.fromTo(flashRef.current,
        { opacity: 1 },
        { opacity: 0, duration: 1, ease: "power2.inOut" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [active]);

  const handleUnroll = () => {
    setIsUnrolled(true);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-screen bg-[#050505] flex items-center justify-center overflow-hidden"
    >
      <HeroHUD isDecrypted={isUnrolled} />
      <div ref={flashRef} className="absolute inset-0 bg-white z-[100] pointer-events-none" />

      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#111_0%,_#050505_100%)] opacity-30" />

      <div className="relative z-20 flex flex-col items-center">
        {!isUnrolled && (
          <motion.button
            onClick={handleUnroll}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="group relative flex flex-col items-center gap-8 cursor-pointer"
          >
            {/* The Bound Scroll (Visual) */}
            <div className="w-16 h-64 bg-[#1A1A1A] border-x-4 border-[#D4AF37]/40 relative rounded-sm shadow-2xl">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#D4AF37] opacity-20" />
              <div className="absolute top-1/4 left-0 right-0 h-px bg-[#D4AF37] opacity-10" />
              <div className="absolute bottom-1/4 left-0 right-0 h-px bg-[#D4AF37] opacity-10" />

              {/* The Cord */}
              <motion.div
                animate={{ scaleX: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/2 left-[-10px] right-[-10px] h-1 bg-[#D4AF37]"
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] tracking-[0.8em] text-[#D4AF37] uppercase animate-pulse">Break the Seal</span>
              <div className="w-12 h-[1px] bg-white/10" />
            </div>
          </motion.button>
        )}

        {/* THE UNROLLED SCROLL CONTENT */}
        <AnimatePresence>
          {isUnrolled && (
            <div className="flex items-center justify-center relative min-w-[300px]">
              {/* Left Handle */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-45vw" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-4 h-96 bg-[#1A1A1A] border-x border-[#D4AF37]/30 z-30"
              />

              {/* The Content Paper */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "90vw", opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-96 border-y border-[#D4AF37]/10 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-transparent via-white/[0.02] to-transparent"
              >
                <div className="max-w-4xl w-full px-12 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex flex-col md:items-start text-left">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="font-shippori text-5xl md:text-8xl text-white tracking-widest uppercase mb-4"
                    >
                      {TARGET_TITLE}
                    </motion.h1>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.2, duration: 1 }}
                      className="h-px bg-[#D4AF37]/40"
                    />
                  </div>

                  <div className="flex flex-col items-center md:items-end text-center md:text-right max-w-sm">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="font-mono text-[10px] tracking-[0.4em] text-[#D4AF37] mb-6"
                    >
                      {TARGET_ROLE}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                      className="font-shippori text-[#888] text-lg leading-relaxed italic"
                    >
                      "{TARGET_DESC}"
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* Right Handle */}
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "45vw" }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-4 h-96 bg-[#1A1A1A] border-x border-[#D4AF37]/30 z-30"
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Indicator */}
      {isUnrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
        >
          <div className="w-[1px] h-12 bg-[#D4AF37]" />
          <span className="font-mono text-[8px] tracking-[0.5em] uppercase">Vigilance</span>
        </motion.div>
      )}
    </section>
  );
}
