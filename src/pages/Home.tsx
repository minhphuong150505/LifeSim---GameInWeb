import { Link, useNavigate } from 'react-router-dom';
import { BandageIcon, FlameIcon, TrophyIcon } from '../art/icons';
import { LivingRoom } from '../art/LivingRoom';
import { Mascot } from '../art/Mascot';
import { Person } from '../art/Person';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { SoundToggle } from '../components/SoundToggle';
import { Sticker } from '../components/Sticker';
import { EVENT_NAME } from '../data/copy';
import { allRounds, scenarioOf } from '../data/sim';
import { nextRoundToPlay } from '../features/sim/unlock';
import { activeStreak } from '../features/streak/streakLogic';
import { toDateKey } from '../lib/date';
import { useProgressStore } from '../store/progress';
import { attemptsLeft, useStreakStore } from '../store/streak';
import { useUserStore } from '../store/user';
import { useWalletStore } from '../store/wallet';

const TEAM_AVATARS = ['avatar-2', 'avatar-5', 'avatar-7', 'avatar-9', 'avatar-11'];

export function Home() {
  const navigate = useNavigate();
  const nickname = useUserStore((s) => s.nickname);
  const records = useProgressStore((s) => s.rounds);
  const bandages = useWalletStore((s) => s.bandages);
  const streak = useStreakStore();
  const today = toDateKey();
  const streakDays = activeStreak(streak, today);
  const todayResult = streak.results[today];
  const triesLeft = attemptsLeft(todayResult);
  // "Chơi ngay" jumps to the first round the player has not cleared yet.
  const next = nextRoundToPlay(allRounds, records);
  const nextScenario = next ? scenarioOf(next.id) : undefined;

  return (
    <div>
      <header className="wood safe-top border-b-[2.5px] border-navy px-4 pb-2.5">
        <div className="flex items-center justify-between">
          <Logo height={42} />
          <div className="flex items-center gap-2">
            <Link
              to="/daily"
              aria-label={`Chuỗi ${streakDays} ngày. Mở thử thách hôm nay`}
              className="ink-border flex h-11 items-center gap-0.5 rounded-xl bg-paper pl-1 pr-2 font-display text-xl text-navy shadow-pop"
            >
              <FlameIcon lit={streakDays > 0} size={28} />
              {streakDays}
            </Link>
            <span
              aria-label={`${bandages} băng gạc`}
              className="ink-border flex h-11 items-center gap-0.5 rounded-xl bg-paper pl-1 pr-2 font-display text-xl text-navy shadow-pop"
            >
              <BandageIcon size={28} />
              {bandages}
            </span>
            <SoundToggle />
          </div>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-4">
        <section className="ink-border relative overflow-hidden rounded-[24px] bg-[#f3eed3] shadow-soft">
          <svg viewBox="0 40 400 200" className="block w-full" aria-hidden>
            <LivingRoom />
            <Person
              kind="brother"
              pose="sit"
              x={200}
              y={170}
              eyes="happy"
              mouth="smile"
              armR="wave"
            />
          </svg>
          <div className="relative flex items-end justify-between gap-2 border-t-[2.5px] border-navy bg-paper px-4 pb-3 pt-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy">Xin chào,</p>
              <h1 className="break-words font-display text-[30px] leading-tight text-navy">
                {nickname} 👋
              </h1>
              <p className="text-sm text-ink">
                Hôm nay luyện một tình huống để sẵn sàng cho ngày mai nhé!
              </p>
            </div>
            <Mascot interactive className="-mb-2 -mt-24 h-36 w-28 shrink-0" />
          </div>
        </section>

        <div>
          <Button size="lg" block onClick={() => next && navigate(`/play/${next.id}`)}>
            ▶ Chơi ngay
          </Button>
          {next && nextScenario && (
            <p className="mt-1.5 text-center text-sm text-muted">
              Tiếp theo:{' '}
              <span className="font-semibold text-navy">
                Tình huống {nextScenario.number} · Round {next.code} – {next.title}
              </span>
            </p>
          )}
        </div>

        <Link to="/daily" className="block">
          <Card tape className="flex items-center gap-3">
            <span
              aria-hidden
              className="ink-border grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#fff1c2]"
            >
              <FlameIcon lit={streakDays > 0} size={40} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl text-navy">Daily Rescue Streak</h2>
              <p className="text-sm text-muted">3 câu nhanh · 2 lượt thử · quà theo mốc</p>
            </div>
            <Badge tone={todayResult?.passed ? 'green' : triesLeft === 0 ? 'gray' : 'red'}>
              {todayResult?.passed
                ? '✓ Đã xong'
                : triesLeft === 0
                  ? 'Hết lượt'
                  : `${triesLeft} lượt`}
            </Badge>
          </Card>
        </Link>

        <Link
          to="/team"
          className="ink-border relative block overflow-hidden rounded-card bg-navy shadow-soft"
        >
          <div className="flex items-center justify-center gap-1 px-3 pt-4">
            {TEAM_AVATARS.map((a) => (
              <Avatar key={a} id={a} size={46} />
            ))}
            <TrophyIcon size={48} className="ml-1" />
          </div>
          <div className="p-4 pt-2 text-white">
            <span className="ink-border rounded-full bg-accent px-2.5 py-0.5 font-display text-sm text-navy">
              SỰ KIỆN 5 vs 5
            </span>
            <h2 className="mt-1.5 font-display text-2xl">{EVENT_NAME}</h2>
            <p className="text-sm">Lập đội 5 người, cùng xử trí tình huống →</p>
          </div>
        </Link>

        <Card className="flex items-center gap-3">
          <Sticker name="signs" className="h-24 shrink-0" />
          <div>
            <h2 className="font-display text-xl text-navy">Learn – Practice – Be ready</h2>
            <p className="text-sm text-muted">
              Đọc tình huống, chọn cách xử lý đúng, dùng vật dụng và ghi nhớ bài học sau mỗi round.
            </p>
            <Link
              to="/scenarios"
              className="mt-1 inline-flex min-h-11 items-center font-semibold text-primary-dark underline"
            >
              Mở bản đồ tình huống
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
