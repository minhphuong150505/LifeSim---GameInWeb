/**
 * Scoring formula (mirrors the leaderboard criteria in the proposal):
 * accuracy × 50% + decision quality × 30% + time efficiency × 20%, minus 5% per hint.
 */
export type ScoreInput = {
  correctCount: number;
  totalCount: number;
  pointsEarned: number;
  pointsMax: number;
  timeLeftSec: number;
  timeTotalSec: number;
  hintsUsed: number;
};

export type ScoreResult = {
  score: number; // 0–1000
  stars: 1 | 2 | 3;
  accuracy: number; // 0–1
  quality: number; // 0–1
  timeEfficiency: number; // 0–1
  hintPenalty: number; // 0–1
};

export const MAX_SCORE = 1000;
export const HINT_PENALTY = 0.05;
export const WEIGHTS = { accuracy: 0.5, quality: 0.3, time: 0.2 } as const;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ratio = (a: number, b: number) => (b > 0 ? clamp01(a / b) : 0);

export function starsForScore(score: number): 1 | 2 | 3 {
  if (score >= 800) return 3;
  if (score >= 550) return 2;
  return 1;
}

export function computeScore(input: ScoreInput): ScoreResult {
  const accuracy = ratio(input.correctCount, input.totalCount);
  const quality = ratio(input.pointsEarned, input.pointsMax);
  const timeEfficiency = ratio(input.timeLeftSec, input.timeTotalSec);
  const hintPenalty = clamp01(Math.max(0, input.hintsUsed) * HINT_PENALTY);
  const base =
    accuracy * WEIGHTS.accuracy + quality * WEIGHTS.quality + timeEfficiency * WEIGHTS.time;
  const score = Math.round(MAX_SCORE * base * (1 - hintPenalty));
  return { score, stars: starsForScore(score), accuracy, quality, timeEfficiency, hintPenalty };
}
