import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
  muted: boolean;
  toggleMuted: () => void;
  reset: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      muted: false,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      reset: () => set({ muted: false }),
    }),
    { name: 'lifesim-settings' },
  ),
);
