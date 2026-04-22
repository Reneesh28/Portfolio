import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNarrative } from './NarrativeContext';

const ThemeContext = createContext();

export const themes = {
  DAY: 'day',
  NIGHT: 'night',
  WAR: 'war',
  ZEN: 'zen'
};

export function ThemeProvider({ children }) {
  const { activeChapter } = useNarrative();
  const [currentTheme, setCurrentTheme] = useState(themes.NIGHT);
  const [isManual, setIsManual] = useState(false);

  // Sync theme with active chapter
  useEffect(() => {
    if (isManual) return;

    const index = activeChapter?.index || 0;

    if (index <= 1) {
      setCurrentTheme(themes.DAY);
    } else if (index <= 3) {
      setCurrentTheme(themes.NIGHT);
    } else if (index === 4) {
      setCurrentTheme(themes.WAR);
    } else {
      setCurrentTheme(themes.ZEN);
    }
  }, [activeChapter, isManual]);

  // Update data-theme attribute on body
  useEffect(() => {
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = (theme) => {
    setCurrentTheme(theme);
    setIsManual(true);
  };

  const resetToAuto = () => setIsManual(false);

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, resetToAuto, isManual, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useSamuraiTheme = () => useContext(ThemeContext);
