import Archipelago from './Archipelago';

/**
 * The fixed world (P2 archipelago, DEC-010). The Forge itself is
 * `regions/forge/ForgeRegion`, mounted at the hub by the scene; the Void rig stands
 * on the Void island to the south. See data/worldGeography.ts for the layout.
 */
export default function WorldGeography() {
  return <Archipelago />;
}
