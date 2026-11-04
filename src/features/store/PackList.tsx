import { BandageIcon } from '../../art/icons';
import { PACKS, formatVnd, type BandagePack } from '../../data/packs';
import { cn } from '../../lib/cn';

/** The 4 bandage packs as buy buttons. */
export function PackList({
  onBuy,
  suggested,
}: {
  onBuy: (pack: BandagePack) => void;
  /** Pack that covers what the player is missing (gets a ring). */
  suggested?: string;
}) {
  return (
    <ul className="grid grid-cols-4 gap-2">
      {PACKS.map((p) => (
        <li key={p.id} className="relative">
          {p.tag && (
            <span className="ink-border absolute -top-2.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-1.5 font-display text-[11px] leading-4 text-white">
              {p.tag}
            </span>
          )}
          <button
            type="button"
            onClick={() => onBuy(p)}
            aria-label={`${p.name}: ${p.amount} băng gạc giá ${formatVnd(p.price)}`}
            className={cn(
              'ink-border flex h-full w-full flex-col items-center rounded-2xl bg-paper px-1 pb-1 pt-2 text-center shadow-pop active:translate-y-0.5',
              suggested === p.id && 'ring-4 ring-accent',
            )}
          >
            <span className="flex items-center gap-0.5 font-display text-xl leading-none text-navy">
              <BandageIcon size={26} />
              {p.amount.toLocaleString('vi-VN')}
            </span>
            <span className="mt-0.5 font-display text-[13px] leading-tight text-navy/80">
              {p.name}
            </span>
            <span className="ink-border mt-1 w-full rounded-xl bg-accent py-0.5 font-display text-[15px] text-navy">
              {formatVnd(p.price)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
