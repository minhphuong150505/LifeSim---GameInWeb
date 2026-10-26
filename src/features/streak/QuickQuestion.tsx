import { motion } from 'framer-motion';
import { useState } from 'react';
import { Timer } from '../../components/Timer';
import { cn } from '../../lib/cn';
import { playSound, vibrate } from '../../lib/sound';
import { useCountdown } from '../../lib/useCountdown';
import type { DailyQuestion } from './streakLogic';

export type QuickAnswer = { correct: boolean; timeLeftSec: number };

type QuickQuestionProps = {
  question: DailyQuestion;
  timeLimitSec: number;
  onAnswered: (answer: QuickAnswer) => void;
};

/** One timed quick-fire question with instant feedback. Shared by Daily and Team modes. */
export function QuickQuestion({ question, timeLimitSec, onAnswered }: QuickQuestionProps) {
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const finish = (optionId: string | null, timeLeftSec: number) => {
    if (done) return;
    const correct = optionId === question.correctId;
    setChosenId(optionId);
    setDone(true);
    if (correct) {
      playSound('correct');
    } else {
      playSound('wrong');
      vibrate(120);
    }
    onAnswered({ correct, timeLeftSec: correct ? timeLeftSec : 0 });
  };

  const { left, getLeft } = useCountdown(timeLimitSec, !done, () => finish(null, 0));
  const correct = done && chosenId === question.correctId;

  return (
    <div className="flex flex-col gap-3">
      <Timer leftSec={left} totalSec={timeLimitSec} />
      <h2 className="text-xl font-bold text-navy">{question.question}</h2>
      <ul className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isCorrect = done && option.id === question.correctId;
          const isWrong = done && option.id === chosenId && !isCorrect;
          return (
            <li key={option.id}>
              <motion.button
                type="button"
                disabled={done}
                onClick={() => finish(option.id, getLeft())}
                whileTap={{ scale: 0.98 }}
                animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                className={cn(
                  'flex min-h-14 w-full items-center gap-3 rounded-2xl border-[2.5px] bg-paper px-4 py-2.5 text-left text-[15px] font-semibold text-navy shadow-soft',
                  isCorrect && 'border-success bg-success/10',
                  isWrong && 'border-error bg-error/10',
                  !isCorrect && !isWrong && 'border-navy',
                  done && !isCorrect && !isWrong && 'opacity-55',
                )}
              >
                <span className="flex-1">{option.text}</span>
                {isCorrect && <span aria-hidden>✓</span>}
                {isWrong && <span aria-hidden>✕</span>}
              </motion.button>
            </li>
          );
        })}
      </ul>
      {done && (
        <motion.div
          role="status"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={cn(
            'rounded-card border-2 p-3',
            correct ? 'border-success bg-[#EDF7EE]' : 'border-error bg-[#FDECEC]',
          )}
        >
          <p
            className={cn(
              'font-display text-lg font-bold',
              correct ? 'text-success-dark' : 'text-primary-dark',
            )}
          >
            {correct ? '✓ ĐÚNG' : chosenId === null ? '⏰ HẾT GIỜ' : '✕ CHƯA ĐÚNG'}
          </p>
          <p className="text-sm leading-relaxed text-ink">{question.explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
