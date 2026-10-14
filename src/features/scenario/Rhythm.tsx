import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ProgressBar } from '../../components/ProgressBar';
import { cn } from '../../lib/cn';
import { playSound } from '../../lib/sound';
import { bpmFromTaps, evaluateRhythm, type StepAnswer } from './engine';
import type { Step } from './types';

type RhythmProps = {
  step: Step;
  answer: StepAnswer | null;
  onAnswer: (answer: StepAnswer) => void;
};

const LIVE_WINDOW = 5; // number of recent taps used for the live BPM readout

export function RhythmStep({ step, answer, onAnswer }: RhythmProps) {
  const rhythm = step.rhythm ?? { minBpm: 100, maxBpm: 120, durationSec: 15 };
  const guideBpm = Math.round((rhythm.minBpm + rhythm.maxBpm) / 2);
  const resolved = answer !== null;

  const tapsRef = useRef<number[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [liveBpm, setLiveBpm] = useState(0);
  const [finalBpm, setFinalBpm] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [metronome, setMetronome] = useState(true);
  const started = tapCount > 0;

  // Metronome click at the guide tempo to help the player keep pace.
  useEffect(() => {
    if (resolved || !metronome) return;
    const id = window.setInterval(() => playSound('tick'), 60_000 / guideBpm);
    return () => window.clearInterval(id);
  }, [resolved, metronome, guideBpm]);

  // The round starts on the first tap and lasts `durationSec`.
  useEffect(() => {
    if (!started || resolved) return;
    const startedAt = performance.now();
    const id = window.setInterval(() => {
      const sec = (performance.now() - startedAt) / 1000;
      setElapsed(Math.min(rhythm.durationSec, sec));
      if (sec >= rhythm.durationSec) {
        window.clearInterval(id);
        const bpm = bpmFromTaps(tapsRef.current);
        setFinalBpm(Math.round(bpm));
        onAnswer(evaluateRhythm(step, bpm));
      }
    }, 100);
    return () => window.clearInterval(id);
    // `onAnswer` and `step` are stable for the lifetime of this step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, resolved]);

  const tap = () => {
    if (resolved) return;
    tapsRef.current.push(performance.now());
    setTapCount(tapsRef.current.length);
    setLiveBpm(Math.round(bpmFromTaps(tapsRef.current.slice(-LIVE_WINDOW))));
  };

  const shownBpm = resolved ? finalBpm : liveBpm;
  const inRange = shownBpm >= rhythm.minBpm && shownBpm <= rhythm.maxBpm;
  const hasReading = shownBpm > 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <ProgressBar
        className="w-full"
        value={elapsed}
        max={rhythm.durationSec}
        label={
          started ? `Còn ${Math.ceil(rhythm.durationSec - elapsed)} giây` : 'Chạm nút để bắt đầu'
        }
        tone="navy"
      />

      <div
        aria-live="off"
        className={cn(
          'w-full rounded-card border-2 bg-white p-3 text-center shadow-soft',
          !hasReading ? 'border-navy/10' : inRange ? 'border-success' : 'border-error',
        )}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Nhịp ép hiện tại</p>
        <p
          className={cn(
            'font-display text-5xl font-bold tabular-nums',
            !hasReading ? 'text-navy/30' : inRange ? 'text-success-dark' : 'text-primary-dark',
          )}
        >
          {hasReading ? shownBpm : '--'}
          <span className="ml-1 text-lg">lần/phút</span>
        </p>
        <p className="text-sm font-semibold text-navy">
          {!hasReading
            ? `Mục tiêu: ${rhythm.minBpm}–${rhythm.maxBpm} lần/phút`
            : inRange
              ? '✓ Đúng nhịp – giữ vững!'
              : shownBpm < rhythm.minBpm
                ? 'Chậm quá – ép nhanh hơn!'
                : 'Nhanh quá – chậm lại một chút!'}
        </p>
      </div>

      <div className="relative grid h-48 w-48 place-items-center">
        {!resolved && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full border-4 border-primary/40"
            animate={{ scale: [1, 1.14, 1], opacity: [0.9, 0.2, 0.9] }}
            transition={{ duration: 60 / guideBpm, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <motion.button
          type="button"
          disabled={resolved}
          onPointerDown={(e) => {
            e.preventDefault();
            tap();
          }}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) tap();
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Ép tim – chạm theo nhịp"
          className="relative grid h-40 w-40 touch-manipulation select-none place-items-center rounded-full bg-primary-dark text-white shadow-[0_8px_0_0_#8e1c1c] disabled:opacity-50"
        >
          <span className="pointer-events-none flex flex-col items-center font-display font-bold">
            <span aria-hidden className="text-5xl leading-none">
              ♥
            </span>
            <span className="text-xl">ÉP!</span>
            <span className="text-sm font-semibold opacity-90">{tapCount} lần</span>
          </span>
        </motion.button>
      </div>

      <button
        type="button"
        onClick={() => setMetronome((m) => !m)}
        aria-pressed={metronome}
        className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-navy shadow-soft"
      >
        🎵 Máy đếm nhịp: {metronome ? 'Bật' : 'Tắt'}
      </button>
    </div>
  );
}
