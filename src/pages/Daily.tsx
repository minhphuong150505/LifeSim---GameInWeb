import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BandageIcon, FlameIcon, GiftIcon } from '../art/icons';
import { Mascot } from '../art/Mascot';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import poolJson from '../data/dailyPool.json';
import { TOPIC_LABELS } from '../data/topics';
import { QuickQuestion, type QuickAnswer } from '../features/streak/QuickQuestion';
import {
  activeStreak,
  DAILY_ATTEMPTS,
  DAILY_PASS_MIN,
  DAILY_QUESTION_COUNT,
  DAILY_TIME_LIMIT_SEC,
  passedDaily,
  pickDailyQuestions,
  STREAK_GIFTS,
  STREAK_MILESTONES,
  type DailyQuestion,
} from '../features/streak/streakLogic';
import { WeekCalendar } from '../features/streak/WeekCalendar';
import { cn } from '../lib/cn';
import { toDateKey } from '../lib/date';
import { playSound } from '../lib/sound';
import { useProgressStore } from '../store/progress';
import { attemptsLeft, useStreakStore } from '../store/streak';
import { useWalletStore } from '../store/wallet';

const pool = poolJson as DailyQuestion[];

export function Daily() {
  const today = toDateKey();
  const streak = useStreakStore();
  const earn = useWalletStore((s) => s.earn);
  const recordAnswers = useProgressStore((s) => s.recordAnswers);
  const todayResult = streak.results[today];
  const triesLeft = attemptsLeft(todayResult);
  const attempt = (todayResult?.attempts ?? 0) + 1;
  const questions = useMemo(() => pickDailyQuestions(pool, today, attempt), [today, attempt]);

  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuickAnswer[]>([]);
  const [lastRun, setLastRun] = useState<number | null>(null);

  const streakDays = activeStreak(streak, today);
  const passedDays = useMemo(
    () =>
      new Set(
        Object.entries(streak.results)
          .filter(([, r]) => r.passed)
          .map(([d]) => d),
      ),
    [streak.results],
  );
  const nextMilestone = STREAK_MILESTONES.find((m) => streakDays < m) ?? STREAK_MILESTONES[2];
  const question = questions[index];
  const answeredCurrent = answers.length > index;

  const start = () => {
    setIndex(0);
    setAnswers([]);
    setLastRun(null);
    setPlaying(true);
  };

  const onAnswered = (answer: QuickAnswer) => {
    if (question) recordAnswers(question.topic, answer.correct ? 1 : 0, 1);
    setAnswers((a) => [...a, answer]);
  };

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    const correct = answers.filter((a) => a.correct).length;
    streak.submitAttempt(today, { correct, total: questions.length });
    playSound(passedDaily(correct) ? 'win' : 'wrong');
    setLastRun(correct);
    setPlaying(false);
  };

  const claim = (m: number) => {
    const gift = streak.claimGift(m);
    if (gift > 0) {
      earn(gift);
      playSound('found');
    }
  };

  if (playing && question) {
    return (
      <div className="safe-top px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-xl text-navy">
            Lượt {attempt}/{DAILY_ATTEMPTS} · Câu {index + 1}/{questions.length}
          </p>
          <Badge tone="red">{TOPIC_LABELS[question.topic]}</Badge>
        </div>
        <QuickQuestion
          key={question.id}
          question={question}
          timeLimitSec={DAILY_TIME_LIMIT_SEC}
          onAnswered={onAnswered}
        />
        {answeredCurrent && (
          <Button block size="lg" className="mt-4" onClick={goNext}>
            {index < questions.length - 1 ? 'Câu tiếp theo →' : 'Hoàn thành'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Daily Rescue Streak" subtitle="Mỗi ngày một thử thách ngắn để giữ lửa." />
      <div className="space-y-4 px-4">
        <section className="ink-border relative overflow-hidden rounded-card bg-gradient-to-br from-[#ffd23f] to-[#f5874f] p-4 shadow-soft">
          <Mascot mood="happy" className="absolute -bottom-3 right-1 h-36 w-28" />
          <p className="font-display text-lg text-navy">Chuỗi hiện tại</p>
          <p className="mt-1 flex items-center gap-1 font-display text-6xl leading-none text-navy">
            <motion.span
              aria-hidden
              className="inline-block"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              <FlameIcon size={60} lit={streakDays > 0} />
            </motion.span>
            {streakDays}
            <span className="ml-1 text-2xl">ngày</span>
          </p>
          <p className="ink-border mt-2 w-fit rounded-full bg-paper px-3 py-0.5 font-display text-navy">
            Ngày {Math.min(streakDays, nextMilestone)}/{nextMilestone} · Kỷ lục {streak.best}
          </p>
        </section>

        <WeekCalendar today={today} completedDays={passedDays} />

        <Card tape>
          {todayResult?.passed ? (
            <div className="text-center">
              <h2 className="font-display text-2xl text-navy">Hôm nay bạn đã hoàn thành! 🎉</h2>
              <p className="mt-1 text-ink">
                Đúng <span className="font-bold text-success-dark">{todayResult.correct}</span>/
                {todayResult.total} câu. Quay lại vào ngày mai để nối dài chuỗi nhé.
              </p>
              <Link
                to="/scenarios"
                className="mt-2 inline-flex min-h-11 items-center font-semibold text-primary-dark underline"
              >
                Luyện thêm tình huống
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-2xl text-navy">Thử thách hôm nay</h2>
              <p className="mt-1 text-sm text-ink">
                {DAILY_QUESTION_COUNT} câu · {DAILY_TIME_LIMIT_SEC} giây mỗi câu · đúng từ{' '}
                {DAILY_PASS_MIN} câu trở lên để giữ chuỗi.
              </p>
              <div
                className="mt-2 flex items-center gap-2"
                aria-label={`Còn ${triesLeft}/${DAILY_ATTEMPTS} lượt thử`}
              >
                <span className="text-sm font-semibold text-navy">Lượt thử:</span>
                {Array.from({ length: DAILY_ATTEMPTS }, (_, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={cn(
                      'ink-border h-5 w-5 rounded-full',
                      i < triesLeft ? 'bg-primary' : 'bg-[#d8d1c2]',
                    )}
                  />
                ))}
              </div>
              {lastRun !== null && !passedDaily(lastRun) && (
                <p
                  role="status"
                  className="mt-2 rounded-xl bg-[#fde3da] p-2 text-sm text-primary-dark"
                >
                  Bạn đúng {lastRun}/{DAILY_QUESTION_COUNT} câu – chưa đủ để giữ chuỗi.
                  {triesLeft > 0 ? ' Còn 1 lượt nữa với bộ câu hỏi mới!' : ' Hẹn bạn ngày mai nhé.'}
                </p>
              )}
              <Button block size="lg" className="mt-3" disabled={triesLeft === 0} onClick={start}>
                {triesLeft === 0
                  ? 'Hết lượt hôm nay'
                  : attempt > 1
                    ? 'Thử lại (lượt 2)'
                    : 'Bắt đầu'}
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-xl text-navy">Quà theo mốc</h2>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {STREAK_MILESTONES.map((m) => {
              const reached = streak.best >= m;
              const claimed = streak.claimedGifts.includes(m);
              return (
                <li
                  key={m}
                  className={cn(
                    'flex flex-col items-center rounded-2xl border-2 p-2 text-center',
                    reached ? 'border-navy bg-[#fff1c2]' : 'border-navy/20 bg-black/5',
                  )}
                >
                  <GiftIcon
                    open={claimed}
                    size={40}
                    className={cn(!reached && 'opacity-40 grayscale')}
                  />
                  <span className="font-display text-lg text-navy">{m} ngày</span>
                  <span className="flex items-center text-xs font-semibold text-navy">
                    +{STREAK_GIFTS[m]} <BandageIcon size={18} />
                  </span>
                  {reached && !claimed ? (
                    <Button
                      variant="yellow"
                      className="mt-1 min-h-9 px-2 text-base"
                      onClick={() => claim(m)}
                    >
                      Nhận
                    </Button>
                  ) : (
                    <span className="mt-1 text-[11px] text-muted">
                      {claimed ? 'Đã nhận' : 'Chưa đạt'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
