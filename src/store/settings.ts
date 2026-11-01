import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsState = {
  muted: boolean;
  /** Keep the game full screen on phones (re-enters full screen after the next tap). */
  fullscreen: boolean;
  /** The "add to home screen for full screen" tip was dismissed (iPhone Safari). */
  installTipDismissed: boolean;
  toggleMuted: () => void;
  setFullscreen: (on: boolean) => void;
  dismissInstallTip: () => void;
  reset: () => void;
};

const initial = { muted: false, fullscreen: true, installTipDismissed: false };

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initial,
      toggleMuted: () => set((s) => ({ muted: !s.muted })),
      setFullscreen: (on) => set({ fullscreen: on }),
      dismissInstallTip: () => set({ installTipDismissed: true }),
      reset: () => set(initial),
    }),
    { name: 'lifesim-settings' },
  ),
);
