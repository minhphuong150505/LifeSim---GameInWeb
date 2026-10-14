import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { SoundToggle } from '../components/SoundToggle';
import { assets, resolveScene } from '../data/assets';
import { getScenario, nextScenarioId } from '../data/scenarios';
import { TOPIC_LABELS } from '../data/topics';
import { OrderStep, SingleStep } from '../features/scenario/Decide';
import {
  createEngineReducer,
  initialEngineState,
  summarizeRun,
  type StepAnswer,
} from '../features/scenario/engine';
import { Observe } from '../features/scenario/Observe';
import { Result } from '../features/scenario/Result';
import { RhythmStep } from '../features/scenario/Rhythm';
import type { Scenario } from '../features/scenario/types';
import { cn } from '../lib/cn';
import { toDateKey } from '../lib/date';
import { computeScore } from '../lib/scoring';
import { playSound, vibrate } from '../lib/sound';
import { useProgressStore } from '../store/progress';

const PHASE_LABELS = {
  INTRO: 'Giới thiệu',
  OBSERVE: 'Quan sát',
  DECIDE: 'Quyết định',
  RESULT: 'Kết quả',
};
const PHASES = Object.keys(PHASE_LABELS) as (keyof typeof PHASE_LABELS)[];

export function Play() {
  const { id } = useParams();
  const scenario = getScenario(id);
  if (!scenario) return <Navigate to="/scenarios" replace />;
  // Keyed so navigating to another scenario starts from a clean state.
  return <PlaySession key={scenario.id} scenario={scenario} />;
}

function PlaySession({ scenario }: { scenario: Scenario }) {
  const navigate = useNavigate();
  const reducer = useMemo(() => createEngineReducer(scenario), [scenario]);
  const [state, dispatch] = useReducer(reducer, initialEngineState);
  const recordScenario = useProgressStore((s) => s.recordScenario);
  const startedAtRef = useRef(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  const step = scenario.steps[state.stepIndex];
  const answer: StepAnswer | null =
    state.phase === 'DECIDE' && state.stepResolved
      ? (state.answers[state.stepIndex] ?? null)
      : null;
  const summary = useMemo(() => summarizeRun(state), [state]);
  const result = useMemo(() => computeScore(summary), [summary]);
  const nextId = nextScenarioId(scenario.id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.phase, state.stepIndex]);

  const start = () => {
    startedAtRef.current = Date.now();
    dispatch({ type: 'START' });
  };

  const handleAnswer = (a: StepAnswer) => {
    dispatch({ type: 'ANSWER', answer: a });
    if (a.correct) {
      playSound('correct');
    } else {
      playSound('wrong');
      vibrate(120);
    }
  };

  const handleNext = () => {
    const isLast = state.stepIndex >= scenario.steps.length - 1;
    if (isLast) {
      // All answers are in: persist the run before showing the result screen.
      const previousBest = useProgressStore.getState().scenarios[scenario.id]?.bestScore ?? -1;
      setIsNewBest(previousBest >= 0 && result.score > previousBest);
      setElapsedSec((Date.now() - startedAtRef.current) / 1000);
      recordScenario({
        scenarioId: scenario.id,
        topic: scenario.topic,
        score: result.score,
        stars: result.stars,
        correct: summary.correctCount,
        total: summary.totalCount,
        date: toDateKey(),
      });
      playSound('win');
    }
    dispatch({ type: 'NEXT_STEP' });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="safe-top flex items-center gap-2 px-3 pb-2">
        <button
          type="button"
          onClick={() => navigate('/scenarios')}
          aria-label="Thoát tình huống"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl text-navy shadow-soft"
        >
          ✕
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold leading-tight text-navy">
            {scenario.title}
          </p>
          <ol className="flex items-center gap-1" aria-label="Tiến trình">
            {PHASES.map((p) => (
              <li
                key={p}
                aria-current={state.phase === p ? 'step' : undefined}
                className={cn(
                  'whitespace-nowrap rounded-full text-[11px] font-semibold',
                  state.phase === p ? 'bg-navy px-2 py-0.5 text-white' : 'h-2 w-5 bg-navy/15',
                )}
              >
                {state.phase === p ? (
                  PHASE_LABELS[p]
                ) : (
                  <span className="sr-only">{PHASE_LABELS[p]}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
        <SoundToggle className="shrink-0" />
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={state.phase === 'DECIDE' ? `step-${state.stepIndex}` : state.phase}
          className="flex flex-1 flex-col"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          {state.phase === 'INTRO' && (
            <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
              <div className="relative overflow-hidden rounded-card shadow-soft">
                <img
                  src={resolveScene(scenario.background)}
                  alt=""
                  aria-hidden
                  className="aspect-[4/3] w-full object-cover object-bottom"
                />
                <div className="absolute left-3 top-3 flex gap-1.5">
                  <Badge tone="red" className="bg-white">
                    {TOPIC_LABELS[scenario.topic]}
                  </Badge>
                  <Badge tone="navy" className="bg-white">
                    📍 {scenario.location}
                  </Badge>
                </div>
              </div>
              <Card tape className="flex gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-navy">{scenario.title}</h1>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink">{scenario.intro}</p>
                </div>
                <img
                  src={assets.proposal.characterThinking}
                  alt=""
                  aria-hidden
                  className="h-24 w-auto shrink-0 self-end"
                />
              </Card>
              <ol className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-navy">
                {['🔍 Tìm manh mối', '⏱️ Quyết định nhanh', '⭐ Nhận kết quả'].map((t) => (
                  <li key={t} className="rounded-2xl bg-white p-2 shadow-soft">
                    {t}
                  </li>
                ))}
              </ol>
              <Button size="lg" block className="mt-auto" onClick={start}>
                Bắt đầu quan sát
              </Button>
            </div>
          )}

          {state.phase === 'OBSERVE' && (
            <Observe scenario={scenario} state={state} dispatch={dispatch} />
          )}

          {state.phase === 'DECIDE' && step && (
            <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
              <div>
                <p className="text-sm font-semibold text-muted">
                  Bước {state.stepIndex + 1}/{scenario.steps.length}
                </p>
                <h2 className="text-xl font-bold text-navy">{step.prompt}</h2>
              </div>

              {step.type === 'single' && (
                <SingleStep step={step} answer={answer} onAnswer={handleAnswer} />
              )}
              {step.type === 'order' && (
                <OrderStep step={step} answer={answer} onAnswer={handleAnswer} />
              )}
              {step.type === 'rhythm' && (
                <RhythmStep step={step} answer={answer} onAnswer={handleAnswer} />
              )}

              {answer && (
                <motion.div
                  role="status"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={cn(
                    'mt-auto rounded-card border-2 p-3 shadow-soft',
                    answer.correct ? 'border-success bg-[#EDF7EE]' : 'border-error bg-[#FDECEC]',
                  )}
                >
                  <p
                    className={cn(
                      'font-display text-xl font-bold',
                      answer.correct ? 'text-success-dark' : 'text-primary-dark',
                    )}
                  >
                    {answer.correct ? '✓ ĐÚNG' : '✕ CHƯA ĐÚNG'}
                    <span className="ml-2 text-sm text-navy">
                      +{answer.points}/{answer.maxPoints} điểm quyết định
                    </span>
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{answer.feedback}</p>
                  <Button block className="mt-3" onClick={handleNext}>
                    {state.stepIndex >= scenario.steps.length - 1 ? 'Xem kết quả' : 'Tiếp tục →'}
                  </Button>
                </motion.div>
              )}
            </div>
          )}

          {state.phase === 'RESULT' && (
            <Result
              scenario={scenario}
              result={result}
              correctCount={summary.correctCount}
              totalCount={summary.totalCount}
              hintsUsed={state.hintsUsed}
              elapsedSec={elapsedSec}
              isNewBest={isNewBest}
              hasNext={nextId !== null}
              onReplay={() => dispatch({ type: 'RESTART' })}
              onNext={() => navigate(nextId ? `/play/${nextId}` : '/scenarios')}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
