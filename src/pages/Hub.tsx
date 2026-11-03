import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { TopicArt } from '../art/TopicArt';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import locationsJson from '../data/hubLocations.json';
import { ALL_TOPICS, TOPIC_EMOJI, TOPIC_LABELS, type Topic } from '../data/topics';
import {
  DEFAULT_CENTER,
  formatVnd,
  rankLocations,
  weakestTopic,
  type HubFilters,
  type HubLocation,
  type LatLng,
  type RankedLocation,
} from '../features/hub/hubLogic';
import { cn } from '../lib/cn';
import { WEEKDAY_SHORT } from '../lib/date';
import { useProgressStore } from '../store/progress';

const locations = locationsJson as HubLocation[];

const DISTANCES = [
  { label: 'Mọi khoảng cách', value: null },
  { label: '≤ 5 km', value: 5 },
  { label: '≤ 10 km', value: 10 },
] as const;
const BUDGETS = [
  { label: 'Tất cả', value: null },
  { label: '≤ 100k', value: 100_000 },
  { label: '≤ 300k', value: 300_000 },
] as const;
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const EMPTY_FILTERS: HubFilters = { maxKm: null, day: null, budgetVnd: null, topic: null };
type GeoStatus = 'idle' | 'loading' | 'granted' | 'denied';

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

const formatDays = (days: number[]) =>
  DAY_ORDER.filter((d) => days.includes(d))
    .map((d) => WEEKDAY_SHORT[d])
    .join(', ');

/** Cover topic of a course: the recommended one if it teaches it, else its first topic. */
const coverTopic = (loc: RankedLocation, focus: Topic | null): Topic =>
  focus && loc.topics.includes(focus) ? focus : (loc.topics[0] ?? 'cpr');

/** Practice Hub: every course listed as a card; filters fold away until the player needs them. */
export function Hub() {
  const topicStats = useProgressStore((s) => s.topicStats);
  const focusTopic = useMemo(() => weakestTopic(topicStats), [topicStats]);
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [geo, setGeo] = useState<GeoStatus>('idle');
  const [filters, setFilters] = useState<HubFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const ranked = useMemo(
    () => rankLocations(locations, center, filters, focusTopic),
    [center, filters, focusTopic],
  );
  const selected = ranked.find((l) => l.id === selectedId) ?? null;
  const activeCount = Object.values(filters).filter((v) => v !== null).length;

  // Ask for the location only on an explicit tap; fall back to Thủ Đức when unavailable.
  const locate = () => {
    if (!('geolocation' in navigator)) {
      setGeo('denied');
      return;
    }
    setGeo('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeo('granted');
      },
      () => {
        setCenter(DEFAULT_CENTER);
        setGeo('denied');
      },
      { timeout: 8000, maximumAge: 60_000 },
    );
  };

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
            {ranked.length} khoá học
          </h2>
          <span className="w-full text-xs font-semibold text-muted @xl:w-auto">
            ⚠️ Dữ liệu demo, không phải cơ sở thật.
          </span>
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
                <FilterRow label="Khoảng cách">
                  {DISTANCES.map((d) => (
                    <Chip
                      key={d.label}
                      active={filters.maxKm === d.value}
                      onClick={() => setFilters((f) => ({ ...f, maxKm: d.value }))}
                    >
                      {d.label}
                    </Chip>
                  ))}
                  <Chip active={geo === 'granted'} onClick={locate}>
                    📍 {geo === 'loading' ? 'Đang định vị…' : 'Dùng vị trí của tôi'}
                  </Chip>
                </FilterRow>
                {geo === 'denied' && (
                  <p role="status" className="pl-24 text-xs text-muted">
                    Không lấy được vị trí – tính khoảng cách từ trung tâm Thủ Đức.
                  </p>
                )}
                <FilterRow label="Ngày học">
                  <Chip
                    active={filters.day === null}
                    onClick={() => setFilters((f) => ({ ...f, day: null }))}
                  >
                    Tất cả
                  </Chip>
                  {DAY_ORDER.map((d) => (
                    <Chip
                      key={d}
                      active={filters.day === d}
                      onClick={() => setFilters((f) => ({ ...f, day: d }))}
                    >
                      {WEEKDAY_SHORT[d]}
                    </Chip>
                  ))}
                </FilterRow>
                <FilterRow label="Ngân sách">
                  {BUDGETS.map((b) => (
                    <Chip
                      key={b.label}
                      active={filters.budgetVnd === b.value}
                      onClick={() => setFilters((f) => ({ ...f, budgetVnd: b.value }))}
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

        {ranked.length === 0 && (
          <Card className="text-center text-sm text-muted">
            Không có khoá nào khớp bộ lọc. Hãy nới khoảng cách, ngày học hoặc ngân sách.
          </Card>
        )}
        <ul className="grid grid-cols-2 gap-3 pb-2 @xl:grid-cols-3 @5xl:grid-cols-4">
          {ranked.map((loc) => (
            <li key={loc.id}>
              <button
                type="button"
                onClick={() => setSelectedId(loc.id)}
                className="ink-border flex h-full w-full flex-col overflow-hidden rounded-card bg-paper text-left shadow-pop active:translate-y-0.5"
              >
                <span className="relative block aspect-[16/9] w-full border-b-[2.5px] border-navy">
                  <TopicArt
                    topic={coverTopic(loc, focusTopic)}
                    className="absolute inset-0 h-full w-full"
                  />
                  {loc.recommended && (
                    <span className="absolute left-2 top-2">
                      <Badge tone="red">🎯 Gợi ý</Badge>
                    </span>
                  )}
                </span>
                <span className="flex flex-1 flex-col p-2.5">
                  <span className="font-display text-[17px] leading-snug text-navy">
                    {loc.name}
                  </span>
                  <span className="mt-0.5 text-xs font-semibold text-muted">🏫 {loc.provider}</span>
                  <span className="mt-auto pt-1 text-sm font-bold text-primary-dark">
                    {formatVnd(loc.priceVnd)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Modal
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.name ?? ''}
        tone="wood"
        size="lg"
      >
        {selected && (
          <div className="grid gap-3 @xl:grid-cols-[1fr_1.3fr]">
            <div className="ink-border relative aspect-[4/3] overflow-hidden rounded-2xl">
              <TopicArt
                topic={coverTopic(selected, focusTopic)}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="space-y-2 text-sm text-ink">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <dt className="font-bold text-navy">Đơn vị</dt>
                <dd>{selected.provider}</dd>
                <dt className="font-bold text-navy">Địa chỉ</dt>
                <dd>
                  {selected.address} · {selected.distanceKm.toFixed(1)} km
                </dd>
                <dt className="font-bold text-navy">Lịch học</dt>
                <dd>
                  {formatDays(selected.days)}, {selected.time}
                </dd>
                <dt className="font-bold text-navy">Học phí</dt>
                <dd className="font-bold text-primary-dark">{formatVnd(selected.priceVnd)}</dd>
                <dt className="font-bold text-navy">Cấp độ</dt>
                <dd>{selected.level}</dd>
              </dl>
              <div className="flex flex-wrap gap-1.5">
                {selected.topics.map((t) => (
                  <Badge key={t} tone={t === focusTopic ? 'red' : 'navy'}>
                    {TOPIC_EMOJI[t]} {TOPIC_LABELS[t]}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted">
                Dữ liệu demo, không phải cơ sở thật. Ở bản chính thức, bạn sẽ đăng ký trực tiếp với
                đơn vị đào tạo tại đây.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
