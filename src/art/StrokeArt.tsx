import { C, INK, stroke } from './ink';
import { LOOKS } from './looks';
import { Head, Person, type Eyes, type Mouth } from './Person';
import { LyingPerson } from './WaterScenes';

/* Props and poses of scenario 3 (stroke): Bác Nam's glass of water, the aspirin blister pack,
 * the side table, car keys, the AED box, and Bác Nam lying on the floor. All drawn around
 * (0, 0) in the shared hand-drawn style. */

/** Glass of water; `tipped` lies on its side with a puddle. */
export function Cup({
  x,
  y,
  s = 1,
  tipped,
}: {
  x: number;
  y: number;
  s?: number;
  tipped?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {tipped ? (
        <>
          <ellipse cx={10} cy={4} rx={16} ry={3.5} fill="#bfe6f5" opacity={0.9} />
          <g transform="rotate(-80)">
            <path d="M-5 -6 H5 L4 7 H-4 Z" fill={C.white} opacity={0.9} {...stroke(1.6)} />
          </g>
        </>
      ) : (
        <>
          <path d="M-5 -7 H5 L4 7 H-4 Z" fill={C.white} opacity={0.95} {...stroke(1.6)} />
          <path d="M-4.4 -2 H4.4 L4 7 H-4 Z" fill="#9fd8ef" />
          <path d="M-5 -7 H5 L4 7 H-4 Z" fill="none" {...stroke(1.6)} />
        </>
      )}
    </g>
  );
}

/** Aspirin blister pack (front view); `crossed` adds a red "do not use" ring. */
export function Aspirin({
  x,
  y,
  s = 1,
  rot = 0,
  crossed,
}: {
  x: number;
  y: number;
  s?: number;
  rot?: number;
  crossed?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-10} y={-6} width={20} height={12} rx={2.5} fill="#dfe6ee" {...stroke(1.6)} />
      {[-5, 0, 5].map((px) =>
        [-2.5, 2.5].map((py) => (
          <circle key={`${px}${py}`} cx={px} cy={py} r={1.7} fill={C.white} {...stroke(0.9)} />
        )),
      )}
      {crossed && (
        <g>
          <circle r={11} fill="none" stroke={C.redDark} strokeWidth={2.4} />
          <path d="M-8 8 L8 -8" stroke={C.redDark} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
}

/** A single white pill. */
export function Pill({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={3} fill={C.white} {...stroke(1.3)} />
      <path d="M-2 0 H2" stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

/** Small round side table standing on the floor (`y` = floor point). */
export function SideTable({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-8 -26 L-12 0 M8 -26 L12 0" stroke={INK} strokeWidth={3.4} strokeLinecap="round" />
      <ellipse cx={0} cy={-28} rx={20} ry={5} fill={C.wood} {...stroke(2)} />
    </g>
  );
}

export function CarKeys({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx={-6} cy={-6} r={4} fill="none" {...stroke(1.6)} />
      <rect x={-4} y={-4} width={9} height={12} rx={3} fill="#4b5563" {...stroke(1.6)} />
      <path d="M2 7 L9 14 M6 11 l2 -2 M8 13 l2 -2" {...stroke(1.8)} />
      <circle cx={0.5} cy={1} r={1.4} fill={C.red} />
    </g>
  );
}

/** Automated external defibrillator: green box with a heart and a lightning bolt. */
export function AedBox({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-12} y={-10} width={24} height={20} rx={4} fill={C.green} {...stroke(1.8)} />
      <path
        d="M0 7 C-6 3 -8 0 -8 -3 C-8 -6 -4 -7 0 -3 C4 -7 8 -6 8 -3 C8 0 6 3 0 7 Z"
        fill={C.white}
        {...stroke(1.2)}
      />
      <path d="M1 -5 L-2 0 H1 L-1 4" fill="none" stroke={C.redDark} strokeWidth={1.6} />
      <text
        x={0}
        y={-12.5}
        textAnchor="middle"
        fontFamily="Itim, sans-serif"
        fontSize={6}
        fill={INK}
      >
        AED
      </text>
    </g>
  );
}

/** Broken speech bubble "Bác... không..." (slurred speech). */
export function SlurBubble({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M-22 -12 H22 Q26 -12 26 -8 V6 Q26 10 22 10 H-6 L-14 18 L-12 10 H-22 Q-26 10 -26 6 V-8 Q-26 -12 -22 -12 Z"
        fill={C.white}
        {...stroke(1.8)}
        strokeDasharray="6 3"
      />
      <text x={0} y={2} textAnchor="middle" fontFamily="Itim, sans-serif" fontSize={8.5} fill={INK}>
        Bác... kh...
      </text>
    </g>
  );
}

/** Bác Nam's face, big (close-ups); `droop` shows the stroke signs on the face. */
export function NamHead({
  x,
  y,
  s = 1,
  eyes = 'open',
  mouth = 'flat',
}: {
  x: number;
  y: number;
  s?: number;
  eyes?: Eyes;
  mouth?: Mouth;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Head look={LOOKS.nam} face={{ eyes, mouth }} />
    </g>
  );
}

/** x-offset (× scale) from the hips of a lying figure to the centre of the chest. */
export const LYING_CHEST_DX = -20;

/**
 * Bác Nam lying on his back on the floor, head on the left (CPR / before it). Origin = hips.
 */
export function NamOnBack({ k = 0.9 }: { k?: number }) {
  return <LyingPerson kind="nam" k={k} />;
}

/**
 * Bác Nam in the recovery position: on his side facing the viewer, head on the left, top hand
 * against the cheek and the top knee bent. Origin = hips on the floor.
 */
export function NamRecovery({ k = 0.9, mouth = 'flat' }: { k?: number; mouth?: Mouth }) {
  const s = k * LOOKS.nam.scale;
  return (
    <g transform={`scale(${s}) rotate(-90)`}>
      <ellipse cx={-2} cy={-26} rx={22} ry={64} fill={INK} opacity={0.12} />
      <Person
        kind="nam"
        x={0}
        y={30}
        scale={1 / LOOKS.nam.scale}
        eyes="closed"
        mouth={mouth}
        armL="cheek"
        knee
      />
    </g>
  );
}

/** Breathing marks next to the mouth: steady waves or one rare, ragged gasp. */
export function BreathMarks({
  x,
  y,
  mode,
  s = 1,
}: {
  x: number;
  y: number;
  mode: 'normal' | 'gasping';
  s?: number;
}) {
  const normal = mode === 'normal';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={normal ? 'M0 0 q3 -3 6 0 t6 0 M2 6 q3 -3 6 0 t6 0' : 'M0 0 l4 -5 l3 7 l4 -9'}
        fill="none"
        stroke={normal ? C.blueDark : C.redDark}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          attributeName="opacity"
          values={normal ? '0.2;1;0.2' : '0;0;0;1;0;0;0;0'}
          dur={normal ? '2.4s' : '4.8s'}
          repeatCount="indefinite"
        />
      </path>
    </g>
  );
}
