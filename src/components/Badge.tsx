import { cn } from '../lib/cn';

type Tone = 'red' | 'navy' | 'yellow' | 'green' | 'gray';
const TONES: Record<Tone, string> = {
  red: 'bg-primary/10 text-primary-dark',
  navy: 'bg-navy/10 text-navy',
  yellow: 'bg-accent/25 text-navy',
  green: 'bg-success/15 text-success-dark',
  gray: 'bg-black/5 text-muted',
};

export function Badge({
  tone = 'navy',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
