import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Sticker } from '../components/Sticker';
import { assets } from '../data/assets';
import poolJson from '../data/dailyPool.json';
import { TOPIC_LABELS } from '../data/topics';
import { QuickQuestion, type QuickAnswer } from '../features/streak/QuickQuestion';
import {
  activeStreak,
  DAILY_TIME_LIMIT_SEC,
  pickDailyQuestions,
  STREAK_MILESTONES,
  type DailyQuestion,
} from '../features/streak/streakLogic';
import { WeekCalendar } from '../features/streak/WeekCalendar';
import { cn } from '../lib/cn';
import { toDateKey } from '../lib/date';
import { playSound } from '../lib/sound';
import { useProgressStore } from '../store/progress';
import { useStreakStore } from '../store/streak';

const pool = poolJson as DailyQuestion[];
const MILESTONE_REWARDS: Record<number, string> = { 3: '🩹', 7: '🎁', 14: '🏅' };

export function Daily() {
  const today = toDateKey();
  const streak = useStreakStore();
  const recordAnswers = useProgressStore((s) => s.recordAnswers);
  const questions = useMemo(() => pickDailyQuestions(pool, today), [today]);

  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuickAnswer[]>([]);

  const todayResult = streak.results[today];
  const streakDays = activeStreak(streak, today);
  const completedDays = useMemo(() => new Set(Object.keys(streak.results)), [streak.results]);
  const nextMilestone = STREAK_MILESTONES.find((m) => streakDays < m) ?? STREAK_MILESTONES[2];
  const question = questions[index];
  const answeredCurrent = answers.length > index;

  const onAnswered = (answer: QuickAnswer) => {
    if (question) recordAnswers(question.topic, answer.correct ? 1 : 0, 1);
    setAnswers((a) => [...a, answer]);
  };

  const goNext = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
      return;
    }
    streak.completeDaily(today, {
      correct: answers.filter((a) => a.correct).length,
      total: questions.length,
    });
    playSound('win');
    setPlaying(false);
  };

  if (playing && question) {
    return (
      <div className="safe-top px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-navy">
            Câu {index + 1}/{questions.length}
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
      <PageHeader title="Daily Rescue Streak" subtitle="Mỗi ngày 3 câu hỏi nhanh để giữ lửa." />
      <div className="space-y-4 px-4">
        <section className="relative overflow-hidden rounded-card bg-gradient-to-br from-[#FFB74D] to-[#F4511E] p-4 text-white shadow-soft">
          <img
            src={assets.proposal.characterPeace}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute -bottom-6 right-0 h-36 w-auto"
          />
          <p className="text-sm font-bold text-navy">Chuỗi hiện tại</p>
          <p className="mt-2 font-display text-6xl font-bold leading-none text-white drop-shadow">
            <motion.span
              aria-hidden
              className="inline-block"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
            >
              🔥
            </motion.span>{' '}
            {streakDays}
            <span className="ml-1 text-2xl">ngày</span>
          </p>
          <p className="mt-2 w-fit rounded-full bg-navy px-3 py-1 text-sm font-bold text-white">
            Ngày {Math.min(streakDays, nextMilestone)}/{nextMilestone} · Kỷ lục {streak.best}
          </p>
        </section>

        <WeekCalendar today={today} completedDays={completedDays} />

        <Card tape>
          {todayResult ? (
            <div className="text-center">
              <h2 className="text-xl font-bold text-navy">Hôm nay bạn đã hoàn thành! 🎉</h2>
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
              <h2 className="text-xl font-bold text-navy">Thử thách hôm nay</h2>
              <p className="mt-1 text-sm text-ink">
                3 câu · {DAILY_TIME_LIMIT_SEC} giây mỗi câu · thật hay giả, đúng hay sai, mẹo dân
                gian có nên tin?
              </p>
              <Button block size="lg" className="mt-3" onClick={() => setPlaying(true)}>
                Bắt đầu
              </Button>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-bold text-navy">Mốc thưởng</h2>
          <ul className="mt-2 grid grid-cols-3 gap-2">
            {STREAK_MILESTONES.map((m) => {
              const earned = streak.best >= m;
              return (
                <li
                  key={m}
                  className={cn(
                    'flex flex-col items-center rounded-2xl p-2 text-center',
                    earned ? 'bg-accent/25' : 'bg-black/5',
                  )}
                >
                  <span aria-hidden className={cn('text-3xl', !earned && 'opacity-30 grayscale')}>
                    {MILESTONE_REWARDS[m]}
                  </span>
                  <span className="font-display text-base font-bold text-navy">{m} ngày</span>
                  <span className="text-[11px] text-muted">
                    {earned ? 'Đã nhận huy hiệu' : 'Chưa đạt'}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            <Sticker name="bandage" className="h-8 w-auto" />
            Giữ chuỗi 3 / 7 / 14 ngày để nhận huy hiệu và sticker.
          </div>
        </Card>
      </div>
    </div>
  );
}
