import React from 'react';
import { useNarrative } from '../context/NarrativeContext';
import { motion } from 'framer-motion';
import useMagnetic from '../hooks/useMagnetic';

import { useSamuraiTheme, themes } from '../context/ThemeContext';

export default function CompassNav({ onOpenMap, isOpen }) {
  const { activeChapter, chapters } = useNarrative();
  const { currentTheme, toggleTheme } = useSamuraiTheme();
  const { ref, x, y } = useMagnetic(0.4);

  const nextTheme = () => {
    const themeList = Object.values(themes);
    const currentIndex = themeList.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeList.length;
    toggleTheme(themeList[nextIndex]);
  };

  return (
    <div className="fixed top-8 right-8 z-[100] flex gap-4">
      {/* Theme Toggle (Hanko Seal) */}
      <motion.button
        whileTap={{ scale: 0.9, rotate: 90 }}
        onClick={nextTheme}
        className="w-16 h-16 bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex items-center justify-center group hover:border-[var(--accent)] transition-colors rounded-sm"
      >
        <div className="w-8 h-8 border-2 border-[var(--accent)] flex items-center justify-center font-display text-xs text-[var(--accent)] rotate-45 group-hover:rotate-0 transition-transform">
          <span className="-rotate-45 group-hover:rotate-0 transition-transform">印</span>
        </div>
      </motion.button>

      {/* Compass Menu */}
      <motion.button
        ref={ref}
        onClick={onOpenMap}
        style={{ x, y }}
        className="w-16 h-16 bg-[var(--bg-panel)] border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-1 group hover:border-[var(--border-hover)] transition-colors rounded-sm"
      >
        {/* Icon lines */}
        <div className="relative w-6 h-4 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-[1px] bg-[var(--text-muted)] group-hover:bg-[var(--accent)]"
            animate={{ x: isOpen ? 4 : 0, rotate: isOpen ? 45 : 0, y: isOpen ? 7 : 0 }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[1px] bg-[var(--text-muted)] group-hover:bg-[var(--accent)]"
            animate={{ opacity: isOpen ? 0 : 1, x: isOpen ? 20 : 0 }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--text-muted)] group-hover:bg-[var(--accent)]"
            animate={{ x: isOpen ? 4 : 0, rotate: isOpen ? -45 : 0, y: isOpen ? -7 : 0 }}
          />
        </div>

        {/* Index */}
        <span className="font-accent text-[10px] tracking-tighter text-[var(--text-muted)] group-hover:text-[var(--text-main)]">
          {String(activeChapter.index + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
        </span>
      </motion.button>
    </div>
  );
}
