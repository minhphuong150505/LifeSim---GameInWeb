import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookIcon,
  FlameIcon,
  GearIcon,
  HelpIcon,
  PartyIcon,
  PinIcon,
  PlayIcon,
  ScrollIcon,
  TrophyIcon,
} from '../art/icons';
import { LivingRoom, ROOM_H, ROOM_W } from '../art/LivingRoom';
import { Mascot } from '../art/Mascot';
import { Avatar } from '../components/Avatar';
import { CurrencyPill } from '../components/CurrencyPill';
import { allRounds, scenarioOf } from '../data/sim';
import { NewsPopup } from '../features/lobby/NewsPopup';
import { MissionsModal } from '../features/lobby/MissionsModal';
import { SettingsModal } from '../features/lobby/SettingsModal';
import {
  claimableCount,
  missionsDoneCount,
  MISSIONS,
  type MissionInput,
} from '../features/missions/missionLogic';
import { usePlayerLevel } from '../features/profile/usePlayerLevel';
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
      className="group relative flex flex-col items-center"
      aria-label={badge ? `${label} (${badge} mới)` : label}
    >
      <span
        className={cn(
          'ink-border relative grid h-[clamp(28px,10dvh,48px)] w-[clamp(28px,10dvh,48px)] place-items-center rounded-2xl shadow-pop transition-transform group-active:translate-y-0.5 [&>svg]:h-[72%] [&>svg]:w-[72%]',
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
      <span className="mt-0.5 rounded-md bg-paper/85 px-1 font-display text-[12px] leading-[14px] text-navy short:text-[10px] short:leading-3 tiny:sr-only">
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
      className="ink-border flex w-full items-center gap-3 rounded-[20px] px-3 py-[clamp(4px,1.4dvh,10px)] text-left shadow-pop"
      style={{ backgroundColor: tone }}
    >
      <span className="ink-border grid h-[clamp(30px,11dvh,56px)] w-[clamp(30px,11dvh,56px)] [&>svg]:h-[70%] [&>svg]:w-[70%] shrink-0 place-items-center rounded-2xl bg-paper">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[clamp(22px,6dvh,32px)] leading-tight text-navy">
          {title}
        </span>
        <span className="block truncate text-[13px] font-semibold text-navy/80">{subtitle}</span>
      </span>
      <PlayIcon size={30} />
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
  const [panel, setPanel] = useState<'missions' | 'settings' | 'shop' | null>(null);

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
    <main className="relative h-dvh overflow-hidden">
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
        className="absolute inset-0 bg-gradient-to-r from-cream/10 via-cream/40 to-cream/70"
      />

      <div className="relative grid h-full grid-cols-[minmax(0,0.85fr)_minmax(0,1.25fr)_auto] grid-rows-[auto_minmax(0,1fr)] gap-x-3 px-[max(12px,env(safe-area-inset-left))] pb-[max(8px,env(safe-area-inset-bottom))] pr-[max(12px,env(safe-area-inset-right))] pt-[max(8px,env(safe-area-inset-top))]">
        {/* top-left: profile */}
        <div className="col-span-2 flex items-start gap-2">
          <button
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Hồ sơ nhân vật"
            className="ink-border flex min-w-0 items-center gap-2 rounded-2xl bg-paper/95 py-1 pl-1 pr-3 shadow-pop"
          >
            <span className="relative">
              <Avatar id={avatar} size={46} ring="red" className="short:!h-9 short:!w-9" />
              <span className="ink-border absolute -bottom-1 -right-2 rounded-full bg-accent px-1 font-display text-[11px] leading-4 text-navy">
                Lv{level}
              </span>
            </span>
            <span className="min-w-0 text-left">
              <span className="block max-w-[150px] truncate font-display text-lg leading-tight text-navy">
                {nickname}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-semibold text-navy short:text-[11px]">
                <FlameIcon size={18} lit={streakDays > 0} />
                Streak {streakDays} ngày
              </span>
              <span
                className="mt-0.5 block h-1.5 w-[110px] overflow-hidden rounded-full bg-navy/15"
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
            className="ink-border grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper/95 shadow-pop"
          >
            <GearIcon size={30} />
          </button>
        </div>

        {/* left: character with mission bubble */}
        <div className="relative flex min-h-0 items-end justify-center">
          <button
            type="button"
            onClick={() => setPanel('missions')}
            className="absolute left-1/2 top-[4%] z-10 w-max max-w-[95%] -translate-x-1/2"
            aria-label={`Nhiệm vụ hôm nay: ${doneCount}/${MISSIONS.length}. Bấm để xem`}
          >
            <motion.span
              className="ink-border relative block rounded-[18px] bg-paper px-3 py-1.5 text-center shadow-pop"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="block font-display text-[15px] leading-tight text-primary-dark short:text-[13px]">
                {claimable > 0 ? '🎁 Có quà nhiệm vụ!' : 'Nhiệm vụ hôm nay'}
              </span>
              <span className="block text-[13px] font-semibold text-navy short:text-[11px]">
                {doneCount}/{MISSIONS.length} hoàn thành · Bấm để xem
              </span>
              <span
                aria-hidden
                className="absolute -bottom-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-[2.5px] border-r-[2.5px] border-navy bg-paper"
              />
            </motion.span>
          </button>
          <Mascot
            interactive
            title="Nhân vật của bạn"
            className="h-[68%] max-h-64 w-auto aspect-[11/16]"
          />
        </div>

        {/* center: main modes */}
        <div className="flex min-h-0 flex-col justify-center gap-[clamp(4px,2.5dvh,14px)] py-2 short:py-1">
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
            title="Hub"
            subtitle="Tìm khoá học sơ cứu thực tế"
            icon={<PinIcon size={36} />}
            tone="#86c06c"
            onClick={() => navigate('/hub')}
            delay={0.19}
          />
        </div>

        {/* right column: bandages on top, then the side menu */}
        <div className="col-start-3 row-span-2 row-start-1 flex min-h-0 flex-col items-end">
          <CurrencyPill onClick={() => setPanel('shop')} />
          <nav
            aria-label="Menu"
            className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(2px,1.2dvh,10px)] self-stretch pb-1 pt-1"
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
              label="Sự kiện"
              icon={<PartyIcon size={32} />}
              onClick={() => navigate('/team')}
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

      <NewsPopup open={!newsSeen && panel === null} onClose={markNewsSeen} />
      <MissionsModal
        open={panel === 'missions'}
        onClose={() => setPanel(null)}
        input={missionInput}
      />
      <SettingsModal open={panel === 'settings'} onClose={() => setPanel(null)} />
      <Shop open={panel === 'shop'} onClose={() => setPanel(null)} />
    </main>
  );
}
