import { motion } from 'framer-motion';
import { useState } from 'react';
import { C, INK, stroke } from '../../art/ink';
import { LOOKS } from '../../art/looks';
import { Button } from '../../components/Button';
import { cn } from '../../lib/cn';
import { playSound, vibrate } from '../../lib/sound';
import { CHOKE_TASKS, type ChokeStep, type ChokeTaskId } from './chokingTaskLogic';
import type { StageState } from './types';

/* Scenario 4 hands-on tasks: back blows (4.2 câu 3) and abdominal thrusts (4.2 câu 4).
 * Each one is a short sequence – where to stand, how the child stands, where the hand goes –
 * then 5 taps that play the move on the stage. A wrong pick costs a bolt, like a wrong answer. */

const SPOTS: Record<'back' | 'belly', Record<string, { x: number; y: number }>> = {
  back: { A: { x: 50, y: 33 }, B: { x: 50, y: 53 }, C: { x: 50, y: 82 } },
  belly: { A: { x: 50, y: 43 }, B: { x: 50, y: 63 }, C: { x: 50, y: 83 } },
};

const look = LOOKS.brother;

/** The brother's back (head bowed forward), with the shoulder blades and spine marked. */
function BackFigure() {
  return (
    <g>
      <path
        d="M22 100 Q18 56 30 44 Q50 36 70 44 Q82 56 78 100 Z"
        fill={look.shirt}
        {...stroke(2.4)}
      />
      <rect x={44} y={26} width={12} height={14} rx={4} fill={look.skin} {...stroke(2)} />
      <circle cx={50} cy={20} r={15} fill={look.hair} {...stroke(2.4)} />
      <ellipse cx={35} cy={22} rx={3} ry={4.5} fill={look.skin} {...stroke(1.8)} />
      <ellipse cx={65} cy={22} rx={3} ry={4.5} fill={look.skin} {...stroke(1.8)} />
      {/* shoulder blades and spine */}
      <path
        d="M36 48 Q32 58 40 66 M64 48 Q68 58 60 66"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        opacity={0.55}
      />
      <path d="M50 42 V96" stroke={INK} strokeWidth={1.2} strokeDasharray="3 3" opacity={0.45} />
    </g>
  );
}

/** The brother's front from the chin down: rib-cage edge and navel marked. */
function BellyFigure() {
  return (
    <g>
      <path
        d="M20 100 Q16 50 28 34 Q50 26 72 34 Q84 50 80 100 Z"
        fill={look.shirt}
        {...stroke(2.4)}
      />
      <path d="M40 22 Q50 34 60 22" fill={look.skin} {...stroke(2)} />
      <path
        d="M30 56 Q50 46 70 56"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        strokeDasharray="4 3"
        opacity={0.6}
      />
      <circle cx={50} cy={73} r={2} fill={INK} opacity={0.7} />
      <text x={72} y={52} fontSize={6} fontFamily="Itim, sans-serif" fill={INK} opacity={0.75}>
        sườn
      </text>
      <text x={55} y={76} fontSize={6} fontFamily="Itim, sans-serif" fill={INK} opacity={0.75}>
        rốn
      </text>
    </g>
  );
}

function BodyPic({
  figure,
  step,
  wrong,
  picked,
  presses,
  onSpot,
}: {
  figure: 'back' | 'belly';
  step: ChokeStep;
  wrong: string[];
  picked: string | null;
  presses: number;
  onSpot?: (id: string) => void;
}) {
  const spots = SPOTS[figure];
  const target = spots.B ?? { x: 50, y: 50 };
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden={!onSpot}>
      <rect width={100} height={100} fill="#eef3df" />
      {figure === 'back' ? <BackFigure /> : <BellyFigure />}
      {step.kind === 'spot' &&
        step.choices.map((c) => {
          const p = spots[c.id] ?? { x: 50, y: 50 };
          const isWrong = wrong.includes(c.id);
          return (
            <g
              key={c.id}
              role="button"
              tabIndex={0}
              aria-label={`Vị trí ${c.id}: ${c.text}`}
              onClick={() => onSpot?.(c.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSpot?.(c.id)}
              className="cursor-pointer"
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill={isWrong ? '#fde3da' : C.white}
                stroke={isWrong ? C.redDark : INK}
                strokeWidth={2}
                strokeDasharray={isWrong ? undefined : '3 2'}
              />
              <text
                x={p.x}
                y={p.y + 3.5}
                textAnchor="middle"
                fontSize={10}
                fontFamily="Itim, sans-serif"
                fill={isWrong ? C.redDark : INK}
              >
                {c.id}
              </text>
            </g>
          );
        })}
      {(step.kind === 'press' || picked) && (
        <g transform={`translate(${target.x} ${target.y})`}>
          {figure === 'back' ? (
            <motion.g
              key={presses}
              initial={{ y: -10, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <ellipse cx={0} cy={0} rx={9} ry={7} fill={LOOKS.player.skin} {...stroke(2)} />
              <path
                d="M-6 -5 V-14 M-2 -6 V-16 M2 -6 V-16 M6 -5 V-13"
                stroke={INK}
                strokeWidth={1.2}
              />
            </motion.g>
          ) : (
            <motion.g
              key={presses}
              initial={{ y: presses > 0 ? -6 : 0 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                d="M-30 -6 L-8 0 M30 -6 L8 0"
                stroke={INK}
                strokeWidth={8}
                strokeLinecap="round"
              />
              <path
                d="M-30 -6 L-8 0 M30 -6 L8 0"
                stroke={LOOKS.player.skin}
                strokeWidth={5}
                strokeLinecap="round"
              />
              <circle cx={0} cy={0} r={8} fill={LOOKS.player.skin} {...stroke(2)} />
              <path d="M-4 -3 h8 M-4 1 h8" stroke={INK} strokeWidth={1} />
            </motion.g>
          )}
          {step.kind === 'press' && presses > 0 && figure === 'belly' && (
            <path
              d="M14 10 L14 -6 M10 -2 L14 -6 L18 -2"
              fill="none"
              stroke={C.redDark}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          )}
        </g>
      )}
    </svg>
  );
}

export function ChokeTask({
  id,
  onStage,
  onPress,
  onMistake,
  onDone,
}: {
  id: ChokeTaskId;
  /** Scene change while the task goes on (player moves behind, the brother leans forward…). */
  onStage: (patch: Partial<StageState>) => void;
  onPress: (count: number) => void;
  onMistake: () => void;
  onDone: () => void;
}) {
  const task = CHOKE_TASKS[id];
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tip, setTip] = useState<{ text: string; ok: boolean } | null>(null);
  const [presses, setPresses] = useState(0);
  const [shake, setShake] = useState(0);
  const step = task.steps[index];
  const figure =
    task.steps.find((s): s is Extract<ChokeStep, { kind: 'spot' }> => s.kind === 'spot')?.figure ??
    'back';
  const done = !step;
  const last = task.steps[task.steps.length - 1];

  const pick = (choice: string) => {
    if (!step || step.kind === 'press' || wrong.includes(choice)) return;
    const c = step.choices.find((x) => x.id === choice);
    if (!c) return;
    if (choice === step.correct) {
      playSound('correct');
      setTip({ text: c.tip, ok: true });
      setWrong([]);
      if (step.kind === 'choice' && step.effect) onStage(step.effect);
      setIndex((i) => i + 1);
    } else {
      setWrong((w) => [...w, choice]);
      setTip({ text: c.tip, ok: false });
      setShake((n) => n + 1);
      onMistake();
    }
  };

  const press = () => {
    if (!step || step.kind !== 'press' || presses >= step.count) return;
    const next = presses + 1;
    setPresses(next);
    onPress(next);
    playSound('tick');
    vibrate(30);
    if (next >= step.count) {
      playSound('correct');
      setTip({ text: step.doneText, ok: true });
      setIndex((i) => i + 1);
    }
  };

  const showPic = !step || step.kind !== 'choice';
  const picStep = step ?? last;

  return (
    <div className="flex flex-col gap-2 short:gap-1">
      <p className="font-display text-[19px] leading-snug text-navy short:text-[14px] short:leading-tight">
        {task.title}
      </p>
      <div className="flex items-stretch gap-3 short:gap-2">
        {showPic && picStep && (
          <div className="ink-border relative aspect-square w-[38%] max-w-[180px] shrink-0 overflow-hidden rounded-2xl short:rounded-xl">
            <BodyPic
              figure={figure}
              step={picStep}
              wrong={step?.kind === 'spot' ? wrong : []}
              picked={!step || step.kind === 'press' ? 'B' : null}
              presses={presses}
              onSpot={step?.kind === 'spot' ? pick : undefined}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 short:gap-1">
          {step && (
            <p className="text-[13px] font-semibold text-muted short:text-[11px]">
              Bước {index + 1}/{task.steps.length}
            </p>
          )}
          {step && (
            <p className="font-display text-[17px] leading-snug text-navy short:text-[13px] short:leading-tight">
              {step.prompt}
            </p>
          )}
          {step?.kind === 'choice' && (
            <ul className="flex flex-col gap-1.5 short:gap-1">
              {step.choices.map((c) => {
                const isWrong = wrong.includes(c.id);
                return (
                  <li key={c.id}>
                    <motion.button
                      type="button"
                      key={isWrong ? `w${shake}` : c.id}
                      onClick={() => pick(c.id)}
                      disabled={isWrong}
                      animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                      transition={{ duration: 0.35 }}
                      className={cn(
                        'ink-border w-full rounded-2xl px-3 py-2 text-left text-[15px] font-semibold leading-snug text-navy shadow-pop short:rounded-xl short:px-2 short:py-1 short:text-[12px] short:leading-tight',
                        isWrong ? 'bg-[#fde3da] text-navy/60 shadow-none line-through' : 'bg-cream',
                      )}
                    >
                      {c.text}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          )}
          {step?.kind === 'spot' && (
            <ul className="flex flex-col gap-1 short:gap-0.5">
              {step.choices.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => pick(c.id)}
                    disabled={wrong.includes(c.id)}
                    className={cn(
                      'w-full rounded-xl px-2 py-1 text-left text-[14px] font-semibold text-navy short:py-0.5 short:text-[11.5px]',
                      wrong.includes(c.id) ? 'text-navy/50 line-through' : 'hover:bg-cream',
                    )}
                  >
                    <span className="ink-border mr-1.5 inline-grid h-6 w-6 place-items-center rounded-full bg-accent font-display text-sm short:h-5 short:w-5 short:text-xs">
                      {c.id}
                    </span>
                    {c.text}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {step?.kind === 'press' && (
            <>
              <p
                className="font-display text-[30px] leading-none text-navy short:text-[22px]"
                aria-live="polite"
              >
                {presses} / {step.count}
              </p>
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={press}
                className="ink-border min-h-14 touch-manipulation select-none rounded-2xl bg-accent px-4 font-display text-[22px] text-navy shadow-pop short:min-h-10 short:text-lg"
              >
                👋 {step.button}
              </motion.button>
            </>
          )}
          {tip && (
            <motion.p
              key={tip.text}
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'text-[14px] font-semibold leading-snug short:text-[11.5px] short:leading-tight',
                tip.ok ? 'text-success-dark' : 'text-primary-dark',
              )}
            >
              {tip.ok ? '✓' : '⚡'} {tip.text}
            </motion.p>
          )}
        </div>
      </div>
      {done && (
        <Button size="lg" block variant="green" onClick={onDone}>
          Tiếp tục ▸
        </Button>
      )}
    </div>
  );
}
