import { STREAK_MILESTONES } from '../features/streak/streakLogic';
import type { RoundRecord } from '../store/progress';

export type BadgeInfo = { id: string; emoji: string; label: string; hint: string; earned: boolean };

type BadgeInput = {
  rounds: Record<string, RoundRecord>;
  roundCount: number;
  bestStreak: number;
  teamWins: number;
};

const STREAK_EMOJI: Record<number, string> = { 3: '🩹', 7: '🎁', 14: '🏅' };

/** Badges are derived from saved progress, so they never go out of sync. */
export function computeBadges({
  rounds,
  roundCount,
  bestStreak,
  teamWins,
}: BadgeInput): BadgeInfo[] {
  const cleared = Object.values(rounds).filter((r) => r.wins > 0);
  return [
    {
      id: 'first-rescue',
      emoji: '🚑',
      label: 'Ca đầu tiên',
      hint: 'Vượt qua 1 round',
      earned: cleared.length >= 1,
    },
    {
      id: 'all-clear',
      emoji: '🎓',
      label: 'Tốt nghiệp',
      hint: 'Vượt qua mọi round',
      earned: roundCount > 0 && cleared.length >= roundCount,
    },
    {
      id: 'three-stars',
      emoji: '🌟',
      label: 'Không tia sét',
      hint: 'Đạt 3 sao ở 1 round',
      earned: cleared.some((r) => r.bestStars >= 3),
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
