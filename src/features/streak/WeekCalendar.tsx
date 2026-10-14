import { cn } from '../../lib/cn';
import { WEEKDAY_SHORT, weekdayOf, weekKeys, type DateKey } from '../../lib/date';

type WeekCalendarProps = { today: DateKey; completedDays: ReadonlySet<DateKey> };

/** Monday-first week strip with a flame on every completed day. */
export function WeekCalendar({ today, completedDays }: WeekCalendarProps) {
  return (
    <ol className="grid grid-cols-7 gap-1.5">
      {weekKeys(today).map((day) => {
        const done = completedDays.has(day);
        const isToday = day === today;
        return (
          <li
            key={day}
            aria-label={`${WEEKDAY_SHORT[weekdayOf(day)]} ${Number(day.slice(8))}: ${done ? 'đã hoàn thành' : 'chưa hoàn thành'}${isToday ? ' (hôm nay)' : ''}`}
            className={cn(
              'flex flex-col items-center rounded-2xl border-2 py-1.5',
              isToday ? 'border-primary bg-white' : 'border-transparent bg-white/70',
            )}
          >
            <span className="text-[11px] font-semibold text-muted">
              {WEEKDAY_SHORT[weekdayOf(day)]}
            </span>
            <span
              aria-hidden
              className={cn('text-2xl leading-tight', !done && 'opacity-25 grayscale')}
            >
              🔥
            </span>
            <span className="text-xs font-bold text-navy">{Number(day.slice(8))}</span>
          </li>
        );
      })}
    </ol>
  );
}
