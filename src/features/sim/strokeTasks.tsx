import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { C, stroke } from '../../art/ink';
import { LOOKS } from '../../art/looks';
import { Person } from '../../art/Person';
import { Aspirin, Cup, LYING_CHEST_DX, NamOnBack, SlurBubble } from '../../art/StrokeArt';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';
import { playSound, vibrate } from '../../lib/sound';
import {
  allSignsFound,
  BREATH_NOW,
  BREATH_RIGHT,
  BREATH_WRONG,
  FAST_CARD,
  SIGN_MISS,
  SIGN_SPOTS,
  SORT_BINS,
  SORT_ITEMS,
  sortIsRight,
  type BreathAnswer,
  type SignId,
  type SortBin,
  type SortItemId,
} from './strokeTaskLogic';
import type { StageState } from './types';

function TaskTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="ink-border rounded-2xl bg-[#fff1c2] px-3 py-2 short:px-2 short:py-1">
      <p className="font-display text-[17px] leading-snug text-navy short:text-[13px] short:leading-tight">
        {children}
      </p>
    </div>
  );
}

/* ───────────────────────── 3.1 · tap the Face–Arm–Speech signs ───────────────────────── */

export function StrokeSignsTask({ onDone }: { onDone: () => void }) {
  const [found, setFound] = useState<SignId[]>([]);
  const [miss, setMiss] = useState(0);
  const done = allSignsFound(found);

  const tap = (id: SignId) => {
    if (found.includes(id)) return;
    setFound((f) => [...f, id]);
    playSound('found');
  };
  const missTap = () => {
    if (done) return;
    setMiss((m) => m + 1);
    playSound('wrong');
    vibrate(60);
  };

  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <TaskTitle>
        Nhiệm vụ: Chạm vào các dấu hiệu bất thường trên Ông Nội để ghi nhớ Face – Arm – Speech.
      </TaskTitle>
      <div className="flex items-stretch gap-3 short:gap-2">
        <motion.div
          key={miss}
          animate={miss ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
          transition={{ duration: 0.35 }}
          className={cn(
            'ink-border relative aspect-square w-[46%] max-w-[260px] shrink-0 overflow-hidden rounded-[22px] bg-[#fff7e6] short:w-[34%] short:rounded-xl',
            miss > 0 && !done && 'outline outline-[3px] outline-offset-[-3px] outline-primary/50',
          )}
        >
          <svg viewBox="-50 -110 130 128" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x={-60} y={-12} width={150} height={40} rx={8} fill={C.sofa} {...stroke(2)} />
            <Person kind="nam" pose="sit" x={0} y={0} eyes="worried" mouth="droop" armL="limp" />
            <SlurBubble x={50} y={-92} s={0.9} />
          </svg>
          <button
            type="button"
            aria-label="Vùng không có dấu hiệu"
            onClick={missTap}
            className="absolute inset-0 h-full w-full cursor-default"
          />
          {SIGN_SPOTS.map((z) => {
            const ok = found.includes(z.id);
            return (
              <button
                key={z.id}
                type="button"
                aria-label={z.label}
                onClick={() => tap(z.id)}
                className={cn(
                  'absolute rounded-2xl',
                  ok && 'border-[3px] border-primary-dark bg-primary/15',
                )}
                style={{
                  left: `${z.box[0]}%`,
                  top: `${z.box[1]}%`,
                  width: `${z.box[2]}%`,
                  height: `${z.box[3]}%`,
                }}
              >
                {ok && (
                  <span className="absolute left-1/2 top-full -mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary-dark px-1.5 font-display text-[11px] leading-4 text-white">
                    {z.label}
                  </span>
                )}
              </button>
            );
          })}
        </motion.div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          {done ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="ink-border rounded-2xl bg-paper p-2 short:p-1.5"
            >
              <p className="font-display text-[15px] leading-tight text-primary-dark short:text-[13px]">
                Thẻ FAST
              </p>
              <ul className="mt-1 space-y-0.5">
                {FAST_CARD.map((f) => (
                  <li
                    key={f.letter}
                    className="flex items-center gap-1.5 text-[14px] leading-snug text-navy short:text-[11.5px]"
                  >
                    <span className="ink-border grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent font-display text-[13px] short:h-5 short:w-5 short:text-[11px]">
                      {f.letter}
                    </span>
                    <span>
                      <b>{f.word}</b> – {f.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <>
              <p className="font-display text-[20px] text-navy short:text-[15px]">
                Đã tìm: {found.length}/3
              </p>
              <motion.p
                key={miss}
                role="status"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'text-[15px] font-semibold leading-snug short:text-[12px]',
                  miss > 0 ? 'text-primary-dark' : 'text-muted',
                )}
              >
                {miss > 0 ? SIGN_MISS : 'Chạm theo thứ tự bất kỳ: khóe miệng, cánh tay, lời nói.'}
              </motion.p>
            </>
          )}
          {done && (
            <Button size="lg" block variant="green" className="mt-auto" onClick={onDone}>
              Đã hiểu ▸
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── 3.3 · sort the objects ───────────────────────── */

function SortThumb({ id }: { id: SortItemId }) {
  return (
    <svg viewBox="-16 -16 32 32" className="h-full w-full" aria-hidden>
      {id === 'phone' && (
        <g>
          <rect x={-7} y={-12} width={14} height={24} rx={3} fill="#4b5563" {...stroke(1.6)} />
          <rect x={-5} y={-9} width={10} height={15} rx={1.5} fill={C.sky} />
        </g>
      )}
      {id === 'water' && <Cup x={0} y={1} s={1.5} />}
      {id === 'aspirin' && <Aspirin x={0} y={0} s={1.2} rot={-10} />}
    </svg>
  );
}

export function SortItemsTask({ onDone }: { onDone: () => void }) {
  const [placed, setPlaced] = useState<SortItemId[]>([]);
  const [picked, setPicked] = useState<SortItemId | null>(null);
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const dragged = useRef(false);
  const done = SORT_ITEMS.every((i) => placed.includes(i.id));

  const drop = (item: SortItemId, bin: SortBin) => {
    const info = SORT_ITEMS.find((i) => i.id === item);
    if (!info) return;
    setPicked(null);
    if (sortIsRight(item, bin)) {
      setPlaced((p) => (p.includes(item) ? p : [...p, item]));
      setNote({ ok: true, text: info.why });
      playSound('found');
    } else {
      setNote({ ok: false, text: info.hint });
      playSound('wrong');
      vibrate(80);
    }
  };

  /** Drop target under the pointer when a drag ends (reads the bin from the DOM). */
  const binAt = (x: number, y: number): SortBin | null => {
    // The dragged card itself is under the pointer: look through it for the bin.
    const el = document
      .elementsFromPoint(x, y)
      .map((e) => e.closest('[data-bin]'))
      .find(Boolean);
    const bin = el?.getAttribute('data-bin');
    return bin === 'safe' || bin === 'avoid' ? bin : null;
  };

  const left = SORT_ITEMS.filter((i) => !placed.includes(i.id));

  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <TaskTitle>
        Nhiệm vụ: Kéo thả (hoặc chạm chọn rồi chạm nhóm) để phân loại 3 vật dụng theo mức độ an
        toàn.
      </TaskTitle>
      <div className="flex items-stretch gap-2">
        <ul className="flex w-[30%] shrink-0 flex-col gap-1.5 short:gap-1">
          {left.map((i) => (
            <li key={i.id}>
              <motion.button
                type="button"
                drag
                dragSnapToOrigin
                dragMomentum={false}
                whileDrag={{ scale: 1.08, zIndex: 40 }}
                onDragStart={() => {
                  dragged.current = true;
                }}
                onDragEnd={(e) => {
                  const p = 'clientX' in e ? e : (e as TouchEvent).changedTouches?.[0];
                  const bin = p ? binAt(p.clientX, p.clientY) : null;
                  if (bin) drop(i.id, bin);
                  window.setTimeout(() => {
                    dragged.current = false;
                  }, 0);
                }}
                onClick={() => {
                  if (dragged.current) return;
                  setPicked((p) => (p === i.id ? null : i.id));
                }}
                aria-pressed={picked === i.id}
                className={cn(
                  'ink-border relative flex w-full touch-none items-center gap-1.5 rounded-2xl bg-cream p-1 pr-2 text-left shadow-pop short:rounded-xl',
                  picked === i.id && 'bg-accent',
                )}
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-navy bg-paper short:h-8 short:w-8">
                  <SortThumb id={i.id} />
                </span>
                <span className="font-display text-[15px] leading-tight text-navy short:text-[12px]">
                  {i.label}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
          {SORT_BINS.map((b) => (
            <button
              key={b.id}
              type="button"
              data-bin={b.id}
              onClick={() => picked && drop(picked, b.id)}
              className={cn(
                'ink-border flex min-h-[120px] flex-col items-stretch gap-1 rounded-2xl border-dashed p-1.5 text-left short:min-h-[80px] short:rounded-xl short:p-1',
                b.id === 'safe' ? 'bg-[#eef7e6]' : 'bg-[#fde3da]',
                picked && 'ring-4 ring-accent',
              )}
            >
              <span
                className={cn(
                  'font-display text-[14px] leading-tight short:text-[11px]',
                  b.id === 'safe' ? 'text-success-dark' : 'text-primary-dark',
                )}
              >
                {b.label}
              </span>
              {SORT_ITEMS.filter((i) => i.bin === b.id && placed.includes(i.id)).map((i) => (
                <span
                  key={i.id}
                  className="flex items-center gap-1 rounded-xl border-[3px] border-success-dark bg-paper p-0.5 pr-1"
                >
                  <span className="h-8 w-8 shrink-0 short:h-6 short:w-6">
                    <SortThumb id={i.id} />
                  </span>
                  <span className="font-display text-[13px] leading-tight text-navy short:text-[11px]">
                    ✓ {i.label}
                  </span>
                </span>
              ))}
            </button>
          ))}
        </div>
      </div>
      <motion.p
        key={note?.text ?? 'idle'}
        role="status"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'text-[15px] font-semibold leading-snug short:text-[12px]',
          !note ? 'text-muted' : note.ok ? 'text-success-dark' : 'text-primary-dark',
        )}
      >
        {note
          ? `${note.ok ? '✓' : '💡'} ${note.text}`
          : 'Gợi ý: nghĩ xem vật nào giúp gọi cấp cứu.'}
      </motion.p>
      {done && (
        <Button size="lg" block variant="green" onClick={onDone}>
          Đã hiểu ▸
        </Button>
      )}
    </div>
  );
}

/* ───────────────────────── 3.4 · breathing check ───────────────────────── */

const LK = 0.42;
const HIP = { x: 82, y: 40 };
const CHEST = { x: HIP.x + LYING_CHEST_DX * LK * LOOKS.nam.scale, y: HIP.y };

/** What Ông Nội is doing now: lying on his back with rare, irregular gasps. */
function BreathClip({ frozen }: { frozen?: boolean }) {
  const anim = { values: '1 1;1 1;1 1.6;1 1;1 1', keyTimes: '0;0.62;0.68;0.78;1', dur: '5.5s' };
  return (
    <div className="ink-border relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#f7e3c4] short:rounded-xl">
      <svg viewBox="10 0 100 64" className="block h-auto w-full" aria-hidden>
        <rect x={0} y={0} width={120} height={64} fill={C.floor} />
        <g transform={`translate(${HIP.x} ${HIP.y})`}>
          <NamOnBack k={LK} />
        </g>
        <g transform={`translate(${CHEST.x} ${CHEST.y - 4})`}>
          <g>
            <ellipse rx={5} ry={8} fill={LOOKS.nam.shirt} opacity={0.9} {...stroke(1.2)} />
            {!frozen && (
              <animateTransform
                attributeName="transform"
                type="scale"
                values={anim.values}
                keyTimes={anim.keyTimes}
                dur={anim.dur}
                repeatCount="indefinite"
              />
            )}
          </g>
        </g>
        {frozen && (
          <ellipse
            cx={CHEST.x - 18}
            cy={CHEST.y - 4}
            rx={30}
            ry={16}
            fill="none"
            stroke={C.redDark}
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        )}
        <path
          d="M50 18 l4 -5 l3 7 l4 -9"
          fill="none"
          stroke={C.redDark}
          strokeWidth={1.8}
          strokeLinecap="round"
        >
          {!frozen && (
            <animate
              attributeName="opacity"
              values="0;0;1;0;0"
              keyTimes={anim.keyTimes}
              dur={anim.dur}
              repeatCount="indefinite"
            />
          )}
        </path>
      </svg>
      <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 font-display text-[12px] leading-5 text-white">
        ĐANG THẤY
      </span>
    </div>
  );
}

export function BreathingTask({ onDone }: { onDone: (effect: Partial<StageState>) => void }) {
  const [answer, setAnswer] = useState<BreathAnswer | null>(null);
  const right = answer === BREATH_NOW;
  const wrong = answer !== null && !right;

  const pick = (a: BreathAnswer) => {
    if (right) return;
    setAnswer(a);
    if (a === BREATH_NOW) {
      playSound('correct');
    } else {
      playSound('wrong');
      vibrate(80);
    }
  };

  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <TaskTitle>Nhiệm vụ: Nhịp thở của Ông Nội đang thay đổi. Ông đang thở như thế nào?</TaskTitle>
      <BreathClip frozen={wrong} />
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          disabled={right}
          className={cn('min-h-12 px-2 text-[16px] short:text-[13px]', wrong && 'opacity-60')}
          onClick={() => pick('normal')}
        >
          Thở bình thường
        </Button>
        <Button
          variant="secondary"
          className={cn(
            'min-h-12 px-2 text-[16px] short:text-[13px]',
            right && 'bg-success-dark text-white',
          )}
          onClick={() => pick('abnormal')}
        >
          Không thở bình thường / chỉ thở ngáp cá
        </Button>
      </div>
      {answer && (
        <motion.p
          key={answer}
          role="status"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'text-[15px] font-semibold leading-snug short:text-[12px]',
            right ? 'text-success-dark' : 'text-primary-dark',
          )}
        >
          {right ? `✓ ${BREATH_RIGHT}` : `⚠ ${BREATH_WRONG}`}
        </motion.p>
      )}
      {right && (
        <Button
          size="lg"
          block
          variant="green"
          onClick={() => onDone({ nam: 'floor', breathing: 'gasping' })}
        >
          Tiếp tục ▸
        </Button>
      )}
    </div>
  );
}
