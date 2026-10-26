import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  applyDailyCompletion,
  DAILY_ATTEMPTS,
  passedDaily,
  STREAK_GIFTS,
  type StreakCore,
} from '../features/streak/streakLogic';
import type { DateKey } from '../lib/date';

export type DailyResult = {
  /** Best try of the day. */
  correct: number;
  total: number;
  attempts: number;
  passed: boolean;
};

type StreakState = StreakCore & {
  results: Record<DateKey, DailyResult>;
  /** Milestones whose bandage gift was already collected. */
  claimedGifts: number[];
  /** Records one try; a passing try extends the streak. */
  submitAttempt: (today: DateKey, result: { correct: number; total: number }) => void;
  /** Marks a milestone gift as collected; returns the bandages to add (0 if not claimable). */
  claimGift: (milestone: number) => number;
  reset: () => void;
};

const initial = { current: 0, best: 0, lastPlayed: null, results: {}, claimedGifts: [] };

export function attemptsLeft(result: DailyResult | undefined): number {
  if (!result) return DAILY_ATTEMPTS;
  return result.passed ? 0 : Math.max(0, DAILY_ATTEMPTS - result.attempts);
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      ...initial,
      submitAttempt: (today, { correct, total }) =>
        set((s) => {
          const prev = s.results[today];
          if (attemptsLeft(prev) === 0) return s;
          const passed = passedDaily(correct);
          const result: DailyResult = {
            correct: Math.max(prev?.correct ?? 0, correct),
            total,
            attempts: (prev?.attempts ?? 0) + 1,
            passed,
          };
          const results = { ...s.results, [today]: result };
          return passed ? { ...applyDailyCompletion(s, today), results } : { results };
        }),
      claimGift: (milestone) => {
        const gift = STREAK_GIFTS[milestone as keyof typeof STREAK_GIFTS];
        const s = get();
        if (!gift || s.best < milestone || s.claimedGifts.includes(milestone)) return 0;
        set({ claimedGifts: [...s.claimedGifts, milestone] });
        return gift;
      },
      reset: () => set(initial),
    }),
    {
      name: 'lifesim-streak',
      version: 1,
      // v0 kept one result per day without attempts; every stored day was a completed one.
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<StreakState> & {
          results?: Record<DateKey, { correct: number; total: number }>;
        };
        if (version >= 1) return old as StreakState;
        const results = Object.fromEntries(
          Object.entries(old.results ?? {}).map(([day, r]) => [
            day,
            { correct: r.correct, total: r.total, attempts: 1, passed: true },
          ]),
        );
        return { ...initial, ...old, results, claimedGifts: [] } as StreakState;
      },
    },
  ),
);
