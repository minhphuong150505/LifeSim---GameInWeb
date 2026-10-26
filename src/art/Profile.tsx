import { C, INK, rotate, stroke, type Pt } from './ink';
import { LOOKS } from './looks';
import { Limb } from './Person';
import { profileGeometry, type ProfileGeometry } from './profileGeometry';

export type { ProfileGeometry, ProfileProps } from './profileGeometry';
import type { ProfileHand, ProfileProps } from './profileGeometry';

/**
 * Side-view kid facing right, built from a tiny skeleton (hip → neck → head) so
 * poses like "lean forward" or "head back" are just angles. Origin = hip point.
 */
export function ProfileKid(props: ProfileProps) {
  const {
    pose = 'sit',
    hand = 'lap',
    mouth = 'closed',
    eyes = 'open',
    blood = 'none',
    plug = null,
    furniture = 'none',
    look = LOOKS.brother,
  } = props;
  const g = profileGeometry(props);
  const lie = pose === 'lie';
  const bodyAngle = lie ? -90 : (props.lean ?? 0);
  const shoulder = rotate({ x: 0, y: -31 }, g.hip, bodyAngle);
  const legColor = look.shorts ? look.skin : look.pants;

  // Hand target in world space.
  const handAt: Record<ProfileHand, Pt> = {
    lap: lie ? rotate({ x: 12, y: -6 }, g.hip, -90) : { x: 16, y: -4 },
    down: lie ? rotate({ x: 4, y: 4 }, g.hip, -90) : { x: 3, y: 4 },
    'pinch-soft': g.at(24, 0),
    'pinch-bridge': g.at(19, -9),
    'pinch-one': g.at(21, 5),
    phone: g.at(-1, 4),
    ice: g.at(25, -4),
    blow: g.at(26, 3),
    chest: rotate({ x: 12, y: -22 }, g.hip, bodyAngle),
  };
  const handP = handAt[hand];
  const mid = { x: (shoulder.x + handP.x) / 2, y: (shoulder.y + handP.y) / 2 };
  // Hands at the face come up from below the chin, so the mouth stays visible.
  const atFace = ['pinch-soft', 'pinch-bridge', 'pinch-one', 'ice', 'blow'].includes(hand);
  const elbow = atFace
    ? g.at(34, 34)
    : hand === 'phone'
      ? g.at(-4, 36)
      : lie
        ? { x: mid.x, y: mid.y - 12 }
        : { x: mid.x - 6, y: mid.y + 14 };
  const sleeve = { x: (shoulder.x + elbow.x) / 2, y: (shoulder.y + elbow.y) / 2 };

  const legs = (() => {
    if (pose === 'sit') return ['M-2 0 L26 2 L28 28', 'M2 0 L30 2 L32 28'];
    if (pose === 'walk') return ['M0 0 L-8 25 L-14 50', 'M0 0 L10 25 L16 50'];
    return ['M-2 0 L-1 26 L0 52', 'M2 0 L3 26 L4 52'];
  })();
  const feet =
    pose === 'sit'
      ? [
          { x: 31, y: 30 },
          { x: 35, y: 30 },
        ]
      : pose === 'walk'
        ? [
            { x: -11, y: 52 },
            { x: 19, y: 52 },
          ]
        : [
            { x: 3, y: 54 },
            { x: 7, y: 54 },
          ];

  const s = stroke(2.2);

  return (
    <g>
      {furniture === 'sofa' && (
        <g>
          <rect x={-40} y={-44} width={20} height={70} rx={9} fill={C.sofaShade} {...stroke()} />
          <rect x={-34} y={6} width={74} height={22} rx={8} fill={C.sofa} {...stroke()} />
          <path d="M-30 28 v6 M34 28 v6" {...stroke(3)} />
        </g>
      )}
      {furniture === 'bed' && (
        <g>
          <rect x={-104} y={12} width={180} height={18} rx={6} fill={C.white} {...stroke()} />
          <rect x={-104} y={30} width={180} height={12} rx={4} fill={C.wood} {...stroke()} />
          <ellipse cx={-80} cy={8} rx={20} ry={8} fill="#f2e6c8" {...stroke()} />
          <path d="M-100 42 v8 M72 42 v8" {...stroke(3)} />
        </g>
      )}
      {furniture === 'couch' && (
        <g>
          <rect x={-104} y={-26} width={180} height={40} rx={12} fill={C.sofaShade} {...stroke()} />
          <rect x={-104} y={12} width={180} height={24} rx={8} fill={C.sofa} {...stroke()} />
          <rect x={-112} y={-4} width={22} height={42} rx={9} fill={C.sofa} {...stroke()} />
          <path d="M-98 36 v8 M66 36 v8" {...stroke(3)} />
        </g>
      )}
      <g transform={lie ? `rotate(-90 ${g.hip.x} ${g.hip.y})` : undefined}>
        <Limb d={legs[0] as string} color={legColor} width={8} />
        {look.shorts && (
          <Limb d={pose === 'sit' ? 'M-2 0 L12 1' : 'M-2 0 L-1 12'} color={look.pants} width={10} />
        )}
        {feet[0] && (
          <ellipse cx={feet[0].x} cy={feet[0].y} rx={7} ry={3.8} fill="#5b4a42" {...stroke(2)} />
        )}
        <Limb d={legs[1] as string} color={legColor} width={8} />
        {look.shorts && (
          <Limb d={pose === 'sit' ? 'M2 0 L16 1' : 'M2 0 L3 12'} color={look.pants} width={10} />
        )}
        {feet[1] && (
          <ellipse cx={feet[1].x} cy={feet[1].y} rx={7} ry={3.8} fill="#5b4a42" {...stroke(2)} />
        )}
      </g>
      {/* torso */}
      <Limb
        d={`M${g.hip.x} ${g.hip.y} L${shoulder.x} ${shoulder.y}`}
        color={look.shirt}
        width={21}
      />
      {/* head */}
      <g transform={`translate(${g.head.x} ${g.head.y}) rotate(${g.angle})`}>
        <circle r={22} fill={look.skin} {...stroke()} />
        {/* nose */}
        <path d="M19 -9 C24 -6 28 -1 26 3 C25 5 22 5 20 4" fill={look.skin} {...stroke(2.2)} />
        <path
          d="M-22 4 C-26 -14 -10 -27 5 -24 C15 -22 21 -15 22 -9 C14 -13 7 -12 3 -8 C0 -4 -1 2 -5 -2 C-9 -1 -13 4 -14 9 C-17 8 -20 7 -22 4 Z"
          fill={look.hair}
          {...stroke()}
        />
        <ellipse cx={-6} cy={4} rx={3.6} ry={5} fill={look.skin} {...stroke(2)} />
        <ellipse cx={11} cy={7} rx={4} ry={2.6} fill={C.blush} opacity={0.8} />
        {/* eye */}
        {eyes === 'closed' && <path d="M7 -3 q3 3 6 0" fill="none" {...s} />}
        {eyes === 'dizzy' && (
          <path
            d="M10 -3 m-1 0 a1 1 0 1 1 2 0 a2.5 2.5 0 1 1 -5 0 a4 4 0 1 1 8 0"
            fill="none"
            {...stroke(1.5)}
          />
        )}
        {(eyes === 'open' || eyes === 'worried') && (
          <ellipse cx={11} cy={-3} rx={2.2} ry={3} fill={INK} />
        )}
        {eyes === 'up' && <ellipse cx={12} cy={-5} rx={2.2} ry={3} fill={INK} />}
        {eyes === 'down' && <ellipse cx={11} cy={-1} rx={2.2} ry={2.6} fill={INK} />}
        {eyes === 'worried' && <path d="M6 -10 L14 -12" {...s} />}
        {/* mouth */}
        {mouth === 'closed' && <path d="M14 11 L19 11" {...s} />}
        {mouth === 'smile' && <path d="M13 10 Q17 14 20 10" fill="none" {...s} />}
        {mouth === 'frown' && <path d="M13 13 Q16 9 20 12" fill="none" {...s} />}
        {mouth === 'open' && (
          <ellipse cx={17} cy={12} rx={3.2} ry={3.6} fill="#b5473a" {...stroke(2)} />
        )}
        {mouth === 'wide' && (
          <ellipse cx={17} cy={12.5} rx={4} ry={4.8} fill="#b5473a" {...stroke(2)} />
        )}
        {mouth === 'puffed' && (
          <>
            <path d="M15 11 L19 11" {...s} />
            <circle cx={10} cy={9} r={6} fill={C.blush} opacity={0.6} />
          </>
        )}
        {blood === 'throat' && (
          <path
            d="M22 4 C14 8 6 10 2 16 C-1 20 -2 24 -2 30"
            fill="none"
            stroke={C.blood}
            strokeWidth={3}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        )}
        {plug === 'cotton' && <circle cx={24} cy={4} r={4.5} fill={C.white} {...stroke(1.8)} />}
        {plug === 'tissue' && (
          <path d="M21 3 l7 4 l-2 6 l-6 -3 Z" fill={C.white} {...stroke(1.8)} />
        )}
        {plug === 'ice' && (
          <rect x={21} y={1} width={8} height={7} rx={1.5} fill={C.ice} {...stroke(1.8)} />
        )}
      </g>
      {blood === 'drip' && (
        <path
          d={`M${g.nostril.x} ${g.nostril.y} C${g.nostril.x - 1} ${g.nostril.y + 6} ${g.nostril.x - 3} ${g.nostril.y + 10} ${g.nostril.x} ${g.nostril.y + 12} C${g.nostril.x + 3} ${g.nostril.y + 10} ${g.nostril.x + 1} ${g.nostril.y + 6} ${g.nostril.x} ${g.nostril.y} Z`}
          fill={C.blood}
          stroke={C.blood}
          strokeWidth={1.5}
        />
      )}
      {blood === 'stopped' && (
        <circle cx={g.nostril.x} cy={g.nostril.y + 1} r={1.6} fill={C.blood} />
      )}
      {/* arm (drawn over head when the hand reaches the face) */}
      <Limb
        d={`M${shoulder.x} ${shoulder.y} L${elbow.x} ${elbow.y} L${handP.x} ${handP.y}`}
        color={look.skin}
        width={6.5}
      />
      <Limb
        d={`M${shoulder.x} ${shoulder.y} L${sleeve.x} ${sleeve.y}`}
        color={look.shirt}
        width={8.5}
      />
      {hand === 'phone' && (
        <rect
          x={handP.x - 5}
          y={handP.y - 12}
          width={9}
          height={17}
          rx={2}
          fill="#4b5563"
          {...stroke(2)}
        />
      )}
      {hand === 'ice' && (
        <g transform={`rotate(${g.angle + 20} ${handP.x} ${handP.y})`}>
          <rect
            x={handP.x - 6}
            y={handP.y - 10}
            width={22}
            height={14}
            rx={6}
            fill={C.ice}
            {...stroke(2)}
          />
          <path
            d={`M${handP.x} ${handP.y - 6} l3 3 M${handP.x + 7} ${handP.y - 7} l3 3`}
            stroke={C.white}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </g>
      )}
      {hand === 'blow' && (
        <path
          d={`M${handP.x - 2} ${handP.y - 6} l10 2 l-1 10 l-9 -2 Z`}
          fill={C.white}
          {...stroke(1.8)}
        />
      )}
      <circle cx={handP.x} cy={handP.y} r={5.2} fill={look.skin} {...stroke(2)} />
      {(hand === 'pinch-soft' || hand === 'pinch-bridge') && (
        <path d={`M${handP.x + 2} ${handP.y - 5} q5 2 3 7`} fill="none" {...stroke(1.8)} />
      )}
      {hand === 'pinch-one' && <path d={`M${handP.x} ${handP.y - 4} l6 -3`} {...stroke(3)} />}
    </g>
  );
}

/** Stand-alone SVG wrapper for a profile kid with an automatic crop. */
export function ProfileArt({
  crop = 'body',
  className,
  children,
  ...props
}: ProfileProps & {
  crop?: 'body' | 'head' | 'wide';
  className?: string;
  children?: (g: ProfileGeometry) => React.ReactNode;
}) {
  const g = profileGeometry(props);
  const pose = props.pose ?? 'sit';
  let vb: string;
  if (crop === 'head') {
    vb = `${g.head.x - 32} ${g.head.y - 35} 76 76`;
  } else if (pose === 'lie') {
    vb = '-106 -70 184 130';
  } else if (crop === 'wide') {
    vb = '-80 -118 170 170';
  } else if (pose === 'sit') {
    vb = '-66 -108 144 144';
  } else {
    vb = '-80 -110 168 168';
  }
  return (
    <svg viewBox={vb} className={className} aria-hidden>
      <ProfileKid {...props} />
      {children?.(g)}
    </svg>
  );
}
