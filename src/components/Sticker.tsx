import { assets } from '../data/assets';
import { cn } from '../lib/cn';

const STICKERS = {
  bandage: assets.proposal.bandage,
  kit: assets.proposal.firstAidKit,
  signs: assets.proposal.woodenSigns,
  trophy: assets.proposal.trophy,
} as const;

type StickerProps = { name: keyof typeof STICKERS; className?: string };

/** Purely decorative proposal artwork (hidden from assistive tech). */
export function Sticker({ name, className }: StickerProps) {
  return (
    <img
      src={STICKERS[name]}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn('pointer-events-none select-none', className)}
    />
  );
}
