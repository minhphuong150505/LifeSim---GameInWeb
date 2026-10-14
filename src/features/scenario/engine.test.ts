import { scenarios } from '../../data/scenarios';
import { computeScore } from '../../lib/scoring';
import {
  bpmFromTaps,
  createEngineReducer,
  evaluateOrder,
  evaluateRhythm,
  evaluateSingle,
  initialEngineState,
  summarizeRun,
  type EngineAction,
  type EngineState,
} from './engine';
import type { Scenario, Step } from './types';

const scenario: Scenario = {
  id: 't',
  title: 'Test',
  topic: 'cpr',
  location: 'Lab',
  difficulty: 1,
  background: 'x',
  intro: '',
  clues: [
    { id: 'c1', x: 0, y: 0, w: 10, h: 10, label: 'c1', description: '' },
    { id: 'c2', x: 20, y: 0, w: 10, h: 10, label: 'c2', description: '' },
    { id: 'bonus', x: 40, y: 0, w: 10, h: 10, label: 'bonus', description: '' },
  ],
  requiredClueIds: ['c1', 'c2'],
  steps: [
    {
      id: 's1',
      prompt: '',
      timeLimitSec: 20,
      type: 'single',
      options: [
        { id: 'a', text: 'right', correct: true, feedback: 'yes', points: 10 },
        { id: 'b', text: 'wrong', correct: false, feedback: 'no', points: 0 },
      ],
    },
    {
      id: 's2',
      prompt: '',
      timeLimitSec: 30,
      type: 'order',
      orderItems: [
        { id: 'x', text: 'X' },
        { id: 'y', text: 'Y' },
      ],
      correctOrder: ['x', 'y'],
    },
    {
      id: 's3',
      prompt: '',
      timeLimitSec: 15,
      type: 'rhythm',
      rhythm: { minBpm: 100, maxBpm: 120, durationSec: 15 },
    },
  ],
  takeaways: [],
};
const step = (i: number) => scenario.steps[i] as Step;
const reducer = createEngineReducer(scenario);
const run = (actions: EngineAction[], from: EngineState = initialEngineState) =>
  actions.reduce(reducer, from);

describe('scenario reducer', () => {
  it('moves INTRO → OBSERVE and ignores taps before starting', () => {
    expect(run([{ type: 'FIND_CLUE', clueId: 'c1' }]).foundClueIds).toEqual([]);
    expect(run([{ type: 'START' }]).phase).toBe('OBSERVE');
  });
  it('collects clues once and ignores unknown ids', () => {
    const s = run([
      { type: 'START' },
      { type: 'FIND_CLUE', clueId: 'c1' },
      { type: 'FIND_CLUE', clueId: 'c1' },
      { type: 'FIND_CLUE', clueId: 'nope' },
      { type: 'MISS_TAP' },
    ]);
    expect(s.foundClueIds).toEqual(['c1']);
    expect(s.missedTaps).toBe(1);
  });
  it('blocks DECIDE until every required clue is found', () => {
    const partial = run([
      { type: 'START' },
      { type: 'FIND_CLUE', clueId: 'c1' },
      { type: 'BEGIN_DECIDE' },
    ]);
    expect(partial.phase).toBe('OBSERVE');
    const done = run([{ type: 'FIND_CLUE', clueId: 'c2' }, { type: 'BEGIN_DECIDE' }], partial);
    expect(done.phase).toBe('DECIDE');
  });
  it('hints reveal required clues and are counted', () => {
    const s = run([
      { type: 'START' },
      { type: 'USE_HINT' },
      { type: 'USE_HINT' },
      { type: 'USE_HINT' },
    ]);
    expect(s.foundClueIds).toEqual(['c1', 'c2']);
    expect(s.hintsUsed).toBe(2); // third hint has nothing left to reveal
  });
  it('walks through all steps and ends in RESULT', () => {
    const observed = run([
      { type: 'START' },
      { type: 'USE_HINT' },
      { type: 'USE_HINT' },
      { type: 'BEGIN_DECIDE' },
    ]);
    const a1 = evaluateSingle(step(0), 'a', 12);
    let s = run([{ type: 'ANSWER', answer: a1 }], observed);
    expect(s.stepResolved).toBe(true);
    // A second answer for the same step is ignored.
    expect(run([{ type: 'ANSWER', answer: a1 }], s).answers).toHaveLength(1);
    s = run(
      [
        { type: 'NEXT_STEP' },
        { type: 'ANSWER', answer: evaluateOrder(step(1), ['x', 'y'], 10) },
        { type: 'NEXT_STEP' },
        { type: 'ANSWER', answer: evaluateRhythm(step(2), 110) },
        { type: 'NEXT_STEP' },
      ],
      s,
    );
    expect(s.phase).toBe('RESULT');
    expect(s.answers).toHaveLength(3);
    expect(run([{ type: 'RESTART' }], s)).toEqual(initialEngineState);
  });
  it('rejects answers for the wrong step and NEXT_STEP before answering', () => {
    const decide = run([
      { type: 'START' },
      { type: 'USE_HINT' },
      { type: 'USE_HINT' },
      { type: 'BEGIN_DECIDE' },
    ]);
    expect(run([{ type: 'NEXT_STEP' }], decide)).toBe(decide);
    expect(run([{ type: 'ANSWER', answer: evaluateRhythm(step(2), 110) }], decide)).toBe(decide);
  });
});

describe('step evaluation', () => {
  it('scores single-choice answers and timeouts', () => {
    expect(evaluateSingle(step(0), 'a', 12)).toMatchObject({
      correct: true,
      points: 10,
      timeLeftSec: 12,
    });
    expect(evaluateSingle(step(0), 'b', 12)).toMatchObject({
      correct: false,
      points: 0,
      timeLeftSec: 0,
    });
    const timeout = evaluateSingle(step(0), null, 0);
    expect(timeout.correct).toBe(false);
    expect(timeout.feedback).toContain('Hết giờ');
  });
  it('gives partial points for partially correct orders', () => {
    expect(evaluateOrder(step(1), ['x', 'y'], 5)).toMatchObject({ correct: true, points: 10 });
    expect(evaluateOrder(step(1), ['y', 'x'], 5)).toMatchObject({
      correct: false,
      points: 0,
      timeLeftSec: 0,
    });
  });
  it('judges compression rhythm against 100–120 bpm', () => {
    expect(evaluateRhythm(step(2), 110)).toMatchObject({ correct: true, points: 10 });
    expect(evaluateRhythm(step(2), 95)).toMatchObject({ correct: false, points: 5 });
    expect(evaluateRhythm(step(2), 160)).toMatchObject({ correct: false, points: 0 });
  });
  it('derives bpm from tap timestamps', () => {
    expect(bpmFromTaps([0, 500, 1000, 1500])).toBeCloseTo(120);
    expect(bpmFromTaps([0])).toBe(0);
  });
  it('summarizes a run into scoring inputs', () => {
    const state: EngineState = {
      ...initialEngineState,
      phase: 'RESULT',
      hintsUsed: 1,
      answers: [
        evaluateSingle(step(0), 'a', 10),
        evaluateOrder(step(1), ['y', 'x'], 9),
        evaluateRhythm(step(2), 110),
      ],
    };
    const input = summarizeRun(state);
    expect(input).toEqual({
      correctCount: 2,
      totalCount: 3,
      pointsEarned: 20,
      pointsMax: 30,
      timeLeftSec: 10,
      timeTotalSec: 50,
      hintsUsed: 1,
    });
    expect(computeScore(input).score).toBe(
      Math.round(1000 * ((2 / 3) * 0.5 + (2 / 3) * 0.3 + 0.2 * 0.2) * 0.95),
    );
  });
});

describe('bundled scenario data', () => {
  it('ships the three demo scenarios in order', () => {
    expect(scenarios.map((s) => s.id)).toEqual(['classroom-cpr', 'canteen-choking', 'lab-burn']);
  });
  it.each(scenarios.map((s) => [s.id, s] as const))('%s is internally consistent', (_id, s) => {
    const clueIds = s.clues.map((c) => c.id);
    expect(s.requiredClueIds.every((id) => clueIds.includes(id))).toBe(true);
    for (const c of s.clues) {
      expect(c.x + c.w).toBeLessThanOrEqual(100);
      expect(c.y + c.h).toBeLessThanOrEqual(100);
    }
    for (const st of s.steps) {
      if (st.type === 'single') {
        expect(st.options?.filter((o) => o.correct)).toHaveLength(1);
      } else if (st.type === 'order') {
        expect([...(st.correctOrder ?? [])].sort()).toEqual(
          (st.orderItems ?? []).map((i) => i.id).sort(),
        );
      } else {
        expect(st.rhythm).toBeDefined();
      }
    }
  });
});
