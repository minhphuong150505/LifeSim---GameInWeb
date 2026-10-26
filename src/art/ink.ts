/**
 * Shared palette for the hand-drawn 2D style (thick dark outline + flat pastel fills).
 * Every illustration in `src/art` draws with these so the whole game looks like one set.
 */
export const INK = '#3b2d26';

export const C = {
  paper: '#fbf6e6',
  wall: '#f3eed3',
  wallShade: '#e6dfbd',
  floor: '#e3b98d',
  floorLine: '#c79a6c',
  wood: '#d9a866',
  woodDark: '#a8743f',
  sofa: '#8d949c',
  sofaShade: '#737a83',
  grass: '#a9d48a',
  tree: '#7fb862',
  sky: '#cfe9ef',
  skin: '#ffe1c6',
  skinShade: '#f3c9a6',
  blush: '#f6a59a',
  blood: '#d8402f',
  red: '#ec6a4c',
  redDark: '#c94a2e',
  yellow: '#ffd23f',
  blue: '#7cb8e4',
  blueDark: '#4d8fc2',
  green: '#86c06c',
  white: '#fffdf6',
  gray: '#c9c3b4',
  ice: '#bfe6f5',
} as const;

/** Outline props for SVG shapes. */
export const stroke = (w = 2.5) =>
  ({
    stroke: INK,
    strokeWidth: w,
    strokeLinejoin: 'round',
    strokeLinecap: 'round',
  }) as const;

export type Pt = { x: number; y: number };

/** Rotates point `p` around `o` by `deg` degrees (clockwise in screen space). */
export function rotate(p: Pt, o: Pt, deg: number): Pt {
  const r = (deg * Math.PI) / 180;
  const dx = p.x - o.x;
  const dy = p.y - o.y;
  return {
    x: o.x + dx * Math.cos(r) - dy * Math.sin(r),
    y: o.y + dx * Math.sin(r) + dy * Math.cos(r),
  };
}
