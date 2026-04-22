import React, { createContext, useContext, useState, useEffect } from 'react';

const NarrativeContext = createContext();

export const chapters = [
  { id: 'hero', title: 'The Awakening', index: 0 },
  { id: 'about', title: 'The Craftsman', index: 1 },
  { id: 'skills', title: 'The Armory', index: 2 },
  { id: 'experience', title: 'The Journey', index: 3 },
  { id: 'projects', title: 'The Masterpieces', index: 4 },
  { id: 'contact', title: 'The Summoning', index: 5 },
];

export function NarrativeProvider({ children }) {
  const [activeChapter, setActiveChapter] = useState(chapters[0]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Trigger when section center crosses viewport center
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chapter = chapters.find(c => c.id === entry.target.id);
          if (chapter) setActiveChapter(chapter);
        }
      });
    }, options);

    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <NarrativeContext.Provider value={{ activeChapter, chapters }}>
      {children}
    </NarrativeContext.Provider>
  );
}

export const useNarrative = () => useContext(NarrativeContext);
