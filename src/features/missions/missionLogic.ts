import type { DateKey } from '../../lib/date';

export type MissionId = 'play-round' | 'daily-streak' | 'read-handbook';

export type MissionDef = {
  id: MissionId;
  title: string;
  description: string;
  reward: number;
  /** Where "Đi tới" sends the player when they don't know where to do the mission. */
  to: string;
  goLabel: string;
};

/** Daily missions shown on the main screen; they reset every local day. */
export const MISSIONS: MissionDef[] = [
  {
    id: 'play-round',
    title: 'Chơi 1 màn Core game',
    description: 'Hoàn thành (thắng hoặc thua) bất kỳ màn nào trong Core game.',
    reward: 10,
    to: '/core',
    goLabel: 'Tới Core game',
  },
  {
    id: 'daily-streak',
    title: 'Thực hiện Daily Streak',
    description: 'Vượt qua thử thách 3 câu hỏi nhanh hôm nay để giữ chuỗi.',
    reward: 10,
    to: '/daily',
    goLabel: 'Tới Streak',
  },
  {
    id: 'read-handbook',
    title: 'Đọc lại 1 bài Cẩm nang',
    description: 'Mở Cẩm nang sơ cứu và đọc lại một bài để ghi nhớ kiến thức.',
    reward: 5,
    to: '/handbook',
    goLabel: 'Mở Cẩm nang',
  },
];

export type DayActivity = { played?: boolean; handbook?: boolean };

export type MissionInput = {
  today: DateKey;
  activity: Record<DateKey, DayActivity>;
  /** Daily streak passed today. */
  streakPassed: boolean;
  claimed: Record<DateKey, MissionId[]>;
};

export type MissionStatus = 'todo' | 'ready' | 'claimed';

export function missionDone(id: MissionId, input: MissionInput): boolean {
  const day = input.activity[input.today] ?? {};
  if (id === 'play-round') return Boolean(day.played);
  if (id === 'daily-streak') return input.streakPassed;
  return Boolean(day.handbook);
}

export function missionStatus(id: MissionId, input: MissionInput): MissionStatus {
  if ((input.claimed[input.today] ?? []).includes(id)) return 'claimed';
  return missionDone(id, input) ? 'ready' : 'todo';
}

/** Missions finished today (claimed or waiting to be claimed). */
export function missionsDoneCount(input: MissionInput): number {
  return MISSIONS.filter((m) => missionStatus(m.id, input) !== 'todo').length;
}

export function claimableCount(input: MissionInput): number {
  return MISSIONS.filter((m) => missionStatus(m.id, input) === 'ready').length;
}
