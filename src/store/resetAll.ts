import { useMissionStore } from './missions';
import { useProgressStore } from './progress';
import { useSessionStore } from './session';
import { useSettingsStore } from './settings';
import { useStationStore } from './station';
import { useStreakStore } from './streak';
import { useUserStore } from './user';
import { useWalletStore } from './wallet';

/** Wipes every piece of player data stored on this device. */
export function resetAllData(): void {
  useProgressStore.getState().reset();
  useStreakStore.getState().reset();
  useSettingsStore.getState().reset();
  useUserStore.getState().reset();
  useWalletStore.getState().reset();
  useMissionStore.getState().reset();
  useStationStore.getState().reset();
  useSessionStore.getState().logout();
}
