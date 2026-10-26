import { allRounds, getRound, nextRoundId, simScenarios } from '../../data/sim';
import { useWalletStore } from '../../store/wallet';
import {
  createRoundReducer,
  initialRoundState,
  MAX_BOLTS,
  roundScore,
  starsFor,
  STARTING_BANDAGES,
  type RoundAction,
  type RoundState,
} from './engine';
import { ART_KEYS } from './optionArt';
import type { OptionId, SimRound } from './types';
import { isRoundUnlocked, nextRoundToPlay } from './unlock';

const round = getRound('1-1') as SimRound;
const reducer = createRoundReducer(round);
const run = (state: RoundState, ...actions: RoundAction[]) => actions.reduce(reducer, state);
const wrongOf = (r: SimRound, i: number): OptionId[] => {
  const q = r.questions[i];
  return (q?.options ?? []).filter((o) => o.id !== q?.correctId).map((o) => o.id);
};
const rightOf = (r: SimRound, i: number) => r.questions[i]?.correctId as OptionId;

describe('bundled simulation data', () => {
  it('has scenario 1 (nosebleed) with rounds 1.1 → 1.3 and rewards 20/25/30', () => {
    expect(simScenarios[0]?.id).toBe('nosebleed');
    expect(allRounds.map((r) => r.code)).toEqual(['1.1', '1.2', '1.3']);
    expect(allRounds.map((r) => r.reward)).toEqual([20, 25, 30]);
    expect(allRounds.map((r) => r.questions.length)).toEqual([5, 5, 4]);
    expect(nextRoundId('1-1')).toBe('1-2');
    expect(nextRoundId('1-3')).toBeNull();
  });
  it('gives every question 3 options with exactly one valid answer and known artwork', () => {
    for (const r of allRounds) {
      expect(r.intro.at(-1)?.kind).toBe('mission');
      for (const q of r.questions) {
        expect(q.options.map((o) => o.id)).toEqual(['a', 'b', 'c']);
        expect(q.options.some((o) => o.id === q.correctId)).toBe(true);
        expect(q.explanation.length).toBeGreaterThan(20);
        for (const o of q.options) expect(ART_KEYS).toContain(o.art);
      }
      expect(new Set(r.questions.map((q) => q.id)).size).toBe(r.questions.length);
    }
  });
  it('places the item tasks where the script asks for them', () => {
    const tasks = allRounds.flatMap((r) =>
      r.questions.filter((q) => q.task).map((q) => `${r.code}:${q.task}`),
    );
    expect(tasks).toEqual(['1.2:nose-tap', '1.2:ice-pack', '1.3:call-115']);
  });
});

describe('round engine', () => {
  it('walks the story beats, then starts the first question', () => {
    let s = initialRoundState(round);
    expect(s.phase).toBe('intro');
    for (let i = 0; i < round.intro.length - 1; i++) s = reducer(s, { type: 'NEXT_BEAT' });
    expect(s.phase).toBe('intro');
    s = reducer(s, { type: 'NEXT_BEAT' });
    expect(s).toMatchObject({ phase: 'question', qIndex: 0 });
    expect(reducer(initialRoundState(round), { type: 'SKIP_INTRO' }).phase).toBe('question');
  });

  it('gives a heart and the explanation for a right answer, and applies the scene change', () => {
    const s = run(
      initialRoundState(round),
      { type: 'SKIP_INTRO' },
      { type: 'ANSWER', optionId: rightOf(round, 0) },
    );
    expect(s).toMatchObject({ phase: 'explain', hearts: 1, bolts: 0, firstTry: [true] });
    expect(s.stage.posture).toBe('forward');
    expect(reducer(s, { type: 'ACK' })).toMatchObject({
      phase: 'question',
      qIndex: 1,
      wrongIds: [],
    });
  });

  it('gives a bolt for a wrong answer and lets the player choose again', () => {
    const [w] = wrongOf(round, 0);
    let s = run(
      initialRoundState(round),
      { type: 'SKIP_INTRO' },
      { type: 'ANSWER', optionId: w as OptionId },
    );
    expect(s).toMatchObject({ phase: 'question', bolts: 1, wrongIds: [w] });
    // Picking the same wrong option again is ignored.
    expect(reducer(s, { type: 'ANSWER', optionId: w as OptionId }).bolts).toBe(1);
    s = reducer(s, { type: 'ANSWER', optionId: rightOf(round, 0) });
    expect(s).toMatchObject({ phase: 'explain', hearts: 1, bolts: 1, firstTry: [false] });
  });

  it(`loses the round on the ${MAX_BOLTS}rd bolt and RETRY restarts from question 1`, () => {
    const [w1, w2] = wrongOf(round, 0) as OptionId[];
    let s = run(
      initialRoundState(round),
      { type: 'SKIP_INTRO' },
      { type: 'ANSWER', optionId: w1 as OptionId },
      { type: 'ANSWER', optionId: w2 as OptionId },
      { type: 'ANSWER', optionId: rightOf(round, 0) },
      { type: 'ACK' },
      { type: 'ANSWER', optionId: wrongOf(round, 1)[0] as OptionId },
    );
    expect(s).toMatchObject({ phase: 'lost', bolts: 3 });
    expect(reducer(s, { type: 'ANSWER', optionId: rightOf(round, 1) }).phase).toBe('lost');
    s = reducer(s, { type: 'RETRY' });
    expect(s).toMatchObject({
      phase: 'question',
      qIndex: 0,
      hearts: 0,
      bolts: 0,
      attempt: 2,
      stage: round.stage,
    });
  });

  it('wins after every question, and runs tasks before moving on', () => {
    const r2 = getRound('1-2') as SimRound;
    const red = createRoundReducer(r2);
    let s = red(initialRoundState(r2), { type: 'SKIP_INTRO' });
    r2.questions.forEach((q, i) => {
      s = red(s, { type: 'ANSWER', optionId: rightOf(r2, i) });
      s = red(s, { type: 'ACK' });
      if (q.task) {
        expect(s.phase).toBe('task');
        s = red(s, {
          type: 'TASK_DONE',
          effect: q.task === 'ice-pack' ? { icePack: true } : undefined,
        });
      }
    });
    expect(s).toMatchObject({ phase: 'won', hearts: 5, bolts: 0 });
    expect(s.stage).toMatchObject({
      pinch: true,
      mouthOpen: true,
      icePack: true,
      clock: '15 phút',
    });
  });

  it('scores 3/2/1 stars by bolts and scales points with difficulty', () => {
    expect([0, 1, 2].map(starsFor)).toEqual([3, 2, 1]);
    expect(roundScore(round, 0)).toBe(650);
    expect(roundScore(round, 2)).toBe(550);
    expect(roundScore(getRound('1-3') as SimRound, 0)).toBe(825);
  });
});

describe('round unlocking', () => {
  const win = { bestScore: 650, bestStars: 3, plays: 1, wins: 1 };
  it('opens rounds one after another', () => {
    expect(isRoundUnlocked(allRounds, {}, '1-1')).toBe(true);
    expect(isRoundUnlocked(allRounds, {}, '1-2')).toBe(false);
    expect(isRoundUnlocked(allRounds, { '1-1': { ...win, wins: 0 } }, '1-2')).toBe(false);
    expect(isRoundUnlocked(allRounds, { '1-1': win }, '1-2')).toBe(true);
    expect(isRoundUnlocked(allRounds, {}, 'nope')).toBe(false);
  });
  it('suggests the first uncleared round', () => {
    expect(nextRoundToPlay(allRounds, {})?.id).toBe('1-1');
    expect(nextRoundToPlay(allRounds, { '1-1': win })?.id).toBe('1-2');
    expect(nextRoundToPlay(allRounds, { '1-1': win, '1-2': win, '1-3': win })?.id).toBe('1-1');
  });
});

describe('wallet', () => {
  beforeEach(() => useWalletStore.getState().reset());
  it('starts with the welcome bandages and refuses to overspend', () => {
    const w = useWalletStore.getState();
    expect(w.bandages).toBe(STARTING_BANDAGES);
    expect(w.spend(STARTING_BANDAGES + 1)).toBe(false);
    expect(useWalletStore.getState().bandages).toBe(STARTING_BANDAGES);
  });
  it('buys items into the bag; the ice pack is used up, the phone is kept', () => {
    const w = useWalletStore.getState();
    expect(w.buy('ice-pack')).toBe(true); // 40
    expect(useWalletStore.getState().bandages).toBe(STARTING_BANDAGES - 40);
    expect(w.buy('phone')).toBe(false); // 10 left < 30
    w.earn(30);
    expect(w.buy('phone')).toBe(true);
    expect(w.buy('phone')).toBe(false); // only one phone
    expect(w.use('ice-pack')).toBe(true);
    expect(w.use('ice-pack')).toBe(false);
    expect(w.use('phone')).toBe(true);
    expect(useWalletStore.getState().items).toEqual({ 'ice-pack': 0, phone: 1 });
  });
});
