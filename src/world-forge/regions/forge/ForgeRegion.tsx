import ForgeCore from './ForgeCore';
import ForgeCrown from './ForgeCrown';
import ForgeFoundation from './ForgeFoundation';
import ForgeOrbit from './ForgeOrbit';
import ForgeTerraces from './ForgeTerraces';
import { FORGE_YAW } from './forgeLayout';

/**
 * 02 — THE WORLD FORGE centrepiece ("The Crucible of Worlds", DEC-007), built in
 * layers: Foundation, Core, Crown, Orbit, Terraces, Atmosphere. It sits at the
 * world origin in the orientation the approved opening shot sees.
 */
export default function ForgeRegion() {
  return (
    <group rotation={[0, FORGE_YAW, 0]}>
      <ForgeFoundation />
      <ForgeCore />
      <ForgeCrown />
      <ForgeOrbit />
      <ForgeTerraces />
    </group>
  );
}
