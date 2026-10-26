import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { BackIcon, BoltIcon, CheckIcon, HeartIcon } from '../../art/icons';
import { cn } from '../../lib/cn';
import { MAX_BOLTS } from './engine';
import { OptionArt } from './optionArt';
import { CAST_NAMES } from './stageLayout';
import type { Beat, OptionId, SimQuestion } from './types';

const LETTERS: Record<OptionId, string> = { a: 'A', b: 'B', c: 'C' };

export function Hud({
  hearts,
  heartSlots,
  bolts,
  onBack,
  onHelp,
}: {
  hearts: number;
  heartSlots: number;
  bolts: number;
  onBack: () => void;
  onHelp: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onBack}
        aria-label="Thoát round"
        className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper shadow-pop"
      >
        <BackIcon size={26} />
      </button>
      <div
        className="flex min-w-0 flex-1 items-center justify-center gap-0.5"
        role="img"
        aria-label={`${hearts}/${heartSlots} trái tim`}
      >
        {Array.from({ length: heartSlots }, (_, i) => (
          <motion.span key={i} animate={i === hearts - 1 ? { scale: [1, 1.4, 1] } : undefined}>
            <HeartIcon filled={i < hearts} size={24} />
          </motion.span>
        ))}
      </div>
      <div
        className="flex items-center gap-0"
        role="img"
        aria-label={`${bolts}/${MAX_BOLTS} tia sét`}
      >
        {Array.from({ length: MAX_BOLTS }, (_, i) => (
          <motion.span
            key={i}
            animate={i === bolts - 1 ? { scale: [1, 1.6, 1], rotate: [0, -12, 0] } : undefined}
          >
            <BoltIcon filled={i < bolts} size={24} />
          </motion.span>
        ))}
      </div>
      <button
        type="button"
        onClick={onHelp}
        aria-label="Cách chơi"
        className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper font-display text-2xl text-navy shadow-pop"
      >
        ?
      </button>
    </div>
  );
}

export function IntroPanel({
  beat,
  onNext,
  onSkip,
  showSkip,
}: {
  beat: Beat;
  onNext: () => void;
  onSkip: () => void;
  showSkip: boolean;
}) {
  return (
    <motion.div
      key={beat.kind + ('text' in beat ? beat.text : '')}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-1 flex-col gap-3"
    >
      {beat.kind === 'narration' && (
        <div className="ink-border rounded-card bg-paper p-4 shadow-soft">
          <p className="font-display text-sm text-primary-dark">Bối cảnh</p>
          <p className="mt-1 text-[16px] italic leading-relaxed text-ink">“{beat.text}”</p>
        </div>
      )}
      {beat.kind === 'line' && (
        <div className="ink-border rounded-card bg-paper p-4 shadow-soft">
          <p className="font-display text-lg text-primary-dark">{CAST_NAMES[beat.speaker]}</p>
          <p className="text-[17px] font-semibold leading-relaxed text-navy">“{beat.text}”</p>
        </div>
      )}
      {beat.kind === 'mission' && (
        <div className="ink-border relative rounded-card bg-[#fff1c2] p-4 shadow-soft">
          <span className="ink-border absolute -top-3.5 left-4 rounded-full bg-primary px-3 font-display text-white">
            NHIỆM VỤ
          </span>
          <p className="mt-1 font-display text-[21px] leading-snug text-navy">{beat.text}</p>
        </div>
      )}
      <Button size="lg" block className="mt-auto" onClick={onNext}>
        {beat.kind === 'mission' ? 'Bắt đầu nhiệm vụ' : 'Tiếp tục ▸'}
      </Button>
      {showSkip && beat.kind !== 'mission' && (
        <button
          type="button"
          onClick={onSkip}
          className="-mt-1 min-h-11 font-semibold text-muted underline"
        >
          Bỏ qua phần mở đầu
        </button>
      )}
    </motion.div>
  );
}

export function QuestionPanel({
  question,
  index,
  total,
  wrongIds,
  onAnswer,
}: {
  question: SimQuestion;
  index: number;
  total: number;
  wrongIds: OptionId[];
  onAnswer: (id: OptionId) => void;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="flex flex-col gap-2.5"
    >
      <div>
        <p className="font-display text-base text-primary-dark">
          Câu {index + 1}/{total}
        </p>
        <h2 className="font-display text-[21px] leading-snug text-navy">{question.prompt}</h2>
      </div>
      <ul className="flex flex-col gap-2.5">
        {question.options.map((o) => {
          const wrong = wrongIds.includes(o.id);
          return (
            <li key={o.id}>
              <motion.button
                type="button"
                disabled={wrong}
                onClick={() => onAnswer(o.id)}
                whileTap={{ scale: 0.98 }}
                animate={wrong ? { x: [0, -10, 10, -7, 7, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                aria-label={`${LETTERS[o.id]}. ${o.text}${wrong ? ' (đã chọn sai)' : ''}`}
                className={cn(
                  'ink-border relative flex w-full items-center gap-3 rounded-2xl bg-paper p-2 text-left shadow-pop',
                  wrong && 'bg-[#efe9dc] shadow-none',
                )}
              >
                <OptionArt
                  art={o.art}
                  className={cn(
                    'aspect-square w-[84px] shrink-0 overflow-hidden rounded-xl border-2 border-navy bg-cream',
                    wrong && 'opacity-45 grayscale',
                  )}
                />
                <span
                  className={cn(
                    'flex-1 text-[15px] font-semibold leading-snug text-navy',
                    wrong && 'text-muted line-through',
                  )}
                >
                  <span className="ink-border mr-1.5 inline-grid h-7 w-7 place-items-center rounded-full bg-accent font-display text-base text-navy no-underline">
                    {LETTERS[o.id]}
                  </span>
                  {o.text}
                </span>
                {wrong && (
                  <span className="absolute -right-1.5 -top-2">
                    <BoltIcon size={28} />
                  </span>
                )}
              </motion.button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export function ExplainPanel({
  question,
  firstTry,
  onAck,
}: {
  question: SimQuestion;
  firstTry: boolean;
  onAck: () => void;
}) {
  const answer = question.options.find((o) => o.id === question.correctId);
  return (
    <motion.div
      role="status"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-1 flex-col gap-3"
    >
      <div className="ink-border rounded-card bg-[#eef7e6] p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <CheckIcon size={34} />
          <p className="font-display text-2xl text-success-dark">
            {firstTry ? 'Chính xác!' : 'Đúng rồi!'}
          </p>
          <span className="ml-auto flex items-center font-display text-lg text-navy">
            +1 <HeartIcon size={24} />
          </span>
        </div>
        {answer && (
          <div className="mt-3 flex items-center gap-3">
            <OptionArt
              art={answer.art}
              className="aspect-square w-[72px] shrink-0 overflow-hidden rounded-xl border-2 border-navy bg-cream"
            />
            <p className="font-display text-[17px] leading-snug text-navy">
              {LETTERS[answer.id]}. {answer.text}
            </p>
          </div>
        )}
        <p className="mt-3 border-t-2 border-dashed border-navy/25 pt-2 text-[15px] leading-relaxed text-ink">
          <span className="font-bold text-navy">Giải thích: </span>
          {question.explanation}
        </p>
      </div>
      <Button size="lg" variant="green" block className="mt-auto" onClick={onAck}>
        Đã hiểu
      </Button>
    </motion.div>
  );
}
