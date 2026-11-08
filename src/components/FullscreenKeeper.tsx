import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  allowAnyOrientation,
  enterFullscreen,
  enterLandscape,
  fullscreenSupported,
  isFreeOrientationPath,
  isFullscreen,
  isStandalone,
  isTouchDevice,
  restoreLandscape,
} from '../lib/landscape';
import { useSessionStore } from '../store/session';
import { useSettingsStore } from '../store/settings';

/**
 * "Locks" full screen on phones: if the player leaves full screen (swipe, back gesture),
 * the next tap in the game brings it back. Can be turned off in Settings.
 *
 * Reading routes (the handbook) may rotate freely: entering one releases the landscape lock,
 * leaving it locks landscape again.
 */
export function FullscreenKeeper() {
  const loggedIn = useSessionStore((s) => s.loggedIn);
  const wanted = useSettingsStore((s) => s.fullscreen);
  const free = isFreeOrientationPath(useLocation().pathname);
  const wasFree = useRef(false);

  useEffect(() => {
    if (free) void allowAnyOrientation();
    else if (wasFree.current) void restoreLandscape();
    wasFree.current = free;
  }, [free]);

  useEffect(() => {
    if (!loggedIn || !wanted || !isTouchDevice() || isStandalone() || !fullscreenSupported())
      return;
    // pointerup/touchend count as user activation, which full screen requires.
    const onTap = () => {
      if (isFullscreen()) return;
      if (free) void enterFullscreen().then(allowAnyOrientation);
      else void enterLandscape();
    };
    window.addEventListener('pointerup', onTap, true);
    window.addEventListener('touchend', onTap, true);
    return () => {
      window.removeEventListener('pointerup', onTap, true);
      window.removeEventListener('touchend', onTap, true);
    };
  }, [loggedIn, wanted, free]);

  return null;
}
