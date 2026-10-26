import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic } from '../data/topics';
import type { DateKey } from '../lib/date';

export type RoundRecord = { bestScore: number; bestStars: number; plays: number; wins: number };
export type TopicStat = { correct: number; total: number };
export type TopicStats = Partial<Record<Topic, TopicStat>>;

export type RoundRun = {
  roundId: string;
  topic: Topic;
  won: boolean;
  score: number;
  stars: number;
  /** Questions answered right on the first try / questions answered. */
  correct: number;
  total: number;
  date: DateKey;
};

type ProgressState = {
  rounds: Record<string, RoundRecord>;
  topicStats: TopicStats;
  /** Best score per round per local day; the daily leaderboard sums a day's rounds. */
  dailyRounds: Record<DateKey, Record<string, number>>;
  teamPlays: number;
  teamWins: number;
  recordRound: (run: RoundRun) => void;
  recordAnswers: (topic: Topic, correct: number, total: number) => void;
  recordTeamMatch: (won: boolean) => void;
  reset: () => void;
};

const initial = { rounds: {}, topicStats: {}, dailyRounds: {}, teamPlays: 0, teamWins: 0 };

function addToTopic(stats: TopicStats, topic: Topic, correct: number, total: number): TopicStats {
  const prev = stats[topic] ?? { correct: 0, total: 0 };
  return { ...stats, [topic]: { correct: prev.correct + correct, total: prev.total + total } };
}

/** A day's Core Simulation score: sum of the best score of each round played that day. */
export function dayScore(
  dailyRounds: Record<DateKey, Record<string, number>>,
  day: DateKey,
): number {
  return Object.values(dailyRounds[day] ?? {}).reduce((n, s) => n + s, 0);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      recordRound: (run) =>
        set((s) => {
          const prev = s.rounds[run.roundId];
          const day = s.dailyRounds[run.date] ?? {};
          return {
            rounds: {
              ...s.rounds,
              [run.roundId]: {
                bestScore: Math.max(prev?.bestScore ?? 0, run.score),
                bestStars: Math.max(prev?.bestStars ?? 0, run.stars),
                plays: (prev?.plays ?? 0) + 1,
                wins: (prev?.wins ?? 0) + (run.won ? 1 : 0),
              },
            },
            topicStats: addToTopic(s.topicStats, run.topic, run.correct, run.total),
            dailyRounds: run.won
              ? {
                  ...s.dailyRounds,
                  [run.date]: { ...day, [run.roundId]: Math.max(day[run.roundId] ?? 0, run.score) },
                }
              : s.dailyRounds,
          };
        }),
      recordAnswers: (topic, correct, total) =>
        set((s) => ({ topicStats: addToTopic(s.topicStats, topic, correct, total) })),
      recordTeamMatch: (won) =>
        set((s) => ({ teamPlays: s.teamPlays + 1, teamWins: s.teamWins + (won ? 1 : 0) })),
      reset: () => set(initial),
    }),
    {
      name: 'lifesim-progress',
      version: 1,
      // v0 stored the old clue-hunt scenarios; keep only what still applies.
      migrate: (persisted, version) => {
        const old = (persisted ?? {}) as Partial<ProgressState>;
        if (version >= 1) return old as ProgressState;
        return {
          ...initial,
          topicStats: old.topicStats ?? {},
          teamPlays: old.teamPlays ?? 0,
          teamWins: old.teamWins ?? 0,
        } as ProgressState;
      },
    },
  ),
);
