import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { computeVoidLayout, REFERENCE_YAW } from '../regions/void/layout';
import VoidRegion from '../regions/void/VoidRegion';
import WorldGeography from '../world/WorldGeography';
import ForgeRegion from '../regions/forge/ForgeRegion';
import DevRenderStats from './DevRenderStats';
import BlueprintSky from '../look/BlueprintSky';
import Bloom from '../look/Bloom';
import CloudSea from '../look/CloudSea';
import { BLUEPRINT } from '../look/palette';
import CameraRig from '../camera/CameraRig';
import type { ExperienceStore } from '../experience/experienceStore';
import type { QualityPreset } from './quality';
import { ExperienceContext } from '../experience/ExperienceContext';

/** Violet haze: light near islands, deep over the far ranges and the open archipelago. */
const WORLD_FOG_DENSITY = 0.0006;

interface WorldSceneProps {
  animate: boolean;
  store: ExperienceStore;
  quality: QualityPreset;
}

/** The shared world scene: blueprint atmosphere, the archipelago, the Forge, the Void rig and the journey camera. */
export default function WorldScene({ animate, store, quality }: WorldSceneProps) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const layout = useMemo(() => computeVoidLayout(width, height), [width, height]);

  return (
    <ExperienceContext value={store}>
      {/* Blueprint atmosphere (P1 look, DEC-010): violet sky, cloud sea, violet haze. */}
      <color attach="background" args={[BLUEPRINT.sky.zenith]} />
      <fogExp2 attach="fog" args={[BLUEPRINT.fog, WORLD_FOG_DENSITY]} />
      <BlueprintSky glowDirection={[-0.999, -0.04]} />
      <CloudSea animate={animate} layers={quality.cloudLayers} />

      {/* Sky light above, violet bounce from the cloud sea below. */}
      <hemisphereLight args={['#6a55c8', '#4a3290', 0.85]} />
      {/* Directional lights stay in the opening's reference frame (the Void rig is still M2's until P4). */}
      <group rotation={[0, REFERENCE_YAW, 0]}>
        {/* Moonlight from behind and above: rims silhouettes against the sky. */}
        <directionalLight position={[-40, 50, -80]} intensity={2.2} color={BLUEPRINT.moon} />
        {/* Soft violet fill from the viewer's side. */}
        <directionalLight position={[-18, 14, 30]} intensity={0.6} color="#7d6bd8" />
      </group>

      <WorldGeography />
      <ForgeRegion animate={animate} emberShare={quality.embers} />
      <VoidRegion layout={layout} animate={animate} />
      <CameraRig />
      {import.meta.env.DEV && <DevRenderStats />}
      {quality.bloom && <Bloom />}
    </ExperienceContext>
  );
}
