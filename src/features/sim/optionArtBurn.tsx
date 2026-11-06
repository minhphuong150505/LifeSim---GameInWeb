/* eslint-disable react-refresh/only-export-components -- art module: drawing helpers + the option art map */
import { BurnArm, TapStream, type BurnArmProps } from '../../art/BurnArm';
import { ClockIcon, PhoneIcon } from '../../art/icons';
import { C, INK, stroke } from '../../art/ink';
import { Person } from '../../art/Person';

/* Answer illustrations for scenario 5 (burns). Most are the close-up of the sister's burned
 * forearm (same drawing as the stage close-up) with what the option does drawn on top; they
 * show the action, never whether it is right. */

const BG = '#fbeedb';

function Pic({ bg = BG, children }: { bg?: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <rect width={100} height={100} fill={bg} />
      {children}
    </svg>
  );
}

const arm = (props: Partial<BurnArmProps>, extra?: React.ReactNode, bg?: string) => (
  <Pic bg={bg}>
    <BurnArm level="red" {...props} />
    {extra}
  </Pic>
);

/** Small label pinned to a corner, with an optional icon. */
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

function Motion({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <path
      d={`M${x} ${y} h${8 * s} M${x + 2 * s} ${y + 6} h${10 * s} M${x} ${y + 12} h${8 * s}`}
      stroke={INK}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

function Towel({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-12)`}>
      <rect x={-16} y={-10} width={32} height={20} rx={4} fill="#f2b8c6" {...stroke(2)} />
      <path d="M-16 -3 H16 M-16 4 H16" stroke={C.white} strokeWidth={2} />
    </g>
  );
}

function Ice({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [x, y],
        [x + 13, y + 3],
        [x + 6, y - 9],
      ].map(([ix, iy]) => (
        <g key={`${ix}-${iy}`}>
          <rect x={ix} y={iy} width={11} height={11} rx={2} fill={C.ice} {...stroke(1.8)} />
          <path d={`M${(ix ?? 0) + 3} ${(iy ?? 0) + 3} l3 0`} stroke={C.white} strokeWidth={1.6} />
        </g>
      ))}
    </g>
  );
}

function Toothpaste({ x, y, smear }: { x: number; y: number; smear?: 'thick' | 'thin' }) {
  return (
    <g>
      {smear && (
        <path
          d={`M28 ${smear === 'thin' ? 56 : 54} q14 -5 28 0 q-14 ${smear === 'thin' ? 3 : 7} -28 0 Z`}
          fill="#e9f7f9"
          stroke="#6cc3d0"
          strokeWidth={1.4}
        />
      )}
      <g transform={`translate(${x} ${y}) rotate(-25)`}>
        <path d="M-18 -6 H12 L18 -2 V2 L12 6 H-18 Z" fill={C.white} {...stroke(2)} />
        <path d="M-18 -6 V6" stroke={C.red} strokeWidth={4} />
        <path d="M-8 -6 V6" stroke="#6cc3d0" strokeWidth={3} />
        <rect x={18} y={-3} width={5} height={6} rx={1} fill={C.blue} {...stroke(1.4)} />
      </g>
    </g>
  );
}

function OilBottle({ x, y, pour }: { x: number; y: number; pour?: boolean }) {
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(${pour ? 120 : 0})`}>
        <path
          d="M-7 12 V-4 Q-7 -9 -3 -11 V-16 H3 V-11 Q7 -9 7 -4 V12 Z"
          fill="#f6cf4a"
          {...stroke(2)}
        />
        <rect x={-3.5} y={-20} width={7} height={4} rx={1} fill={C.red} {...stroke(1.4)} />
        <rect x={-5} y={0} width={10} height={6} rx={1} fill={C.white} opacity={0.8} />
      </g>
      {pour && (
        <path
          d="M44 34 q-2 8 0 14 M50 38 q-1 6 0 10"
          stroke="#e8b923"
          strokeWidth={3}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function Needle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-40)`}>
      <path d="M0 0 L26 0" stroke="#9aa5b1" strokeWidth={2.6} strokeLinecap="round" />
      <path d="M0 0 L26 0" stroke={INK} strokeWidth={0.8} />
      <ellipse cx={22} cy={0} rx={3} ry={1.2} fill={BG} stroke={INK} strokeWidth={0.8} />
    </g>
  );
}

function PinchFingers({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={-10} rx={4} ry={9} fill={C.skin} {...stroke(2)} transform="rotate(-20)" />
      <ellipse
        cx={9}
        cy={-8}
        rx={4}
        ry={9}
        fill={C.skin}
        {...stroke(2)}
        transform="rotate(20 9 -8)"
      />
      <path d="M-6 6 q4 -6 12 -2" fill="#f6d2c4" stroke="#c9644c" strokeWidth={1.4} />
    </g>
  );
}

function StopHand({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={13} fill={C.white} {...stroke(2)} />
      <path
        d="M-6 7 V-3 M-6 -3 V-8 M-2 7 V-10 M2 7 V-10 M6 7 V-7 M-9 2 L-6 -1"
        stroke={C.skin}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path d="M-7 8 H7" stroke={C.skin} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

function Scissors({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-15)`}>
      <path d="M0 0 L22 -6 M0 0 L22 6" stroke="#9aa5b1" strokeWidth={3} strokeLinecap="round" />
      <circle cx={-6} cy={-5} r={4.5} fill="none" stroke={C.red} strokeWidth={2.6} />
      <circle cx={-6} cy={5} r={4.5} fill="none" stroke={C.red} strokeWidth={2.6} />
    </g>
  );
}

function PullHand({ x, y, w = 1 }: { x: number; y: number; w?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={6} fill={C.skin} {...stroke(2)} />
      <path
        d={`M${x - 6} ${y} L${x - 26 * w} ${y + 2} M${x - 26 * w + 5} ${y - 4} L${x - 26 * w} ${y + 2} L${x - 26 * w + 5} ${y + 7}`}
        fill="none"
        stroke={C.red}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

function Pain({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} l3 -6 3 6 M${x + 10} ${y - 2} l4 -5 2 6`}
      fill="none"
      stroke={C.red}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function Kettle({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <g transform={`translate(${x} ${y}) rotate(35)`}>
        <path d="M-12 8 V-6 Q0 -14 12 -6 V8 Z" fill="#e8605a" {...stroke(2)} />
        <path d="M-12 -2 l-9 -6" {...stroke(2.5)} />
      </g>
      <path d="M18 30 q2 8 6 14" stroke="#bfe6f5" strokeWidth={4} strokeLinecap="round" />
      {[0, 1].map((i) => (
        <path
          key={i}
          d={`M${30 + i * 7} 22 q-3 -5 0 -10`}
          fill="none"
          stroke="#c7cdd3"
          strokeWidth={2}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

function Cotton({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[
        [x, y, 8],
        [x + 10, y + 2, 7],
        [x + 5, y - 6, 7],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={C.white} {...stroke(1.6)} />
      ))}
      <path d={`M${x - 4} ${y + 8} l2 4 M${x + 12} ${y + 9} l1 4`} stroke={INK} strokeWidth={1} />
    </g>
  );
}

function TightBandage() {
  return (
    <g>
      <rect x={16} y={42} width={50} height={30} rx={3} fill={C.white} {...stroke(2)} />
      {[22, 31, 40, 49, 58].map((bx) => (
        <path key={bx} d={`M${bx} 42 L${bx + 6} 72`} stroke={INK} strokeWidth={1.4} />
      ))}
      <path
        d="M14 46 Q8 57 14 68 M68 46 Q74 57 68 68"
        fill="none"
        stroke={C.red}
        strokeWidth={2.2}
      />
      <path d="M40 30 L40 40 M36 36 L40 40 L44 36" stroke={C.red} strokeWidth={2.2} fill="none" />
      <path d="M40 84 L40 74 M36 78 L40 74 L44 78" stroke={C.red} strokeWidth={2.2} fill="none" />
    </g>
  );
}

function Blanket({ over }: { over: 'arm' | 'none' }) {
  return over === 'arm' ? (
    <g>
      <path d="M2 34 Q40 26 80 34 L84 84 Q40 92 0 84 Z" fill="#9c6fb0" {...stroke(2.4)} />
      <path
        d="M6 50 Q40 44 80 50 M4 66 Q40 60 82 66"
        fill="none"
        stroke="#c7a6d9"
        strokeWidth={3}
      />
    </g>
  ) : null;
}

/** Small full-body picture of the sister for whole-situation options. */
const sister = (
  props: Omit<React.ComponentProps<typeof Person>, 'kind'>,
  extra?: React.ReactNode,
  bg?: string,
) => (
  <Pic bg={bg}>
    {extra}
    <Person kind="sister" scale={0.62} {...props} />
  </Pic>
);

export const BURN_ART = {
  /* ── 5.1 ── */
  'burn-towel-rub': () =>
    arm(
      {},
      <>
        <Towel x={44} y={50} />
        <Motion x={20} y={26} />
        <Pain x={62} y={36} />
      </>,
    ),
  'burn-tap': () => arm({}, <TapStream />, '#e4f2f7'),
  'burn-ice-direct': () => arm({}, <Ice x={30} y={42} />),
  'cool-2min': () =>
    withTag(
      arm({}, <TapStream />, '#e4f2f7'),
      <Tag label="1–2 phút" icon={<ClockIcon minutes={2} size={22} />} />,
    ),
  'cool-5min': () =>
    withTag(
      arm({}, <TapStream />, '#e4f2f7'),
      <Tag label="5 phút" icon={<ClockIcon minutes={5} size={22} />} />,
    ),
  'cool-20min': () =>
    withTag(
      arm({}, <TapStream />, '#e4f2f7'),
      <Tag label="≥ 20 phút" icon={<ClockIcon minutes={20} size={22} />} />,
    ),
  'ring-leave': () =>
    arm(
      { ring: true, swollen: true },
      <path
        d="M88 40 q8 -6 10 4"
        fill="none"
        stroke={C.red}
        strokeWidth={2}
        strokeDasharray="3 2"
      />,
    ),
  'ring-gentle': () =>
    arm(
      { ring: true },
      <>
        <path
          d="M93 44 V30 M89 34 L93 30 L97 34"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
        <ellipse cx={93} cy={26} rx={4} ry={2} fill="none" stroke={C.yellow} strokeWidth={2.4} />
      </>,
    ),
  'ring-yank': () =>
    arm(
      { ring: true, swollen: true },
      <>
        <path d="M96 52 H100" stroke={C.red} strokeWidth={4} />
        <PullHand x={74} y={30} w={-1} />
        <Pain x={70} y={76} />
      </>,
    ),
  'sleeve-rip': () =>
    arm(
      { sleeve: 'long' },
      <>
        <PullHand x={22} y={44} />
        <Pain x={44} y={36} />
      </>,
    ),
  'sleeve-cut': () => arm({ sleeve: 'cut' }, <Scissors x={8} y={40} />),
  'sleeve-hot-water': () => arm({ sleeve: 'long' }, <Kettle x={14} y={22} />),
  'burn-dirt': () =>
    arm(
      {},
      <g fill="#8a6a4f">
        {[
          [30, 52],
          [40, 60],
          [50, 54],
          [36, 48],
          [56, 60],
          [24, 30],
          [60, 28],
          [44, 22],
        ].map(([dx, dy]) => (
          <circle key={`${dx}-${dy}`} cx={dx} cy={dy} r={1.8} />
        ))}
      </g>,
    ),
  'burn-toothpaste': () => arm({}, <Toothpaste x={66} y={30} smear="thick" />),
  'burn-cling-film': () => arm({ wrap: true }),

  /* ── 5.2 ── */
  'toothpaste-cool': () =>
    arm(
      {},
      <>
        <Toothpaste x={66} y={30} smear="thick" />
        <path
          d="M18 24 l6 6 M24 24 l-6 6 M21 22 v10 M16 27 h10"
          stroke={C.blueDark}
          strokeWidth={1.8}
        />
      </>,
    ),
  'toothpaste-no-tap': () =>
    arm(
      {},
      <>
        <TapStream />
        <g transform="translate(78 82) scale(0.7)">
          <Toothpaste x={0} y={0} />
          <path
            d="M-14 -12 L16 12 M16 -12 L-14 12"
            stroke={C.red}
            strokeWidth={3.4}
            strokeLinecap="round"
          />
        </g>
      </>,
      '#e4f2f7',
    ),
  'toothpaste-thin': () => arm({}, <Toothpaste x={66} y={30} smear="thin" />),
  'ice-pack-direct': () =>
    arm(
      {},
      <g transform="translate(42 50) rotate(-6)">
        <rect x={-16} y={-9} width={32} height={18} rx={7} fill={C.ice} {...stroke(2)} />
        <path d="M-8 -3 l3 3 M2 -4 l3 3 M-2 3 l3 3" stroke={C.white} strokeWidth={1.8} />
      </g>,
    ),
  'ice-rub': () =>
    arm(
      {},
      <>
        <Ice x={34} y={44} />
        <Motion x={14} y={32} />
        <Motion x={74} y={32} flip />
      </>,
    ),
  'blister-pop': () => arm({ level: 'blister' }, <Needle x={24} y={40} />),
  'blister-peel': () => arm({ level: 'blister' }, <PinchFingers x={46} y={50} />),
  'blister-leave': () => arm({ level: 'blister' }, <StopHand x={78} y={22} />),
  'oil-on-burn': () => arm({}, <OilBottle x={44} y={20} pour />),
  'oil-no': () =>
    arm(
      {},
      <g>
        <OilBottle x={80} y={24} />
        <path
          d="M70 12 L90 36 M90 12 L70 36"
          stroke={C.red}
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      </g>,
    ),
  'oil-wrap-tight': () =>
    arm(
      {},
      <>
        <TightBandage />
        <OilBottle x={86} y={20} />
      </>,
    ),
  'kid-play': () =>
    sister(
      {
        x: 50,
        y: 92,
        armR: 'wave',
        armL: 'point',
        mouth: 'grin',
        eyes: 'happy',
        burnArm: { level: 'red' },
      },
      <>
        <circle cx={84} cy={84} r={8} fill={C.red} {...stroke(2)} />
        <Motion x={8} y={50} />
      </>,
      '#e8f4dd',
    ),
  'kid-rest': () =>
    sister(
      {
        x: 50,
        y: 74,
        pose: 'sit',
        eyes: 'open',
        mouth: 'smile',
        burnArm: { level: 'red', wrap: true },
      },
      <>
        <rect x={30} y={74} width={40} height={6} rx={3} fill={C.wood} {...stroke(2)} />
        <path d="M34 80 L32 98 M66 80 L68 98" stroke={INK} strokeWidth={3} />
        <path
          d="M78 22 q4 -4 8 0 q4 -4 8 0 q0 6 -8 10 q-8 -4 -8 -10 Z"
          fill={C.red}
          {...stroke(1.6)}
        />
      </>,
    ),
  'burn-rub-check': () =>
    arm(
      {},
      <>
        <PinchFingers x={46} y={44} />
        <Motion x={18} y={30} />
        <Pain x={64} y={76} />
      </>,
    ),

  /* ── 5.3 ── */
  'burn-small': () =>
    arm({ level: 'none' }, <ellipse cx={46} cy={57} rx={7} ry={4} fill="#f28b6f" opacity={0.7} />),
  'burn-large': () => arm({ level: 'severe' }),
  'skin-dry': () =>
    arm(
      { level: 'none' },
      <path
        d="M30 54 l4 2 -3 2 M44 52 l5 1 -4 3 M58 56 l4 -1"
        fill="none"
        stroke="#c79a6c"
        strokeWidth={1.4}
        strokeLinecap="round"
      />,
    ),
  'wait-home': () =>
    withTag(
      sister(
        {
          x: 46,
          y: 76,
          pose: 'sit',
          eyes: 'worried',
          mouth: 'frown',
          burnArm: { level: 'severe' },
          chestBurn: true,
        },
        <rect x={10} y={70} width={72} height={14} rx={6} fill={C.sofa} {...stroke(2)} />,
      ),
      <Tag label="Chờ tự lành" icon={<ClockIcon minutes={45} size={22} />} />,
    ),
  'call-115-cool': () =>
    withTag(
      arm({ level: 'severe' }, <TapStream />, '#e4f2f7'),
      <Tag pos="tl" label="115" icon={<PhoneIcon size={24} />} />,
    ),
  'walk-around': () =>
    sister(
      {
        x: 40,
        y: 92,
        eyes: 'worried',
        mouth: 'frown',
        burnArm: { level: 'severe' },
        chestBurn: true,
      },
      <>
        <path
          d="M60 80 H90 M84 74 L90 80 L84 86"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={2.6}
          strokeLinecap="round"
        />
        <path d="M60 64 H82" stroke={C.blueDark} strokeWidth={2} strokeDasharray="3 3" />
      </>,
    ),
  'shirt-pull-all': () =>
    arm(
      { level: 'severe', sleeve: 'long' },
      <>
        <PullHand x={20} y={40} />
        <PullHand x={20} y={76} />
        <Pain x={52} y={30} />
      </>,
    ),
  'shirt-cut-free': () => arm({ level: 'severe', sleeve: 'cut' }, <Scissors x={8} y={40} />),
  'shirt-towel-rub': () =>
    arm(
      { level: 'severe', sleeve: 'long' },
      <>
        <Towel x={44} y={44} />
        <Motion x={16} y={24} />
      </>,
    ),
  'cover-cotton': () => arm({ level: 'severe' }, <Cotton x={36} y={54} />),
  'cover-tight': () => arm({ level: 'severe' }, <TightBandage />),
  'cover-film-loose': () =>
    arm(
      { level: 'severe', wrap: true },
      <path
        d="M20 30 H66 M60 25 L66 30 L60 35"
        fill="none"
        stroke={C.blueDark}
        strokeWidth={2.2}
        strokeLinecap="round"
      />,
    ),
  'cool-whole-body': () =>
    sister(
      {
        x: 50,
        y: 94,
        eyes: 'closed',
        mouth: 'frown',
        burnArm: { level: 'severe' },
        chestBurn: true,
        sweat: true,
      },
      <>
        <path d="M34 4 H66 V10 H34 Z" fill="#9aa5b1" {...stroke(1.8)} />
        {[38, 46, 54, 62].map((wx) => (
          <path
            key={wx}
            d={`M${wx} 12 V60`}
            stroke="#8fd0ea"
            strokeWidth={2.4}
            strokeDasharray="5 4"
          />
        ))}
        <path
          d="M18 50 l-4 4 4 4 -4 4 M82 50 l4 4 -4 4 4 4"
          fill="none"
          stroke={C.blueDark}
          strokeWidth={1.8}
        />
      </>,
      '#e4f2f7',
    ),
  'warm-unburned': () =>
    sister(
      {
        x: 50,
        y: 92,
        eyes: 'open',
        mouth: 'smile',
        burnArm: { level: 'severe', wrap: true },
        chestBurn: true,
        blanket: true,
      },
      <path
        d="M76 18 q4 -4 8 0 q4 -4 8 0 q0 6 -8 10 q-8 -4 -8 -10 Z"
        fill={C.red}
        {...stroke(1.6)}
      />,
    ),
  'blanket-on-burn': () => arm({ level: 'severe' }, <Blanket over="arm" />),
} satisfies Record<string, () => React.ReactNode>;
