import { C, INK, stroke } from './ink';

export const ROOM_W = 400;
export const ROOM_H = 300;
/** Seat point of the middle sofa cushion; characters sitting on the sofa use this y. */
export const SOFA_SEAT_Y = 170;

type LivingRoomProps = {
  /** Ambulance pulling up outside the window. */
  ambulance?: boolean;
  /** Minute hand position of the wall clock. */
  clockMinutes?: number;
  /** Draws attention to the wall clock (timer questions). */
  clockHighlight?: boolean;
};

/** Living room background in the hand-drawn style (viewBox 400×300). */
export function LivingRoom({ ambulance, clockMinutes = 10, clockHighlight }: LivingRoomProps) {
  const thin = { stroke: INK, strokeWidth: 1.3, opacity: 0.4, strokeLinecap: 'round' } as const;
  const handAngle = (clockMinutes / 60) * 2 * Math.PI;
  return (
    <g>
      <defs>
        <clipPath id="lr-window">
          <rect x={20} y={30} width={80} height={116} />
        </clipPath>
      </defs>
      {/* wall + floor */}
      <rect x={0} y={0} width={400} height={192} fill={C.wall} />
      <path d="M0 150 H400" {...thin} opacity={0.15} />
      <rect x={0} y={192} width={400} height={108} fill={C.floor} />
      <path d="M0 192 H400" {...stroke(2.5)} />
      <rect x={0} y={186} width={400} height={6} fill={C.wallShade} />
      {[214, 238, 264, 292].map((y, i) => (
        <g key={y}>
          <path d={`M0 ${y} H400`} {...thin} />
          {[0, 1, 2, 3, 4].map((j) => {
            const x = ((j * 97 + i * 53) % 400) + 20;
            const prev = i === 0 ? 192 : [214, 238, 264][i - 1];
            return <path key={j} d={`M${x} ${prev} V${y}`} {...thin} />;
          })}
        </g>
      ))}

      {/* window */}
      <g clipPath="url(#lr-window)">
        <rect x={20} y={30} width={80} height={116} fill={C.sky} />
        <path d="M20 96 C36 84 50 92 62 86 C76 80 90 88 100 84 V146 H20 Z" fill={C.grass} />
        <circle cx={38} cy={88} r={14} fill={C.tree} {...stroke(2)} />
        <circle cx={82} cy={82} r={17} fill={C.tree} {...stroke(2)} />
        <rect x={58} y={58} width={14} height={22} fill={C.white} {...stroke(1.8)} />
        <path d="M56 59 L65 50 L74 59 Z" fill={C.red} {...stroke(1.8)} />
        {ambulance && (
          <g transform="translate(26 104) scale(0.95)">
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
      <rect
        x={16}
        y={26}
        width={88}
        height={124}
        rx={3}
        fill="none"
        stroke={C.white}
        strokeWidth={8}
      />
      <rect x={12} y={22} width={96} height={132} rx={4} fill="none" {...stroke(2.5)} />
      <rect x={20} y={30} width={80} height={116} fill="none" {...stroke(2)} />
      <path d="M60 30 V146 M20 88 H100" stroke={C.white} strokeWidth={5} />
      <path d="M60 30 V146 M20 88 H100" fill="none" {...stroke(1.6)} />
      <rect x={8} y={150} width={104} height={8} rx={2} fill={C.white} {...stroke(2.2)} />

      {/* frames above the sofa */}
      <rect x={150} y={44} width={44} height={34} fill={C.white} {...stroke(2.2)} />
      <path d="M155 72 L166 58 L174 66 L180 60 L189 72 Z" fill={C.green} {...stroke(1.6)} />
      <circle cx={182} cy={53} r={4} fill={C.yellow} {...stroke(1.4)} />
      <rect x={204} y={52} width={30} height={26} fill={C.white} {...stroke(2.2)} />
      <path
        d="M219 72 C214 68 210 65 210 61 C210 58.5 212 57 214 57 C216 57 217.5 58.5 219 60 C220.5 58.5 222 57 224 57 C226 57 228 58.5 228 61 C228 65 224 68 219 72 Z"
        fill={C.red}
        {...stroke(1.4)}
      />

      {/* wall clock */}
      <g transform="translate(298 56)">
        {clockHighlight && (
          <circle r={27} fill={C.yellow} opacity={0.5}>
            <animate attributeName="r" values="23;29;23" dur="1.4s" repeatCount="indefinite" />
          </circle>
        )}
        <circle r={19} fill={C.white} {...stroke(2.5)} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d="M0 -15 V-12" transform={`rotate(${i * 90})`} {...stroke(2)} />
        ))}
        <path d="M0 0 V-9" {...stroke(2.5)} />
        <path d={`M0 0 L${13 * Math.sin(handAngle)} ${-13 * Math.cos(handAngle)}`} {...stroke(2)} />
        <circle r={2} fill={INK} />
      </g>

      {/* TV cabinet + TV */}
      <rect x={318} y={152} width={74} height={50} rx={3} fill={C.wood} {...stroke(2.5)} />
      <path d="M343 152 V202 M367 152 V202" {...stroke(2)} />
      {[330, 355, 380].map((x) => (
        <circle key={x} cx={x} cy={176} r={2.4} fill="none" {...stroke(1.8)} />
      ))}
      <path d="M324 202 v7 M386 202 v7" {...stroke(3)} />
      <rect x={326} y={102} width={58} height={42} rx={3} fill="#56616d" {...stroke(2.5)} />
      <path
        d="M332 108 L344 108 M332 113 L339 113"
        stroke={C.white}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.6}
      />
      <path d="M350 144 V152 M344 152 H362" {...stroke(2.5)} />

      {/* plant */}
      <path
        d="M128 168 C120 150 112 146 106 148 C112 154 118 160 128 168 Z"
        fill={C.green}
        {...stroke(2)}
      />
      <path
        d="M130 168 C130 146 136 136 142 134 C142 146 138 158 130 168 Z"
        fill={C.tree}
        {...stroke(2)}
      />

      {/* rug */}
      <ellipse cx={200} cy={258} rx={128} ry={28} fill="#f3d39b" {...stroke(2.5)} />
      <ellipse
        cx={200}
        cy={258}
        rx={110}
        ry={20}
        fill="none"
        stroke={C.red}
        strokeWidth={2.5}
        opacity={0.6}
      />

      {/* sofa */}
      <rect x={114} y={112} width={172} height={64} rx={14} fill={C.sofa} {...stroke(2.5)} />
      <path d="M200 116 V170" {...stroke(1.8)} opacity={0.5} />
      <rect x={118} y={160} width={164} height={28} rx={8} fill={C.sofa} {...stroke(2.5)} />
      <path d="M160 162 V186 M240 162 V186" {...stroke(1.8)} opacity={0.5} />
      <rect x={110} y={184} width={180} height={24} rx={6} fill={C.sofaShade} {...stroke(2.5)} />
      <rect x={98} y={140} width={26} height={68} rx={11} fill={C.sofa} {...stroke(2.5)} />
      <rect x={276} y={140} width={26} height={68} rx={11} fill={C.sofa} {...stroke(2.5)} />
      <path d="M108 208 v6 M292 208 v6" {...stroke(3)} />
      <rect
        x={250}
        y={136}
        width={24}
        height={22}
        rx={6}
        fill="#f5b7a0"
        {...stroke(2)}
        transform="rotate(10 262 147)"
      />
    </g>
  );
}
