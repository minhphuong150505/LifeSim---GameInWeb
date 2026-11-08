import { allRounds, getRound, nextRoundId, simScenarios } from '../../data/sim';
import { ADS_PER_DAY, AD_BONUS, useWalletStore } from '../../store/wallet';
import {
  createRoundReducer,
  initialRoundState,
  MAX_BOLTS,
  roundReward,
  roundScore,
  stageAfterIntro,
  starsFor,
  STARTING_BANDAGES,
  type RoundAction,
  type RoundState,
} from './engine';
import { CHOKE_TASKS, CYCLE, taskEndState } from './chokingTaskLogic';
import { ART_KEYS } from './optionArt';
import type { OptionId, SimRound } from './types';
import { isRoundUnlocked, nextRoundToPlay } from './unlock';
import {
  BREATH_CARDS,
  BREATH_ORDER,
  CPR_TARGET,
  compressionCounts,
  RIGHT_FINDS,
  rhythmOf,
} from './waterTaskLogic';

const round = getRound('1-1') as SimRound;
const reducer = createRoundReducer(round);
const run = (state: RoundState, ...actions: RoundAction[]) => actions.reduce(reducer, state);
const wrongOf = (r: SimRound, i: number): OptionId[] => {
  const q = r.questions[i];
  return (q?.options ?? []).filter((o) => o.id !== q?.correctId).map((o) => o.id);
};
const rightOf = (r: SimRound, i: number) => r.questions[i]?.correctId as OptionId;

describe('bundled simulation data', () => {
  it('has scenarios 1 (nosebleed), 2 (drowning), 4 (choking) and 5 (burns), with the scripted rewards', () => {
    expect(simScenarios.map((s) => s.id)).toEqual(['nosebleed', 'drowning', 'choking', 'burns']);
    expect(allRounds.map((r) => r.code)).toEqual([
      '1.1',
      '1.2',
      '1.3',
      '2.1',
      '2.2',
      '2.3',
      '4.1',
      '4.2',
      '4.3',
      '5.1',
      '5.2',
      '5.3',
    ]);
    expect(allRounds.map((r) => r.reward)).toEqual([
      20, 25, 30, 20, 30, 40, 20, 25, 30, 20, 25, 30,
    ]);
    expect(allRounds.map((r) => r.questions.length)).toEqual([5, 5, 4, 3, 5, 7, 5, 5, 4, 5, 5, 5]);
    expect(nextRoundId('1-1')).toBe('1-2');
    expect(nextRoundId('1-3')).toBe('2-1');
    expect(nextRoundId('2-3')).toBe('4-1');
    expect(nextRoundId('4-3')).toBe('5-1');
    expect(nextRoundId('5-3')).toBeNull();
  });
  it('uses the burn answers from the script, in the kitchen', () => {
    const answers = (id: string) =>
      getRound(id)
        ?.questions.map((q) => q.correctId)
        .join('');
    expect(answers('5-1')).toBe('bcbbc');
    expect(answers('5-2')).toBe('bbcbb');
    expect(answers('5-3')).toBe('bbbcb');
    for (const r of allRounds.filter((x) => x.id.startsWith('5-'))) {
      expect(r.stage.scene).toBe('kitchen');
      expect(r.cast).toContain('sister');
    }
    // The large burn ends with the ambulance arriving.
    expect(getRound('5-3')?.questions.at(-1)?.effect?.ambulance).toBe(true);
  });
  it('uses the choking answers from the script, in the dining room', () => {
    const answers = (id: string) =>
      getRound(id)
        ?.questions.map((q) => q.correctId)
        .join('');
    expect(answers('4-1')).toBe('abccb');
    expect(answers('4-2')).toBe('bcbca');
    expect(answers('4-3')).toBe('bcbc');
    for (const r of allRounds.filter((x) => x.id.startsWith('4-'))) {
      expect(r.stage.scene).toBe('dining-room');
      expect(r.cast).toContain('brother');
      for (const q of r.questions) expect(q.hint).toBeTruthy();
    }
    expect(getRound('4-2')?.cast).toEqual(['brother', 'player', 'mom', 'dad', 'grandma']);
    expect(getRound('4-3')?.cast).toEqual(['brother', 'player', 'mom', 'dad']);
    // 4.3 starts with the brother collapsing and ends with him breathing, medics arriving.
    const r43 = getRound('4-3') as SimRound;
    expect(stageAfterIntro(r43).choke).toBe('down');
    expect(r43.questions.at(-1)?.effect).toMatchObject({ choke: 'breathing', ambulance: true });
    expect(getRound('4-2')?.questions.at(-1)?.taskTitle).toBe(
      'Hãy nhờ người thân gọi cấp cứu 115!',
    );
  });
  it('runs the back-blow and abdominal-thrust tasks as the script describes', () => {
    const blows = CHOKE_TASKS['back-blows'].steps;
    expect(blows.map((s) => s.kind)).toEqual(['choice', 'choice', 'spot', 'press']);
    const [stand, lean, spot, press] = blows;
    expect(stand?.kind === 'choice' && stand.correct).toBe('behind-side');
    expect(lean?.kind === 'choice' && lean.correct).toBe('forward');
    expect(spot?.kind === 'spot' && spot.choices.find((c) => c.id === spot.correct)?.text).toBe(
      'Giữa hai xương bả vai',
    );
    expect(press?.kind === 'press' && press.count).toBe(CYCLE);
    expect(taskEndState('back-blows')).toEqual({ rescuer: 'back', posture: 'forward' });

    const thrusts = CHOKE_TASKS['abdominal-thrusts'].steps;
    expect(thrusts.map((s) => s.kind)).toEqual(['choice', 'spot', 'press']);
    const tSpot = thrusts[1];
    expect(
      tSpot?.kind === 'spot' && tSpot.choices.find((c) => c.id === tSpot.correct)?.text,
    ).toContain('trên rốn, dưới xương sườn');
    expect(taskEndState('abdominal-thrusts')).toEqual({ rescuer: 'thrust', posture: 'upright' });
    for (const t of Object.values(CHOKE_TASKS)) {
      for (const s of t.steps) {
        if (s.kind === 'press') continue;
        expect(s.choices).toHaveLength(3);
        expect(s.choices.some((c) => c.id === s.correct)).toBe(true);
      }
    }
  });
  it('uses the drowning answers from the script', () => {
    const answers = (id: string) =>
      getRound(id)
        ?.questions.map((q) => q.correctId)
        .join('');
    expect(answers('2-1')).toBe('acc');
    expect(answers('2-2')).toBe('bbacb');
    expect(answers('2-3')).toBe('bacbacb');
    for (const r of allRounds.filter((x) => x.id.startsWith('2-'))) {
      expect(['pool', 'lake', 'shore']).toContain(r.stage.scene);
      for (const q of r.questions) expect(q.hint).toBeTruthy();
    }
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
    expect(tasks).toEqual([
      '1.2:nose-tap',
      '1.2:ice-pack',
      '1.3:call-115',
      '2.1:rescue-ring',
      '2.2:find-floats',
      '2.3:cpr-30',
      '2.3:breath-order',
      '4.2:back-blows',
      '4.2:abdominal-thrusts',
      '4.2:call-115',
      '4.3:call-115-speaker',
      '5.2:cling-wrap',
      '5.3:call-115',
    ]);
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
    // 3 mistakes = no bandages; only a cleared round pays out.
    expect(roundReward(round, s.phase)).toBe(0);
    expect(roundReward(round, 'won')).toBe(round.reward);
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

  it('plays story-beat scene changes and keeps them when the intro is skipped or replayed', () => {
    const r = getRound('2-2') as SimRound;
    const red = createRoundReducer(r);
    let s = initialRoundState(r);
    expect(s.stage).toMatchObject({ scene: 'lake', victim: 'swim', shot: 'wide' });
    s = red(red(s, { type: 'NEXT_BEAT' }), { type: 'NEXT_BEAT' });
    expect(s.stage.victim).toBe('struggle');
    const skipped = red(initialRoundState(r), { type: 'SKIP_INTRO' });
    expect(skipped.stage).toMatchObject({ victim: 'struggle', shot: 'focus' });
    const replay = red({ ...skipped, phase: 'lost' }, { type: 'RETRY' });
    expect(replay.stage).toEqual(skipped.stage);
  });

  it('counts a wrong move inside a task as a bolt and can lose the round', () => {
    const r = getRound('2-2') as SimRound;
    const red = createRoundReducer(r);
    let s = red(initialRoundState(r), { type: 'SKIP_INTRO' });
    s = red(s, { type: 'ANSWER', optionId: rightOf(r, 0) });
    s = red(s, { type: 'ACK' });
    s = red(s, { type: 'ANSWER', optionId: rightOf(r, 1) });
    s = red(s, { type: 'ACK' });
    expect(s.phase).toBe('task');
    expect(red(s, { type: 'MISTAKE' })).toMatchObject({ phase: 'task', bolts: 1 });
    s = red(red(red(s, { type: 'MISTAKE' }), { type: 'MISTAKE' }), { type: 'MISTAKE' });
    expect(s).toMatchObject({ phase: 'lost', bolts: 3 });
    // MISTAKE outside a task does nothing.
    expect(red(initialRoundState(r), { type: 'MISTAKE' }).bolts).toBe(0);
  });

  it('wins round 2.3 after the CPR and rescue-breath tasks', () => {
    const r = getRound('2-3') as SimRound;
    const red = createRoundReducer(r);
    let s = red(initialRoundState(r), { type: 'SKIP_INTRO' });
    r.questions.forEach((q, i) => {
      s = red(s, { type: 'ANSWER', optionId: rightOf(r, i) });
      s = red(s, { type: 'ACK' });
      if (q.task) s = red(s, { type: 'TASK_DONE' });
    });
    expect(s).toMatchObject({ phase: 'won', hearts: 7 });
    expect(s.stage).toMatchObject({ airway: true, mouthClear: true });
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
    expect(nextRoundToPlay(allRounds, { '1-1': win, '1-2': win, '1-3': win })?.id).toBe('2-1');
  });
});

describe('drowning tasks', () => {
  it('accepts compressions at about 100–120 per minute', () => {
    expect(compressionCounts(null)).toBe(true);
    expect(compressionCounts(545)).toBe(true); // 110/min
    expect(compressionCounts(1000)).toBe(false); // 60/min, too slow
    expect(compressionCounts(350)).toBe(false); // ~171/min, too fast
    expect([rhythmOf(null), rhythmOf(80), rhythmOf(110), rhythmOf(140)]).toEqual([
      'idle',
      'slow',
      'good',
      'fast',
    ]);
    expect(CPR_TARGET).toBe(30);
  });
  it('wants B → D → A → C for the rescue breaths and 2 floating objects', () => {
    expect(BREATH_ORDER).toEqual(['B', 'D', 'A', 'C']);
    expect(BREATH_CARDS.map((c) => c.id).sort()).toEqual(['A', 'B', 'C', 'D']);
    expect(RIGHT_FINDS).toEqual(['long-branch', 'plastic-box']);
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
  it('keeps the life ring after use (one is enough)', () => {
    const w = useWalletStore.getState();
    expect(w.buy('life-ring')).toBe(true);
    expect(w.buy('life-ring')).toBe(false);
    expect(w.use('life-ring')).toBe(true);
    expect(useWalletStore.getState().items['life-ring']).toBe(1);
  });
  it('sells cling film for 20 bandages and uses it up', () => {
    const w = useWalletStore.getState();
    expect(w.buy('cling-film')).toBe(true);
    expect(useWalletStore.getState().bandages).toBe(STARTING_BANDAGES - 20);
    expect(w.use('cling-film')).toBe(true);
    expect(useWalletStore.getState().items['cling-film']).toBe(0);
  });
  it('limits rewarded ads in the bandage bank per day', () => {
    const w = useWalletStore.getState();
    let total = 0;
    for (let i = 0; i < ADS_PER_DAY + 2; i += 1) total += useWalletStore.getState().watchAd();
    expect(total).toBe(ADS_PER_DAY * AD_BONUS);
    expect(useWalletStore.getState().adsLeft()).toBe(0);
    expect(useWalletStore.getState().bandages).toBe(STARTING_BANDAGES + ADS_PER_DAY * AD_BONUS);
    expect(w.adsLeft).toBeTypeOf('function');
  });
});
