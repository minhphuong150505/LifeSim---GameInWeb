type FsElement = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> | void };
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
};
type LockableOrientation = ScreenOrientation & {
  lock?: (o: 'landscape' | 'any') => Promise<void>;
  unlock?: () => void;
};

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

/** Full screen on phones/tablets (must run inside a tap handler). */
export async function enterFullscreen(): Promise<void> {
  if (!isTouchDevice() || isStandalone()) return;
  try {
    if (!isFullscreen() && fullscreenSupported()) {
      const el = document.documentElement as FsElement;
      if (el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
      else await el.webkitRequestFullscreen?.();
    }
  } catch {
    // Not allowed here – nothing else to do.
  }
}

const orientation = () =>
  typeof screen === 'undefined'
    ? undefined
    : (screen.orientation as LockableOrientation | undefined);

/**
 * On phones/tablets, go full screen and lock to landscape (must run inside a tap handler).
 * Where it isn't allowed the RotateHint overlay and the compact layout cover it.
 */
export async function enterLandscape(): Promise<void> {
  if (!isTouchDevice() || isStandalone()) return;
  await enterFullscreen();
  try {
    await orientation()?.lock?.('landscape');
  } catch {
    // Not allowed here – nothing else to do.
  }
}

/**
 * Reading screens (the handbook) follow the device: release the landscape lock set by
 * `enterLandscape` (browser full screen) or by the manifest (installed app). `lock('any')`
 * is tried first because in an installed app `unlock()` falls back to the manifest's landscape.
 */
export async function allowAnyOrientation(): Promise<void> {
  if (!isTouchDevice()) return;
  const o = orientation();
  try {
    await o?.lock?.('any');
  } catch {
    try {
      o?.unlock?.();
    } catch {
      // No orientation API (e.g. iOS) – the page simply follows the device.
    }
  }
}

/** Back in the game: lock landscape again wherever it can be locked (full screen / installed). */
export async function restoreLandscape(): Promise<void> {
  if (!isTouchDevice() || !(isFullscreen() || isStandalone())) return;
  const o = orientation();
  try {
    await o?.lock?.('landscape');
  } catch {
    try {
      o?.unlock?.();
    } catch {
      // Nothing else to do.
    }
  }
}

/** Routes laid out as a normal responsive page (portrait or landscape), outside the game frame. */
export function isFreeOrientationPath(pathname: string): boolean {
  return /^\/handbook(\/|$)/.test(pathname);
}
