import { SOFA_SEAT_Y } from '../../art/LivingRoom';
import type { CastMember } from './types';

export const CAST_NAMES: Record<CastMember, string> = {
  brother: 'Em trai',
  player: 'Bạn',
  mom: 'Mẹ',
  dad: 'Bố',
  grandma: 'Bà',
  friend: 'Bạn đi cùng',
  lifeguard: 'Nhân viên cứu hộ',
  victim: 'Người đuối nước',
  friendA: 'Bạn A',
  friendB: 'Bạn B',
};

/** Where each living-room character stands/sits, and the top of their head, in room units. */
export const SPOTS: Record<
  'brother' | 'grandma' | 'player' | 'mom' | 'dad',
  { x: number; y: number; headTop: number }
> = {
  brother: { x: 200, y: SOFA_SEAT_Y, headTop: 92 },
  grandma: { x: 148, y: SOFA_SEAT_Y, headTop: 80 },
  player: { x: 70, y: 290, headTop: 166 },
  mom: { x: 312, y: 292, headTop: 160 },
  dad: { x: 368, y: 286, headTop: 146 },
};
export const COMFORT_MOM = { x: 252, y: SOFA_SEAT_Y, headTop: 86 };

/** Brother's nose in room units – the drop target for items (radius in room units). */
export const NOSE_POINT = { x: 200, y: 130, r: 16 };
