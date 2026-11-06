import type { BankItemId } from '../../art/WaterScenes';

/* Pure data and rules of the scenario-2 hands-on tasks (kept apart from the UI for tests). */

/** The two objects that help: a long, sturdy branch to reach and an empty box that floats. */
export const RIGHT_FINDS: BankItemId[] = ['long-branch', 'plastic-box'];

export const FIND_TIPS: Record<BankItemId, string> = {
  'long-branch': 'Cành cây dài, chắc chắn – đưa cho bạn ấy nắm mà bạn vẫn đứng an toàn trên bờ.',
  'plastic-box': 'Thùng nhựa rỗng có nắp nổi rất tốt – bạn ấy có thể ôm để giữ mình trên mặt nước.',
  'short-branch': 'Cành cây nhỏ quá ngắn và dễ gãy – không đủ tầm với tới bạn ấy.',
  backpack: 'Ba lô đầy đồ sẽ thấm nước và chìm xuống.',
  rock: 'Viên đá lớn chìm ngay – tuyệt đối không ném về phía người gặp nạn.',
  sandals: 'Dép quá nhỏ, không đủ sức nổi để giữ một người.',
  'small-towel': 'Khăn nhỏ không nổi và quá ngắn để kéo.',
};

export const CPR_TARGET = 30;
const MIN_BPM = 100;
const MAX_BPM = 120;
/** Taps a bit outside the band still count: finger timing is never perfect. */
const COUNT_MIN = 92;
const COUNT_MAX = 132;

export type Rhythm = 'idle' | 'slow' | 'good' | 'fast';

export function rhythmOf(bpm: number | null): Rhythm {
  if (bpm === null) return 'idle';
  if (bpm < MIN_BPM) return 'slow';
  if (bpm > MAX_BPM) return 'fast';
  return 'good';
}

/** Whether a compression made `intervalMs` after the previous one counts. */
export function compressionCounts(intervalMs: number | null): boolean {
  if (intervalMs === null) return true;
  const bpm = 60000 / intervalMs;
  return bpm >= COUNT_MIN && bpm <= COUNT_MAX;
}

export type Card = { id: 'A' | 'B' | 'C' | 'D'; text: string; tip: string };

export const BREATH_CARDS: Card[] = [
  {
    id: 'A',
    text: 'Bịt mũi nạn nhân.',
    tip: 'Bịt mũi ngay trước khi thổi, sau khi đường thở đã thông.',
  },
  { id: 'B', text: 'Ngửa đầu và nâng cằm để mở đường thở.', tip: 'Đầu tiên cần mở đường thở.' },
  {
    id: 'C',
    text: 'Áp miệng kín miệng nạn nhân và thổi 2 hơi liên tục (mỗi hơi khoảng 1 giây) để lồng ngực phồng lên.',
    tip: 'Thổi ngạt là bước cuối cùng.',
  },
  {
    id: 'D',
    text: 'Kiểm tra và làm sạch chất tiết/dị vật nhìn thấy được trong miệng nếu có.',
    tip: 'Làm sạch miệng ngay sau khi mở đường thở, trước khi thổi.',
  },
];
export const BREATH_ORDER: Card['id'][] = ['B', 'D', 'A', 'C'];
