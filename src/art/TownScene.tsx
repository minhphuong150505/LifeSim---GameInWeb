import { C, INK, stroke } from './ink';
import { Person } from './Person';

export const TOWN_W = 800;
export const TOWN_H = 450;

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 20 C-2 8 12 2 20 8 C24 -4 44 -4 48 8 C58 2 70 10 66 20 Z"
        fill={C.white}
        {...stroke(2.5)}
      />
    </g>
  );
}

function House({
  x,
  w,
  h,
  roof,
  wall,
}: {
  x: number;
  w: number;
  h: number;
  roof: string;
  wall: string;
}) {
  const base = 330;
  return (
    <g>
      <rect x={x} y={base - h} width={w} height={h} fill={wall} {...stroke(2.5)} />
      <path
        d={`M${x - 8} ${base - h} L${x + w / 2} ${base - h - 34} L${x + w + 8} ${base - h} Z`}
        fill={roof}
        {...stroke(2.5)}
      />
      {Array.from({ length: Math.floor(h / 34) }, (_, r) =>
        Array.from({ length: Math.max(1, Math.floor(w / 30)) }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={x + 8 + c * 30}
            y={base - h + 10 + r * 34}
            width={16}
            height={16}
            rx={2}
            fill={C.sky}
            {...stroke(1.8)}
          />
        )),
      )}
    </g>
  );
}

/**
 * Wide outdoor scene used behind the login screen: sky, town, a small clinic with a
 * red cross, and the two heroes of the first scenario waving.
 */
export function TownScene({ heroes = true }: { heroes?: boolean }) {
  return (
    <g>
      <defs>
        <linearGradient id="town-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9dcef" />
          <stop offset="1" stopColor="#e7f5f2" />
        </linearGradient>
      </defs>
      <rect x={-400} y={-200} width={1600} height={600} fill="url(#town-sky)" />
      <circle cx={660} cy={80} r={38} fill={C.yellow} {...stroke(2.5)} />
      <Cloud x={90} y={60} s={1.2} />
      <Cloud x={380} y={40} />
      <Cloud x={520} y={110} s={0.8} />
      <Cloud x={-120} y={120} />
      <Cloud x={860} y={70} s={1.1} />

      {/* far hills */}
      <path
        d="M-400 300 C-200 230 0 290 160 250 C320 210 460 280 620 240 C760 205 900 250 1200 230 V400 H-400 Z"
        fill="#cfe7b4"
        {...stroke(2.5)}
      />

      <House x={-170} w={90} h={120} roof={C.blueDark} wall="#f6e3c3" />
      <House x={40} w={70} h={90} roof={C.red} wall={C.white} />
      <House x={130} w={110} h={150} roof="#8d6e9e" wall="#f9d9c4" />

      {/* clinic */}
      <g>
        <rect x={300} y={160} width={200} height={170} fill={C.white} {...stroke(2.5)} />
        <rect x={290} y={150} width={220} height={20} rx={4} fill={C.red} {...stroke(2.5)} />
        <circle cx={400} cy={205} r={26} fill={C.white} {...stroke(2.5)} />
        <path
          d="M393 189 h14 v9 h9 v14 h-9 v9 h-14 v-9 h-9 v-14 h9 Z"
          fill={C.red}
          {...stroke(1.6)}
        />
        {[318, 452].map((x) => (
          <g key={x}>
            <rect x={x} y={190} width={30} height={26} rx={3} fill={C.sky} {...stroke(2)} />
            <rect x={x} y={246} width={30} height={26} rx={3} fill={C.sky} {...stroke(2)} />
          </g>
        ))}
        <rect x={372} y={262} width={56} height={68} rx={4} fill="#8fc7de" {...stroke(2.5)} />
        <path d="M400 262 V330" {...stroke(2)} />
      </g>

      <House x={560} w={80} h={110} roof={C.green} wall="#fff1c2" />
      <House x={660} w={100} h={140} roof={C.redDark} wall="#e8f0f7" />
      <House x={800} w={90} h={100} roof={C.blueDark} wall="#f6e3c3" />

      {/* trees */}
      {[-60, 262, 532, 780].map((x, i) => (
        <g key={x}>
          <rect x={x - 4} y={290} width={8} height={40} fill={C.woodDark} {...stroke(2)} />
          <circle cx={x} cy={284 - (i % 2) * 8} r={22} fill={C.tree} {...stroke(2.5)} />
        </g>
      ))}

      {/* street */}
      <rect x={-400} y={330} width={1600} height={120} fill={C.grass} />
      <path d="M-400 330 H1200" {...stroke(2.5)} />
      <rect x={-400} y={352} width={1600} height={50} fill="#b9b3a6" />
      <path d="M-400 352 H1200 M-400 402 H1200" {...stroke(2.5)} />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={-380 + i * 100} y={374} width={44} height={6} rx={3} fill={C.white} />
      ))}

      {/* ambulance */}
      <g transform="translate(560 318) scale(1.5)">
        <path d="M0 6 H40 V30 H0 Z" fill={C.white} {...stroke(2)} />
        <path d="M40 12 H52 L60 21 V30 H40 Z" fill={C.white} {...stroke(2)} />
        <rect x={44} y={14} width={8} height={7} fill={C.sky} {...stroke(1.4)} />
        <path d="M0 22 H60" stroke={C.red} strokeWidth={3} />
        <path d="M16 9 h5 v4 h4 v5 h-4 v4 h-5 v-4 h-4 v-5 h4 Z" fill={C.red} />
        <rect x={8} y={1} width={8} height={5} rx={1.5} fill={C.blue} {...stroke(1.4)}>
          <animate
            attributeName="fill"
            values={`${C.blue};${C.red};${C.blue}`}
            dur="0.8s"
            repeatCount="indefinite"
          />
        </rect>
        <circle cx={12} cy={31} r={5} fill="#4b5563" {...stroke(1.8)} />
        <circle cx={48} cy={31} r={5} fill="#4b5563" {...stroke(1.8)} />
      </g>

      {heroes && (
        <g>
          <ellipse cx={170} cy={428} rx={40} ry={7} fill={INK} opacity={0.15} />
          <Person
            kind="player"
            x={150}
            y={428}
            scale={1.25}
            armR="wave"
            eyes="happy"
            mouth="smile"
          />
          <Person
            kind="brother"
            x={215}
            y={428}
            scale={1.25}
            armL="wave"
            eyes="happy"
            mouth="grin"
          />
        </g>
      )}
    </g>
  );
}
