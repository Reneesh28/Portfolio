import React from 'react';

/**
 * InkButton — Fusion Edition
 * Added saffron + red variants for Pavitr/Miles palette,
 * and fusion two-tone box-shadow on hover instead of text-offset.
 * Spray-edge speckle gives every button a graffiti edge texture.
 */
const InkButton = ({
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
  variant = 'cyan',
}) => {
  const variants = {
    cyan: 'bg-[var(--color-portal-cyan)] text-[var(--color-ink-black)] hover:shadow-[4px_4px_0_var(--color-dimension-magenta),-3px_-3px_0_var(--color-saffron)]',
    magenta: 'bg-[var(--color-dimension-magenta)] text-[var(--color-ink-black)] hover:shadow-[4px_4px_0_var(--color-portal-cyan),-3px_-3px_0_var(--color-miles-red)]',
    yellow: 'bg-[var(--color-comic-yellow)] text-[var(--color-ink-black)] hover:shadow-[4px_4px_0_var(--color-saffron),-3px_-3px_0_var(--color-dimension-magenta)]',
    saffron: 'bg-[var(--color-saffron)] text-[var(--color-ink-black)] hover:shadow-[4px_4px_0_var(--color-marigold),-3px_-3px_0_var(--color-miles-red)]',
    red: 'bg-[var(--color-miles-red)] text-white hover:shadow-[4px_4px_0_var(--color-saffron),-3px_-3px_0_var(--color-portal-cyan)]',
    white: 'bg-white text-[var(--color-ink-black)] hover:shadow-[4px_4px_0_var(--color-portal-cyan),-3px_-3px_0_var(--color-dimension-magenta)]',
  };

  const style = variants[variant] ?? variants.cyan;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-label uppercase font-bold tracking-wider px-6 py-3
        border-4 border-[var(--color-ink-black)]
        transition-all duration-150
        active:scale-95 active:translate-y-[2px]
        comic-focus
        disabled:opacity-50 disabled:cursor-not-allowed
        ${style} ${className}
      `}
      style={{ minHeight: '44px', minWidth: '44px' }}
    >
      {/* Spray-edge speckle — Miles graffiti energy on every button */}
      <span
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.12] rounded-[inherit]"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1.5px)',
          backgroundSize: '8px 8px',
          mixBlendMode: 'multiply',
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default InkButton;