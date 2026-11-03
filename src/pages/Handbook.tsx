import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookIcon, CheckIcon, CrossIcon, LockIcon } from '../art/icons';
import { TopicArt } from '../art/TopicArt';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { DISCLAIMER } from '../data/copy';
import { HANDBOOK, HANDBOOK_UPCOMING, type HandbookArticle } from '../data/handbook';
import { cn } from '../lib/cn';
import { useMissionStore } from '../store/missions';

/** Cẩm nang sơ cứu: re-read what the scenarios taught (also a daily mission). */
export function Handbook() {
  const navigate = useNavigate();
  const markActivity = useMissionStore((s) => s.markActivity);
  const topic = HANDBOOK[0]!;
  const [articleId, setArticleId] = useState(topic.articles[0]!.id);
  const article = topic.articles.find((a) => a.id === articleId) as HandbookArticle;

  // Opening an article counts as "đọc lại cẩm nang" for today's mission.
  useEffect(() => {
    markActivity('handbook');
  }, [articleId, markActivity]);

  return (
    <div>
      <PageHeader title="Cẩm nang sơ cứu" subtitle="Ôn lại kiến thức đã học trong Core game." />
      <div className="mx-auto grid max-w-6xl gap-3 px-4 grid-cols-[180px_minmax(0,1fr)] @3xl:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Bài viết" className="space-y-2">
          <div className="ink-border overflow-hidden rounded-2xl bg-paper shadow-soft">
            <div className="relative h-20 border-b-[2.5px] border-navy">
              <TopicArt topic={topic.topic} className="absolute inset-0 h-full w-full" />
            </div>
            <p className="px-2 py-1 font-display text-lg text-navy">{topic.title}</p>
            <ul className="space-y-1 p-1.5 pt-0">
              {topic.articles.map((a, i) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setArticleId(a.id)}
                    aria-current={a.id === articleId ? 'page' : undefined}
                    className={cn(
                      'w-full rounded-xl px-2 py-1.5 text-left text-sm font-semibold',
                      a.id === articleId
                        ? 'ink-border bg-accent text-navy'
                        : 'text-navy hover:bg-cream',
                    )}
                  >
                    {i + 1}. {a.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {HANDBOOK_UPCOMING.map((u) => (
            <p
              key={u.topic}
              className="flex items-center gap-2 rounded-2xl border-2 border-navy/20 bg-black/5 px-2 py-1.5 text-sm font-semibold text-muted"
            >
              <LockIcon size={22} /> {u.title} · sắp có
            </p>
          ))}
          <Button variant="secondary" block onClick={() => navigate('/tutorial')}>
            📖 Cách chơi
          </Button>
        </nav>

        <motion.article
          key={article.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="ink-border rounded-card bg-paper p-4 shadow-soft"
        >
          <h2 className="flex items-center gap-2 font-display text-[26px] text-navy">
            <BookIcon size={34} /> {article.title}
          </h2>
          <ul className="mt-2 space-y-2">
            {article.points.map((p) => (
              <li key={p} className="flex gap-2 text-[16px] leading-relaxed text-ink">
                <CheckIcon size={24} className="mt-0.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          {article.avoid && (
            <>
              <h3 className="mt-4 font-display text-xl text-primary-dark">Không nên</h3>
              <ul className="mt-1 space-y-2">
                {article.avoid.map((p) => (
                  <li key={p} className="flex gap-2 text-[15px] leading-relaxed text-ink">
                    <CrossIcon size={22} className="mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mt-4 border-t-2 border-dashed border-navy/20 pt-2 text-xs text-muted">
            {DISCLAIMER}
          </p>
        </motion.article>
      </div>
    </div>
  );
}
