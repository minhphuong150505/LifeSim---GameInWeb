import { addDays, diffDays, toDateKey, weekKeys, weekdayOf } from './date';
import { computeScore, starsForScore } from './scoring';
import { hashString, mulberry32, pickN, rngFromString, seededShuffle } from './seededRandom';

describe('date helpers', () => {
  it('formats local date keys with zero padding', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
  it('computes day differences across month and year boundaries', () => {
    expect(diffDays('2026-01-31', '2026-02-01')).toBe(1);
    expect(diffDays('2025-12-31', '2026-01-01')).toBe(1);
    expect(diffDays('2024-02-28', '2024-03-01')).toBe(2); // leap year
    expect(diffDays('2026-03-10', '2026-03-08')).toBe(-2);
  });
  it('adds days and builds Monday-first weeks', () => {
    expect(addDays('2025-12-30', 3)).toBe('2026-01-02');
    expect(weekdayOf('2026-10-14')).toBe(3); // Wednesday
    const week = weekKeys('2026-10-14');
    expect(week).toHaveLength(7);
    expect(week[0]).toBe('2026-10-12');
    expect(week[6]).toBe('2026-10-18');
  });
});

describe('seeded random', () => {
  it('is deterministic for the same seed and differs across seeds', () => {
    const a = mulberry32(hashString('x'));
    const b = mulberry32(hashString('x'));
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    expect(rngFromString('x')()).not.toBe(rngFromString('y')());
  });
  it('shuffles without mutating or losing items', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const out = seededShuffle(items, rngFromString('s'));
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...out].sort()).toEqual(items);
    expect(new Set(pickN(items, 3, rngFromString('s'))).size).toBe(3);
  });
});

describe('scoring formula', () => {
  const perfect = {
    correctCount: 5,
    totalCount: 5,
    pointsEarned: 50,
    pointsMax: 50,
    timeLeftSec: 100,
    timeTotalSec: 100,
    hintsUsed: 0,
  };
  it('gives 1000 for a perfect run', () => {
    expect(computeScore(perfect)).toMatchObject({ score: 1000, stars: 3 });
  });
  it('weights accuracy 50%, quality 30%, time 20%', () => {
    expect(computeScore({ ...perfect, timeLeftSec: 0 }).score).toBe(800);
    expect(computeScore({ ...perfect, pointsEarned: 0 }).score).toBe(700);
    expect(computeScore({ ...perfect, correctCount: 0 }).score).toBe(500);
    // 0.6*0.5 + 0.5*0.3 + 0.25*0.2 = 0.5
    expect(
      computeScore({ ...perfect, correctCount: 3, pointsEarned: 25, timeLeftSec: 25 }).score,
    ).toBe(500);
  });
  it('subtracts 5% per hint and never goes negative', () => {
    expect(computeScore({ ...perfect, hintsUsed: 1 }).score).toBe(950);
    expect(computeScore({ ...perfect, hintsUsed: 2 }).score).toBe(900);
    expect(computeScore({ ...perfect, hintsUsed: 99 }).score).toBe(0);
  });
  it('handles empty runs and maps scores to stars', () => {
    expect(computeScore({ ...perfect, totalCount: 0, pointsMax: 0, timeTotalSec: 0 }).score).toBe(
      0,
    );
    expect([starsForScore(0), starsForScore(550), starsForScore(799), starsForScore(800)]).toEqual([
      1, 2, 2, 3,
    ]);
  });
});
