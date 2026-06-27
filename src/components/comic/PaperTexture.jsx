import React from 'react';

const PaperTexture = ({ theme = 'light' }) => {
  const grainClass = theme === 'dark' ? 'paper-grain-dark' : 'paper-grain';
  
  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${grainClass}`} aria-hidden="true" />
  );
};

export default PaperTexture;
