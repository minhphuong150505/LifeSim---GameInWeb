type LockableOrientation = ScreenOrientation & { lock?: (o: 'landscape') => Promise<void> };

/**
 * On phones, go full screen and lock to landscape (must run inside a tap handler).
 * Browsers that don't allow it (e.g. iOS Safari) simply keep the "rotate" hint.
 */
export async function enterLandscape(): Promise<void> {
  if (typeof window === 'undefined' || !window.matchMedia?.('(pointer: coarse)').matches) return;
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {
    // Not supported: the RotateHint overlay covers this case.
  }
}
