import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { BandageIcon, BoltIcon, PhoneIcon, StarIcon } from '../art/icons';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { allRounds, getRound, nextRoundId, scenarioOf } from '../data/sim';
import { AdOverlay } from '../features/sim/AdOverlay';
import { BagSheet } from '../features/sim/BagSheet';
import {
  createRoundReducer,
  initialRoundState,
  MAX_BOLTS,
  RETRY_COST,
  roundScore,
  starsFor,
} from '../features/sim/engine';
import { ItemIcon } from '../features/sim/itemArt';
import { getItem, type ItemId } from '../features/sim/items';
import { NoseTap } from '../features/sim/NoseTap';
import { ExplainPanel, Hud, IntroPanel, QuestionPanel } from '../features/sim/panels';
import { PhoneDialer } from '../features/sim/PhoneDialer';
import { Shop } from '../features/sim/Shop';
import { Stage } from '../features/sim/Stage';
import { NOSE_TARGET } from '../features/sim/stageLayout';
import type { OptionId, SimRound, StageState } from '../features/sim/types';
import { isRoundUnlocked } from '../features/sim/unlock';
import { toDateKey } from '../lib/date';
import { playSound, vibrate } from '../lib/sound';
import { useProgressStore } from '../store/progress';
import { useWalletStore } from '../store/wallet';

export function Play() {
  const { id } = useParams();
  const round = getRound(id);
  const records = useProgressStore((s) => s.rounds);
  if (!round || !isRoundUnlocked(allRounds, records, round.id)) {
    return <Navigate to="/scenarios" replace />;
  }
  // Keyed so moving on to the next round starts from a clean state.
  return <RoundSession key={round.id} round={round} />;
}

const TASK_ITEM: Record<'ice-pack' | 'call-115', ItemId> = {
  'ice-pack': 'ice-pack',
  'call-115': 'phone',
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
  const [bagOpen, setBagOpen] = useState(false);
  const [ad, setAd] = useState<'double' | 'retry' | null>(null);
  const [dialing, setDialing] = useState(false);
  const [carrying, setCarrying] = useState<ItemId | null>(null);
  const [iceApplied, setIceApplied] = useState(false);
  const [claimed, setClaimed] = useState<number | null>(null);
  const recordedAttempt = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const question = round.questions[state.qIndex];
  const beat = state.phase === 'intro' ? round.intro[state.beat] : undefined;
  const task = state.phase === 'task' ? question?.task : undefined;
  const itemTask = task === 'ice-pack' || task === 'call-115' ? task : undefined;
  const taskItem = itemTask ? TASK_ITEM[itemTask] : null;
  const ownsTaskItem = taskItem ? (items[taskItem] ?? 0) > 0 : false;
  const score = roundScore(round, state.bolts);
  const stars = starsFor(state.bolts);
  const nextId = nextRoundId(round.id);
  const bagCount = Object.values(items).reduce((n, c) => n + (c ?? 0), 0);
  const stage = iceApplied ? { ...state.stage, icePack: true } : state.stage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.phase, state.qIndex]);

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
    }
  };

  const finishTask = (effect?: Partial<StageState>) => {
    setCarrying(null);
    setIceApplied(false);
    dispatch({ type: 'TASK_DONE', effect });
  };

  const applyIce = () => {
    if (!useWalletStore.getState().use('ice-pack')) return;
    setCarrying(null);
    setIceApplied(true);
    playSound('found');
  };

  const useItem = (id: ItemId) => {
    setBagOpen(false);
    if (id === 'ice-pack') setCarrying('ice-pack');
    if (id === 'phone' && useWalletStore.getState().use('phone')) setDialing(true);
  };

  const retry = (paid: boolean) => {
    if (paid && !useWalletStore.getState().spend(RETRY_COST)) return;
    setClaimed(null);
    dispatch({ type: 'RETRY' });
  };

  const claim = (amount: number) => {
    useWalletStore.getState().earn(amount);
    setClaimed(amount);
    playSound('found');
  };

  const onDragEnd = (point: { x: number; y: number }) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + (rect.width * NOSE_TARGET.x) / 100;
    const cy = rect.top + (rect.height * NOSE_TARGET.y) / 100;
    const r = (rect.width * NOSE_TARGET.r * 1.6) / 100;
    // framer-motion reports page coordinates; the rect is in viewport coordinates.
    const dx = point.x - window.scrollX - cx;
    const dy = point.y - window.scrollY - cy;
    if (dx * dx + dy * dy <= r * r) applyIce();
  };

  const pointAt =
    itemTask && !iceApplied && !carrying && !dialing && !bagOpen && !shopOpen
      ? ownsTaskItem
        ? 'bag'
        : 'shop'
      : null;

  return (
    <div className="paper flex min-h-dvh flex-col">
      <header className="safe-top px-3 pb-2">
        <Hud
          hearts={state.hearts}
          heartSlots={round.questions.length}
          bolts={state.bolts}
          onBack={() =>
            state.phase === 'won' || state.phase === 'lost'
              ? navigate('/scenarios')
              : setDialog('exit')
          }
          onHelp={() => setDialog('help')}
        />
        <p className="mt-1 truncate text-center font-display text-base text-navy">
          Tình huống {scenario?.number} · Round {round.code}: {round.title}
        </p>
      </header>

      <div className="px-3">
        <Stage
          ref={stageRef}
          cast={round.cast}
          stage={stage}
          speaker={beat?.kind === 'line' ? beat.speaker : null}
          line={beat?.kind === 'line' ? beat.text : null}
          caption={state.phase === 'explain' ? question?.caption : null}
          showCloseup={state.phase !== 'intro'}
          bandages={bandages}
          bagCount={bagCount}
          onOpenBag={() => setBagOpen(true)}
          onOpenShop={() => setShopOpen(true)}
          pointAt={pointAt}
          dropTarget={carrying === 'ice-pack'}
          onTargetTap={applyIce}
        >
          {carrying === 'ice-pack' && (
            <motion.div
              drag
              dragSnapToOrigin
              dragMomentum={false}
              onDragEnd={(_, info) => onDragEnd(info.point)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileDrag={{ scale: 1.15 }}
              className="absolute right-[17%] top-[20%] z-20 cursor-grab touch-none"
              aria-label="Túi đá chườm lạnh – kéo lên mũi em trai"
              role="img"
            >
              <ItemIcon id="ice-pack" size={58} />
            </motion.div>
          )}
        </Stage>
      </div>

      <main className="flex flex-1 flex-col px-4 pb-6 pt-3">
        {beat && (
          <IntroPanel
            beat={beat}
            onNext={() => dispatch({ type: 'NEXT_BEAT' })}
            onSkip={() => dispatch({ type: 'SKIP_INTRO' })}
            showSkip={replay}
          />
        )}
        {state.phase === 'question' && question && (
          <QuestionPanel
            question={question}
            index={state.qIndex}
            total={round.questions.length}
            wrongIds={state.wrongIds}
            onAnswer={answer}
          />
        )}
        {state.phase === 'explain' && question && (
          <ExplainPanel
            question={question}
            firstTry={state.firstTry[state.firstTry.length - 1] ?? false}
            onAck={() => dispatch({ type: 'ACK' })}
          />
        )}
        {task === 'nose-tap' && <NoseTap onDone={() => finishTask()} />}
        {itemTask && taskItem && (
          <ItemTaskPanel
            task={itemTask}
            item={taskItem}
            owned={ownsTaskItem}
            carrying={carrying === taskItem}
            applied={iceApplied}
            onSkip={() => finishTask()}
            onContinue={() => finishTask({ icePack: true })}
          />
        )}
      </main>

      {/* Lightning flash on a wrong answer */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={flash}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[1400] grid place-items-center bg-accent/40"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <motion.span
              initial={{ scale: 0.3, rotate: -20 }}
              animate={{ scale: 1.4, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <BoltIcon size={140} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <Shop
        open={shopOpen}
        onClose={() => setShopOpen(false)}
        highlight={taskItem && !ownsTaskItem ? taskItem : null}
        onBought={(id) => {
          if (id === taskItem) {
            setShopOpen(false);
            setBagOpen(true);
          }
        }}
      />
      <BagSheet
        open={bagOpen}
        onClose={() => setBagOpen(false)}
        usable={taskItem && !iceApplied ? [taskItem] : []}
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
        <p className="mt-1 text-center font-display text-xl text-navy">
          +{score} điểm xếp hạng · {state.bolts} tia sét
        </p>
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
              {nextId && (
                <Button size="lg" block onClick={() => navigate(`/play/${nextId}`)}>
                  Round tiếp theo ▸
                </Button>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => retry(false)}>
                  Chơi lại
                </Button>
                <Button variant="secondary" onClick={() => navigate('/scenarios')}>
                  Về bản đồ
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
        <p className="mt-2 text-center text-[15px] leading-relaxed text-ink">
          Bạn đã nhận đủ {MAX_BOLTS} tia sét nên thua round này. Dùng {RETRY_COST} băng gạc để chơi
          lại, hoặc xem quảng cáo để chơi lại miễn phí.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Button size="lg" block disabled={bandages < RETRY_COST} onClick={() => retry(true)}>
            Chơi lại · <BandageIcon size={28} /> {RETRY_COST}
          </Button>
          <Button size="lg" block variant="yellow" onClick={() => setAd('retry')}>
            ▶ Xem quảng cáo để chơi lại
          </Button>
          <Button variant="secondary" block onClick={() => navigate('/scenarios')}>
            Về bản đồ
          </Button>
        </div>
      </Modal>

      <Modal
        open={dialog === 'exit'}
        title="Thoát round?"
        tone="wood"
        onClose={() => setDialog(null)}
      >
        <p className="text-center text-ink">Tiến trình của round này sẽ không được lưu.</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => setDialog(null)}>
            Chơi tiếp
          </Button>
          <Button onClick={() => navigate('/scenarios')}>Thoát</Button>
        </div>
      </Modal>

      <Modal open={dialog === 'help'} title="Cách chơi" tone="wood" onClose={() => setDialog(null)}>
        <ul className="space-y-2 text-[15px] leading-relaxed text-ink">
          <li>❤️ Trả lời đúng: nhận 1 trái tim, đọc giải thích rồi bấm “Đã hiểu”.</li>
          <li>⚡ Trả lời sai: nhận 1 tia sét và chọn lại đến khi đúng.</li>
          <li>
            ⚡⚡⚡ Đủ {MAX_BOLTS} tia sét là thua – cần {RETRY_COST} băng gạc (hoặc xem quảng cáo)
            để chơi lại.
          </li>
          <li>🩹 Hoàn thành round để nhận băng gạc và mở khoá round tiếp theo.</li>
          <li>
            🏪 Dùng băng gạc mua vật dụng ở cửa hàng, rồi lấy từ túi vật dụng để dùng trong round.
          </li>
        </ul>
      </Modal>

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
  item,
  owned,
  carrying,
  applied,
  onSkip,
  onContinue,
}: {
  task: 'ice-pack' | 'call-115';
  item: ItemId;
  owned: boolean;
  carrying: boolean;
  applied: boolean;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const info = getItem(item);
  const steps =
    task === 'ice-pack'
      ? [
          `Mở Cửa hàng 🏪 và mua ${info.name} (${info.price} băng gạc).`,
          'Mở Túi vật dụng 🎒 và chọn túi đá.',
          'Kéo túi đá thả lên mũi em trai (hoặc chạm vào vòng tròn nhấp nháy).',
        ]
      : [
          `Mở Cửa hàng 🏪 và mua ${info.name} (${info.price} băng gạc).`,
          'Mở Túi vật dụng 🎒 và chọn điện thoại.',
          'Nhập số 115 trên bàn phím và bấm gọi.',
        ];
  const current = applied ? 3 : carrying ? 2 : owned ? 1 : 0;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-1 flex-col gap-3"
    >
      <div className="ink-border rounded-card bg-[#fff1c2] p-4 shadow-soft">
        <div className="flex items-center gap-2">
          {task === 'call-115' ? <PhoneIcon size={40} /> : <ItemIcon id="ice-pack" size={40} />}
          <p className="font-display text-xl leading-snug text-navy">
            {task === 'call-115'
              ? 'Hãy sử dụng điện thoại để gọi cấp cứu!'
              : 'Tương tác vật dụng: thử dùng túi chườm lạnh như bố gợi ý.'}
          </p>
        </div>
        <ol className="mt-3 space-y-1.5">
          {steps.map((s, i) => (
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
      {applied && (
        <p role="status" className="ink-border rounded-2xl bg-[#eef7e6] p-3 text-[15px] text-navy">
          Túi chườm lạnh chỉ là hỗ trợ tuỳ chọn – em trai vẫn tiếp tục bóp giữ phần mềm mũi.
        </p>
      )}
      <div className="mt-auto flex flex-col gap-2">
        {applied && (
          <Button size="lg" block variant="green" onClick={onContinue}>
            Tiếp tục ▸
          </Button>
        )}
        {task === 'ice-pack' && !applied && (
          <Button variant="secondary" block onClick={onSkip}>
            Bỏ qua (không bắt buộc)
          </Button>
        )}
      </div>
    </motion.div>
  );
}
