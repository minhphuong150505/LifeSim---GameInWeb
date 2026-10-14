import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Logo } from '../components/Logo';
import { SoundToggle } from '../components/SoundToggle';
import { Sticker } from '../components/Sticker';
import { assets } from '../data/assets';
import { EVENT_NAME } from '../data/copy';
import { scenarios } from '../data/scenarios';
import { activeStreak } from '../features/streak/streakLogic';
import { toDateKey } from '../lib/date';
import { useProgressStore } from '../store/progress';
import { useStreakStore } from '../store/streak';
import { useUserStore } from '../store/user';

export function Home() {
  const navigate = useNavigate();
  const nickname = useUserStore((s) => s.nickname);
  const records = useProgressStore((s) => s.scenarios);
  const streak = useStreakStore();
  const today = toDateKey();
  const streakDays = activeStreak(streak, today);
  const dailyDone = Boolean(streak.results[today]);
  // "Play now" jumps to the first scenario the player has not finished yet.
  const next = scenarios.find((s) => !records[s.id]) ?? scenarios[0];

  return (
    <div>
      <section className="relative overflow-hidden rounded-b-[32px] bg-white shadow-soft">
        <img
          src={assets.proposal.cityBg}
          alt=""
          aria-hidden
          width={1080}
          height={405}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="safe-top relative px-4 pb-4">
          <div className="flex items-center justify-between">
            <Logo height={40} />
            <div className="flex items-center gap-2">
              <Link
                to="/daily"
                aria-label={`Chuỗi ${streakDays} ngày. Mở thử thách hôm nay`}
                className="flex h-11 items-center gap-1 rounded-full bg-white px-3 font-display text-lg font-bold text-navy shadow-soft"
              >
                <span aria-hidden className={streakDays > 0 ? '' : 'grayscale'}>
                  🔥
                </span>
                {streakDays}
              </Link>
              <SoundToggle />
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="pb-2">
              <p className="text-sm font-semibold text-navy">Xin chào,</p>
              <h1 className="break-words text-[30px] font-bold text-navy">{nickname} 👋</h1>
              <p className="mt-1 max-w-[13rem] text-sm text-ink">
                Hôm nay luyện một tình huống để sẵn sàng cho ngày mai nhé!
              </p>
            </div>
            <motion.img
              src={assets.proposal.characterHero}
              alt="Nhân vật LifeSim đeo balo cứu thương"
              width={440}
              height={673}
              fetchPriority="high"
              className="-mb-4 -mr-2 h-48 w-auto shrink-0"
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            />
          </div>
        </div>
      </section>

      <div className="space-y-4 px-4 pt-4">
        <Button size="lg" block onClick={() => next && navigate(`/play/${next.id}`)}>
          <span aria-hidden>▶</span> Chơi ngay
        </Button>
        {next && (
          <p className="-mt-2 text-center text-sm text-muted">
            Tiếp theo: <span className="font-semibold text-navy">{next.title}</span>
          </p>
        )}

        <Link to="/daily" className="block">
          <Card tape className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/25 text-3xl"
            >
              🔥
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-navy">Thử thách hôm nay</h2>
              <p className="text-sm text-muted">3 câu hỏi nhanh · 10 giây mỗi câu</p>
            </div>
            <Badge tone={dailyDone ? 'green' : 'red'}>{dailyDone ? '✓ Đã xong' : 'Chưa làm'}</Badge>
          </Card>
        </Link>

        <Link to="/team" className="relative block overflow-hidden rounded-card shadow-soft">
          <img
            src={assets.proposal.teamBanner}
            alt=""
            aria-hidden
            loading="lazy"
            width={708}
            height={620}
            className="h-40 w-full object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-navy">
              SỰ KIỆN 5 vs 5
            </span>
            <h2 className="mt-1.5 text-xl font-bold">{EVENT_NAME}</h2>
            <p className="text-sm">Lập đội 5 người, cùng xử trí tình huống →</p>
          </div>
        </Link>

        <Card className="flex items-center gap-3">
          <Sticker name="signs" className="h-24 w-auto shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-navy">Learn – Practice – Be ready</h2>
            <p className="text-sm text-muted">
              Quan sát manh mối, ra quyết định và ghi nhớ bài học sau mỗi tình huống.
            </p>
            <Link
              to="/scenarios"
              className="mt-1 inline-flex min-h-11 items-center font-semibold text-primary-dark underline"
            >
              Xem tất cả tình huống
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
