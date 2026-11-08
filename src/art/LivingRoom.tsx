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
  /** Hour shown by the wall clock (the hour hand points up when left out). */
  clockHours?: number;
  /** TV switched on (a show playing on the screen). */
  tvOn?: boolean;
};

/** Living room background in the hand-drawn style (viewBox 400×300). */
export function LivingRoom({
  ambulance,
  clockMinutes = 10,
  clockHighlight,
  clockHours,
  tvOn,
}: LivingRoomProps) {
  const handAngle = (clockMinutes / 60) * 2 * Math.PI;
  const hourAngle =
    clockHours === undefined ? 0 : (((clockHours % 12) + clockMinutes / 60) / 12) * 2 * Math.PI;
  return (
    <g>
      <defs>
        <clipPath id="lr-window">
          <rect x={20} y={30} width={80} height={116} />
        </clipPath>
        <pattern id="lr-paper" width={22} height={22} patternUnits="userSpaceOnUse">
          <path
            d="M11 6 l1.6 3 3 0.6 -2.2 2 0.6 3 -3 -1.4 -3 1.4 0.6 -3 -2.2 -2 3 -0.6 Z"
            fill="#f2c9a8"
            opacity={0.55}
          />
          <circle cx={0} cy={18} r={1.3} fill="#cfe0b0" />
          <circle cx={22} cy={18} r={1.3} fill="#cfe0b0" />
        </pattern>
        <pattern id="lr-planks" width={60} height={24} patternUnits="userSpaceOnUse">
          <path d="M0 23.5 H60" stroke="#b9875a" strokeWidth={1.2} opacity={0.5} />
          <path d="M18 0 V24" stroke="#b9875a" strokeWidth={1.2} opacity={0.45} />
          <path d="M28 8 q8 -3 16 0" fill="none" stroke="#c99a6c" strokeWidth={1} opacity={0.6} />
        </pattern>
      </defs>
      {/* wall (cosy wallpaper + wainscot) and wooden floor */}
      <rect x={0} y={0} width={400} height={192} fill={C.wall} />
      <rect x={0} y={0} width={400} height={150} fill="url(#lr-paper)" />
      <rect x={0} y={150} width={400} height={42} fill="#efe1bf" />
      <path d="M0 150 H400" stroke={INK} strokeWidth={1.6} opacity={0.35} />
      {Array.from({ length: 20 }, (_, i) => (
        <path key={i} d={`M${10 + i * 20} 154 V188`} stroke={INK} strokeWidth={1} opacity={0.12} />
      ))}
      <rect x={0} y={192} width={400} height={108} fill={C.floor} />
      <rect x={0} y={192} width={400} height={108} fill="url(#lr-planks)" />
      <path d="M0 192 H400" {...stroke(2.5)} />
      <rect x={0} y={186} width={400} height={6} fill={C.wallShade} />
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
      {/* curtains */}
      <path d="M4 16 H120" {...stroke(3)} />
      <path
        d="M2 18 C10 40 6 90 14 132 C18 140 26 138 26 130 C22 92 26 44 22 18 Z"
        fill="#f6b8a6"
        {...stroke(2)}
      />
      <path
        d="M118 18 C110 40 114 90 106 132 C102 140 94 138 94 130 C98 92 94 44 98 18 Z"
        fill="#f6b8a6"
        {...stroke(2)}
      />
      <path
        d="M10 30 C12 60 12 96 18 124 M110 30 C108 60 108 96 102 124"
        fill="none"
        stroke={C.white}
        strokeWidth={1.6}
        opacity={0.6}
      />
      <circle cx={4} cy={16} r={3.5} fill={C.wood} {...stroke(1.6)} />
      <circle cx={120} cy={16} r={3.5} fill={C.wood} {...stroke(1.6)} />

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
        <path d={`M0 0 L${9 * Math.sin(hourAngle)} ${-9 * Math.cos(hourAngle)}`} {...stroke(2.5)} />
        <path d={`M0 0 L${13 * Math.sin(handAngle)} ${-13 * Math.cos(handAngle)}`} {...stroke(2)} />
        <circle r={2} fill={INK} />
      </g>

      {/* little shelf with books and a sprout */}
      <rect x={330} y={86} width={56} height={5} rx={2} fill={C.woodDark} {...stroke(1.8)} />
      <rect x={336} y={68} width={7} height={18} rx={1.5} fill={C.red} {...stroke(1.5)} />
      <rect x={344} y={71} width={7} height={15} rx={1.5} fill={C.blue} {...stroke(1.5)} />
      <rect
        x={352}
        y={66}
        width={7}
        height={20}
        rx={1.5}
        fill={C.yellow}
        transform="rotate(8 355 76)"
        {...stroke(1.5)}
      />
      <path d="M368 86 h14 l-2 -10 h-10 Z" fill="#e9a07a" {...stroke(1.5)} />
      <path
        d="M375 76 C372 68 366 66 364 67 C366 72 370 75 375 76 Z M375 76 C377 67 383 64 386 65 C384 71 380 75 375 76 Z"
        fill={C.green}
        {...stroke(1.4)}
      />

      {/* TV cabinet + TV */}
      <rect x={318} y={152} width={74} height={50} rx={3} fill={C.wood} {...stroke(2.5)} />
      <path d="M343 152 V202 M367 152 V202" {...stroke(2)} />
      {[330, 355, 380].map((x) => (
        <circle key={x} cx={x} cy={176} r={2.4} fill="none" {...stroke(1.8)} />
      ))}
      <path d="M324 202 v7 M386 202 v7" {...stroke(3)} />
      <rect x={326} y={102} width={58} height={42} rx={3} fill="#56616d" {...stroke(2.5)} />
      {tvOn ? (
        <g>
          <rect x={330} y={106} width={50} height={34} rx={2} fill="#9fd8ef" />
          <path d="M330 130 Q342 122 352 128 Q364 120 380 127 V140 H330 Z" fill={C.grass} />
          <circle cx={370} cy={114} r={4} fill={C.yellow} />
          <path d="M340 128 l4 -9 4 9 Z" fill={C.red} />
          <rect x={330} y={106} width={50} height={34} rx={2} fill={C.white} opacity={0.12}>
            <animate
              attributeName="opacity"
              values="0.05;0.2;0.05"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      ) : (
        <path
          d="M332 108 L344 108 M332 113 L339 113"
          stroke={C.white}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}
      <path d="M350 144 V152 M344 152 H362" {...stroke(2.5)} />

      {/* plant in a smiling pot */}
      <path d="M116 186 h26 l-3 -20 h-20 Z" fill="#e9a07a" {...stroke(2)} />
      <circle cx={124} cy={176} r={1.2} fill={INK} />
      <circle cx={134} cy={176} r={1.2} fill={INK} />
      <path d="M127 179 q2 2 4 0" fill="none" {...stroke(1.2)} />
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

      {/* sleeping kitty on the rug */}
      <g transform="translate(116 262)">
        <ellipse cx={0} cy={6} rx={20} ry={4} fill={INK} opacity={0.12} />
        <path d="M-18 4 C-20 -8 -6 -14 6 -12 C16 -10 20 -2 18 4 Z" fill="#f6c27a" {...stroke(2)} />
        <path
          d="M14 2 C24 2 26 -6 20 -8"
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
        <path
          d="M14 2 C24 2 26 -6 20 -8"
          fill="none"
          stroke="#f6c27a"
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <path
          d="M-6 -12 q4 -1 6 2 M4 -12 q3 2 3 6"
          fill="none"
          stroke="#d8924a"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
        <circle cx={-12} cy={-5} r={8} fill="#f6c27a" {...stroke(2)} />
        <path d="M-19 -9 l-1 -7 5 4 Z M-10 -12 l3 -6 2 6 Z" fill="#f6c27a" {...stroke(1.6)} />
        <path d="M-16 -5 q1.5 1.5 3 0 M-11 -5 q1.5 1.5 3 0" fill="none" {...stroke(1.2)} />
        <ellipse cx={-17} cy={-2} rx={1.8} ry={1.1} fill={C.blush} />
        <text x={-4} y={-18} fontSize={7} fill={INK} opacity={0.55} fontFamily="Itim, sans-serif">
          z z
        </text>
      </g>

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
        x={126}
        y={138}
        width={22}
        height={20}
        rx={6}
        fill="#ffd98a"
        {...stroke(2)}
        transform="rotate(-8 137 148)"
      />
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
