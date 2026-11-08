import { C, INK, stroke, type Pt } from './ink';
import { LOOKS, type Look, type PersonKind } from './looks';

export type { Look, PersonKind } from './looks';

export type Eyes = 'open' | 'happy' | 'closed' | 'dizzy' | 'worried' | 'wide';
/** `droop`: one corner of the mouth hangs down (the viewer's right = the person's left side). */
export type Mouth = 'smile' | 'open' | 'frown' | 'o' | 'flat' | 'grin' | 'droop';
export type HeadTilt = 'normal' | 'down' | 'up';

type FaceProps = { eyes?: Eyes; mouth?: Mouth; tilt?: HeadTilt; blood?: boolean };

/** Thick limb drawn as an outlined stroke, so any pose is just a polyline. */
export function Limb({ d, color, width = 7 }: { d: string; color: string; width?: number }) {
  return (
    <>
      <path
        d={d}
        fill="none"
        stroke={INK}
        strokeWidth={width + 4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function HairBack({ look }: { look: Look }) {
  const f = { fill: look.hair, ...stroke() };
  switch (look.hairStyle) {
    case 'long':
      return <path d="M-26 -4 C-33 18 -31 34 -22 40 L22 40 C31 34 33 18 26 -4 Z" {...f} />;
    case 'ponytail':
      return <path d="M18 -14 C34 -16 38 4 30 20 C28 10 24 2 18 -2 Z" {...f} />;
    case 'bun':
      return <circle cx={0} cy={-29} r={10} {...f} />;
    case 'bob':
      return <path d="M-27 -4 C-30 14 -27 22 -20 24 L20 24 C27 22 30 14 27 -4 Z" {...f} />;
    case 'pigtails':
      return (
        <>
          <ellipse cx={-29} cy={4} rx={7} ry={11} {...f} />
          <ellipse cx={29} cy={4} rx={7} ry={11} {...f} />
        </>
      );
    case 'elder':
      return (
        <>
          <path d="M-26 -8 C-31 0 -30 10 -24 14 L-21 -4 Z" {...f} />
          <path d="M26 -8 C31 0 30 10 24 14 L21 -4 Z" {...f} />
        </>
      );
    case 'curly':
      return (
        <path
          d="M-28 6 C-36 -6 -30 -20 -24 -24 C-20 -36 -4 -38 2 -34 C12 -40 28 -32 28 -20 C36 -12 34 4 28 8 Z"
          {...f}
        />
      );
    default:
      return null;
  }
}

function HairFront({ look }: { look: Look }) {
  const f = { fill: look.hair, ...stroke() };
  switch (look.hairStyle) {
    case 'boy':
      return (
        <>
          <path
            d="M-25 -2 C-27 -22 -12 -30 0 -30 C14 -30 27 -22 25 -2 C20 -10 14 -12 8 -13 L5 -7 L1 -13 C-7 -13 -16 -11 -25 -2 Z"
            {...f}
          />
          <path d="M-1 -29 Q2 -38 9 -34" fill="none" {...stroke()} />
        </>
      );
    case 'ponytail':
      return (
        <>
          <path
            d="M-25 0 C-27 -22 -12 -30 1 -30 C15 -30 27 -22 25 0 C22 -10 16 -15 6 -17 C-2 -12 -14 -8 -25 0 Z"
            {...f}
          />
          <circle cx={20} cy={-15} r={3.5} fill={C.yellow} {...stroke(2)} />
        </>
      );
    case 'long':
      return (
        <path
          d="M-26 2 C-27 -23 -11 -31 2 -31 C18 -31 28 -20 26 2 C18 -8 8 -14 -2 -16 C-10 -10 -18 -4 -26 2 Z"
          {...f}
        />
      );
    case 'short':
    case 'buzz':
      return (
        <path
          d={
            look.hairStyle === 'short'
              ? 'M-25 -4 C-26 -24 -12 -30 0 -30 C13 -30 26 -24 25 -4 C22 -14 10 -18 0 -17 C-10 -18 -22 -14 -25 -4 Z'
              : 'M-24 -8 C-23 -24 -11 -27 0 -27 C11 -27 23 -24 24 -8 C18 -16 8 -19 0 -19 C-8 -19 -18 -16 -24 -8 Z'
          }
          {...f}
        />
      );
    case 'bun':
      return (
        <path
          d="M-25 0 C-26 -22 -12 -28 0 -28 C12 -28 26 -22 25 0 C20 -12 10 -16 0 -16 C-10 -16 -20 -12 -25 0 Z"
          {...f}
        />
      );
    case 'cap':
      return (
        <>
          <path
            d="M-26 -4 C-26 -27 -12 -33 0 -33 C13 -33 26 -27 26 -4 Z"
            fill={C.white}
            {...stroke()}
          />
          <path d="M-2 -27 h4 v5 h5 v4 h-5 v5 h-4 v-5 h-5 v-4 h5 Z" fill={C.red} {...stroke(1.5)} />
          <path d="M-28 -4 Q2 -11 36 -5 Q20 0 -28 -1 Z" fill={C.red} {...stroke()} />
          <path d="M-24 -1 C-22 -6 -16 -6 -14 -2" fill={look.hair} {...stroke(2)} />
        </>
      );
    case 'bob':
    case 'pigtails':
      return (
        <path
          d="M-26 2 C-27 -23 -11 -31 1 -31 C17 -31 27 -23 26 2 C24 -6 20 -12 14 -14 C10 -8 -4 -8 -10 -13 C-16 -10 -22 -6 -26 2 Z"
          {...f}
        />
      );
    case 'elder':
      return (
        <>
          <path d="M-25 2 C-27 -8 -24 -15 -18 -18 C-17 -10 -19 -4 -25 2 Z" {...f} />
          <path d="M25 2 C27 -8 24 -15 18 -18 C17 -10 19 -4 25 2 Z" {...f} />
          <path d="M-9 -16 Q0 -19 9 -16" fill="none" {...stroke(1.4)} opacity={0.35} />
        </>
      );
    case 'spiky':
      return (
        <path
          d="M-25 -2 L-27 -16 L-18 -14 L-17 -28 L-8 -22 L-2 -34 L5 -23 L15 -30 L16 -17 L27 -18 L25 -2 C18 -12 8 -14 0 -14 C-10 -14 -18 -10 -25 -2 Z"
          {...f}
        />
      );
    case 'curly':
      return (
        <path
          d="M-25 0 C-28 -10 -20 -16 -16 -14 C-16 -22 -6 -24 -2 -18 C2 -26 14 -24 14 -16 C20 -20 28 -12 25 0 C20 -8 12 -10 4 -10 C-6 -10 -18 -8 -25 0 Z"
          {...f}
        />
      );
  }
}

export function Face({ eyes = 'open', mouth = 'smile', tilt = 'normal', blood }: FaceProps) {
  const dy = tilt === 'down' ? 5 : tilt === 'up' ? -6 : 0;
  const s = stroke(2.2);
  const eye = (x: number) => {
    const y = 2 + dy;
    switch (eyes) {
      case 'happy':
        return (
          <path
            key={x}
            d={`M${x - 4} ${y + 1} Q${x} ${y - 4} ${x + 4} ${y + 1}`}
            fill="none"
            {...s}
          />
        );
      case 'closed':
        return (
          <path key={x} d={`M${x - 4} ${y} Q${x} ${y + 3} ${x + 4} ${y}`} fill="none" {...s} />
        );
      case 'dizzy':
        return (
          <path
            key={x}
            d={`M${x} ${y} m-1 0 a1 1 0 1 1 2 0 a2.5 2.5 0 1 1 -5 0 a4 4 0 1 1 8 0`}
            fill="none"
            {...stroke(1.6)}
          />
        );
      case 'wide':
        return (
          <g key={x}>
            <circle cx={x} cy={y} r={4.4} fill={INK} />
            <circle cx={x + 1.4} cy={y - 1.7} r={1.6} fill={C.white} />
            <circle cx={x - 1.2} cy={y + 1.8} r={0.7} fill={C.white} />
          </g>
        );
      default: {
        const cy = y + (tilt === 'down' ? 2 : 0);
        return (
          <g key={x}>
            <ellipse cx={x} cy={cy} rx={3.3} ry={4.3} fill={INK} />
            <circle cx={x + 1.2} cy={cy - 1.6} r={1.35} fill={C.white} />
            <circle cx={x - 1.1} cy={cy + 1.6} r={0.65} fill={C.white} opacity={0.85} />
          </g>
        );
      }
    }
  };
  const my = 15 + dy;
  return (
    <g>
      {eyes === 'worried' && (
        <>
          <path d={`M-13 ${-6 + dy} L-5 ${-9 + dy}`} {...s} />
          <path d={`M13 ${-6 + dy} L5 ${-9 + dy}`} {...s} />
        </>
      )}
      {eye(-8)}
      {eye(8)}
      <ellipse cx={-15} cy={10 + dy} rx={5.5} ry={3.4} fill={C.blush} opacity={0.6} />
      <ellipse cx={15} cy={10 + dy} rx={5.5} ry={3.4} fill={C.blush} opacity={0.6} />
      <path
        d={`M-17 ${9 + dy} l1.5 -1.5 M-14 ${9 + dy} l1.5 -1.5 M13 ${9 + dy} l1.5 -1.5 M16 ${9 + dy} l1.5 -1.5`}
        stroke={C.white}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.8}
      />
      {tilt === 'up' ? (
        <>
          <circle cx={-2} cy={8 + dy} r={1.2} fill={INK} />
          <circle cx={2} cy={8 + dy} r={1.2} fill={INK} />
          <path d="M-14 20 Q0 27 14 20" fill="none" {...stroke(1.6)} opacity={0.6} />
        </>
      ) : (
        <path d={`M-1.5 ${8 + dy} Q0 ${10 + dy} 1.5 ${8 + dy}`} fill="none" {...stroke(1.8)} />
      )}
      {mouth === 'smile' && (
        <path
          d={`M-5 ${my - 1} Q-2.5 ${my + 3} 0 ${my} Q2.5 ${my + 3} 5 ${my - 1}`}
          fill="none"
          {...s}
        />
      )}
      {mouth === 'grin' && (
        <path d={`M-6 ${my - 1} Q0 ${my + 7} 6 ${my - 1} Z`} fill="#b5473a" {...s} />
      )}
      {mouth === 'frown' && (
        <path d={`M-5 ${my + 2} Q0 ${my - 3} 5 ${my + 2}`} fill="none" {...s} />
      )}
      {mouth === 'flat' && <path d={`M-4 ${my} L4 ${my}`} {...s} />}
      {mouth === 'droop' && (
        <>
          <path
            d={`M-5 ${my - 1} Q-1 ${my} 2 ${my + 1.5} Q4 ${my + 3} 5 ${my + 5}`}
            fill="none"
            {...s}
          />
          <path
            d={`M9 ${my - 4} Q11 ${my} 9 ${my + 4}`}
            fill="none"
            {...stroke(1.2)}
            opacity={0.4}
          />
        </>
      )}
      {mouth === 'o' && <ellipse cx={0} cy={my} rx={2.5} ry={3} fill="#b5473a" {...stroke(2)} />}
      {mouth === 'open' && (
        <ellipse cx={0} cy={my + 1} rx={4.5} ry={4} fill="#b5473a" {...stroke(2)} />
      )}
      {blood && (
        <path
          d={`M1 ${10 + dy} C0 ${13 + dy} -1 ${16 + dy} 1 ${18 + dy} C3 ${16 + dy} 2 ${13 + dy} 1 ${10 + dy} Z`}
          fill={C.blood}
          stroke={C.blood}
          strokeWidth={1.4}
        />
      )}
    </g>
  );
}

const tiltDy = (tilt?: HeadTilt) => (tilt === 'down' ? 5 : tilt === 'up' ? -6 : 0);

export function Head({ look, face }: { look: Look; face?: FaceProps }) {
  return (
    <g>
      <HairBack look={look} />
      <ellipse cx={-24} cy={4} rx={4} ry={5.5} fill={look.skin} {...stroke(2)} />
      <ellipse cx={24} cy={4} rx={4} ry={5.5} fill={look.skin} {...stroke(2)} />
      <circle cx={0} cy={0} r={24} fill={look.skin} {...stroke()} />
      <path
        d="M-20 13 Q0 26 20 13 Q14 22 0 23.5 Q-14 22 -20 13 Z"
        fill={C.skinShade}
        opacity={0.55}
      />
      <Face {...face} />
      {look.mustache && (
        <path
          d={`M-7 ${11.5 + tiltDy(face?.tilt)} Q-3.5 ${9 + tiltDy(face?.tilt)} 0 ${11 + tiltDy(face?.tilt)} Q3.5 ${9 + tiltDy(face?.tilt)} 7 ${11.5 + tiltDy(face?.tilt)} Q3.5 ${13.5 + tiltDy(face?.tilt)} 0 ${12.5 + tiltDy(face?.tilt)} Q-3.5 ${13.5 + tiltDy(face?.tilt)} -7 ${11.5 + tiltDy(face?.tilt)} Z`}
          fill={look.hair}
          {...stroke(1.4)}
        />
      )}
      <HairFront look={look} />
      {look.hairStyle !== 'cap' && look.hairStyle !== 'buzz' && look.hairStyle !== 'elder' && (
        <path
          d="M-15 -21 Q-8 -27 1 -26.5"
          fill="none"
          stroke={C.white}
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.45}
        />
      )}
      {look.glasses && (
        <g fill="none" {...stroke(1.8)}>
          <circle
            cx={-8}
            cy={3 + (face?.tilt === 'down' ? 5 : face?.tilt === 'up' ? -6 : 0)}
            r={6}
          />
          <circle
            cx={8}
            cy={3 + (face?.tilt === 'down' ? 5 : face?.tilt === 'up' ? -6 : 0)}
            r={6}
          />
        </g>
      )}
    </g>
  );
}

export type ArmPose =
  | 'down'
  | 'nose'
  | 'wave'
  | 'phone'
  | 'point'
  | 'hip'
  | 'hold'
  | 'shoulder'
  /** Both arms straight down in front, hands on someone lying in front (CPR). */
  | 'press'
  /** Arm raised forward to the side, hand at counter height (hand under the tap). */
  | 'reach'
  /** Weak arm hanging loose at the side, hand lower than the other one (stroke). */
  | 'limp'
  /** Hand resting against the cheek (recovery position). */
  | 'cheek'
  /** Hand on the belly (stomach ache). */
  | 'belly'
  /** Hand clutching the throat – the universal sign of choking. */
  | 'throat';
export type PersonPose = 'stand' | 'sit';

export type PersonProps = FaceProps & {
  kind: PersonKind;
  pose?: PersonPose;
  /** Right arm (viewer's left). */
  armR?: ArmPose;
  /** Left arm (viewer's right). */
  armL?: ArmPose;
  dizzy?: boolean;
  sweat?: boolean;
  icePack?: boolean;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Burn on the right forearm (viewer's left) and what covers it (scenario 5). */
  burnArm?: {
    level: 'none' | 'red' | 'blister' | 'severe';
    sleeve?: 'long' | 'cut' | 'short';
    wrap?: boolean;
  };
  /** Large burn reaching the chest. */
  chestBurn?: boolean;
  /** Blanket wrapped around the body below the burn, keeping her warm. */
  blanket?: boolean;
  /** Left leg (viewer's right) bent at the knee – the top leg of the recovery position. */
  knee?: boolean;
  x: number;
  y: number;
  scale?: number;
  look?: Look;
};

/** Hand target for an arm pose, in body coordinates (hips at 0,0; head centre at 0,-62). */
function handFor(pose: ArmPose, side: 1 | -1, headY: number): { hand: Pt; elbow: Pt } {
  const sx = 15 * side;
  switch (pose) {
    case 'nose':
      // Elbow tucked in front of the chest, hand pinching the soft part of the nose.
      // The nose follows the head tilt (face is drawn 1.12× and shifted by the tilt).
      return {
        hand: {
          x: 0.5 * side,
          y: headY + 1.12 * (9.5 + (headY === -58 ? 5 : headY === -66 ? -6 : 0)),
        },
        elbow: { x: 9 * side, y: -16 },
      };
    case 'wave':
      return { hand: { x: 30 * side, y: -76 }, elbow: { x: 30 * side, y: -48 } };
    case 'phone':
      return { hand: { x: 22 * side, y: headY + 4 }, elbow: { x: 30 * side, y: -20 } };
    case 'point':
      return { hand: { x: 40 * side, y: -40 }, elbow: { x: 28 * side, y: -36 } };
    case 'hip':
      return { hand: { x: 17 * side, y: -6 }, elbow: { x: 28 * side, y: -18 } };
    case 'hold':
      return { hand: { x: 7 * side, y: -18 }, elbow: { x: 20 * side, y: -14 } };
    case 'shoulder':
      return { hand: { x: 34 * side, y: -36 }, elbow: { x: 28 * side, y: -20 } };
    case 'press':
      return { hand: { x: 4 * side, y: 22 }, elbow: { x: 12 * side, y: -6 } };
    case 'reach':
      return { hand: { x: 36 * side, y: -52 }, elbow: { x: 27 * side, y: -30 } };
    case 'limp':
      return { hand: { x: 25 * side, y: 10 }, elbow: { x: 22 * side, y: -12 } };
    case 'cheek':
      return { hand: { x: 22 * side, y: headY + 14 }, elbow: { x: 30 * side, y: -40 } };
    case 'belly':
      return { hand: { x: 3 * side, y: -10 }, elbow: { x: 19 * side, y: -12 } };
    case 'throat':
      return { hand: { x: 5 * side, y: headY + 26 }, elbow: { x: 24 * side, y: -20 } };
    default:
      return { hand: { x: sx + 6 * side, y: -4 }, elbow: { x: sx + 5 * side, y: -18 } };
  }
}

/**
 * Front-view chibi character. `x, y` is the floor point between the feet when
 * standing, or the seat point under the hips when sitting.
 */
export function Person({
  kind,
  pose = 'stand',
  armR = 'down',
  armL = 'down',
  eyes,
  mouth,
  tilt = 'normal',
  blood,
  dizzy,
  sweat,
  icePack,
  flip,
  x,
  y,
  scale,
  look: lookOverride,
  burnArm,
  chestBurn,
  blanket,
  knee,
}: PersonProps) {
  const base = LOOKS[kind];
  const look = lookOverride ?? base;
  const k = (scale ?? 1) * base.scale;
  const sitting = pose === 'sit';
  const headY = tilt === 'down' ? -58 : tilt === 'up' ? -66 : -62;
  const hipLift = sitting ? 0 : -30;
  const legColor = look.shorts ? look.skin : look.pants;

  const arm = (p: ArmPose, side: 1 | -1) => {
    const { hand, elbow } = handFor(p, side, headY);
    const shoulder = { x: 14 * side, y: -32 };
    const burned = side === -1 && burnArm && burnArm.level !== 'none' ? burnArm : null;
    const longSleeve = side === -1 && burnArm?.sleeve === 'long';
    const sleeveEnd = longSleeve
      ? { x: elbow.x + (hand.x - elbow.x) * 0.38, y: elbow.y + (hand.y - elbow.y) * 0.38 }
      : { x: (shoulder.x + elbow.x) / 2, y: (shoulder.y + elbow.y) / 2 };
    const fore = { x: (elbow.x + hand.x) / 2, y: (elbow.y + hand.y) / 2 };
    const foreAngle = (Math.atan2(hand.y - elbow.y, hand.x - elbow.x) * 180) / Math.PI;
    return (
      <g key={side}>
        <Limb
          d={
            p === 'nose'
              ? `M${shoulder.x} ${shoulder.y} L${elbow.x} ${elbow.y} L${hand.x - 3.4 * side} ${hand.y + 3.5}`
              : `M${shoulder.x} ${shoulder.y} L${elbow.x} ${elbow.y} L${hand.x} ${hand.y}`
          }
          color={look.skin}
          width={7}
        />
        {burned && (
          <g transform={`translate(${fore.x} ${fore.y}) rotate(${foreAngle})`}>
            <ellipse
              rx={burned.level === 'severe' ? 9 : 6}
              ry={4}
              fill={burned.level === 'severe' ? '#e0664c' : '#f28b6f'}
              opacity={0.9}
            />
            {burned.level === 'blister' && (
              <>
                <circle cx={-2} cy={-1} r={1.5} fill="#fff4e6" stroke="#c9644c" strokeWidth={0.7} />
                <circle cx={2.5} cy={1} r={1.8} fill="#fff4e6" stroke="#c9644c" strokeWidth={0.7} />
              </>
            )}
            {burned.level === 'severe' && (
              <>
                <ellipse cx={-3} cy={-0.5} rx={2.6} ry={1.6} fill="#f4efe6" />
                <circle cx={3.5} cy={1} r={1.2} fill="#7a3b2a" />
              </>
            )}
            {burned.sleeve === 'cut' && (
              <rect
                x={-1.5}
                y={-2.5}
                width={4}
                height={4}
                rx={0.8}
                fill={look.shirt}
                {...stroke(1)}
              />
            )}
          </g>
        )}
        <Limb
          d={`M${shoulder.x} ${shoulder.y} L${sleeveEnd.x} ${sleeveEnd.y}`}
          color={look.shirt}
          width={longSleeve ? 9.5 : 9}
        />
        {burned?.wrap && (
          <g transform={`translate(${fore.x} ${fore.y}) rotate(${foreAngle})`}>
            <rect
              x={-10}
              y={-6}
              width={20}
              height={12}
              rx={3}
              fill="#dff3fb"
              opacity={0.65}
              stroke="#7fbfd8"
              strokeWidth={1.2}
            />
          </g>
        )}
        {p === 'phone' && (
          <rect
            x={hand.x - 4}
            y={hand.y - 11}
            width={8}
            height={15}
            rx={2}
            fill="#4b5563"
            {...stroke(2)}
          />
        )}
        {p === 'nose' ? (
          <g>
            {/* thumb on one side of the nose, fingers on the other: a small pinch */}
            <ellipse
              cx={hand.x - 3.4 * side}
              cy={hand.y + 0.5}
              rx={3.2}
              ry={3.6}
              fill={look.skin}
              {...stroke(1.8)}
            />
            <ellipse
              cx={hand.x + 3.2 * side}
              cy={hand.y + 0.5}
              rx={2.2}
              ry={2.9}
              fill={look.skin}
              {...stroke(1.8)}
            />
          </g>
        ) : (
          <g>
            <circle cx={hand.x} cy={hand.y} r={5.2} fill={look.skin} {...stroke(2)} />
            <circle cx={hand.x - 1.6} cy={hand.y - 1.8} r={1.3} fill={C.white} opacity={0.6} />
          </g>
        )}
      </g>
    );
  };

  // Arms that reach the face are drawn over the head; the rest behind the torso.
  const front = (p: ArmPose) =>
    p === 'nose' ||
    p === 'phone' ||
    p === 'hold' ||
    p === 'press' ||
    p === 'cheek' ||
    p === 'belly' ||
    p === 'throat';

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -k : k} ${k}) translate(0 ${hipLift})`}>
      {/* legs */}
      {sitting ? (
        <>
          <Limb d="M-8 0 L-9 9 L-9 28" color={legColor} width={8} />
          <Limb d="M8 0 L9 9 L9 28" color={legColor} width={8} />
          {look.shorts && (
            <>
              <Limb d="M-8 0 L-9 8" color={look.pants} width={10} />
              <Limb d="M8 0 L9 8" color={look.pants} width={10} />
            </>
          )}
          <ellipse cx={-10} cy={30} rx={7.5} ry={4.6} fill="#8a5a44" {...stroke(2)} />
          <ellipse cx={10} cy={30} rx={7.5} ry={4.6} fill="#8a5a44" {...stroke(2)} />
        </>
      ) : (
        <>
          <Limb d="M-7 0 L-8 28" color={legColor} width={8} />
          <Limb d={knee ? 'M7 0 L24 12 L16 28' : 'M7 0 L8 28'} color={legColor} width={8} />
          {look.shorts && (
            <>
              <Limb d="M-7 0 L-7.5 11" color={look.pants} width={10} />
              <Limb d="M7 0 L7.5 11" color={look.pants} width={10} />
            </>
          )}
          <ellipse cx={-10} cy={30} rx={8} ry={4.6} fill="#8a5a44" {...stroke(2)} />
          <ellipse cx={knee ? 17 : 10} cy={30} rx={8} ry={4.6} fill="#8a5a44" {...stroke(2)} />
          <path
            d="M-14 28.5 q3 -2 6 -1 M6 28.5 q3 -2 6 -1"
            stroke={C.white}
            strokeWidth={1.3}
            strokeLinecap="round"
            opacity={0.6}
          />
        </>
      )}
      {!front(armR) && arm(armR, -1)}
      {!front(armL) && arm(armL, 1)}
      {/* torso */}
      {look.backpack && (
        <rect x={-19} y={-34} width={38} height={30} rx={8} fill={C.red} {...stroke()} />
      )}
      <path
        d="M-15 -35 Q-20 -16 -16 0 Q0 5 16 0 Q20 -16 15 -35 Q0 -40 -15 -35 Z"
        fill={look.shirt}
        {...stroke()}
      />
      <path d="M9 -33 Q16 -16 12 -1 Q15 -1 16 -1 Q19 -16 14 -34 Z" fill={INK} opacity={0.1} />
      <path d="M-11 -35 Q0 -28 11 -35" fill="none" stroke={INK} strokeWidth={6} opacity={0.12} />
      {look.backpack && (
        <>
          <path d="M-11 -35 L-9 -6" stroke={C.redDark} strokeWidth={4} strokeLinecap="round" />
          <path d="M11 -35 L9 -6" stroke={C.redDark} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {kind === 'grandma' && (
        <path d="M-15 -8 L15 -8" stroke={INK} strokeWidth={1.6} opacity={0.4} />
      )}
      {look.medic && (
        <g>
          <path d="M-17 -12 Q0 -8 17 -12" stroke={C.yellow} strokeWidth={3.5} fill="none" />
          <rect x={3} y={-30} width={9} height={9} rx={2} fill={C.white} {...stroke(1.4)} />
          <path d="M7.5 -28.5 V-22.5 M4.5 -25.5 H10.5" stroke={C.red} strokeWidth={2} />
        </g>
      )}
      {chestBurn && (
        <g>
          <ellipse cx={-6} cy={-26} rx={8} ry={5.5} fill="#e0664c" opacity={0.9} />
          <ellipse cx={-8} cy={-27} rx={3} ry={2} fill="#f4efe6" />
        </g>
      )}
      {blanket && (
        <g>
          <path d="M-21 -12 Q0 -18 21 -12 L24 26 Q0 32 -24 26 Z" fill="#9cc7e8" {...stroke()} />
          <path
            d="M-21 -2 Q0 -7 22 -2 M-23 12 Q0 7 23 12"
            fill="none"
            stroke={C.white}
            strokeWidth={2.4}
            strokeDasharray="5 4"
            opacity={0.8}
          />
        </g>
      )}
      <g transform={`translate(0 ${headY}) scale(1.12)`}>
        <Head look={look} face={{ eyes: dizzy ? 'dizzy' : eyes, mouth, tilt, blood }} />
        {sweat && (
          <path
            d="M27 -12 C24 -6 25 -2 28 -2 C31 -2 32 -6 27 -12 Z"
            fill={C.blue}
            {...stroke(1.6)}
          />
        )}
        {icePack && (
          <g transform="rotate(-12)">
            <rect x={-13} y={-2} width={26} height={14} rx={6} fill={C.ice} {...stroke(2)} />
            <path
              d="M-6 2 l3 3 M2 1 l3 3 M-1 7 l3 3"
              stroke={C.white}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </g>
        )}
        {dizzy && (
          <g fill={C.yellow} {...stroke(1.5)}>
            <path d="M-20 -34 l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 Z" />
            <path d="M14 -38 l2 4 4 1 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -1 Z" />
          </g>
        )}
      </g>
      {front(armR) && arm(armR, -1)}
      {front(armL) && arm(armL, 1)}
    </g>
  );
}
