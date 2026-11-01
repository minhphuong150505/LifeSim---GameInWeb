import { motion } from 'framer-motion';

/** Shown on phones held upright: LifeSim is played in landscape. */
export function RotateHint() {
  return (
    <div
      role="alert"
      className="rotate-hint paper fixed inset-0 z-[3000] place-items-center p-8 text-center"
    >
      <div>
        <motion.svg
          viewBox="0 0 64 64"
          width={110}
          height={110}
          className="mx-auto"
          animate={{ rotate: [0, 0, -90, -90, 0] }}
          transition={{ repeat: Infinity, duration: 2.6, times: [0, 0.2, 0.5, 0.8, 1] }}
          aria-hidden
        >
          <rect
            x={18}
            y={6}
            width={28}
            height={52}
            rx={6}
            fill="#fffaf0"
            stroke="#3b2d26"
            strokeWidth={3.5}
          />
          <rect x={23} y={13} width={18} height={34} rx={2} fill="#cfe9ef" />
          <circle cx={32} cy={52} r={2.5} fill="#3b2d26" />
        </motion.svg>
        <h2 className="mt-4 font-display text-3xl text-navy">Hãy xoay ngang điện thoại</h2>
        <p className="mt-2 text-ink">LifeSim được thiết kế để chơi ở màn hình ngang.</p>
      </div>
    </div>
  );
}
