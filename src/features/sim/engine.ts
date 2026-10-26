import type { OptionId, SimRound, StageState } from './types';

/** 3 lightning bolts in one round = round lost. */
export const MAX_BOLTS = 3;
/** Bandages needed to replay a lost round (or watch an ad instead). */
export const RETRY_COST = 10;
/** Bandages every new player starts with, so the first shop items are reachable. */
export const STARTING_BANDAGES = 50;

export type RoundPhase = 'intro' | 'question' | 'explain' | 'task' | 'won' | 'lost';

export type RoundState = {
  phase: RoundPhase;
  /** Index into `round.intro` while in the intro. */
  beat: number;
  qIndex: number;
  hearts: number;
  bolts: number;
  /** Wrong options already tried on the current question. */
  wrongIds: OptionId[];
  /** Per answered question: right on the first try? */
  firstTry: boolean[];
  stage: StageState;
  /** 1 for the first try at the round, +1 per replay. */
  attempt: number;
};

export type RoundAction =
  | { type: 'NEXT_BEAT' }
  | { type: 'SKIP_INTRO' }
  | { type: 'ANSWER'; optionId: OptionId }
  | { type: 'ACK' }
  | { type: 'TASK_DONE'; effect?: Partial<StageState> }
  | { type: 'RETRY' };

export function initialRoundState(round: SimRound): RoundState {
  return {
    phase: round.intro.length > 0 ? 'intro' : 'question',
    beat: 0,
    qIndex: 0,
    hearts: 0,
    bolts: 0,
    wrongIds: [],
    firstTry: [],
    stage: round.stage,
    attempt: 1,
  };
}

export function createRoundReducer(round: SimRound) {
  const advance = (state: RoundState): RoundState =>
    state.qIndex + 1 < round.questions.length
      ? { ...state, phase: 'question', qIndex: state.qIndex + 1, wrongIds: [] }
      : { ...state, phase: 'won' };

  return function reducer(state: RoundState, action: RoundAction): RoundState {
    switch (action.type) {
      case 'NEXT_BEAT':
        if (state.phase !== 'intro') return state;
        return state.beat + 1 < round.intro.length
          ? { ...state, beat: state.beat + 1 }
          : { ...state, phase: 'question' };

      case 'SKIP_INTRO':
        return state.phase === 'intro' ? { ...state, phase: 'question' } : state;

      case 'ANSWER': {
        if (state.phase !== 'question') return state;
        const q = round.questions[state.qIndex];
        if (!q || state.wrongIds.includes(action.optionId)) return state;
        if (!q.options.some((o) => o.id === action.optionId)) return state;
        if (action.optionId === q.correctId) {
          return {
            ...state,
            phase: 'explain',
            hearts: state.hearts + 1,
            firstTry: [...state.firstTry, state.wrongIds.length === 0],
            stage: { ...state.stage, ...q.effect },
          };
        }
        const bolts = state.bolts + 1;
        return {
          ...state,
          bolts,
          wrongIds: [...state.wrongIds, action.optionId],
          phase: bolts >= MAX_BOLTS ? 'lost' : 'question',
        };
      }

      case 'ACK': {
        if (state.phase !== 'explain') return state;
        return round.questions[state.qIndex]?.task ? { ...state, phase: 'task' } : advance(state);
      }

      case 'TASK_DONE':
        if (state.phase !== 'task') return state;
        return advance({ ...state, stage: { ...state.stage, ...action.effect } });

      case 'RETRY':
        // Replays skip the story and start again from question 1.
        return { ...initialRoundState(round), phase: 'question', attempt: state.attempt + 1 };
    }
  };
}

/** 3 stars with no bolts, 2 with one, 1 with two. */
export function starsFor(bolts: number): number {
  return Math.max(1, MAX_BOLTS - bolts);
}

/** Leaderboard points for a cleared round: 100 per question + 50 per unused bolt, scaled by difficulty. */
export function roundScore(round: SimRound, bolts: number): number {
  const base = round.questions.length * 100 + Math.max(0, MAX_BOLTS - bolts) * 50;
  return Math.round(base * (1 + (round.difficulty - 1) * 0.25));
}
