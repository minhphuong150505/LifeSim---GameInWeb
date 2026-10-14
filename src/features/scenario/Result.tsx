import { motion } from 'framer-motion';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Stars } from '../../components/Stars';
import { assets } from '../../data/assets';
import type { ScoreResult } from '../../lib/scoring';
import type { Scenario } from './types';

type ResultProps = {
  scenario: Scenario;
  result: ScoreResult;
  correctCount: number;
  totalCount: number;
  hintsUsed: number;
  elapsedSec: number;
  isNewBest: boolean;
  hasNext: boolean;
  onReplay: () => void;
  onNext: () => void;
};

const formatTime = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, '0')}`;

const HEADLINES = { 3: 'Xuất sắc!', 2: 'Làm tốt lắm!', 1: 'Cần luyện thêm!' } as const;

export function Result({
  scenario,
  result,
  correctCount,
  totalCount,
  hintsUsed,
  elapsedSec,
  isNewBest,
  hasNext,
  onReplay,
  onNext,
}: ResultProps) {
  const happy = result.stars >= 2;
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pb-4">
      <Card tape className="overflow-hidden text-center">
        <div className="flex items-center justify-center gap-2">
          <motion.img
            src={happy ? assets.mascot.happy : assets.mascot.worried}
            alt=""
            aria-hidden
            className="h-28 w-auto"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          />
          <div>
            <h2 className="text-2xl font-bold text-navy">{HEADLINES[result.stars]}</h2>
            <Stars count={result.stars} size="lg" animate />
          </div>
        </div>
        <motion.p
          className="mt-1 font-display text-6xl font-bold tabular-nums text-primary-dark"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          {result.score}
          <span className="ml-1 text-xl text-navy">điểm</span>
        </motion.p>
        {isNewBest && (
          <p className="mx-auto mt-1 w-fit rounded-full bg-accent px-3 py-1 text-sm font-bold text-navy">
            🎉 Kỷ lục mới!
          </p>
        )}

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            [
              'Chính xác',
              `${Math.round(result.accuracy * 100)}%`,
              `${correctCount}/${totalCount} bước`,
            ],
            [
              'Thời gian',
              formatTime(elapsedSec),
              `Tốc độ ${Math.round(result.timeEfficiency * 100)}%`,
            ],
            [
              'Gợi ý',
              String(hintsUsed),
              hintsUsed ? `−${Math.round(result.hintPenalty * 100)}% điểm` : 'Không trừ',
            ],
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-2xl bg-cream p-2">
              <dt className="text-xs font-semibold text-muted">{label}</dt>
              <dd className="font-display text-2xl font-bold text-navy">{value}</dd>
              <dd className="text-[11px] text-muted">{note}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card>
        <h3 className="text-lg font-bold text-navy">📌 Ghi nhớ: {scenario.title}</h3>
        <ul className="mt-2 space-y-2">
          {scenario.takeaways.map((t) => (
            <li key={t} className="flex gap-2 text-sm text-ink">
              <span aria-hidden className="mt-0.5 text-success-dark">
                ✔
              </span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 rounded-xl bg-primary/8 p-2 text-center text-sm font-semibold text-primary-dark">
          Khi khẩn cấp hãy gọi 115.
        </p>
      </Card>

      <div className="mt-auto flex gap-3">
        <Button variant="secondary" onClick={onReplay} className="shrink-0">
          ↻ Chơi lại
        </Button>
        <Button block onClick={onNext}>
          {hasNext ? 'Tình huống tiếp →' : 'Về danh sách'}
        </Button>
      </div>
    </div>
  );
}
