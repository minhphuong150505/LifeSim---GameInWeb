import { C, stroke, type Pt } from '../../art/ink';
import {
  ClockIcon,
  CottonIcon,
  HeartIcon,
  IcePackIcon,
  PinIcon,
  TissueIcon,
} from '../../art/icons';
import { LOOKS } from '../../art/looks';
import { Head, Person } from '../../art/Person';
import { ProfileArt, type ProfileGeometry, type ProfileProps } from '../../art/Profile';

/* Answer illustrations for the A/B/C options. Each one is drawn from the shared art kit
 * (side-view kid, front-view characters, icons) so they all match the stage. They show
 * what the option *does*, never whether it is right. */

const P = (
  props: ProfileProps & { crop?: 'body' | 'head'; extra?: (g: ProfileGeometry) => React.ReactNode },
) => {
  const { extra, ...rest } = props;
  return (
    <ProfileArt className="h-full w-full" {...rest}>
      {extra}
    </ProfileArt>
  );
};

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

const inhale = (g: ProfileGeometry) => (
  <>
    <Arrow from={g.at(46, -12)} to={g.at(30, -3)} />
    <Arrow from={g.at(48, 2)} to={g.at(31, 3)} />
  </>
);

const mouthPuffs = (g: ProfileGeometry) => {
  const m = g.at(24, 12);
  return (
    <path
      d={`M${m.x} ${m.y} q4 -3 8 0 t8 0 M${m.x + 2} ${m.y + 6} q4 -3 8 0 t7 0`}
      fill="none"
      stroke={C.blueDark}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
};

/** Small icon pinned to a corner of the illustration. */
function Corner({
  children,
  label,
  pos = 'tr',
}: {
  children: React.ReactNode;
  label?: string;
  pos?: 'tr' | 'tl' | 'br';
}) {
  const place = { tr: 'right-0.5 top-0.5', tl: 'left-0.5 top-0.5', br: 'bottom-0.5 right-0.5' }[
    pos
  ];
  return (
    <span className={`absolute ${place} flex flex-col items-center`}>
      {children}
      {label && (
        <span className="-mt-1 whitespace-nowrap rounded-full border-2 border-navy bg-white px-1 font-display text-[9px] leading-tight text-navy">
          {label}
        </span>
      )}
    </span>
  );
}

function Bubble({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path
        d="M10 12 H90 Q96 12 96 18 V66 Q96 72 90 72 H40 L24 90 L28 72 H10 Q4 72 4 66 V18 Q4 12 10 12 Z"
        fill={C.white}
        {...stroke(3)}
      />
      {children}
    </svg>
  );
}

const front = (vb: string, children: React.ReactNode) => (
  <svg viewBox={vb} className="h-full w-full" aria-hidden>
    {children}
  </svg>
);

const ART = {
  'pose-forward': () => <P lean={18} tilt={8} eyes="down" blood="drip" furniture="sofa" />,
  'pose-head-back': () => <P lean={-12} tilt={-30} eyes="up" blood="throat" furniture="sofa" />,
  'pose-lie': () => <P pose="lie" furniture="bed" blood="throat" eyes="up" />,
  'air-blocked': () => (
    <P
      crop="head"
      lean={10}
      hand="pinch-soft"
      eyes="worried"
      extra={(g) => (
        <>
          {inhale(g)}
          <path
            d={`M${g.at(34, -12).x} ${g.at(34, -12).y} l9 9 m0 -9 l-9 9`}
            stroke={C.redDark}
            strokeWidth={3}
            strokeLinecap="round"
          />
        </>
      )}
    />
  ),
  pressure: () => (
    <P
      crop="head"
      lean={10}
      hand="pinch-soft"
      blood="stopped"
      extra={(g) => {
        const h = g.at(24, 0);
        return (
          <>
            <Arrow from={{ x: h.x, y: h.y - 22 }} to={{ x: h.x, y: h.y - 9 }} color={C.redDark} />
            <Arrow
              from={{ x: h.x + 20, y: h.y + 8 }}
              to={{ x: h.x + 9, y: h.y + 3 }}
              color={C.redDark}
            />
            <path
              d={`M${h.x - 14} ${h.y + 14} q4 -4 8 0 t8 0`}
              fill="none"
              stroke={C.blood}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </>
        );
      }}
    />
  ),
  'push-blood': () => (
    <P
      crop="head"
      lean={8}
      hand="blow"
      eyes="closed"
      blood="drip"
      extra={(g) => (
        <>
          <Arrow from={g.at(30, 6)} to={g.at(44, 8)} color={C.blood} dashed />
          <Arrow from={g.at(30, 12)} to={g.at(42, 18)} color={C.blood} dashed />
        </>
      )}
    />
  ),
  'pinch-bridge': () => <P crop="head" lean={10} hand="pinch-bridge" blood="drip" />,
  'pinch-one': () => <P crop="head" lean={10} hand="pinch-one" blood="drip" />,
  'pinch-soft': () => <P crop="head" lean={10} hand="pinch-soft" mouth="open" />,
  'breathe-nose': () => <P crop="head" lean={6} eyes="closed" blood="drip" extra={inhale} />,
  'breathe-mouth': () => (
    <P crop="head" lean={10} hand="pinch-soft" mouth="open" extra={mouthPuffs} />
  ),
  'hold-breath': () => <P crop="head" lean={10} hand="pinch-soft" mouth="puffed" eyes="closed" />,
  'timer-2': () => (
    <>
      <P lean={16} tilt={6} eyes="down" blood="drip" furniture="sofa" />
      <Corner label="1–2 phút">
        <ClockIcon minutes={2} size={22} />
      </Corner>
    </>
  ),
  'timer-15': () => (
    <>
      <P lean={16} tilt={6} hand="pinch-soft" mouth="open" furniture="sofa" />
      <Corner label="10–15 phút">
        <ClockIcon minutes={15} size={22} />
      </Corner>
    </>
  ),
  'timer-blow': () => (
    <>
      <P crop="head" lean={8} hand="blow" eyes="closed" blood="drip" />
      <Corner label="30 giây">
        <ClockIcon minutes={0.5} size={22} />
      </Corner>
    </>
  ),
  'blood-throat': () => (
    <P crop="head" lean={-12} tilt={-30} eyes="worried" mouth="frown" blood="throat" />
  ),
  'head-back-swallow': () => (
    <P crop="head" lean={-12} tilt={-30} eyes="closed" mouth="puffed" blood="throat" />
  ),
  cotton: () => (
    <>
      <P crop="head" lean={8} plug="cotton" eyes="worried" blood="drip" />
      <Corner pos="tl">
        <CottonIcon size={28} />
      </Corner>
    </>
  ),
  tissue: () => (
    <>
      <P crop="head" lean={8} plug="tissue" eyes="worried" blood="drip" />
      <Corner pos="tl">
        <TissueIcon size={28} />
      </Corner>
    </>
  ),
  'nose-2min': () => (
    <>
      <P crop="head" lean={6} hand="pinch-soft" extra={inhale} />
      <Corner pos="tl" label="1–2 phút">
        <ClockIcon minutes={2} size={22} />
      </Corner>
    </>
  ),
  'hold-check': () => (
    <>
      <P crop="head" lean={8} mouth="puffed" eyes="down" blood="drip" />
      <Corner pos="tl" label="?">
        <ClockIcon minutes={1} size={22} />
      </Corner>
    </>
  ),
  'mouth-15min': () => (
    <>
      <P crop="head" lean={10} hand="pinch-soft" mouth="open" extra={mouthPuffs} />
      <Corner pos="tl" label="10–15 phút">
        <ClockIcon minutes={15} size={22} />
      </Corner>
    </>
  ),
  'ice-only': () => <P crop="head" lean={8} hand="ice" blood="drip" eyes="worried" />,
  'ice-plus-pinch': () => (
    <>
      <P crop="head" lean={10} hand="pinch-soft" mouth="open" />
      <Corner pos="tl">
        <span className="flex items-center font-display text-lg text-navy">
          <IcePackIcon size={28} />+
        </span>
      </Corner>
    </>
  ),
  'ice-in-nose': () => (
    <P crop="head" lean={8} plug="ice" blood="drip" eyes="worried" mouth="frown" />
  ),
  'stopped-resting': () => (
    <P lean={0} eyes="open" mouth="smile" blood="stopped" furniture="sofa" />
  ),
  'dizzy-helped': () =>
    front(
      '-48 -142 136 150',
      <>
        <Person kind="mom" x={50} y={2} armL="down" armR="shoulder" eyes="worried" mouth="o" />
        <Person kind="brother" x={0} y={2} armR="nose" dizzy blood mouth="frown" />
      </>,
    ),
  'dry-nose': () =>
    front(
      '-60 -120 120 128',
      <Person kind="brother" x={0} y={2} armR="nose" eyes="happy" mouth="smile" scale={1.15} />,
    ),
  'rest-wait': () => (
    <>
      <P pose="lie" furniture="couch" eyes="closed" blood="drip" />
      <Corner>
        <ClockIcon minutes={20} size={22} />
      </Corner>
    </>
  ),
  'stand-up': () => <P pose="walk" eyes="dizzy" mouth="frown" blood="drip" />,
  'call-115': () =>
    front(
      '-62 -138 124 144',
      <>
        <Person kind="player" x={-14} y={2} armR="phone" eyes="worried" mouth="o" />
        <path
          d="M14 -132 H58 Q62 -132 62 -128 V-108 Q62 -104 58 -104 H34 L24 -94 L26 -104 H14 Q10 -104 10 -108 V-128 Q10 -132 14 -132 Z"
          fill={C.white}
          {...stroke(2.5)}
        />
        <text
          x={36}
          y={-112}
          textAnchor="middle"
          fontFamily="Itim, sans-serif"
          fontSize={19}
          fill={C.redDark}
        >
          115
        </text>
      </>,
    ),
  'say-nosebleed': () => (
    <Bubble>
      <path
        d="M50 22 C44 34 38 42 38 50 C38 57 43 62 50 62 C57 62 62 57 62 50 C62 42 56 34 50 22 Z"
        fill={C.blood}
        {...stroke(3)}
      />
    </Bubble>
  ),
  'full-info': () => (
    <span className="relative block h-full w-full">
      <Bubble />
      <span className="absolute inset-x-[10%] top-[16%] grid h-[52%] grid-cols-2 place-items-center">
        <PinIcon size={24} />
        <HeartIcon size={24} />
        <svg viewBox="-34 -38 68 68" width={26} height={26} aria-hidden>
          <Head look={LOOKS.brother} face={{ eyes: 'dizzy', mouth: 'frown' }} />
        </svg>
        <ClockIcon minutes={15} size={24} />
      </span>
    </span>
  ),
  'name-age': () => (
    <Bubble>
      <rect x={18} y={22} width={64} height={40} rx={5} fill="#fff1c2" {...stroke(2.5)} />
      <circle cx={34} cy={40} r={9} fill={C.skin} {...stroke(2)} />
      <path d="M25 37 C26 30 42 30 43 37 C39 34 30 34 25 37 Z" fill="#4a3426" {...stroke(1.6)} />
      <path d="M50 34 H74 M50 42 H70 M50 50 H64" {...stroke(2.5)} />
    </Bubble>
  ),
  'calm-watch': () =>
    front(
      '-70 -112 150 140',
      <>
        <rect x={-66} y={-36} width={140} height={44} rx={12} fill={C.sofa} {...stroke(2.5)} />
        <rect x={-62} y={-2} width={132} height={18} rx={6} fill={C.sofaShade} {...stroke(2.5)} />
        <Person kind="mom" pose="sit" x={34} y={-4} armR="shoulder" eyes="happy" mouth="smile" />
        <Person
          kind="brother"
          pose="sit"
          x={-12}
          y={-4}
          armR="nose"
          tilt="down"
          mouth="open"
          blood
        />
      </>,
    ),
  'lie-head-back': () => (
    <P pose="lie" furniture="bed" lean={0} tilt={-25} eyes="up" blood="throat" />
  ),
} satisfies Record<string, () => React.ReactNode>;

export type ArtKey = keyof typeof ART;
// eslint-disable-next-line react-refresh/only-export-components -- the data tests check every option's art key
export const ART_KEYS = Object.keys(ART) as ArtKey[];

/** Square illustration for an answer option. */
export function OptionArt({ art, className }: { art: ArtKey; className?: string }) {
  return <span className={`relative block ${className ?? ''}`}>{ART[art]()}</span>;
}
