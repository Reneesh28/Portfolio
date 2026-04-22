import React from "react";

export function Badge({ children, variant = "default", className = "" }) {
  const baseStyles = "inline-flex items-center text-[10px] sm:text-xs font-accent tracking-wide px-2.5 sm:px-3 py-1 border rounded-sm transition-colors";

  const variants = {
    default: "bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--text-muted)]",
    success: "bg-[var(--bg-void)] border-emerald-800/30 text-emerald-400",
    accent: "bg-[var(--bg-void)] border-[var(--border-subtle)] text-[var(--accent)]"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
