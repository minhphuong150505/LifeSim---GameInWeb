import { Avatar } from '../components/Avatar';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { computeBadges } from '../data/badges';
import { allRounds, simScenarios } from '../data/sim';
import { levelTitle } from '../features/profile/level';
import { usePlayerLevel } from '../features/profile/usePlayerLevel';
import { BandageIcon } from '../art/icons';
import { useWalletStore } from '../store/wallet';
import { ALL_TOPICS, TOPIC_EMOJI, TOPIC_LABELS } from '../data/topics';
import { cn } from '../lib/cn';
import { useProgressStore } from '../store/progress';
import { useStreakStore } from '../store/streak';
import { useUserStore } from '../store/user';

export function Profile() {
  const nickname = useUserStore((s) => s.nickname);
  const avatar = useUserStore((s) => s.avatar);
  const progress = useProgressStore();
  const bestStreak = useStreakStore((s) => s.best);
  const { level, into, needed, xp } = usePlayerLevel();

  const bandages = useWalletStore((s) => s.bandages);
  const cleared = allRounds.filter((r) => (progress.rounds[r.id]?.wins ?? 0) > 0);
  const totalStars = allRounds.reduce((n, r) => n + (progress.rounds[r.id]?.bestStars ?? 0), 0);
  const badges = computeBadges({
    rounds: progress.rounds,
    roundCount: allRounds.length,
    bestStreak,
    teamWins: progress.teamWins,
  });

  return (
    <div>
      <PageHeader title="Hồ sơ nhân vật" />
      <div className="mx-auto grid max-w-6xl gap-4 px-4 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card tape className="flex items-center gap-3">
            <Avatar id={avatar} size={72} ring="red" />
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-display text-2xl text-navy">{nickname}</h2>
              <p className="text-sm text-muted">{levelTitle(level)}</p>
              <p className="mt-1 flex items-center gap-1 whitespace-nowrap font-display text-lg text-navy">
                <BandageIcon size={26} /> {bandages} băng gạc
              </p>
            </div>
            <div className="w-28 shrink-0 text-center">
              <p className="ink-border rounded-full bg-accent font-display text-xl text-navy">
                Cấp {level}
              </p>
              <div className="mt-1">
                <ProgressBar
                  value={into}
                  max={needed}
                  label={`Kinh nghiệm cấp ${level}`}
                  showLabel={false}
                  tone="success"
                />
              </div>
              <p className="text-[11px] text-muted">
                {into}/{needed} XP · tổng {xp}
              </p>
            </div>
          </Card>

          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Round đã qua', `${cleared.length}/${allRounds.length}`],
              ['Tổng sao', `${totalStars}/${allRounds.length * 3}`],
              ['Streak kỷ lục', `${bestStreak}`],
            ].map(([label, value]) => (
              <div key={label} className="ink-border rounded-card bg-paper p-3 shadow-soft">
                <dd className="font-display text-2xl text-primary-dark">{value}</dd>
                <dt className="text-xs font-semibold text-muted">{label}</dt>
              </div>
            ))}
          </dl>

          <Card>
            <h2 className="font-display text-xl text-navy">Tiến độ chơi game</h2>
            <ul className="mt-2 space-y-2">
              {simScenarios.map((sc) => {
                const done = sc.rounds.filter((r) => (progress.rounds[r.id]?.wins ?? 0) > 0).length;
                return (
                  <li key={sc.id}>
                    <div className="mb-1 flex justify-between text-sm font-semibold text-navy">
                      <span>
                        {TOPIC_EMOJI[sc.topic]} Tình huống {sc.number}: {sc.title}
                      </span>
                      <span className="text-muted">
                        {done}/{sc.rounds.length} màn
                      </span>
                    </div>
                    <ProgressBar
                      value={done}
                      max={sc.rounds.length}
                      label={`Tiến độ ${sc.title}`}
                      showLabel={false}
                      tone="primary"
                    />
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="font-display text-xl text-navy">Độ chính xác theo chủ đề</h2>
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
            <h2 className="font-display text-xl text-navy">
              Thành tựu ({badges.filter((b) => b.earned).length}/{badges.length})
            </h2>
            <ul className="mt-2 grid grid-cols-3 gap-2">
              {badges.map((b) => (
                <li
                  key={b.id}
                  className={cn(
                    'flex flex-col items-center rounded-2xl border-2 p-2 text-center',
                    b.earned ? 'border-navy bg-[#fff1c2]' : 'border-navy/20 bg-black/5',
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
        </div>
      </div>
    </div>
  );
}
