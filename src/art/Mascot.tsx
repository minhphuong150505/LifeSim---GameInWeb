import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../lib/cn';
import { C } from './ink';
import { Person, type ArmPose, type Eyes, type Mouth } from './Person';

export type MascotMood = 'hero' | 'happy' | 'worried' | 'thinking';

const MOODS: Record<MascotMood, { eyes: Eyes; mouth: Mouth; armR: ArmPose; armL: ArmPose }> = {
  hero: { eyes: 'open', mouth: 'grin', armR: 'wave', armL: 'hip' },
  happy: { eyes: 'happy', mouth: 'grin', armR: 'wave', armL: 'wave' },
  worried: { eyes: 'worried', mouth: 'o', armR: 'hold', armL: 'hold' },
  thinking: { eyes: 'open', mouth: 'flat', armR: 'nose', armL: 'hip' },
};

type MascotProps = { mood?: MascotMood; className?: string; interactive?: boolean; title?: string };

/**
 * LifeSim mascot: a young first-aider with a red-cross cap and backpack.
 * `interactive` makes it bob and wave back when tapped.
 */
export function Mascot({ mood = 'hero', className, interactive, title }: MascotProps) {
  const [waves, setWaves] = useState(0);
  const m = waves % 2 === 1 ? MOODS.happy : MOODS[mood];
  const art = (
    <svg viewBox="-55 -150 110 160" className="h-full w-full overflow-visible" aria-hidden>
      <ellipse cx={0} cy={4} rx={36} ry={6} fill={C.woodDark} opacity={0.18} />
      <Person kind="mascot" x={0} y={0} scale={1.08} {...m} />
    </svg>
  );
  if (!interactive) {
    return (
      <div className={className} role={title ? 'img' : undefined} aria-label={title}>
        {art}
      </div>
    );
  }
  return (
    <motion.button
      type="button"
      aria-label={title ?? 'Chạm để mascot vẫy tay'}
      className={cn('block', className)}
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      whileTap={{ scale: 0.94, rotate: -4 }}
      onClick={() => setWaves((w) => w + 1)}
    >
      {art}
    </motion.button>
  );
}
