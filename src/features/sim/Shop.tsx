import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BackIcon, BagIcon, BandageIcon, LockIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';
import { playSound } from '../../lib/sound';
import { useWalletStore } from '../../store/wallet';
import { AdOverlay } from './AdOverlay';
import { ItemIcon } from './itemArt';
import { SHOP_ITEMS, UPCOMING_ITEMS, getItem, type ItemId } from './items';

/** Bandages granted by watching an ad from the shop when the player is short. */
export const SHOP_AD_BONUS = 30;

type ShopProps = {
  open: boolean;
  onClose: () => void;
  /** Item the current task needs; gets an arrow and a glow. */
  highlight?: ItemId | null;
  onBought?: (id: ItemId) => void;
};

/** Cửa hàng vật dụng – full-screen sheet with a wooden header, like the reference art. */
export function Shop({ open, onClose, highlight, onBought }: ShopProps) {
  const bandages = useWalletStore((s) => s.bandages);
  const items = useWalletStore((s) => s.items);
  const buy = useWalletStore((s) => s.buy);
  const earn = useWalletStore((s) => s.earn);
  const [adOpen, setAdOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const purchase = (id: ItemId) => {
    if (!buy(id)) return;
    playSound('found');
    setToast(`Đã cho ${getItem(id).name} vào túi vật dụng!`);
    window.setTimeout(() => setToast(null), 1800);
    onBought?.(id);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Cửa hàng vật dụng"
          className="paper fixed inset-0 z-[1150] mx-auto flex max-w-[480px] flex-col"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <header className="wood safe-top flex items-center gap-2 border-b-[2.5px] border-navy px-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng cửa hàng"
              className="ink-border grid h-11 w-11 place-items-center rounded-xl bg-paper shadow-pop"
            >
              <BackIcon size={26} />
            </button>
            <h2 className="flex-1 text-center font-display text-[28px] text-navy">Cửa hàng</h2>
            <span className="ink-border flex items-center gap-1 rounded-xl bg-paper py-0.5 pl-1 pr-2 font-display text-xl text-navy">
              <BandageIcon size={28} />
              {bandages}
            </span>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-center text-sm text-muted">
              Dùng băng gạc tích luỹ để mua vật dụng, rồi dùng ngay trong round bằng cách chạm hoặc
              kéo/thả.
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {SHOP_ITEMS.map((item) => {
                const owned = items[item.id] ?? 0;
                const soldOut = !item.consumable && owned > 0;
                const short = bandages < item.price;
                const hot = highlight === item.id;
                return (
                  <li key={item.id} className="relative">
                    {hot && (
                      <motion.span
                        aria-hidden
                        className="absolute -top-7 left-1/2 z-10 -translate-x-1/2 text-3xl"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                      >
                        👇
                      </motion.span>
                    )}
                    <div
                      className={cn(
                        'ink-border flex h-full flex-col items-center rounded-2xl bg-paper p-3 text-center shadow-pop',
                        hot && 'ring-4 ring-accent',
                      )}
                    >
                      <ItemIcon id={item.id} size={64} />
                      <p className="wood ink-border mt-2 w-full rounded-lg px-1 font-display text-[17px] leading-tight text-navy">
                        {item.name}
                      </p>
                      <p className="mt-1.5 flex-1 text-xs leading-snug text-muted">
                        {item.description}
                      </p>
                      {owned > 0 && (
                        <p className="mt-1 text-xs font-bold text-success-dark">
                          Trong túi: {owned}
                        </p>
                      )}
                      <Button
                        block
                        variant={soldOut ? 'gray' : 'yellow'}
                        className="mt-2"
                        disabled={soldOut || short}
                        onClick={() => purchase(item.id)}
                        aria-label={`Mua ${item.name} giá ${item.price} băng gạc`}
                      >
                        {soldOut ? (
                          'Đã có'
                        ) : (
                          <>
                            <BandageIcon size={24} /> {item.price}
                          </>
                        )}
                      </Button>
                    </div>
                  </li>
                );
              })}
              {UPCOMING_ITEMS.map((name) => (
                <li
                  key={name}
                  className="ink-border flex flex-col items-center rounded-2xl bg-[#efe9dc] p-3 text-center opacity-80"
                >
                  <LockIcon size={44} />
                  <p className="mt-2 font-display text-base leading-tight text-navy">{name}</p>
                  <p className="text-xs text-muted">Sắp ra mắt</p>
                </li>
              ))}
            </ul>

            <div className="ink-border mt-4 flex items-center gap-3 rounded-2xl bg-[#fff1c2] p-3">
              <BagIcon size={36} />
              <p className="flex-1 text-sm text-navy">
                Thiếu băng gạc? Xem quảng cáo để nhận thêm {SHOP_AD_BONUS}.
              </p>
              <Button
                variant="yellow"
                onClick={() => setAdOpen(true)}
                aria-label={`Xem quảng cáo nhận ${SHOP_AD_BONUS} băng gạc`}
              >
                ▶ +{SHOP_AD_BONUS}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.p
                role="status"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ink-border safe-bottom absolute inset-x-4 bottom-4 rounded-2xl bg-success-dark px-4 py-2 text-center font-display text-lg text-white"
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>

          <AdOverlay
            open={adOpen}
            reward={`+${SHOP_AD_BONUS} băng gạc`}
            onCancel={() => setAdOpen(false)}
            onFinish={() => {
              earn(SHOP_AD_BONUS);
              playSound('win');
              setAdOpen(false);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
