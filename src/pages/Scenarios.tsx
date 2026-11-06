import { motion } from 'framer-motion';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CastFace } from '../art/CastFace';
import { BandageIcon, HelpIcon, LockIcon, StarIcon } from '../art/icons';
import { TopicArt } from '../art/TopicArt';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { ShopButton } from '../features/sim/ShopButton';
import { allRounds, simScenarios } from '../data/sim';
import { RoundGuide } from '../features/sim/RoundGuide';
import { CAST_NAMES } from '../features/sim/stageLayout';
import type { SimRound } from '../features/sim/types';
import { isRoundUnlocked, nextRoundToPlay } from '../features/sim/unlock';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';

const DIFFICULTY = { 1: 'Cơ bản', 2: 'Trung bình', 3: 'Nâng cao' } as const;
/** Vertical position (%) of each node on the winding path. */
const ZIGZAG = [62, 30, 62, 30, 62];

/** Level map of one topic: rounds laid out left → right on a winding path. */
export function Scenarios() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const records = useProgressStore((s) => s.rounds);
  const [selected, setSelected] = useState<SimRound | null>(null);
  const [guide, setGuide] = useState(false);
  const scenario = simScenarios.find((s) => s.id === scenarioId);
  if (!scenario) return <Navigate to="/core" replace />;

  const next = nextRoundToPlay(allRounds, records);
  const n = scenario.rounds.length;
  const pts = scenario.rounds.map((_, i) => ({
    x: n === 1 ? 50 : 14 + (i * 72) / (n - 1),
    y: ZIGZAG[i % ZIGZAG.length] as number,
  }));
  const d = pts
    .map((p, i) => {
      if (i === 0) return `M${p.x - 12} ${p.y + 20} Q${p.x - 6} ${p.y} ${p.x} ${p.y}`;
      const prev = pts[i - 1] as { x: number; y: number };
      const mx = (prev.x + p.x) / 2;
      return `C${mx} ${prev.y} ${mx} ${p.y} ${p.x} ${p.y}`;
    })
    .join(' ');
  const totalStars = scenario.rounds.reduce((s, r) => s + (records[r.id]?.bestStars ?? 0), 0);

  return (
    <div className="flex h-[calc(var(--app-h)-max(16px,env(safe-area-inset-bottom)))] flex-col">
      <PageHeader
        title={`${scenario.title}`}
        subtitle={`Tình huống ${scenario.number} · ${scenario.location} · ⭐ ${totalStars}/${n * 3}`}
        backTo="/core"
        right={<ShopButton />}
      />
      <div className="relative mx-3 mb-3 min-h-0 flex-1 overflow-hidden rounded-[24px] border-[2.5px] border-navy bg-[#cfe7b4]">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <path d="M0 78 C20 70 40 86 60 78 C80 70 90 82 100 76 V100 H0 Z" fill="#a9d48a" />
          <path d="M0 20 C25 28 45 10 70 18 C85 23 95 14 100 16 V0 H0 Z" fill="#dbeef6" />
          {[
            [6, 30],
            [32, 82],
            [58, 12],
            [92, 52],
            [72, 86],
          ].map(([x, y]) => (
            <ellipse
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              rx={4}
              ry={6}
              fill="#7fb862"
              stroke="#3b2d26"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path
            d={d}
            fill="none"
            stroke="#3b2d26"
            strokeWidth={16}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={0.85}
          />
          <path
            d={d}
            fill="none"
            stroke="#e9d3a6"
            strokeWidth={11}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={d}
            fill="none"
            stroke="#fffaf0"
            strokeWidth={2.5}
            strokeDasharray="8 10"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="ink-border absolute right-3 top-3 hidden h-[34%] w-[16%] min-w-[110px] overflow-hidden rounded-2xl bg-paper shadow-pop @xl:block">
          <TopicArt topic={scenario.topic} className="h-full w-full" />
        </div>

        <ol>
          {scenario.rounds.map((round, i) => {
            const p = pts[i] as { x: number; y: number };
            const record = records[round.id];
            const unlocked = isRoundUnlocked(allRounds, records, round.id);
            const cleared = (record?.wins ?? 0) > 0;
            const isNext = next?.id === round.id && unlocked;
            return (
              <li
                key={round.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -36px)' }}
              >
                <motion.button
                  type="button"
                  onClick={() => setSelected(round)}
                  aria-label={`Màn ${round.code}: ${round.title}${unlocked ? '' : ' (đang khoá)'}`}
                  whileTap={{ scale: 0.92 }}
                  animate={isNext ? { y: [0, -6, 0] } : undefined}
                  transition={isNext ? { repeat: Infinity, duration: 1.4 } : undefined}
                  className={cn(
                    'ink-border relative grid h-[72px] w-[72px] place-items-center rounded-full font-display text-2xl shadow-pop',
                    !unlocked && 'bg-[#d8d1c2] text-navy/50',
                    unlocked && cleared && 'bg-accent text-navy',
                    unlocked && !cleared && 'bg-primary text-white',
                  )}
                >
                  {unlocked ? round.code : <LockIcon size={34} />}
                </motion.button>
                <div className="mt-0.5 flex" aria-hidden>
                  {[1, 2, 3].map((s) => (
                    <StarIcon key={s} filled={(record?.bestStars ?? 0) >= s} size={18} />
                  ))}
                </div>
                <p className="wood ink-border mt-0.5 whitespace-nowrap rounded-lg px-2 font-display text-[15px] leading-6 text-navy">
                  {round.title}
                </p>
                {isNext && (
                  <p className="font-display text-sm text-primary-dark">
                    {record ? 'Thử lại nào!' : 'Bắt đầu ▸'}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `Màn ${selected.code}: ${selected.title}` : ''}
        tone="wood"
        size="lg"
      >
        {selected && (
          <RoundDetails
            round={selected}
            unlocked={isRoundUnlocked(allRounds, records, selected.id)}
            onPlay={() => navigate(`/play/${selected.id}`)}
            onGuide={() => setGuide(true)}
          />
        )}
      </Modal>
      <RoundGuide open={guide} onClose={() => setGuide(false)} />
    </div>
  );
}

function RoundDetails({
  round,
  unlocked,
  onPlay,
  onGuide,
}: {
  round: SimRound;
  unlocked: boolean;
  onPlay: () => void;
  onGuide: () => void;
}) {
  const record = useProgressStore((s) => s.rounds[round.id]);
  const prev = allRounds[allRounds.findIndex((r) => r.id === round.id) - 1];
  return (
    <div className="grid gap-3 @xl:grid-cols-[1.3fr_1fr]">
      <div className="space-y-2">
        <p className="text-[15px] leading-relaxed text-ink">{round.summary}</p>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="yellow">Độ khó: {DIFFICULTY[round.difficulty]}</Badge>
          <Badge tone="navy">📍 {round.setting}</Badge>
          <Badge tone="red">{round.questions.length} câu hỏi</Badge>
        </div>
        <ul className="flex gap-2">
          {round.cast.map((c) => (
            <li key={c} className="flex flex-col items-center text-xs font-semibold text-navy">
              <CastFace kind={c} size={40} />
              {CAST_NAMES[c]}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-2">
        <div className="ink-border overflow-hidden rounded-2xl bg-cream">
          <div className="flex items-center justify-between gap-2 bg-[#eef7e6] px-3 py-2">
            <span className="text-sm font-semibold text-navy">🏆 Thắng màn nhận</span>
            <span className="flex items-center gap-1 font-display text-xl text-success-dark">
              +{round.reward} <BandageIcon size={26} />
            </span>
          </div>
        </div>
        {record && (
          <p className="text-sm text-muted">
            Đã chơi {record.plays} lần · Kỷ lục {record.bestScore} điểm · {record.bestStars}/3 sao
          </p>
        )}
        <Button variant="secondary" block onClick={onGuide} className="mt-auto">
          <HelpIcon size={26} /> Hướng dẫn
        </Button>
        <Button size="lg" block disabled={!unlocked} onClick={onPlay}>
          {unlocked
            ? record
              ? 'Chơi lại'
              : 'Bắt đầu'
            : `Hoàn thành Màn ${prev?.code ?? 'trước'} để mở khoá`}
        </Button>
      </div>
    </div>
  );
}
