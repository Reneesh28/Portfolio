import Floating from './Floating';
import { darkStoneMaterial, emberMaterial, PALETTE, stoneMaterial, unitBox, unitShard } from './materials';

interface VoidGatewayProps {
  position: [number, number, number];
  animate: boolean;
}

const PILLAR_X = 2.9;
const PILLAR_HEIGHT = 8.2;
const BASE_TOP = 0.9;

/**
 * The threshold into the World Forge: two leaning monoliths on a stepped plinth,
 * a split lintel, and a thin amber seam of light running through the opening.
 */
export default function VoidGateway({ position, animate }: VoidGatewayProps) {
  const pillarY = BASE_TOP + PILLAR_HEIGHT / 2;
  const lintelY = BASE_TOP + PILLAR_HEIGHT + 0.6;

  return (
    <group position={position}>
      {/* Stepped plinth */}
      <mesh geometry={unitBox} material={darkStoneMaterial} position={[0, 0.15, 0]} scale={[12, 0.3, 5.2]} />
      <mesh geometry={unitBox} material={darkStoneMaterial} position={[0, 0.45, 0]} scale={[10, 0.3, 4.3]} />
      <mesh geometry={unitBox} material={stoneMaterial} position={[0, 0.75, 0]} scale={[8.4, 0.3, 3.5]} />

      {/* Monoliths, leaning very slightly inward */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * PILLAR_X, pillarY, 0]} rotation={[0, 0, side * -0.022]}>
          <mesh geometry={unitBox} material={stoneMaterial} scale={[1.5, PILLAR_HEIGHT, 1.9]} />
          {/* Capital */}
          <mesh geometry={unitBox} material={darkStoneMaterial} position={[0, PILLAR_HEIGHT / 2 - 0.25, 0]} scale={[1.85, 0.5, 2.2]} />
          {/* Inner seam of light */}
          <mesh geometry={unitBox} material={emberMaterial} position={[side * -0.76, -0.4, 0]} scale={[0.05, 6.4, 0.32]} />
        </group>
      ))}

      {/* Split lintel with a light seam at the break */}
      <mesh geometry={unitBox} material={stoneMaterial} position={[-2.2, lintelY, 0]} scale={[4.3, 1.2, 2.3]} />
      <mesh geometry={unitBox} material={stoneMaterial} position={[2.2, lintelY, 0]} scale={[4.3, 1.2, 2.3]} />
      <mesh geometry={unitBox} material={emberMaterial} position={[0, lintelY, 0]} scale={[0.08, 1.05, 0.5]} />

      {/* Floating keystone and fragments above the break */}
      <Floating position={[0, lintelY + 1.7, 0]} amplitude={0.12} speed={0.4} animate={animate}>
        <mesh geometry={unitBox} material={stoneMaterial} rotation={[0, 0.3, Math.PI / 4]} scale={0.75} />
      </Floating>
      <Floating position={[-0.9, lintelY + 2.7, 0.3]} amplitude={0.16} speed={0.33} phase={1.7} animate={animate}>
        <mesh geometry={unitShard} material={darkStoneMaterial} scale={0.22} />
      </Floating>
      <Floating position={[1.1, lintelY + 2.3, -0.2]} amplitude={0.14} speed={0.37} phase={3.1} animate={animate}>
        <mesh geometry={unitShard} material={darkStoneMaterial} scale={0.16} />
      </Floating>

      {/* Warm spill from the seams onto the plinth and inner faces */}
      <pointLight position={[0, 4.5, 1.2]} color={PALETTE.ember} intensity={6} distance={13} decay={2} />
    </group>
  );
}
