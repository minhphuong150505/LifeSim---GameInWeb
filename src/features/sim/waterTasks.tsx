import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { BankItemId } from '../../art/WaterScenes';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';
import { playSound, vibrate } from '../../lib/sound';
import { BankItemThumb } from './optionArtWater';
import {
  BREATH_CARDS,
  BREATH_ORDER,
  CPR_TARGET,
  FIND_TIPS,
  RIGHT_FINDS,
  compressionCounts,
  rhythmOf,
  type Rhythm,
  type Card,
} from './waterTaskLogic';

/* ───────────────────────── 2.2 · find 2 floating objects ───────────────────────── */

/** Side panel of the find task; the objects themselves are tapped in the scene. */
export function FindFloatsPanel({
  found,
  lastWrong,
  onDone,
}: {
  found: BankItemId[];
  lastWrong: BankItemId | null;
  onDone: () => void;
}) {
  const done = RIGHT_FINDS.every((id) => found.includes(id));
  const last = found[found.length - 1];
  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <div className="ink-border rounded-2xl bg-[#fff1c2] px-3 py-2 short:px-2 short:py-1">
        <p className="font-display text-[17px] leading-snug text-navy short:text-[13px] short:leading-tight">
          Xung quanh không có thiết bị cứu hộ (phao, áo phao…). Hãy tìm 2 vật có thể hỗ trợ bạn ấy!
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-display text-[22px] text-navy short:text-[16px]">
          Đã tìm: {found.length}/2
        </span>
        {RIGHT_FINDS.map((id, i) => (
          <span
            key={id}
            className={cn(
              'ink-border grid h-12 w-12 place-items-center overflow-hidden rounded-xl short:h-8 short:w-8',
              found[i] ? 'bg-paper' : 'border-dashed bg-cream',
            )}
          >
            {found[i] ? (
              <BankItemThumb id={found[i]} />
            ) : (
              <span className="font-display text-navy/40">?</span>
            )}
          </span>
        ))}
      </div>
      <motion.p
        key={lastWrong ?? last ?? 'idle'}
        role="status"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-[15px] font-semibold leading-snug short:text-[12px]',
          lastWrong ? 'text-primary-dark' : last ? 'text-success-dark' : 'text-muted',
        )}
      >
        {lastWrong
          ? `⚡ ${FIND_TIPS[lastWrong]}`
          : last
            ? `✓ ${FIND_TIPS[last]}`
            : '👈 Chạm vào đồ vật trên bờ suối. Chọn sai sẽ bị tia sét đánh!'}
      </motion.p>
      {done && (
        <Button size="lg" block variant="green" onClick={onDone}>
          Đưa cho bạn ấy ▸
        </Button>
      )}
    </div>
  );
}

/* ───────────────────────── 2.3 · 30 compressions ───────────────────────── */

const FEEDBACK: Record<Rhythm, string> = {
  idle: 'Chạm vào ngực nạn nhân theo nhịp để ép tim.',
  slow: 'Nhanh hơn một chút!',
  good: 'Giữ nhịp này!',
  fast: 'Chậm lại một chút!',
};

export function CprTask({
  onPress,
  onDone,
}: {
  onPress: (count: number) => void;
  onDone: () => void;
}) {
  const [count, setCount] = useState(0);
  const [bpm, setBpm] = useState<number | null>(null);
  const [push, setPush] = useState(0);
  const last = useRef<number | null>(null);
  const recent = useRef<number[]>([]);
  const done = count >= CPR_TARGET;

  const press = () => {
    if (done) return;
    const now = performance.now();
    const interval = last.current === null ? null : now - last.current;
    last.current = now;
    setPush((p) => p + 1);
    // A long pause restarts the rhythm instead of reading as "way too slow".
    if (interval !== null && interval > 2000) {
      recent.current = [];
      setBpm(null);
      return;
    }
    if (interval !== null) {
      recent.current = [...recent.current, interval].slice(-3);
      const avg = recent.current.reduce((a, b) => a + b, 0) / recent.current.length;
      setBpm(Math.round(60000 / avg));
    }
    if (compressionCounts(interval)) {
      const next = count + 1;
      setCount(next);
      onPress(next);
      playSound('tick');
      if (next >= CPR_TARGET) playSound('correct');
    } else {
      vibrate(40);
    }
  };

  const rhythm = rhythmOf(bpm);
  // Marker on the bar: 70 bpm (left edge) … 150 bpm (right edge).
  const markerPct = bpm === null ? 50 : Math.min(100, Math.max(0, ((bpm - 70) / 80) * 100));

  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <p className="font-display text-[19px] leading-snug text-navy short:text-[14px]">
        Giữ đúng nhịp và hoàn thành {CPR_TARGET} lần ép tim!
      </p>
      <div className="flex items-stretch gap-3 short:gap-2">
        <motion.button
          type="button"
          onPointerDown={press}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && press()}
          disabled={done}
          aria-label={`Ép tim – đã ép ${count}/${CPR_TARGET} lần`}
          className="ink-border relative aspect-square w-[40%] max-w-[200px] shrink-0 touch-manipulation select-none overflow-hidden rounded-[22px] bg-[#cfe7b4] short:rounded-xl"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            <motion.path
              key={`c${push}`}
              d="M14 30 Q50 18 86 30 L90 100 H10 Z"
              fill="#f29e4c"
              stroke="#3b2d26"
              strokeWidth={2.5}
              initial={{ scaleY: 0.92 }}
              animate={{ scaleY: 1 }}
              style={{ originY: 1 }}
              transition={{ duration: 0.25 }}
            />
            <path d="M50 32 V70" stroke="#3b2d26" strokeWidth={1.4} opacity={0.3} />
            <motion.g
              key={`h${push}`}
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.22 }}
            >
              <path
                d="M38 -4 L44 44 M62 -4 L56 44"
                stroke="#3b2d26"
                strokeWidth={11}
                strokeLinecap="round"
              />
              <path
                d="M38 -4 L44 44 M62 -4 L56 44"
                stroke="#ffe1c6"
                strokeWidth={7.5}
                strokeLinecap="round"
              />
              <ellipse
                cx={50}
                cy={52}
                rx={13}
                ry={10}
                fill="#ffe1c6"
                stroke="#3b2d26"
                strokeWidth={2.2}
              />
              <ellipse
                cx={50}
                cy={47}
                rx={12}
                ry={8.5}
                fill="#ffe1c6"
                stroke="#3b2d26"
                strokeWidth={2.2}
              />
            </motion.g>
          </svg>
          {!done && (
            <span className="absolute inset-x-0 bottom-1 text-center font-display text-[13px] text-navy">
              👆 Chạm theo nhịp
            </span>
          )}
        </motion.button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 short:gap-1">
          <p
            className={cn(
              'font-display text-[34px] leading-none short:text-[24px]',
              done ? 'text-success-dark' : 'text-navy',
            )}
            aria-live="polite"
          >
            {count} / {CPR_TARGET}
            {done && <span className="ml-2 text-[20px] short:text-[15px]">– HOÀN THÀNH</span>}
          </p>
          <div className="relative">
            <div className="ink-border grid h-8 grid-cols-[37.5%_25%_37.5%] overflow-hidden rounded-full text-center font-display text-[11px] leading-7 text-navy short:h-6 short:text-[9px] short:leading-5">
              <span className="bg-[#fde3da]">Quá chậm</span>
              <span className="bg-[#cdeab9]">ĐÚNG NHỊP</span>
              <span className="bg-[#fde3da]">Quá nhanh</span>
            </div>
            <motion.span
              aria-hidden
              className="absolute -top-1.5 h-11 w-1.5 -translate-x-1/2 rounded-full bg-navy short:h-9"
              animate={{ left: `${markerPct}%` }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            />
          </div>
          <p className="text-[13px] leading-snug text-ink short:text-[11px]">
            Nhịp mục tiêu: <b>100–120 lần/phút</b>
            {bpm !== null && ` · Bạn: ${bpm}/phút`}
            <br />
            Độ sâu mục tiêu: khoảng <b>5–6 cm</b>
          </p>
          <motion.p
            key={done ? 'done' : rhythm}
            role="status"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              'font-display text-[19px] leading-tight short:text-[14px]',
              done || rhythm === 'good'
                ? 'text-success-dark'
                : rhythm === 'idle'
                  ? 'text-muted'
                  : 'text-primary-dark',
            )}
          >
            {done ? 'Tuyệt vời!' : FEEDBACK[rhythm]}
          </motion.p>
        </div>
      </div>
      {done && (
        <>
          <p className="text-[14px] leading-snug text-ink short:text-[11.5px]">
            Ép tim được thực hiện 30 lần với tần số khoảng 100–120 lần/phút trước khi chuyển sang hỗ
            trợ hô hấp.
          </p>
          <Button size="lg" block variant="green" onClick={onDone}>
            Tiếp tục ▸
          </Button>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── 2.3 · rescue breath order ───────────────────────── */

export function BreathOrderTask({ onDone }: { onDone: () => void }) {
  const [picked, setPicked] = useState<Card['id'][]>([]);
  const [miss, setMiss] = useState<Card['id'] | null>(null);
  const [shake, setShake] = useState(0);
  const done = picked.length === BREATH_ORDER.length;

  useEffect(() => {
    if (done) playSound('correct');
  }, [done]);

  const tap = (id: Card['id']) => {
    if (done || picked.includes(id)) return;
    if (BREATH_ORDER[picked.length] === id) {
      setPicked((p) => [...p, id]);
      setMiss(null);
      playSound('select');
    } else {
      setMiss(id);
      setShake((n) => n + 1);
      playSound('wrong');
      vibrate(80);
    }
  };

  const missCard = BREATH_CARDS.find((c) => c.id === miss);
  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <p className="font-display text-[19px] leading-snug text-navy short:text-[14px]">
        Sắp xếp các thao tác theo đúng thứ tự – lần lượt chạm vào từng thẻ.
      </p>
      <ul className="grid grid-cols-2 gap-2 short:gap-1">
        {BREATH_CARDS.map((c) => {
          const step = picked.indexOf(c.id);
          const wrong = miss === c.id;
          return (
            <li key={c.id}>
              <motion.button
                type="button"
                key={wrong ? `w${shake}` : c.id}
                onClick={() => tap(c.id)}
                disabled={step >= 0}
                animate={wrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                aria-label={`Thẻ ${c.id}: ${c.text}${step >= 0 ? ` (bước ${step + 1})` : ''}`}
                className={cn(
                  'ink-border relative flex h-full w-full items-start gap-1.5 rounded-2xl p-2 text-left shadow-pop short:rounded-xl short:p-1',
                  step >= 0 ? 'bg-[#eef7e6] shadow-none' : wrong ? 'bg-[#fde3da]' : 'bg-cream',
                )}
              >
                <span
                  className={cn(
                    'ink-border grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-base short:h-5 short:w-5 short:text-xs',
                    step >= 0 ? 'bg-success text-white' : 'bg-accent text-navy',
                  )}
                >
                  {step >= 0 ? step + 1 : c.id}
                </span>
                <span className="text-[14px] font-semibold leading-snug text-navy short:text-[11px] short:leading-tight">
                  {c.text}
                </span>
              </motion.button>
            </li>
          );
        })}
      </ul>
      <p
        role="status"
        className={cn(
          'text-[14px] font-semibold leading-snug short:text-[11.5px]',
          done ? 'text-success-dark' : missCard ? 'text-primary-dark' : 'text-muted',
        )}
      >
        {done
          ? `Chính xác! Thứ tự đúng: ${BREATH_ORDER.join(' → ')}`
          : missCard
            ? `Chưa đúng thứ tự. 💡 ${BREATH_CARDS.find((c) => c.id === BREATH_ORDER[picked.length])?.tip}`
            : `Bước ${picked.length + 1}/4: thao tác nào làm trước?`}
      </p>
      {done && (
        <Button size="lg" block variant="green" onClick={onDone}>
          Tiếp tục ▸
        </Button>
      )}
    </div>
  );
}
