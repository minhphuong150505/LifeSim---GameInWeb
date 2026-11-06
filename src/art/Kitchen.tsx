/* eslint-disable react-refresh/only-export-components -- scene art + its shared geometry */
import { C, INK, stroke } from './ink';

export const KITCHEN_W = 400;
export const KITCHEN_H = 300;
/** Wall / floor line. */
export const KITCHEN_FLOOR_Y = 232;
/** Counter top height and the sink's tap (water lands at TAP.x, TAP.waterY). */
export const COUNTER_TOP_Y = 196;
export const TAP = { x: 152, y: 150, waterY: 196 };

type KitchenProps = {
  /** Cold water runs from the tap. */
  water?: boolean;
  /** Steam rises from the pot (the accident just happened). */
  steam?: boolean;
  /** The pot is knocked over on the counter (round 5.3). */
  spilled?: boolean;
  /** Minutes shown on the wall clock, and whether it is highlighted (cooling timer). */
  clockMinutes?: number;
  clockHighlight?: boolean;
  ambulance?: boolean;
};

/**
 * Family kitchen (scenario 5): tiled wall, window, cupboards, a counter with the sink on the
 * left and the stove on the right, a wall clock. 400×300 units like the living room.
 */
export function Kitchen({
  water,
  steam,
  spilled,
  clockMinutes = 10,
  clockHighlight,
  ambulance,
}: KitchenProps) {
  const a = (clockMinutes / 60) * 2 * Math.PI;
  return (
    <g>
      <defs>
        <pattern id="kt-tiles" width={20} height={20} patternUnits="userSpaceOnUse">
          <rect width={20} height={20} fill="#f1f6ef" />
          <path d="M0 19.5 H20 M19.5 0 V20" stroke="#cfdccb" strokeWidth={1.2} />
        </pattern>
        <clipPath id="kt-window">
          <rect x={196} y={34} width={92} height={78} />
        </clipPath>
        <pattern id="kt-floor" width={40} height={40} patternUnits="userSpaceOnUse">
          <rect width={40} height={40} fill="#e9d3b4" />
          <rect width={20} height={20} fill="#dfc39f" />
          <rect x={20} y={20} width={20} height={20} fill="#dfc39f" />
        </pattern>
      </defs>

      {/* wall: paint on top, tiles behind the counter */}
      <rect x={0} y={0} width={400} height={KITCHEN_FLOOR_Y} fill="#fbeedb" />
      <rect x={0} y={120} width={400} height={KITCHEN_FLOOR_Y - 120} fill="url(#kt-tiles)" />
      <path d="M0 120 H400" stroke={INK} strokeWidth={1.4} opacity={0.3} />
      <rect
        x={0}
        y={KITCHEN_FLOOR_Y}
        width={400}
        height={300 - KITCHEN_FLOOR_Y}
        fill="url(#kt-floor)"
      />
      <path d={`M0 ${KITCHEN_FLOOR_Y} H400`} {...stroke(2.5)} />

      {/* upper cupboards */}
      {[16, 70, 312].map((cx) => (
        <g key={cx}>
          <rect x={cx} y={20} width={50} height={64} rx={4} fill="#9fcfb4" {...stroke(2.2)} />
          <path d={`M${cx + 25} 20 V84`} stroke={INK} strokeWidth={1.6} />
          <circle cx={cx + 21} cy={66} r={2} fill={INK} />
          <circle cx={cx + 29} cy={66} r={2} fill={INK} />
        </g>
      ))}

      {/* window */}
      <g clipPath="url(#kt-window)">
        <rect x={196} y={34} width={92} height={78} fill={C.sky} />
        <path d="M196 86 C214 78 232 84 248 80 C266 76 280 82 288 80 V112 H196 Z" fill={C.grass} />
        <circle cx={214} cy={80} r={11} fill={C.tree} {...stroke(1.8)} />
        <path d="M196 100 H288" stroke="#b9b3a6" strokeWidth={10} />
        {ambulance && (
          <g transform="translate(222 82) scale(0.8)">
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
      <rect x={196} y={34} width={92} height={78} fill="none" {...stroke(3)} />
      <path d="M242 34 V112 M196 73 H288" stroke={INK} strokeWidth={2.4} />
      <rect x={190} y={110} width={104} height={7} rx={2} fill={C.wood} {...stroke(2)} />

      {/* wall clock */}
      <g transform="translate(150 56)">
        {clockHighlight && (
          <circle r={24} fill={C.yellow} opacity={0.55}>
            <animate attributeName="r" values="22;26;22" dur="1.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle r={18} fill={C.white} {...stroke(2.5)} />
        <path d={`M0 0 L0 -12 M0 0 L${10 * Math.sin(a)} ${-10 * Math.cos(a)}`} {...stroke(2.2)} />
        <circle r={2} fill={INK} />
      </g>

      {/* fridge */}
      <rect
        x={330}
        y={100}
        width={58}
        height={KITCHEN_FLOOR_Y - 100}
        rx={6}
        fill="#e7eef3"
        {...stroke(2.5)}
      />
      <path d={`M330 150 H388`} stroke={INK} strokeWidth={2} />
      <path d="M338 116 V136 M338 160 V190" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      <circle cx={372} cy={122} r={4} fill={C.red} {...stroke(1.4)} />

      {/* counter: cabinet front, top */}
      <rect
        x={8}
        y={COUNTER_TOP_Y}
        width={316}
        height={KITCHEN_FLOOR_Y - COUNTER_TOP_Y}
        fill="#f2c995"
        {...stroke(2.5)}
      />
      {[8, 87, 166, 245].map((cx) => (
        <g key={cx}>
          <rect
            x={cx + 6}
            y={COUNTER_TOP_Y + 8}
            width={67}
            height={24}
            rx={3}
            fill="#f7d9ae"
            {...stroke(1.6)}
          />
          <path
            d={`M${cx + 32} ${COUNTER_TOP_Y + 14} h14`}
            stroke={INK}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
        </g>
      ))}
      <rect
        x={2}
        y={COUNTER_TOP_Y - 6}
        width={328}
        height={8}
        rx={2}
        fill="#d9e2e6"
        {...stroke(2.2)}
      />

      {/* sink and tap */}
      <rect
        x={124}
        y={COUNTER_TOP_Y - 7}
        width={56}
        height={6}
        rx={3}
        fill="#9aa5b1"
        {...stroke(1.6)}
      />
      <path
        d={`M${TAP.x - 18} ${COUNTER_TOP_Y - 7} V${TAP.y} H${TAP.x - 4} Q${TAP.x} ${TAP.y} ${TAP.x} ${TAP.y + 6} V${TAP.y + 10}`}
        fill="none"
        stroke="#7f8a96"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d={`M${TAP.x - 18} ${COUNTER_TOP_Y - 7} V${TAP.y} H${TAP.x - 4} Q${TAP.x} ${TAP.y} ${TAP.x} ${TAP.y + 6} V${TAP.y + 10}`}
        fill="none"
        stroke="#d6dde4"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle
        cx={TAP.x - 26}
        cy={COUNTER_TOP_Y - 12}
        r={3.5}
        fill={water ? C.blue : C.red}
        {...stroke(1.4)}
      />
      {water && (
        <g>
          <rect
            x={TAP.x - 3}
            y={TAP.y + 11}
            width={6}
            height={TAP.waterY - TAP.y - 11}
            fill="#bfe6f5"
            opacity={0.9}
          />
          <path
            d={`M${TAP.x - 1} ${TAP.y + 13} V${TAP.waterY - 2}`}
            stroke={C.white}
            strokeWidth={1.4}
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-16"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}

      {/* stove with a pot */}
      <rect
        x={236}
        y={COUNTER_TOP_Y - 10}
        width={70}
        height={6}
        rx={2}
        fill="#4b5563"
        {...stroke(1.6)}
      />
      {spilled ? (
        <g transform={`translate(262 ${COUNTER_TOP_Y - 18}) rotate(-70)`}>
          <rect x={-14} y={-10} width={28} height={20} rx={3} fill="#c9d1d8" {...stroke(2)} />
          <path d="M14 -4 h8" {...stroke(2.5)} />
        </g>
      ) : (
        <g transform={`translate(270 ${COUNTER_TOP_Y - 24})`}>
          <rect x={-16} y={-4} width={32} height={18} rx={3} fill="#c9d1d8" {...stroke(2)} />
          <path d="M-16 0 h-6 M16 0 h6" {...stroke(2.5)} />
          <ellipse cx={0} cy={-4} rx={16} ry={3} fill="#9aa5b1" {...stroke(1.6)} />
        </g>
      )}
      {spilled && (
        <path
          d={`M246 ${COUNTER_TOP_Y - 6} q-14 2 -22 10 q-6 8 4 10 q10 -2 18 -14 Z`}
          fill="#bfe6f5"
          opacity={0.8}
          {...stroke(1.4)}
        />
      )}
      {steam &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${262 + i * 8} ${COUNTER_TOP_Y - 30} q-5 -8 0 -16 q5 -8 0 -16`}
            fill="none"
            stroke="#c7cdd3"
            strokeWidth={2.4}
            strokeLinecap="round"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.9;0.2"
              dur={`${1.4 + i * 0.3}s`}
              repeatCount="indefinite"
            />
          </path>
        ))}
      {/* noodle bowl and kettle */}
      <g transform={`translate(214 ${COUNTER_TOP_Y - 6})`}>
        <path d="M-12 -10 H12 Q12 0 0 0 Q-12 0 -12 -10 Z" fill={C.red} {...stroke(1.8)} />
        <path d="M-8 -12 q4 -3 8 0 q4 3 8 0" fill="none" stroke="#f2c995" strokeWidth={2} />
      </g>
      <g transform={`translate(52 ${COUNTER_TOP_Y - 6})`}>
        <path d="M-12 0 V-16 Q0 -24 12 -16 V0 Z" fill="#e8605a" {...stroke(2)} />
        <path d="M12 -12 l9 -6" {...stroke(2.5)} />
        <path d="M-6 -22 q6 -6 12 0" fill="none" {...stroke(2)} />
      </g>
    </g>
  );
}
