import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Stars } from '../components/Stars';
import { resolveScene } from '../data/assets';
import { scenarios } from '../data/scenarios';
import { TOPIC_LABELS } from '../data/topics';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';

const DIFFICULTY = { 1: 'Dễ', 2: 'Vừa', 3: 'Khó' } as const;

export function Scenarios() {
  const records = useProgressStore((s) => s.scenarios);

  return (
    <div>
      <PageHeader title="Tình huống" subtitle="Hoàn thành lần lượt để mở khóa màn tiếp theo." />
      <ol className="space-y-4 px-4">
        {scenarios.map((s, i) => {
          const record = records[s.id];
          const previous = scenarios[i - 1];
          const unlocked = i === 0 || Boolean(previous && records[previous.id]);
          const body = (
            <Card className={cn('flex gap-3 p-3', !unlocked && 'opacity-60')}>
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-cream">
                <img
                  src={resolveScene(s.background)}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className={cn('h-full w-full object-cover', !unlocked && 'blur-[2px] grayscale')}
                />
                {!unlocked && (
                  <span aria-hidden className="absolute inset-0 grid place-items-center text-3xl">
                    🔒
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-muted">
                  Màn {i + 1} · {s.location}
                </p>
                <h2 className="text-lg font-bold text-navy">{s.title}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <Badge tone="red">{TOPIC_LABELS[s.topic]}</Badge>
                  <Badge tone="yellow">Độ khó: {DIFFICULTY[s.difficulty]}</Badge>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  {unlocked ? (
                    <>
                      <Stars count={record?.bestStars ?? 0} />
                      <span className="text-sm font-semibold text-navy">
                        {record ? `${record.bestScore} điểm` : 'Chưa chơi'}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-muted">Hoàn thành màn trước để mở khóa</span>
                  )}
                </div>
              </div>
            </Card>
          );
          return (
            <li key={s.id}>
              {unlocked ? (
                <Link to={`/play/${s.id}`} className="block" aria-label={`Chơi: ${s.title}`}>
                  {body}
                </Link>
              ) : (
                <div>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
