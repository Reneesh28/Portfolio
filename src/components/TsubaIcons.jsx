import React from 'react';

export const AI_Tsuba = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#C5A059]">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
    <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    <path d="M30 30 L70 70 M70 30 L30 70" stroke="currentColor" strokeWidth="2" />
    <rect x="45" y="5" width="10" height="90" fill="var(--charcoal-ink)" />
  </svg>
);

export const Web_Tsuba = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#F5F5F5]">
    <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="1" />
    <circle cx="50" cy="50" r="15" fill="var(--charcoal-ink)" stroke="currentColor" strokeWidth="2" />
    <rect x="42" y="42" width="16" height="16" fill="currentColor" />
  </svg>
);

export const Battle_Tsuba = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#8B0000]">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
    <path d="M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <circle cx="50" cy="50" r="20" fill="var(--charcoal-ink)" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const Neural_Tsuba = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#A3A3A3]">
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
    <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="50" cy="50" r="5" fill="currentColor" />
    <path d="M50 5 L50 25 M50 75 L50 95 M5 50 L25 50 M75 50 L95 50" stroke="currentColor" strokeWidth="2" />
  </svg>
);
