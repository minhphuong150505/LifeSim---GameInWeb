import { motion } from 'framer-motion';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BandageIcon, BoltIcon, PhoneIcon, ShopIcon, StarIcon } from '../art/icons';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { allRounds, getRound, nextRoundId, scenarioOf } from '../data/sim';
import { AdOverlay } from '../features/sim/AdOverlay';
import { BagSheet } from '../features/sim/BagSheet';
import { BandageBank } from '../features/sim/BandageBank';
import { DragItem } from '../features/sim/DragItem';
import {
  createRoundReducer,
  initialRoundState,
  MAX_BOLTS,
  RETRY_COST,
  roundReward,
  roundScore,
  starsFor,
} from '../features/sim/engine';
import { ItemIcon } from '../features/sim/itemArt';
import type { ItemId } from '../features/sim/items';
import { NoseTap } from '../features/sim/NoseTap';
import {
  DialogueBox,
  ExplainPanel,
  Hud,
  MissionPopup,
  QuestionPanel,
  SidePanel,
  WrongPanel,
} from '../features/sim/panels';
import { LightningStrike } from '../features/sim/LightningStrike';
import { PhoneDialer } from '../features/sim/PhoneDialer';
import { RoundGuide } from '../features/sim/RoundGuide';
import { Shop } from '../features/sim/Shop';
import { Stage } from '../features/sim/Stage';
import { NOSE_POINT } from '../features/sim/stageLayout';
import { WaterStage, waterTarget } from '../features/sim/WaterStage';
import { RIGHT_FINDS } from '../features/sim/waterTaskLogic';
import { BreathOrderTask, CprTask, FindFloatsPanel } from '../features/sim/waterTasks';
import type { BankItemId } from '../art/WaterScenes';
import { useAmbience } from '../lib/ambience';
import type { CameraShot, OptionId, SimRound, SimTask, StageState } from '../features/sim/types';
import { isRoundUnlocked } from '../features/sim/unlock';
import { toDateKey } from '../lib/date';
import { playSound, vibrate } from '../lib/sound';
import { useMissionStore } from '../store/missions';
import { useProgressStore } from '../store/progress';
import { useWalletStore } from '../store/wallet';

export function Play() {
  const { id } = useParams();
  const round = getRound(id);
  const records = useProgressStore((s) => s.rounds);
  if (!round || !isRoundUnlocked(allRounds, records, round.id)) {
    return <Navigate to="/core" replace />;
  }
  // Keyed so moving on to the next round starts from a clean state.
  return <RoundSession key={round.id} round={round} />;
}

type ItemTask = 'ice-pack' | 'call-115' | 'rescue-ring';
const isItemTask = (t: SimTask | undefined): t is ItemTask =>
  t === 'ice-pack' || t === 'call-115' || t === 'rescue-ring';

/** Item tasks: what to use, the checklist, and the scene change once the item is applied. */
const ITEM_TASKS: Record<
  ItemTask,
  {
    item: ItemId;
    title: string;
    steps: string[];
    appliedText?: string;
    /** Shown on the stage as soon as the item is applied. */
    applied?: Partial<StageState>;
    /** Applied when the player continues. */
    done?: Partial<StageState>;
    optional?: boolean;
    /** The shop marks the right item (off when choosing it is the challenge). */
    hintItem: boolean;
  }
> = {
  'ice-pack': {
    item: 'ice-pack',
    title: 'Hãy dùng túi chườm lạnh cho em trai của bạn!',
    steps: [
      'Mua túi chườm ở Cửa hàng 🏪 (40 băng gạc).',
      'Lấy túi chườm trong Túi đồ 🎒.',
      'Kéo túi chườm lên mũi em trai.',
    ],
    appliedText: 'Tốt lắm! Em trai vẫn tiếp tục bóp giữ mũi nhé.',
    applied: { icePack: true },
    done: { icePack: true },
    optional: true,
    hintItem: true,
  },
  'call-115': {
    item: 'phone',
    title: 'Hãy gọi cấp cứu 115 cho em trai của bạn!',
    steps: [
      'Mua điện thoại ở Cửa hàng 🏪 (30 băng gạc).',
      'Lấy điện thoại trong Túi đồ 🎒.',
      'Bấm 115 và gọi.',
    ],
    done: { phone: true },
    hintItem: true,
  },
  'rescue-ring': {
    item: 'life-ring',
    title: 'Hãy tìm một phương tiện có thể giúp người gặp nạn nổi trên mặt nước!',
    steps: [
      'Mở Cửa hàng vật dụng 🏪 và chọn vật dụng phù hợp.',
      'Lấy vật dụng trong Túi đồ 🎒.',
      'Kéo phao tới người gặp nạn (hoặc chạm vào vòng tròn).',
    ],
    appliedText:
      'Tuyệt! Người gặp nạn đã bám được phao. Giữ chặt đầu dây – nhân viên cứu hộ đang chạy đến!',
    applied: { victim: 'float' },
    done: { victim: 'float', lifeguard: 'near' },
    hintItem: false,
  },
};

function RoundSession({ round }: { round: SimRound }) {
  const navigate = useNavigate();
  const scenario = scenarioOf(round.id);
  const reducer = useMemo(() => createRoundReducer(round), [round]);
  const [state, dispatch] = useReducer(reducer, round, initialRoundState);
  const bandages = useWalletStore((s) => s.bandages);
  const items = useWalletStore((s) => s.items);
  const recordRound = useProgressStore((s) => s.recordRound);
  const replay = useProgressStore((s) => (s.rounds[round.id]?.plays ?? 0) > 0);

  const [flash, setFlash] = useState(0);
  const [dialog, setDialog] = useState<'exit' | 'help' | null>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const [ad, setAd] = useState<'double' | 'retry' | null>(null);
  const [dialing, setDialing] = useState(false);
  const [carrying, setCarrying] = useState<ItemId | null>(null);
  const [iceApplied, setIceApplied] = useState(false);
  const [found, setFound] = useState<BankItemId[]>([]);
  const [wrongFinds, setWrongFinds] = useState<BankItemId[]>([]);
  const [lastWrong, setLastWrong] = useState<BankItemId | null>(null);
  const [compressions, setCompressions] = useState(0);
  const [claimed, setClaimed] = useState<number | null>(null);
  const [wrongPick, setWrongPick] = useState<OptionId | null>(null);
  const recordedAttempt = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const mapPath = `/core/${scenario?.id ?? ''}`;

  const question = round.questions[state.qIndex];
  const beat = state.phase === 'intro' ? round.intro[state.beat] : undefined;
  const task = state.phase === 'task' ? question?.task : undefined;
  const itemTask = isItemTask(task) ? task : undefined;
  const taskInfo = itemTask ? ITEM_TASKS[itemTask] : null;
  const taskItem = taskInfo?.item ?? null;
  const ownsTaskItem = taskItem ? (items[taskItem] ?? 0) > 0 : false;
  const score = roundScore(round, state.bolts);
  const stars = starsFor(state.bolts);
  const nextId = nextRoundId(round.id);
  const bagCount = Object.values(items).reduce((n, c) => n + (c ?? 0), 0);
  const stage =
    iceApplied && taskInfo?.applied ? { ...state.stage, ...taskInfo.applied } : state.stage;
  const water = stage.scene !== 'living-room';
  useAmbience(round.ambience);

  // Persist the result once per attempt, as soon as the round ends.
  useEffect(() => {
    if (state.phase !== 'won' && state.phase !== 'lost') return;
    if (recordedAttempt.current === state.attempt || !scenario) return;
    recordedAttempt.current = state.attempt;
    const won = state.phase === 'won';
    const firstTries = state.firstTry.filter(Boolean).length;
    recordRound({
      roundId: round.id,
      topic: scenario.topic,
      won,
      score: won ? score : 0,
      stars: won ? stars : 0,
      correct: firstTries,
      // A lost round also counts the question it was lost on.
      total: state.firstTry.length + (won ? 0 : 1),
      date: toDateKey(),
    });
    useMissionStore.getState().markActivity('played');
    playSound(won ? 'win' : 'wrong');
  }, [state.phase, state.attempt, state.firstTry, round.id, scenario, score, stars, recordRound]);

  const answer = (id: OptionId) => {
    if (!question) return;
    dispatch({ type: 'ANSWER', optionId: id });
    if (id === question.correctId) {
      playSound('correct');
    } else {
      playSound('wrong');
      vibrate(150);
      setFlash((f) => f + 1);
      setWrongPick(id);
    }
  };

  const resetTaskState = () => {
    setCarrying(null);
    setIceApplied(false);
    setFound([]);
    setWrongFinds([]);
    setLastWrong(null);
    setCompressions(0);
  };

  const finishTask = (effect?: Partial<StageState>) => {
    resetTaskState();
    dispatch({ type: 'TASK_DONE', effect });
  };

  /** Drops the carried item (ice pack on the nose, life ring to the person in the water). */
  const applyItem = () => {
    if (!carrying || !useWalletStore.getState().use(carrying)) return;
    setCarrying(null);
    setIceApplied(true);
    playSound('found');
  };

  const useItem = (id: ItemId) => {
    setBagOpen(false);
    if (id === 'ice-pack' || id === 'life-ring') setCarrying(id);
    if (id === 'phone' && useWalletStore.getState().use('phone')) setDialing(true);
  };

  const mistake = () => {
    dispatch({ type: 'MISTAKE' });
    playSound('wrong');
    vibrate(150);
    setFlash((f) => f + 1);
  };

  const pickBankItem = (id: BankItemId) => {
    if (RIGHT_FINDS.includes(id)) {
      setFound((f) => (f.includes(id) ? f : [...f, id]));
      setLastWrong(null);
      playSound('found');
    } else {
      setWrongFinds((w) => [...w, id]);
      setLastWrong(id);
      mistake();
    }
  };

  const retry = (paid: boolean) => {
    if (paid && !useWalletStore.getState().spend(RETRY_COST)) return;
    setClaimed(null);
    setWrongPick(null);
    resetTaskState();
    dispatch({ type: 'RETRY' });
  };

  const claim = (amount: number) => {
    // Bandages are only for a cleared round: losing (3 bolts) never pays out.
    if (roundReward(round, state.phase) === 0 || claimed !== null) return;
    useWalletStore.getState().earn(amount);
    setClaimed(amount);
    playSound('found');
  };

  /** Is a screen point (viewport px) over the drop target? Generous radius for fingers. */
  const isOverTarget = (point: { x: number; y: number }) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    const target = water ? waterTarget(stage) : NOSE_POINT;
    if (!svg || !ctm || !target) return false;
    // Map the target (scene units) to viewport pixels through the zoomed viewBox.
    const p = svg.createSVGPoint();
    p.x = target.x;
    p.y = target.y;
    const nose = p.matrixTransform(ctm);
    const r = target.r * 2.4 * Math.hypot(ctm.a, ctm.b);
    const dx = point.x - nose.x;
    const dy = point.y - nose.y;
    return dx * dx + dy * dy <= r * r;
  };

  const pointAt =
    itemTask && !iceApplied && !carrying && !dialing && !bagOpen && !shopOpen && !bankOpen
      ? ownsTaskItem
        ? 'bag'
        : 'shop'
      : null;

  const sidePanel =
    (state.phase === 'question' && question) ||
    (state.phase === 'explain' && question) ||
    state.phase === 'task';
  const compactPanel = task === 'find-floats';
  const shot: CameraShot =
    state.phase === 'intro'
      ? stage.shot
      : task === 'find-floats'
        ? 'bank'
        : task === 'cpr-30'
          ? 'chest'
          : task === 'breath-order'
            ? 'face'
            : 'focus';
  const lastScenarioRound = scenario?.rounds.at(-1)?.id === round.id;
  const nextScenario = nextId && lastScenarioRound ? scenarioOf(nextId) : undefined;

  const dragged = carrying && (
    <DragItem
      isOverTarget={isOverTarget}
      onDrop={applyItem}
      className="absolute left-[36%] top-[50%] z-30"
      label={
        carrying === 'life-ring'
          ? 'Phao cứu sinh – kéo tới người gặp nạn'
          : 'Túi đá chườm lạnh – kéo lên mũi em trai'
      }
    >
      <ItemIcon id={carrying} size={72} />
    </DragItem>
  );

  return (
    <div className="relative h-app overflow-hidden">
      {water ? (
        <WaterStage
          ref={svgRef}
          cast={round.cast}
          stage={stage}
          speaker={beat?.kind === 'line' ? beat.speaker : null}
          shot={shot}
          focusX={sidePanel ? (compactPanel ? 0.32 : 0.25) : 0.5}
          dropTarget={carrying === 'life-ring'}
          onTargetTap={applyItem}
          bankPick={
            task === 'find-floats' ? { found, wrong: wrongFinds, onPick: pickBankItem } : undefined
          }
          compressions={compressions}
        >
          {dragged}
        </WaterStage>
      ) : (
        <Stage
          ref={svgRef}
          cast={round.cast}
          stage={stage}
          speaker={beat?.kind === 'line' ? beat.speaker : null}
          mode={state.phase === 'intro' ? 'wide' : 'focus'}
          focusX={sidePanel ? 0.25 : 0.5}
          showCloseup={state.phase !== 'intro'}
          dropTarget={carrying === 'ice-pack'}
          onTargetTap={applyItem}
        >
          {dragged}
        </Stage>
      )}

      <Hud
        title={`Tình huống ${scenario?.number} · Màn ${round.code}: ${round.title}`}
        hearts={state.hearts}
        heartSlots={round.questions.length}
        bolts={state.bolts}
        clock={stage.clock}
        bagCount={bagCount}
        pointAt={pointAt}
        onBack={() =>
          state.phase === 'won' || state.phase === 'lost' ? navigate(mapPath) : setDialog('exit')
        }
        onHelp={() => setDialog('help')}
        onBag={() => setBagOpen(true)}
        onShop={() => setShopOpen(true)}
        onBank={() => setBankOpen(true)}
      />

      {beat && beat.kind !== 'mission' && (
        <DialogueBox
          beat={beat}
          onNext={() => dispatch({ type: 'NEXT_BEAT' })}
          onSkip={() => dispatch({ type: 'SKIP_INTRO' })}
          showSkip={replay}
        />
      )}
      {beat?.kind === 'mission' && (
        <MissionPopup text={beat.text} onStart={() => dispatch({ type: 'NEXT_BEAT' })} />
      )}

      {state.phase === 'question' && question && (
        <SidePanel label="Câu hỏi">
          {wrongPick ? (
            <WrongPanel question={question} picked={wrongPick} onRetry={() => setWrongPick(null)} />
          ) : (
            <QuestionPanel
              question={question}
              index={state.qIndex}
              total={round.questions.length}
              wrongIds={state.wrongIds}
              onAnswer={answer}
            />
          )}
        </SidePanel>
      )}
      {state.phase === 'explain' && question && (
        <SidePanel label="Giải thích">
          <ExplainPanel
            question={question}
            firstTry={state.firstTry[state.firstTry.length - 1] ?? false}
            onAck={() => dispatch({ type: 'ACK' })}
          />
        </SidePanel>
      )}
      {state.phase === 'task' && (
        <SidePanel label="Nhiệm vụ tương tác" compact={compactPanel}>
          {task === 'nose-tap' && <NoseTap onDone={() => finishTask()} />}
          {itemTask && (
            <ItemTaskPanel
              task={itemTask}
              owned={ownsTaskItem}
              carrying={carrying === taskItem}
              applied={iceApplied}
              onSkip={() => finishTask()}
              onContinue={() => finishTask(ITEM_TASKS[itemTask].done)}
            />
          )}
          {task === 'find-floats' && (
            <FindFloatsPanel
              found={found}
              lastWrong={lastWrong}
              onDone={() => finishTask({ victim: 'float' })}
            />
          )}
          {task === 'cpr-30' && <CprTask onPress={setCompressions} onDone={() => finishTask()} />}
          {task === 'breath-order' && <BreathOrderTask onDone={() => finishTask()} />}
        </SidePanel>
      )}

      {/* A big lightning bolt strikes down on a wrong answer */}
      <LightningStrike strike={flash} />

      <Shop
        open={shopOpen}
        onClose={() => setShopOpen(false)}
        onOpenBank={() => {
          setShopOpen(false);
          setBankOpen(true);
        }}
        highlight={taskItem && !ownsTaskItem && taskInfo?.hintItem ? taskItem : null}
        itemIds={itemTask === 'rescue-ring' ? ['life-ring'] : scenario?.shopItems}
        decoys={itemTask === 'rescue-ring' && !ownsTaskItem}
        onBought={(id) => {
          if (id === taskItem) {
            setShopOpen(false);
            setBagOpen(true);
          }
        }}
      />
      <BandageBank inGame open={bankOpen} onClose={() => setBankOpen(false)} />
      <BagSheet
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        usable={taskItem && !iceApplied && !carrying ? [taskItem] : []}
        onUse={useItem}
        onOpenShop={() => {
          setBagOpen(false);
          setShopOpen(true);
        }}
      />
      <PhoneDialer
        open={dialing}
        onDone={() => {
          setDialing(false);
          finishTask({ phone: true });
        }}
      />

      <Modal open={state.phase === 'won'} title="Thành công rồi!" tone="red" sparkle>
        <div className="flex justify-center gap-1" role="img" aria-label={`${stars}/3 sao`}>
          {[1, 2, 3].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }}
            >
              <StarIcon filled={i <= stars} size={46} />
            </motion.span>
          ))}
        </div>
        <p className="mt-1 text-center font-display text-xl text-navy">+{score} điểm xếp hạng</p>
        {claimed === null ? (
          <>
            <p className="mt-2 text-center text-[15px] leading-relaxed text-ink">
              Bạn có muốn nhân đôi phần thưởng của mình không?
              <br />
              Xem một quảng cáo để có thêm băng gạc!
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="gray"
                className="min-h-16 px-2 text-xl"
                onClick={() => claim(round.reward)}
              >
                <span className="flex flex-col items-center">
                  Nhận
                  <span className="flex items-center gap-1">
                    <BandageIcon size={28} />x{round.reward}
                  </span>
                </span>
              </Button>
              <Button
                variant="yellow"
                className="min-h-16 px-2 text-xl"
                onClick={() => setAd('double')}
              >
                <span className="flex flex-col items-center">
                  ▶ Nhân đôi
                  <span className="flex items-center gap-1">
                    <BandageIcon size={28} />x{round.reward * 2}
                  </span>
                </span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 flex items-center justify-center gap-1 font-display text-2xl text-success-dark">
              Đã nhận +{claimed} <BandageIcon size={30} />
            </p>
            {!nextId && (
              <p className="mt-1 text-center text-sm text-ink">
                Bạn đã hoàn thành Tình huống {scenario?.number}: {scenario?.title}! Các tình huống
                mới sắp ra mắt.
              </p>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {nextScenario && (
                <p className="text-center text-sm text-ink">
                  Bạn đã hoàn thành Tình huống {scenario?.number}: {scenario?.title}!
                </p>
              )}
              {nextId && (
                <Button size="lg" block onClick={() => navigate(`/play/${nextId}`)}>
                  {nextScenario
                    ? `Tình huống ${nextScenario.number}: ${nextScenario.title} ▸`
                    : 'Màn tiếp theo ▸'}
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => retry(false)}>
                  Chơi lại
                </Button>
                <Button variant="secondary" onClick={() => navigate(mapPath)}>
                  Về bản đồ màn
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <Modal open={state.phase === 'lost'} title="Ôi không!" tone="navy">
        <div className="flex justify-center" role="img" aria-label={`${MAX_BOLTS} tia sét`}>
          {Array.from({ length: MAX_BOLTS }, (_, i) => (
            <BoltIcon key={i} size={44} />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Button size="lg" block disabled={bandages < RETRY_COST} onClick={() => retry(true)}>
            Chơi lại · <BandageIcon size={28} /> {RETRY_COST}
          </Button>
          <Button size="lg" block variant="yellow" onClick={() => setAd('retry')}>
            ▶ Xem quảng cáo để chơi lại
          </Button>
          <Button variant="secondary" block onClick={() => navigate(mapPath)}>
            Thoát
          </Button>
        </div>
      </Modal>

      <Modal
        open={dialog === 'exit'}
        title="Thoát màn chơi?"
        tone="wood"
        onClose={() => setDialog(null)}
      >
        <p className="text-center text-ink">Tiến trình của màn này sẽ không được lưu.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => setDialog(null)}>
            Chơi tiếp
          </Button>
          <Button onClick={() => navigate(mapPath)}>Thoát</Button>
        </div>
      </Modal>

      <RoundGuide open={dialog === 'help'} onClose={() => setDialog(null)} />

      <AdOverlay
        open={ad !== null}
        reward={ad === 'double' ? `x${round.reward * 2} băng gạc` : 'Chơi lại miễn phí'}
        onCancel={() => setAd(null)}
        onFinish={() => {
          if (ad === 'double') claim(round.reward * 2);
          if (ad === 'retry') retry(false);
          setAd(null);
        }}
      />
    </div>
  );
}

function ItemTaskPanel({
  task,
  owned,
  carrying,
  applied,
  onSkip,
  onContinue,
}: {
  task: ItemTask;
  owned: boolean;
  carrying: boolean;
  applied: boolean;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const info = ITEM_TASKS[task];
  const current = applied ? 3 : carrying ? 2 : owned ? 1 : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-3 short:gap-1.5"
    >
      <div className="ink-border rounded-card bg-[#fff1c2] p-4 shadow-soft short:rounded-xl short:p-2">
        <div className="flex items-center gap-2 short:[&>svg]:h-7 short:[&>svg]:w-7">
          {task === 'call-115' ? (
            <PhoneIcon size={40} />
          ) : task === 'ice-pack' ? (
            <ItemIcon id="ice-pack" size={40} />
          ) : (
            <ShopIcon size={40} />
          )}
          <p className="font-display text-xl leading-snug text-navy short:text-[15px] short:leading-tight">
            {info.title}
          </p>
        </div>
        <ol className="mt-3 space-y-1.5 short:mt-1 short:space-y-0.5 short:[&>li]:text-[12px] short:[&>li]:leading-snug">
          {info.steps.map((s, i) => (
            <li
              key={s}
              className={
                i < current
                  ? 'text-sm text-success-dark line-through'
                  : i === current
                    ? 'text-[15px] font-bold text-navy'
                    : 'text-sm text-muted'
              }
            >
              {i < current ? '✓' : `${i + 1}.`} {s}
            </li>
          ))}
        </ol>
      </div>
      {applied && info.appliedText && (
        <p
          role="status"
          className="ink-border rounded-2xl bg-[#eef7e6] p-3 text-[15px] text-navy short:p-1.5 short:text-[12px]"
        >
          {info.appliedText}
        </p>
      )}
      <div className="flex flex-col gap-2 short:gap-1">
        {applied && (
          <Button size="lg" block variant="green" onClick={onContinue}>
            Tiếp tục ▸
          </Button>
        )}
        {info.optional && !applied && (
          <Button variant="secondary" block onClick={onSkip}>
            Bỏ qua (không bắt buộc)
          </Button>
        )}
      </div>
    </motion.div>
  );
}
