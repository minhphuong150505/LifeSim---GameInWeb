import { useState } from 'react';
import { Avatar } from '../components/Avatar';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { SoundToggle } from '../components/SoundToggle';
import { computeBadges } from '../data/badges';
import { DISCLAIMER } from '../data/copy';
import { scenarios } from '../data/scenarios';
import { ALL_TOPICS, TOPIC_EMOJI, TOPIC_LABELS } from '../data/topics';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';
import { resetAllData } from '../store/resetAll';
import { useStreakStore } from '../store/streak';
import { useUserStore } from '../store/user';

export function Profile() {
  const nickname = useUserStore((s) => s.nickname);
  const avatar = useUserStore((s) => s.avatar);
  const progress = useProgressStore();
  const bestStreak = useStreakStore((s) => s.best);
  const [confirming, setConfirming] = useState(false);

  const records = Object.values(progress.scenarios);
  const totalStars = records.reduce((n, r) => n + r.bestStars, 0);
  const badges = computeBadges({
    scenarios: progress.scenarios,
    scenarioCount: scenarios.length,
    bestStreak,
    teamWins: progress.teamWins,
  });

  return (
    <div>
      <PageHeader title="Hồ sơ" right={<SoundToggle />} />
      <div className="space-y-4 px-4">
        <Card tape className="flex items-center gap-3">
          <Avatar id={avatar} size={72} ring="red" />
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-navy">{nickname}</h2>
            <p className="text-sm text-muted">Tình nguyện viên sơ cứu tập sự</p>
          </div>
        </Card>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Tình huống', `${records.length}/${scenarios.length}`],
            ['Tổng sao', `${totalStars}/${scenarios.length * 3}`],
            ['Streak kỷ lục', `${bestStreak}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-card bg-white p-3 shadow-soft">
              <dd className="font-display text-2xl font-bold text-primary-dark">{value}</dd>
              <dt className="text-xs font-semibold text-muted">{label}</dt>
            </div>
          ))}
        </dl>

        <Card>
          <h2 className="text-lg font-bold text-navy">Độ chính xác theo chủ đề</h2>
          <ul className="mt-2 space-y-3">
            {ALL_TOPICS.map((topic) => {
              const stat = progress.topicStats[topic];
              const pct =
                stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
              return (
                <li key={topic}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy">
                      <span aria-hidden>{TOPIC_EMOJI[topic]} </span>
                      {TOPIC_LABELS[topic]}
                    </span>
                    <span className="text-muted">
                      {pct === null
                        ? 'Chưa có dữ liệu'
                        : `${pct}% (${stat?.correct}/${stat?.total})`}
                    </span>
                  </div>
                  <ProgressBar
                    value={pct ?? 0}
                    max={100}
                    label={`Độ chính xác ${TOPIC_LABELS[topic]}`}
                    showLabel={false}
                    tone={
                      pct === null
                        ? 'navy'
                        : pct >= 80
                          ? 'success'
                          : pct >= 50
                            ? 'accent'
                            : 'primary'
                    }
                  />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">
            Huy hiệu ({badges.filter((b) => b.earned).length}/{badges.length})
          </h2>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {badges.map((b) => (
              <li
                key={b.id}
                className={cn(
                  'flex flex-col items-center rounded-2xl p-2 text-center',
                  b.earned ? 'bg-accent/25' : 'bg-black/5',
                )}
              >
                <span aria-hidden className={cn('text-3xl', !b.earned && 'opacity-30 grayscale')}>
                  {b.emoji}
                </span>
                <span className="text-sm font-bold text-navy">{b.label}</span>
                <span className="text-[11px] leading-tight text-muted">
                  {b.earned ? 'Đã đạt' : b.hint}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Dữ liệu của bạn</h2>
          <p className="mt-1 text-sm text-muted">
            Mọi dữ liệu chỉ lưu trên thiết bị này (localStorage). Xóa sẽ không thể khôi phục.
          </p>
          <Button
            variant="secondary"
            className="mt-3 text-primary-dark"
            onClick={() => setConfirming(true)}
          >
            🗑 Xóa toàn bộ dữ liệu
          </Button>
        </Card>

        <footer className="pb-2 text-center text-xs leading-relaxed text-muted">
          <p>{DISCLAIMER}</p>
          <p className="mt-1">LifeSim demo · Practice today, be ready tomorrow</p>
        </footer>
      </div>

      <BottomSheet
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Xóa toàn bộ dữ liệu?"
      >
        <p className="text-sm text-ink">
          Điểm, sao, streak, huy hiệu và hồ sơ của bạn sẽ bị xóa khỏi thiết bị này. Bạn sẽ quay lại
          màn hình chào mừng.
        </p>
        <div className="mt-4 flex gap-3 pb-2">
          <Button variant="secondary" onClick={() => setConfirming(false)} className="shrink-0">
            Hủy
          </Button>
          <Button block onClick={resetAllData}>
            Xóa dữ liệu
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
