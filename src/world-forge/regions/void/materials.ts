import {
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DodecahedronGeometry,
  IcosahedronGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
} from 'three';

/** THE VOID palette: charcoal, slate, cold blue light, restrained amber. */
export const PALETTE = {
  sky: '#05070b',
  fog: '#0b1017',
  skyLight: '#7f93ad',
  groundLight: '#07090c',
  moon: '#c9d8ec',
  fill: '#5d7290',
  ember: '#ffb15c',
  dust: '#c4d2e4',
} as const;

// Shared materials — one instance each, reused by every mesh in the region.
export const stoneMaterial = new MeshStandardMaterial({
  color: '#5a626e',
  roughness: 0.92,
  metalness: 0.06,
  flatShading: true,
});

export const darkStoneMaterial = new MeshStandardMaterial({
  color: '#3c434e',
  roughness: 0.96,
  metalness: 0.04,
  flatShading: true,
});

export const groundMaterial = new MeshStandardMaterial({
  color: '#262b33',
  roughness: 1,
  metalness: 0,
});

/** Amber light seams — unlit, kept out of tone mapping so they read as light sources. */
export const emberMaterial = new MeshBasicMaterial({
  color: new Color(PALETTE.ember).multiplyScalar(1.5),
  toneMapped: false,
});

/** The Forge core is distant: exempt from fog so it reads as a light source through the haze. */
export const forgeCoreMaterial = new MeshBasicMaterial({
  color: new Color('#ffc07a').multiplyScalar(1.9),
  toneMapped: false,
  fog: false,
});

export const forgeBeamMaterial = new MeshBasicMaterial({
  color: '#ffcf96',
  transparent: true,
  opacity: 0.06,
  blending: AdditiveBlending,
  depthWrite: false,
  toneMapped: false,
  fog: false,
});

// Shared unit geometries, sized per mesh with `scale`.
export const unitBox = new BoxGeometry(1, 1, 1);
export const unitRock = new DodecahedronGeometry(1, 0);
export const unitShard = new IcosahedronGeometry(1, 0);
/** Tapered seven-sided mesa (flat top, wider base), unit height. */
export const unitMesa = new CylinderGeometry(1, 1.35, 1, 7);

function canvasTexture(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) paint(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Soft round sprite for dust motes. */
export function createDustTexture(): CanvasTexture {
  return canvasTexture(32, 32, (ctx) => {
    const dot = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dot.addColorStop(0, 'rgba(255,255,255,1)');
    dot.addColorStop(0.4, 'rgba(255,255,255,0.45)');
    dot.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = dot;
    ctx.fillRect(0, 0, 32, 32);
  });
}
