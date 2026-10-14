import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Topic } from '../features/scenario/types';
import type { DateKey } from '../lib/date';

export type ScenarioRecord = { bestScore: number; bestStars: number; plays: number };
export type TopicStat = { correct: number; total: number };
export type TopicStats = Partial<Record<Topic, TopicStat>>;

type ScenarioRun = {
  scenarioId: string;
  topic: Topic;
  score: number;
  stars: number;
  correct: number;
  total: number;
  date: DateKey;
};

type ProgressState = {
  scenarios: Record<string, ScenarioRecord>;
  topicStats: TopicStats;
  /** Best scenario score per local day; feeds the (simulated) leaderboard. */
  dailyBest: Record<DateKey, number>;
  teamPlays: number;
  teamWins: number;
  recordScenario: (run: ScenarioRun) => void;
  recordAnswers: (topic: Topic, correct: number, total: number) => void;
  recordTeamMatch: (won: boolean) => void;
  reset: () => void;
};

const initial = { scenarios: {}, topicStats: {}, dailyBest: {}, teamPlays: 0, teamWins: 0 };

function addToTopic(stats: TopicStats, topic: Topic, correct: number, total: number): TopicStats {
  const prev = stats[topic] ?? { correct: 0, total: 0 };
  return { ...stats, [topic]: { correct: prev.correct + correct, total: prev.total + total } };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initial,
      recordScenario: (run) =>
        set((s) => {
          const prev = s.scenarios[run.scenarioId];
          return {
            scenarios: {
              ...s.scenarios,
              [run.scenarioId]: {
                bestScore: Math.max(prev?.bestScore ?? 0, run.score),
                bestStars: Math.max(prev?.bestStars ?? 0, run.stars),
                plays: (prev?.plays ?? 0) + 1,
              },
            },
            topicStats: addToTopic(s.topicStats, run.topic, run.correct, run.total),
            dailyBest: {
              ...s.dailyBest,
              [run.date]: Math.max(s.dailyBest[run.date] ?? 0, run.score),
            },
          };
        }),
      recordAnswers: (topic, correct, total) =>
        set((s) => ({ topicStats: addToTopic(s.topicStats, topic, correct, total) })),
      recordTeamMatch: (won) =>
        set((s) => ({ teamPlays: s.teamPlays + 1, teamWins: s.teamWins + (won ? 1 : 0) })),
      reset: () => set(initial),
    }),
    { name: 'lifesim-progress' },
  ),
);
