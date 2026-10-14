import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { applyDailyCompletion, type StreakCore } from '../features/streak/streakLogic';
import type { DateKey } from '../lib/date';

export type DailyResult = { correct: number; total: number };

type StreakState = StreakCore & {
  /** Days on which the daily challenge was completed, with the result. */
  results: Record<DateKey, DailyResult>;
  completeDaily: (today: DateKey, result: DailyResult) => void;
  reset: () => void;
};

const initial = { current: 0, best: 0, lastPlayed: null, results: {} };

export const useStreakStore = create<StreakState>()(
  persist(
    (set) => ({
      ...initial,
      completeDaily: (today, result) =>
        set((s) => {
          if (s.results[today]) return s; // one attempt per day
          return { ...applyDailyCompletion(s, today), results: { ...s.results, [today]: result } };
        }),
      reset: () => set(initial),
    }),
    { name: 'lifesim-streak' },
  ),
);
