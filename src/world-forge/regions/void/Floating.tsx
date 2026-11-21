import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';

interface FloatingProps {
  position: [number, number, number];
  amplitude?: number;
  speed?: number;
  phase?: number;
  /** When false (reduced motion), the object stays at its resting position. */
  animate: boolean;
  children: ReactNode;
}

/** Slow vertical drift, applied imperatively through a ref (no React re-renders). */
export default function Floating({ position, amplitude = 0.18, speed = 0.35, phase = 0, animate, children }: FloatingProps) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = ref.current;
    if (!animate || !group) return;
    group.position.y = position[1] + Math.sin(clock.elapsedTime * speed + phase) * amplitude;
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
}
