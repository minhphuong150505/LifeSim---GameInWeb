import { cn } from '../lib/cn';

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  tone?: 'primary' | 'success' | 'accent' | 'navy';
  className?: string;
  showLabel?: boolean;
};

const TONES = {
  primary: 'bg-primary',
  success: 'bg-success',
  accent: 'bg-accent',
  navy: 'bg-navy',
};

export function ProgressBar({
  value,
  max,
  label,
  tone = 'primary',
  className,
  showLabel = true,
}: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={className}>
      {showLabel && <p className="mb-1 text-sm font-semibold text-navy">{label}</p>}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.round(value)}
        className="h-3 w-full overflow-hidden rounded-full bg-navy/10"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-300', TONES[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
