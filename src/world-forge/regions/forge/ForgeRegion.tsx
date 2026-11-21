import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { atBearing } from '../../data/worldGeography';
import Waterfall from '../../look/Waterfall';
import ForgeCore from './ForgeCore';
import HubGates from './HubGates';
import Monuments from './Monuments';
import { hubQuality, HUB, WATERFALLS } from './hubLayout';
import ProjectsTerrace from './ProjectsTerrace';
import SpireCity from './SpireCity';

interface ForgeRegionProps {
  /** False under reduced motion: no ambient motion in the hub. */
  animate: boolean;
  /** Share of the full ember count (quality tier). */
  emberShare?: number;
}

/**
 * 02 — THE WORLD FORGE: the golden spire-city hub (P3, blueprint images). It stands
 * on the hub island (the archipelago draws the island itself): the spire city on its
 * terraces, the Forge Core, the observation rings, seven gates with archive halls,
 * the Projects terrace, and waterfalls pouring off the island's edge.
 */
export default function ForgeRegion({ animate, emberShare = 1 }: ForgeRegionProps) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const quality = useMemo(() => hubQuality(width, height), [width, height]);

  return (
    <group>
      <SpireCity />
      <ForgeCore embers={Math.round(quality.embers * emberShare)} animate={animate} />
      <HubGates />
      <ProjectsTerrace />
      <Monuments animate={animate} />
      {WATERFALLS.map((w) => {
        const [x, , z] = atBearing(w.bearing, HUB.islandRadius - 6);
        return <Waterfall key={w.bearing} position={[x, -8, z]} rotationY={(w.bearing * Math.PI) / 180} width={w.width} height={w.height} animate={animate} />;
      })}
    </group>
  );
}
