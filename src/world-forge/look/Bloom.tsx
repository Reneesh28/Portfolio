import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface BloomProps {
  strength?: number;
  radius?: number;
  threshold?: number;
}

/**
 * Glow for the blueprint look (gold, portal violet, beams), using three.js's own
 * post-processing passes (part of the installed `three` package, no new dependency).
 * Takes over rendering (frame priority 1), so it must be the only renderer in the scene.
 */
export default function Bloom({ strength = 0.85, radius = 0.55, threshold = 0.82 }: BloomProps) {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    // Real size is applied in the effect below, so a resize never rebuilds the composer.
    c.addPass(new UnrealBloomPass(new Vector2(1, 1), strength, radius, threshold));
    c.addPass(new OutputPass());
    return c;
  }, [gl, scene, camera, strength, radius, threshold]);

  useEffect(() => {
    composer.setPixelRatio(gl.getPixelRatio());
    composer.setSize(size.width, size.height);
  }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);

  useFrame((_, delta) => composer.render(delta), 1);
  return null;
}
