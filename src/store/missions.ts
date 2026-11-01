import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MISSIONS, type DayActivity, type MissionId } from '../features/missions/missionLogic';
import { toDateKey, type DateKey } from '../lib/date';

type MissionState = {
  activity: Record<DateKey, DayActivity>;
  claimed: Record<DateKey, MissionId[]>;
  /** Total missions ever claimed (feeds the player level). */
  totalClaimed: number;
  markActivity: (key: keyof DayActivity, day?: DateKey) => void;
  /** Marks a mission as claimed; returns the reward (0 if it was already claimed). */
  claim: (id: MissionId, day?: DateKey) => number;
  reset: () => void;
};

const initial = { activity: {}, claimed: {}, totalClaimed: 0 };

export const useMissionStore = create<MissionState>()(
  persist(
    (set, get) => ({
      ...initial,
      markActivity: (key, day = toDateKey()) =>
        set((s) => ({
          activity: { ...s.activity, [day]: { ...s.activity[day], [key]: true } },
        })),
      claim: (id, day = toDateKey()) => {
        const done = get().claimed[day] ?? [];
        if (done.includes(id)) return 0;
        set((s) => ({
          claimed: { ...s.claimed, [day]: [...done, id] },
          totalClaimed: s.totalClaimed + 1,
        }));
        return MISSIONS.find((m) => m.id === id)?.reward ?? 0;
      },
      reset: () => set(initial),
    }),
    { name: 'lifesim-missions' },
  ),
);
