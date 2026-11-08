/* eslint-disable react-refresh/only-export-components -- art module: drawing helpers + the option art map */
import { Grapes, WaterGlass } from '../../art/DiningRoom';
import { AmbulanceIcon, ClockIcon, PhoneIcon } from '../../art/icons';
import { C, INK, stroke, type Pt } from '../../art/ink';
import { LOOKS } from '../../art/looks';
import { Head, Person, type PersonProps } from '../../art/Person';
import { LyingPerson, PressingHands } from '../../art/WaterScenes';

/* Answer illustrations for scenario 4 (choking), drawn with the same characters as the dining
 * room stage. They show what the option does, never whether it is right. */

const BG = '#eef3df';
const FLOOR = '#ddb688';

type Pose = Omit<PersonProps, 'kind' | 'x' | 'y'>;

function Pic({
  bg = BG,
  floor,
  children,
}: {
  bg?: string;
  floor?: number;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width={100} height={100} fill={bg} />
      {floor !== undefined && (
        <>
          <rect y={floor} width={100} height={100 - floor} fill={FLOOR} />
          <path d={`M0 ${floor} H100`} {...stroke(1.8)} />
        </>
      )}
      {children}
    </svg>
  );
}

/** Brother (standing: x, y = floor point; sitting: hips). Scale 0.78 → 0.62 of the stage size. */
const bro = (x: number, y: number, p: Pose = {}) => (
  <Person kind="brother" x={x} y={y} scale={0.78} {...p} />
);
const player = (x: number, y: number, p: Pose = {}) => (
  <Person kind="player" x={x} y={y} scale={0.62} eyes="worried" mouth="flat" {...p} />
);

/** Brother sitting at the table, the table top covering his lap. */
const atTable = (x: number, p: Pose, extra?: React.ReactNode) => (
  <>
    {bro(x, 80, { pose: 'sit', ...p })}
    <Table y={76} />
    {extra}
  </>
);

function Table({ y }: { y: number }) {
  return (
    <g>
      <rect x={-2} y={y} width={104} height={6} rx={2} fill={C.wood} {...stroke(2)} />
      <rect x={4} y={y + 6} width={92} height={30} fill="#f6efe0" {...stroke(1.8)} />
      <path d={`M10 ${y + 11} H90`} stroke={C.red} strokeWidth={1.4} strokeDasharray="4 3" />
    </g>
  );
}

/** "khụ khụ" puffs next to a mouth. */
function Cough({ x, y, weak, big }: { x: number; y: number; weak?: boolean; big?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text
        fontFamily="Itim, sans-serif"
        fontSize={weak ? 8 : big ? 13 : 10}
        fill={weak ? '#7a6a8c' : C.redDark}
        stroke={C.white}
        strokeWidth={2.4}
        paintOrder="stroke"
      >
        {weak ? 'khụ…' : 'khụ!'}
      </text>
      {!weak && (
        <path
          d="M-3 -6 l-5 -2 M-3 -2 l-6 0 M-3 2 l-5 2"
          stroke={INK}
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/** Rounded speech bubble with its tail at (tx, ty); `cross` strikes it through (no voice). */
function Bubble({
  x,
  y,
  w = 22,
  h = 16,
  tail,
  children,
  cross,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  tail: Pt;
  children?: React.ReactNode;
  cross?: boolean;
}) {
  return (
    <g>
      <path
        d={`M${x + w * 0.35} ${y + h} L${tail.x} ${tail.y} L${x + w * 0.6} ${y + h} Z`}
        fill={C.white}
        {...stroke(1.6)}
      />
      <rect x={x} y={y} width={w} height={h} rx={6} fill={C.white} {...stroke(1.8)} />
      <g transform={`translate(${x + w / 2} ${y + h / 2})`}>{children}</g>
      {cross && <Cross x={x + w / 2} y={y + h / 2} r={9} />}
    </g>
  );
}

function Txt({
  children,
  size = 11,
  color = INK,
}: {
  children: string;
  size?: number;
  color?: string;
}) {
  return (
    <text
      y={size * 0.36}
      textAnchor="middle"
      fontFamily="Itim, sans-serif"
      fontSize={size}
      fill={color}
    >
      {children}
    </text>
  );
}

function Cross({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return (
    <path
      d={`M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}`}
      stroke={C.red}
      strokeWidth={3.2}
      strokeLinecap="round"
    />
  );
}

function Arrow({
  from,
  to,
  color = C.blueDark,
  dashed,
}: {
  from: Pt;
  to: Pt;
  color?: string;
  dashed?: boolean;
}) {
  const a = Math.atan2(to.y - from.y, to.x - from.x);
  const h = 4.5;
  const l = { x: to.x - h * Math.cos(a - 0.6), y: to.y - h * Math.sin(a - 0.6) };
  const r = { x: to.x - h * Math.cos(a + 0.6), y: to.y - h * Math.sin(a + 0.6) };
  return (
    <g stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path
        d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
        strokeDasharray={dashed ? '3 3' : undefined}
      />
      <path d={`M${l.x} ${l.y} L${to.x} ${to.y} L${r.x} ${r.y}`} />
    </g>
  );
}

function Burst({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${r})`}
      d="M0 -9 L2.4 -3 L8.5 -4.5 L4 1 L8.5 5.5 L2.4 4 L0 10 L-2.4 4 L-8.5 5.5 L-4 1 L-8.5 -4.5 L-2.4 -3 Z"
      fill={C.yellow}
      {...stroke(1.4)}
    />
  );
}

function Motion({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <path
      d={`M${x} ${y} h${7 * s} M${x + 2 * s} ${y + 5} h${9 * s} M${x} ${y + 10} h${7 * s}`}
      stroke={INK}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  );
}

/** Open palm held up: "stop!". */
function StopHand({ x, y, r = 1 }: { x: number; y: number; r?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r})`}>
      <circle r={11} fill={C.white} {...stroke(2)} />
      <path
        d="M-5 6 V-2 M-2 6 V-8 M1.5 6 V-8 M5 6 V-6"
        stroke={C.skin}
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      <path d="M-6 7 H6" stroke={C.skin} strokeWidth={5} strokeLinecap="round" />
      <path
        d="M-5 6 V-2 M-2 6 V-8 M1.5 6 V-8 M5 6 V-6"
        stroke={INK}
        strokeWidth={0.6}
        opacity={0.4}
      />
    </g>
  );
}

/** Corner label (HTML, like the other scenarios) with an optional icon. */
function Tag({
  label,
  icon,
  pos = 'tr',
}: {
  label: string;
  icon?: React.ReactNode;
  pos?: 'tr' | 'tl';
}) {
  return (
    <span
      className={`absolute ${pos === 'tr' ? 'right-0.5' : 'left-0.5'} top-0.5 flex flex-col items-center`}
    >
      {icon}
      <span className="-mt-0.5 whitespace-nowrap rounded-full border-2 border-navy bg-white px-1 font-display text-[9px] leading-tight text-navy">
        {label}
      </span>
    </span>
  );
}

const withTag = (art: React.ReactNode, tag: React.ReactNode) => (
  <>
    {art}
    {tag}
  </>
);

/** Big close-up of the brother's face with the mouth open (what goes into it is drawn on top). */
function FaceCloseup({
  children,
  eyes = 'worried',
}: {
  children?: React.ReactNode;
  eyes?: 'worried' | 'wide';
}) {
  return (
    <Pic>
      <path
        d="M22 100 Q20 80 36 74 H64 Q80 80 78 100 Z"
        fill={LOOKS.brother.shirt}
        {...stroke(2.2)}
      />
      <g transform="translate(50 44) scale(1.45)">
        <Head look={LOOKS.brother} face={{ eyes, mouth: 'open' }} />
      </g>
      {children}
    </Pic>
  );
}

/** Hand coming from the right with the index finger pushed deep into the mouth. */
function HookFinger({ sleeve = C.red }: { sleeve?: string }) {
  return (
    <g>
      <path d="M100 74 L74 66" stroke={INK} strokeWidth={13} strokeLinecap="round" />
      <path d="M100 74 L74 66" stroke={sleeve} strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={70} cy={66} rx={9} ry={7} fill={C.skin} {...stroke(2)} />
      <path
        d="M64 63 Q56 62 52 66"
        fill="none"
        stroke={INK}
        strokeWidth={6.5}
        strokeLinecap="round"
      />
      <path
        d="M64 63 Q56 62 52 66"
        fill="none"
        stroke={C.skin}
        strokeWidth={3.8}
        strokeLinecap="round"
      />
      <Arrow from={{ x: 62, y: 76 }} to={{ x: 50, y: 70 }} color={C.redDark} />
    </g>
  );
}

/** Lying on the floor seen from above (head on the left); (x, y) = hips. */
const lying = (x: number, y: number, awake?: boolean, k = 0.72) => (
  <g transform={`translate(${x} ${y})`}>
    <LyingPerson kind="brother" k={k} awake={awake} />
  </g>
);
/** Chest of the lying brother drawn by `lying(x, y)`. */
const chestOf = (x: number, k = 0.72) => x - 20 * k * LOOKS.brother.scale;

/** Player standing behind the brother, slightly to one side, slapping between the shoulder blades. */
function BackBlows({ times }: { times?: string }) {
  return (
    <>
      {player(62, 96, { armR: 'wave' })}
      {bro(48, 100, { tilt: 'down', eyes: 'wide', mouth: 'o', sweat: true })}
      <circle cx={54} cy={60} r={3.6} fill={C.skin} {...stroke(1.6)} />
      <Burst x={60} y={56} />
      <Motion x={30} y={24} />
      {times && (
        <text
          x={86}
          y={20}
          textAnchor="middle"
          fontFamily="Itim, sans-serif"
          fontSize={14}
          fill={C.redDark}
        >
          {times}
        </text>
      )}
    </>
  );
}

/** Player right behind with the fist on the upper belly, pulling in and up. */
function Thrusts() {
  const fist = { x: 48, y: 72 };
  return (
    <>
      {player(52, 94)}
      {bro(48, 100, { eyes: 'wide', mouth: 'o', sweat: true })}
      <path
        d={`M${fist.x - 14} ${fist.y - 4} L${fist.x - 3} ${fist.y}`}
        stroke={INK}
        strokeWidth={7.5}
        strokeLinecap="round"
      />
      <path
        d={`M${fist.x - 14} ${fist.y - 4} L${fist.x - 3} ${fist.y}`}
        stroke={C.skin}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <path
        d={`M${fist.x + 14} ${fist.y - 4} L${fist.x + 3} ${fist.y}`}
        stroke={INK}
        strokeWidth={7.5}
        strokeLinecap="round"
      />
      <path
        d={`M${fist.x + 14} ${fist.y - 4} L${fist.x + 3} ${fist.y}`}
        stroke={C.skin}
        strokeWidth={4.5}
        strokeLinecap="round"
      />
      <circle cx={fist.x} cy={fist.y} r={4.6} fill={C.skin} {...stroke(1.8)} />
      <Arrow from={{ x: 74, y: 84 }} to={{ x: 74, y: 64 }} color={C.redDark} />
    </>
  );
}

const glassIn = (x: number, y: number, k = 1) => <WaterGlass x={x} y={y} k={k} />;

export const CHOKE_ART = {
  /* ── 4.1 ── */
  'choke-ask': () => (
    <Pic>
      {atTable(64, { eyes: 'closed', mouth: 'open' })}
      {player(24, 102, { tilt: 'down', armL: 'shoulder' })}
      <Cough x={76} y={40} />
      <Bubble x={4} y={4} w={18} h={15} tail={{ x: 18, y: 26 }}>
        <Txt size={13} color={C.blueDark}>
          ?
        </Txt>
      </Bubble>
    </Pic>
  ),
  'choke-slap-hard': () => (
    <Pic>
      {player(66, 92, { armR: 'wave', eyes: 'wide', mouth: 'open' })}
      {atTable(48, { eyes: 'closed', mouth: 'open' })}
      <Burst x={58} y={60} r={1.2} />
      <Motion x={30} y={14} />
      <Cough x={8} y={36} />
    </Pic>
  ),
  'choke-drink-lots': () => (
    <Pic>
      {atTable(46, { armR: 'hold', eyes: 'closed', mouth: 'o' })}
      {glassIn(44, 72, 0.9)}
      {glassIn(72, 76, 1.1)}
      {glassIn(86, 76, 1.1)}
      <g transform="translate(14 76)">
        <path
          d="M-10 0 V-20 Q-10 -26 -4 -26 H4 Q10 -26 10 -20 V0 Z"
          fill="#cfe9ef"
          {...stroke(1.8)}
        />
        <path d="M-9 -12 H9 V0 H-9 Z" fill="#9fd3ea" opacity={0.8} />
        <path d="M10 -20 q6 2 4 10" fill="none" {...stroke(1.8)} />
      </g>
    </Pic>
  ),
  'choke-swallow-water': () => (
    <Pic>
      {atTable(50, { armR: 'hold', eyes: 'closed', mouth: 'o' })}
      {glassIn(48, 72, 0.9)}
      <Arrow from={{ x: 72, y: 34 }} to={{ x: 72, y: 62 }} />
    </Pic>
  ),
  'choke-keep-cough': () => (
    <Pic>
      {atTable(62, { eyes: 'closed', mouth: 'open' })}
      {player(22, 102, { eyes: 'open', armL: 'hip' })}
      <Cough x={74} y={40} big />
      <path d="M30 22 q4 -5 8 0 q-4 5 -8 0 Z" fill={C.white} {...stroke(1.4)} />
      <circle cx={34} cy={22} r={1.5} fill={INK} />
    </Pic>
  ),
  'choke-hold-breath': () => (
    <Pic>
      {atTable(50, { armR: 'nose', eyes: 'closed', mouth: 'flat', sweat: true })}
      <g transform="translate(78 38)">
        <path
          d="M-10 -4 q5 -4 10 0 t10 0 M-10 4 q5 -4 10 0 t10 0"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={1.8}
        />
        <Cross x={0} y={0} r={8} />
      </g>
    </Pic>
  ),
  'choke-cheer-cough': () => (
    <Pic>
      {atTable(64, { eyes: 'closed', mouth: 'open' })}
      {player(22, 102, { eyes: 'open', mouth: 'open', armL: 'point' })}
      <Cough x={74} y={40} />
      <Bubble x={2} y={2} w={30} h={15} tail={{ x: 18, y: 24 }}>
        <Txt size={8}>Ho tiếp!</Txt>
      </Bubble>
    </Pic>
  ),
  'choke-watch-breath': () => (
    <Pic>
      {atTable(56, { eyes: 'closed', mouth: 'open' })}
      <Arrow from={{ x: 88, y: 30 }} to={{ x: 72, y: 40 }} />
      <Arrow from={{ x: 72, y: 48 }} to={{ x: 88, y: 56 }} color={C.green} />
      <g transform="translate(20 28)">
        <path d="M-12 0 Q0 -10 12 0 Q0 10 -12 0 Z" fill={C.white} {...stroke(1.8)} />
        <circle r={4} fill={INK} />
        <circle cx={1.4} cy={-1.4} r={1.2} fill={C.white} />
      </g>
    </Pic>
  ),
  'choke-finger-sweep': () => (
    <FaceCloseup eyes="wide">
      <HookFinger />
    </FaceCloseup>
  ),
  'choke-wait': () =>
    withTag(
      <Pic>
        {atTable(50, { eyes: 'worried', mouth: 'o', armL: 'throat', sweat: true })}
        <Cough x={64} y={36} weak />
      </Pic>,
      <Tag label="Chờ tiếp" icon={<ClockIcon minutes={40} size={22} />} />,
    ),
  'choke-lie-rest': () => (
    <Pic floor={40}>
      <rect x={8} y={62} width={86} height={22} rx={8} fill={C.sofa} {...stroke(2)} />
      <ellipse cx={20} cy={66} rx={10} ry={6} fill={C.white} {...stroke(1.6)} />
      {lying(60, 66, true)}
      <Cough x={20} y={50} weak />
    </Pic>
  ),
  'choke-reassess': () => (
    <Pic>
      {atTable(64, { eyes: 'worried', mouth: 'o', armL: 'throat', sweat: true })}
      {player(22, 102, { eyes: 'wide', mouth: 'o', armL: 'point' })}
      <Cough x={76} y={36} weak />
      <g transform="translate(14 16)">
        <circle r={9} fill={C.red} {...stroke(1.8)} />
        <path d="M0 -5 V1.5 M0 4.5 V5" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" />
      </g>
    </Pic>
  ),
  'choke-strong-cough': () => (
    <Pic floor={86}>
      {bro(46, 98, { eyes: 'closed', mouth: 'open' })}
      <Cough x={60} y={46} big />
      <Bubble x={58} y={6} w={38} h={15} tail={{ x: 60, y: 30 }}>
        <Txt size={7}>Em nói được</Txt>
      </Bubble>
      <Arrow from={{ x: 6, y: 34 }} to={{ x: 26, y: 40 }} />
    </Pic>
  ),
  'choke-cannot-speak': () => (
    <Pic floor={86}>
      {bro(46, 98, { eyes: 'wide', mouth: 'o', armR: 'throat', armL: 'throat', sweat: true })}
      <Bubble x={64} y={8} w={26} h={16} tail={{ x: 60, y: 30 }} cross>
        <Txt size={9}>…</Txt>
      </Bubble>
      <text
        x={14}
        y={30}
        fontFamily="Itim, sans-serif"
        fontSize={20}
        fill={C.red}
        stroke={INK}
        strokeWidth={1}
      >
        !
      </text>
    </Pic>
  ),
  'choke-mild-cough': () => (
    <Pic floor={86}>
      {bro(46, 98, { eyes: 'open', mouth: 'o' })}
      <Cough x={60} y={46} weak />
      <Bubble x={58} y={6} w={38} h={15} tail={{ x: 60, y: 30 }}>
        <Txt size={7}>Em nói được</Txt>
      </Bubble>
    </Pic>
  ),

  /* ── 4.2 ── */
  'water-down-stomach': () => (
    <Pic floor={88}>
      {bro(44, 100, { armR: 'hold', eyes: 'closed', mouth: 'o', sweat: true })}
      {glassIn(42, 80, 0.9)}
      <path
        d="M50 46 Q58 58 52 74"
        fill="none"
        stroke={C.blueDark}
        strokeWidth={2.4}
        strokeDasharray="3 3"
      />
      <Arrow from={{ x: 54, y: 66 }} to={{ x: 52, y: 76 }} />
      <ellipse cx={50} cy={80} rx={7} ry={5} fill="none" stroke={C.blueDark} strokeWidth={1.6} />
    </Pic>
  ),
  'stop-mom-water': () => (
    <Pic floor={88}>
      <Person kind="mom" x={84} y={100} scale={0.55} armR="hold" flip eyes="worried" mouth="open" />
      {glassIn(80, 64, 1)}
      {bro(20, 100, { armR: 'throat', armL: 'throat', eyes: 'wide', mouth: 'o' })}
      {player(52, 100, { eyes: 'open', mouth: 'open' })}
      <StopHand x={66} y={46} r={0.9} />
    </Pic>
  ),
  'small-sips': () =>
    withTag(
      <Pic floor={88}>
        {bro(44, 100, { armR: 'hold', eyes: 'closed', mouth: 'o', sweat: true })}
        <g transform="translate(43 78)">
          <path d="M-4 -9 H4 L3.4 0 H-3.4 Z" fill="#e4f2f7" {...stroke(1.4)} />
          <path d="M-3.6 -4 H3.6 L3.4 0 H-3.4 Z" fill="#9fd3ea" />
        </g>
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={58 + i * 6} cy={48 + i * 3} r={1.8} fill="#8fd0ea" {...stroke(0.8)} />
        ))}
      </Pic>,
      <Tag label="Từng ngụm" />,
    ),
  'grandma-finger': () => (
    <FaceCloseup eyes="wide">
      <HookFinger sleeve={LOOKS.grandma.shirt} />
    </FaceCloseup>
  ),
  'chopsticks-spoon': () => (
    <FaceCloseup eyes="wide">
      <g>
        <path
          d="M98 50 L56 62 M98 56 L56 66"
          stroke={INK}
          strokeWidth={4.5}
          strokeLinecap="round"
        />
        <path
          d="M98 50 L56 62 M98 56 L56 66"
          stroke={C.wood}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <path d="M100 88 L66 76" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M100 88 L66 76" stroke="#c9d1d8" strokeWidth={2.6} strokeLinecap="round" />
        <ellipse
          cx={62}
          cy={74}
          rx={6}
          ry={4}
          fill="#c9d1d8"
          {...stroke(1.6)}
          transform="rotate(20 62 74)"
        />
      </g>
    </FaceCloseup>
  ),
  'stop-grandma': () => (
    <Pic floor={88}>
      <Person
        kind="grandma"
        x={84}
        y={100}
        scale={0.6}
        armR="point"
        flip
        eyes="worried"
        mouth="open"
      />
      {bro(20, 100, { armR: 'throat', armL: 'throat', eyes: 'wide', mouth: 'o' })}
      {player(50, 100, { eyes: 'open', mouth: 'open' })}
      <StopHand x={66} y={44} r={0.9} />
      <g transform="translate(20 10)">
        <path d="M-10 0 Q0 -8 10 0 Q0 8 -10 0 Z" fill={C.white} {...stroke(1.6)} />
        <circle r={3.4} fill={INK} />
      </g>
    </Pic>
  ),
  'lie-back-wait': () =>
    withTag(
      <Pic floor={30}>
        {lying(56, 66)}
        <Cough x={4} y={50} weak />
      </Pic>,
      <Tag label="Chờ" icon={<ClockIcon minutes={30} size={22} />} />,
    ),
  'back-blows-5': () =>
    withTag(
      <Pic floor={88}>
        <BackBlows />
      </Pic>,
      <Tag label="Tối đa 5 lần" />,
    ),
  'try-swallow': () => (
    <Pic floor={88}>
      {bro(44, 100, { armR: 'throat', eyes: 'closed', mouth: 'flat', sweat: true })}
      <Arrow from={{ x: 66, y: 38 }} to={{ x: 66, y: 66 }} />
      <Bubble x={66} y={4} w={30} h={15} tail={{ x: 62, y: 28 }}>
        <Txt size={8}>Nuốt đi!</Txt>
      </Bubble>
    </Pic>
  ),
  'blows-nonstop': () =>
    withTag(
      <Pic floor={88}>
        <BackBlows />
        <Burst x={66} y={46} r={0.8} />
        <Burst x={62} y={70} r={0.7} />
      </Pic>,
      <Tag
        label="Vỗ mãi"
        icon={<span className="font-display text-lg leading-none text-primary-dark">∞</span>}
      />,
    ),
  'abdominal-thrusts-5': () =>
    withTag(
      <Pic floor={88}>
        <Thrusts />
      </Pic>,
      <Tag label="Tối đa 5 lần" />,
    ),
  'alternate-call-115': () =>
    withTag(
      <Pic floor={88}>
        <Thrusts />
        <g transform="translate(16 26)">
          <path d="M-10 0 A10 10 0 0 1 10 0" fill="none" stroke={C.green} strokeWidth={2.6} />
          <path
            d="M10 0 l-4 -2 M10 0 l2 -4"
            stroke={C.green}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <path d="M10 6 A10 10 0 0 1 -10 6" fill="none" stroke={C.green} strokeWidth={2.6} />
          <path
            d="M-10 6 l4 2 M-10 6 l-2 4"
            stroke={C.green}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <text
            x={0}
            y={6}
            textAnchor="middle"
            fontSize={7}
            fontFamily="Itim, sans-serif"
            fill={INK}
          >
            5+5
          </text>
        </g>
      </Pic>,
      <Tag label="115" icon={<PhoneIcon size={22} />} />,
    ),
  'stop-wait-cough': () =>
    withTag(
      <Pic floor={88}>
        {player(24, 100, { eyes: 'open' })}
        {bro(64, 100, { armR: 'throat', armL: 'throat', eyes: 'wide', mouth: 'o', sweat: true })}
      </Pic>,
      <Tag pos="tl" label="Dừng lại" icon={<ClockIcon minutes={30} size={22} />} />,
    ),
  'rest-15min': () =>
    withTag(
      <Pic floor={30}>
        <rect x={6} y={58} width={88} height={22} rx={8} fill={C.sofa} {...stroke(2)} />
        <ellipse cx={18} cy={62} rx={10} ry={6} fill={C.white} {...stroke(1.6)} />
        {lying(58, 64)}
      </Pic>,
      <Tag label="15 phút" icon={<ClockIcon minutes={15} size={22} />} />,
    ),

  /* ── 4.3 ── */
  'down-stand-watch': () => (
    <Pic floor={38}>
      {player(20, 74, { eyes: 'open', mouth: 'o', tilt: 'down' })}
      {lying(64, 80)}
    </Pic>
  ),
  'down-kneel-check': () => (
    <Pic floor={30}>
      {player(50, 62, { pose: 'sit', armR: 'press', tilt: 'down' })}
      {lying(62, 78)}
      <g transform="translate(16 56)">
        <Bubble x={-10} y={-36} w={24} h={14} tail={{ x: 2, y: -16 }}>
          <Txt size={7}>Em ơi!</Txt>
        </Bubble>
      </g>
      <path d="M8 74 q3 -3 6 0 t6 0" fill="none" stroke={C.blueDark} strokeWidth={1.6} />
    </Pic>
  ),
  'down-hold-water': () => (
    <Pic floor={38}>
      {player(22, 76, { armL: 'hold', eyes: 'worried' })}
      {glassIn(27, 50, 1.1)}
      {lying(66, 82)}
    </Pic>
  ),
  'down-thrusts': () => (
    <Pic floor={30}>
      {player(54, 62, { pose: 'sit', armR: 'press', armL: 'press', tilt: 'down' })}
      {lying(56, 78)}
      <PressingHands x={56 - 4} y={76} />
      <Arrow from={{ x: 62, y: 96 }} to={{ x: 62, y: 86 }} color={C.redDark} />
    </Pic>
  ),
  'down-sit-up-blows': () => (
    <Pic floor={70}>
      {player(66, 84, { armR: 'wave' })}
      {bro(46, 86, { pose: 'sit', eyes: 'closed', mouth: 'flat', tilt: 'down' })}
      <Burst x={58} y={56} />
      <Motion x={32} y={14} />
    </Pic>
  ),
  'down-call-cpr': () =>
    withTag(
      <Pic floor={30}>
        {player(chestOf(58) + 6, 60, { pose: 'sit', armR: 'press', armL: 'press', tilt: 'down' })}
        {lying(58, 78)}
        <PressingHands x={chestOf(58)} y={76} />
        <g transform="translate(86 50)">
          <rect x={-6} y={-10} width={12} height={20} rx={2.5} fill="#4b5563" {...stroke(1.6)} />
          <path
            d="M9 -6 q4 6 0 12 M13 -9 q6 9 0 18"
            fill="none"
            stroke={C.blueDark}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </g>
      </Pic>,
      <Tag pos="tl" label="115 · loa ngoài" />,
    ),
  'down-blows-only': () =>
    withTag(
      <Pic floor={30}>
        {player(60, 60, { pose: 'sit', armR: 'wave', tilt: 'down' })}
        {lying(56, 78)}
        <Burst x={50} y={74} />
      </Pic>,
      <Tag label="Chỉ 5 lần vỗ lưng" />,
    ),
  'down-start-cpr': () => (
    <Pic floor={30}>
      {player(chestOf(58) + 6, 60, { pose: 'sit', armR: 'press', armL: 'press', tilt: 'down' })}
      {lying(58, 78)}
      <PressingHands x={chestOf(58)} y={76} down />
      <path d="M4 96 H96" stroke={INK} strokeWidth={1.4} strokeDasharray="4 3" opacity={0.5} />
    </Pic>
  ),
  'down-wait-medic': () =>
    withTag(
      <Pic floor={38}>
        {player(20, 74, { eyes: 'worried', armL: 'hip' })}
        {lying(64, 82)}
      </Pic>,
      <Tag label="Chờ" icon={<AmbulanceIcon size={26} />} />,
    ),
  'up-eat-again': () => (
    <Pic>
      {atTable(50, { eyes: 'happy', mouth: 'grin', armR: 'hold' })}
      <Grapes x={50} y={62} k={1} />
      <ellipse cx={78} cy={76} rx={14} ry={3.5} fill={C.white} {...stroke(1.6)} />
      <Grapes x={78} y={70} k={1.1} />
    </Pic>
  ),
  'up-go-alone': () => (
    <Pic floor={86}>
      <rect x={66} y={14} width={30} height={72} rx={2} fill="#c98f5a" {...stroke(2)} />
      <circle cx={72} cy={52} r={2.4} fill={C.yellow} {...stroke(1)} />
      {bro(46, 98, { eyes: 'closed', mouth: 'flat', armR: 'hold' })}
      <Arrow from={{ x: 30, y: 92 }} to={{ x: 60, y: 92 }} />
    </Pic>
  ),
  'up-monitor': () => (
    <Pic floor={30}>
      {player(chestOf(52) + 4, 60, { pose: 'sit', tilt: 'down', eyes: 'open', mouth: 'smile' })}
      {lying(52, 78, true)}
      <Person kind="medic" x={88} y={98} scale={0.5} armL="wave" flip eyes="open" mouth="smile" />
      <path d="M6 70 q3 -3 6 0 t6 0" fill="none" stroke={C.blueDark} strokeWidth={1.6} />
    </Pic>
  ),
} satisfies Record<string, () => React.ReactNode>;
