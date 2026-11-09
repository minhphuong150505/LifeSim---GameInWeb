/* Rules of the scenario 3 (stroke) hands-on tasks, kept apart from the UI so they can be tested. */

export type SignId = 'face' | 'arm' | 'speech';

/** Face–Arm–Speech hotspots on the close-up of Ông Nội; boxes in % of the picture (x, y, w, h). */
export const SIGN_SPOTS: { id: SignId; label: string; box: [number, number, number, number] }[] = [
  { id: 'face', label: 'Méo miệng', box: [22, 30, 34, 30] },
  { id: 'arm', label: 'Yếu một bên tay', box: [50, 56, 30, 44] },
  { id: 'speech', label: 'Nói khó', box: [56, 0, 44, 30] },
];

export const SIGN_MISS = 'Quan sát mặt, tay và lời nói.';

/** The FAST summary card shown once the three signs are found. */
export const FAST_CARD: { letter: string; word: string; text: string }[] = [
  { letter: 'F', word: 'Face', text: 'Méo miệng, xệ một bên mặt' },
  { letter: 'A', word: 'Arm', text: 'Yếu hoặc tê một bên tay' },
  { letter: 'S', word: 'Speech', text: 'Nói khó, nói ngọng, khó hiểu' },
  { letter: 'T', word: 'Time', text: 'Gọi 115 ngay' },
];

export function allSignsFound(found: readonly SignId[]): boolean {
  return SIGN_SPOTS.every((s) => found.includes(s.id));
}

/* ── sort the objects by how safe they are ── */

export type SortItemId = 'phone' | 'water' | 'aspirin';
export type SortBin = 'safe' | 'avoid';

export const SORT_BINS: { id: SortBin; label: string }[] = [
  { id: 'safe', label: 'Có thể hỗ trợ an toàn' },
  { id: 'avoid', label: 'Không tự ý sử dụng khi nghi ngờ đột quỵ' },
];

export const SORT_ITEMS: {
  id: SortItemId;
  label: string;
  bin: SortBin;
  /** One line shown once the card is in the right group. */
  why: string;
  /** Hint when it is dropped in the wrong group. */
  hint: string;
}[] = [
  {
    id: 'phone',
    label: 'Điện thoại',
    bin: 'safe',
    why: 'Điện thoại dùng để gọi 115.',
    hint: 'Điện thoại giúp bạn liên lạc với 115 – đó là việc an toàn và cần thiết.',
  },
  {
    id: 'water',
    label: 'Cốc nước',
    bin: 'avoid',
    why: 'Nước có nguy cơ gây sặc.',
    hint: 'Người nghi đột quỵ có thể khó nuốt – uống nước có thể bị sặc.',
  },
  {
    id: 'aspirin',
    label: 'Vỉ aspirin',
    bin: 'avoid',
    why: 'Aspirin có thể bất lợi nếu là đột quỵ xuất huyết.',
    hint: 'Chưa biết loại đột quỵ – chỉ dùng thuốc khi có chỉ định chuyên môn.',
  },
];

export function sortIsRight(item: SortItemId, bin: SortBin): boolean {
  return SORT_ITEMS.find((i) => i.id === item)?.bin === bin;
}

/* ── breathing check ── */

export type BreathAnswer = 'normal' | 'abnormal';

/** Rare, irregular gasps: what Ông Nội is doing now. */
export const BREATH_NOW: BreathAnswer = 'abnormal';

export const BREATH_RIGHT =
  'Người bệnh không phản ứng + không thở bình thường: bắt đầu CPR theo hướng dẫn 115.';
export const BREATH_WRONG =
  'Hãy nhìn kỹ: Ông Nội chỉ có những nhịp ngáp rời rạc, không đều – đó không phải là thở bình thường.';
