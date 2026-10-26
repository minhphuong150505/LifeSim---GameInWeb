import { lazy, Suspense, useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import locationsJson from '../data/hubLocations.json';
import { ALL_TOPICS, TOPIC_EMOJI, TOPIC_LABELS } from '../data/topics';
import {
  DEFAULT_CENTER,
  formatVnd,
  rankLocations,
  weakestTopic,
  type HubFilters,
  type HubLocation,
  type LatLng,
} from '../features/hub/hubLogic';
import { cn } from '../lib/cn';
import { WEEKDAY_SHORT } from '../lib/date';
import { useProgressStore } from '../store/progress';

// Leaflet is heavy; load it only when the Hub is opened.
const HubMap = lazy(() => import('../features/hub/HubMap'));
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
        'min-h-11 shrink-0 whitespace-nowrap rounded-full border-2 px-3 text-sm font-semibold',
        active ? 'border-navy bg-navy text-white' : 'border-navy/40 bg-paper text-navy',
      )}
    >
      {children}
    </button>
  );
}

const formatDays = (days: number[]) =>
  DAY_ORDER.filter((d) => days.includes(d))
    .map((d) => WEEKDAY_SHORT[d])
    .join(', ');

export function Hub() {
  const topicStats = useProgressStore((s) => s.topicStats);
  const focusTopic = useMemo(() => weakestTopic(topicStats), [topicStats]);
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [geo, setGeo] = useState<GeoStatus>('idle');
  const [filters, setFilters] = useState<HubFilters>({
    maxKm: null,
    day: null,
    budgetVnd: null,
    topic: null,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const ranked = useMemo(
    () => rankLocations(locations, center, filters, focusTopic),
    [center, filters, focusTopic],
  );
  const selected = ranked.find((l) => l.id === selectedId) ?? null;

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

  const select = (id: string) => {
    setSelectedId(id);
    setShowDetails(false);
  };

  return (
    <div>
      <PageHeader title="Practice Hub" subtitle="Tìm khóa sơ cứu thực tế phù hợp với bạn." />
      <div className="space-y-3 px-4">
        <p className="rounded-2xl bg-accent/25 px-3 py-2 text-sm font-semibold text-navy">
          ⚠️ Dữ liệu demo, không phải cơ sở thật.
        </p>

        {focusTopic && (
          <Card className="flex items-center gap-3 p-3">
            <span aria-hidden className="text-3xl">
              🎯
            </span>
            <p className="text-sm text-ink">
              Gợi ý cho bạn: ưu tiên khóa về{' '}
              <span className="font-bold text-primary-dark">{TOPIC_LABELS[focusTopic]}</span> – chủ
              đề bạn đang có độ chính xác thấp nhất.
            </p>
          </Card>
        )}

        <div className="relative z-0 h-64 overflow-hidden rounded-card bg-[#dfe9ee] shadow-soft">
          <Suspense
            fallback={
              <div role="status" className="grid h-full place-items-center text-sm text-muted">
                Đang tải bản đồ…
              </div>
            }
          >
            <HubMap center={center} locations={ranked} selectedId={selectedId} onSelect={select} />
          </Suspense>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={locate}
            disabled={geo === 'loading'}
            className="shrink-0"
          >
            📍 {geo === 'loading' ? 'Đang định vị…' : 'Dùng vị trí của tôi'}
          </Button>
          <p role="status" className="text-xs text-muted">
            {geo === 'granted'
              ? 'Đang tính khoảng cách từ vị trí của bạn.'
              : geo === 'denied'
                ? 'Không lấy được vị trí – dùng tâm Thủ Đức.'
                : 'Mặc định tính từ trung tâm Thủ Đức.'}
          </p>
        </div>

        <fieldset className="min-w-0">
          <legend className="mb-1 text-sm font-bold text-navy">Khoảng cách</legend>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DISTANCES.map((d) => (
              <Chip
                key={d.label}
                active={filters.maxKm === d.value}
                onClick={() => setFilters((f) => ({ ...f, maxKm: d.value }))}
              >
                {d.label}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="mb-1 text-sm font-bold text-navy">Ngày học</legend>
          <div className="flex gap-2 overflow-x-auto pb-1">
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
          </div>
        </fieldset>
        <fieldset className="min-w-0">
          <legend className="mb-1 text-sm font-bold text-navy">Ngân sách</legend>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BUDGETS.map((b) => (
              <Chip
                key={b.label}
                active={filters.budgetVnd === b.value}
                onClick={() => setFilters((f) => ({ ...f, budgetVnd: b.value }))}
              >
                {b.label}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="mb-1 text-sm font-bold text-navy">Nhu cầu</legend>
          <div className="flex gap-2 overflow-x-auto pb-1">
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
          </div>
        </fieldset>

        <h2 className="pt-1 font-display text-xl text-navy" aria-live="polite">
          {ranked.length} khóa học phù hợp
        </h2>
        {ranked.length === 0 && (
          <Card className="text-center text-sm text-muted">
            Không có khóa nào khớp bộ lọc. Hãy nới khoảng cách, ngày học hoặc ngân sách.
          </Card>
        )}
        <ul className="space-y-3">
          {ranked.map((loc) => (
            <li key={loc.id}>
              <button
                type="button"
                onClick={() => select(loc.id)}
                className="block w-full text-left"
              >
                <Card className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-bold text-navy">{loc.name}</h3>
                    {loc.recommended && <Badge tone="red">🎯 Gợi ý</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-ink">
                    📍 {loc.distanceKm.toFixed(1)} km · 🗓 {formatDays(loc.days)}, {loc.time}
                  </p>
                  <p className="text-sm font-bold text-primary-dark">{formatVnd(loc.priceVnd)}</p>
                </Card>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <BottomSheet
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.name ?? ''}
      >
        {selected && (
          <div className="space-y-2 pb-2">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-ink">
              <dt aria-label="Khoảng cách">📍</dt>
              <dd>{selected.distanceKm.toFixed(1)} km</dd>
              <dt aria-label="Lịch học">🗓</dt>
              <dd>
                {formatDays(selected.days)}, {selected.time}
              </dd>
              <dt aria-label="Học phí">💵</dt>
              <dd className="font-bold text-primary-dark">{formatVnd(selected.priceVnd)}</dd>
            </dl>
            {showDetails ? (
              <div className="space-y-2 rounded-2xl bg-cream p-3 text-sm text-ink">
                <p>
                  <span className="font-bold text-navy">Địa chỉ:</span> {selected.address}
                </p>
                <p>
                  <span className="font-bold text-navy">Cấp độ:</span> {selected.level}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.topics.map((t) => (
                    <Badge key={t} tone={t === focusTopic ? 'red' : 'navy'}>
                      {TOPIC_LABELS[t]}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted">
                  Dữ liệu demo, không phải cơ sở thật. Ở bản chính thức, bạn sẽ đăng ký trực tiếp
                  với đơn vị đào tạo tại đây.
                </p>
              </div>
            ) : (
              <Button block onClick={() => setShowDetails(true)}>
                Xem chi tiết
              </Button>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
