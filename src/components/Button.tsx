import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../lib/cn';
import { playSound } from '../lib/sound';

type Variant = 'primary' | 'secondary' | 'navy' | 'ghost';
type Size = 'md' | 'lg';

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  silent?: boolean;
  children: React.ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary-dark text-white shadow-pop',
  secondary: 'bg-white text-navy border-2 border-navy/15 shadow-pop',
  navy: 'bg-navy text-white shadow-pop',
  ghost: 'bg-transparent text-navy underline-offset-4',
};

const SIZES: Record<Size, string> = {
  md: 'min-h-11 px-4 text-base',
  lg: 'min-h-14 px-6 text-xl',
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
        'inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold',
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
