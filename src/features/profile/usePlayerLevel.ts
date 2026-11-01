import { useProgressStore } from '../../store/progress';
import { useMissionStore } from '../../store/missions';
import { useStreakStore } from '../../store/streak';
import { levelOf, totalXp } from './level';

/** Current level and XP of the player, derived from every saved store. */
export function usePlayerLevel() {
  const rounds = useProgressStore((s) => s.rounds);
  const teamWins = useProgressStore((s) => s.teamWins);
  const results = useStreakStore((s) => s.results);
  const missionsClaimed = useMissionStore((s) => s.totalClaimed);
  const streakDays = Object.values(results).filter((r) => r.passed).length;
  const xp = totalXp({ rounds, streakDays, teamWins, missionsClaimed });
  return { xp, ...levelOf(xp) };
}
