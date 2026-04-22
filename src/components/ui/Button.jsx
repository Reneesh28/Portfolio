import React from "react";

export function Button({ as: Component = "button", variant = "primary", size = "md", className = "", children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 border will-change-transform font-accent";

  const variants = {
    primary: "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-transparent hover:text-[var(--text-main)] hover:border-[var(--accent)]",
    secondary: "bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-main)]",
    ghost: "bg-transparent border-transparent text-[var(--text-main)] hover:bg-[var(--bg-panel)] hover:border-[var(--border-subtle)]",
    icon: "bg-[var(--bg-panel)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-hover)]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded",
    md: "px-6 py-3 text-base rounded-md",
    lg: "px-8 py-4 text-base rounded-md",
    icon: "w-12 h-12 rounded-md"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}
