import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

type StarsProps = { count: number; size?: 'sm' | 'lg'; animate?: boolean };

export function Stars({ count, size = 'sm', animate = false }: StarsProps) {
  return (
    <span
      role="img"
      aria-label={`${count} trên 3 sao`}
      className={cn('inline-flex', size === 'lg' ? 'gap-2 text-5xl' : 'gap-0.5 text-lg')}
    >
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          aria-hidden
          initial={animate ? { scale: 0, rotate: -40 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: animate ? 0.25 * n : 0,
            type: 'spring',
            stiffness: 260,
            damping: 14,
          }}
          className={n <= count ? 'text-accent drop-shadow-sm' : 'text-navy/15'}
        >
          ★
        </motion.span>
      ))}
    </span>
  );
}
