import React from 'react';
import { useNarrative } from '../context/NarrativeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChapterMarkers() {
  const { activeChapter, chapters } = useNarrative();

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-12 pointer-events-none">
      {/* Chapter Vertical Label */}
      <div className="relative h-48 w-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapter.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute font-display text-[10px] uppercase tracking-[0.4em] whitespace-nowrap"
            style={{ 
              writingMode: 'vertical-rl', 
              color: 'var(--accent)',
              textOrientation: 'mixed'
            }}
          >
            Chapter {activeChapter.index}: {activeChapter.title}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Line */}
      <div className="w-[1px] h-32 bg-[var(--border-subtle)] relative">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-[var(--accent)]"
          animate={{ height: `${(activeChapter.index / (chapters.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Dot Indicators */}
      <div className="flex flex-col gap-4">
        {chapters.map((chapter) => (
          <div 
            key={chapter.id}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{ 
              backgroundColor: activeChapter.id === chapter.id ? 'var(--accent)' : 'var(--border-subtle)',
              boxShadow: activeChapter.id === chapter.id ? '0 0 8px var(--accent)' : 'none',
              transform: activeChapter.id === chapter.id ? 'scale(1.5)' : 'scale(1)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
