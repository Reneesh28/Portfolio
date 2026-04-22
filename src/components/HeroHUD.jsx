import { motion } from "framer-motion";

const HUDLabel = ({ children, className }) => (
  <div className={`font-mono text-[9px] tracking-[0.3em] text-[#FF4500]/50 uppercase ${className}`}>
    {children}
  </div>
);

const Hanko = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 1, duration: 1 }}
    className="w-12 h-12 border border-[#FF4500]/40 flex items-center justify-center relative overflow-hidden group cursor-help"
  >
    <div className="absolute inset-0 bg-[#FF4500]/5 group-hover:bg-[#FF4500]/10 transition-colors" />
    <span className="text-[#FF4500] font-shippori text-xl font-bold leading-none z-10">
      BR
    </span>
  </motion.div>
);

export default function HeroHUD({ isDecrypted }) {
  return (
    <div className="absolute inset-0 z-30 pointer-events-none p-8 sm:p-16 flex flex-col justify-between overflow-hidden">
      {/* Top HUD - Hanko & Narrative Status */}
      <div className="flex justify-between items-start">
        <Hanko />

        <div className="text-right flex flex-col items-end gap-2">
          <HUDLabel>FORGE_CYCLE_01</HUDLabel>
          <HUDLabel className="opacity-30">DOJO: EASTERN_PEAK</HUDLabel>
        </div>
      </div>

      {/* Decorative Vertical Blades (Architectural) */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-32 opacity-10 hidden md:flex">
        <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-[#FF4500] to-transparent" />
        <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-[#FF4500] to-transparent" />
      </div>

      <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-32 opacity-10 hidden md:flex">
        <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-[#FF4500] to-transparent" />
        <div className="w-[1px] h-48 bg-gradient-to-b from-transparent via-[#FF4500] to-transparent" />
      </div>

      {/* Bottom HUD - Forge Metrics */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <HUDLabel className="!text-[#FF4500]/80">FORGE_PURITY: {isDecrypted ? "FLAWLESS" : "TEMPERING"}</HUDLabel>
          <div className="w-24 h-[1px] bg-[#FF4500]/20 relative overflow-hidden">
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[#FF4500]/40 w-1/2"
            />
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <HUDLabel className={isDecrypted ? "text-[#FF4500]" : "text-white/20"}>
            {isDecrypted ? "STEEL_TEMPERED" : "DORMANT_STEEL"}
          </HUDLabel>
          <motion.div
            animate={{ width: isDecrypted ? "100%" : "20%" }}
            className="h-full bg-[#FF4500]/40 w-32 origin-right"
          />
        </div>
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-noise pointer-events-none opacity-[0.02]" />
    </div>
  );
}
