import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastFace } from '../art/CastFace';
import { BandageIcon, HeartIcon, LockIcon, StarIcon } from '../art/icons';
import { Badge } from '../components/Badge';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { allRounds, simScenarios, upcomingScenarios } from '../data/sim';
import { TOPIC_EMOJI, TOPIC_LABELS } from '../data/topics';
import { CAST_NAMES } from '../features/sim/stageLayout';
import type { SimRound } from '../features/sim/types';
import { isRoundUnlocked, nextRoundToPlay } from '../features/sim/unlock';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';
import { useWalletStore } from '../store/wallet';

const DIFFICULTY = { 1: 'Cơ bản', 2: 'Trung bình', 3: 'Nâng cao' } as const;
/** Horizontal position (%) of each node on the winding path. */
const ZIGZAG = [26, 70, 34, 72, 28];
const NODE_GAP = 132;

export function Scenarios() {
  const navigate = useNavigate();
  const records = useProgressStore((s) => s.rounds);
  const bandages = useWalletStore((s) => s.bandages);
  const [selected, setSelected] = useState<SimRound | null>(null);
  const next = nextRoundToPlay(allRounds, records);

  return (
    <div>
      <PageHeader
        title="Bản đồ tình huống"
        subtitle="Hoàn thành round trước để mở khoá round sau."
        right={
          <span className="ink-border flex items-center gap-1 rounded-xl bg-paper py-0.5 pl-1 pr-2 font-display text-xl text-navy">
            <BandageIcon size={28} />
            {bandages}
          </span>
        }
      />
      <div className="space-y-5 px-4">
        {simScenarios.map((scenario) => {
          const totalStars = scenario.rounds.reduce(
            (n, r) => n + (records[r.id]?.bestStars ?? 0),
            0,
          );
          const height = scenario.rounds.length * NODE_GAP + 20;
          const pts = scenario.rounds.map((_, i) => ({
            x: ZIGZAG[i % ZIGZAG.length] as number,
            y: 64 + i * NODE_GAP,
          }));
          const d = pts
            .map((p, i) => {
              if (i === 0) return `M${p.x} ${p.y}`;
              const prev = pts[i - 1] as { x: number; y: number };
              const my = (prev.y + p.y) / 2;
              return `C${prev.x} ${my} ${p.x} ${my} ${p.x} ${p.y}`;
            })
            .join(' ');
          return (
            <section key={scenario.id} aria-labelledby={`sc-${scenario.id}`}>
              <Card tape className="flex items-center gap-3">
                <span
                  className="ink-border grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#fde3da] text-3xl"
                  aria-hidden
                >
                  {TOPIC_EMOJI[scenario.topic]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-muted">
                    Tình huống {scenario.number} · {scenario.location}
                  </p>
                  <h2 id={`sc-${scenario.id}`} className="font-display text-2xl text-navy">
                    {scenario.title}
                  </h2>
                </div>
                <span
                  className="flex items-center gap-0.5 font-display text-lg text-navy"
                  aria-label={`${totalStars} trên ${scenario.rounds.length * 3} sao`}
                >
                  <StarIcon size={24} />
                  {totalStars}/{scenario.rounds.length * 3}
                </span>
              </Card>

              <div className="relative" style={{ height }}>
                <svg
                  viewBox={`0 0 100 ${height}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden
                >
                  <path
                    d={d}
                    fill="none"
                    stroke="#3b2d26"
                    strokeWidth={14}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    opacity={0.85}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="#e9d3a6"
                    strokeWidth={9}
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
                <ol>
                  {scenario.rounds.map((round, i) => {
                    const p = pts[i] as { x: number; y: number };
                    const record = records[round.id];
                    const unlocked = isRoundUnlocked(allRounds, records, round.id);
                    const cleared = (record?.wins ?? 0) > 0;
                    const isNext = next?.id === round.id && unlocked;
                    const labelRight = p.x < 50;
                    return (
                      <li
                        key={round.id}
                        className="absolute"
                        style={{ left: `${p.x}%`, top: p.y, transform: 'translate(-50%, -50%)' }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => setSelected(round)}
                          aria-label={`Round ${round.code}: ${round.title}${unlocked ? '' : ' (đang khoá)'}`}
                          whileTap={{ scale: 0.92 }}
                          animate={isNext ? { y: [0, -6, 0] } : undefined}
                          transition={isNext ? { repeat: Infinity, duration: 1.4 } : undefined}
                          className={cn(
                            'ink-border relative grid h-[76px] w-[76px] place-items-center rounded-full font-display text-2xl shadow-pop',
                            !unlocked && 'bg-[#d8d1c2] text-navy/50',
                            unlocked && cleared && 'bg-accent text-navy',
                            unlocked && !cleared && 'bg-primary text-white',
                          )}
                        >
                          {unlocked ? round.code : <LockIcon size={34} />}
                        </motion.button>
                        <div className="mt-1 flex justify-center" aria-hidden>
                          {[1, 2, 3].map((s) => (
                            <StarIcon key={s} filled={(record?.bestStars ?? 0) >= s} size={18} />
                          ))}
                        </div>
                        <div
                          className={cn(
                            'absolute top-2 w-[128px]',
                            labelRight ? 'left-[88px]' : 'right-[88px] text-right',
                          )}
                        >
                          <p className="wood ink-border inline-block rounded-lg px-2 font-display text-[15px] leading-6 text-navy">
                            {round.title}
                          </p>
                          {isNext && (
                            <p className="mt-1 font-display text-sm text-primary-dark">
                              {record ? 'Thử lại nào!' : 'Bắt đầu ▸'}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </section>
          );
        })}

        <section aria-labelledby="upcoming" className="pb-2">
          <h2 id="upcoming" className="mb-2 font-display text-2xl text-navy">
            Sắp ra mắt
          </h2>
          <ul className="space-y-3">
            {upcomingScenarios.map((s) => (
              <li key={s.id}>
                <Card className="flex items-center gap-3 bg-[#efe9dc] opacity-90">
                  <LockIcon size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-muted">
                      Tình huống {s.number} · {s.location}
                    </p>
                    <p className="font-display text-xl text-navy">{s.title}</p>
                  </div>
                  <Badge tone="gray">{TOPIC_LABELS[s.topic]}</Badge>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BottomSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `Round ${selected.code}: ${selected.title}` : ''}
      >
        {selected && (
          <RoundDetails
            round={selected}
            unlocked={isRoundUnlocked(allRounds, records, selected.id)}
            onPlay={() => navigate(`/play/${selected.id}`)}
          />
        )}
      </BottomSheet>
    </div>
  );
}

function RoundDetails({
  round,
  unlocked,
  onPlay,
}: {
  round: SimRound;
  unlocked: boolean;
  onPlay: () => void;
}) {
  const record = useProgressStore((s) => s.rounds[round.id]);
  return (
    <div className="space-y-3">
      <p className="text-[15px] leading-relaxed text-ink">{round.summary}</p>
      <div className="flex flex-wrap gap-1.5">
        <Badge tone="yellow">Độ khó: {DIFFICULTY[round.difficulty]}</Badge>
        <Badge tone="navy">📍 {round.setting}</Badge>
        <Badge tone="red">{round.questions.length} câu hỏi</Badge>
      </div>
      <div>
        <p className="text-sm font-semibold text-muted">Nhân vật</p>
        <ul className="mt-1 flex gap-2">
          {round.cast.map((c) => (
            <li key={c} className="flex flex-col items-center text-xs font-semibold text-navy">
              <CastFace kind={c} size={44} />
              {CAST_NAMES[c]}
            </li>
          ))}
        </ul>
      </div>
      <div className="ink-border flex items-center justify-between rounded-2xl bg-cream px-3 py-2">
        <span className="flex items-center gap-1 text-sm text-navy">
          <HeartIcon size={22} /> Đúng: +1 tim · Sai 3 lần là thua
        </span>
        <span className="flex items-center gap-1 font-display text-lg text-navy">
          +{round.reward} <BandageIcon size={26} />
        </span>
      </div>
      {record && (
        <p className="text-sm text-muted">
          Đã chơi {record.plays} lần · Kỷ lục {record.bestScore} điểm · {record.bestStars}/3 sao
        </p>
      )}
      <Button size="lg" block disabled={!unlocked} onClick={onPlay}>
        {unlocked ? (record ? 'Chơi lại' : 'Bắt đầu') : 'Hoàn thành round trước để mở khoá'}
      </Button>
    </div>
  );
}
