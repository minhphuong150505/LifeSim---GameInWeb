import { BagIcon, BandageIcon, TrophyIcon } from '../art/icons';
import { C, stroke } from '../art/ink';

function Signpost({ className }: { className?: string }) {
  const board = (y: number, text: string, dir: 1 | -1) => (
    <g>
      <path
        d={
          dir === 1
            ? `M8 ${y} H74 L82 ${y + 9} L74 ${y + 18} H8 Z`
            : `M88 ${y} H22 L14 ${y + 9} L22 ${y + 18} H88 Z`
        }
        fill={C.wood}
        {...stroke(2.5)}
      />
      <text
        x={48}
        y={y + 13.5}
        textAnchor="middle"
        fontFamily="Itim, sans-serif"
        fontSize={11.5}
        fill="#3b2d26"
      >
        {text}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 96 110" className={className} aria-hidden>
      <rect x={44} y={10} width={8} height={98} rx={2} fill={C.woodDark} {...stroke(2.5)} />
      {board(12, 'LEARN', 1)}
      {board(40, 'PRACTICE', -1)}
      {board(68, 'BE READY', 1)}
    </svg>
  );
}

const STICKERS = {
  bandage: BandageIcon,
  kit: BagIcon,
  signs: Signpost,
  trophy: TrophyIcon,
} as const;

type StickerProps = { name: keyof typeof STICKERS; className?: string };

/** Purely decorative 2D artwork (hidden from assistive tech). */
export function Sticker({ name, className }: StickerProps) {
  const Art = STICKERS[name];
  return (
    <span className={`inline-flex ${className ?? ''}`} aria-hidden>
      <Art className="pointer-events-none h-full w-auto select-none" />
    </span>
  );
}
