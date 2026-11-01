import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '../lib/cn';

type ModalProps = {
  open: boolean;
  title: string;
  /** Without `onClose` the modal can only be left through its own buttons. */
  onClose?: () => void;
  tone?: 'red' | 'wood' | 'green' | 'navy';
  /** Sparkles around the header (win screens). */
  sparkle?: boolean;
  children: React.ReactNode;
  className?: string;
  /** `lg` for wide landscape dialogs (lists, details). */
  size?: 'md' | 'lg';
};

const TONES = {
  red: 'bg-primary text-white',
  wood: 'wood text-navy',
  green: 'bg-success text-white',
  navy: 'bg-navy text-white',
};

function Sparkle({ className }: { className: string }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className={cn('absolute h-6 w-6', className)}
      animate={{ scale: [0.7, 1.15, 0.7], rotate: [0, 15, 0] }}
      transition={{ repeat: Infinity, duration: 1.6 }}
      aria-hidden
    >
      <path
        d="M12 1 C13 8 16 11 23 12 C16 13 13 16 12 23 C11 16 8 13 1 12 C8 11 11 8 12 1 Z"
        fill="#fffdf6"
        stroke="#3b2d26"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

/** Centered dialog drawn like the game's paper panels: thick outline, coloured header band. */
export function Modal({
  open,
  title,
  onClose,
  tone = 'red',
  sparkle,
  children,
  className,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-3">
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-navy/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              'ink-border relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-[24px] bg-paper shadow-pop',
              size === 'lg' ? 'max-w-[700px]' : 'max-w-[460px]',
              className,
            )}
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          >
            <div
              className={cn(
                'relative shrink-0 border-b-[2.5px] border-navy px-12 py-2.5 text-center short:py-1',
                TONES[tone],
              )}
            >
              {sparkle && (
                <>
                  <Sparkle className="left-4 top-2" />
                  <Sparkle className="right-6 top-3" />
                  <Sparkle className="bottom-1 left-16 h-4 w-4" />
                  <Sparkle className="bottom-2 right-14 h-4 w-4" />
                </>
              )}
              <h2 className="font-display text-[26px] leading-tight short:text-xl">{title}</h2>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Đóng"
                  className="ink-border absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 short:h-7 short:w-7 place-items-center rounded-xl bg-paper text-xl leading-none text-navy"
                >
                  ×
                </button>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4 short:p-2.5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
