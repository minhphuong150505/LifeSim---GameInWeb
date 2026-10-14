import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Countdown in seconds. Ticks while `running` is true and calls `onExpire` once at zero.
 * Remount the owning component (via `key`) to restart it.
 */
export function useCountdown(totalSec: number, running: boolean, onExpire: () => void) {
  const [left, setLeft] = useState(totalSec);
  const leftRef = useRef(totalSec);
  const expireRef = useRef(onExpire);

  useEffect(() => {
    expireRef.current = onExpire;
  });

  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      leftRef.current = Math.max(0, leftRef.current - (now - last) / 1000);
      last = now;
      setLeft(leftRef.current);
      if (leftRef.current <= 0) {
        window.clearInterval(id);
        expireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [running]);

  const getLeft = useCallback(() => leftRef.current, []);
  return { left, getLeft };
}
