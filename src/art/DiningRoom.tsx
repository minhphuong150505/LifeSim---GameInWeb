/* eslint-disable react-refresh/only-export-components -- scene art + its shared geometry */
import { C, INK, stroke } from './ink';

export const DINING_W = 400;
export const DINING_H = 300;
/** Wall / floor line. */
export const DINING_FLOOR_Y = 214;
/** Height of the dining-table top; a child sitting at the table has the hips just below it. */
export const TABLE_TOP_Y = 236;
/** Left / right edge of the table. */
export const TABLE_X = { left: 186, right: 336 };

type DiningRoomProps = {
  /** Minute hand position of the wall clock. */
  clockMinutes?: number;
  /** Ambulance pulling up outside the window. */
  ambulance?: boolean;
};

const GRAPE = '#8e5bb5';
const GRAPE_LIGHT = '#b58ad6';

/** A small bunch of grapes centred on (x, y) (scale `k`). */
export function Grapes({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  const berries = [
    [-6, -6],
    [0, -6],
    [6, -6],
    [-3, -1],
    [3, -1],
    [0, 4],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M0 -10 q1 -5 5 -6" fill="none" stroke="#6b8e3a" strokeWidth={2} />
      <path d="M2 -12 q6 -6 10 -1 q-5 3 -10 1 Z" fill={C.green} {...stroke(1.2)} />
      {berries.map(([bx, by]) => (
        <g key={`${bx}-${by}`}>
          <circle cx={bx} cy={by} r={3.6} fill={GRAPE} {...stroke(1.2)} />
          <circle cx={(bx ?? 0) - 1} cy={(by ?? 0) - 1.2} r={1} fill={GRAPE_LIGHT} />
        </g>
      ))}
    </g>
  );
}

/** Glass of water centred on its base (x, y). */
export function WaterGlass({ x, y, k = 1 }: { x: number; y: number; k?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-6 -16 H6 L5 0 H-5 Z" fill="#e4f2f7" {...stroke(1.6)} />
      <path d="M-5.4 -9 H5.4 L5 0 H-5 Z" fill="#9fd3ea" opacity={0.85} />
      <path d="M-3 -13 V-4" stroke={C.white} strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
}

/** Wooden dining chair seen from the front: back rest, seat and legs; `x` is its centre. */
export function DiningChair({ x, seatY }: { x: number; seatY: number }) {
  return (
    <g>
      <rect
        x={x - 21}
        y={seatY - 52}
        width={42}
        height={12}
        rx={4}
        fill={C.woodDark}
        {...stroke(2)}
      />
      <path
        d={`M${x - 17} ${seatY - 40} V${seatY} M${x + 17} ${seatY - 40} V${seatY}`}
        stroke={INK}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      <path
        d={`M${x - 17} ${seatY - 40} V${seatY} M${x + 17} ${seatY - 40} V${seatY}`}
        stroke={C.woodDark}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <rect x={x - 22} y={seatY - 2} width={44} height={7} rx={2} fill={C.wood} {...stroke(2)} />
      <path
        d={`M${x - 18} ${seatY + 5} V${seatY + 40} M${x + 18} ${seatY + 5} V${seatY + 40}`}
        stroke={INK}
        strokeWidth={4}
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * The dining table drawn in front of whoever sits at it: table top with a cloth, a plate of
 * grapes and a glass of water, two legs down to the floor.
 */
export function DiningTable({ grapes = true }: { grapes?: boolean }) {
  const { left, right } = TABLE_X;
  return (
    <g>
      <path
        d={`M${left + 10} ${TABLE_TOP_Y + 8} V${TABLE_TOP_Y + 64} M${right - 10} ${TABLE_TOP_Y + 8} V${TABLE_TOP_Y + 64}`}
        stroke={INK}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <path
        d={`M${left + 10} ${TABLE_TOP_Y + 8} V${TABLE_TOP_Y + 64} M${right - 10} ${TABLE_TOP_Y + 8} V${TABLE_TOP_Y + 64}`}
        stroke={C.woodDark}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <rect
        x={left}
        y={TABLE_TOP_Y - 4}
        width={right - left}
        height={12}
        rx={3}
        fill={C.wood}
        {...stroke(2.4)}
      />
      {/* table runner */}
      <path
        d={`M${left + 40} ${TABLE_TOP_Y - 4} H${right - 40} V${TABLE_TOP_Y + 18} L${(left + right) / 2} ${TABLE_TOP_Y + 24} L${left + 40} ${TABLE_TOP_Y + 18} Z`}
        fill="#f6efe0"
        {...stroke(1.8)}
      />
      <path
        d={`M${left + 46} ${TABLE_TOP_Y + 2} H${right - 46}`}
        stroke={C.red}
        strokeWidth={1.6}
        strokeDasharray="4 3"
      />
      {grapes && (
        <g>
          <ellipse
            cx={(left + right) / 2 + 22}
            cy={TABLE_TOP_Y - 5}
            rx={20}
            ry={5}
            fill={C.white}
            {...stroke(1.8)}
          />
          <Grapes x={(left + right) / 2 + 22} y={TABLE_TOP_Y - 12} k={1.05} />
        </g>
      )}
      <WaterGlass x={right - 24} y={TABLE_TOP_Y - 4} />
    </g>
  );
}

/**
 * Family dining room (scenario 4): papered wall with a window, a pendant lamp over the table,
 * a sideboard with plates and the wall clock. Characters and the table itself are drawn by
 * the stage on top. 400×300 units like the other rooms.
 */
export function DiningRoom({ clockMinutes = 25, ambulance }: DiningRoomProps) {
  const a = (clockMinutes / 60) * 2 * Math.PI;
  return (
    <g>
      <defs>
        <pattern id="dr-paper" width={24} height={24} patternUnits="userSpaceOnUse">
          <rect width={24} height={24} fill="#eef3df" />
          <path d="M12 0 V24" stroke="#dfe8c9" strokeWidth={6} />
          <circle cx={12} cy={12} r={1.6} fill="#f3c9a8" opacity={0.8} />
        </pattern>
        <pattern id="dr-floor" width={56} height={20} patternUnits="userSpaceOnUse">
          <rect width={56} height={20} fill="#ddb688" />
          <path d="M0 19.5 H56" stroke="#b9875a" strokeWidth={1.2} opacity={0.5} />
          <path d="M22 0 V20" stroke="#b9875a" strokeWidth={1.2} opacity={0.45} />
        </pattern>
        <clipPath id="dr-window">
          <rect x={30} y={44} width={82} height={92} />
        </clipPath>
      </defs>

      {/* wall: wallpaper on top, wainscot below, plank floor */}
      <rect x={0} y={0} width={400} height={DINING_FLOOR_Y} fill="url(#dr-paper)" />
      <rect x={0} y={164} width={400} height={DINING_FLOOR_Y - 164} fill="#e7d3b0" />
      <path d="M0 164 H400" stroke={INK} strokeWidth={1.6} opacity={0.35} />
      {Array.from({ length: 20 }, (_, i) => (
        <path key={i} d={`M${10 + i * 20} 168 V210`} stroke={INK} strokeWidth={1} opacity={0.12} />
      ))}
      <rect
        x={0}
        y={DINING_FLOOR_Y}
        width={400}
        height={300 - DINING_FLOOR_Y}
        fill="url(#dr-floor)"
      />
      <path d={`M0 ${DINING_FLOOR_Y} H400`} {...stroke(2.5)} />

      {/* window with curtains */}
      <g clipPath="url(#dr-window)">
        <rect x={30} y={44} width={82} height={92} fill={C.sky} />
        <path d="M30 104 C46 94 60 100 74 96 C88 92 100 98 112 94 V136 H30 Z" fill={C.grass} />
        <circle cx={50} cy={96} r={13} fill={C.tree} {...stroke(2)} />
        <circle cx={96} cy={90} r={15} fill={C.tree} {...stroke(2)} />
        {ambulance && (
          <g transform="translate(40 104) scale(0.95)">
            <path d="M0 6 H34 V28 H0 Z" fill={C.white} {...stroke(2)} />
            <path d="M34 12 H44 L52 20 V28 H34 Z" fill={C.white} {...stroke(2)} />
            <path d="M0 20 H52" stroke={C.red} strokeWidth={3} />
            <path d="M14 9 h4 v4 h4 v4 h-4 v4 h-4 v-4 h-4 v-4 h4 Z" fill={C.red} />
            <rect x={8} y={1} width={7} height={5} rx={1.5} fill={C.blue} {...stroke(1.6)}>
              <animate
                attributeName="fill"
                values={`${C.blue};${C.red};${C.blue}`}
                dur="0.8s"
                repeatCount="indefinite"
              />
            </rect>
            <circle cx={11} cy={29} r={4.5} fill="#4b5563" {...stroke(1.8)} />
            <circle cx={42} cy={29} r={4.5} fill="#4b5563" {...stroke(1.8)} />
          </g>
        )}
      </g>
      <rect x={30} y={44} width={82} height={92} fill="none" {...stroke(2.5)} />
      <path d="M71 44 V136 M30 90 H112" stroke={C.white} strokeWidth={5} />
      <path d="M71 44 V136 M30 90 H112" fill="none" {...stroke(1.6)} />
      <rect x={24} y={136} width={94} height={7} rx={2} fill={C.white} {...stroke(2)} />
      <path d="M14 32 H128" {...stroke(3)} />
      <path
        d="M14 34 C22 56 18 100 24 140 C28 146 34 144 34 138 C30 100 34 58 30 34 Z"
        fill="#f6cf8a"
        {...stroke(2)}
      />
      <path
        d="M128 34 C120 56 124 100 118 140 C114 146 108 144 108 138 C112 100 108 58 112 34 Z"
        fill="#f6cf8a"
        {...stroke(2)}
      />

      {/* framed picture of a fruit bowl */}
      <rect x={176} y={50} width={50} height={38} fill={C.white} {...stroke(2.2)} />
      <path d="M184 78 Q201 92 218 78 Z" fill="#f2b8c6" {...stroke(1.6)} />
      <circle cx={194} cy={72} r={5} fill={C.red} {...stroke(1.4)} />
      <circle cx={206} cy={70} r={5} fill={C.yellow} {...stroke(1.4)} />
      <Grapes x={200} y={66} k={0.55} />

      {/* pendant lamp over the table */}
      <path d="M262 0 V52" stroke={INK} strokeWidth={2} />
      <path d="M244 70 Q262 44 280 70 Z" fill={C.yellow} {...stroke(2.2)} />
      <ellipse cx={262} cy={72} rx={6} ry={3} fill={C.white} {...stroke(1.4)} />

      {/* wall clock */}
      <g transform="translate(330 58)">
        <circle r={18} fill={C.white} {...stroke(2.5)} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d="M0 -14 V-11" transform={`rotate(${i * 90})`} {...stroke(2)} />
        ))}
        <path d="M0 0 V-9" {...stroke(2.5)} />
        <path d={`M0 0 L${12 * Math.sin(a)} ${-12 * Math.cos(a)}`} {...stroke(2)} />
        <circle r={2} fill={INK} />
      </g>

      {/* sideboard with plates and a vase */}
      <rect
        x={350}
        y={140}
        width={56}
        height={DINING_FLOOR_Y - 136}
        rx={4}
        fill="#c98f5a"
        {...stroke(2.5)}
      />
      <path d={`M378 146 V${DINING_FLOOR_Y - 4}`} stroke={INK} strokeWidth={1.6} />
      <circle cx={372} cy={176} r={2} fill={INK} />
      <circle cx={384} cy={176} r={2} fill={INK} />
      <rect x={346} y={134} width={64} height={8} rx={2} fill={C.woodDark} {...stroke(2)} />
      <ellipse cx={362} cy={122} rx={9} ry={12} fill={C.white} {...stroke(2)} />
      <ellipse cx={362} cy={122} rx={5} ry={7} fill="#cfe9ef" />
      <path
        d="M386 134 C380 124 382 116 388 112 C394 116 396 124 390 134 Z"
        fill={C.blue}
        {...stroke(2)}
      />
      <path
        d="M388 112 C386 102 380 98 376 100 M388 112 C390 100 396 96 400 98"
        fill="none"
        stroke="#6b8e3a"
        strokeWidth={2}
      />
      <circle cx={376} cy={99} r={3.5} fill={C.red} {...stroke(1.2)} />
      <circle cx={399} cy={97} r={3.5} fill={C.yellow} {...stroke(1.2)} />
    </g>
  );
}
