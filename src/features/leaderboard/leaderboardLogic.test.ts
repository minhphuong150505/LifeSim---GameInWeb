import botsJson from '../../data/bots.json';
import locationsJson from '../../data/hubLocations.json';
import poolJson from '../../data/dailyPool.json';
import { rngFromString } from '../../lib/seededRandom';
import { rankLocations, weakestTopic, DEFAULT_CENTER, type HubLocation } from '../hub/hubLogic';
import type { DailyQuestion } from '../streak/streakLogic';
import {
  createMatch,
  playRound,
  pointsFor,
  simulateBotAnswer,
  teamScore,
  winnerOf,
} from '../team/teamLogic';
import {
  botDailyScore,
  buildDailyLeaderboard,
  buildWeeklyLeaderboard,
  weekDaysSoFar,
  type Bot,
} from './leaderboardLogic';

const bots = botsJson as Bot[];
const me = { nickname: 'Tester', avatar: 'avatar-1' };

describe('leaderboard seed', () => {
  it('has 20 bots with stable scores for a given day', () => {
    expect(bots).toHaveLength(20);
    expect(botDailyScore('bot-01', '2026-10-14')).toBe(botDailyScore('bot-01', '2026-10-14'));
    const a = buildDailyLeaderboard(bots, '2026-10-14', { ...me, score: 500 });
    const b = buildDailyLeaderboard(bots, '2026-10-14', { ...me, score: 500 });
    expect(a).toEqual(b);
  });
  it('changes from day to day', () => {
    const today = bots.map((b) => botDailyScore(b.id, '2026-10-14'));
    const tomorrow = bots.map((b) => botDailyScore(b.id, '2026-10-15'));
    expect(today).not.toEqual(tomorrow);
  });
  it('inserts the player and ranks by score descending', () => {
    // Above the bots' daily ceiling (2,100), i.e. a near-perfect day of Core Simulation.
    const board = buildDailyLeaderboard(bots, '2026-10-14', { ...me, score: 2200 });
    expect(board).toHaveLength(21);
    expect(board[0]).toMatchObject({ isPlayer: true, rank: 1, score: 2200 });
    expect(board.map((e) => e.score)).toEqual([...board.map((e) => e.score)].sort((x, y) => y - x));
    const last = buildDailyLeaderboard(bots, '2026-10-14', { ...me, score: 0 });
    expect(last[20]?.isPlayer).toBe(true);
  });
  it('sums the week from Monday to today', () => {
    expect(weekDaysSoFar('2026-10-14')).toEqual(['2026-10-12', '2026-10-13', '2026-10-14']);
    const board = buildWeeklyLeaderboard(bots, '2026-10-14', me, {
      '2026-10-11': 999, // last week: ignored
      '2026-10-12': 400,
      '2026-10-14': 600,
    });
    expect(board.find((e) => e.isPlayer)?.score).toBe(1000);
    const bot = board.find((e) => e.id === 'bot-01');
    expect(bot?.score).toBe(
      ['2026-10-12', '2026-10-13', '2026-10-14'].reduce(
        (n, d) => n + botDailyScore('bot-01', d),
        0,
      ),
    );
  });
});

describe('team rescue simulation', () => {
  it('builds a 5 vs 5 match with 5 questions', () => {
    const match = createMatch(rngFromString('m'), bots, poolJson as DailyQuestion[], me);
    expect(match.members.filter((m) => m.team === 'ally')).toHaveLength(5);
    expect(match.members.filter((m) => m.team === 'rival')).toHaveLength(5);
    expect(match.members.filter((m) => m.isPlayer)).toHaveLength(1);
    expect(new Set(match.members.map((m) => m.id)).size).toBe(10);
    expect(match.questions).toHaveLength(5);
  });
  it('keeps bot accuracy inside 0.55–0.85', () => {
    const rng = rngFromString('acc');
    const N = 4000;
    const rate = (skill: number) =>
      Array.from({ length: N }, () => simulateBotAnswer(rng, skill)).filter((a) => a.correct)
        .length / N;
    expect(rate(0.1)).toBeGreaterThan(0.5);
    expect(rate(0.99)).toBeLessThan(0.9);
  });
  it('adds round points to team totals', () => {
    expect(pointsFor({ correct: true, timeLeftSec: 5 })).toBe(150);
    expect(pointsFor({ correct: false, timeLeftSec: 9 })).toBe(0);
    const match = createMatch(rngFromString('m'), bots, poolJson as DailyQuestion[], me);
    const after = playRound(match.members, { correct: true, timeLeftSec: 10 }, rngFromString('r'));
    expect(after.find((m) => m.isPlayer)?.score).toBe(200);
    expect(teamScore(after, 'ally')).toBeGreaterThanOrEqual(200);
    expect(['ally', 'rival', 'draw']).toContain(winnerOf(after));
  });
});

describe('practice hub ranking', () => {
  const locations = locationsJson as HubLocation[];
  const all = { maxKm: null, day: null, budgetVnd: null, topic: null };
  it('ships 8 demo locations clearly labelled as demo', () => {
    expect(locations).toHaveLength(8);
    expect(locations.every((l) => l.name.includes('(demo)'))).toBe(true);
  });
  it('finds the weakest answered topic', () => {
    expect(weakestTopic({})).toBeNull();
    expect(
      weakestTopic({
        cpr: { correct: 4, total: 5 },
        burn: { correct: 1, total: 5 },
        choking: { correct: 0, total: 0 },
      }),
    ).toBe('burn');
  });
  it('filters by need (topic)', () => {
    const nosebleed = rankLocations(
      locations,
      DEFAULT_CENTER,
      { ...all, topic: 'nosebleed' },
      null,
    );
    expect(nosebleed.length).toBeGreaterThan(0);
    expect(nosebleed.every((l) => l.topics.includes('nosebleed'))).toBe(true);
  });
  it('filters by budget, day and distance and puts recommended courses first', () => {
    expect(
      rankLocations(locations, DEFAULT_CENTER, { ...all, budgetVnd: 100000 }, null).every(
        (l) => l.priceVnd <= 100000,
      ),
    ).toBe(true);
    expect(
      rankLocations(locations, DEFAULT_CENTER, { ...all, day: 6 }, null).every((l) =>
        l.days.includes(6),
      ),
    ).toBe(true);
    expect(
      rankLocations(locations, DEFAULT_CENTER, { ...all, maxKm: 5 }, null).every(
        (l) => l.distanceKm <= 5,
      ),
    ).toBe(true);
    const ranked = rankLocations(locations, DEFAULT_CENTER, all, 'burn');
    expect(ranked[0]?.recommended).toBe(true);
    expect(ranked[0]?.topics).toContain('burn');
  });
});
