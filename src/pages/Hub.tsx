import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { COURSES, type Course } from '../data/courses';
import { ALL_TOPICS, TOPIC_EMOJI, TOPIC_LABELS, type Topic } from '../data/topics';
import { CourseCover } from '../features/courses/CourseBanner';
import { weakestTopic } from '../features/hub/hubLogic';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';

const MODES = [
  { label: 'Tất cả', value: null },
  { label: 'Trực tiếp', value: 'Trực tiếp' },
  { label: 'Trực tuyến', value: 'Trực tuyến' },
  { label: 'Kết hợp', value: 'Kết hợp' },
] as const;
const BUDGETS = [
  { label: 'Tất cả', value: null },
  { label: 'Miễn phí', value: 0 },
  { label: '≤ 500k', value: 500_000 },
  { label: '≤ 1 triệu', value: 1_000_000 },
] as const;
type Filters = { mode: Course['mode'] | null; budget: number | null; topic: Topic | null };
const EMPTY_FILTERS: Filters = { mode: null, budget: null, topic: null };

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-10 shrink-0 whitespace-nowrap rounded-full border-2 px-3 text-sm font-semibold',
        active ? 'border-navy bg-navy text-white' : 'border-navy/40 bg-paper text-navy',
      )}
    >
      {children}
    </button>
  );
}

type FilterKey = keyof Filters;
const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'mode', label: 'Hình thức' },
  { key: 'budget', label: 'Ngân sách' },
  { key: 'topic', label: 'Nhu cầu' },
];

/** Label of the value picked for one filter (shown on its button), or null for "Tất cả". */
function activeLabel(key: FilterKey, f: Filters): string | null {
  if (key === 'mode') return f.mode;
  if (key === 'budget')
    return BUDGETS.find((b) => b.value === f.budget && b.value !== null)?.label ?? null;
  return f.topic ? TOPIC_LABELS[f.topic] : null;
}

/**
 * Practice Hub: every first-aid course as a card. Tapping a card opens the course's own
 * detail page (its back button returns here; the Hub's back button returns to the lobby).
 */
export function Hub() {
  const navigate = useNavigate();
  const topicStats = useProgressStore((s) => s.topicStats);
  const focusTopic = useMemo(() => weakestTopic(topicStats), [topicStats]);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);

  const list = useMemo(() => {
    const shown = COURSES.filter(
      (c) =>
        (filters.mode === null || c.mode === filters.mode) &&
        (filters.budget === null || (c.priceVnd !== null && c.priceVnd <= filters.budget)) &&
        (filters.topic === null || c.topics.includes(filters.topic)),
    );
    // Partner courses with a banner always lead, then courses teaching the player's
    // weakest topic, then the newest ("Khoá mới nhất").
    const rank = (c: Course) =>
      (c.banner ? 0 : 4) +
      (focusTopic && c.topics.includes(focusTopic) ? 0 : 2) +
      (c.isNew ? 0 : 1);
    return [...shown].sort((a, b) => rank(a) - rank(b));
  }, [filters, focusTopic]);
  const activeCount = Object.values(filters).filter((v) => v !== null).length;

  return (
    <div>
      <PageHeader title="Practice Hub" subtitle="Tìm khoá học sơ cứu thực tế phù hợp với bạn." />
      <div className="mx-auto max-w-6xl space-y-3 px-4">
        <div className="flex flex-wrap items-center gap-2">
          {FILTER_TABS.map((t) => {
            const value = activeLabel(t.key, filters);
            const open = openFilter === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setOpenFilter(open ? null : t.key)}
                aria-expanded={open}
                aria-controls="hub-filters"
                className={cn(
                  'ink-border flex min-h-11 items-center gap-1.5 rounded-2xl px-3.5 font-display text-[17px] shadow-pop active:translate-y-0.5',
                  open || value ? 'bg-navy text-white' : 'bg-paper text-navy',
                )}
              >
                {t.label}
                {value && (
                  <span className="font-sans text-sm font-semibold opacity-85">· {value}</span>
                )}
                <span aria-hidden className="text-sm">
                  {open ? '▲' : '▼'}
                </span>
              </button>
            );
          })}
          {activeCount > 0 && (
            <Button variant="ghost" onClick={() => setFilters(EMPTY_FILTERS)}>
              Xoá lọc
            </Button>
          )}
          <h2 className="ml-auto font-display text-xl text-navy" aria-live="polite">
            {list.length} khoá học
          </h2>
        </div>

        <AnimatePresence initial={false}>
          {openFilter && (
            <motion.div
              id="hub-filters"
              key={openFilter}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-3">
                <div
                  role="group"
                  aria-label={FILTER_TABS.find((t) => t.key === openFilter)?.label}
                  className="flex flex-wrap gap-1.5"
                >
                  {openFilter === 'mode' &&
                    MODES.map((m) => (
                      <Chip
                        key={m.label}
                        active={filters.mode === m.value}
                        onClick={() => setFilters((f) => ({ ...f, mode: m.value }))}
                      >
                        {m.label}
                      </Chip>
                    ))}
                  {openFilter === 'budget' &&
                    BUDGETS.map((b) => (
                      <Chip
                        key={b.label}
                        active={filters.budget === b.value}
                        onClick={() => setFilters((f) => ({ ...f, budget: b.value }))}
                      >
                        {b.label}
                      </Chip>
                    ))}
                  {openFilter === 'topic' && (
                    <>
                      <Chip
                        active={filters.topic === null}
                        onClick={() => setFilters((f) => ({ ...f, topic: null }))}
                      >
                        Tất cả
                      </Chip>
                      {ALL_TOPICS.map((t) => (
                        <Chip
                          key={t}
                          active={filters.topic === t}
                          onClick={() => setFilters((f) => ({ ...f, topic: t }))}
                        >
                          <span aria-hidden>{TOPIC_EMOJI[t]} </span>
                          {TOPIC_LABELS[t]}
                        </Chip>
                      ))}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {list.length === 0 && (
          <Card className="text-center text-sm text-muted">
            Không có khoá nào khớp bộ lọc. Hãy chọn hình thức, ngân sách hoặc nhu cầu khác.
          </Card>
        )}
        <ul className="grid grid-cols-2 gap-4 pb-2">
          {list.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => navigate(`/course/${c.id}`)}
                className="ink-border flex h-full w-full flex-col overflow-hidden rounded-card bg-paper text-left shadow-pop active:translate-y-0.5"
              >
                <span
                  className="relative block aspect-[4/3] w-full overflow-hidden border-b-[2.5px] border-navy"
                  style={{ backgroundColor: c.tone }}
                >
                  <span className="absolute inset-0">
                    <CourseCover course={c} />
                  </span>
                  <span className="absolute left-2 top-2 flex gap-1">
                    {focusTopic && c.topics.includes(focusTopic) && (
                      <Badge tone="red">🎯 Gợi ý</Badge>
                    )}
                    {c.sponsored && <Badge tone="navy">Đối tác</Badge>}
                    {c.isNew && <Badge tone="green">Mới</Badge>}
                  </span>
                </span>
                <span className="flex flex-1 flex-col p-3.5">
                  <span className="font-display text-[22px] leading-snug text-navy">{c.title}</span>
                  <span className="mt-1 text-sm font-semibold text-muted">
                    🏫 {c.partner} · {c.mode}
                  </span>
                  <span className="mt-auto pt-1.5 text-base font-bold text-primary-dark">
                    {c.price}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
