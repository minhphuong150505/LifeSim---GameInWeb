import { STREAK_MILESTONES } from '../features/streak/streakLogic';
import type { ScenarioRecord } from '../store/progress';

export type BadgeInfo = { id: string; emoji: string; label: string; hint: string; earned: boolean };

type BadgeInput = {
  scenarios: Record<string, ScenarioRecord>;
  scenarioCount: number;
  bestStreak: number;
  teamWins: number;
};

const STREAK_EMOJI: Record<number, string> = { 3: '🩹', 7: '🎁', 14: '🏅' };

/** Badges are derived from saved progress, so they never go out of sync. */
export function computeBadges({
  scenarios,
  scenarioCount,
  bestStreak,
  teamWins,
}: BadgeInput): BadgeInfo[] {
  const records = Object.values(scenarios);
  return [
    {
      id: 'first-rescue',
      emoji: '🚑',
      label: 'Ca đầu tiên',
      hint: 'Hoàn thành 1 tình huống',
      earned: records.length >= 1,
    },
    {
      id: 'all-clear',
      emoji: '🎓',
      label: 'Tốt nghiệp',
      hint: 'Hoàn thành mọi tình huống',
      earned: scenarioCount > 0 && records.length >= scenarioCount,
    },
    {
      id: 'three-stars',
      emoji: '🌟',
      label: 'Chuẩn chỉnh',
      hint: 'Đạt 3 sao ở 1 tình huống',
      earned: records.some((r) => r.bestStars >= 3),
    },
    ...STREAK_MILESTONES.map((m) => ({
      id: `streak-${m}`,
      emoji: STREAK_EMOJI[m] ?? '🔥',
      label: `Chuỗi ${m} ngày`,
      hint: `Giữ streak ${m} ngày`,
      earned: bestStreak >= m,
    })),
    {
      id: 'team-win',
      emoji: '🏆',
      label: 'Đồng đội',
      hint: 'Thắng 1 trận 5v5',
      earned: teamWins >= 1,
    },
  ];
}
