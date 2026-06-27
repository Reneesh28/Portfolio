import React from 'react';

const ComicPanel = ({ children, className = '', rotation = '0deg', theme = 'dark', onClick }) => {
  const baseClasses = "relative overflow-hidden rough-border";
  const themeClasses = theme === 'dark' 
    ? "bg-[var(--color-panel-dark)] text-text-on-dark border-ink-black"
    : "bg-paper text-text-on-paper border-ink-black";
    
  return (
    <div 
      className={`${baseClasses} ${themeClasses} ${className}`}
      style={{ transform: `rotate(${rotation})` }}
      onClick={onClick}
    >
      {theme === 'dark' && <div className="absolute inset-0 bg-halftone-dark opacity-10 pointer-events-none"></div>}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default ComicPanel;
