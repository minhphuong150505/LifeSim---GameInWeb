import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Mascot } from '../../art/Mascot';
import { Button } from '../../components/Button';

export const AD_SECONDS = 5;

type AdOverlayProps = {
  open: boolean;
  /** What the player gets for watching, e.g. "Nhân đôi phần thưởng". */
  reward: string;
  onFinish: () => void;
  onCancel: () => void;
};

/**
 * Simulated rewarded ad (the demo has no ad network): a short countdown with an
 * in-house promo, then the reward button unlocks.
 */
export function AdOverlay({ open, reward, onFinish, onCancel }: AdOverlayProps) {
  return (
    <AnimatePresence>
      {open && <AdBody reward={reward} onFinish={onFinish} onCancel={onCancel} />}
    </AnimatePresence>
  );
}

function AdBody({ reward, onFinish, onCancel }: Omit<AdOverlayProps, 'open'>) {
  const [left, setLeft] = useState(AD_SECONDS);
  useEffect(() => {
    if (left <= 0) return;
    const id = window.setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => window.clearTimeout(id);
  }, [left]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Quảng cáo mô phỏng"
      className="fixed inset-0 z-[1300] flex flex-col items-center justify-center gap-4 bg-navy/90 p-6 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="ink-border rounded-full bg-paper px-3 py-0.5 font-display text-sm text-navy">
        Quảng cáo mô phỏng · {left > 0 ? `${left}s` : 'xong'}
      </p>
      <div className="ink-border w-full max-w-[340px] rounded-[24px] bg-sky p-4 text-navy">
        <Mascot mood="happy" className="mx-auto h-36 w-28" />
        <p className="font-display text-2xl leading-tight">Học sơ cứu thật cùng LifeSim!</p>
        <p className="mt-1 text-sm">Tìm lớp sơ cứu gần bạn trong mục Practice Hub.</p>
        <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-navy bg-white">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: AD_SECONDS, ease: 'linear' }}
          />
        </div>
      </div>
      <Button
        size="lg"
        variant="yellow"
        disabled={left > 0}
        onClick={onFinish}
        className="w-full max-w-[340px]"
      >
        {left > 0 ? `Chờ ${left} giây…` : `Nhận thưởng: ${reward}`}
      </Button>
      <button type="button" onClick={onCancel} className="min-h-11 text-sm text-white/80 underline">
        Đóng, không nhận thưởng
      </button>
    </motion.div>
  );
}
