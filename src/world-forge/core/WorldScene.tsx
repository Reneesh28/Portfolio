import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { computeVoidLayout, REFERENCE_YAW } from '../regions/void/layout';
import { PALETTE } from '../regions/void/materials';
import VoidRegion from '../regions/void/VoidRegion';
import WorldGeography from '../world/WorldGeography';
import ForgeRegion from '../regions/forge/ForgeRegion';
import DevRenderStats from './DevRenderStats';
import CameraRig from '../camera/CameraRig';
import type { ExperienceStore } from '../experience/experienceStore';
import { ExperienceContext } from '../experience/ExperienceContext';

interface WorldSceneProps {
  animate: boolean;
  store: ExperienceStore;
}

/** The shared world scene: fixed world geography, the Void opening rig and the journey camera. */
export default function WorldScene({ animate, store }: WorldSceneProps) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const layout = useMemo(() => computeVoidLayout(width, height), [width, height]);

  return (
    <ExperienceContext value={store}>
      <color attach="background" args={[PALETTE.sky]} />
      <fog attach="fog" args={[PALETTE.fog, 25, 300]} />

      <hemisphereLight args={[PALETTE.skyLight, PALETTE.groundLight, 0.9]} />
      {/* Directional lights are expressed in the approved reference frame. */}
      <group rotation={[0, REFERENCE_YAW, 0]}>
        {/* Cold key light from behind and above: rims the gateway against the horizon. */}
        <directionalLight position={[-40, 50, -80]} intensity={2.4} color={PALETTE.moon} />
        {/* Cool fill from the viewer's upper left so front faces read as stone, not void. */}
        <directionalLight position={[-18, 14, 30]} intensity={0.9} color={PALETTE.fill} />
      </group>

      <WorldGeography />
      <ForgeRegion animate={animate} />
      <VoidRegion layout={layout} animate={animate} />
      <CameraRig />
      {import.meta.env.DEV && <DevRenderStats />}
    </ExperienceContext>
  );
}
