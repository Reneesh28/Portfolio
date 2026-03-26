import React from "react";

export function Button({ as: Component = "button", variant = "primary", size = "md", className = "", children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 border will-change-transform";
  
  const variants = {
    primary: "bg-[#E0E0E0] text-[#0A0A0A] border-[#E0E0E0] hover:bg-transparent hover:text-[#E0E0E0]",
    secondary: "bg-[#1A1A1A] border-white/5 text-[#A3A3A3] hover:border-white/20 hover:text-[#E0E0E0]",
    ghost: "bg-transparent border-transparent text-[#E0E0E0] hover:bg-[#1A1A1A] hover:border-white/5",
    icon: "bg-[#1A1A1A] border-white/5 text-[#A3A3A3] hover:text-[#E0E0E0] hover:bg-[#2A2A2A] hover:border-white/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-base",
    icon: "w-12 h-12"
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
}
