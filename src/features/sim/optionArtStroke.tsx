/* eslint-disable react-refresh/only-export-components -- art module: drawing helpers + the option art map */
import { AmbulanceIcon, ClockIcon, PhoneIcon, PinIcon } from '../../art/icons';
import { C, INK, stroke } from '../../art/ink';
import { LOOKS } from '../../art/looks';
import { Head, Person, type PersonProps } from '../../art/Person';
import {
  AedBox,
  Aspirin,
  BreathMarks,
  CarKeys,
  Cup,
  LYING_CHEST_DX,
  NamHead,
  NamOnBack,
  NamRecovery,
  Pill,
  SideTable,
  SlurBubble,
} from '../../art/StrokeArt';
import { PressingHands } from '../../art/WaterScenes';

/* Answer illustrations for scenario 3 (stroke): Ông Nội (62), the player and cô Lan in the
 * living room, drawn with the same kit as the stage. They show what the option does, never
 * whether it is right. */

const BG = '#f3eed3';
const FONT = 'Itim, sans-serif';
const GREEN = '#4caf6a';

function Pic({
  bg = BG,
  vb = '0 0 100 100',
  floor,
  children,
}: {
  bg?: string;
  vb?: string;
  /** Draws the wooden floor from this y down. */
  floor?: number;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox={vb} className="h-full w-full" aria-hidden>
      <rect x={-50} y={-50} width={250} height={250} fill={bg} />
      {floor !== undefined && (
        <>
          <rect x={-50} y={floor} width={250} height={200} fill={C.floor} />
          <path d={`M-50 ${floor} H200`} {...stroke(2)} />
        </>
      )}
      {children}
    </svg>
  );
}

/** Small label pinned to a corner, with an optional icon. */
function Tag({
  label,
  icon,
  pos = 'tr',
}: {
  label?: string;
  icon?: React.ReactNode;
  pos?: 'tr' | 'tl';
}) {
  return (
    <span
      className={`absolute ${pos === 'tr' ? 'right-0.5' : 'left-0.5'} top-0.5 flex flex-col items-center`}
    >
      {icon}
      {label && (
        <span className="-mt-0.5 whitespace-nowrap rounded-full border-2 border-navy bg-white px-1 font-display text-[9px] leading-tight text-navy">
          {label}
        </span>
      )}
    </span>
  );
}

const withTag = (art: React.ReactNode, tag: React.ReactNode) => (
  <>
    {art}
    {tag}
  </>
);

type Who = Omit<PersonProps, 'kind'>;
const nam = (p: Who) => <Person kind="nam" {...p} />;
const lan = (p: Who) => <Person kind="lan" {...p} />;
const player = (p: Who) => <Person kind="player" {...p} />;

/** Sofa behind a sitting person (`y` = seat line). */
function Sofa({ x = 50, y, w = 84 }: { x?: number; y: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 26} width={w} height={30} rx={8} fill={C.sofa} {...stroke(2)} />
      <rect
        x={x - w / 2 - 2}
        y={y}
        width={w + 4}
        height={12}
        rx={4}
        fill={C.sofaShade}
        {...stroke(2)}
      />
    </g>
  );
}

function Bubble({
  x,
  y,
  w,
  h = 20,
  children,
  tail = 'left',
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  children?: React.ReactNode;
  tail?: 'left' | 'right';
}) {
  const t = tail === 'left' ? x + 10 : x + w - 10;
  return (
    <g>
      <path
        d={`M${x + 5} ${y} H${x + w - 5} Q${x + w} ${y} ${x + w} ${y + 5} V${y + h - 5} Q${x + w} ${y + h} ${x + w - 5} ${y + h} H${t + 6} L${t - 2} ${y + h + 8} L${t} ${y + h} H${x + 5} Q${x} ${y + h} ${x} ${y + h - 5} V${y + 5} Q${x} ${y} ${x + 5} ${y} Z`}
        fill={C.white}
        {...stroke(2)}
      />
      {children}
    </g>
  );
}

function Txt({
  x,
  y,
  size = 9,
  color = INK,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  children: React.ReactNode;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontSize={size} fill={color}>
      {children}
    </text>
  );
}

/** Big red cross over something. */
function RedX({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return (
    <path
      d={`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`}
      stroke={C.redDark}
      strokeWidth={4}
      strokeLinecap="round"
    />
  );
}

/** Motion / sway lines next to someone. */
function Sway({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <path
      d={`M${x} ${y} q${4 * s} 5 0 10 M${x + 5 * s} ${y - 3} q${4 * s} 8 0 16`}
      fill="none"
      stroke={INK}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  );
}

function Speed({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <path
      d={`M${x} ${y} h${-10 * s} M${x - 2 * s} ${y + 6} h${-12 * s} M${x} ${y + 12} h${-9 * s}`}
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

/** Phone screen with a big number and a green call button. */
function PhoneScreen({
  x,
  y,
  number,
  s = 1,
  crossed,
}: {
  x: number;
  y: number;
  number?: string;
  s?: number;
  crossed?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-17} y={-30} width={34} height={60} rx={6} fill="#4b5563" {...stroke(2.2)} />
      <rect x={-13} y={-24} width={26} height={44} rx={3} fill={C.sky} {...stroke(1.6)} />
      {number && (
        <text x={0} y={-8} textAnchor="middle" fontFamily={FONT} fontSize={11} fill={C.redDark}>
          {number}
        </text>
      )}
      <circle cx={0} cy={8} r={7} fill={crossed ? C.redDark : GREEN} {...stroke(1.6)} />
      <path
        d="M-3 5 c0 4 2 6 6 6 l1 -1.5 -2 -1.5 -1 1 c-1 -.4 -1.8 -1.2 -2.2 -2.2 l1 -1 -1.5 -2 Z"
        fill={C.white}
      />
      {crossed && <RedX x={0} y={-6} r={9} />}
    </g>
  );
}

const lying = (x: number, y: number, k = 0.5) => (
  <g transform={`translate(${x} ${y})`}>
    <NamOnBack k={k} />
  </g>
);
const chestOf = (x: number, k = 0.5) => x + LYING_CHEST_DX * k * LOOKS.nam.scale;
const faceOf = (x: number, k = 0.5) => x - 62 * k * LOOKS.nam.scale;

/** Ông Nội with the stroke look: drooping mouth, weak left arm. */
const strokeNam = (p: Who) => nam({ eyes: 'worried', mouth: 'droop', armL: 'limp', ...p });

export const STROKE_ART = {
  /* ── 3.1 ── */
  'st-yawn': () => (
    <Pic>
      <Sofa y={62} />
      {nam({ pose: 'sit', x: 50, y: 62, scale: 0.6, eyes: 'closed', mouth: 'open' })}
      <Txt x={78} y={22} size={11} color={C.blueDark}>
        z z
      </Txt>
    </Pic>
  ),
  'st-face-droop': () => (
    <Pic vb="8 4 84 84">
      <Sofa y={74} w={90} />
      {strokeNam({ pose: 'sit', x: 44, y: 74, scale: 0.7 })}
      <SlurBubble x={72} y={20} s={0.62} />
      <ellipse
        cx={44}
        cy={50}
        rx={7}
        ry={5}
        fill="none"
        stroke={C.redDark}
        strokeWidth={1.6}
        strokeDasharray="3 2"
      />
    </Pic>
  ),
  'st-stomach': () => (
    <Pic>
      <Sofa y={62} />
      {nam({
        pose: 'sit',
        x: 50,
        y: 62,
        scale: 0.6,
        eyes: 'worried',
        mouth: 'frown',
        armR: 'belly',
        armL: 'belly',
      })}
      <path d="M62 50 l4 -3 M64 56 l5 0" {...stroke(1.6)} />
    </Pic>
  ),
  'st-call-icon': () => (
    <Pic bg="#eaf4f8">
      <PhoneScreen x={50} y={52} number="115" s={1.2} />
      <g transform="translate(62 68) rotate(-30)">
        <rect x={-4} y={-2} width={8} height={18} rx={4} fill={C.skin} {...stroke(1.8)} />
        <circle cx={0} cy={-2} r={4.2} fill={C.skin} {...stroke(1.8)} />
      </g>
    </Pic>
  ),
  'st-wait-30': () =>
    withTag(
      <Pic>
        <Sofa y={64} />
        {strokeNam({ pose: 'sit', x: 46, y: 64, scale: 0.58, tilt: 'down' })}
      </Pic>,
      <Tag label="30 phút" icon={<ClockIcon minutes={30} size={22} />} />,
    ),
  'st-car-keys': () => (
    <Pic floor={88}>
      {strokeNam({ x: 46, y: 92, scale: 0.55, armR: 'point' })}
      <CarKeys x={20} y={56} s={1.3} />
    </Pic>
  ),
  'st-sneeze': () => (
    <Pic>
      <rect x={58} y={8} width={34} height={44} fill={C.sky} {...stroke(2)} />
      <path d="M75 8 V52 M58 30 H92" {...stroke(1.6)} />
      {[66, 72, 80, 86, 70].map((dx, i) => (
        <circle key={dx} cx={dx - 18} cy={26 + i * 4} r={1.2} fill="#b9a98a" />
      ))}
      {nam({ x: 36, y: 98, scale: 0.55, eyes: 'closed', mouth: 'o', armR: 'nose' })}
      <path d="M50 36 l8 -3 M51 41 h9 M50 46 l8 3" {...stroke(1.6)} />
    </Pic>
  ),
  'st-balance': () => (
    <Pic floor={88}>
      <g transform="rotate(10 50 92)">
        {nam({ x: 50, y: 92, scale: 0.55, eyes: 'worried', mouth: 'frown', armR: 'shoulder' })}
      </g>
      {/* blurred vision on one side */}
      <ellipse cx={58} cy={30} rx={10} ry={7} fill={C.white} opacity={0.75} />
      <Sway x={22} y={40} flip />
      <Sway x={80} y={44} />
    </Pic>
  ),
  'st-plate': () => (
    <Pic>
      {nam({ pose: 'sit', x: 38, y: 62, scale: 0.58, eyes: 'open', mouth: 'o' })}
      <SideTable x={78} y={96} />
      <ellipse cx={78} cy={64} rx={15} ry={4.5} fill={C.white} {...stroke(1.8)} />
      <path d="M69 63 q4 -7 9 -1 q5 -6 9 1" fill="#f6e2a6" {...stroke(1.4)} />
    </Pic>
  ),
  'st-stand-alone': () => (
    <Pic floor={88}>
      <g transform="rotate(-11 50 92)">{strokeNam({ x: 50, y: 92, scale: 0.55 })}</g>
      <Sway x={18} y={36} flip />
      <Sway x={78} y={40} />
    </Pic>
  ),
  'st-run-room': () => (
    <Pic floor={88}>
      <g transform="rotate(-10 62 92)">{strokeNam({ x: 62, y: 92, scale: 0.5, eyes: 'dizzy' })}</g>
      {player({ x: 28, y: 92, scale: 0.5, armL: 'point', eyes: 'open', mouth: 'open' })}
      <Speed x={90} y={50} flip />
      <path d="M10 80 H40 M34 75 L40 80 L34 85" fill="none" stroke={C.blueDark} strokeWidth={2.4} />
    </Pic>
  ),
  'st-rest-safe': () => (
    <Pic>
      <Sofa y={64} w={92} />
      {strokeNam({ pose: 'sit', x: 36, y: 64, scale: 0.52 })}
      {player({
        pose: 'sit',
        x: 70,
        y: 66,
        scale: 0.46,
        armR: 'shoulder',
        eyes: 'open',
        mouth: 'smile',
      })}
      <path
        d="M84 16 q4 -4 8 0 q4 -4 8 0 q0 6 -8 10 q-8 -4 -8 -10 Z"
        transform="translate(-8 0)"
        fill={C.red}
        {...stroke(1.4)}
      />
    </Pic>
  ),

  /* ── 3.2 ── */
  'st-point-tv': () => (
    <Pic floor={86}>
      <rect x={52} y={20} width={40} height={30} rx={3} fill="#56616d" {...stroke(2)} />
      <rect x={55} y={23} width={34} height={24} rx={2} fill="#9fd8ef" />
      <path d="M55 41 Q64 35 72 39 Q80 34 89 39 V47 H55 Z" fill={C.grass} />
      <rect x={54} y={50} width={36} height={22} rx={2} fill={C.wood} {...stroke(2)} />
      {player({ x: 26, y: 92, scale: 0.52, armL: 'point', eyes: 'open', mouth: 'open' })}
    </Pic>
  ),
  'st-address-card': () => (
    <Pic bg="#eaf4f8">
      <rect x={8} y={14} width={84} height={72} rx={7} fill="#fff1c2" {...stroke(2.2)} />
      <g transform="translate(13 18)">
        <PinIcon size={18} />
      </g>
      <Txt x={34} y={30} anchor="start" size={10} color={C.redDark}>
        Địa chỉ nhà
      </Txt>
      <path d="M14 40 H86" stroke={INK} strokeWidth={1} opacity={0.3} />
      <Txt x={16} y={52} anchor="start" size={8.5}>
        • méo miệng
      </Txt>
      <Txt x={16} y={64} anchor="start" size={8.5}>
        • yếu tay
      </Txt>
      <Txt x={16} y={76} anchor="start" size={8.5}>
        • nói khó
      </Txt>
      <g transform="translate(66 50) scale(0.55)">
        <Head look={LOOKS.nam} face={{ eyes: 'worried', mouth: 'droop' }} />
      </g>
    </Pic>
  ),
  'st-hangup': () => (
    <Pic bg="#eaf4f8">
      <PhoneScreen x={50} y={54} s={1.1} crossed />
      <Bubble x={58} y={8} w={36} h={18}>
        <Txt x={76} y={21} size={11}>
          ...
        </Txt>
      </Bubble>
    </Pic>
  ),
  'st-timeline': () => (
    <Pic bg="#eaf4f8">
      <path d="M14 66 H86" {...stroke(2.4)} />
      <circle cx={24} cy={66} r={4} fill={GREEN} {...stroke(1.6)} />
      <circle cx={76} cy={66} r={4} fill={C.red} {...stroke(1.6)} />
      <path d="M44 66 h12 M52 62 l4 4 -4 4" fill="none" stroke={C.blueDark} strokeWidth={2.2} />
      <NamHead x={24} y={36} s={0.55} eyes="open" mouth="smile" />
      <NamHead x={76} y={36} s={0.55} eyes="worried" mouth="droop" />
      <Txt x={24} y={84} size={11}>
        8:20
      </Txt>
      <Txt x={76} y={84} size={11} color={C.redDark}>
        8:25
      </Txt>
    </Pic>
  ),
  'st-blurry-times': () => (
    <Pic bg="#eaf4f8">
      {[
        ['6:00?', 22, 26, 0.35],
        ['7:30?', 66, 22, 0.5],
        ['5:45?', 30, 58, 0.45],
        ['?', 74, 60, 0.7],
        ['8:0?', 50, 86, 0.3],
      ].map(([t, x, y, o]) => (
        <text
          key={String(t)}
          x={Number(x)}
          y={Number(y)}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={16}
          fill={INK}
          opacity={Number(o)}
          style={{ filter: 'blur(0.6px)' }}
        >
          {t}
        </text>
      ))}
    </Pic>
  ),
  'st-clock-crossed': () => (
    <span className="relative grid h-full w-full place-items-center bg-[#eaf4f8]">
      <ClockIcon minutes={25} size={64} />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <RedX x={50} y={50} r={30} />
      </svg>
    </span>
  ),
  'st-random-time': () => (
    <Pic bg="#eaf4f8">
      <PhoneScreen x={40} y={52} number="7:13" s={1.1} />
      <g transform="translate(76 66) rotate(14)">
        <rect x={-10} y={-10} width={20} height={20} rx={4} fill={C.white} {...stroke(2)} />
        {[
          [-5, -5],
          [5, 5],
          [0, 0],
          [5, -5],
          [-5, 5],
        ].map(([dx, dy]) => (
          <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={1.6} fill={INK} />
        ))}
      </g>
      <Txt x={78} y={34} size={16} color={C.redDark}>
        ?
      </Txt>
    </Pic>
  ),
  'st-blank-hangup': () => (
    <Pic bg="#eaf4f8">
      <rect x={10} y={14} width={46} height={66} rx={5} fill={C.white} {...stroke(2)} />
      {[28, 40, 52, 64].map((y) => (
        <path
          key={y}
          d={`M17 ${y} H49`}
          stroke={INK}
          strokeWidth={1.2}
          strokeDasharray="3 3"
          opacity={0.5}
        />
      ))}
      <PhoneScreen x={74} y={56} s={0.8} crossed />
    </Pic>
  ),
  'st-unknown': () => (
    <Pic bg="#eaf4f8">
      {player({ x: 26, y: 100, scale: 0.46, armR: 'phone', eyes: 'open', mouth: 'open' })}
      <Bubble x={44} y={8} w={50} h={22}>
        <Txt x={69} y={23} size={11}>
          “chưa rõ”
        </Txt>
      </Bubble>
      <rect x={52} y={46} width={40} height={42} rx={4} fill="#fff1c2" {...stroke(2)} />
      <Txt x={72} y={60} size={7.5}>
        Người
      </Txt>
      <Txt x={72} y={70} size={7.5}>
        chứng kiến
      </Txt>
      <path d="M58 79 H86" stroke={INK} strokeWidth={1.2} opacity={0.5} />
    </Pic>
  ),
  'st-stay-speaker': () => (
    <Pic>
      <Sofa y={64} w={92} />
      {strokeNam({ pose: 'sit', x: 34, y: 64, scale: 0.52 })}
      {player({
        pose: 'sit',
        x: 70,
        y: 66,
        scale: 0.46,
        armR: 'phone',
        eyes: 'open',
        mouth: 'flat',
      })}
      <path
        d="M88 18 q4 4 0 8 M92 14 q7 8 0 16"
        fill="none"
        stroke={C.blueDark}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Txt x={80} y={12} size={8} color={C.redDark}>
        115
      </Txt>
    </Pic>
  ),
  'st-stairs': () => (
    <Pic>
      <path d="M-2 34 H22 V50 H42 V66 H62 V82 H82 V100 H-2 Z" fill={C.wood} {...stroke(2)} />
      <g transform="rotate(-8 34 50)">{strokeNam({ x: 34, y: 50, scale: 0.4 })}</g>
      <Sway x={56} y={20} />
    </Pic>
  ),
  'st-alone-room': () => (
    <Pic floor={80}>
      <rect x={70} y={22} width={24} height={58} rx={2} fill={C.woodDark} {...stroke(2)} />
      <circle cx={75} cy={52} r={2} fill={C.yellow} {...stroke(1)} />
      <Sofa x={34} y={62} w={60} />
      {strokeNam({ pose: 'sit', x: 34, y: 62, scale: 0.46 })}
      <path d="M72 92 l5 -3 M84 92 l5 -3" stroke={INK} strokeWidth={2} strokeDasharray="2 2" />
    </Pic>
  ),

  /* ── 3.3 ── */
  'st-lan-cup': () => (
    <Pic>
      <Sofa x={34} y={64} w={60} />
      {strokeNam({ pose: 'sit', x: 32, y: 64, scale: 0.5 })}
      {lan({ x: 74, y: 104, scale: 0.5, armR: 'point', eyes: 'open', mouth: 'open' })}
      <Cup x={54} y={44} s={1.4} />
    </Pic>
  ),
  'st-cup-table': () => (
    <Pic>
      <SideTable x={50} y={100} />
      <Cup x={50} y={60} s={2} />
      <g transform="translate(64 56)">
        <ellipse cx={0} cy={0} rx={9} ry={7} fill={LOOKS.player.skin} {...stroke(2)} />
        <path d="M6 -2 L22 -10" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
        <path d="M6 -2 L22 -10" fill="none" {...stroke(1.6)} opacity={0.4} />
      </g>
      <path
        d="M50 30 v-10 M44 33 l-6 -6 M56 33 l6 -6"
        stroke={GREEN}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Pic>
  ),
  'st-straw': () => (
    <Pic bg="#fff7e6">
      <NamHead x={42} y={46} s={1.25} eyes="worried" mouth="droop" />
      <g transform="translate(72 74)">
        <path d="M-9 -12 H9 L7 12 H-7 Z" fill={C.white} opacity={0.9} {...stroke(1.8)} />
        <path d="M-8 -4 H8 L7 12 H-7 Z" fill="#9fd8ef" />
      </g>
      <path d="M74 62 L50 66" stroke={C.red} strokeWidth={3.4} strokeLinecap="round" />
      <path d="M74 62 L50 66" stroke={INK} strokeWidth={0.8} />
      <circle cx={90} cy={58} r={6} fill={LOOKS.lan.skin} {...stroke(1.8)} />
    </Pic>
  ),
  'st-aspirin-table': () => (
    <Pic>
      <SideTable x={46} y={100} />
      <Aspirin x={46} y={64} s={1.5} />
      <g transform="translate(80 50)">
        <ellipse cx={0} cy={0} rx={8} ry={7} fill={LOOKS.player.skin} {...stroke(2)} />
      </g>
      <path
        d="M68 40 l12 -8 M74 46 l12 -4"
        stroke={C.blueDark}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Pic>
  ),
  'st-aspirin-hand': () => (
    <Pic>
      <Sofa x={34} y={64} w={60} />
      {strokeNam({ pose: 'sit', x: 32, y: 64, scale: 0.5, armR: 'hold' })}
      {lan({ x: 76, y: 104, scale: 0.5, armR: 'point', eyes: 'open', mouth: 'open' })}
      <Aspirin x={52} y={48} s={0.9} rot={-10} />
    </Pic>
  ),
  'st-aspirin-two': () =>
    withTag(
      <Pic bg="#fff7e6">
        <g transform="translate(50 62)">
          <ellipse cx={0} cy={6} rx={22} ry={11} fill={LOOKS.lan.skin} {...stroke(2)} />
          <path d="M-18 0 q-4 -8 2 -10 M-8 -4 q0 -8 6 -8" fill="none" {...stroke(1.6)} />
        </g>
        <Pill x={44} y={60} />
        <Pill x={56} y={58} />
        <Aspirin x={26} y={26} s={1.1} rot={-12} />
      </Pic>,
      <Tag label="x2" />,
    ),
  'st-walk-lean': () => (
    <Pic floor={88}>
      <g transform="rotate(14 46 92)">{strokeNam({ x: 46, y: 92, scale: 0.55 })}</g>
      <Sway x={20} y={38} flip />
      <path d="M70 84 h18 M84 80 l4 4 -4 4" fill="none" stroke={C.blueDark} strokeWidth={2.2} />
    </Pic>
  ),
  'st-pull-up': () => (
    <Pic>
      <Sofa x={30} y={70} w={56} />
      <g transform="rotate(14 32 70)">{strokeNam({ pose: 'sit', x: 32, y: 70, scale: 0.5 })}</g>
      {lan({ x: 76, y: 104, scale: 0.5, armR: 'point', eyes: 'worried', mouth: 'open' })}
      <path d="M56 40 h-10 M50 35 l-5 5 5 5" fill="none" stroke={C.redDark} strokeWidth={2.4} />
    </Pic>
  ),
  'st-rest-watch': () => (
    <Pic>
      <Sofa y={64} w={92} />
      {strokeNam({ pose: 'sit', x: 34, y: 64, scale: 0.52, eyes: 'closed' })}
      {player({
        pose: 'sit',
        x: 70,
        y: 66,
        scale: 0.46,
        armR: 'phone',
        eyes: 'open',
        mouth: 'flat',
      })}
      <path d="M48 20 q4 -3 8 0" fill="none" stroke={C.blueDark} strokeWidth={2} />
    </Pic>
  ),
  'st-amb-cancel': () => (
    <span className="relative grid h-full w-full place-items-center bg-[#eaf4f8]">
      <AmbulanceIcon size={70} />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx={50} cy={50} r={34} fill="none" stroke={C.redDark} strokeWidth={5} />
        <path d="M26 74 L74 26" stroke={C.redDark} strokeWidth={5} strokeLinecap="round" />
      </svg>
    </span>
  ),
  'st-amb-coming': () =>
    withTag(
      <span className="relative grid h-full w-full place-items-center bg-[#eaf4f8]">
        <AmbulanceIcon size={66} />
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
          <Speed x={18} y={50} />
        </svg>
        <span className="absolute bottom-1 rounded-full border-2 border-navy bg-white px-1 font-display text-[9px] leading-tight text-navy">
          Đang đến
        </span>
      </span>,
      <Tag pos="tl" icon={<PhoneIcon size={22} />} />,
    ),
  'st-keys-better': () => (
    <Pic floor={88}>
      {nam({ x: 46, y: 92, scale: 0.55, armR: 'point', eyes: 'open', mouth: 'smile' })}
      <CarKeys x={20} y={56} s={1.3} />
    </Pic>
  ),

  /* ── 3.4 ── */
  'st-shake': () => (
    <Pic>
      <Sofa x={42} y={66} w={70} />
      {nam({
        pose: 'sit',
        x: 42,
        y: 66,
        scale: 0.52,
        eyes: 'closed',
        mouth: 'droop',
        tilt: 'down',
        armL: 'limp',
      })}
      {player({ x: 82, y: 108, scale: 0.5, armR: 'point', eyes: 'worried', mouth: 'open' })}
      <Sway x={14} y={22} flip />
      <Sway x={66} y={20} />
    </Pic>
  ),
  'st-check-breath': () => (
    <Pic>
      <Sofa x={34} y={66} w={60} />
      {nam({
        pose: 'sit',
        x: 32,
        y: 66,
        scale: 0.5,
        eyes: 'closed',
        mouth: 'droop',
        tilt: 'down',
        armL: 'limp',
      })}
      <BreathMarks x={40} y={34} mode="normal" s={0.8} />
      {lan({ x: 78, y: 106, scale: 0.48, armL: 'phone', eyes: 'worried', mouth: 'open' })}
      <Txt x={88} y={14} size={8} color={C.redDark}>
        115
      </Txt>
    </Pic>
  ),
  'st-water-unconscious': () => (
    <Pic bg="#fff7e6">
      <NamHead x={40} y={48} s={1.2} eyes="closed" mouth="droop" />
      <g transform="translate(72 62) rotate(-40)">
        <path d="M-8 -11 H8 L6 11 H-6 Z" fill={C.white} opacity={0.9} {...stroke(1.8)} />
        <path d="M-7 -3 H7 L6 11 H-6 Z" fill="#9fd8ef" />
      </g>
      <path d="M62 66 q-6 2 -12 0" stroke="#7fbfd8" strokeWidth={2} fill="none" />
    </Pic>
  ),
  'st-recovery': () => (
    <Pic floor={72}>
      <g transform="translate(62 70)">
        <NamRecovery k={0.5} />
      </g>
      <BreathMarks x={16} y={50} mode="normal" s={0.9} />
    </Pic>
  ),
  'st-cpr-breathing': () => (
    <Pic floor={56}>
      {lying(64, 72)}
      <PressingHands x={chestOf(64)} y={70} />
      <BreathMarks x={faceOf(64) - 12} y={60} mode="normal" s={0.9} />
    </Pic>
  ),
  'st-pour-water': () => (
    <Pic floor={56}>
      {lying(64, 72)}
      <g transform={`translate(${faceOf(64) + 2} 50) rotate(120)`}>
        <path d="M-6 -9 H6 L5 9 H-5 Z" fill={C.white} opacity={0.9} {...stroke(1.6)} />
      </g>
      <path
        d={`M${faceOf(64) - 2} 56 q-1 6 0 10`}
        stroke="#7fbfd8"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </Pic>
  ),
  'st-wait-gasp': () =>
    withTag(
      <Pic floor={56}>
        {lying(64, 72)}
        <BreathMarks x={faceOf(64) - 12} y={60} mode="gasping" s={1} />
      </Pic>,
      <Tag label="Chờ..." icon={<ClockIcon minutes={10} size={22} />} />,
    ),
  'st-cpr-aed': () => (
    <Pic floor={56}>
      {lying(60, 74)}
      <PressingHands x={chestOf(60)} y={72} />
      <AedBox x={86} y={88} s={0.85} />
      <g transform="translate(84 28)">
        <PhoneScreen x={0} y={0} s={0.45} number="115" />
      </g>
      <path d="M94 20 q3 3 0 6" fill="none" stroke={C.blueDark} strokeWidth={1.6} />
    </Pic>
  ),
  'st-aspirin-mouth': () => (
    <Pic floor={56}>
      {lying(64, 72)}
      <Aspirin x={faceOf(64) + 4} y={50} s={0.9} rot={-15} />
    </Pic>
  ),
  'st-say-fainted': () => (
    <Pic bg="#eaf4f8">
      <Bubble x={14} y={22} w={72} h={40}>
        <Txt x={50} y={48} size={14}>
          “Ông ngất.”
        </Txt>
      </Bubble>
    </Pic>
  ),
  'st-long-talk': () => (
    <Pic bg="#eaf4f8">
      <Bubble x={6} y={8} w={88} h={70}>
        {[22, 32, 42, 52, 62].map((y, i) => (
          <path
            key={y}
            d={`M14 ${y} H${i === 4 ? 56 : 86}`}
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.45}
          />
        ))}
        <ellipse cx={74} cy={62} rx={8} ry={3} fill={C.white} {...stroke(1.4)} />
        <path d="M67 61 q3 -6 7 -1 q4 -5 7 1" fill="#f6e2a6" {...stroke(1.2)} />
      </Bubble>
    </Pic>
  ),
  'st-handover-card': () => (
    <Pic bg="#eaf4f8">
      <rect x={8} y={8} width={84} height={84} rx={7} fill="#fff1c2" {...stroke(2.2)} />
      <Txt x={14} y={24} anchor="start" size={9}>
        ✓ 8:20 bình thường
      </Txt>
      <Txt x={14} y={38} anchor="start" size={9} color={C.redDark}>
        ⚠ 8:25 dấu hiệu
      </Txt>
      <Txt x={14} y={52} anchor="start" size={9}>
        ↘ lịm đi
      </Txt>
      <Txt x={14} y={66} anchor="start" size={9}>
        〰 thở ngáp cá
      </Txt>
      <Txt x={14} y={80} anchor="start" size={9}>
        ♥ CPR theo 115
      </Txt>
    </Pic>
  ),
} satisfies Record<string, () => React.ReactNode>;
