import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import WorldErrorBoundary from './WorldErrorBoundary';
import WorldScene from './WorldScene';
import { isWebGLAvailable } from './webgl';
import type { ExperienceStore } from '../experience/experienceStore';

interface WorldCanvasProps {
  reducedMotion: boolean;
  store: ExperienceStore;
}

/**
 * The single World Forge WebGL canvas. Decorative: all content lives in the DOM.
 * Without WebGL (or if the scene throws), nothing renders here and the DOM hero
 * plus the Classic link remain fully usable.
 */
export default function WorldCanvas({ reducedMotion, store }: WorldCanvasProps) {
  const [webgl] = useState(isWebGLAvailable);
  if (!webgl) return null;

  return (
    <div className="wf-canvas" aria-hidden="true">
      <WorldErrorBoundary>
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'low-power' }}
          // Reduced motion: render on demand only — a still image except while the journey moves.
          frameloop={reducedMotion ? 'demand' : 'always'}
        >
          <WorldScene animate={!reducedMotion} store={store} />
        </Canvas>
      </WorldErrorBoundary>
    </div>
  );
}
