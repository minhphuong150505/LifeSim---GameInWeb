import { useEffect } from 'react';
import {
  enterLandscape,
  fullscreenSupported,
  isFullscreen,
  isStandalone,
  isTouchDevice,
} from '../lib/landscape';
import { useSessionStore } from '../store/session';
import { useSettingsStore } from '../store/settings';

/**
 * "Locks" full screen on phones: if the player leaves full screen (swipe, back gesture),
 * the next tap in the game brings it back. Can be turned off in Settings.
 */
export function FullscreenKeeper() {
  const loggedIn = useSessionStore((s) => s.loggedIn);
  const wanted = useSettingsStore((s) => s.fullscreen);

  useEffect(() => {
    if (!loggedIn || !wanted || !isTouchDevice() || isStandalone() || !fullscreenSupported())
      return;
    // pointerup/touchend count as user activation, which full screen requires.
    const onTap = () => {
      if (!isFullscreen()) void enterLandscape();
    };
    window.addEventListener('pointerup', onTap, true);
    window.addEventListener('touchend', onTap, true);
    return () => {
      window.removeEventListener('pointerup', onTap, true);
      window.removeEventListener('touchend', onTap, true);
    };
  }, [loggedIn, wanted]);

  return null;
}
