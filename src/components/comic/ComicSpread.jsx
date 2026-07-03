import React, { forwardRef } from 'react';

/**
 * ComicSpread — Fusion Edition
 * Every section now gets:
 *  - Diagonal web-line motion streaks (Miles/Brooklyn)
 *  - A dimension-membrane tear seam at the top edge (Spider-Verse dimension boundary)
 */
const ComicSpread = forwardRef(({ children, id, className = '', ...props }, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={`relative w-full min-h-screen flex flex-col py-24 px-4 md:px-12 lg:px-24 overflow-hidden ${className}`}
      {...props}
    >
      {/* Miles Morales — diagonal web-motion streaks */}
      <div className="web-lines pointer-events-none" aria-hidden="true" />
      {/* Spider-Verse — dimension membrane bleed seam at section boundary */}
      <div
        className="bleed-seam absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: '3px', opacity: 0.45 }}
        aria-hidden="true"
      />
      {children}
    </section>
  );
});

ComicSpread.displayName = 'ComicSpread';
export default ComicSpread;