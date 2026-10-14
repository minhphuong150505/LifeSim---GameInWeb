/** Date helpers working on local-device day keys formatted as YYYY-MM-DD. */

export type DateKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toDateKey(date: Date = new Date()): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a day key into a UTC timestamp at midnight (DST-safe for day arithmetic). */
function toUtcMs(key: DateKey): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

const DAY_MS = 86_400_000;

/** Whole days from `from` to `to` (positive when `to` is later). */
export function diffDays(from: DateKey, to: DateKey): number {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / DAY_MS);
}

export function addDays(key: DateKey, days: number): DateKey {
  const d = new Date(toUtcMs(key) + days * DAY_MS);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** 0 = Sunday … 6 = Saturday. */
export function weekdayOf(key: DateKey): number {
  return new Date(toUtcMs(key)).getUTCDay();
}

/** The 7 day keys (Monday → Sunday) of the week containing `key`. */
export function weekKeys(key: DateKey): DateKey[] {
  const mondayOffset = (weekdayOf(key) + 6) % 7;
  const monday = addDays(key, -mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] as const;
