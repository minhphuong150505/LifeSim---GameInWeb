import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AmbulanceIcon } from '../../art/icons';
import { Button } from '../../components/Button';
import { playSound, vibrate } from '../../lib/sound';

export const EMERGENCY_NUMBER = '115';
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

type Stage = 'dial' | 'calling' | 'connected';

/** Phone keypad → simulated emergency call. Only 115 connects. */
export function PhoneDialer({ open, onDone }: { open: boolean; onDone: () => void }) {
  return <AnimatePresence>{open && <Dialer onDone={onDone} />}</AnimatePresence>;
}

function Dialer({ onDone }: { onDone: () => void }) {
  const [number, setNumber] = useState('');
  const [stage, setStage] = useState<Stage>('dial');
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (stage !== 'calling') return;
    const id = window.setTimeout(() => {
      setStage('connected');
      playSound('correct');
    }, 2200);
    return () => window.clearTimeout(id);
  }, [stage]);

  const press = (k: string) => {
    playSound('select');
    setHint(null);
    setNumber((n) => (n.length < 12 ? n + k : n));
  };

  const call = () => {
    if (number === EMERGENCY_NUMBER) {
      setStage('calling');
      return;
    }
    vibrate(100);
    setHint(
      number
        ? `${number} không phải số cấp cứu. Hãy gọi ${EMERGENCY_NUMBER}!`
        : `Nhập số ${EMERGENCY_NUMBER} rồi bấm gọi.`,
    );
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Điện thoại"
      className="fixed inset-0 z-[1250] flex items-center justify-center bg-navy/60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ y: 60, scale: 0.9 }}
        animate={{ y: 0, scale: 1 }}
        className="w-full max-w-[300px] rounded-[38px] border-[3px] border-navy bg-[#4b5563] p-3 shadow-pop"
      >
        <div className="flex min-h-[460px] flex-col rounded-[28px] border-[2.5px] border-navy bg-sky p-4">
          <span aria-hidden className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-navy/40" />
          {stage === 'dial' && (
            <>
              <p className="text-center text-sm font-semibold text-navy/70">Bàn phím</p>
              <output
                aria-live="polite"
                className="mt-1 block h-12 text-center font-display text-[40px] leading-[48px] tracking-widest text-navy"
              >
                {number || ' '}
              </output>
              <p
                role="status"
                className="min-h-10 text-center text-xs font-semibold text-primary-dark"
              >
                {hint}
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => press(k)}
                    className="ink-border mx-auto grid h-14 w-14 place-items-center rounded-full bg-paper font-display text-2xl text-navy shadow-soft active:bg-accent"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 items-center">
                <span />
                <button
                  type="button"
                  onClick={call}
                  aria-label="Gọi"
                  className="ink-border mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-3xl shadow-pop"
                >
                  <svg viewBox="0 0 24 24" width={30} height={30} aria-hidden>
                    <path
                      d="M5 3 L9 3 L11 8 L8.5 9.5 C9.5 11.8 12.2 14.5 14.5 15.5 L16 13 L21 15 L21 19 C21 20 20 21 19 21 C10 21 3 14 3 5 C3 4 4 3 5 3 Z"
                      fill="#fffdf6"
                      stroke="#3b2d26"
                      strokeWidth={1.8}
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setNumber((n) => n.slice(0, -1))}
                  aria-label="Xoá số"
                  className="mx-auto grid h-12 w-12 place-items-center font-display text-2xl text-navy"
                >
                  ⌫
                </button>
              </div>
            </>
          )}
          {stage === 'calling' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <AmbulanceIcon size={110} />
              </motion.div>
              <p className="font-display text-4xl text-navy">115</p>
              <p className="font-semibold text-navy">Đang kết nối cấp cứu…</p>
            </div>
          )}
          {stage === 'connected' && (
            <div className="flex flex-1 flex-col gap-3">
              <p className="text-center font-display text-xl text-success-dark">● Đã kết nối 115</p>
              <div className="ink-border rounded-2xl bg-paper p-3 text-[15px] leading-relaxed text-navy">
                <p className="font-display text-primary-dark">Tổng đài 115:</p>
                “Trung tâm cấp cứu 115 xin nghe! Bạn hãy bình tĩnh cho biết địa chỉ và tình trạng
                của người bệnh nhé.”
              </div>
              <p className="text-center text-xs text-muted">
                Cuộc gọi mô phỏng – trong thực tế hãy gọi 115 khi khẩn cấp.
              </p>
              <Button block size="lg" variant="green" className="mt-auto" onClick={onDone}>
                Trả lời tổng đài ▸
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
