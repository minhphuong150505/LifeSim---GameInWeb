import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookIcon,
  FlameIcon,
  GearIcon,
  HelpIcon,
  CapIcon,
  StationIcon,
  PinIcon,
  PlayIcon,
  ScrollIcon,
  ShopIcon,
  TrophyIcon,
} from '../art/icons';
import { LivingRoom, ROOM_H, ROOM_W } from '../art/LivingRoom';
import { Mascot } from '../art/Mascot';
import { Avatar } from '../components/Avatar';
import { CurrencyPill } from '../components/CurrencyPill';
import { allRounds, scenarioOf } from '../data/sim';
import { CoursesPopup } from '../features/courses/CoursesPopup';
import { MissionsModal } from '../features/lobby/MissionsModal';
import { SettingsModal } from '../features/lobby/SettingsModal';
import {
  claimableCount,
  missionsDoneCount,
  MISSIONS,
  type MissionInput,
} from '../features/missions/missionLogic';
import { usePlayerLevel } from '../features/profile/usePlayerLevel';
import { BandageBank } from '../features/sim/BandageBank';
import { Shop } from '../features/sim/Shop';
import { nextRoundToPlay } from '../features/sim/unlock';
import { activeStreak } from '../features/streak/streakLogic';
import { cn } from '../lib/cn';
import { toDateKey } from '../lib/date';
import { useMissionStore } from '../store/missions';
import { useProgressStore } from '../store/progress';
import { useSessionStore } from '../store/session';
import { attemptsLeft, useStreakStore } from '../store/streak';
import { useUserStore } from '../store/user';

function SideButton({
  label,
  icon,
  onClick,
  badge,
  glow,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: number;
  glow?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-[78px] flex-col items-center"
      aria-label={badge ? `${label} (${badge} mới)` : label}
    >
      <span
        className={cn(
          'ink-border relative grid h-[52px] w-[52px] place-items-center rounded-[18px] shadow-pop transition-transform group-active:translate-y-0.5 [&>svg]:h-[74%] [&>svg]:w-[74%]',
          glow ? 'animate-pulse bg-[#bfe3a6] ring-4 ring-success/60' : 'bg-paper',
        )}
      >
        {icon}
        {badge ? (
          <span className="ink-border absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-primary px-1 font-display text-sm text-white">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="ink-border mt-1 rounded-lg bg-paper px-1.5 font-display text-[13px] leading-[18px] whitespace-nowrap text-navy">
        {label}
      </span>
    </button>
  );
}

function BigButton({
  title,
  subtitle,
  icon,
  onClick,
  tone,
  delay,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  tone: string;
  delay: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
      whileTap={{ scale: 0.97, y: 2 }}
      className="ink-border flex min-h-0 w-full max-h-[118px] flex-1 items-center gap-4 rounded-[26px] px-4 text-left shadow-[0_6px_0_0_#3b2d26]"
      style={{ backgroundColor: tone }}
    >
      <span className="ink-border grid aspect-square h-[min(72px,70%)] shrink-0 place-items-center rounded-[20px] bg-paper [&>svg]:h-[70%] [&>svg]:w-[70%]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[36px] leading-[1.05] text-navy">{title}</span>
        <span className="mt-0.5 line-clamp-2 block text-[15px] font-semibold leading-snug text-navy/85">
          {subtitle}
        </span>
      </span>
      <span className="ink-border grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper/90 [&>svg]:h-7 [&>svg]:w-7">
        <PlayIcon size={28} />
      </span>
    </motion.button>
  );
}

/** Step 2 – main screen: profile, missions character, Core game / Streak / Hub and side menu. */
export function Home() {
  const navigate = useNavigate();
  const nickname = useUserStore((s) => s.nickname);
  const avatar = useUserStore((s) => s.avatar);
  const records = useProgressStore((s) => s.rounds);
  const streak = useStreakStore();
  const missions = useMissionStore();
  const newsSeen = useSessionStore((s) => s.newsSeen);
  const markNewsSeen = useSessionStore((s) => s.markNewsSeen);
  const { level, into, needed } = usePlayerLevel();
  const [panel, setPanel] = useState<'missions' | 'settings' | 'shop' | 'bank' | 'courses' | null>(
    null,
  );

  const today = toDateKey();
  const streakDays = activeStreak(streak, today);
  const todayResult = streak.results[today];
  const triesLeft = attemptsLeft(todayResult);
  const next = nextRoundToPlay(allRounds, records);
  const nextScenario = next ? scenarioOf(next.id) : undefined;

  const missionInput: MissionInput = {
    today,
    activity: missions.activity,
    claimed: missions.claimed,
    streakPassed: Boolean(todayResult?.passed),
  };
  const doneCount = missionsDoneCount(missionInput);
  const claimable = claimableCount(missionInput);

  return (
    <main className="relative h-app overflow-hidden">
      <svg
        viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <LivingRoom />
      </svg>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-cream/0 via-cream/35 to-cream/75"
      />

      <div className="relative flex h-full flex-col px-[max(14px,env(safe-area-inset-left))] pb-[max(10px,env(safe-area-inset-bottom))] pr-[max(14px,env(safe-area-inset-right))] pt-[max(10px,env(safe-area-inset-top))]">
        {/* top bar: profile + settings | bandages + shop */}
        <div className="flex shrink-0 items-start gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Hồ sơ nhân vật"
            className="ink-border flex min-w-0 items-center gap-2.5 rounded-[20px] bg-paper py-1.5 pl-1.5 pr-4 shadow-pop"
          >
            <span className="relative">
              <Avatar id={avatar} size={50} ring="red" />
              <span className="ink-border absolute -bottom-1 -right-2 rounded-full bg-accent px-1.5 font-display text-[12px] leading-4 text-navy">
                Lv{level}
              </span>
            </span>
            <span className="min-w-0 text-left">
              <span className="block max-w-[170px] truncate font-display text-xl leading-tight text-navy">
                {nickname}
              </span>
              <span className="flex items-center gap-1 text-[14px] font-semibold text-navy">
                <FlameIcon size={18} lit={streakDays > 0} />
                Streak {streakDays} ngày
              </span>
              <span
                className="mt-0.5 block h-2 w-[130px] overflow-hidden rounded-full bg-navy/15"
                role="progressbar"
                aria-label={`Kinh nghiệm cấp ${level}`}
                aria-valuenow={into}
                aria-valuemax={needed}
              >
                <span
                  className="block h-full bg-success"
                  style={{ width: `${(into / needed) * 100}%` }}
                />
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPanel('settings')}
            aria-label="Cài đặt"
            className="ink-border grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-paper shadow-pop"
          >
            <GearIcon size={32} />
          </button>
          <span className="flex-1" />
          <CurrencyPill onClick={() => setPanel('bank')} />
          <button
            type="button"
            onClick={() => setPanel('shop')}
            aria-label="Cửa hàng vật dụng"
            className="ink-border flex h-12 shrink-0 items-center gap-1.5 rounded-2xl bg-paper pl-1.5 pr-3 font-display text-lg text-navy shadow-pop"
          >
            <ShopIcon size={34} />
            Cửa hàng
          </button>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,0.78fr)_minmax(0,1.5fr)_auto] gap-x-4 pt-2">
          {/* left: the player's character with today's missions in a speech bubble */}
          <div className="relative flex min-h-0 flex-col items-center justify-end">
            <button
              type="button"
              onClick={() => setPanel('missions')}
              className="relative z-10 mb-1 shrink-0"
              aria-label={`Nhiệm vụ hôm nay: ${doneCount}/${MISSIONS.length}. Bấm để xem`}
            >
              <motion.span
                className="ink-border relative flex items-center gap-2 rounded-[20px] bg-paper px-3 py-2 text-left shadow-pop"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="[&>svg]:h-9 [&>svg]:w-9">
                  <ScrollIcon size={36} />
                </span>
                <span>
                  <span className="block font-display text-[17px] leading-tight text-primary-dark">
                    {claimable > 0 ? '🎁 Có quà nhiệm vụ!' : 'Nhiệm vụ hôm nay'}
                  </span>
                  <span className="block whitespace-nowrap text-[14px] font-semibold text-navy">
                    {doneCount}/{MISSIONS.length} hoàn thành · Xem ▸
                  </span>
                </span>
                <span
                  aria-hidden
                  className="absolute -bottom-[10px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[2.5px] border-r-[2.5px] border-navy bg-paper"
                />
              </motion.span>
            </button>
            <Mascot
              interactive
              title="Nhân vật của bạn"
              className="min-h-0 w-auto flex-1 aspect-[11/16] max-w-full"
            />
          </div>

          {/* center: main modes */}
          <div className="flex min-h-0 flex-col justify-center gap-4 py-3">
            <BigButton
              title="Core game"
              subtitle={
                next && nextScenario
                  ? `Tiếp: ${nextScenario.title} · Màn ${next.code} – ${next.title}`
                  : 'Chọn chủ đề và màn chơi'
              }
              icon={<PlayIcon size={34} />}
              tone="#ec6a4c"
              onClick={() => navigate('/core')}
              delay={0.05}
            />
            <BigButton
              title="Streak"
              subtitle={
                todayResult?.passed
                  ? `Chuỗi ${streakDays} ngày · Hôm nay đã xong ✓`
                  : `Chuỗi ${streakDays} ngày · còn ${triesLeft} lượt hôm nay`
              }
              icon={<FlameIcon size={38} lit={streakDays > 0} />}
              tone="#ffd23f"
              onClick={() => navigate('/daily')}
              delay={0.12}
            />
            <BigButton
              title="Trạm cứu hộ"
              subtitle="Dùng băng gạc trang trí trạm của riêng bạn"
              icon={<StationIcon size={36} />}
              tone="#7cb8e4"
              onClick={() => navigate('/station')}
              delay={0.19}
            />
            <BigButton
              title="Hub"
              subtitle="Tìm khoá học sơ cứu thực tế gần bạn"
              icon={<PinIcon size={36} />}
              tone="#86c06c"
              onClick={() => navigate('/hub')}
              delay={0.26}
            />
          </div>

          {/* right: side menu */}
          <nav
            aria-label="Menu"
            className="flex min-h-0 flex-col items-center justify-center gap-2 py-1"
          >
            <SideButton
              label="Hướng dẫn"
              icon={<HelpIcon size={32} />}
              onClick={() => navigate('/tutorial')}
            />
            <SideButton
              label="Nhiệm vụ"
              icon={<ScrollIcon size={32} />}
              onClick={() => setPanel('missions')}
              badge={claimable}
            />
            <SideButton
              label="Khoá học"
              icon={<CapIcon size={32} />}
              onClick={() => setPanel('courses')}
              glow
            />
            <SideButton
              label="BXH"
              icon={<TrophyIcon size={32} />}
              onClick={() => navigate('/leaderboard')}
            />
            <SideButton
              label="Cẩm nang"
              icon={<BookIcon size={32} />}
              onClick={() => navigate('/handbook')}
            />
          </nav>
        </div>
      </div>

      <CoursesPopup
        open={(!newsSeen && panel === null) || panel === 'courses'}
        onClose={() => {
          markNewsSeen();
          setPanel(null);
        }}
      />
      <MissionsModal
        open={panel === 'missions'}
        onClose={() => setPanel(null)}
        input={missionInput}
      />
      <SettingsModal open={panel === 'settings'} onClose={() => setPanel(null)} />
      <Shop
        open={panel === 'shop'}
        onClose={() => setPanel(null)}
        onOpenBank={() => setPanel('bank')}
      />
      <BandageBank
        open={panel === 'bank'}
        onClose={() => setPanel(null)}
        onOpenMissions={() => setPanel('missions')}
      />
    </main>
  );
}
