import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from '../core/useReducedMotion';
import LookDevScene, { LOOKDEV_VIEWS } from './LookDevScene';

interface LookDevProps {
  initialView: number;
}

/**
 * Development-only P1 look-development page (`/?lookdev` or `/?lookdev=2`).
 * It shows the blueprint look for review before any phase rebuilds the real world.
 * Not part of production builds.
 */
export default function LookDev({ initialView }: LookDevProps) {
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState(Math.min(LOOKDEV_VIEWS.length - 1, Math.max(0, initialView)));
  const [bloom, setBloom] = useState(true);

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#07061a' }}>
      <Canvas dpr={[1, 1.75]} gl={{ antialias: true }} camera={{ near: 0.5, far: 9000, fov: 45 }} frameloop={reducedMotion ? 'demand' : 'always'}>
        <LookDevScene view={view} animate={!reducedMotion} bloom={bloom} />
      </Canvas>
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          font: '12px system-ui, sans-serif',
          color: '#e9e3ff',
          background: 'rgba(12,8,30,0.7)',
          padding: '8px 10px',
          borderRadius: 8,
        }}
      >
        <strong style={{ letterSpacing: '0.08em' }}>P1 LOOK DEV</strong>
        {LOOKDEV_VIEWS.map((v, i) => (
          <button key={v.name} type="button" onClick={() => setView(i)} aria-pressed={view === i} style={{ padding: '4px 8px', fontWeight: view === i ? 700 : 400 }}>
            {i + 1}. {v.name}
          </button>
        ))}
        <button type="button" onClick={() => setBloom((b) => !b)} aria-pressed={bloom} style={{ padding: '4px 8px' }}>
          Glow {bloom ? 'on' : 'off'}
        </button>
      </div>
    </main>
  );
}
