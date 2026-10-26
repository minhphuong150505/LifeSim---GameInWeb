import { cn } from '../lib/cn';

type Tone = 'red' | 'navy' | 'yellow' | 'green' | 'gray';
const TONES: Record<Tone, string> = {
  red: 'border-primary-dark bg-[#fde3da] text-primary-dark',
  navy: 'border-navy/60 bg-paper text-navy',
  yellow: 'border-navy/60 bg-[#fff1c2] text-navy',
  green: 'border-success-dark bg-[#e3f2d4] text-success-dark',
  gray: 'border-navy/30 bg-black/5 text-muted',
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
        'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
