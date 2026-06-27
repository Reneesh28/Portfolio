import React from 'react';

const InkButton = ({ children, onClick, disabled, className = '', type = 'button', variant = 'cyan' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'magenta': return "bg-dimension-magenta text-ink-black hover:print-offset-magenta";
      case 'yellow': return "bg-comic-yellow text-ink-black hover:print-offset-both";
      case 'cyan':
      default: return "bg-portal-cyan text-ink-black hover:print-offset-cyan";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`font-label uppercase font-bold tracking-wider px-6 py-3 border-4 border-ink-black transition-transform active:scale-95 comic-focus disabled:opacity-50 disabled:cursor-not-allowed ${getVariantStyles()} ${className}`}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {children}
    </button>
  );
};

export default InkButton;
