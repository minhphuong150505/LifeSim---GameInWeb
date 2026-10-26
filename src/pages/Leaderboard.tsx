import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { Sticker } from '../components/Sticker';
import botsJson from '../data/bots.json';
import {
  buildDailyLeaderboard,
  buildWeeklyLeaderboard,
  type Bot,
} from '../features/leaderboard/leaderboardLogic';
import { cn } from '../lib/cn';
import { toDateKey } from '../lib/date';
import { dayScore, useProgressStore } from '../store/progress';
import { useUserStore } from '../store/user';

const bots = botsJson as Bot[];
const TABS = [
  { id: 'today', label: 'Hôm nay' },
  { id: 'week', label: 'Tuần' },
] as const;
type TabId = (typeof TABS)[number]['id'];
const CUPS = ['🥇', '🥈', '🥉'];

export function Leaderboard() {
  const [tab, setTab] = useState<TabId>('today');
  const nickname = useUserStore((s) => s.nickname);
  const avatar = useUserStore((s) => s.avatar);
  const dailyRounds = useProgressStore((s) => s.dailyRounds);
  const today = toDateKey();
  const playerRowRef = useRef<HTMLLIElement>(null);

  const entries = useMemo(() => {
    const me = { nickname, avatar };
    const scores = Object.fromEntries(
      Object.keys(dailyRounds).map((d) => [d, dayScore(dailyRounds, d)]),
    );
    return tab === 'today'
      ? buildDailyLeaderboard(bots, today, { ...me, score: scores[today] ?? 0 })
      : buildWeeklyLeaderboard(bots, today, me, scores);
  }, [tab, today, nickname, avatar, dailyRounds]);
  const me = entries.find((e) => e.isPlayer);

  // Bring the player's own row into view whenever the board changes.
  useEffect(() => {
    const id = window.setTimeout(
      () => playerRowRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }),
      350,
    );
    return () => window.clearTimeout(id);
  }, [tab]);

  return (
    <div>
      <PageHeader
        title="Bảng xếp hạng"
        subtitle="Theo thành tích Core Simulation · làm mới mỗi ngày."
        right={<Sticker name="trophy" className="h-14" />}
      />
      <div className="px-4">
        <div
          role="tablist"
          aria-label="Khoảng thời gian"
          className="grid grid-cols-2 rounded-2xl bg-navy/10 p-1"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="leaderboard-panel"
              onClick={() => setTab(t.id)}
              className={cn(
                'min-h-11 rounded-xl font-display text-lg',
                tab === t.id ? 'ink-border bg-paper text-navy shadow-soft' : 'text-navy/70',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Badge tone="gray">Bản demo – dữ liệu mô phỏng</Badge>
          {me && (
            <span className="text-sm font-semibold text-navy">
              Hạng bạn: #{me.rank}/{entries.length}
            </span>
          )}
        </div>
        {me && me.score === 0 && (
          <p className="ink-border mt-2 rounded-2xl bg-paper p-3 text-sm text-ink shadow-soft">
            Bạn chưa có điểm {tab === 'today' ? 'hôm nay' : 'tuần này'}. Vượt qua một round trong
            Core Simulation để ghi tên lên bảng!
          </p>
        )}

        <ol
          id="leaderboard-panel"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="ink-border mt-3 space-y-2 rounded-card bg-navy p-2"
        >
          {entries.map((e, i) => (
            <motion.li
              key={`${tab}-${e.id}`}
              ref={e.isPlayer ? playerRowRef : undefined}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 12) * 0.025 }}
              aria-current={e.isPlayer ? 'true' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2',
                e.isPlayer ? 'bg-accent text-navy' : 'bg-white/10 text-white',
              )}
            >
              <span className="w-8 text-center font-display text-xl font-bold">
                {e.rank <= 3 ? (
                  <span role="img" aria-label={`Hạng ${e.rank}`}>
                    {CUPS[e.rank - 1]}
                  </span>
                ) : (
                  e.rank
                )}
              </span>
              <Avatar id={e.avatar} size={36} ring={e.isPlayer ? 'navy' : 'none'} />
              <span className="min-w-0 flex-1 truncate font-semibold">
                {e.nickname}
                {e.isPlayer && ' (bạn)'}
              </span>
              <span className="font-display text-lg font-bold tabular-nums">
                {e.score.toLocaleString('vi-VN')}
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
