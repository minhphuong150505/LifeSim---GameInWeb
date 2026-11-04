import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BandageIcon } from '../art/icons';
import { STATION_H, STATION_W, StationRoom, VariantArt } from '../art/StationRoom';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { formatVnd, packFor, type BandagePack } from '../data/packs';
import {
  ALL_VARIANTS,
  PRODUCTS,
  getProduct,
  getVariant,
  type SlotId,
  type Variant,
} from '../data/station';
import { BandageBank } from '../features/sim/BandageBank';
import { Checkout } from '../features/store/Checkout';
import { cn } from '../lib/cn';
import { playSound } from '../lib/sound';
import { useStationStore } from '../store/station';
import { useUserStore } from '../store/user';
import { useWalletStore } from '../store/wallet';

/**
 * Trạm cứu hộ – the player's personal Rescue Station. Bandages earned from rounds, streak
 * and missions buy decorations; every product has several variants to choose from.
 */
export function Station() {
  const nickname = useUserStore((s) => s.nickname);
  const bandages = useWalletStore((s) => s.bandages);
  const owned = useStationStore((s) => s.owned);
  const placedIds = useStationStore((s) => s.placed);
  const [slot, setSlot] = useState<SlotId>('cabinet');
  const [short, setShort] = useState<Variant | null>(null);
  const [bank, setBank] = useState<{ suggest?: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [buyingPack, setBuyingPack] = useState<BandagePack | null>(null);

  const placed: Partial<Record<SlotId, Variant>> = {};
  for (const [k, id] of Object.entries(placedIds)) placed[k as SlotId] = getVariant(id);
  const product = getProduct(slot);
  const decorated = PRODUCTS.filter((p) => p.slot !== 'theme' && placed[p.slot]).length;
  const ownedCount = owned.length;

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1600);
  };

  const buy = (v: Variant) => {
    if (bandages < v.price) {
      setShort(v);
      return;
    }
    if (useStationStore.getState().buy(v.id)) {
      playSound('win');
      flash(`Đã mua ${v.name} và đặt vào trạm!`);
    }
  };

  const missing = short ? short.price - bandages : 0;
  const suggested = packFor(missing);

  return (
    <div className="flex h-[calc(var(--app-h)-max(16px,env(safe-area-inset-bottom)))] flex-col">
      <PageHeader
        title={`Trạm cứu hộ của ${nickname}`}
        subtitle={`Đã trang trí ${decorated}/${PRODUCTS.length - 1} vị trí · ${ownedCount}/${ALL_VARIANTS.length} món sưu tầm`}
        right={
          <Button variant="green" onClick={() => setBank({})} className="shrink-0">
            + Băng gạc
          </Button>
        }
      />
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-3 px-3">
        <section
          aria-label="Trạm cứu hộ của bạn"
          className="ink-border relative min-h-0 overflow-hidden rounded-[22px] shadow-pop"
          style={{ backgroundColor: placed.theme?.main }}
        >
          <svg
            viewBox={`0 0 ${STATION_W} ${STATION_H}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="Phòng trạm cứu hộ. Chạm vào một vị trí để trang trí."
          >
            <StationRoom placed={placed} selected={slot} onSlot={setSlot} />
          </svg>
          <p className="ink-border absolute bottom-2 left-2 rounded-full bg-paper/90 px-2 text-[12px] font-semibold text-navy">
            Chạm vào ô “+” để chọn món trang trí
          </p>
          <AnimatePresence>
            {toast && (
              <motion.p
                role="status"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ink-border absolute inset-x-6 top-3 rounded-2xl bg-success-dark px-3 py-1.5 text-center font-display text-lg text-white"
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>
        </section>

        <section
          aria-label="Cửa hàng trang trí"
          className="ink-border flex min-h-0 flex-col overflow-hidden rounded-[22px] bg-paper shadow-pop"
        >
          <div className="wood grid shrink-0 grid-cols-4 gap-1.5 border-b-[2.5px] border-navy p-2">
            {PRODUCTS.map((p) => (
              <button
                key={p.slot}
                type="button"
                onClick={() => setSlot(p.slot)}
                aria-pressed={slot === p.slot}
                className={cn(
                  'ink-border flex flex-col items-center rounded-xl px-0.5 pb-0.5 pt-1',
                  slot === p.slot ? 'bg-accent shadow-pop' : 'bg-paper/90',
                )}
              >
                <VariantArt
                  variant={placed[p.slot] ?? (p.variants[0] as Variant)}
                  className={cn('h-7 w-9', !placed[p.slot] && 'opacity-60')}
                />
                <span className="font-display text-[12.5px] leading-tight whitespace-nowrap text-navy">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
            <h2 className="font-display text-[22px] leading-tight text-navy">{product.name}</h2>
            <p className="text-[13px] text-muted">
              {product.hint} Có {product.variants.length} mẫu để chọn.
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {product.variants.map((v) => {
                const has = owned.includes(v.id);
                const inUse = placedIds[v.slot] === v.id;
                return (
                  <li
                    key={v.id}
                    className={cn(
                      'ink-border flex items-center gap-2 rounded-2xl p-1.5',
                      inUse ? 'bg-[#eef7e6]' : 'bg-cream',
                    )}
                  >
                    <span className="ink-border grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper">
                      <VariantArt variant={v} className="h-full w-full" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[17px] leading-tight text-navy">
                        {v.name}
                      </span>
                      <span className="block text-[12px] text-muted">
                        {inUse ? 'Đang đặt trong trạm' : has ? 'Đã có trong kho' : 'Chưa sở hữu'}
                      </span>
                    </span>
                    {inUse ? (
                      v.slot === 'theme' ? (
                        <span className="px-2 font-display text-[15px] text-success-dark">
                          ✓ Đang dùng
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => useStationStore.getState().remove(v.slot)}
                        >
                          Cất đi
                        </Button>
                      )
                    ) : has ? (
                      <Button
                        variant="green"
                        onClick={() => {
                          useStationStore.getState().place(v.id);
                          playSound('select');
                        }}
                      >
                        Đặt vào
                      </Button>
                    ) : (
                      <Button
                        variant="yellow"
                        onClick={() => buy(v)}
                        aria-label={`Mua ${v.name} giá ${v.price} băng gạc`}
                      >
                        <BandageIcon size={24} /> {v.price}
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>

      <Modal
        open={short !== null}
        onClose={() => setShort(null)}
        title="Chưa đủ băng gạc"
        tone="wood"
      >
        {short && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="ink-border grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper">
                <VariantArt variant={short} className="h-full w-full" />
              </span>
              <p className="text-[15px] leading-snug text-ink">
                <b>{short.name}</b> cần {short.price} băng gạc. Bạn còn thiếu{' '}
                <b className="text-primary-dark">{missing} băng gạc</b>.
              </p>
            </div>
            <Button
              size="lg"
              block
              onClick={() => {
                setShort(null);
                setBuyingPack(suggested);
              }}
            >
              Mua {suggested.name} · {formatVnd(suggested.price)}
            </Button>
            <Button
              variant="secondary"
              block
              onClick={() => {
                setShort(null);
                setBank({});
              }}
            >
              Kiếm miễn phí (quảng cáo, nhiệm vụ…)
            </Button>
          </div>
        )}
      </Modal>
      <BandageBank open={bank !== null} onClose={() => setBank(null)} suggestPack={bank?.suggest} />
      <Checkout pack={buyingPack} onClose={() => setBuyingPack(null)} />
    </div>
  );
}
