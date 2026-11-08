import type { SimRound, SimScenario, UpcomingScenario } from '../../features/sim/types';
import { burns } from './burns';
import { choking } from './choking';
import { drowning } from './drowning';
import { nosebleed } from './nosebleed';

/** Playable scenarios, in unlock order. Add a new one by writing a data file next to `nosebleed.ts`. */
export const simScenarios: SimScenario[] = [nosebleed, drowning, choking, burns];

/** Shown on the map as "Sắp ra mắt". */
export const upcomingScenarios: UpcomingScenario[] = [
  { id: 'cpr', number: 3, title: 'Ngừng tim – Ép tim (CPR)', topic: 'cpr', location: 'Lớp học' },
];

/** Every round across scenarios, in play order. */
export const allRounds: SimRound[] = simScenarios.flatMap((s) => s.rounds);

export function getRound(id: string | undefined): SimRound | undefined {
  return allRounds.find((r) => r.id === id);
}

export function scenarioOf(roundId: string): SimScenario | undefined {
  return simScenarios.find((s) => s.rounds.some((r) => r.id === roundId));
}

export function nextRoundId(id: string): string | null {
  const i = allRounds.findIndex((r) => r.id === id);
  return allRounds[i + 1]?.id ?? null;
}
