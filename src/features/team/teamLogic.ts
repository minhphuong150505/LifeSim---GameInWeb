import { pickN, seededShuffle, type Rng } from '../../lib/seededRandom';
import type { Bot } from '../leaderboard/leaderboardLogic';
import type { DailyQuestion } from '../streak/streakLogic';

export const TEAM_SIZE = 5;
export const TEAM_ROUNDS = 5;
export const ROUND_TIME_SEC = 10;
export const BOT_MIN_ACCURACY = 0.55;
export const BOT_MAX_ACCURACY = 0.85;

export type TeamId = 'ally' | 'rival';
export type TeamMember = {
  id: string;
  nickname: string;
  avatar: string;
  team: TeamId;
  isPlayer: boolean;
  skill: number;
  score: number;
};
export type Match = { members: TeamMember[]; questions: DailyQuestion[] };
export type RoundAnswer = { correct: boolean; timeLeftSec: number };

/** Faster correct answers earn more; wrong answers earn nothing. */
export function pointsFor(answer: RoundAnswer): number {
  return answer.correct ? 100 + Math.round(Math.max(0, answer.timeLeftSec) * 10) : 0;
}

export function clampSkill(skill: number): number {
  return Math.min(BOT_MAX_ACCURACY, Math.max(BOT_MIN_ACCURACY, skill));
}

export function simulateBotAnswer(rng: Rng, skill: number): RoundAnswer {
  const correct = rng() < clampSkill(skill);
  const timeLeftSec = Math.round(rng() * (ROUND_TIME_SEC - 2) * 10) / 10;
  return { correct, timeLeftSec };
}

export function createMatch(
  rng: Rng,
  bots: readonly Bot[],
  pool: readonly DailyQuestion[],
  player: { nickname: string; avatar: string },
): Match {
  const picked = seededShuffle(bots, rng).slice(0, TEAM_SIZE * 2 - 1);
  const toMember = (b: Bot, team: TeamId): TeamMember => ({
    id: b.id,
    nickname: b.nickname,
    avatar: b.avatar,
    team,
    isPlayer: false,
    skill: clampSkill(b.skill),
    score: 0,
  });
  const me: TeamMember = {
    id: 'player',
    ...player,
    team: 'ally',
    isPlayer: true,
    skill: 0,
    score: 0,
  };
  return {
    members: [
      me,
      ...picked.slice(0, TEAM_SIZE - 1).map((b) => toMember(b, 'ally')),
      ...picked.slice(TEAM_SIZE - 1).map((b) => toMember(b, 'rival')),
    ],
    questions: pickN(pool, TEAM_ROUNDS, rng),
  };
}

/** Applies one round: the player's real answer plus simulated bot answers. */
export function playRound(
  members: TeamMember[],
  playerAnswer: RoundAnswer,
  rng: Rng,
): TeamMember[] {
  return members.map((m) => ({
    ...m,
    score: m.score + pointsFor(m.isPlayer ? playerAnswer : simulateBotAnswer(rng, m.skill)),
  }));
}

export function teamScore(members: TeamMember[], team: TeamId): number {
  return members.filter((m) => m.team === team).reduce((sum, m) => sum + m.score, 0);
}

export function winnerOf(members: TeamMember[]): TeamId | 'draw' {
  const ally = teamScore(members, 'ally');
  const rival = teamScore(members, 'rival');
  return ally === rival ? 'draw' : ally > rival ? 'ally' : 'rival';
}

export function mvpOf(members: TeamMember[]): TeamMember | undefined {
  return [...members].sort((a, b) => b.score - a.score)[0];
}
