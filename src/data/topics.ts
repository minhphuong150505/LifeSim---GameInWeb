import type { Topic } from '../features/scenario/types';

export const TOPIC_LABELS: Record<Topic, string> = {
  cpr: 'Ép tim (CPR)',
  choking: 'Hóc dị vật',
  burn: 'Bỏng',
  bleeding: 'Chảy máu',
  seizure: 'Co giật',
  fainting: 'Ngất',
  nosebleed: 'Chảy máu cam',
};

export const TOPIC_EMOJI: Record<Topic, string> = {
  cpr: '❤️',
  choking: '😮',
  burn: '🔥',
  bleeding: '🩹',
  seizure: '⚡',
  fainting: '💫',
  nosebleed: '👃',
};

export const ALL_TOPICS = Object.keys(TOPIC_LABELS) as Topic[];
