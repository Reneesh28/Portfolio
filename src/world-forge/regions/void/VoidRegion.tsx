import { useMemo } from 'react';
import { computeVoidPlacement, GATE_Z, type VoidLayout } from './layout';
import VoidEnvironment from './VoidEnvironment';
import VoidGateway from './VoidGateway';

interface VoidRegionProps {
  layout: VoidLayout;
  animate: boolean;
}

/**
 * 00 — THE VOID rig. Everything inside keeps the approved M2 composition in the
 * Void's local frame; the outer transform attaches that frame to the fixed world
 * (local Forge point → world origin, gateway due south).
 * The opening camera lives in the camera registry (`computeVoidPose`), which
 * reproduces this rig's approved camera in world space; `CameraRig` owns it.
 */
export default function VoidRegion({ layout, animate }: VoidRegionProps) {
  const placement = useMemo(() => computeVoidPlacement(layout), [layout]);
  const [fx, , fz] = placement.forgeLocal;

  return (
    <group rotation={[0, placement.yaw, 0]}>
      <group position={[-fx, 0, -fz]}>
        <VoidEnvironment layout={layout} animate={animate} />
        <VoidGateway position={[layout.gateX, 0, GATE_Z]} animate={animate} />
      </group>
    </group>
  );
}
