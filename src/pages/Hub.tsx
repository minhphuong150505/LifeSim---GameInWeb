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

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex min-w-0 items-center gap-2">
      <legend className="float-left w-24 shrink-0 text-sm font-bold text-navy">{label}</legend>
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1">{children}</div>
    </fieldset>
  );
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
      (c.banner ? 0 : 4) + (focusTopic && c.topics.includes(focusTopic) ? 0 : 2) + (c.isNew ? 0 : 1);
    return [...shown].sort((a, b) => rank(a) - rank(b));
  }, [filters, focusTopic]);
  const activeCount = Object.values(filters).filter((v) => v !== null).length;

  return (
    <div>
      <PageHeader title="Practice Hub" subtitle="Tìm khoá học sơ cứu thực tế phù hợp với bạn." />
      <div className="mx-auto max-w-6xl space-y-3 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filtersOpen || activeCount > 0 ? 'navy' : 'secondary'}
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            aria-controls="hub-filters"
          >
            ⚙️ Bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''} {filtersOpen ? '▴' : '▾'}
          </Button>
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
          {filtersOpen && (
            <motion.div
              id="hub-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="space-y-2 p-3">
                <FilterRow label="Hình thức">
                  {MODES.map((m) => (
                    <Chip
                      key={m.label}
                      active={filters.mode === m.value}
                      onClick={() => setFilters((f) => ({ ...f, mode: m.value }))}
                    >
                      {m.label}
                    </Chip>
                  ))}
                </FilterRow>
                <FilterRow label="Ngân sách">
                  {BUDGETS.map((b) => (
                    <Chip
                      key={b.label}
                      active={filters.budget === b.value}
                      onClick={() => setFilters((f) => ({ ...f, budget: b.value }))}
                    >
                      {b.label}
                    </Chip>
                  ))}
                </FilterRow>
                <FilterRow label="Nhu cầu">
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
                </FilterRow>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {focusTopic && (
          <p className="ink-border rounded-2xl bg-[#fff1c2] px-3 py-2 text-sm text-ink">
            🎯 Gợi ý: ưu tiên khoá về{' '}
            <span className="font-bold text-primary-dark">{TOPIC_LABELS[focusTopic]}</span> – chủ đề
            bạn đang có độ chính xác thấp nhất.
          </p>
        )}

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
                  className="relative block aspect-[16/9] w-full overflow-hidden border-b-[2.5px] border-navy"
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
