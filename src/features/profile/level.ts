import type { RoundRecord } from '../../store/progress';

/** XP needed for each level (flat curve keeps the demo easy to read). */
export const XP_PER_LEVEL = 200;

export type XpInput = {
  rounds: Record<string, RoundRecord>;
  /** Days the daily streak challenge was passed. */
  streakDays: number;
  teamWins: number;
  missionsClaimed: number;
};

/** Experience is derived from saved progress, so it never goes out of sync. */
export function totalXp({ rounds, streakDays, teamWins, missionsClaimed }: XpInput): number {
  const roundXp = Object.values(rounds).reduce(
    (n, r) => n + (r.wins > 0 ? 100 : 0) + r.bestStars * 30,
    0,
  );
  return roundXp + streakDays * 40 + teamWins * 50 + missionsClaimed * 20;
}

export function levelOf(xp: number): { level: number; into: number; needed: number } {
  const safe = Math.max(0, Math.floor(xp));
  return {
    level: 1 + Math.floor(safe / XP_PER_LEVEL),
    into: safe % XP_PER_LEVEL,
    needed: XP_PER_LEVEL,
  };
}

export const LEVEL_TITLES = [
  'Tình nguyện viên tập sự',
  'Người sơ cứu nhập môn',
  'Người sơ cứu tự tin',
  'Hiệp sĩ sơ cứu',
  'Chuyên gia sơ cứu',
];

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1] ?? LEVEL_TITLES[0]!;
}
