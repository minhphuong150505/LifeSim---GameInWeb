import { addDays, diffDays, toDateKey, weekKeys, weekdayOf } from './date';
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
