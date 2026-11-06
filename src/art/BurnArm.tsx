import { C, INK, stroke } from './ink';
import { LOOKS } from './looks';

export type BurnArmProps = {
  level: 'none' | 'red' | 'blister' | 'severe';
  ring?: boolean;
  /** Long sleeve over the forearm, cut away (a stuck scrap stays on the burn), or short. */
  sleeve?: 'long' | 'cut' | 'short';
  /** Loose cling film over the burn. */
  wrap?: boolean;
  /** Ring is stuck: the finger is swollen around it. */
  swollen?: boolean;
};

const SKIN = LOOKS.sister.skin;
const SHIRT = LOOKS.sister.shirt;
/** Middle of the burn on the forearm, in the 100×100 box. */
// eslint-disable-next-line react-refresh/only-export-components -- shared scene geometry
export const BURN_SPOT = { x: 42, y: 57 };

function Thick({ d, color, w }: { d: string; color: string; w: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 5} strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
    </>
  );
}

/**
 * Close-up of the sister's right forearm and hand, lying left → right in a 100×100 box
 * (elbow off the left edge, fingers on the right). Shows the burn and what was done to it.
 */
export function BurnArm({ level, ring, sleeve = 'short', wrap, swollen }: BurnArmProps) {
  const { x, y } = BURN_SPOT;
  return (
    <g>
      {/* forearm */}
      <Thick d="M-12 61 L72 56" color={SKIN} w={22} />
      {/* hand: palm, thumb on top, four fingers */}
      <ellipse cx={80} cy={55} rx={12} ry={11} fill={SKIN} {...stroke(2.5)} />
      <ellipse
        cx={82}
        cy={43}
        rx={4.5}
        ry={7}
        fill={SKIN}
        {...stroke(2.2)}
        transform="rotate(30 82 43)"
      />
      {[48, 54, 60, 66].map((fy, i) => (
        <ellipse
          key={fy}
          cx={93 + (i === 0 || i === 3 ? -1 : 1)}
          cy={fy - 1}
          rx={swollen && i === 1 ? 7.5 : 6.5}
          ry={swollen && i === 1 ? 3.6 : 2.9}
          fill={SKIN}
          {...stroke(2)}
        />
      ))}
      {ring && (
        <rect
          x={91.5}
          y={swollen ? 49.2 : 49.7}
          width={3.2}
          height={swollen ? 7.6 : 6.6}
          rx={1.2}
          fill={C.yellow}
          {...stroke(1.6)}
        />
      )}

      {/* the burn */}
      {level !== 'none' && (
        <g>
          <ellipse
            cx={x}
            cy={y}
            rx={level === 'severe' ? 30 : 18}
            ry={level === 'severe' ? 10 : 8}
            fill={level === 'severe' ? '#e0664c' : '#f28b6f'}
            opacity={0.85}
          />
          <ellipse cx={x + 2} cy={y - 1} rx={10} ry={4.5} fill="#f6a58f" opacity={0.9} />
          {level === 'blister' &&
            [
              [x - 8, y - 2, 3.4],
              [x + 4, y + 2, 4.2],
              [x + 10, y - 3, 2.8],
            ].map(([bx, by, r]) => (
              <g key={`${bx}`}>
                <circle cx={bx} cy={by} r={r} fill="#fff4e6" stroke="#c9644c" strokeWidth={1.4} />
                <circle cx={(bx ?? 0) - 1} cy={(by ?? 0) - 1} r={(r ?? 2) / 3} fill={C.white} />
              </g>
            ))}
          {level === 'severe' && (
            <>
              <path
                d={`M${x - 20} ${y - 2} q6 -6 14 -2 q4 6 -4 8 q-8 2 -10 -6 Z`}
                fill="#f4efe6"
                stroke="#c9644c"
                strokeWidth={1.2}
              />
              <path
                d={`M${x + 8} ${y + 1} q6 -5 12 -1 q2 5 -5 6 q-6 0 -7 -5 Z`}
                fill="#f4efe6"
                stroke="#c9644c"
                strokeWidth={1.2}
              />
              <circle cx={x - 2} cy={y + 4} r={2.6} fill="#7a3b2a" />
              <circle cx={x + 22} cy={y - 3} r={2} fill="#7a3b2a" />
            </>
          )}
        </g>
      )}

      {/* sleeve */}
      {sleeve === 'long' && (
        <>
          {/* the cuff reaches over the edge of the burn, where it is stuck */}
          <Thick d="M-12 61 L32 58.5" color={SHIRT} w={25} />
          <path d="M32 46 V71" stroke={INK} strokeWidth={2} />
        </>
      )}
      {sleeve === 'cut' && (
        <>
          <Thick d="M-12 61 L14 59.5" color={SHIRT} w={25} />
          <path
            d="M14 46 l3 3 -3 3 3 3 -3 3 3 3 -3 3 3 3"
            fill="none"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          {/* the scrap stuck to the burn is left alone */}
          <path
            d={`M${x - 4} ${y - 5} l7 -1 2 5 -3 5 -6 0 -2 -5 Z`}
            fill={SHIRT}
            {...stroke(1.6)}
          />
        </>
      )}

      {wrap && (
        <g>
          <rect
            x={x - 26}
            y={y - 14}
            width={50}
            height={27}
            rx={4}
            fill="#dff3fb"
            opacity={0.6}
            stroke="#7fbfd8"
            strokeWidth={1.6}
          />
          <path
            d={`M${x - 20} ${y - 9} l10 -2 M${x + 2} ${y + 8} l12 -2`}
            stroke={C.white}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

/** Kitchen tap with cold water running down onto (x, y). */
export function TapStream({
  x = 44,
  y = 46,
  flow = true,
}: {
  x?: number;
  y?: number;
  flow?: boolean;
}) {
  return (
    <g>
      <path
        d={`M${x - 16} 4 V12 H${x + 2} Q${x + 8} 12 ${x + 8} 18 V22`}
        fill="none"
        stroke="#9aa5b1"
        strokeWidth={6}
        strokeLinecap="round"
      />
      <path
        d={`M${x - 16} 4 V12 H${x + 2} Q${x + 8} 12 ${x + 8} 18 V22`}
        fill="none"
        stroke="#d6dde4"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {flow && (
        <>
          <rect x={x + 4} y={23} width={8} height={y - 23} fill="#bfe6f5" opacity={0.85} />
          <path
            d={`M${x + 6} 26 V${y - 4} M${x + 9.5} 30 V${y - 8}`}
            stroke={C.white}
            strokeWidth={1.4}
            strokeLinecap="round"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-12"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d={`M${x - 4} ${y + 2} q4 -4 8 0 M${x + 14} ${y + 3} q4 -4 8 0`}
            fill="none"
            stroke={C.blueDark}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}
