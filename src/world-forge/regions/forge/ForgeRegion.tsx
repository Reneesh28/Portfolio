import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import ForgeAtmosphere from './ForgeAtmosphere';
import ForgeCore from './ForgeCore';
import ForgeCrown from './ForgeCrown';
import ForgeFoundation from './ForgeFoundation';
import ForgeOrbit from './ForgeOrbit';
import ForgeTerraces from './ForgeTerraces';
import { FORGE_YAW, forgeQuality } from './forgeLayout';

interface ForgeRegionProps {
  /** False under reduced motion: no ambient motion in the centrepiece. */
  animate: boolean;
}

/**
 * 02 — THE WORLD FORGE centrepiece ("The Crucible of Worlds", DEC-007), built in
 * layers: Foundation, Core, Crown, Orbit, Terraces, Atmosphere. It sits at the
 * world origin in the orientation the approved opening shot sees.
 */
export default function ForgeRegion({ animate }: ForgeRegionProps) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const quality = useMemo(() => forgeQuality(width, height), [width, height]);

  return (
    <group rotation={[0, FORGE_YAW, 0]}>
      <ForgeFoundation />
      <ForgeCore />
      <ForgeCrown />
      <ForgeOrbit fragments={quality.fragments} animate={animate} />
      <ForgeTerraces />
      <ForgeAtmosphere embers={quality.embers} animate={animate} />
    </group>
  );
}
