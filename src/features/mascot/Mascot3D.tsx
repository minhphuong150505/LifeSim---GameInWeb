import { useEffect, useRef, useState } from 'react';
import { assets } from '../../data/assets';
import { cn } from '../../lib/cn';
import type { MascotHandle } from './mascotScene';

type Mascot3DProps = { className?: string; alt?: string };

function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The LifeSim mascot in real-time 3D. A pre-rendered poster shows instantly;
 * three.js loads after first paint and takes over (drag to rotate, tap to wave).
 * Falls back to the poster when WebGL is unavailable.
 */
export function Mascot3D({
  className,
  alt = 'Nhân vật LifeSim đeo balo cứu thương',
}: Mascot3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL()) return;
    let handle: MascotHandle | null = null;
    let cancelled = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = () => {
      import('./mascotScene')
        .then(({ createMascot }) => {
          if (cancelled) return;
          handle = createMascot(host, {
            reducedMotion,
            onReady: () => !cancelled && setReady(true),
            onError: () => undefined, // keep showing the poster
          });
        })
        .catch(() => undefined);
    };
    // Defer the heavy 3D bundle until the page is idle.
    const idle =
      window.requestIdleCallback?.(start, { timeout: 1500 }) ?? window.setTimeout(start, 300);
    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      handle?.dispose();
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      <img
        src={assets.mascot.hero}
        alt={alt}
        width={408}
        height={398}
        fetchPriority="high"
        className={cn(
          'pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-500',
          ready && 'opacity-0',
        )}
      />
      <div
        ref={hostRef}
        title={ready ? 'Kéo để xoay, chạm để vẫy tay' : undefined}
        className={cn(
          'absolute inset-0 cursor-grab transition-opacity duration-500',
          !ready && 'opacity-0',
        )}
      />
    </div>
  );
}
