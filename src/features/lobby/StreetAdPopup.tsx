import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BandageIcon, CheckIcon, StationIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { getVariant } from '../../data/station';
import { playSound } from '../../lib/sound';
import { useStationStore } from '../../store/station';
import { useStreetAdStore } from '../../store/streetAds';
import { useWalletStore } from '../../store/wallet';
import { AdOverlay } from '../sim/AdOverlay';
import { rollStreetReward, STREET_ADS_PER_DAY, type StreetReward } from './streetAd';

/** Red stage curtain drawn above the question. */
function Curtain() {
  const folds = Array.from({ length: 9 }, (_, i) => i);
  return (
    <svg viewBox="0 0 360 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <rect width={360} height={120} fill="#b8322a" />
      {folds.map((i) => (
        <path
          key={i}
          d={`M${i * 40} 14 C${i * 40 + 6} 60 ${i * 40 + 4} 100 ${i * 40 + 2} 120 H${i * 40 + 40} C${i * 40 + 38} 100 ${i * 40 + 36} 60 ${i * 40 + 40} 14 Z`}
          fill={i % 2 ? '#d8402f' : '#e5533f'}
        />
      ))}
      {folds.map((i) => (
        <path
          key={`l${i}`}
          d={`M${i * 40 + 20} 16 C${i * 40 + 23} 60 ${i * 40 + 22} 100 ${i * 40 + 20} 120`}
          stroke="#f6876f"
          strokeWidth={3}
          fill="none"
          opacity={0.7}
        />
      ))}
      {/* valance */}
      <path
        d="M0 0 H360 V18 Q345 32 330 18 Q315 32 300 18 Q285 32 270 18 Q255 32 240 18 Q225 32 210 18 Q195 32 180 18 Q165 32 150 18 Q135 32 120 18 Q105 32 90 18 Q75 32 60 18 Q45 32 30 18 Q15 32 0 18 Z"
        fill="#c4382d"
        stroke="#3b2d26"
        strokeWidth={2.5}
      />
    </svg>
  );
}

function rewardText(r: StreetReward): string {
  if (r.kind === 'bandages') return `+${r.amount} băng gạc`;
  return `${getVariant(r.id)?.name ?? 'Vật phẩm'} cho Trạm cứu hộ`;
}

/**
 * "Cùng dạo phố nào" – lobby bag: watch a short (simulated) ad for a random reward,
 * bandages or a Rescue Station item, at most STREET_ADS_PER_DAY times a day.
 */
export function StreetAdPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Subscribing keeps "ads left" fresh after watching.
  useStreetAdStore((s) => s.count);
  useStreetAdStore((s) => s.day);
  const left = useStreetAdStore.getState().left();
  const [watching, setWatching] = useState(false);
  const [reward, setReward] = useState<StreetReward | null>(null);

  const close = () => {
    setReward(null);
    onClose();
  };

  const finishAd = () => {
    setWatching(false);
    if (!useStreetAdStore.getState().record()) return;
    const r = rollStreetReward(useStationStore.getState().owned);
    if (r.kind === 'bandages') useWalletStore.getState().earn(r.amount);
    else useStationStore.getState().grant(r.id);
    playSound('win');
    setReward(r);
  };

  return (
    <>
      <AnimatePresence>
        {open && !watching && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3">
            <motion.div
              aria-hidden
              className="absolute inset-0 bg-navy/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Cùng dạo phố nào"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-[460px] pt-5"
            >
              {/* wooden title plank */}
              <h2 className="wood ink-border absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl px-6 py-0.5 font-display text-[24px] text-navy shadow-pop">
                Cùng dạo phố nào
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Đóng"
                className="ink-border absolute -right-2 top-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-primary font-display text-2xl leading-none text-white shadow-pop"
              >
                ×
              </button>
              <div className="ink-border rounded-[26px] bg-[#ffb627] p-3 pt-6 shadow-pop">
                <div className="ink-border h-[clamp(70px,calc(var(--app-h)*0.2),120px)] overflow-hidden rounded-xl">
                  <Curtain />
                </div>

                {reward ? (
                  <div className="mt-2 flex flex-col items-center text-center">
                    <p className="font-display text-[22px] text-white drop-shadow-[0_2px_0_#3b2d26]">
                      Bạn nhận được
                    </p>
                    <motion.div
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 10 }}
                      className="ink-border mt-1 flex items-center gap-2 rounded-2xl bg-paper px-4 py-2 font-display text-[22px] text-navy"
                    >
                      {reward.kind === 'bandages' ? (
                        <BandageIcon size={40} />
                      ) : (
                        <StationIcon size={40} />
                      )}
                      {rewardText(reward)}
                    </motion.div>
                    {reward.kind === 'item' && (
                      <p className="mt-1 text-sm font-semibold text-navy">
                        Vật phẩm đã vào Bộ sưu tập của Trạm cứu hộ.
                      </p>
                    )}
                    <Button variant="green" className="mt-2" onClick={close}>
                      Tuyệt vời!
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 text-center font-display text-[22px] text-white drop-shadow-[0_2px_0_#3b2d26]">
                      Xem đoạn phim giới thiệu?
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="ink-border flex-1 rounded-2xl border-dashed bg-[#f6aab0] px-3 py-1.5">
                        <p className="border-b-2 border-navy/40 pb-0.5 text-center text-[13px] font-semibold text-navy">
                          Phần thưởng sẽ được chọn ngẫu nhiên
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-1 font-display text-lg text-navy">
                          <BandageIcon size={38} />
                          <span>hoặc</span>
                          <StationIcon size={36} />
                          <span>hoặc</span>
                          <span className="font-display text-[34px] leading-none text-white drop-shadow-[0_2px_0_#3b2d26]">
                            ?
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={left <= 0}
                        onClick={() => setWatching(true)}
                        aria-label="Xem quảng cáo nhận thưởng"
                        className="ink-border grid h-[68px] w-[68px] shrink-0 place-items-center rounded-full bg-success shadow-pop active:translate-y-0.5 disabled:opacity-50 [&>svg]:h-11 [&>svg]:w-11"
                      >
                        <CheckIcon size={44} />
                      </button>
                    </div>
                    <p className="mt-1.5 text-center text-sm font-semibold text-navy">
                      {left > 0
                        ? `Còn ${left}/${STREET_ADS_PER_DAY} lượt hôm nay`
                        : 'Hết lượt hôm nay – quay lại vào ngày mai nhé!'}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AdOverlay
        open={watching}
        reward="phần thưởng ngẫu nhiên"
        onFinish={finishAd}
        onCancel={() => setWatching(false)}
      />
    </>
  );
}
