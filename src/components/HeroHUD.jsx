import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HUDElement = ({ children, className }) => (
  <div className={`font-mono text-[10px] tracking-widest text-[#00E5FF]/60 uppercase ${className}`}>
    {children}
  </div>
);

export default function HeroHUD({ isDecrypted }) {
  const [coords, setCoords] = useState({ x: "0.000", y: "0.000" });

  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        x: (Math.random() * 100).toFixed(3),
        y: (Math.random() * 100).toFixed(3),
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none p-6 sm:p-12 overflow-hidden flex flex-col justify-between">
      {/* Top HUD */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <HUDElement className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
            KERNEL_READY
          </HUDElement>
          <HUDElement className="opacity-40">PRIORITY: ARCHITECT_LEVEL_01</HUDElement>
        </div>
        
        <div className="text-right flex flex-col items-end gap-1">
          <HUDElement>SYS_TIME: {new Date().toLocaleTimeString()}</HUDElement>
          <HUDElement className="opacity-40">UPLINK: STABLE</HUDElement>
        </div>
      </div>

      {/* Decorative Brackets (Architectural) */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-24 opacity-20 hidden sm:flex">
        <div className="w-1 h-32 border-l border-[#00E5FF]" />
        <div className="w-1 h-32 border-l border-[#00E5FF]" />
      </div>

      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-24 opacity-20 hidden sm:flex">
        <div className="w-1 h-32 border-r border-[#00E5FF]" />
        <div className="w-1 h-32 border-r border-[#00E5FF]" />
      </div>

      {/* Bottom HUD */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <HUDElement>LOC: {coords.x} / {coords.y}</HUDElement>
          <HUDElement className="opacity-40 tracking-tighter">HEX: 0x{coords.x.replace('.','')}</HUDElement>
        </div>

        <div className="text-right flex flex-col items-end gap-1">
          <HUDElement className={isDecrypted ? "text-[#00E5FF]" : "text-[#A3A3A3]"}>
            STATUS: {isDecrypted ? "SYSTEM_BYPASS_COMPLETE" : "ENCRYPTED_ARCHIVE"}
          </HUDElement>
          <motion.div 
            animate={{ width: isDecrypted ? "100%" : "30%" }}
            className="h-[1px] bg-[#00E5FF]/40 w-32 origin-right"
          />
        </div>
      </div>

      {/* Subtle Scanning Line */}
      <motion.div 
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent via-[#00E5FF]/5 to-transparent opacity-20"
      />
    </div>
  );
}
