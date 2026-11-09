import { useState } from 'react';
import { ShopIcon } from '../../art/icons';
import { BandageBank } from './BandageBank';
import { Shop } from './Shop';

/**
 * "Cửa hàng" – the item shop only matters inside Core game, so it lives in the Core game
 * headers (topics and round list) instead of the lobby.
 */
export function ShopButton() {
  const [panel, setPanel] = useState<'shop' | 'bank' | null>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => setPanel('shop')}
        aria-label="Cửa hàng vật dụng"
        className="ink-border flex h-11 shrink-0 items-center gap-1.5 rounded-xl bg-paper pl-1 pr-3 font-display text-lg text-navy shadow-pop short:h-9 short:text-base short:[&>svg]:h-7 short:[&>svg]:w-7"
      >
        <ShopIcon size={32} />
        Cửa hàng
      </button>
      <Shop
        open={panel === 'shop'}
        onClose={() => setPanel(null)}
        onOpenBank={() => setPanel('bank')}
      />
      <BandageBank open={panel === 'bank'} onClose={() => setPanel(null)} />
    </>
  );
}
