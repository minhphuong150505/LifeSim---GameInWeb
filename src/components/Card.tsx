import { cn } from '../lib/cn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & { tape?: boolean };

/** Outlined paper panel; `tape` adds a sticker-tape decoration. */
export function Card({ tape, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn('ink-border relative rounded-card bg-paper p-4 shadow-soft', className)}
      {...rest}
    >
      {tape && (
        <span aria-hidden className="tape absolute -top-2.5 left-5 h-5 w-16 -rotate-6 rounded-sm" />
      )}
      {children}
    </div>
  );
}
