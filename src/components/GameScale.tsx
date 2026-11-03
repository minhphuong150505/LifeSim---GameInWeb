import { useLayoutEffect, useState } from 'react';

/**
 * Reference "design" screen. Every screen is laid out in this coordinate space and then
 * scaled uniformly to the real screen, like a game engine canvas: a phone, an iPad and a
 * desktop all show the same proportions – nothing looks tiny on a big screen or cramped on
 * a small one.
 */
export const DESIGN_H = 520;
export const DESIGN_MIN_W = 880;
const MAX_SCALE = 1.6;

export type UiSize = { scale: number; width: number; height: number };

export function computeUiSize(vw: number, vh: number): UiSize {
  const scale = Math.max(0.3, Math.min(vh / DESIGN_H, vw / DESIGN_MIN_W, MAX_SCALE));
  return { scale, width: vw / scale, height: vh / scale };
}

function readViewport() {
  if (typeof window === 'undefined') return { vw: 1024, vh: 640 };
  // innerHeight follows Safari's collapsing toolbars; visualViewport is not used because
  // pinch-zoom should not relayout the game.
  return { vw: window.innerWidth, vh: window.innerHeight };
}

/**
 * Root frame of the game. Children see a box of `width × height` design pixels (exposed as
 * the CSS variables `--app-w` / `--app-h`); `position: fixed` overlays inside it are
 * contained by the frame (it has a transform) so they scale too.
 */
export function GameScale({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState<UiSize>(() => {
    const { vw, vh } = readViewport();
    return computeUiSize(vw, vh);
  });

  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { vw, vh } = readViewport();
        const next = computeUiSize(vw, vh);
        setSize((prev) =>
          Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5
            ? prev
            : next,
        );
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div
        id="game-frame"
        className="game-frame @container absolute left-0 top-0 origin-top-left overflow-x-hidden overflow-y-auto bg-cream"
        style={
          {
            width: size.width,
            height: size.height,
            transform: `scale(${size.scale})`,
            '--app-w': `${size.width}px`,
            '--app-h': `${size.height}px`,
            '--ui-scale': size.scale,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
