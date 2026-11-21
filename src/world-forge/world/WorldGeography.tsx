import { REFERENCE_YAW } from '../regions/void/layout';
import DistantForge from '../regions/void/DistantForge';
import CentralLandmass from './CentralLandmass';
import FloatingTerritories from './FloatingTerritories';
import RegionBlockouts from './RegionBlockouts';
import WorldPaths from './WorldPaths';

/**
 * The fixed world (M3 blockout). Forge at the origin; the Void rig attaches to
 * it from the south. See data/worldGeography.ts for the layout.
 */
export default function WorldGeography() {
  return (
    <group>
      <CentralLandmass />
      {/* 02 — the Forge placeholder (detailed construction is M4). Oriented in the
          reference frame so the approved opening shot sees it unchanged. */}
      <DistantForge position={[0, 0, 0]} rotationY={REFERENCE_YAW} />
      <RegionBlockouts />
      <WorldPaths />
      <FloatingTerritories />
    </group>
  );
}
