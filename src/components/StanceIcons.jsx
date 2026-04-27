import React from 'react';
import { motion } from 'framer-motion';

export const StoneIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110' : 'opacity-40'}`}>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-30" />

    {/* Heavy Pulse Animation */}
    <motion.path
      d="M50 25 L75 75 L25 75 Z"
      fill="currentColor"
      animate={active ? {
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8]
      } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={active ? 'drop-shadow-[0_0_12px_rgba(197,160,89,0.6)]' : ''}
    />

    {/* Inner Core */}
    <motion.path
      d="M48 50 L52 50 L50 48 Z"
      fill="var(--charcoal-ink)"
      animate={active ? { opacity: [0.3, 1, 0.3] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

export const WaterIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110' : 'opacity-40'}`}>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-30" />

    {/* Flowing Wave Animation */}
    <motion.path
      d="M30 50 Q50 20 70 50 T30 50 T70 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      animate={active ? {
        d: [
          "M30 50 Q50 20 70 50 T30 50 T70 50",
          "M30 45 Q50 25 70 45 T30 45 T70 45",
          "M30 50 Q50 20 70 50 T30 50 T70 50"
        ]
      } : {}}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={active ? 'drop-shadow-[0_0_12px_rgba(245,245,245,0.6)]' : ''}
    />
  </svg>
);

export const WindIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110' : 'opacity-40'}`}>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-30" />

    {/* Swirling Gusts */}
    <motion.path
      d="M25 50 C25 20 75 20 75 50 S25 80 25 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      animate={active ? {
        rotate: [0, 360],
        strokeDashoffset: [0, 100]
      } : {}}
      strokeDasharray="10 20"
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className={active ? 'drop-shadow-[0_0_12px_rgba(163,163,163,0.6)]' : ''}
    />

    <motion.circle
      cx="50" cy="50" r="3"
      fill="currentColor"
      animate={active ? { scale: [1, 1.5, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);

export const MoonIcon = ({ active }) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-500 ${active ? 'scale-110' : 'opacity-40'}`}>
    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" className="opacity-30" />

    {/* Lunar Halo Rotation */}
    <motion.circle
      cx="50" cy="50" r="40"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.2"
      animate={active ? { rotate: 360 } : {}}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      strokeDasharray="1 10"
      className="opacity-50"
    />

    {/* Crescent Moon Pulse */}
    <motion.path
      d="M70 30 A40 40 0 1 0 70 70 A30 30 0 1 1 70 30"
      fill="currentColor"
      animate={active ? {
        scale: [1, 1.02, 1],
        opacity: [0.9, 1, 0.9]
      } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={active ? 'drop-shadow-[0_0_15px_rgba(139,0,0,0.8)]' : ''}
    />
  </svg>
);
