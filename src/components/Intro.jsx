import { useState, useRef } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

const Intro = ({ onFinish }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef(null);
  const glintRef = useRef(null);

  const handleStart = () => {
    if (isComplete) return;
    setIsPressing(true);
  };

  const handleEnd = () => {
    if (isComplete) return;
    setIsPressing(false);
  };

  const onGlintComplete = () => {
    setIsComplete(true);
    const tl = gsap.timeline({ onComplete: onFinish });

    // Flash of Steel
    tl.to(glintRef.current, {
      width: "100vw",
      duration: 0.2,
      ease: "power4.in"
    });
    tl.to(containerRef.current, {
      backgroundColor: "#FFFFFF",
      duration: 0.1
    });
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center cursor-none overflow-hidden touch-none"
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      {/* The Blade's Glint */}
      <motion.div
        ref={glintRef}
        className="h-full bg-white relative shadow-[0_0_50px_rgba(255,255,255,0.8)]"
        initial={{ width: "1px" }}
        animate={{
          width: isPressing ? "150px" : "1px",
          boxShadow: isPressing
            ? "0 0 100px rgba(255,255,255,1), 0 0 200px rgba(212,175,55,0.2)"
            : "0 0 20-px rgba(255,255,255,0.5)"
        }}
        transition={{
          duration: isPressing ? 1.2 : 0.6, // Faster unsheathing
          ease: isPressing ? "circIn" : "easeOut"
        }}
        onUpdate={(latest) => {
          if (parseFloat(latest.width) >= 145 && !isComplete) {
            onGlintComplete();
          }
        }}
      >
        {/* Internal Steel Texture */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </motion.div>

      {/* UI Instruction */}
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isPressing ? 0 : 0.4 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-24 flex flex-col items-center gap-6"
          >
            <p className="font-mono text-[10px] tracking-[0.8em] text-white uppercase animate-pulse">PRESS & HOLD TO DRAW</p>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative Label */}
      <div className="absolute top-12 left-12 flex flex-col gap-1 opacity-20 pointer-events-none">
        <p className="font-mono text-[8px] tracking-[0.4em] text-white">ACT_0: PRELUDE</p>
        <p className="font-mono text-[8px] tracking-[0.4em] text-[#D4AF37]">INIT: THE_BLADE_OF_LOGIC</p>
      </div>

      {/* Custom Crosshair Cursor */}
      <div className="fixed pointer-events-none w-4 h-4 border border-white/20 rotate-45" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(45deg)' }} />
    </div>
  );
};

export default Intro;
