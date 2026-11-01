import { motion } from 'framer-motion';
import { CastFace } from '../../art/CastFace';
import {
  BackIcon,
  BagIcon,
  BoltIcon,
  BookIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
  HeartIcon,
  ShopIcon,
} from '../../art/icons';
import { Button } from '../../components/Button';
import { CurrencyPill } from '../../components/CurrencyPill';
import { FitContent } from '../../components/FitContent';
import { cn } from '../../lib/cn';
import { MAX_BOLTS } from './engine';
import { OptionArt } from './optionArt';
import { CAST_NAMES } from './stageLayout';
import type { Beat, OptionId, SimQuestion } from './types';

const LETTERS: Record<OptionId, string> = { a: 'A', b: 'B', c: 'C' };
/** The older sister (the player's character) comments on every answer. */
const GUIDE_NAME = 'Chị';

const hudBtn =
  'ink-border relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper shadow-pop active:translate-y-0.5 short:h-9 short:w-9 tiny:h-8 tiny:w-8 [&>svg]:h-[68%] [&>svg]:w-[68%]';

function PointArrow() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2"
      animate={{ y: [0, 6, 0] }}
      transition={{ repeat: Infinity, duration: 0.9 }}
    >
      <svg viewBox="0 0 30 40" width={24} height={32}>
        <path
          d="M10 38 V18 H3 L15 2 L27 18 H20 V38 Z"
          fill="#fffdf6"
          stroke="#3b2d26"
          strokeWidth={3}
          strokeLinejoin="round"
        />
      </svg>
    </motion.span>
  );
}

export function Hud({
  title,
  hearts,
  heartSlots,
  bolts,
  clock,
  bagCount,
  pointAt,
  onBack,
  onHelp,
  onBag,
  onShop,
}: {
  title: string;
  hearts: number;
  heartSlots: number;
  bolts: number;
  clock: string | null;
  bagCount: number;
  pointAt: 'bag' | 'shop' | null;
  onBack: () => void;
  onHelp: () => void;
  onBag: () => void;
  onShop: () => void;
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-1.5 px-[max(8px,env(safe-area-inset-left))] pr-[max(8px,env(safe-area-inset-right))] pt-[max(6px,env(safe-area-inset-top))] short:gap-1 short:pt-1">
      <button type="button" onClick={onBack} aria-label="Thoát màn chơi" className={hudBtn}>
        <BackIcon size={26} />
      </button>
      <p className="ink-border min-w-0 shrink truncate rounded-xl bg-paper/95 px-2 py-1 font-display text-[15px] text-navy short:py-0.5 short:text-[13px]">
        {title}
      </p>
      <div
        className="ink-border flex shrink-0 items-center rounded-xl bg-paper/95 px-1 py-0.5 short:[&_svg]:h-[17px] short:[&_svg]:w-[17px]"
        role="img"
        aria-label={`${hearts}/${heartSlots} trái tim, ${bolts}/${MAX_BOLTS} tia sét`}
      >
        {Array.from({ length: heartSlots }, (_, i) => (
          <motion.span key={i} animate={i === hearts - 1 ? { scale: [1, 1.4, 1] } : undefined}>
            <HeartIcon filled={i < hearts} size={22} />
          </motion.span>
        ))}
        <span aria-hidden className="mx-1 h-5 w-0.5 bg-navy/25" />
        {Array.from({ length: MAX_BOLTS }, (_, i) => (
          <motion.span
            key={i}
            animate={i === bolts - 1 ? { scale: [1, 1.6, 1], rotate: [0, -12, 0] } : undefined}
          >
            <BoltIcon filled={i < bolts} size={22} />
          </motion.span>
        ))}
      </div>
      {clock && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ink-border hidden shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-display text-sm text-navy sm:flex"
        >
          <ClockIcon minutes={15} size={20} />
          {clock}
        </motion.span>
      )}
      <span className="flex-1" />
      <CurrencyPill className="shrink-0" />
      <div className="relative">
        <button
          type="button"
          onClick={onBag}
          aria-label={`Túi vật dụng (${bagCount} món)`}
          className={hudBtn}
        >
          <BagIcon size={30} />
          {bagCount > 0 && (
            <span className="ink-border absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-display text-xs text-navy">
              {bagCount}
            </span>
          )}
        </button>
        {pointAt === 'bag' && <PointArrow />}
      </div>
      <div className="relative">
        <button type="button" onClick={onShop} aria-label="Cửa hàng vật dụng" className={hudBtn}>
          <ShopIcon size={30} />
        </button>
        {pointAt === 'shop' && <PointArrow />}
      </div>
      <button
        type="button"
        onClick={onHelp}
        aria-label="Cách chơi"
        className={cn(hudBtn, 'rounded-full font-display text-2xl text-navy short:text-xl')}
      >
        ?
      </button>
    </div>
  );
}

/** Visual-novel style dialogue box popping up over the scene (tap to continue). */
export function DialogueBox({
  beat,
  onNext,
  onSkip,
  showSkip,
}: {
  beat: Extract<Beat, { kind: 'narration' | 'line' }>;
  onNext: () => void;
  onSkip: () => void;
  showSkip: boolean;
}) {
  const narration = beat.kind === 'narration';
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(10px,env(safe-area-inset-bottom))] short:pb-1.5">
      <motion.button
        type="button"
        key={beat.text}
        onClick={onNext}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="ink-border relative flex w-full max-w-4xl items-start gap-3 rounded-[22px] bg-paper/97 p-3 pr-10 text-left shadow-pop short:gap-2 short:p-2 short:pr-8"
        aria-label={`${narration ? 'Bối cảnh' : CAST_NAMES[beat.speaker]}: ${beat.text}. Chạm để tiếp tục`}
      >
        <span className="ink-border grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#fff1c2] short:h-11 short:w-11 [&>svg]:h-full [&>svg]:w-full">
          {narration ? <BookIcon size={44} /> : <CastFace kind={beat.speaker} size={64} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="ink-border -mt-6 mb-1 inline-block rounded-full bg-primary px-3 font-display text-white short:-mt-5 short:mb-0 short:text-sm">
            {narration ? 'Bối cảnh' : CAST_NAMES[beat.speaker]}
          </span>
          <span
            className={cn(
              'block leading-relaxed text-navy',
              narration
                ? 'text-[16px] italic short:text-[13px] short:leading-snug'
                : 'text-[18px] font-semibold short:text-[14px] short:leading-snug',
            )}
          >
            “{beat.text}”
          </span>
        </span>
        <motion.span
          aria-hidden
          className="absolute bottom-2 right-3 font-display text-xl text-primary-dark"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 0.9 }}
        >
          ▸
        </motion.span>
      </motion.button>
      {showSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="ink-border absolute -top-11 right-4 rounded-xl bg-paper px-3 py-1.5 font-semibold text-navy shadow-pop short:-top-8 short:py-0.5 short:text-sm"
        >
          Bỏ qua ⏭
        </button>
      )}
    </div>
  );
}

/** Mission card that pops up in the middle of the scene at the end of the intro. */
export function MissionPopup({ text, onStart }: { text: string; onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-navy/30 p-4 short:pt-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="ink-border relative w-full max-w-lg rounded-[24px] bg-[#fff1c2] p-5 pt-6 text-center shadow-pop short:p-3 short:pt-4"
      >
        <span className="ink-border absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 font-display text-lg text-white">
          NHIỆM VỤ
        </span>
        <p className="font-display text-[22px] leading-snug text-navy short:text-[16px]">{text}</p>
        <Button size="lg" className="mt-4 short:mt-2" onClick={onStart}>
          Bắt đầu nhiệm vụ ▸
        </Button>
      </motion.div>
    </div>
  );
}

/** Right-hand popup holding the question / feedback / task; the scene stays visible on the left. */
export function SidePanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <motion.section
      aria-label={label}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="ink-border absolute bottom-[max(8px,env(safe-area-inset-bottom))] right-[max(8px,env(safe-area-inset-right))] top-[60px] z-20 flex w-[min(54%,580px)] flex-col overflow-hidden rounded-[22px] bg-paper p-3 pb-2 shadow-pop short:bottom-1 short:top-[46px] short:rounded-2xl short:p-2 short:pb-1.5 tiny:top-[40px]"
    >
      <FitContent innerClassName="flex flex-col">{children}</FitContent>
    </motion.section>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-2 short:gap-1"
    >
      <h2 className="shrink-0 font-display text-[19px] leading-snug text-navy short:text-[15px] short:leading-tight tiny:text-[13px]">
        <span className="mr-1.5 inline-block rounded-full bg-primary px-2 align-[2px] font-display text-[12px] leading-5 text-white short:text-[11px] short:leading-4">
          Câu {index + 1}/{total}
        </span>
        {question.prompt}
      </h2>
      <ul className="flex flex-col gap-1.5 short:gap-1">
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
                  'ink-border relative flex w-full items-center gap-2.5 overflow-hidden rounded-2xl bg-cream p-1 pr-2 text-left shadow-pop short:gap-1.5 short:rounded-xl',
                  wrong && 'bg-[#efe9dc] shadow-none',
                )}
              >
                <OptionArt
                  art={o.art}
                  className={cn(
                    'aspect-square w-[clamp(26px,13dvh,56px)] shrink-0 overflow-hidden rounded-xl border-2 border-navy bg-paper short:rounded-lg',
                    wrong && 'opacity-45 grayscale',
                  )}
                />
                <span className="ink-border grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent font-display text-base text-navy short:h-5 short:w-5 short:text-xs">
                  {LETTERS[o.id]}
                </span>
                <span
                  className={cn(
                    'flex-1 text-[15px] font-semibold leading-snug text-navy short:text-[12.5px] short:leading-tight tiny:text-[11.5px]',
                    wrong && 'text-muted line-through',
                  )}
                >
                  {o.text}
                </span>
                {wrong && (
                  <span className="absolute right-0.5 top-0.5 [&>svg]:h-5 [&>svg]:w-5">
                    <BoltIcon size={26} />
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

function GuideSays({
  tone,
  title,
  children,
  aside,
}: {
  tone: 'good' | 'bad';
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  const bg = tone === 'good' ? 'bg-[#eef7e6]' : 'bg-[#fde3da]';
  return (
    <div className="flex items-start gap-2.5 short:gap-2">
      <motion.span
        initial={{ y: 20, scale: 0.6 }}
        animate={{ y: 0, scale: 1 }}
        className="ink-border grid h-[72px] w-[72px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#fff1c2] short:h-10 short:w-10 short:rounded-xl [&>svg]:h-full [&>svg]:w-full"
        aria-label={GUIDE_NAME}
      >
        <CastFace kind="player" size={72} />
      </motion.span>
      <div
        className={cn(
          'ink-border relative flex min-w-0 flex-1 flex-col rounded-2xl p-3 short:rounded-xl short:p-2',
          bg,
        )}
      >
        <span
          aria-hidden
          className={cn(
            'absolute -left-[9px] top-6 h-4 w-4 rotate-45 border-b-[2.5px] border-l-[2.5px] border-navy short:top-3',
            bg,
          )}
        />
        <div className="flex shrink-0 items-center gap-2 short:gap-1 short:[&>svg]:h-5 short:[&>svg]:w-5">
          {tone === 'good' ? <CheckIcon size={30} /> : <CrossIcon size={30} />}
          <p
            className={cn(
              'font-display text-2xl leading-tight short:text-[17px]',
              tone === 'good' ? 'text-success-dark' : 'text-primary-dark',
            )}
          >
            {title}
          </p>
          {aside && <span className="ml-auto short:[&_svg]:h-5 short:[&_svg]:w-5">{aside}</span>}
        </div>
        <p className="mt-0.5 shrink-0 font-display text-sm text-navy/70 short:hidden">
          {GUIDE_NAME} nói:
        </p>
        <div className="text-[15px] leading-relaxed text-ink short:text-[12.5px] short:leading-snug tiny:text-[11.5px]">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Wrong pick: the sister explains it is not right and nudges the player, then they try again. */
export function WrongPanel({
  question,
  picked,
  onRetry,
}: {
  question: SimQuestion;
  picked: OptionId;
  onRetry: () => void;
}) {
  const option = question.options.find((o) => o.id === picked);
  return (
    <motion.div
      role="alert"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-2 short:gap-1.5"
    >
      <GuideSays
        tone="bad"
        title="Chưa đúng rồi!"
        aside={
          <span className="flex items-center font-display text-lg text-navy short:text-sm">
            +1 <BoltIcon size={24} />
          </span>
        }
      >
        {option && (
          <p>
            Cách “<b>{option.text}</b>” chưa phải lựa chọn phù hợp trong tình huống này.
          </p>
        )}
        <p className="mt-1 short:mt-0.5">
          💡 {question.hint ?? 'Hãy nghĩ xem cách nào an toàn nhất cho em trai nhé.'}
        </p>
      </GuideSays>
      <Button size="lg" block className="shrink-0" onClick={onRetry}>
        Chọn lại
      </Button>
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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-2 short:gap-1.5"
    >
      <GuideSays
        tone="good"
        title={firstTry ? 'Chính xác!' : 'Đúng rồi!'}
        aside={
          <span className="flex items-center font-display text-lg text-navy short:text-sm">
            +1 <HeartIcon size={24} />
          </span>
        }
      >
        {answer && (
          <div className="my-1.5 flex items-center gap-2 short:my-0.5 tiny:hidden">
            <OptionArt
              art={answer.art}
              className="aspect-square w-[44px] shrink-0 overflow-hidden rounded-xl border-2 border-navy bg-cream short:hidden"
            />
            <p className="font-display text-[16px] leading-snug text-navy short:text-[13px]">
              {LETTERS[answer.id]}. {answer.text}
            </p>
          </div>
        )}
        <p>
          <span className="font-bold text-navy">Giải thích: </span>
          {question.explanation}
        </p>
        {question.caption && (
          <p className="mt-1 text-sm font-semibold text-success-dark short:mt-0.5 short:text-[12px] tiny:hidden">
            ✨ {question.caption}
          </p>
        )}
      </GuideSays>
      <Button size="lg" variant="green" block className="shrink-0" onClick={onAck}>
        Đã hiểu ▸
      </Button>
    </motion.div>
  );
}
