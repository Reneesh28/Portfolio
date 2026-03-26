import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const baseStyles = "inline-flex items-center text-[10px] sm:text-xs font-mono tracking-wide px-2 sm:px-3 py-1 border transition-colors";
  
  const variants = {
    default: "bg-[#0A0A0A] border-white/5 text-[#A3A3A3]",
    success: "bg-[#0A0A0A] border-[#00C853]/20 text-[#00C853]",
    accent: "bg-[#0A0A0A] border-white/5 text-[#00BFA5]"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
