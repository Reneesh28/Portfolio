import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNarrative } from '../context/NarrativeContext';

const kanjiMap = {
  hero: '始',
  about: '自',
  skills: '技',
  experience: '歴',
  projects: '作',
  contact: '呼'
};

export default function JourneyMap({ isOpen, onClose }) {
  const { chapters, activeChapter } = useNarrative();

  const handleJump = (id) => {
    const el = document.getElementById(id);
    if (el) {
      onClose();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-6 md:p-12"
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-[#0C0A09]/90 backdrop-blur-md" onClick={onClose} />

          {/* Map Scroll Container */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[var(--bg-panel)] border border-[var(--border-subtle)] overflow-hidden washi-texture rounded-sm"
          >
            <div className="p-12 md:p-20 flex flex-col items-center">
              <h2 className="font-display text-4xl md:text-6xl mb-16 tracking-widest text-[var(--text-main)]">
                JOURNEY MAP
              </h2>

              <div className="relative w-full flex flex-col gap-12">
                {/* Connection Line */}
                <div className="absolute left-[31px] top-4 bottom-4 w-px bg-[var(--border-subtle)] z-0" />

                {chapters.map((chapter) => (
                  <motion.button
                    key={chapter.id}
                    onClick={() => handleJump(chapter.id)}
                    whileHover={{ x: 10 }}
                    className="relative z-10 flex items-center gap-8 group text-left"
                  >
                    {/* Kanji Node */}
                    <div 
                      className="w-16 h-16 flex items-center justify-center border transition-all duration-500 rounded-sm"
                      style={{ 
                        backgroundColor: activeChapter.id === chapter.id ? 'var(--accent)' : 'var(--bg-void)',
                        borderColor: activeChapter.id === chapter.id ? 'var(--accent)' : 'var(--border-subtle)',
                        boxShadow: activeChapter.id === chapter.id ? '0 0 20px rgba(194,65,12,0.3)' : 'none'
                      }}
                    >
                      <span className={`font-display text-2xl ${activeChapter.id === chapter.id ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                        {kanjiMap[chapter.id]}
                      </span>
                    </div>

                    {/* Chapter Title */}
                    <div className="flex flex-col">
                      <span className="font-accent text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-1">
                        Chapter {chapter.index}
                      </span>
                      <span className={`font-display text-2xl md:text-4xl transition-colors ${activeChapter.id === chapter.id ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'}`}>
                        {chapter.title}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Close prompt */}
              <button 
                onClick={onClose}
                className="mt-20 font-accent text-xs tracking-[0.4em] uppercase text-[var(--text-ink)] hover:text-[var(--accent)] transition-colors"
              >
                [ Close Scroll ]
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
