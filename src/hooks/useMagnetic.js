import { useState, useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export default function useMagnetic(intensity = 0.3) {
  const ref = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      
      // Calculate if mouse is close enough
      const threshold = width * 1.5;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      
      if (distance < threshold) {
        x.set(distanceX * intensity);
        y.set(distanceY * intensity);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    ref.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ref.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return { ref, x: springX, y: springY };
}
