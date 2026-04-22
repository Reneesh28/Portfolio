import React from "react";
import { motion } from "framer-motion";
import useMagnetic from "../../hooks/useMagnetic";

export function Button({ as: Component = "button", variant = "primary", size = "md", className = "", children, ...props }) {
  const { ref, x, y } = useMagnetic(0.35);

  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-300 border font-accent select-none";

  const variants = {
    primary: "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-transparent hover:text-[var(--text-main)]",
    secondary: "bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]",
    ghost: "bg-transparent border-transparent text-[var(--text-main)] hover:bg-[var(--bg-panel)]",
    icon: "bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-hover)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-sm",
    md: "px-6 py-3 text-sm rounded-sm",
    lg: "px-8 py-4 text-base rounded-sm",
    icon: "w-12 h-12 rounded-sm"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // Using motion.button if it's a button, otherwise a motion.div wrapper
  const MotionComponent = motion[Component] || motion.div;

  return (
    <MotionComponent
      ref={ref}
      style={{ x, y }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}
