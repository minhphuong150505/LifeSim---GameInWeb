import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { ProgressBar } from '../../components/ProgressBar';
import { resolveScene } from '../../data/assets';
import { playSound } from '../../lib/sound';
import { hasAllRequiredClues, nextHintClueId, type EngineAction, type EngineState } from './engine';
import type { Clue, Scenario } from './types';

type ObserveProps = {
  scenario: Scenario;
  state: EngineState;
  dispatch: React.Dispatch<EngineAction>;
};

type MissMark = { id: number; x: number; y: number };

export function Observe({ scenario, state, dispatch }: ObserveProps) {
  const [activeClueId, setActiveClueId] = useState<string | null>(null);
  const [misses, setMisses] = useState<MissMark[]>([]);

  const found = (id: string) => state.foundClueIds.includes(id);
  const requiredFound = scenario.requiredClueIds.filter(found).length;
  const ready = hasAllRequiredClues(scenario, state.foundClueIds);
  const activeClue = scenario.clues.find((c) => c.id === activeClueId);
  const hintTarget = nextHintClueId(scenario, state.foundClueIds);

  const tapClue = (clue: Clue) => {
    if (!found(clue.id)) {
      dispatch({ type: 'FIND_CLUE', clueId: clue.id });
      playSound('found');
    }
    setActiveClueId(clue.id);
  };

  const tapBackground = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mark = {
      id: Date.now(),
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    setMisses((m) => [...m.slice(-3), mark]);
    dispatch({ type: 'MISS_TAP' });
  };

  const useHint = () => {
    if (!hintTarget) return;
    dispatch({ type: 'USE_HINT' });
    setActiveClueId(hintTarget);
    playSound('found');
  };

  return (
    <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
      <ProgressBar
        value={requiredFound}
        max={scenario.requiredClueIds.length}
        label={`Đã tìm ${requiredFound}/${scenario.requiredClueIds.length} manh mối`}
        tone="accent"
      />

      {/* Scene: hotspots are positioned in % so they scale with the image. */}
      <div
        className="relative aspect-square w-full touch-manipulation select-none overflow-hidden rounded-card bg-white shadow-soft"
        onPointerDown={tapBackground}
      >
        <img
          src={resolveScene(scenario.background)}
          alt={`Hiện trường: ${scenario.location}. Chạm vào những điểm đáng chú ý.`}
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {scenario.clues.map((clue, i) => (
          <button
            key={clue.id}
            type="button"
            aria-label={found(clue.id) ? `Manh mối: ${clue.label}` : `Điểm quan sát ${i + 1}`}
            aria-pressed={found(clue.id)}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => tapClue(clue)}
            className="absolute rounded-full"
            style={{
              left: `${clue.x}%`,
              top: `${clue.y}%`,
              width: `${clue.w}%`,
              height: `${clue.h}%`,
            }}
          >
            {found(clue.id) && (
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-full border-4 border-accent bg-accent/20 shadow-[0_0_0_3px_rgb(255_255_255/0.85)]"
                initial={{ scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              />
            )}
          </button>
        ))}
        <AnimatePresence>
          {misses.map((m) => (
            <motion.span
              key={m.id}
              aria-hidden
              className="pointer-events-none absolute -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-white/90 bg-navy/25"
              style={{ left: `${m.x}%`, top: `${m.y}%` }}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onAnimationComplete={() => setMisses((all) => all.filter((x) => x.id !== m.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      <div aria-live="polite" className="min-h-[92px]">
        <AnimatePresence mode="wait">
          {activeClue ? (
            <motion.div
              key={activeClue.id}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-card border-2 border-accent bg-white p-3 shadow-soft"
            >
              <h3 className="text-lg font-bold text-navy">🔍 {activeClue.label}</h3>
              <p className="text-sm text-ink">{activeClue.description}</p>
            </motion.div>
          ) : (
            <motion.p
              key="tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-card bg-white/70 p-3 text-sm text-muted"
            >
              👆 Chạm vào những chi tiết bất thường trong hình để thu thập manh mối.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex gap-3">
        <Button
          variant="secondary"
          onClick={useHint}
          disabled={!hintTarget}
          silent
          className="shrink-0 px-3"
        >
          💡 Gợi ý −5%
        </Button>
        <Button
          block
          className="whitespace-nowrap px-2"
          disabled={!ready}
          onClick={() => dispatch({ type: 'BEGIN_DECIDE' })}
        >
          {ready ? 'Ra quyết định →' : 'Tìm đủ manh mối'}
        </Button>
      </div>
    </div>
  );
}
