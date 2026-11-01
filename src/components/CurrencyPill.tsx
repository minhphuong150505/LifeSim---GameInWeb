import { BandageIcon } from '../art/icons';
import { cn } from '../lib/cn';
import { useWalletStore } from '../store/wallet';

/** Bandage balance (băng gạc), shown in the top-right corner of every screen. */
export function CurrencyPill({ onClick, className }: { onClick?: () => void; className?: string }) {
  const bandages = useWalletStore((s) => s.bandages);
  const content = (
    <>
      <BandageIcon size={28} />
      <span className="min-w-[2ch] tabular-nums">{bandages}</span>
      {onClick && (
        <span
          aria-hidden
          className="ink-border -mr-1 ml-0.5 grid h-6 w-6 place-items-center rounded-lg bg-success text-base leading-none text-white"
        >
          +
        </span>
      )}
    </>
  );
  const cls = cn(
    'ink-border flex h-11 items-center gap-1 rounded-xl bg-paper pl-1 pr-2 font-display text-xl text-navy shadow-pop short:h-9 short:text-lg tiny:h-8 short:[&>svg]:h-6 short:[&>svg]:w-6',
    className,
  );
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${bandages} băng gạc. Mở cửa hàng`}
      className={cls}
    >
      {content}
    </button>
  ) : (
    <span aria-label={`${bandages} băng gạc`} className={cls}>
      {content}
    </span>
  );
}
