import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function SamuraiCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [slashes, setSlashes] = useState([]);

  // Smooth mouse movement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovering over interactive elements
      const target = e.target;
      const isInteractive = target.closest('button, a, input, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      // Add a slash at the current position
      const newSlash = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        angle: (Math.random() - 0.5) * 45 // Random slight angle
      };
      setSlashes(prev => [...prev, newSlash]);
      
      // Cleanup slash after animation
      setTimeout(() => {
        setSlashes(prev => prev.filter(s => s.id !== newSlash.id));
      }, 400);
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* KATANA SLASH EFFECT */}
      <AnimatePresence>
        {slashes.map(slash => (
          <motion.div
            key={slash.id}
            initial={{ scaleX: 0, opacity: 1, x: slash.x - 150, y: slash.y }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="absolute h-[1px] w-[300px] bg-white z-10 origin-center"
            style={{ 
              rotate: slash.angle,
              boxShadow: '0 0 10px rgba(255,255,255,0.8)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* THE CURSOR */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 60 : 2,
          height: isHovering ? 60 : 40,
          borderRadius: isHovering ? '50%' : '1px',
          backgroundColor: isHovering ? 'transparent' : 'var(--accent)',
          border: isHovering ? '1px solid var(--accent)' : 'none',
          boxShadow: isHovering ? '0 0 20px rgba(194,65,12,0.2)' : 'none'
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        {/* Ink Wash Center (only when hovering) */}
        {isHovering && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            className="absolute inset-0 bg-[var(--accent)] rounded-full blur-md"
          />
        )}
      </motion.div>
    </div>
  );
}
