import { useProgressStore } from './progress';
import { useSettingsStore } from './settings';
import { useStreakStore } from './streak';
import { useUserStore } from './user';

/** Wipes every piece of player data stored on this device. */
export function resetAllData(): void {
  useProgressStore.getState().reset();
  useStreakStore.getState().reset();
  useSettingsStore.getState().reset();
  useUserStore.getState().reset();
}
