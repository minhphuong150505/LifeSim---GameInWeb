import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LockIcon, StarIcon } from '../art/icons';
import { TopicArt } from '../art/TopicArt';
import { PageHeader } from '../components/PageHeader';
import { simScenarios, upcomingScenarios } from '../data/sim';
import type { Topic } from '../data/topics';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';

type CardInfo = {
  id: string;
  number: number;
  title: string;
  topic: Topic;
  location: string;
  locked: boolean;
  rounds: number;
  stars: number;
  cleared: number;
  tone: string;
};

const TONES = ['#ec6a4c', '#7cb8e4', '#ffd23f', '#86c06c', '#c49be0'];

/** Core game: pick a topic (illustrated cards); locked topics are shown as "coming soon". */
export function CoreTopics() {
  const navigate = useNavigate();
  const records = useProgressStore((s) => s.rounds);

  const cards: CardInfo[] = [
    ...simScenarios.map((s, i) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      topic: s.topic,
      location: s.location,
      locked: false,
      rounds: s.rounds.length,
      stars: s.rounds.reduce((n, r) => n + (records[r.id]?.bestStars ?? 0), 0),
      cleared: s.rounds.filter((r) => (records[r.id]?.wins ?? 0) > 0).length,
      tone: TONES[i % TONES.length] as string,
    })),
    ...upcomingScenarios.map((s, i) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      topic: s.topic,
      location: s.location,
      locked: true,
      rounds: 0,
      stars: 0,
      cleared: 0,
      tone: TONES[(simScenarios.length + i) % TONES.length] as string,
    })),
  ];

  return (
    <div className="flex min-h-app flex-col">
      <PageHeader title="Core game" subtitle="Chọn một chủ đề để xem các màn chơi." />
      <ul
        className="scroll-row mx-auto flex w-full max-w-6xl flex-1 items-stretch gap-3 overflow-x-auto px-4 pb-3"
        aria-label="Chủ đề"
      >
        {cards.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="flex w-[clamp(170px,24vw,240px)] shrink-0"
          >
            <button
              type="button"
              disabled={c.locked}
              onClick={() => navigate(`/core/${c.id}`)}
              aria-label={`Tình huống ${c.number}: ${c.title}${c.locked ? ' (đang khoá)' : ''}`}
              className={cn(
                'ink-border relative flex w-full flex-col overflow-hidden rounded-[22px] text-left shadow-pop transition-transform',
                !c.locked && 'active:translate-y-0.5',
              )}
              style={{ backgroundColor: c.tone }}
            >
              <p className="px-3 pt-2 text-center font-display text-[22px] leading-tight text-navy">
                {c.title}
              </p>
              <div className="ink-border relative mx-2 mt-1 min-h-[110px] flex-1 overflow-hidden rounded-2xl bg-paper">
                <TopicArt
                  topic={c.topic}
                  className={cn('absolute inset-0 h-full w-full', c.locked && 'grayscale')}
                />
                {c.locked && (
                  <div className="absolute inset-0 grid place-items-center bg-navy/45">
                    <span className="flex flex-col items-center">
                      <LockIcon size={52} />
                      <span className="ink-border mt-1 rounded-full bg-paper px-2 font-display text-sm text-navy">
                        Sắp ra mắt
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="px-3 pb-2 pt-1.5">
                <p className="text-xs font-semibold text-navy/80">
                  Tình huống {c.number} · {c.location}
                </p>
                {c.locked ? (
                  <p className="font-display text-base text-navy/80">Chủ đề đang bị khoá</p>
                ) : (
                  <p className="flex items-center gap-1 font-display text-base text-navy">
                    <StarIcon size={20} /> {c.stars}/{c.rounds * 3}
                    <span className="ml-auto text-sm">
                      {c.cleared}/{c.rounds} màn
                    </span>
                  </p>
                )}
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
