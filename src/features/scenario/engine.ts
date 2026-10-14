import type { ScoreInput } from '../../lib/scoring';
import type { Scenario, Step } from './types';

export type Phase = 'INTRO' | 'OBSERVE' | 'DECIDE' | 'RESULT';

export type StepAnswer = {
  stepId: string;
  correct: boolean;
  points: number;
  maxPoints: number;
  /** Seconds left on the step timer; rhythm steps are untimed and report 0/0. */
  timeLeftSec: number;
  timeLimitSec: number;
  feedback: string;
};

export type EngineState = {
  phase: Phase;
  foundClueIds: string[];
  hintsUsed: number;
  missedTaps: number;
  stepIndex: number;
  answers: StepAnswer[];
  /** True while the feedback for the current step is on screen. */
  stepResolved: boolean;
};

export type EngineAction =
  | { type: 'START' }
  | { type: 'FIND_CLUE'; clueId: string }
  | { type: 'MISS_TAP' }
  | { type: 'USE_HINT' }
  | { type: 'BEGIN_DECIDE' }
  | { type: 'ANSWER'; answer: StepAnswer }
  | { type: 'NEXT_STEP' }
  | { type: 'RESTART' };

export const initialEngineState: EngineState = {
  phase: 'INTRO',
  foundClueIds: [],
  hintsUsed: 0,
  missedTaps: 0,
  stepIndex: 0,
  answers: [],
  stepResolved: false,
};

export const ORDER_STEP_POINTS = 10;
export const RHYTHM_STEP_POINTS = 10;
const RHYTHM_NEAR_MISS_BPM = 10;

export function hasAllRequiredClues(scenario: Scenario, foundClueIds: string[]): boolean {
  return scenario.requiredClueIds.every((id) => foundClueIds.includes(id));
}

/** Next clue a hint should reveal: required clues first, in authoring order. */
export function nextHintClueId(scenario: Scenario, foundClueIds: string[]): string | null {
  return scenario.requiredClueIds.find((id) => !foundClueIds.includes(id)) ?? null;
}

export function createEngineReducer(scenario: Scenario) {
  const clueIds = new Set(scenario.clues.map((c) => c.id));

  return function reducer(state: EngineState, action: EngineAction): EngineState {
    switch (action.type) {
      case 'START':
        return state.phase === 'INTRO' ? { ...state, phase: 'OBSERVE' } : state;

      case 'FIND_CLUE':
        if (state.phase !== 'OBSERVE') return state;
        if (!clueIds.has(action.clueId) || state.foundClueIds.includes(action.clueId)) return state;
        return { ...state, foundClueIds: [...state.foundClueIds, action.clueId] };

      case 'MISS_TAP':
        return state.phase === 'OBSERVE' ? { ...state, missedTaps: state.missedTaps + 1 } : state;

      case 'USE_HINT': {
        if (state.phase !== 'OBSERVE') return state;
        const clueId = nextHintClueId(scenario, state.foundClueIds);
        if (!clueId) return state;
        return {
          ...state,
          hintsUsed: state.hintsUsed + 1,
          foundClueIds: [...state.foundClueIds, clueId],
        };
      }

      case 'BEGIN_DECIDE':
        if (state.phase !== 'OBSERVE' || !hasAllRequiredClues(scenario, state.foundClueIds)) {
          return state;
        }
        return scenario.steps.length === 0
          ? { ...state, phase: 'RESULT' }
          : { ...state, phase: 'DECIDE', stepIndex: 0, stepResolved: false };

      case 'ANSWER': {
        if (state.phase !== 'DECIDE' || state.stepResolved) return state;
        const step = scenario.steps[state.stepIndex];
        if (!step || step.id !== action.answer.stepId) return state;
        return { ...state, answers: [...state.answers, action.answer], stepResolved: true };
      }

      case 'NEXT_STEP': {
        if (state.phase !== 'DECIDE' || !state.stepResolved) return state;
        const isLast = state.stepIndex >= scenario.steps.length - 1;
        return isLast
          ? { ...state, phase: 'RESULT' }
          : { ...state, stepIndex: state.stepIndex + 1, stepResolved: false };
      }

      case 'RESTART':
        return initialEngineState;
    }
  };
}

// ---------- Step evaluation (pure) ----------

export function maxPointsOf(step: Step): number {
  if (step.type === 'single') return Math.max(0, ...(step.options ?? []).map((o) => o.points));
  return step.type === 'order' ? ORDER_STEP_POINTS : RHYTHM_STEP_POINTS;
}

/** `optionId === null` means the timer ran out. */
export function evaluateSingle(
  step: Step,
  optionId: string | null,
  timeLeftSec: number,
): StepAnswer {
  const option = (step.options ?? []).find((o) => o.id === optionId);
  const best = (step.options ?? []).find((o) => o.correct);
  return {
    stepId: step.id,
    correct: option?.correct ?? false,
    points: option?.points ?? 0,
    maxPoints: maxPointsOf(step),
    timeLeftSec: option?.correct ? Math.max(0, timeLeftSec) : 0,
    timeLimitSec: step.timeLimitSec,
    feedback:
      option?.feedback ??
      `Hết giờ! Đáp án đúng: ${best?.text ?? '—'}. ${best?.feedback ?? ''}`.trim(),
  };
}

export function evaluateOrder(step: Step, order: string[], timeLeftSec: number): StepAnswer {
  const target = step.correctOrder ?? [];
  const inPlace = target.filter((id, i) => order[i] === id).length;
  const correct = target.length > 0 && inPlace === target.length && order.length === target.length;
  const items = step.orderItems ?? [];
  const textOf = (id: string) => items.find((it) => it.id === id)?.text ?? id;
  const answerKey = target.map((id, i) => `${i + 1}. ${textOf(id)}`).join(' → ');
  return {
    stepId: step.id,
    correct,
    points: target.length ? Math.round((ORDER_STEP_POINTS * inPlace) / target.length) : 0,
    maxPoints: ORDER_STEP_POINTS,
    timeLeftSec: correct ? Math.max(0, timeLeftSec) : 0,
    timeLimitSec: step.timeLimitSec,
    feedback: `${correct ? '' : `Thứ tự đúng: ${answerKey}. `}${step.explanation ?? ''}`.trim(),
  };
}

/** Average BPM from tap timestamps (ms). Needs at least 2 taps. */
export function bpmFromTaps(tapTimesMs: number[]): number {
  if (tapTimesMs.length < 2) return 0;
  const first = tapTimesMs[0] as number;
  const last = tapTimesMs[tapTimesMs.length - 1] as number;
  if (last <= first) return 0;
  return ((tapTimesMs.length - 1) / (last - first)) * 60_000;
}

export function evaluateRhythm(step: Step, bpm: number): StepAnswer {
  const { minBpm, maxBpm } = step.rhythm ?? { minBpm: 100, maxBpm: 120 };
  const rounded = Math.round(bpm);
  const correct = rounded >= minBpm && rounded <= maxBpm;
  const near = rounded >= minBpm - RHYTHM_NEAR_MISS_BPM && rounded <= maxBpm + RHYTHM_NEAR_MISS_BPM;
  const verdict = correct
    ? `Nhịp của bạn: ${rounded} lần/phút – đúng chuẩn!`
    : rounded < minBpm
      ? `Nhịp của bạn: ${rounded} lần/phút – hơi chậm, cần ${minBpm}–${maxBpm} lần/phút.`
      : `Nhịp của bạn: ${rounded} lần/phút – hơi nhanh, cần ${minBpm}–${maxBpm} lần/phút.`;
  return {
    stepId: step.id,
    correct,
    points: correct ? RHYTHM_STEP_POINTS : near ? RHYTHM_STEP_POINTS / 2 : 0,
    maxPoints: RHYTHM_STEP_POINTS,
    timeLeftSec: 0,
    timeLimitSec: 0,
    feedback: `${verdict} ${step.explanation ?? ''}`.trim(),
  };
}

/** Collapses a finished run into the inputs of the scoring formula. */
export function summarizeRun(state: EngineState): ScoreInput {
  const sum = (pick: (a: StepAnswer) => number) => state.answers.reduce((n, a) => n + pick(a), 0);
  return {
    correctCount: state.answers.filter((a) => a.correct).length,
    totalCount: state.answers.length,
    pointsEarned: sum((a) => a.points),
    pointsMax: sum((a) => a.maxPoints),
    timeLeftSec: sum((a) => a.timeLeftSec),
    timeTotalSec: sum((a) => a.timeLimitSec),
    hintsUsed: state.hintsUsed,
  };
}
