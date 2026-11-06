import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BackIcon, BandageIcon, CollectionIcon, ShopIcon } from '../art/icons';
import { STATION_H, STATION_W, StationRoom, VariantArt } from '../art/StationRoom';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { formatVnd, packFor, type BandagePack } from '../data/packs';
import {
  ALL_VARIANTS,
  FOOTPRINT,
  PRODUCTS,
  getVariant,
  type SlotId,
  type Variant,
} from '../data/station';
import { BandageBank } from '../features/sim/BandageBank';
import { freeSpots, type Spot } from '../features/station/layout';
import { Checkout } from '../features/store/Checkout';
import { cn } from '../lib/cn';
import { playSound } from '../lib/sound';
import { useStationStore } from '../store/station';
import { useUserStore } from '../store/user';
import { useWalletStore } from '../store/wallet';

type Sheet = 'shop' | 'collection' | null;
/** Pop-up question about one item: after buying it, or when tapping it in the collection. */
type Ask = { id: string; from: 'bought' | 'collection' } | null;

const ZONE_HINT = { floor: 'đặt trên sàn', rug: 'trải trên sàn', wall: 'treo trên tường' } as const;

function sizeLabel(v: Variant): string {
  if (v.slot === 'theme') return 'Đổi màu cả phòng';
  const f = FOOTPRINT[v.slot];
  return `${f.w}×${f.h} ô · ${ZONE_HINT[f.zone]}`;
}

/**
 * Trạm cứu hộ – the player's own room. Items bought in the shop go to the collection
 * ("Bộ sưu tập"); from there the player places them on any free spot that fits.
 */
export function Station() {
  const nickname = useUserStore((s) => s.nickname);
  const bandages = useWalletStore((s) => s.bandages);
  const owned = useStationStore((s) => s.owned);
  const theme = useStationStore((s) => s.theme);
  const layout = useStationStore((s) => s.layout);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [tab, setTab] = useState<SlotId>('cabinet');
  const [ask, setAsk] = useState<Ask>(null);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Spot | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [short, setShort] = useState<Variant | null>(null);
  const [bank, setBank] = useState(false);
  const [buyingPack, setBuyingPack] = useState<BandagePack | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const spots = useMemo(() => (placingId ? freeSpots(layout, placingId) : []), [layout, placingId]);
  const placing = placingId ? getVariant(placingId) : undefined;
  const selected = selectedId ? getVariant(selectedId) : undefined;
  const placedCount = Object.keys(layout).length;

  const flash = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(null), 1800);
  };

  const buy = (v: Variant) => {
    if (bandages < v.price) {
      setShort(v);
      return;
    }
    if (useStationStore.getState().buy(v.id)) {
      playSound('win');
      setAsk({ id: v.id, from: 'bought' });
    }
  };

  /** Leaves the sheets and shows the free spots for the item in the room. */
  const startPlacing = (id: string) => {
    setAsk(null);
    setSheet(null);
    setSelectedId(null);
    setPreview(null);
    setPlacingId(id);
  };

  /** First tap previews the item on that spot, the button (or a second tap) places it. */
  const tapSpot = (spot: Spot) => {
    if (preview?.col === spot.col && preview.row === spot.row) placeAt(spot);
    else {
      setPreview(spot);
      playSound('click');
    }
  };

  const placeAt = (spot: Spot) => {
    if (!placingId || !placing) return;
    if (useStationStore.getState().place(placingId, spot)) {
      playSound('found');
      flash(`Đã đặt ${placing.name}!`);
      setPlacingId(null);
      setPreview(null);
    }
  };

  const cancelPlacing = () => {
    setPlacingId(null);
    setPreview(null);
  };

  const applyTheme = (id: string) => {
    useStationStore.getState().applyTheme(id);
    playSound('select');
    setAsk(null);
    flash(`Đã đổi theme: ${getVariant(id)?.name}`);
  };

  const askVariant = ask ? getVariant(ask.id) : undefined;
  const askPlaced = ask ? Boolean(layout[ask.id]) : false;
  const missing = short ? short.price - bandages : 0;
  const suggested = packFor(missing);

  return (
    <div className="flex h-[calc(var(--app-h)-max(16px,env(safe-area-inset-bottom)))] flex-col">
      <PageHeader
        title={`Trạm cứu hộ của ${nickname}`}
        subtitle={`Đã đặt ${placedCount} món · ${owned.length}/${ALL_VARIANTS.length} món trong bộ sưu tập`}
        right={
          <Button variant="green" onClick={() => setBank(true)} className="shrink-0">
            + Băng gạc
          </Button>
        }
      />

      <section
        aria-label="Phòng trạm cứu hộ"
        className="ink-border relative mx-3 min-h-0 flex-1 overflow-hidden rounded-[22px] shadow-pop"
        style={{ backgroundColor: getVariant(theme)?.main }}
      >
        <svg
          viewBox={`0 0 ${STATION_W} ${STATION_H}`}
          preserveAspectRatio="xMidYMid meet"
          overflow="visible"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Phòng trạm cứu hộ"
        >
          <StationRoom
            theme={theme}
            layout={layout}
            selectedId={selectedId}
            onItem={(id) => setSelectedId((cur) => (cur === id ? null : id))}
            placing={placingId ? { id: placingId, spots, preview, onSpot: tapSpot } : null}
          />
        </svg>

        {/* placement banner */}
        <AnimatePresence>
          {placing && (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="ink-border absolute inset-x-3 top-2 mx-auto flex max-w-xl items-center gap-2 rounded-2xl bg-[#fff1c2] p-1.5 pl-2 shadow-pop"
            >
              <span className="ink-border grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper">
                <VariantArt variant={placing} className="h-full w-full" />
              </span>
              <p role="status" className="min-w-0 flex-1 text-[14px] leading-snug text-navy">
                {spots.length > 0 ? (
                  preview ? (
                    <>
                      Đặt <b>{placing.name}</b> ở đây? Chạm ô xanh khác để đổi chỗ.
                    </>
                  ) : (
                    <>
                      Chạm vào một ô <b className="text-success-dark">xanh</b> để xem trước{' '}
                      <b>{placing.name}</b> ({sizeLabel(placing)}).
                    </>
                  )
                ) : (
                  <>
                    Phòng không còn chỗ vừa với <b>{placing.name}</b>. Hãy cất bớt đồ rồi thử lại
                    nhé!
                  </>
                )}
              </p>
              {preview && (
                <Button variant="green" onClick={() => placeAt(preview)}>
                  ✓ Đặt ở đây
                </Button>
              )}
              <Button variant="secondary" onClick={cancelPlacing}>
                Huỷ
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* actions for a tapped item */}
        <AnimatePresence>
          {selected && !placing && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="ink-border absolute bottom-2 left-2 flex items-center gap-2 rounded-2xl bg-paper p-1.5 pl-2 shadow-pop"
            >
              <span className="font-display text-[17px] text-navy">{selected.name}</span>
              <Button variant="yellow" onClick={() => startPlacing(selected.id)}>
                Di chuyển
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  useStationStore.getState().store(selected.id);
                  playSound('select');
                  flash(`Đã cất ${selected.name} vào bộ sưu tập`);
                  setSelectedId(null);
                }}
              >
                Cất đi
              </Button>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setSelectedId(null)}
                className="px-1 font-display text-xl text-navy"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!placing && !selected && (
          <p className="ink-border absolute bottom-2 left-2 rounded-full bg-paper/90 px-2 text-[12px] font-semibold text-navy">
            {placedCount > 0
              ? 'Chạm vào đồ vật để di chuyển hoặc cất đi'
              : 'Mua đồ ở Cửa hàng rồi đặt từ Bộ sưu tập nhé!'}
          </p>
        )}

        {!placing && (
          <div className="absolute bottom-2 right-2 flex gap-2">
            <RoomButton label="Cửa hàng" onClick={() => setSheet('shop')}>
              <ShopIcon size={40} />
            </RoomButton>
            <RoomButton label="Bộ sưu tập" onClick={() => setSheet('collection')}>
              <CollectionIcon size={40} />
            </RoomButton>
          </div>
        )}

        <AnimatePresence>
          {toast && (
            <motion.p
              role="status"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="ink-border absolute inset-x-6 top-16 mx-auto max-w-md rounded-2xl bg-success-dark px-3 py-1.5 text-center font-display text-lg text-white"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <CatalogSheet
        open={sheet === 'shop'}
        title="Cửa hàng trang trí"
        tab={tab}
        onTab={setTab}
        onClose={() => setSheet(null)}
      >
        {(product) => (
          <>
            {product.variants.map((v) => {
              const has = owned.includes(v.id);
              return (
                <ItemCard key={v.id} variant={v} badge={has ? 'Đã có' : undefined}>
                  {has ? (
                    <Button
                      block
                      variant="secondary"
                      onClick={() => setAsk({ id: v.id, from: 'collection' })}
                    >
                      {v.slot === 'theme' ? 'Dùng' : 'Đặt'}
                    </Button>
                  ) : (
                    <Button
                      block
                      variant="yellow"
                      onClick={() => buy(v)}
                      aria-label={`Mua ${v.name} giá ${v.price} băng gạc`}
                    >
                      <BandageIcon size={24} /> {v.price}
                    </Button>
                  )}
                </ItemCard>
              );
            })}
          </>
        )}
      </CatalogSheet>

      <CatalogSheet
        open={sheet === 'collection'}
        title="Bộ sưu tập của tôi"
        tab={tab}
        onTab={setTab}
        onClose={() => setSheet(null)}
        counts={(slot) =>
          PRODUCTS.find((p) => p.slot === slot)?.variants.filter((v) => owned.includes(v.id))
            .length ?? 0
        }
      >
        {(product) => {
          const mine = product.variants.filter((v) => owned.includes(v.id));
          if (mine.length === 0)
            return (
              <div className="col-span-full flex flex-col items-center gap-2 py-6 text-center">
                <p className="text-[15px] text-muted">
                  Bạn chưa có {product.name.toLowerCase()} nào. {product.hint}
                </p>
                <Button variant="yellow" onClick={() => setSheet('shop')}>
                  <ShopIcon size={26} /> Mở cửa hàng
                </Button>
              </div>
            );
          return mine.map((v) => {
            const inRoom = v.slot === 'theme' ? theme === v.id : Boolean(layout[v.id]);
            return (
              <ItemCard
                key={v.id}
                variant={v}
                badge={inRoom ? (v.slot === 'theme' ? 'Đang dùng' : 'Đã đặt') : undefined}
                onClick={() => setAsk({ id: v.id, from: 'collection' })}
              />
            );
          });
        }}
      </CatalogSheet>

      {/* "Bạn có muốn đặt nó không?" */}
      <Modal
        open={askVariant !== undefined}
        onClose={() => setAsk(null)}
        title={askVariant?.name ?? ''}
        tone="wood"
      >
        {askVariant && (
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="ink-border grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-paper">
              <VariantArt variant={askVariant} className="h-full w-full" />
            </span>
            {ask?.from === 'bought' && (
              <p className="font-display text-lg text-success-dark">Đã thêm vào Bộ sưu tập!</p>
            )}
            {askVariant.slot === 'theme' ? (
              theme === askVariant.id ? (
                <>
                  <p className="text-[16px] text-navy">Theme này đang được dùng.</p>
                  <Button block onClick={() => setAsk(null)}>
                    Đóng
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-display text-xl text-navy">
                    Bạn có muốn dùng theme này không?
                  </p>
                  <ChoiceRow onNo={() => setAsk(null)} onYes={() => applyTheme(askVariant.id)} />
                </>
              )
            ) : askPlaced ? (
              <>
                <p className="font-display text-xl text-navy">Món này đang ở trong phòng.</p>
                <div className="grid w-full grid-cols-3 gap-2">
                  <Button variant="gray" onClick={() => setAsk(null)}>
                    Không
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      useStationStore.getState().store(askVariant.id);
                      setAsk(null);
                      playSound('select');
                    }}
                  >
                    Cất đi
                  </Button>
                  <Button onClick={() => startPlacing(askVariant.id)}>Di chuyển</Button>
                </div>
              </>
            ) : (
              <>
                <p className="font-display text-xl text-navy">Bạn có muốn đặt nó không?</p>
                <p className="-mt-2 text-[13px] text-muted">Kích thước: {sizeLabel(askVariant)}</p>
                <ChoiceRow onNo={() => setAsk(null)} onYes={() => startPlacing(askVariant.id)} />
              </>
            )}
          </div>
        )}
      </Modal>

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
                setBank(true);
              }}
            >
              Kiếm miễn phí (quảng cáo, nhiệm vụ…)
            </Button>
          </div>
        )}
      </Modal>
      <BandageBank open={bank} onClose={() => setBank(false)} />
      <Checkout pack={buyingPack} onClose={() => setBuyingPack(null)} />
    </div>
  );
}

function ChoiceRow({ onNo, onYes }: { onNo: () => void; onYes: () => void }) {
  return (
    <div className="grid w-full grid-cols-2 gap-3">
      <Button size="lg" variant="gray" onClick={onNo}>
        Không
      </Button>
      <Button size="lg" onClick={onYes}>
        Có
      </Button>
    </div>
  );
}

function RoomButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ink-border flex w-[74px] flex-col items-center rounded-2xl bg-paper px-1 pb-1 pt-1.5 shadow-pop active:translate-y-0.5"
    >
      {children}
      <span className="font-display text-[13px] leading-tight text-navy">{label}</span>
    </button>
  );
}

function ItemCard({
  variant,
  badge,
  onClick,
  children,
}: {
  variant: Variant;
  badge?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const body = (
    <>
      <p className="wood ink-border w-full truncate rounded-lg px-1 text-center font-display text-[16px] leading-6 text-navy">
        {variant.name}
      </p>
      <span className="relative mt-1.5 grid aspect-[4/3] w-full place-items-center rounded-xl bg-cream">
        <VariantArt variant={variant} className="h-full w-full" />
        {badge && (
          <span className="ink-border absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-accent px-2 font-display text-[14px] text-navy">
            {badge}
          </span>
        )}
      </span>
      <p className="mt-1 text-center text-[11px] leading-tight text-muted">{sizeLabel(variant)}</p>
    </>
  );
  return (
    <li className="ink-border flex flex-col rounded-2xl bg-paper p-2 shadow-pop">
      {onClick ? (
        <button type="button" onClick={onClick} className="flex flex-col text-left">
          {body}
        </button>
      ) : (
        body
      )}
      {children && <div className="mt-1.5">{children}</div>}
    </li>
  );
}

/** Full-screen catalogue with categories on the left (used for the shop and the collection). */
function CatalogSheet({
  open,
  title,
  tab,
  onTab,
  onClose,
  counts,
  children,
}: {
  open: boolean;
  title: string;
  tab: SlotId;
  onTab: (slot: SlotId) => void;
  onClose: () => void;
  counts?: (slot: SlotId) => number;
  children: (product: (typeof PRODUCTS)[number]) => React.ReactNode;
}) {
  const product =
    PRODUCTS.find((p) => p.slot === tab) ?? (PRODUCTS[0] as (typeof PRODUCTS)[number]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="paper ink-border fixed inset-0 z-[1100] flex flex-col"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        >
          <header className="wood safe-top flex items-center gap-2 border-b-[2.5px] border-navy px-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="ink-border grid h-11 w-11 place-items-center rounded-xl bg-paper shadow-pop"
            >
              <BackIcon size={26} />
            </button>
            <h2 className="flex-1 text-center font-display text-[26px] text-navy">{title}</h2>
            <span className="w-11" />
          </header>
          <div className="flex min-h-0 flex-1">
            <nav
              aria-label="Loại đồ"
              className="flex w-[150px] shrink-0 flex-col gap-1 overflow-y-auto border-r-[2.5px] border-navy/20 p-2"
            >
              {PRODUCTS.map((p) => {
                const n = counts?.(p.slot);
                return (
                  <button
                    key={p.slot}
                    type="button"
                    onClick={() => onTab(p.slot)}
                    aria-pressed={tab === p.slot}
                    className={cn(
                      'ink-border flex items-center justify-between gap-1 rounded-xl px-2 py-1.5 text-left font-display text-[16px] leading-tight text-navy',
                      tab === p.slot ? 'bg-accent shadow-pop' : 'border-transparent bg-transparent',
                    )}
                  >
                    {p.name}
                    {n !== undefined && (
                      <span className="text-[12px] text-navy/60">
                        {n}/{p.variants.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <p className="mb-2 text-[13px] text-muted">{product.hint}</p>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
                {children(product)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
