import { useLayoutEffect, useRef } from 'react';
import { cn } from '../lib/cn';

const MIN_ZOOM = 0.5;

/**
 * Lays its children out at their natural size and, when they are taller than the space
 * available, shrinks them (CSS `zoom`, which reflows text) until everything fits.
 * Used for in-game pop-ups so nothing scrolls and no text is cut off on short screens.
 */
export function FitContent({
  children,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const fit = () => {
      // Reset first: when the panel's height follows its content (no fixed height), measuring
      // while still zoomed out would read the already-shrunk height and shrink again on every
      // resize – a feedback loop down to MIN_ZOOM.
      inner.style.zoom = '1';
      // Both heights are measured on screen so the game frame's scale cancels out.
      const available = outer.getBoundingClientRect().height;
      if (available <= 0) return;
      let zoom = 1;
      // A few passes: shrinking makes text reflow onto fewer lines.
      for (let i = 0; i < 4; i += 1) {
        const needed = inner.getBoundingClientRect().height;
        if (needed <= available + 0.5) break;
        zoom = Math.max(MIN_ZOOM, (zoom * available) / needed - 0.005);
        inner.style.zoom = String(zoom);
        if (zoom === MIN_ZOOM) break;
      }
    };
    fit();
    if (typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    });
    ro.observe(outer);
    ro.observe(inner);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={outerRef} className={cn('min-h-0 flex-1 overflow-hidden', className)}>
      <div ref={innerRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
