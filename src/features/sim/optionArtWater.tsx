import { ClockIcon, PhoneIcon } from '../../art/icons';
import { C, INK, stroke, type Pt } from '../../art/ink';
import { LOOKS, type PersonKind } from '../../art/looks';
import { Head, Limb, Person, type Eyes, type Mouth } from '../../art/Person';
import { ProfileArt, type ProfileGeometry } from '../../art/Profile';
import {
  BankItemArt,
  LyingPerson,
  PressingHands,
  Swimmer,
  WATER,
  type SwimMode,
} from '../../art/WaterScenes';

/* Answer illustrations for scenario 2 (Đuối nước). Same rule as the nosebleed set: they show
 * what an option *does*, never whether it is right. All drawn in a 100×100 box. */

type Bg = 'pool' | 'lake' | 'grass' | 'plain';

function Backdrop({ bg }: { bg: Bg }) {
  if (bg === 'plain') return <rect width={100} height={100} fill={C.paper} />;
  if (bg === 'grass')
    return (
      <>
        <rect width={100} height={100} fill={C.grass} />
        <rect width={100} height={18} fill={C.sky} />
        <path d="M0 18 H100" {...stroke(1.6)} />
      </>
    );
  return (
    <>
      <rect width={100} height={100} fill={C.sky} />
      <rect y={26} width={100} height={bg === 'pool' ? 54 : 50} fill={WATER} />
      <path d="M0 26 H100" {...stroke(1.6)} />
      <path
        d="M12 44 q5 -3 10 0 t10 0 M60 58 q5 -3 10 0 t10 0"
        fill="none"
        stroke={C.white}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <rect
        y={bg === 'pool' ? 80 : 76}
        width={100}
        height={24}
        fill={bg === 'pool' ? '#f4f0e2' : C.grass}
      />
      <path d={`M0 ${bg === 'pool' ? 80 : 76} H100`} {...stroke(1.6)} />
    </>
  );
}

const pic = (bg: Bg, children: React.ReactNode) => (
  <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
    <Backdrop bg={bg} />
    {children}
  </svg>
);

const sw = (
  kind: PersonKind,
  mode: SwimMode,
  x: number,
  y: number,
  k = 0.6,
  holding?: 'ring' | 'box',
) => (
  <g transform={`translate(${x} ${y})`}>
    <Swimmer kind={kind} mode={mode} k={k} holding={holding} />
  </g>
);

const face = (kind: PersonKind, x: number, y: number, s: number, eyes?: Eyes, mouth?: Mouth) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Head look={LOOKS[kind]} face={{ eyes, mouth }} />
  </g>
);

/** Back of a head (hair only), for someone facing away from the viewer. */
const backHead = (kind: PersonKind, x: number, y: number, s: number) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={24} fill={LOOKS[kind].hair} {...stroke(2.5)} />
    <ellipse cx={-24} cy={6} rx={4} ry={5.5} fill={LOOKS[kind].skin} {...stroke(2)} />
    <ellipse cx={24} cy={6} rx={4} ry={5.5} fill={LOOKS[kind].skin} {...stroke(2)} />
    <path d="M-10 -14 q10 -6 20 0" fill="none" stroke={C.white} strokeWidth={2.4} opacity={0.4} />
  </g>
);

function Arr({
  from,
  to,
  color = C.redDark,
  dashed,
}: {
  from: Pt;
  to: Pt;
  color?: string;
  dashed?: boolean;
}) {
  const a = Math.atan2(to.y - from.y, to.x - from.x);
  const h = 6;
  const l = { x: to.x - h * Math.cos(a - 0.6), y: to.y - h * Math.sin(a - 0.6) };
  const r = { x: to.x - h * Math.cos(a + 0.6), y: to.y - h * Math.sin(a + 0.6) };
  return (
    <g stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path
        d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <path d={`M${l.x} ${l.y} L${to.x} ${to.y} L${r.x} ${r.y}`} />
    </g>
  );
}

/** Speech bubble with a short text, tail pointing down-left. */
function Say({
  x,
  y,
  w,
  text,
  size = 11,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
  size?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M4 0 H${w - 4} Q${w} 0 ${w} 4 V16 Q${w} 20 ${w - 4} 20 H16 L8 28 L10 20 H4 Q0 20 0 16 V4 Q0 0 4 0 Z`}
        fill={C.white}
        {...stroke(2)}
      />
      <text
        x={w / 2}
        y={14.5}
        textAnchor="middle"
        fontFamily="Itim, sans-serif"
        fontSize={size}
        fill={INK}
      >
        {text}
      </text>
    </g>
  );
}

/** Small corner icon drawn as HTML over the picture (like the nosebleed set). */
function WithCorner({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label?: string;
}) {
  return (
    <span className="relative block h-full w-full">
      {children}
      <span className="absolute right-0.5 top-0.5 flex flex-col items-center">
        {icon}
        {label && (
          <span className="-mt-1 whitespace-nowrap rounded-full border-2 border-navy bg-white px-1 font-display text-[9px] leading-tight text-navy">
            {label}
          </span>
        )}
      </span>
    </span>
  );
}

const shout = (x: number, y: number) => (
  <path d={`M${x} ${y - 6} l8 -4 M${x + 1} ${y} h9 M${x} ${y + 6} l8 4`} {...stroke(2.4)} />
);

const lying = (x: number, y: number, k = 0.42, airway?: boolean, dirty?: boolean) => (
  <g transform={`translate(${x} ${y})`}>
    <LyingPerson kind="friendA" k={k} airway={airway} mouthDirty={dirty} />
  </g>
);

/** Side view of the victim lying down (head on the right) for the airway answers. */
const side = (tilt: number, extra?: (g: ProfileGeometry) => React.ReactNode) => (
  <ProfileArt
    className="h-full w-full"
    pose="lie"
    look={LOOKS.friendA}
    eyes="closed"
    tilt={tilt}
    furniture="none"
  >
    {extra}
  </ProfileArt>
);

/** Torso seen from above with a marker where the hands go. */
const torso = (spot: 'left' | 'belly' | 'center') => {
  const at = { left: { x: 68, y: 40 }, belly: { x: 50, y: 76 }, center: { x: 50, y: 48 } }[spot];
  return pic(
    'plain',
    <>
      <path d="M22 18 Q50 8 78 18 L82 92 H18 Z" fill={LOOKS.friendA.shirt} {...stroke(2.5)} />
      <path d="M38 14 Q50 22 62 14" fill={LOOKS.friendA.skin} {...stroke(2)} />
      <path d="M50 24 V64" stroke={INK} strokeWidth={1.4} opacity={0.35} />
      <circle cx={38} cy={48} r={2} fill={INK} opacity={0.5} />
      <circle cx={62} cy={48} r={2} fill={INK} opacity={0.5} />
      <circle
        cx={at.x}
        cy={at.y}
        r={10}
        fill="rgb(236 106 76 / 0.25)"
        stroke={C.redDark}
        strokeWidth={3}
        strokeDasharray="4 3"
      />
      <circle cx={at.x} cy={at.y} r={3} fill={C.redDark} />
    </>,
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- merged into the option art map
export const WATER_ART = {
  /* ── 2.1 ── */
  'shout-guard': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'struggle', 30, 54, 0.45)}
        <g transform="translate(84 74)">
          <path d="M-8 0 L-6 -30 M8 0 L6 -30 M-7 -14 H7" stroke={C.woodDark} strokeWidth={3} />
          <rect x={-10} y={-33} width={20} height={4} rx={1} fill={C.wood} {...stroke(1.4)} />
        </g>
        {face('lifeguard', 84, 30, 0.42, 'wide', 'open')}
        {face('player', 42, 86, 0.48, 'worried', 'open')}
        {shout(58, 84)}
      </>,
    ),
  'run-to-guard': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'struggle', 26, 52, 0.42)}
        {face('lifeguard', 84, 34, 0.4)}
        <Arr from={{ x: 24, y: 90 }} to={{ x: 80, y: 90 }} />
        <Arr from={{ x: 80, y: 96 }} to={{ x: 30, y: 96 }} dashed color={C.blueDark} />
        {face('player', 16, 86, 0.36, 'worried', 'o')}
      </>,
    ),
  'watch-wait': () => (
    <WithCorner icon={<ClockIcon minutes={10} size={22} />}>
      {pic(
        'pool',
        <>
          {sw('victim', 'struggle', 62, 54, 0.5)}
          {face('player', 22, 84, 0.5, 'open', 'flat')}
        </>,
      )}
    </WithCorner>
  ),
  'tell-swim': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'struggle', 66, 54, 0.46)}
        <Arr from={{ x: 62, y: 70 }} to={{ x: 50, y: 82 }} color={C.blueDark} dashed />
        {face('player', 20, 86, 0.46, 'worried', 'open')}
        <Say x={2} y={4} w={58} text="Bơi vào đi!" />
      </>,
    ),
  'ring-swim-out': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'struggle', 66, 52, 0.46)}
        {sw('player', 'float', 30, 62, 0.46, 'ring')}
        <Arr from={{ x: 42, y: 70 }} to={{ x: 54, y: 66 }} color={C.blueDark} />
      </>,
    ),
  'ring-from-shore': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'float', 68, 52, 0.46, 'ring')}
        <path
          d="M30 70 Q46 76 56 52"
          fill="none"
          stroke="#c79a6c"
          strokeWidth={2.4}
          strokeDasharray="4 3"
        />
        <Person kind="player" x={24} y={100} scale={0.3} armR="hold" eyes="worried" />
      </>,
    ),
  'walk-away': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'float', 30, 52, 0.4, 'ring')}
        {face('lifeguard', 52, 82, 0.34)}
        <Person kind="player" x={84} y={100} scale={0.3} eyes="closed" />
        <Arr from={{ x: 72, y: 70 }} to={{ x: 96, y: 70 }} color={C.blueDark} />
      </>,
    ),
  'self-handle': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'float', 70, 52, 0.42, 'ring')}
        <path
          d="M32 74 Q50 80 60 52"
          fill="none"
          stroke="#c79a6c"
          strokeWidth={2.4}
          strokeDasharray="4 3"
        />
        <Person kind="player" x={26} y={100} scale={0.3} armR="hold" mouth="smile" />
        <Say x={30} y={2} w={66} text="Mình tự lo!" />
      </>,
    ),
  'brief-guard': () =>
    pic(
      'pool',
      <>
        {sw('victim', 'float', 74, 48, 0.36, 'ring')}
        {face('player', 26, 84, 0.42, 'worried', 'open')}
        {face('lifeguard', 66, 84, 0.42, 'open', 'flat')}
        <Say x={4} y={2} w={64} text="Bạn ấy đuối…" size={10} />
      </>,
    ),

  /* ── 2.2 ── */
  'both-jump': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 72, 50, 0.4)}
        {sw('player', 'swim', 26, 62, 0.4)}
        {sw('friendB', 'swim', 46, 70, 0.4)}
      </>,
    ),
  'shout-call': () => (
    <WithCorner icon={<PhoneIcon size={22} />} label="115">
      {pic(
        'lake',
        <>
          {sw('friendA', 'struggle', 64, 48, 0.42)}
          {face('player', 22, 86, 0.42, 'worried', 'open')}
          {shout(38, 84)}
          {face('friendB', 66, 88, 0.36, 'worried', 'o')}
        </>,
      )}
    </WithCorner>
  ),
  'one-in-one-watch': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 72, 48, 0.4)}
        {sw('player', 'swim', 40, 62, 0.4)}
        {face('friendB', 16, 88, 0.34, 'wide', 'flat')}
      </>,
    ),
  'approach-fast': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 72, 50, 0.42)}
        {sw('player', 'swim', 30, 62, 0.42)}
        <path
          d="M4 56 h10 M2 64 h12 M6 72 h8"
          stroke={C.white}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      </>,
    ),
  'float-reach': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'float', 68, 52, 0.44, 'box')}
        <path d="M24 78 L52 54" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M24 78 L52 54" stroke={C.woodDark} strokeWidth={3} strokeLinecap="round" />
        {face('player', 18, 88, 0.36, 'worried', 'flat')}
      </>,
    ),
  'wait-calm': () => (
    <WithCorner icon={<ClockIcon minutes={20} size={22} />}>
      {pic(
        'lake',
        <>
          {sw('friendA', 'struggle', 56, 52, 0.46)}
          {face('player', 20, 88, 0.36, 'open', 'flat')}
        </>,
      )}
    </WithCorner>
  ),
  'keep-distance': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'float', 70, 52, 0.42, 'box')}
        {sw('player', 'tow', 24, 56, 0.42)}
        <path
          d="M38 40 H54"
          stroke={C.green}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="3 3"
        />
      </>,
    ),
  'front-face': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 50, 50, 0.46)}
        {backHead('player', 50, 76, 0.42)}
      </>,
    ),
  'grab-hand': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 66, 52, 0.42)}
        {sw('player', 'swim', 28, 60, 0.42)}
        <circle cx={50} cy={34} r={6} fill={LOOKS.player.skin} {...stroke(2)} />
        <path d="M46 28 l-4 -4 M54 28 l4 -4" {...stroke(1.6)} />
      </>,
    ),
  'approach-front': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 50, 46, 0.44)}
        {backHead('player', 50, 84, 0.3)}
        <Arr from={{ x: 50, y: 74 }} to={{ x: 50, y: 60 }} />
      </>,
    ),
  'approach-side': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'struggle', 58, 50, 0.44)}
        {face('player', 14, 50, 0.26, 'open', 'flat')}
        <Arr from={{ x: 24, y: 50 }} to={{ x: 34, y: 50 }} />
      </>,
    ),
  'approach-behind': () =>
    pic(
      'lake',
      <>
        {face('player', 70, 32, 0.24, 'open', 'flat')}
        <Arr from={{ x: 64, y: 38 }} to={{ x: 58, y: 44 }} />
        {sw('friendA', 'struggle', 46, 60, 0.44)}
      </>,
    ),
  'tow-flat': () =>
    pic(
      'lake',
      <>
        <g transform="translate(50 44)">
          <g transform="rotate(-90) scale(0.4)">
            <Person kind="friendA" x={0} y={30} eyes="closed" mouth="flat" />
          </g>
          <rect x={-60} y={6} width={120} height={18} fill={WATER} opacity={0.6} />
        </g>
        <Arr from={{ x: 22, y: 70 }} to={{ x: 80, y: 70 }} color={C.blueDark} dashed />
      </>,
    ),
  'tow-head-up': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'float', 60, 50, 0.46)}
        {sw('player', 'tow', 30, 56, 0.42)}
        <path
          d="M70 18 q6 -4 12 0 M72 12 q6 -4 12 0"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </>,
    ),
  'tow-tight': () =>
    pic(
      'lake',
      <>
        {sw('friendA', 'float', 52, 50, 0.48)}
        <path
          d="M30 46 Q52 66 74 46"
          fill="none"
          stroke={INK}
          strokeWidth={9}
          strokeLinecap="round"
        />
        <path
          d="M30 46 Q52 66 74 46"
          fill="none"
          stroke={LOOKS.player.skin}
          strokeWidth={5.5}
          strokeLinecap="round"
        />
        <path d="M20 30 l6 4 M84 30 l-6 4 M18 40 h7 M86 40 h-7" {...stroke(2)} />
      </>,
    ),

  /* ── 2.3 ── */
  'check-temp': () =>
    pic(
      'grass',
      <>
        {lying(62, 64)}
        <g transform="translate(26 38) rotate(-30)">
          <rect x={-3} y={-16} width={6} height={26} rx={3} fill={C.white} {...stroke(2)} />
          <circle cx={0} cy={12} r={5} fill={C.red} {...stroke(2)} />
          <path d="M0 -8 V8" stroke={C.red} strokeWidth={2} />
        </g>
      </>,
    ),
  'check-pulse': () => (
    <WithCorner icon={<ClockIcon minutes={10} size={22} />} label="10 giây">
      {pic(
        'grass',
        <>
          {face('friendA', 42, 46, 0.9, 'closed', 'flat')}
          <path d="M60 100 L66 74" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path
            d="M60 100 L66 74"
            stroke={LOOKS.player.skin}
            strokeWidth={6.5}
            strokeLinecap="round"
          />
          <ellipse
            cx={64}
            cy={72}
            rx={4}
            ry={7}
            fill={LOOKS.player.skin}
            {...stroke(2)}
            transform="rotate(20 64 72)"
          />
          <ellipse
            cx={71}
            cy={74}
            rx={4}
            ry={7}
            fill={LOOKS.player.skin}
            {...stroke(2)}
            transform="rotate(20 71 74)"
          />
        </>,
      )}
    </WithCorner>
  ),
  'check-limbs': () =>
    pic(
      'grass',
      <>
        {lying(56, 62)}
        <g transform="translate(78 40)">
          <circle r={11} fill="rgb(255 255 255 / 0.5)" {...stroke(2.4)} />
          <path d="M8 8 L18 18" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      </>,
    ),
  'call-cpr': () => (
    <WithCorner icon={<PhoneIcon size={22} />} label="115">
      {pic(
        'grass',
        <>
          {lying(62, 66)}
          <PressingHands x={54} y={65} />
          <path
            d="M14 30 C10 24 2 26 4 34 C6 40 14 44 14 44 C14 44 22 40 24 34 C26 26 18 24 14 30 Z"
            fill={C.red}
            {...stroke(2)}
          />
        </>,
      )}
    </WithCorner>
  ),
  'check-30s': () => (
    <WithCorner icon={<ClockIcon minutes={30} size={22} />} label="30 giây">
      {pic(
        'grass',
        <>
          {face('friendA', 42, 46, 0.9, 'closed', 'flat')}
          <path d="M60 100 L66 74" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path
            d="M60 100 L66 74"
            stroke={LOOKS.player.skin}
            strokeWidth={6.5}
            strokeLinecap="round"
          />
          <ellipse
            cx={64}
            cy={72}
            rx={4}
            ry={7}
            fill={LOOKS.player.skin}
            {...stroke(2)}
            transform="rotate(20 64 72)"
          />
          <ellipse
            cx={71}
            cy={74}
            rx={4}
            ry={7}
            fill={LOOKS.player.skin}
            {...stroke(2)}
            transform="rotate(20 71 74)"
          />
        </>,
      )}
    </WithCorner>
  ),
  'side-wait': () => (
    <WithCorner icon={<ClockIcon minutes={20} size={22} />}>
      <ProfileArt
        className="h-full w-full"
        pose="lie"
        look={LOOKS.friendA}
        eyes="closed"
        furniture="none"
      />
    </WithCorner>
  ),
  'spot-left': () => torso('left'),
  'spot-belly': () => torso('belly'),
  'spot-center': () => torso('center'),
  'breath-now': () => side(0, (g) => <Mouthful g={g} />),
  'clear-mouth': () =>
    side(-10, (g) => {
      const m = g.at(24, 10);
      return (
        <g>
          <circle cx={m.x + 2} cy={m.y + 2} r={1.6} fill="#8a6a44" />
          <path
            d={`M${m.x + 14} ${m.y - 8} L${m.x + 4} ${m.y}`}
            stroke={INK}
            strokeWidth={7}
            strokeLinecap="round"
          />
          <path
            d={`M${m.x + 14} ${m.y - 8} L${m.x + 4} ${m.y}`}
            stroke={LOOKS.player.skin}
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
      );
    }),
  'press-belly': () =>
    pic(
      'grass',
      <>
        {lying(60, 64)}
        <PressingHands x={66} y={64} />
        <Arr from={{ x: 66, y: 40 }} to={{ x: 66, y: 52 }} />
      </>,
    ),
  'tilt-chin': () =>
    side(-28, (g) => {
      const chin = g.at(20, 22);
      const brow = g.at(-2, -14);
      return (
        <g>
          <Limb
            d={`M${brow.x - 10} ${brow.y - 14} L${brow.x} ${brow.y}`}
            color={LOOKS.player.skin}
            width={5}
          />
          <Limb
            d={`M${chin.x + 4} ${chin.y + 16} L${chin.x} ${chin.y + 2}`}
            color={LOOKS.player.skin}
            width={5}
          />
        </g>
      );
    }),
  'lift-head': () =>
    side(22, (g) => {
      const back = g.at(-6, 8);
      return (
        <Arr
          from={{ x: back.x, y: back.y + 14 }}
          to={{ x: back.x, y: back.y - 6 }}
          color={C.blueDark}
        />
      );
    }),
  'turn-head': () =>
    pic(
      'grass',
      <>
        <g transform="translate(50 56) scale(0.9)">
          <Head look={LOOKS.friendA} face={{ eyes: 'closed', mouth: 'flat' }} />
        </g>
        <path
          d="M18 24 Q50 4 82 24"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          d="M76 16 l6 8 l-9 2"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </>,
    ),
  'pause-cpr': () => (
    <WithCorner icon={<ClockIcon minutes={10} size={22} />}>
      {pic(
        'grass',
        <>
          {lying(60, 64)}
          <g transform="translate(26 36)">
            <rect x={-8} y={-10} width={5} height={20} rx={2} fill={C.white} {...stroke(2)} />
            <rect x={3} y={-10} width={5} height={20} rx={2} fill={C.white} {...stroke(2)} />
          </g>
        </>,
      )}
    </WithCorner>
  ),
  'cpr-30-2': () =>
    pic(
      'grass',
      <>
        {lying(62, 66)}
        <PressingHands x={54} y={65} />
        <g transform="translate(6 24)">
          <rect width={44} height={18} rx={9} fill={C.white} {...stroke(2)} />
          <text
            x={22}
            y={13.5}
            textAnchor="middle"
            fontFamily="Itim, sans-serif"
            fontSize={13}
            fill={C.redDark}
          >
            30 : 2
          </text>
        </g>
        <path d="M58 30 a10 10 0 1 1 -4 -12" fill="none" stroke={C.blueDark} strokeWidth={2.6} />
        <path
          d="M50 14 l4 4 l-5 3"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
      </>,
    ),
  'upside-down': () =>
    pic(
      'grass',
      <>
        <g transform="translate(50 56) rotate(180) scale(0.36)">
          <Person kind="friendA" x={0} y={60} eyes="closed" mouth="o" />
        </g>
        <path
          d="M30 92 q4 4 8 0 M44 94 q4 4 8 0"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={2.4}
        />
        <Arr from={{ x: 82, y: 70 }} to={{ x: 82, y: 40 }} color={C.blueDark} />
      </>,
    ),
} satisfies Record<string, () => React.ReactNode>;

/** Puffed cheeks + breath lines next to the mouth of the side-view victim. */
function Mouthful({ g }: { g: ProfileGeometry }) {
  const m = g.at(26, 8);
  return (
    <path
      d={`M${m.x + 2} ${m.y - 8} q5 -3 10 0 M${m.x + 2} ${m.y - 2} q5 -3 10 0`}
      fill="none"
      stroke={C.blueDark}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

/** Bank objects as small cards for the find task's progress list. */
export function BankItemThumb({ id }: { id: Parameters<typeof BankItemArt>[0]['id'] }) {
  return (
    <svg viewBox="-24 -24 48 48" className="h-full w-full" aria-hidden>
      <rect x={-24} y={-24} width={48} height={48} fill={C.grass} />
      <BankItemArt id={id} />
    </svg>
  );
}
