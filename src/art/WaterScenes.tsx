import { C, INK, stroke } from './ink';
import { LOOKS, type PersonKind } from './looks';
import { Head, Limb, Person, type Eyes, type Mouth } from './Person';

/* Backdrops and characters of scenario 2 (Đuối nước), drawn in the same hand-drawn style as
 * the living room. Every scene is laid out in a 400×300 world, like the living room. */

export const WATER = '#8fd0ea';
export const WATER_DEEP = '#6bb8dc';
const TILE = '#f4f0e2';
const TILE_LINE = '#d9d1b8';

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-24 6 C-30 6 -30 -4 -22 -4 C-22 -14 -8 -16 -4 -8 C0 -16 16 -14 16 -4 C26 -6 28 6 20 6 Z"
      fill={C.white}
      {...stroke(2)}
    />
  );
}

function Sun({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d="M0 -20 V-27"
          transform={`rotate(${i * 45})`}
          stroke="#f0a43a"
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      <circle r={14} fill={C.yellow} {...stroke(2.5)} />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 0 V-26 H4 V0 Z" fill={C.woodDark} {...stroke(2)} />
      <circle cx={0} cy={-38} r={18} fill={C.tree} {...stroke(2.2)} />
      <circle cx={-12} cy={-28} r={11} fill={C.tree} {...stroke(2.2)} />
      <circle cx={12} cy={-27} r={12} fill={C.tree} {...stroke(2.2)} />
      <path d="M-8 -44 q5 -5 10 -2" fill="none" stroke={C.white} strokeWidth={2} opacity={0.5} />
    </g>
  );
}

function Umbrella({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 V-40" {...stroke(2.5)} />
      <path
        d="M-26 -38 Q0 -62 26 -38 Q13 -44 0 -38 Q-13 -44 -26 -38 Z"
        fill={color}
        {...stroke(2.2)}
      />
      <path d="M0 -38 Q-6 -50 0 -56 Q6 -50 0 -38" fill={C.white} opacity={0.7} />
    </g>
  );
}

/** Moving highlight lines on the water surface. */
function Waves({
  x,
  y,
  w,
  rows = 3,
  gap = 26,
}: {
  x: number;
  y: number;
  w: number;
  rows?: number;
  gap?: number;
}) {
  return (
    <g stroke={C.white} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.75}>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: Math.ceil(w / 70) }, (_, i) => {
          const px = x + i * 70 + (r % 2) * 32;
          const py = y + r * gap;
          return (
            <path key={`${r}-${i}`} d={`M${px} ${py} q6 -4 12 0 t12 0`}>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 8 0; 0 0"
                dur={`${2.6 + (i % 3) * 0.4}s`}
                repeatCount="indefinite"
              />
            </path>
          );
        }),
      )}
    </g>
  );
}

/* ───────────────────────── backdrops ───────────────────────── */

/** Public swimming pool on a sunny weekend (2.1). Water x −60…310, y 112…236. */
export function PoolBackdrop() {
  return (
    <g>
      <rect x={-200} y={-200} width={800} height={300} fill={C.sky} />
      <Sun x={340} y={22} />
      <Cloud x={70} y={26} />
      <Cloud x={230} y={16} s={0.8} />
      {/* back fence with palm-ish trees and umbrellas */}
      <rect x={-200} y={62} width={800} height={36} fill="#cfe6c2" />
      <Tree x={-30} y={98} s={0.9} />
      <Tree x={150} y={96} s={0.75} />
      <Tree x={420} y={98} s={0.95} />
      <path d="M-200 98 H600" {...stroke(2)} />
      {Array.from({ length: 34 }, (_, i) => (
        <path
          key={i}
          d={`M${-196 + i * 24} 70 V98`}
          stroke={INK}
          strokeWidth={1.4}
          opacity={0.25}
        />
      ))}
      <path d="M-200 72 H600" stroke={INK} strokeWidth={1.4} opacity={0.25} />
      <Umbrella x={40} y={110} color={C.red} />
      <Umbrella x={260} y={110} color={C.yellow} />
      {/* deck tiles */}
      <rect x={-200} y={98} width={800} height={300} fill={TILE} />
      <g stroke={TILE_LINE} strokeWidth={1.2}>
        {Array.from({ length: 40 }, (_, i) => (
          <path key={i} d={`M${-200 + i * 20} 98 V400`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`h${i}`} d={`M-200 ${238 + i * 18} H600`} />
        ))}
      </g>
      {/* pool */}
      <rect x={-60} y={110} width={372} height={128} rx={8} fill="#e8e2cf" {...stroke(2.5)} />
      <rect x={-54} y={116} width={360} height={116} rx={5} fill={WATER} {...stroke(2)} />
      <rect x={-54} y={116} width={360} height={10} fill={WATER_DEEP} opacity={0.55} />
      <Waves x={-40} y={142} w={340} rows={4} gap={24} />
      {/* lane ropes */}
      {[150, 202].map((y) => (
        <g key={y}>
          <path d={`M-54 ${y} H306`} stroke={INK} strokeWidth={1.5} opacity={0.4} />
          {Array.from({ length: 30 }, (_, i) => (
            <circle
              key={i}
              cx={-50 + i * 12.2}
              cy={y}
              r={2.6}
              fill={i % 4 < 2 ? C.red : C.white}
              stroke={INK}
              strokeWidth={0.8}
            />
          ))}
        </g>
      ))}
      {/* ladder */}
      <g fill="none" {...stroke(2.5)} stroke="#9aa3ab">
        <path d="M250 104 V136 M266 104 V136 M250 114 H266 M250 126 H266" />
      </g>
    </g>
  );
}

/** Lake at the picnic area (2.2): far bank with trees, water y 105…222, grass bank in front. */
export function LakeBackdrop() {
  return (
    <g>
      <rect x={-200} y={-200} width={800} height={300} fill={C.sky} />
      <Sun x={60} y={24} />
      <Cloud x={190} y={22} />
      <Cloud x={330} y={30} s={0.8} />
      <path
        d="M-200 86 C-120 60 -40 74 40 64 C130 52 220 74 300 60 C380 50 460 66 600 58 V110 H-200 Z"
        fill="#9ccf86"
        {...stroke(2)}
      />
      <Tree x={-60} y={100} s={0.8} />
      <Tree x={30} y={92} s={0.65} />
      <Tree x={250} y={96} s={0.75} />
      <Tree x={340} y={98} s={0.9} />
      <Tree x={440} y={96} s={0.7} />
      <path
        d="M-200 104 C-100 98 0 110 100 102 C200 96 300 110 400 102 C460 98 520 104 600 100 V232 H-200 Z"
        fill={WATER}
        {...stroke(2)}
      />
      <path
        d="M-200 108 C-100 102 0 114 100 106 C200 100 300 114 400 106 C460 102 520 108 600 104 V124 H-200 Z"
        fill={WATER_DEEP}
        opacity={0.35}
      />
      <Waves x={-180} y={132} w={760} rows={4} gap={22} />
      {/* near grass bank with a sandy edge */}
      <path
        d="M-200 226 C-120 220 -40 232 40 224 C120 216 200 230 280 222 C360 214 440 226 600 220 V400 H-200 Z"
        fill="#e9d3a6"
        {...stroke(2.2)}
      />
      <path
        d="M-200 236 C-120 230 -40 242 40 234 C120 226 200 240 280 232 C360 224 440 236 600 230 V400 H-200 Z"
        fill={C.grass}
        {...stroke(2.2)}
      />
      {[
        [-150, 262],
        [190, 300],
        [330, 268],
        [420, 290],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y} l3 -9 l3 9 l3 -7 l2 7`}
          fill="none"
          stroke="#5e9a48"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
      {[
        [300, 252, C.red],
        [360, 300, C.yellow],
        [-120, 300, C.white],
      ].map(([x, y, c]) => (
        <circle
          key={`${x}`}
          cx={x as number}
          cy={y as number}
          r={3.2}
          fill={c as string}
          {...stroke(1.4)}
        />
      ))}
    </g>
  );
}

/** Grassy bank by the lake where the victim was brought ashore (2.3). */
export function ShoreBackdrop() {
  return (
    <g>
      <rect x={-200} y={-200} width={800} height={300} fill={C.sky} />
      <Cloud x={110} y={26} />
      <Cloud x={300} y={18} s={0.9} />
      <path
        d="M-200 80 C-100 66 0 80 100 70 C200 60 300 78 400 68 C460 62 520 70 600 66 V112 H-200 Z"
        fill="#9ccf86"
        {...stroke(2)}
      />
      <Tree x={-40} y={98} s={0.8} />
      <Tree x={80} y={92} s={0.6} />
      <Tree x={360} y={96} s={0.85} />
      <path
        d="M-200 108 C-100 102 0 112 100 104 C200 98 300 112 400 104 C480 100 540 106 600 102 V172 H-200 Z"
        fill={WATER}
        {...stroke(2)}
      />
      <Waves x={-180} y={128} w={760} rows={2} gap={20} />
      <path
        d="M-200 166 C-100 160 0 172 100 164 C200 158 300 170 400 162 C480 158 540 164 600 160 V400 H-200 Z"
        fill="#e9d3a6"
        {...stroke(2.2)}
      />
      <path
        d="M-200 178 C-100 172 0 184 100 176 C200 170 300 182 400 174 C480 170 540 176 600 172 V400 H-200 Z"
        fill={C.grass}
        {...stroke(2.2)}
      />
      {[
        [40, 292],
        [330, 296],
        [-90, 250],
        [380, 230],
      ].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          d={`M${x} ${y} l3 -9 l3 9 l3 -7 l2 7`}
          fill="none"
          stroke="#5e9a48"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

/* ───────────────────────── characters ───────────────────────── */

export type SwimMode = 'swim' | 'play' | 'struggle' | 'float' | 'tow';

/**
 * Someone in the water, drawn from the waterline up (origin = waterline under the chin).
 * `struggle` bobs up and down with both arms flailing above the water.
 */
export function Swimmer({
  kind,
  mode,
  k = 0.8,
  holding = 'ring',
}: {
  kind: PersonKind;
  mode: SwimMode;
  k?: number;
  /** What a floating swimmer holds on to. */
  holding?: 'ring' | 'box';
}) {
  const look = LOOKS[kind];
  const struggling = mode === 'struggle';
  const eyes: Eyes = struggling ? 'wide' : mode === 'float' ? 'worried' : 'happy';
  const mouth: Mouth = struggling ? 'open' : mode === 'float' ? 'flat' : 'smile';
  /** One arm: skin from the shoulder through `pts` to the hand, with a short shirt sleeve. */
  const limb = (side: 1 | -1, pts: { x: number; y: number }[]) => {
    const sh = { x: 13 * side, y: -6 };
    const first = pts[0] ?? sh;
    const hand = pts[pts.length - 1] ?? sh;
    const sleeveEnd = { x: sh.x + (first.x - sh.x) * 0.45, y: sh.y + (first.y - sh.y) * 0.45 };
    return (
      <>
        <Limb
          d={`M${sh.x} ${sh.y} ${pts.map((p) => `L${p.x} ${p.y}`).join(' ')}`}
          color={look.skin}
          width={7}
        />
        <Limb d={`M${sh.x} ${sh.y} L${sleeveEnd.x} ${sleeveEnd.y}`} color={look.shirt} width={9} />
        <circle cx={hand.x} cy={hand.y} r={5} fill={look.skin} {...stroke(2)} />
      </>
    );
  };
  const arm = (side: 1 | -1) => {
    const sh = { x: 13 * side, y: -6 };
    if (struggling) {
      return (
        <g key={side}>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values={`0 ${sh.x} ${sh.y}; ${side * 22} ${sh.x} ${sh.y}; 0 ${sh.x} ${sh.y}`}
            dur={side === 1 ? '0.55s' : '0.65s'}
            repeatCount="indefinite"
          />
          {limb(side, [
            { x: 24 * side, y: -26 },
            { x: 30 * side, y: -48 },
          ])}
        </g>
      );
    }
    if (mode === 'float') return <g key={side}>{limb(side, [{ x: 22 * side, y: -2 }])}</g>;
    if (mode === 'tow') {
      return side === 1 ? <g key={side}>{limb(side, [{ x: 30, y: -10 }])}</g> : null;
    }
    if (mode === 'play') {
      return (
        <g key={side}>
          {limb(side, [
            { x: 24 * side, y: -12 },
            { x: 30 * side, y: -4 },
          ])}
        </g>
      );
    }
    // swim: one arm reaching forward over the water
    return side === 1 ? (
      <g key={side}>
        {limb(side, [
          { x: 28, y: -26 },
          { x: 40, y: -20 },
        ])}
      </g>
    ) : null;
  };

  return (
    <g transform={`scale(${k * look.scale})`}>
      <g>
        {(struggling || mode === 'play') && (
          <animateTransform
            attributeName="transform"
            type="translate"
            values={struggling ? '0 0; 0 7; 0 -2; 0 0' : '0 0; 0 2; 0 0'}
            dur={struggling ? '0.9s' : '1.6s'}
            repeatCount="indefinite"
          />
        )}
        {arm(-1)}
        {arm(1)}
        {/* shirt above the waterline, with a neckline */}
        <path d="M-17 4 Q-17 -9 -8 -11 L8 -11 Q17 -9 17 4 Z" fill={look.shirt} {...stroke(2.2)} />
        <path d="M-6 -11 Q0 -5 6 -11 Z" fill={look.skin} {...stroke(1.6)} />
        <path d="M9 -9 Q15 -6 15 4 L11 4 Q12 -4 7 -9 Z" fill={INK} opacity={0.1} />
        <g transform="translate(0 -34) scale(0.98)">
          <Head look={look} face={{ eyes, mouth }} />
        </g>
      </g>
      {/* waterline ripples in front of the body */}
      <ellipse cx={0} cy={4} rx={30} ry={7} fill={WATER} opacity={0.9} />
      <path
        d="M-30 4 q7 -5 14 0 t14 0 t14 0 t14 0"
        fill="none"
        stroke={C.white}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      {mode === 'float' &&
        (holding === 'ring' ? (
          <g>
            <ellipse cx={0} cy={0} rx={27} ry={9} fill={C.red} {...stroke(2.4)} />
            <ellipse cx={0} cy={-1} rx={15} ry={4} fill={WATER} {...stroke(1.8)} />
            <path
              d="M-20 -5 l-5 7 M20 -5 l5 7 M-3 8 l0 -1 M3 8 l0 -1"
              stroke={C.white}
              strokeWidth={4}
            />
          </g>
        ) : (
          <g>
            <rect x={-24} y={-8} width={30} height={18} rx={4} fill="#eef6f8" {...stroke(2.4)} />
            <rect x={-14} y={-13} width={10} height={6} rx={2} fill={C.blue} {...stroke(1.8)} />
          </g>
        ))}
      {struggling && (
        <g fill={C.white} stroke={INK} strokeWidth={1.4}>
          <path d="M-38 -6 q-4 -8 0 -12 q4 4 0 12 Z">
            <animate attributeName="opacity" values="1;0;1" dur="0.7s" repeatCount="indefinite" />
          </path>
          <path d="M38 -8 q4 -8 0 -12 q-4 4 0 12 Z">
            <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="indefinite" />
          </path>
          <circle cx={-26} cy={-14} r={2.5}>
            <animate attributeName="cy" values="-6;-22;-6" dur="0.8s" repeatCount="indefinite" />
          </circle>
          <circle cx={28} cy={-12} r={2}>
            <animate attributeName="cy" values="-4;-20;-4" dur="0.9s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
      {mode === 'play' && (
        <g fill={C.white} stroke={INK} strokeWidth={1.2}>
          <circle cx={-34} cy={-6} r={2.2}>
            <animate attributeName="cy" values="0;-12;0" dur="1.2s" repeatCount="indefinite" />
          </circle>
          <circle cx={34} cy={-8} r={2}>
            <animate attributeName="cy" values="0;-14;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        </g>
      )}
    </g>
  );
}

/** High lifeguard chair; the seat point (for a sitting Person) is at (0, −56). */
export function LifeguardChair() {
  return (
    <g>
      <g fill="none" stroke={C.woodDark} strokeWidth={5} strokeLinecap="round">
        <path d="M-16 0 L-12 -56 M16 0 L12 -56 M-15 -18 H15 M-13 -38 H13" />
      </g>
      <g fill="none" {...stroke(1.6)} opacity={0.5}>
        <path d="M-16 0 L-12 -56 M16 0 L12 -56" />
      </g>
      <rect x={-18} y={-60} width={36} height={7} rx={2} fill={C.wood} {...stroke(2.2)} />
      <path d="M-15 -60 V-84 H15 V-60" fill="none" stroke={C.woodDark} strokeWidth={4} />
      <rect x={-22} y={-118} width={44} height={10} rx={3} fill={C.red} {...stroke(2)} />
      <path d="M0 -108 V-84" {...stroke(2.4)} />
    </g>
  );
}

/**
 * Person lying on their back on the ground, seen from above (head on the left). Origin is
 * the hips; CHEST_DX / FACE_DX give the chest and face (× the drawing scale).
 */
export function LyingPerson({
  kind,
  airway,
  mouthDirty,
  k = 0.9,
}: {
  kind: PersonKind;
  airway?: boolean;
  mouthDirty?: boolean;
  k?: number;
}) {
  const s = k * LOOKS[kind].scale;
  // Hips at 0 (feet at +30), head centre at −62 (−66 when tilted back); mouth 15 below it.
  const mouthY = airway ? -66 + 9 * 1.12 : -62 + 15 * 1.12;
  return (
    <g transform={`scale(${s}) rotate(-90)`}>
      {/* soft shadow on the grass */}
      <ellipse cx={0} cy={-26} rx={26} ry={64} fill={INK} opacity={0.12} />
      <Person
        kind={kind}
        x={0}
        y={30}
        scale={1 / LOOKS[kind].scale}
        eyes="closed"
        mouth={airway ? 'open' : 'flat'}
        tilt={airway ? 'up' : 'normal'}
      />
      {mouthDirty && (
        <g fill="#8a6a44" stroke={INK} strokeWidth={0.8}>
          <circle cx={-6} cy={mouthY + 2} r={2} />
          <circle cx={5} cy={mouthY + 4} r={1.6} />
          <circle cx={1} cy={mouthY + 6} r={1.3} />
        </g>
      )}
    </g>
  );
}

/** x-offset (world units at drawing scale 1) from the hips to the centre of the chest. */
export const CHEST_DX = -20;
/** x-offset from the hips to the face. */
export const FACE_DX = -62;

/** Two stacked hands pressing the centre of the chest (drawn on top of the lying person). */
export function PressingHands({ x, y, down }: { x: number; y: number; down?: boolean }) {
  const look = LOOKS.player;
  return (
    <g transform={`translate(${x} ${y + (down ? 3 : 0)})`}>
      <ellipse cx={0} cy={0} rx={10} ry={8} fill={look.skin} {...stroke(2.2)} />
      <ellipse cx={1} cy={-3} rx={9} ry={7} fill={look.skin} {...stroke(2.2)} />
      <path d="M-5 -6 q3 -2 6 0" fill="none" {...stroke(1.4)} />
    </g>
  );
}

/* ───────────────────────── props on the lake bank (2.2 find task) ───────────────────────── */

export type BankItemId =
  'long-branch' | 'short-branch' | 'plastic-box' | 'backpack' | 'rock' | 'sandals' | 'small-towel';

/** Bank props: art drawn around (0,0), position in world units and tap radius. */
// eslint-disable-next-line react-refresh/only-export-components -- scene layout data
export const BANK_ITEMS: { id: BankItemId; x: number; y: number; r: number }[] = [
  { id: 'long-branch', x: 46, y: 250, r: 30 },
  { id: 'short-branch', x: 118, y: 252, r: 16 },
  { id: 'plastic-box', x: 22, y: 286, r: 18 },
  { id: 'backpack', x: 70, y: 288, r: 18 },
  { id: 'rock', x: 118, y: 290, r: 17 },
  { id: 'sandals', x: -16, y: 258, r: 15 },
  { id: 'small-towel', x: 160, y: 296, r: 15 },
];

export function BankItemArt({ id }: { id: BankItemId }) {
  switch (id) {
    case 'long-branch':
      return (
        <g>
          <path d="M-36 8 L36 -8" stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <path d="M-36 8 L36 -8" stroke={C.woodDark} strokeWidth={5.5} strokeLinecap="round" />
          <path d="M6 -1 l8 -10 M-14 4 l-6 -9" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          <path
            d="M6 -1 l8 -10 M-14 4 l-6 -9"
            stroke={C.woodDark}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <ellipse cx={16} cy={-13} rx={4} ry={2.5} fill={C.tree} {...stroke(1.2)} />
        </g>
      );
    case 'short-branch':
      return (
        <g>
          <path d="M-12 3 L12 -3" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <path d="M-12 3 L12 -3" stroke={C.woodDark} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M2 0 l4 -6" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    case 'plastic-box':
      return (
        <g>
          <rect x={-15} y={-10} width={30} height={20} rx={4} fill="#eef6f8" {...stroke(2.2)} />
          <rect x={-8} y={-15} width={12} height={6} rx={2} fill={C.blue} {...stroke(1.8)} />
          <path d="M-10 -4 h18" stroke={C.blue} strokeWidth={1.6} opacity={0.6} />
        </g>
      );
    case 'backpack':
      return (
        <g>
          <path
            d="M-13 12 V-6 Q-13 -16 0 -16 Q13 -16 13 -6 V12 Z"
            fill="#6f978b"
            {...stroke(2.2)}
          />
          <rect x={-9} y={0} width={18} height={9} rx={3} fill="#8fb3a8" {...stroke(1.8)} />
          <path d="M-5 -16 q5 -6 10 0" fill="none" {...stroke(2)} />
          <path d="M-7 -10 l4 3 M3 -12 l5 4" stroke={C.yellow} strokeWidth={2} />
        </g>
      );
    case 'rock':
      return (
        <path
          d="M-16 10 C-20 0 -12 -12 -2 -12 C10 -14 18 -4 16 6 C14 12 -10 14 -16 10 Z"
          fill={C.gray}
          {...stroke(2.2)}
        />
      );
    case 'sandals':
      return (
        <g>
          <ellipse
            cx={-6}
            cy={0}
            rx={5}
            ry={10}
            fill={C.red}
            {...stroke(2)}
            transform="rotate(-12)"
          />
          <ellipse
            cx={7}
            cy={1}
            rx={5}
            ry={10}
            fill={C.red}
            {...stroke(2)}
            transform="rotate(10)"
          />
          <path d="M-9 -3 q3 3 6 0 M4 -2 q3 3 6 0" fill="none" {...stroke(1.6)} />
        </g>
      );
    case 'small-towel':
      return (
        <g>
          <path d="M-12 -7 H12 V7 H-12 Z" fill={C.yellow} {...stroke(2.2)} />
          <path d="M-12 -2 H12" stroke={C.white} strokeWidth={2} />
        </g>
      );
  }
}
