import { diffDays, type DateKey } from '../../lib/date';
import { pickN, rngFromString } from '../../lib/seededRandom';
import type { Topic } from '../scenario/types';

export type DailyQuestion = {
  id: string;
  topic: Topic;
  question: string;
  options: { id: string; text: string }[];
  correctId: string;
  explanation: string;
};

export type StreakCore = {
  current: number;
  best: number;
  lastPlayed: DateKey | null;
};

export const DAILY_QUESTION_COUNT = 3;
export const DAILY_TIME_LIMIT_SEC = 10;
export const STREAK_MILESTONES = [3, 7, 14] as const;

/**
 * Streak rule, based on the device's local day:
 * last play was yesterday → +1; today → unchanged; anything else → reset to 1.
 */
export function applyDailyCompletion(state: StreakCore, today: DateKey): StreakCore {
  if (state.lastPlayed === today) return state;
  const continued = state.lastPlayed !== null && diffDays(state.lastPlayed, today) === 1;
  const current = continued ? state.current + 1 : 1;
  return { current, best: Math.max(state.best, current), lastPlayed: today };
}

/** Streak to display: a streak that was not extended yesterday or today is already broken. */
export function activeStreak(state: StreakCore, today: DateKey): number {
  if (!state.lastPlayed) return 0;
  const gap = diffDays(state.lastPlayed, today);
  return gap === 0 || gap === 1 ? state.current : 0;
}

/** Same day → same questions for everyone on that day. */
export function pickDailyQuestions(
  pool: readonly DailyQuestion[],
  dateKey: DateKey,
  count: number = DAILY_QUESTION_COUNT,
): DailyQuestion[] {
  return pickN(pool, count, rngFromString(`daily|${dateKey}`));
}

export function earnedMilestones(bestStreak: number): number[] {
  return STREAK_MILESTONES.filter((m) => bestStreak >= m);
}
