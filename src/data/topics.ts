export type Topic =
  'cpr' | 'choking' | 'burn' | 'bleeding' | 'seizure' | 'fainting' | 'nosebleed' | 'drowning';

export const TOPIC_LABELS: Record<Topic, string> = {
  cpr: 'Ép tim (CPR)',
  choking: 'Hóc dị vật',
  burn: 'Bỏng',
  bleeding: 'Chảy máu',
  seizure: 'Co giật',
  fainting: 'Ngất',
  nosebleed: 'Chảy máu cam',
  drowning: 'Đuối nước',
};

export const TOPIC_EMOJI: Record<Topic, string> = {
  cpr: '❤️',
  choking: '😮',
  burn: '🔥',
  bleeding: '🩹',
  seizure: '⚡',
  fainting: '💫',
  nosebleed: '👃',
  drowning: '🏊',
};

export const ALL_TOPICS = Object.keys(TOPIC_LABELS) as Topic[];
