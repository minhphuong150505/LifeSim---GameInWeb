import { weekKeys, type DateKey } from '../../lib/date';
import { randomInt, rngFromString } from '../../lib/seededRandom';

export type Bot = { id: string; nickname: string; avatar: string; skill: number };
export type PlayerEntry = { nickname: string; avatar: string; score: number };
export type LeaderboardEntry = {
  id: string;
  nickname: string;
  avatar: string;
  score: number;
  rank: number;
  isPlayer: boolean;
};

export const PLAYER_ENTRY_ID = 'player';
// Scaled to a day of Core Simulation: the three rounds of a scenario add up to ~2,300 points.
const BOT_MIN_SCORE = 400;
const BOT_MAX_SCORE = 2100;

/** Simulated score of a bot for one day; stable for the whole day. */
export function botDailyScore(botId: string, dateKey: DateKey): number {
  return randomInt(rngFromString(`leaderboard|${dateKey}|${botId}`), BOT_MIN_SCORE, BOT_MAX_SCORE);
}

function rank(entries: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] {
  return [...entries]
    .sort((a, b) => b.score - a.score || Number(b.isPlayer) - Number(a.isPlayer))
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

const playerRow = (player: PlayerEntry) => ({
  id: PLAYER_ENTRY_ID,
  nickname: player.nickname,
  avatar: player.avatar,
  score: player.score,
  isPlayer: true,
});

export function buildDailyLeaderboard(
  bots: readonly Bot[],
  dateKey: DateKey,
  player: PlayerEntry,
): LeaderboardEntry[] {
  const rows = bots.map((b) => ({
    id: b.id,
    nickname: b.nickname,
    avatar: b.avatar,
    score: botDailyScore(b.id, dateKey),
    isPlayer: false,
  }));
  return rank([...rows, playerRow(player)]);
}

/** Days of the current week (Mon → today) that count toward the weekly board. */
export function weekDaysSoFar(today: DateKey): DateKey[] {
  return weekKeys(today).filter((d) => d <= today);
}

export function buildWeeklyLeaderboard(
  bots: readonly Bot[],
  today: DateKey,
  player: Omit<PlayerEntry, 'score'>,
  /** Player's Core Simulation score per day. */
  playerDailyScores: Record<DateKey, number>,
): LeaderboardEntry[] {
  const days = weekDaysSoFar(today);
  const rows = bots.map((b) => ({
    id: b.id,
    nickname: b.nickname,
    avatar: b.avatar,
    score: days.reduce((sum, d) => sum + botDailyScore(b.id, d), 0),
    isPlayer: false,
  }));
  const score = days.reduce((sum, d) => sum + (playerDailyScores[d] ?? 0), 0);
  return rank([...rows, playerRow({ ...player, score })]);
}
