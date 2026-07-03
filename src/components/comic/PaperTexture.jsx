import React from 'react';

/**
 * PaperTexture — Fusion Edition
 * Dark theme adds a subtle web-lines overlay + rangoli corner dots
 * so even the global grain layer carries the fused identity.
 */
const PaperTexture = ({ theme = 'light' }) => {
  const grainClass = theme === 'dark' ? 'paper-grain-dark' : 'paper-grain';

  return (
    <>
      {/* Base grain */}
      <div className={`fixed inset-0 pointer-events-none z-50 ${grainClass}`} aria-hidden="true" />
      {/* Dark theme: subtle web-line motion streaks sitewide */}
      {theme === 'dark' && (
        <div
          className="fixed inset-0 pointer-events-none z-40 web-lines"
          style={{ opacity: 0.04 }}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default PaperTexture;