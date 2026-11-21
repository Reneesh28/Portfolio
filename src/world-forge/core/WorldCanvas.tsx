import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import WorldErrorBoundary from './WorldErrorBoundary';
import WorldScene from './WorldScene';
import QualityGovernor from './QualityGovernor';
import { forcedTier, initialTier, PRESETS, readDeviceHints, stepDown, type QualityTier } from './quality';
import { isWebGLAvailable } from './webgl';
import type { ExperienceStore } from '../experience/experienceStore';

interface WorldCanvasProps {
  reducedMotion: boolean;
  store: ExperienceStore;
}

/**
 * The single World Forge WebGL canvas. Decorative: all content lives in the DOM.
 * Without WebGL (or if the scene throws), nothing renders here and the DOM hero
 * plus the Classic link remain fully usable. The quality tier starts from device
 * hints (or `?quality=`) and steps down automatically if frames are too slow.
 */
export default function WorldCanvas({ reducedMotion, store }: WorldCanvasProps) {
  const [webgl] = useState(isWebGLAvailable);
  const [locked] = useState(() => forcedTier(window.location.search));
  const [tier, setTier] = useState<QualityTier>(() => locked ?? initialTier(readDeviceHints()));
  if (!webgl) return null;
  const preset = PRESETS[tier];

  return (
    <div className="wf-canvas" aria-hidden="true" data-quality={tier}>
      <WorldErrorBoundary>
        <Canvas
          dpr={preset.dpr}
          gl={{ antialias: tier !== 'low', powerPreference: 'low-power' }}
          // Reduced motion: render on demand only — a still image except while the journey moves.
          frameloop={reducedMotion ? 'demand' : 'always'}
          // The Blueprint Archive (M6.2) reveals a structure from its base up with a per-material clipping plane.
          onCreated={({ gl }) => {
            gl.localClippingEnabled = true;
          }}
        >
          <WorldScene animate={!reducedMotion} store={store} quality={preset} />
          <QualityGovernor active={!locked && !reducedMotion && tier !== 'low'} onStepDown={() => setTier(stepDown)} />
        </Canvas>
      </WorldErrorBoundary>
    </div>
  );
}
