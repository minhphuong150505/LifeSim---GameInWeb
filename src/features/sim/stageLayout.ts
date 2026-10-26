import { ROOM_H, ROOM_W, SOFA_SEAT_Y } from '../../art/LivingRoom';
import type { CastMember } from './types';

export const CAST_NAMES: Record<CastMember, string> = {
  brother: 'Em trai',
  player: 'Bạn',
  mom: 'Mẹ',
  dad: 'Bố',
  grandma: 'Bà',
};

/** Where each character stands/sits, and the top of their head (for speech bubbles), in room units. */
export const SPOTS: Record<CastMember, { x: number; y: number; headTop: number }> = {
  brother: { x: 200, y: SOFA_SEAT_Y, headTop: 92 },
  grandma: { x: 148, y: SOFA_SEAT_Y, headTop: 80 },
  player: { x: 70, y: 290, headTop: 166 },
  mom: { x: 312, y: 292, headTop: 160 },
  dad: { x: 368, y: 286, headTop: 146 },
};
export const COMFORT_MOM = { x: 252, y: SOFA_SEAT_Y, headTop: 86 };

/** Brother's nose in % of the stage – the drop target for items. */
export const NOSE_TARGET = { x: (200 / ROOM_W) * 100, y: (130 / ROOM_H) * 100, r: 11 };
