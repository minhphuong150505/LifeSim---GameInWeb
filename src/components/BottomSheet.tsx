import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1100] flex items-end justify-center">
          <motion.button
            type="button"
            aria-label="Đóng"
            className="absolute inset-0 cursor-default bg-navy/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="safe-bottom relative w-full max-w-[480px] rounded-t-[28px] bg-white px-5 pt-3 shadow-soft"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          >
            <span aria-hidden className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-navy/15" />
            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="text-xl font-bold text-navy">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Đóng"
                className="-mr-2 -mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-2xl text-muted"
              >
                ×
              </button>
            </div>
            <div className="max-h-[70dvh] overflow-y-auto pb-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
