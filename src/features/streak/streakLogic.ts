import { diffDays, type DateKey } from '../../lib/date';
import { pickN, rngFromString } from '../../lib/seededRandom';
import type { Topic } from '../../data/topics';

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
/** Tries per day; the second try gets a fresh set of questions. */
export const DAILY_ATTEMPTS = 2;
/** Right answers needed (out of DAILY_QUESTION_COUNT) to pass and extend the streak. */
export const DAILY_PASS_MIN = 2;
export const STREAK_MILESTONES = [3, 7, 14] as const;
/** Bandage gift unlocked at each streak milestone. */
export const STREAK_GIFTS: Record<(typeof STREAK_MILESTONES)[number], number> = {
  3: 30,
  7: 70,
  14: 150,
};

export function passedDaily(correct: number): boolean {
  return correct >= DAILY_PASS_MIN;
}

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

/**
 * Same day → same questions for everyone on that day. Attempt 2 draws from the
 * questions not used in attempt 1, so a retry is not just a replay of known answers.
 */
export function pickDailyQuestions(
  pool: readonly DailyQuestion[],
  dateKey: DateKey,
  attempt: number = 1,
  count: number = DAILY_QUESTION_COUNT,
): DailyQuestion[] {
  const first = pickN(pool, count, rngFromString(`daily|${dateKey}`));
  if (attempt <= 1) return first;
  const used = new Set(first.map((q) => q.id));
  const rest = pool.filter((q) => !used.has(q.id));
  return pickN(
    rest.length >= count ? rest : pool,
    count,
    rngFromString(`daily|${dateKey}|${attempt}`),
  );
}

export function earnedMilestones(bestStreak: number): number[] {
  return STREAK_MILESTONES.filter((m) => bestStreak >= m);
}
