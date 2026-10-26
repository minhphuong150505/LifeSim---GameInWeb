import type { RoundRecord } from '../../store/progress';
import type { SimRound } from './types';

/** A round opens once the previous round (in play order) has been cleared. */
export function isRoundUnlocked(
  rounds: readonly SimRound[],
  records: Record<string, RoundRecord>,
  roundId: string,
): boolean {
  const i = rounds.findIndex((r) => r.id === roundId);
  if (i < 0) return false;
  const prev = rounds[i - 1];
  return i === 0 || (prev !== undefined && (records[prev.id]?.wins ?? 0) > 0);
}

/** First round not cleared yet (the "Chơi ngay" target), or the first round once all are done. */
export function nextRoundToPlay(
  rounds: readonly SimRound[],
  records: Record<string, RoundRecord>,
): SimRound | undefined {
  return rounds.find((r) => (records[r.id]?.wins ?? 0) === 0) ?? rounds[0];
}
