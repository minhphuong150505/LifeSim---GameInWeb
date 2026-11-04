import type { SlotId, Variant } from '../data/station';
import { C, INK, stroke } from './ink';

export const STATION_W = 400;
export const STATION_H = 300;
const WALL_Y = 196;

/**
 * Every decoration is drawn around its own origin (bottom-centre, or top-centre for the lamp)
 * so the same drawing is used in the room and as a thumbnail in the catalogue.
 */
type Piece = {
  /** Where the origin sits in the room. */
  at: { x: number; y: number };
  /** Local bounding box, for thumbnails and the empty-slot placeholder. */
  box: { x: number; y: number; w: number; h: number };
  draw: (v: Variant) => React.ReactNode;
};

function Cross({ x, y, s = 1, fill = C.red }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M-3 -9 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6 Z"
      fill={fill}
      {...stroke(1.6)}
    />
  );
}

const PIECES: Record<Exclude<SlotId, 'theme'>, Piece> = {
  cabinet: {
    at: { x: 56, y: 202 },
    box: { x: -40, y: -112, w: 80, h: 114 },
    draw: (v) => (
      <g>
        <rect x={-36} y={-108} width={72} height={106} rx={6} fill={v.main} {...stroke(3)} />
        {v.style === 2 ? (
          <>
            <rect x={-28} y={-100} width={56} height={58} rx={4} fill={v.accent} {...stroke(2)} />
            <path d="M-28 -71 H28" {...stroke(2)} />
            {[-18, -4, 12].map((x, i) => (
              <rect
                key={x}
                x={x}
                y={-96 + (i % 2) * 2}
                width={8}
                height={20 - (i % 2) * 4}
                rx={2}
                fill={[C.white, C.yellow, C.green][i]}
                {...stroke(1.4)}
              />
            ))}
            <rect x={-20} y={-66} width={16} height={18} rx={3} fill={C.white} {...stroke(1.4)} />
            <rect x={4} y={-64} width={14} height={16} rx={3} fill={C.blue} {...stroke(1.4)} />
          </>
        ) : (
          <>
            <rect x={-28} y={-100} width={26} height={58} rx={4} fill={v.accent} {...stroke(2)} />
            <rect x={2} y={-100} width={26} height={58} rx={4} fill={v.accent} {...stroke(2)} />
            <circle cx={-6} cy={-70} r={2.2} fill={INK} />
            <circle cx={6} cy={-70} r={2.2} fill={INK} />
          </>
        )}
        <rect x={-28} y={-36} width={56} height={26} rx={4} fill={v.accent} {...stroke(2)} />
        <path d="M-8 -23 H8" {...stroke(2.5)} />
        <Cross x={0} y={-118} s={1.1} />
        {v.style === 1 && <Cross x={-15} y={-80} s={0.8} />}
      </g>
    ),
  },
  bed: {
    at: { x: 300, y: 236 },
    box: { x: -80, y: -82, w: 160, h: 86 },
    draw: (v) => (
      <g>
        <rect x={-74} y={-76} width={14} height={76} rx={4} fill={v.main} {...stroke(2.5)} />
        <rect x={60} y={-52} width={12} height={52} rx={4} fill={v.main} {...stroke(2.5)} />
        <rect x={-68} y={-40} width={136} height={22} rx={6} fill={v.main} {...stroke(2.5)} />
        <rect x={-64} y={-52} width={128} height={14} rx={6} fill={C.white} {...stroke(2)} />
        <rect x={-60} y={-64} width={34} height={16} rx={7} fill={v.accent} {...stroke(2)} />
        <path
          d={v.style === 1 ? 'M-20 -52 Q20 -62 62 -52 V-38 H-20 Z' : 'M-20 -52 H62 V-38 H-20 Z'}
          fill={v.accent}
          {...stroke(2)}
        />
        {v.style === 2 && (
          <>
            <circle cx={10} cy={-46} r={3} fill={C.red} />
            <circle cx={30} cy={-46} r={3} fill={C.blue} />
            <circle cx={50} cy={-46} r={3} fill={C.green} />
          </>
        )}
        {v.style === 0 && <Cross x={20} y={-45} s={0.6} />}
        <path d="M-64 -18 V0 M64 -18 V0" {...stroke(3)} />
      </g>
    ),
  },
  chair: {
    at: { x: 168, y: 262 },
    box: { x: -36, y: -66, w: 72, h: 68 },
    draw: (v) =>
      v.style === 2 ? (
        <g>
          <path
            d="M-32 0 C-36 -26 -22 -50 0 -50 C22 -50 36 -26 32 0 Z"
            fill={v.main}
            {...stroke(3)}
          />
          <path d="M-20 -14 Q0 -24 20 -14" fill="none" stroke={v.accent} strokeWidth={4} />
          <path d="M-14 -34 Q0 -40 14 -34" fill="none" stroke={v.accent} strokeWidth={3} />
        </g>
      ) : v.style === 1 ? (
        <g>
          <rect x={-26} y={-60} width={52} height={40} rx={12} fill={v.main} {...stroke(3)} />
          <rect x={-34} y={-38} width={14} height={30} rx={6} fill={v.accent} {...stroke(2.5)} />
          <rect x={20} y={-38} width={14} height={30} rx={6} fill={v.accent} {...stroke(2.5)} />
          <rect x={-22} y={-26} width={44} height={16} rx={6} fill={v.main} {...stroke(2.5)} />
          <path d="M-28 -8 V0 M28 -8 V0" {...stroke(3)} />
        </g>
      ) : (
        <g>
          <rect x={-22} y={-64} width={44} height={10} rx={4} fill={v.main} {...stroke(2.5)} />
          <path d="M-18 -54 V-30 M18 -54 V-30" {...stroke(3)} />
          <rect x={-26} y={-32} width={52} height={10} rx={4} fill={v.accent} {...stroke(2.5)} />
          <path d="M-22 -22 L-24 0 M22 -22 L24 0" {...stroke(3)} />
        </g>
      ),
  },
  poster: {
    at: { x: 160, y: 122 },
    box: { x: -34, y: -88, w: 68, h: 92 },
    draw: (v) => (
      <g>
        <rect x={-30} y={-84} width={60} height={80} rx={4} fill={v.main} {...stroke(2.5)} />
        <rect x={-24} y={-78} width={48} height={68} rx={3} fill={v.accent} {...stroke(1.6)} />
        {v.style === 0 && (
          <>
            <Cross x={0} y={-52} s={1.6} />
            <path d="M-14 -24 H14 M-10 -17 H10" {...stroke(2)} />
          </>
        )}
        {v.style === 1 && (
          <>
            <text
              x={0}
              y={-40}
              textAnchor="middle"
              fontFamily="Itim, sans-serif"
              fontSize={22}
              fill={C.redDark}
            >
              115
            </text>
            <rect x={-8} y={-34} width={16} height={22} rx={3} fill={C.blue} {...stroke(1.6)} />
            <path d="M-12 -70 H12" {...stroke(2)} />
          </>
        )}
        {v.style === 2 && (
          <>
            <path
              d="M0 -26 C-8 -32 -16 -38 -16 -48 C-16 -55 -11 -58 -6 -58 C-3 -58 -1 -56 0 -54 C1 -56 3 -58 6 -58 C11 -58 16 -55 16 -48 C16 -38 8 -32 0 -26 Z"
              fill={C.red}
              {...stroke(1.8)}
            />
            <path
              d="M-12 -46 H-4 L-1 -52 L3 -40 L6 -46 H12"
              fill="none"
              stroke={C.white}
              strokeWidth={2}
            />
            <path d="M-14 -18 H14" {...stroke(2)} />
          </>
        )}
      </g>
    ),
  },
  plant: {
    at: { x: 112, y: 214 },
    box: { x: -24, y: -76, w: 48, h: 78 },
    draw: (v) => (
      <g>
        {v.style === 0 && (
          <>
            <rect x={-8} y={-58} width={16} height={42} rx={8} fill={v.main} {...stroke(2.5)} />
            <rect x={-20} y={-44} width={12} height={18} rx={6} fill={v.main} {...stroke(2.2)} />
            <rect x={8} y={-50} width={12} height={20} rx={6} fill={v.main} {...stroke(2.2)} />
            <circle cx={0} cy={-60} r={4} fill={v.accent} {...stroke(1.6)} />
          </>
        )}
        {v.style === 1 && (
          <>
            <path
              d="M0 -16 C-24 -30 -22 -56 -4 -70 C-2 -50 -2 -32 0 -16 Z"
              fill={v.main}
              {...stroke(2.2)}
            />
            <path
              d="M0 -16 C24 -28 24 -54 6 -66 C4 -46 2 -30 0 -16 Z"
              fill={v.main}
              {...stroke(2.2)}
            />
            <path d="M0 -16 C-6 -30 -2 -44 2 -52" fill="none" {...stroke(1.6)} />
          </>
        )}
        {v.style === 2 && (
          <>
            <path d="M0 -16 V-54" {...stroke(3)} />
            <path
              d="M0 -30 C10 -34 16 -30 18 -24 C10 -22 4 -24 0 -30 Z"
              fill={C.green}
              {...stroke(1.8)}
            />
            {Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return (
                <ellipse
                  key={i}
                  cx={Math.cos(a) * 11}
                  cy={-58 + Math.sin(a) * 11}
                  rx={6}
                  ry={3.4}
                  transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 11} ${-58 + Math.sin(a) * 11})`}
                  fill={v.main}
                  {...stroke(1.4)}
                />
              );
            })}
            <circle cx={0} cy={-58} r={7} fill={C.woodDark} {...stroke(1.8)} />
          </>
        )}
        <path
          d="M-16 -18 H16 L12 0 H-12 Z"
          fill={v.style === 0 ? C.wood : v.accent}
          {...stroke(2.5)}
        />
      </g>
    ),
  },
  rug: {
    at: { x: 196, y: 272 },
    box: { x: -96, y: -26, w: 192, h: 52 },
    draw: (v) => (
      <g>
        {v.style === 0 ? (
          <>
            <ellipse cx={0} cy={0} rx={90} ry={22} fill={v.main} {...stroke(2.5)} />
            <ellipse cx={0} cy={0} rx={66} ry={15} fill="none" stroke={v.accent} strokeWidth={4} />
            <ellipse cx={0} cy={0} rx={40} ry={8} fill={v.accent} opacity={0.8} />
          </>
        ) : (
          <>
            <defs>
              <clipPath id={`rug-${v.id}`}>
                <rect x={-88} y={-20} width={176} height={40} rx={6} />
              </clipPath>
            </defs>
            <rect x={-88} y={-20} width={176} height={40} rx={6} fill={v.main} />
            <g clipPath={`url(#rug-${v.id})`}>
              {v.style === 1
                ? [-14, -2, 10].map((y) => (
                    <rect key={y} x={-90} y={y} width={180} height={5} fill={v.accent} />
                  ))
                : Array.from({ length: 22 }, (_, i) => (
                    <rect
                      key={i}
                      x={-88 + (i % 11) * 16}
                      y={i < 11 ? -20 : 0}
                      width={8}
                      height={20}
                      fill={v.accent}
                      opacity={0.75}
                      transform={i < 11 ? undefined : 'translate(8 0)'}
                    />
                  ))}
            </g>
            <rect x={-88} y={-20} width={176} height={40} rx={6} fill="none" {...stroke(2.5)} />
          </>
        )}
      </g>
    ),
  },
  lamp: {
    at: { x: 318, y: 0 },
    box: { x: -26, y: -2, w: 52, h: 74 },
    draw: (v) => (
      <g>
        <path d="M0 0 V34" {...stroke(2)} />
        {v.style === 0 && (
          <path
            d="M-22 56 C-22 40 -12 32 0 32 C12 32 22 40 22 56 Z"
            fill={v.main}
            {...stroke(2.5)}
          />
        )}
        {v.style === 1 && <path d="M-6 32 H6 L22 58 H-22 Z" fill={v.main} {...stroke(2.5)} />}
        {v.style === 2 && <circle cx={0} cy={50} r={17} fill={v.main} {...stroke(2.5)} />}
        <circle cx={0} cy={v.style === 2 ? 50 : 60} r={6} fill={v.accent} {...stroke(1.8)} />
        <path
          d="M-18 68 L-24 74 M0 70 V76 M18 68 L24 74"
          stroke={C.yellow}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </g>
    ),
  },
};

/** Order in which the room is painted (back to front). */
const ORDER: Exclude<SlotId, 'theme'>[] = [
  'lamp',
  'poster',
  'cabinet',
  'plant',
  'rug',
  'bed',
  'chair',
];

function Backdrop({ theme }: { theme: Variant | undefined }) {
  const wall = theme?.main ?? C.wall;
  const floor = theme?.accent ?? C.floor;
  const night = theme?.style === 2;
  const mint = theme?.style === 1;
  return (
    <g>
      <rect x={-600} y={-300} width={1600} height={WALL_Y + 300} fill={wall} />
      <rect x={-600} y={WALL_Y} width={1600} height={600} fill={floor} />
      {night &&
        [
          [40, 30],
          [120, 20],
          [230, 40],
          [360, 26],
          [200, 90],
          [380, 120],
          [20, 130],
        ].map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            transform={`translate(${x} ${y})`}
            d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z"
            fill={C.white}
          />
        ))}
      {mint &&
        Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={`M${i * 36 - 10} ${WALL_Y} V0`}
            stroke="#ffffff"
            strokeWidth={6}
            opacity={0.5}
          />
        ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={`M${-20 + i * 60} ${WALL_Y} L${-60 + i * 70} 300`}
          stroke={INK}
          strokeWidth={1}
          opacity={0.12}
        />
      ))}
      <rect x={-600} y={WALL_Y - 8} width={1600} height={8} fill={INK} opacity={0.08} />
      <path d={`M-600 ${WALL_Y} H1000`} {...stroke(2.5)} />
      {/* station sign */}
      <g transform="translate(236 34)">
        <rect x={-48} y={-16} width={110} height={30} rx={8} fill={C.white} {...stroke(2.5)} />
        <Cross x={-34} y={-1} s={0.8} />
        <text
          x={-24}
          y={5}
          textAnchor="start"
          fontFamily="Itim, sans-serif"
          fontSize={12}
          fill={INK}
        >
          TRẠM CỨU HỘ
        </text>
      </g>
      {/* window */}
      <g transform="translate(370 76)">
        <rect
          x={-26}
          y={-30}
          width={52}
          height={64}
          rx={4}
          fill={night ? '#3c4a7a' : C.sky}
          {...stroke(2.5)}
        />
        {night ? (
          <circle cx={8} cy={-12} r={8} fill={C.yellow} />
        ) : (
          <circle cx={10} cy={-14} r={7} fill={C.yellow} {...stroke(1.4)} />
        )}
        <path d="M0 -30 V34 M-26 2 H26" {...stroke(2)} />
      </g>
    </g>
  );
}

type RoomProps = {
  placed: Partial<Record<SlotId, Variant>>;
  /** Highlighted slot (open in the catalogue). */
  selected?: SlotId | null;
  /** Tapping an item or an empty slot. */
  onSlot?: (slot: SlotId) => void;
};

/** The player's Rescue Station: backdrop from the theme + one decoration per slot. */
export function StationRoom({ placed, selected, onSlot }: RoomProps) {
  return (
    <g>
      <Backdrop theme={placed.theme} />
      {ORDER.map((slot) => {
        const piece = PIECES[slot];
        const v = placed[slot];
        const { x, y, w, h } = piece.box;
        const hot = selected === slot;
        return (
          <g
            key={slot}
            transform={`translate(${piece.at.x} ${piece.at.y})`}
            onClick={onSlot ? () => onSlot(slot) : undefined}
            className={onSlot ? 'cursor-pointer' : undefined}
          >
            {v ? (
              piece.draw(v)
            ) : (
              <g opacity={hot ? 0.9 : 0.55}>
                <rect
                  x={x + 4}
                  y={y + 4}
                  width={w - 8}
                  height={h - 8}
                  rx={10}
                  fill="rgb(255 255 255 / 0.45)"
                  stroke={INK}
                  strokeWidth={2}
                  strokeDasharray="6 5"
                />
                <text
                  x={x + w / 2}
                  y={y + h / 2 + 8}
                  textAnchor="middle"
                  fontFamily="Itim, sans-serif"
                  fontSize={24}
                  fill={INK}
                >
                  +
                </text>
              </g>
            )}
            {hot && (
              <rect
                x={x - 2}
                y={y - 2}
                width={w + 4}
                height={h + 4}
                rx={12}
                fill="none"
                stroke={C.yellow}
                strokeWidth={4}
                strokeDasharray="8 5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;26"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </rect>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** Thumbnail of one variant for the catalogue. */
export function VariantArt({ variant, className }: { variant: Variant; className?: string }) {
  if (variant.slot === 'theme') {
    return (
      <svg viewBox="0 0 120 90" className={className} aria-hidden>
        <rect x={0} y={0} width={120} height={60} fill={variant.main} />
        <rect x={0} y={60} width={120} height={30} fill={variant.accent} />
        {variant.style === 2 && (
          <>
            <circle cx={30} cy={20} r={2.5} fill={C.white} />
            <circle cx={80} cy={14} r={2.5} fill={C.white} />
            <circle cx={100} cy={36} r={2} fill={C.white} />
          </>
        )}
        <path d="M0 60 H120" {...stroke(2.5)} />
      </svg>
    );
  }
  const piece = PIECES[variant.slot];
  const pad = 6;
  const { x, y, w, h } = piece.box;
  const side = Math.max(w, h) + pad * 2;
  return (
    <svg
      viewBox={`${x + w / 2 - side / 2} ${y + h / 2 - side / 2} ${side} ${side}`}
      className={className}
      aria-hidden
    >
      {piece.draw(variant)}
    </svg>
  );
}
