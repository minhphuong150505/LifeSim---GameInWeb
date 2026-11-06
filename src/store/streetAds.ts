import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { streetAdsLeft } from '../features/lobby/streetAd';
import { toDateKey } from '../lib/date';

type StreetAdState = {
  day: string;
  count: number;
  left: () => number;
  /** Counts one watched ad; false when today's limit is reached. */
  record: () => boolean;
  reset: () => void;
};

const initial = { day: '', count: 0 };

export const useStreetAdStore = create<StreetAdState>()(
  persist(
    (set, get) => ({
      ...initial,
      left: () => streetAdsLeft(get().day, get().count, toDateKey()),
      record: () => {
        if (get().left() <= 0) return false;
        const today = toDateKey();
        set((s) => ({ day: today, count: s.day === today ? s.count + 1 : 1 }));
        return true;
      },
      reset: () => set(initial),
    }),
    { name: 'lifesim-street-ads' },
  ),
);
