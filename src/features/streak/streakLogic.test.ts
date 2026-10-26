import pool from '../../data/dailyPool.json';
import {
  activeStreak,
  applyDailyCompletion,
  earnedMilestones,
  passedDaily,
  pickDailyQuestions,
  type DailyQuestion,
  type StreakCore,
} from './streakLogic';

const questions = pool as DailyQuestion[];
const fresh: StreakCore = { current: 0, best: 0, lastPlayed: null };

describe('streak logic', () => {
  it('starts at 1 on the first play', () => {
    expect(applyDailyCompletion(fresh, '2026-05-10')).toEqual({
      current: 1,
      best: 1,
      lastPlayed: '2026-05-10',
    });
  });
  it('adds 1 when the last play was yesterday', () => {
    const s = applyDailyCompletion({ current: 2, best: 2, lastPlayed: '2026-05-10' }, '2026-05-11');
    expect(s).toMatchObject({ current: 3, best: 3, lastPlayed: '2026-05-11' });
  });
  it('keeps the streak when already played today', () => {
    const state = { current: 4, best: 6, lastPlayed: '2026-05-11' };
    expect(applyDailyCompletion(state, '2026-05-11')).toBe(state);
  });
  it('resets to 1 after a gap of more than one day but keeps the best', () => {
    const s = applyDailyCompletion({ current: 5, best: 5, lastPlayed: '2026-05-10' }, '2026-05-12');
    expect(s).toMatchObject({ current: 1, best: 5 });
  });
  it('continues across month and year boundaries', () => {
    const month = applyDailyCompletion(
      { current: 1, best: 1, lastPlayed: '2026-01-31' },
      '2026-02-01',
    );
    expect(month.current).toBe(2);
    const leap = applyDailyCompletion(
      { current: 1, best: 1, lastPlayed: '2024-02-29' },
      '2024-03-01',
    );
    expect(leap.current).toBe(2);
    const year = applyDailyCompletion(
      { current: 6, best: 6, lastPlayed: '2025-12-31' },
      '2026-01-01',
    );
    expect(year).toMatchObject({ current: 7, best: 7 });
  });
  it('resets when the device clock moves backwards', () => {
    const s = applyDailyCompletion({ current: 3, best: 3, lastPlayed: '2026-05-10' }, '2026-05-08');
    expect(s.current).toBe(1);
  });
  it('shows a broken streak as 0 until the player plays again', () => {
    const state = { current: 3, best: 3, lastPlayed: '2026-05-10' };
    expect(activeStreak(state, '2026-05-10')).toBe(3);
    expect(activeStreak(state, '2026-05-11')).toBe(3);
    expect(activeStreak(state, '2026-05-12')).toBe(0);
    expect(activeStreak(fresh, '2026-05-12')).toBe(0);
  });
  it('awards milestones at 3, 7 and 14 days', () => {
    expect(earnedMilestones(2)).toEqual([]);
    expect(earnedMilestones(7)).toEqual([3, 7]);
    expect(earnedMilestones(20)).toEqual([3, 7, 14]);
  });
});

describe('daily question selection', () => {
  it('has a pool of at least 15 valid questions', () => {
    expect(questions.length).toBeGreaterThanOrEqual(15);
    for (const q of questions) {
      expect(q.options.some((o) => o.id === q.correctId)).toBe(true);
    }
  });
  it('returns the same 3 distinct questions for the same day', () => {
    const a = pickDailyQuestions(questions, '2026-10-14');
    const b = pickDailyQuestions(questions, '2026-10-14');
    expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    expect(new Set(a.map((q) => q.id)).size).toBe(3);
  });
  it('gives the second attempt a different set of questions', () => {
    const first = pickDailyQuestions(questions, '2026-10-14', 1).map((q) => q.id);
    const second = pickDailyQuestions(questions, '2026-10-14', 2).map((q) => q.id);
    expect(second).toHaveLength(3);
    expect(second.filter((id) => first.includes(id))).toEqual([]);
    expect(pickDailyQuestions(questions, '2026-10-14', 2).map((q) => q.id)).toEqual(second);
  });
  it('passes with at least 2 of 3 right', () => {
    expect(passedDaily(1)).toBe(false);
    expect(passedDaily(2)).toBe(true);
    expect(passedDaily(3)).toBe(true);
  });
  it('varies the selection across days', () => {
    const keys = Array.from({ length: 10 }, (_, i) =>
      pickDailyQuestions(questions, `2026-10-${10 + i}`)
        .map((q) => q.id)
        .join(','),
    );
    expect(new Set(keys).size).toBeGreaterThan(5);
  });
});
