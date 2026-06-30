import React from 'react';

/**
 * ComicPanel — Multiverse Fusion Edition
 * Every panel across the site now carries the FULL fused frame treatment
 * by default: a hand-drawn jagged border (core Spider-Verse), a graffiti
 * spray-speckle edge (Miles/Brooklyn), a fusion halftone fill (saffron +
 * Miles-red dots), a rangoli corner mark (Pavitr/Mumbattan), and a diagonal
 * suit-block sash accent — so the identity reads consistently on every
 * card, not just the Hero.
 *
 * Pass `motifs={false}` to opt a panel out of the corner/sash decoration
 * (useful for very small or dense panels where it'd be visual noise) while
 * keeping the jagged/spray/halftone base.
 */
const ComicPanel = ({
  children,
  className = '',
  rotation = '0deg',
  theme = 'dark',
  onClick,
  motifs = true,
}) => {
  const baseClasses = "relative overflow-hidden jagged-panel spray-edge";
  const themeClasses = theme === 'dark'
    ? "bg-[var(--color-panel-dark)] text-text-on-dark border-ink-black"
    : "bg-paper text-text-on-paper border-ink-black";

  return (
    <div
      className={`${baseClasses} ${themeClasses} ${className}`}
      style={{ transform: `rotate(${rotation})` }}
      onClick={onClick}
    >
      <div className={`absolute inset-0 pointer-events-none ${theme === 'dark' ? 'bg-halftone-fusion opacity-[0.08]' : 'bg-halftone-fusion opacity-[0.12]'}`}></div>

      {motifs && (
        <>
          <div className="rangoli-corner top-2 left-2 scale-50 origin-top-left opacity-70"></div>
          <div className="suit-block-sash opacity-30"></div>
        </>
      )}

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default ComicPanel;