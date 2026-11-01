type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
};
type LockableOrientation = ScreenOrientation & { lock?: (o: 'landscape') => Promise<void> };

const media = (q: string) =>
  typeof window !== 'undefined' && Boolean(window.matchMedia?.(q).matches);

export const isTouchDevice = () => media('(pointer: coarse)');

/** Running as an installed home-screen app (already full screen). */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    media('(display-mode: fullscreen)') ||
    media('(display-mode: standalone)') ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** The browser lets a page go full screen (Android, iPad – not iPhone Safari). */
export function fullscreenSupported(): boolean {
  if (typeof document === 'undefined') return false;
  const d = document as FsDocument;
  return Boolean(d.fullscreenEnabled || d.webkitFullscreenEnabled);
}

export function isFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  const d = document as FsDocument;
  return Boolean(d.fullscreenElement || d.webkitFullscreenElement);
}

/** iPhone Safari can only be full screen when the game is added to the home screen. */
export function needsInstallForFullscreen(): boolean {
  return isTouchDevice() && !isStandalone() && !fullscreenSupported();
}

/**
 * On phones/tablets, go full screen and lock to landscape (must run inside a tap handler).
 * Where it isn't allowed the RotateHint overlay and the compact layout cover it.
 */
export async function enterLandscape(): Promise<void> {
  if (!isTouchDevice() || isStandalone()) return;
  try {
    if (!isFullscreen() && fullscreenSupported()) {
      const el = document.documentElement as FsElement;
      if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
      else await el.webkitRequestFullscreen?.();
    }
    await (screen.orientation as LockableOrientation | undefined)?.lock?.('landscape');
  } catch {
    // Not allowed here – nothing else to do.
  }
}
