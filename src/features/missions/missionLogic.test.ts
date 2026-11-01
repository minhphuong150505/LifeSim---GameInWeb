import { describe, expect, it } from 'vitest';
import { levelOf, totalXp, XP_PER_LEVEL } from '../profile/level';
import {
  claimableCount,
  missionsDoneCount,
  missionStatus,
  type MissionInput,
} from './missionLogic';

const base: MissionInput = { today: '2026-11-01', activity: {}, streakPassed: false, claimed: {} };

describe('daily missions', () => {
  it('starts with every mission to do', () => {
    expect(missionStatus('play-round', base)).toBe('todo');
    expect(missionsDoneCount(base)).toBe(0);
  });

  it('becomes claimable once done, then claimed', () => {
    const done: MissionInput = {
      ...base,
      activity: { '2026-11-01': { played: true, handbook: true } },
      streakPassed: true,
    };
    expect(claimableCount(done)).toBe(3);
    const claimed = { ...done, claimed: { '2026-11-01': ['play-round' as const] } };
    expect(missionStatus('play-round', claimed)).toBe('claimed');
    expect(claimableCount(claimed)).toBe(2);
    expect(missionsDoneCount(claimed)).toBe(3);
  });

  it('resets on a new day', () => {
    const yesterday: MissionInput = {
      ...base,
      activity: { '2026-10-31': { played: true } },
      claimed: { '2026-10-31': ['play-round'] },
    };
    expect(missionStatus('play-round', yesterday)).toBe('todo');
  });
});

describe('player level', () => {
  it('derives XP from progress', () => {
    const xp = totalXp({
      rounds: { '1-1': { bestScore: 500, bestStars: 3, plays: 2, wins: 1 } },
      streakDays: 2,
      teamWins: 1,
      missionsClaimed: 3,
    });
    expect(xp).toBe(100 + 90 + 80 + 50 + 60);
  });

  it('levels up every XP_PER_LEVEL', () => {
    expect(levelOf(0)).toEqual({ level: 1, into: 0, needed: XP_PER_LEVEL });
    expect(levelOf(XP_PER_LEVEL + 15).level).toBe(2);
    expect(levelOf(XP_PER_LEVEL + 15).into).toBe(15);
  });
});
