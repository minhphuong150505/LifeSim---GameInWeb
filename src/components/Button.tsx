import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/cn';
import { playSound } from '../lib/sound';

type Variant = 'primary' | 'secondary' | 'navy' | 'ghost' | 'yellow' | 'gray' | 'green';
type Size = 'md' | 'lg';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  silent?: boolean;
  children: React.ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary: 'ink-border bg-primary-dark text-white shadow-pop',
  secondary: 'ink-border bg-paper text-navy shadow-pop',
  navy: 'ink-border bg-navy text-white shadow-pop',
  ghost: 'bg-transparent text-navy underline-offset-4',
  yellow: 'ink-border bg-accent text-navy shadow-pop',
  gray: 'ink-border bg-[#c9c3b4] text-navy shadow-pop',
  green: 'ink-border bg-success-dark text-white shadow-pop',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-11 px-4 text-lg',
  lg: 'min-h-14 px-6 text-[22px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  block,
  silent,
  className,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96, y: 2 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-display leading-tight',
        'transition-opacity disabled:cursor-not-allowed disabled:opacity-45',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      onClick={(e) => {
        if (!silent) playSound('click');
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
