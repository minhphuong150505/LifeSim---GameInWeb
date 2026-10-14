import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Timer } from '../../components/Timer';
import { cn } from '../../lib/cn';
import { playSound } from '../../lib/sound';
import { useCountdown } from '../../lib/useCountdown';
import { evaluateOrder, evaluateSingle, type StepAnswer } from './engine';
import type { Step } from './types';

type StepProps = {
  step: Step;
  /** The recorded answer once the step is resolved, otherwise null. */
  answer: StepAnswer | null;
  onAnswer: (answer: StepAnswer) => void;
};

export function SingleStep({ step, answer, onAnswer }: StepProps) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const resolved = answer !== null;
  const { left, getLeft } = useCountdown(step.timeLimitSec, !resolved, () =>
    onAnswer(evaluateSingle(step, null, 0)),
  );

  const choose = (id: string) => {
    if (resolved) return;
    setChosenId(id);
    onAnswer(evaluateSingle(step, id, getLeft()));
  };

  return (
    <div className="flex flex-col gap-3">
      <Timer leftSec={left} totalSec={step.timeLimitSec} />
      <ul className="flex flex-col gap-2.5">
        {(step.options ?? []).map((option, i) => {
          const isChosen = chosenId === option.id;
          const showCorrect = resolved && option.correct;
          const showWrong = resolved && isChosen && !option.correct;
          return (
            <li key={option.id}>
              <motion.button
                type="button"
                disabled={resolved}
                onClick={() => choose(option.id)}
                whileTap={{ scale: 0.98 }}
                animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-white px-3 py-2.5 text-left text-[15px] font-semibold text-navy shadow-soft',
                  showCorrect && 'border-success bg-success/10',
                  showWrong && 'border-error bg-error/10',
                  !showCorrect && !showWrong && 'border-navy/10',
                  resolved && !showCorrect && !showWrong && 'opacity-55',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-base font-bold',
                    showCorrect
                      ? 'bg-success text-white'
                      : showWrong
                        ? 'bg-error text-white'
                        : 'bg-navy/10',
                  )}
                >
                  {showCorrect ? '✓' : showWrong ? '✕' : String.fromCharCode(65 + i)}
                </span>
                <span>{option.text}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function OrderStep({ step, answer, onAnswer }: StepProps) {
  const [order, setOrder] = useState<string[]>([]);
  const resolved = answer !== null;
  const items = step.orderItems ?? [];
  const submit = (timeLeft: number) => onAnswer(evaluateOrder(step, order, timeLeft));
  const { left, getLeft } = useCountdown(step.timeLimitSec, !resolved, () => submit(0));

  const toggle = (id: string) => {
    if (resolved) return;
    playSound('select');
    setOrder((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="flex flex-col gap-3">
      <Timer leftSec={left} totalSec={step.timeLimitSec} />
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => {
          const position = order.indexOf(item.id);
          const picked = position >= 0;
          const rightPlace = resolved && step.correctOrder?.[position] === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={resolved}
                onClick={() => toggle(item.id)}
                aria-label={
                  picked ? `${item.text} – vị trí ${position + 1}. Chạm để bỏ chọn` : item.text
                }
                className={cn(
                  'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-white px-3 py-2.5 text-left text-[15px] font-semibold text-navy shadow-soft',
                  !resolved && picked && 'border-navy bg-navy/5',
                  !resolved && !picked && 'border-dashed border-navy/25',
                  resolved && rightPlace && 'border-success bg-success/10',
                  resolved && !rightPlace && 'border-error bg-error/10',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-base font-bold',
                    picked ? 'bg-navy text-white' : 'bg-navy/10 text-navy/40',
                  )}
                >
                  {picked ? position + 1 : '?'}
                </span>
                <span>{item.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {!resolved && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="shrink-0 whitespace-nowrap"
            onClick={() => setOrder([])}
            disabled={order.length === 0}
          >
            Chọn lại
          </Button>
          <Button block disabled={order.length !== items.length} onClick={() => submit(getLeft())}>
            Xác nhận thứ tự
          </Button>
        </div>
      )}
    </div>
  );
}
