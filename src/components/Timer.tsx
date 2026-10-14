import { cn } from '../lib/cn';

type TimerProps = { leftSec: number; totalSec: number; className?: string };

/** Countdown bar that turns red in the last quarter. */
export function Timer({ leftSec, totalSec, className }: TimerProps) {
  const pct = totalSec > 0 ? Math.max(0, Math.min(100, (leftSec / totalSec) * 100)) : 0;
  const urgent = pct <= 25;
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        role="timer"
        aria-label={`Còn ${Math.ceil(leftSec)} giây`}
        className="h-3 flex-1 overflow-hidden rounded-full bg-navy/10"
      >
        <div
          className={cn('h-full rounded-full', urgent ? 'bg-primary' : 'bg-accent')}
          style={{ width: `${pct}%`, transition: 'width 120ms linear' }}
        />
      </div>
      <span
        aria-hidden
        className={cn(
          'w-10 text-right font-display text-lg font-bold tabular-nums',
          urgent ? 'text-primary-dark' : 'text-navy',
        )}
      >
        {Math.ceil(leftSec)}s
      </span>
    </div>
  );
}
