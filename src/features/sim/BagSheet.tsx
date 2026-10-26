import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { ShopIcon } from '../../art/icons';
import { useWalletStore } from '../../store/wallet';
import { ItemIcon } from './itemArt';
import { SHOP_ITEMS, type ItemId } from './items';

type BagSheetProps = {
  open: boolean;
  onClose: () => void;
  /** Items that can be used right now (others are shown but disabled). */
  usable: ItemId[];
  onUse: (id: ItemId) => void;
  onOpenShop: () => void;
};

/** Túi vật dụng – the player's inventory. */
export function BagSheet({ open, onClose, usable, onUse, onOpenShop }: BagSheetProps) {
  const items = useWalletStore((s) => s.items);
  const owned = SHOP_ITEMS.filter((i) => (items[i.id] ?? 0) > 0);

  return (
    <BottomSheet open={open} onClose={onClose} title="Túi vật dụng">
      {owned.length === 0 ? (
        <p className="py-2 text-center text-muted">
          Túi đang trống. Ghé cửa hàng để mua vật dụng nhé!
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {owned.map((item) => {
            const canUse = usable.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  disabled={!canUse}
                  onClick={() => onUse(item.id)}
                  className="ink-border flex w-full flex-col items-center rounded-2xl bg-paper p-3 shadow-pop disabled:opacity-50 disabled:shadow-none"
                >
                  <ItemIcon id={item.id} size={56} />
                  <span className="mt-1 font-display text-base leading-tight text-navy">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted">
                    {item.consumable ? `x${items[item.id]}` : 'Đồ cá nhân'} ·{' '}
                    {canUse ? 'Chạm để dùng' : 'Chưa cần dùng'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <Button block variant="secondary" className="mt-4" onClick={onOpenShop}>
        <ShopIcon size={28} /> Mở cửa hàng
      </Button>
    </BottomSheet>
  );
}
