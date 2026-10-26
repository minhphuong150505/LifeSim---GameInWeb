import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Sticker } from '../components/Sticker';
import { TrophyIcon, UsersIcon } from '../art/icons';
import botsJson from '../data/bots.json';
import { EVENT_NAME } from '../data/copy';
import poolJson from '../data/dailyPool.json';
import type { Bot } from '../features/leaderboard/leaderboardLogic';
import { QuickQuestion, type QuickAnswer } from '../features/streak/QuickQuestion';
import type { DailyQuestion } from '../features/streak/streakLogic';
import {
  createMatch,
  mvpOf,
  playRound,
  ROUND_TIME_SEC,
  TEAM_ROUNDS,
  teamScore,
  winnerOf,
  type Match,
  type TeamId,
  type TeamMember,
} from '../features/team/teamLogic';
import { cn } from '../lib/cn';
import { mulberry32, type Rng } from '../lib/seededRandom';
import { playSound } from '../lib/sound';
import { useProgressStore } from '../store/progress';
import { useUserStore } from '../store/user';

const bots = botsJson as Bot[];
const pool = poolJson as DailyQuestion[];
type Phase = 'lobby' | 'question' | 'reveal' | 'end';

/** Each match gets a fresh seed so line-ups and questions vary between games. */
function newSession(player: { nickname: string; avatar: string }): { rng: Rng; match: Match } {
  const rng = mulberry32(Date.now() >>> 0);
  return { rng, match: createMatch(rng, bots, pool, player) };
}

function TeamColumn({
  members,
  team,
  label,
}: {
  members: TeamMember[];
  team: TeamId;
  label: string;
}) {
  return (
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          'mb-2 text-center font-display text-base font-bold',
          team === 'ally' ? 'text-primary-dark' : 'text-navy',
        )}
      >
        {label}
      </p>
      <ul className="space-y-1.5">
        {members
          .filter((m) => m.team === team)
          .map((m) => (
            <li
              key={m.id}
              className="ink-border flex items-center gap-2 rounded-2xl bg-paper p-1.5 shadow-soft"
            >
              <Avatar id={m.avatar} size={32} ring={team === 'ally' ? 'red' : 'navy'} />
              <span className="min-w-0 flex-1 truncate text-xs font-semibold text-navy">
                {m.nickname}
                {m.isPlayer && ' (bạn)'}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

function ScoreBoard({ members }: { members: TeamMember[] }) {
  const ally = teamScore(members, 'ally');
  const rival = teamScore(members, 'rival');
  const total = Math.max(1, ally + rival);
  return (
    <div aria-live="polite" className="rounded-card bg-navy p-3 text-white">
      <div className="flex items-end justify-between font-display font-bold">
        <span>
          <span className="block text-xs font-semibold text-white">Đội bạn</span>
          <motion.span
            key={ally}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="inline-block text-3xl text-accent"
          >
            {ally}
          </motion.span>
        </span>
        <span className="pb-1 text-sm">5 vs 5</span>
        <span className="text-right">
          <span className="block text-xs font-semibold text-white">Đối thủ</span>
          <motion.span
            key={rival}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            className="inline-block text-3xl"
          >
            {rival}
          </motion.span>
        </span>
      </div>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-white/25">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${(ally / total) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}

export function Team() {
  const nickname = useUserStore((s) => s.nickname);
  const avatar = useUserStore((s) => s.avatar);
  const recordTeamMatch = useProgressStore((s) => s.recordTeamMatch);

  const [session, setSession] = useState(() => newSession({ nickname, avatar }));
  const [members, setMembers] = useState(session.match.members);
  const [phase, setPhase] = useState<Phase>('lobby');
  const [round, setRound] = useState(0);
  const recordedRef = useRef(false);

  const question = session.match.questions[round];
  const winner = winnerOf(members);
  const mvp = mvpOf(members);

  const onAnswered = (answer: QuickAnswer) => {
    setMembers((prev) => playRound(prev, answer, session.rng));
    setPhase('reveal');
  };

  const next = () => {
    if (round < TEAM_ROUNDS - 1) {
      setRound(round + 1);
      setPhase('question');
      return;
    }
    if (!recordedRef.current) {
      recordedRef.current = true;
      recordTeamMatch(winner === 'ally');
    }
    playSound('win');
    setPhase('end');
  };

  const rematch = () => {
    const fresh = newSession({ nickname, avatar });
    recordedRef.current = false;
    setSession(fresh);
    setMembers(fresh.match.members);
    setRound(0);
    setPhase('lobby');
  };

  if (phase === 'lobby') {
    return (
      <div>
        <PageHeader title="Team Rescue 5v5" subtitle={`Sự kiện: ${EVENT_NAME}`} />
        <div className="space-y-4 px-4">
          <div
            role="img"
            aria-label="Hai đội cứu hộ LifeSim đối đầu 5 vs 5"
            className="ink-border relative flex items-center justify-around overflow-hidden rounded-card bg-navy px-3 pb-3 pt-10 shadow-soft"
          >
            <UsersIcon size={64} />
            <TrophyIcon size={72} />
            <UsersIcon size={64} />
            <span className="ink-border absolute left-3 top-3 rounded-full bg-accent px-3 py-0.5 font-display text-sm text-navy">
              {EVENT_NAME}
            </span>
          </div>
          <p className="ink-border rounded-2xl bg-[#fff1c2] p-2 text-center text-xs text-navy">
            Sự kiện 5v5 đang thử nghiệm – cơ chế chính thức sẽ được cập nhật sau.
          </p>

          <div className="relative flex items-start gap-3">
            <TeamColumn members={members} team="ally" label="Đội của bạn" />
            <motion.span
              className="mt-24 shrink-0 rounded-2xl bg-navy px-2 py-1 font-display text-lg font-bold text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              5 vs 5
            </motion.span>
            <TeamColumn members={members} team="rival" label="Đội đối thủ" />
          </div>

          <Card className="text-sm text-ink">
            {TEAM_ROUNDS} vòng · mỗi vòng 1 câu hỏi nhanh ({ROUND_TIME_SEC} giây). Trả lời đúng và
            nhanh để ghi điểm cho đội. Điểm đội = tổng điểm 5 thành viên.
          </Card>
          <Button block size="lg" onClick={() => setPhase('question')}>
            Vào trận
          </Button>
          <p className="text-center text-xs text-muted">
            Bản demo – đồng đội và đối thủ là máy. Chế độ online sẽ có ở phiên bản sau.
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'end') {
    const won = winner === 'ally';
    return (
      <div className="safe-top space-y-4 px-4">
        <Card tape className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' }}
          >
            <Sticker name="trophy" className="mx-auto h-32 w-auto" />
          </motion.div>
          <h1 className="mt-2 text-3xl font-bold text-navy">
            {winner === 'draw'
              ? 'Hòa nhau!'
              : won
                ? 'Đội bạn chiến thắng! 🎉'
                : 'Đội đối thủ thắng'}
          </h1>
          <p className="text-sm text-muted">
            {won ? 'Phối hợp tuyệt vời!' : 'Luyện thêm vài tình huống rồi phục thù nhé.'}
          </p>
        </Card>
        <ScoreBoard members={members} />
        {mvp && (
          <Card className="flex items-center gap-3">
            <Avatar id={mvp.avatar} size={56} ring="yellow" />
            <div className="min-w-0 flex-1">
              <Badge tone="yellow">⭐ MVP của trận</Badge>
              <p className="truncate font-display text-xl font-bold text-navy">
                {mvp.nickname}
                {mvp.isPlayer && ' (bạn)'}
              </p>
            </div>
            <span className="font-display text-2xl font-bold text-primary-dark">{mvp.score}</span>
          </Card>
        )}
        <Card>
          <h2 className="text-lg font-bold text-navy">Bảng điểm cá nhân</h2>
          <ol className="mt-2 space-y-1.5">
            {[...members]
              .sort((a, b) => b.score - a.score)
              .map((m, i) => (
                <li
                  key={m.id}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm',
                    m.isPlayer ? 'bg-accent/30' : 'bg-cream',
                  )}
                >
                  <span className="w-5 text-center font-bold text-navy">{i + 1}</span>
                  <Avatar id={m.avatar} size={28} ring={m.team === 'ally' ? 'red' : 'navy'} />
                  <span className="min-w-0 flex-1 truncate font-semibold text-navy">
                    {m.nickname}
                    {m.isPlayer && ' (bạn)'}
                  </span>
                  <span className="text-xs text-muted">
                    {m.team === 'ally' ? 'Đội bạn' : 'Đối thủ'}
                  </span>
                  <span className="w-12 text-right font-display font-bold tabular-nums text-navy">
                    {m.score}
                  </span>
                </li>
              ))}
          </ol>
        </Card>
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex min-h-11 shrink-0 items-center ink-border rounded-2xl bg-paper px-4 font-display font-bold text-navy shadow-pop"
          >
            Trang chủ
          </Link>
          <Button block onClick={rematch}>
            Đấu trận mới
          </Button>
        </div>
        <p className="text-center text-xs text-muted">Chế độ online sẽ có ở phiên bản sau.</p>
      </div>
    );
  }

  return (
    <div className="safe-top space-y-3 px-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold text-navy">
          Vòng {round + 1}/{TEAM_ROUNDS}
        </p>
        <Badge tone="gray">Bản demo – đấu với máy</Badge>
      </div>
      <ScoreBoard members={members} />
      <AnimatePresence mode="wait">
        <motion.div
          key={round}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
        >
          {question && (
            <QuickQuestion
              question={question}
              timeLimitSec={ROUND_TIME_SEC}
              onAnswered={onAnswered}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {phase === 'reveal' && (
        <Button block size="lg" onClick={next}>
          {round < TEAM_ROUNDS - 1 ? 'Vòng tiếp theo →' : 'Xem kết quả'}
        </Button>
      )}
    </div>
  );
}
