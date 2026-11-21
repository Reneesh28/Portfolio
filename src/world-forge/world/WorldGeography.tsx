import CentralLandmass from './CentralLandmass';
import FloatingTerritories from './FloatingTerritories';
import RegionBlockouts from './RegionBlockouts';
import WorldPaths from './WorldPaths';

/**
 * The fixed world (M3 blockout). The Forge itself (M4) is `regions/forge/ForgeRegion`,
 * mounted at the origin by the scene; the Void rig attaches to it from the south. See data/worldGeography.ts for the layout.
 */
export default function WorldGeography() {
  return (
    <group>
      <CentralLandmass />
      <RegionBlockouts />
      <WorldPaths />
      <FloatingTerritories />
    </group>
  );
}
