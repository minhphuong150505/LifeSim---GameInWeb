import { AnimatePresence, motion } from 'framer-motion';
import { C, INK } from '../../art/ink';

/** Jagged bolt from the top of the screen down to the ground (viewBox 120×400). */
const BOLT =
  'M58 0 L92 0 L70 120 L104 120 L44 260 L72 260 L20 400 L40 238 L10 238 L38 132 L8 132 Z';

/**
 * Wrong-answer feedback: a huge lightning bolt drops from the sky, the screen flashes and
 * shakes. Re-triggers every time `strike` changes (0 = never struck).
 */
export function LightningStrike({ strike }: { strike: number }) {
  return (
    <AnimatePresence>
      {strike > 0 && (
        <motion.div
          key={strike}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[1400] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.45, delay: 0.65 }}
        >
          {/* sky darkens, then a white flash on impact */}
          <motion.div
            className="absolute inset-0 bg-navy"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0.25] }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute inset-0 bg-[#fffbe0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.85, 0, 0.5, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 0.38, 0.55, 0.62, 1] }}
          />
          <motion.svg
            viewBox="0 0 120 400"
            preserveAspectRatio="xMidYMax meet"
            className="absolute left-1/2 top-0 h-[88%] w-[220px] -translate-x-1/2"
            initial={{ y: '-105%' }}
            animate={{ y: '0%', x: [0, -6, 6, -4, 4, 0] }}
            transition={{
              y: { duration: 0.18, ease: 'easeIn' },
              x: { duration: 0.4, delay: 0.18 },
            }}
          >
            <path d={BOLT} fill="#fff6a8" opacity={0.6} transform="translate(-6 0) scale(1.1 1)" />
            <path d={BOLT} fill={C.yellow} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
            <path d="M64 12 L78 12 L60 120" fill="none" stroke="#fffdf0" strokeWidth={5} />
          </motion.svg>
          {/* impact burst at the bottom of the bolt */}
          <motion.div
            className="absolute bottom-[8%] left-1/2 h-24 w-56 -translate-x-1/2 rounded-[50%] bg-accent/70"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 1.8], opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.6, delay: 0.16 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
