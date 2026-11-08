import { motion } from 'framer-motion';
import type { InfoCard as InfoCardKind } from './types';

const BEFAST: { letter: string; word: string; vi: string }[] = [
  { letter: 'B', word: 'Balance', vi: 'Thăng bằng' },
  { letter: 'E', word: 'Eyes', vi: 'Thị lực' },
  { letter: 'F', word: 'Face', vi: 'Mặt' },
  { letter: 'A', word: 'Arm', vi: 'Tay' },
  { letter: 'S', word: 'Speech', vi: 'Lời nói' },
  { letter: 'T', word: 'Time', vi: 'Gọi 115' },
];

/** Mini infographic under an explanation (B.E.F.A.S.T., call checklist, timeline). */
export function InfoCard({ kind }: { kind: InfoCardKind }) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="ink-border w-full rounded-2xl bg-[#fff1c2] p-2 text-left short:rounded-xl short:p-1"
    >
      {kind === 'befast' && (
        <>
          <ul className="grid grid-cols-6 gap-1">
            {BEFAST.map((b) => (
              <li key={b.letter} className="flex flex-col items-center text-center">
                <span className="ink-border grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-lg text-white short:h-6 short:w-6 short:text-sm">
                  {b.letter}
                </span>
                <span className="mt-0.5 text-[11px] font-semibold leading-tight text-navy short:text-[9px]">
                  {b.word}
                </span>
                <span className="text-[11px] leading-tight text-ink short:text-[9px]">{b.vi}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1 text-center font-display text-[15px] text-primary-dark short:text-[12px]">
            Có dấu hiệu nghi ngờ → gọi 115
          </p>
        </>
      )}
      {kind === 'checklist' && (
        <ul className="grid grid-cols-3 gap-1.5">
          {['Địa chỉ', 'Dấu hiệu', 'Tình trạng'].map((t) => (
            <li
              key={t}
              className="flex items-center justify-center gap-1 rounded-xl bg-paper px-1 py-1 font-display text-[15px] text-success-dark short:text-[12px]"
            >
              ✓ {t}
            </li>
          ))}
        </ul>
      )}
      {kind === 'timeline' && (
        <p className="flex flex-wrap items-center justify-center gap-x-2 font-display text-[14px] leading-tight text-navy short:text-[11px]">
          <span>
            <b className="text-success-dark">8:20</b> còn bình thường{' '}
            <i className="text-[11px] text-muted">(last known well)</i>
          </span>
          <span aria-hidden className="text-primary-dark">
            ➜
          </span>
          <span>
            <b className="text-primary-dark">~8:25</b> phát hiện triệu chứng
          </span>
        </p>
      )}
    </motion.div>
  );
}
