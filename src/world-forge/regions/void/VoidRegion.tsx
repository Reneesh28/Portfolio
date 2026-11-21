import { useMemo } from 'react';
import { computeVoidPlacement, GATE_Z, type VoidLayout } from './layout';
import Portal from './Portal';
import VoidEnvironment from './VoidEnvironment';

interface VoidRegionProps {
  layout: VoidLayout;
  animate: boolean;
}

/**
 * 00 — THE VOID rig (P4 portal realm, DEC-019). Everything inside is composed in
 * the Void's local frame; the outer transform attaches that frame to the fixed world
 * (local Forge point → world origin, Void due south), so the golden Forge is always
 * framed inside the portal. The opening camera lives in the camera registry
 * (`computeVoidPose`); `CameraRig` owns it.
 */
export default function VoidRegion({ layout, animate }: VoidRegionProps) {
  const placement = useMemo(() => computeVoidPlacement(layout), [layout]);
  const [fx, , fz] = placement.forgeLocal;

  return (
    <group rotation={[0, placement.yaw, 0]}>
      <group position={[-fx, 0, -fz]}>
        <VoidEnvironment layout={layout} animate={animate} />
        <Portal position={[layout.gateX, 0, GATE_Z]} animate={animate} />
      </group>
    </group>
  );
}
