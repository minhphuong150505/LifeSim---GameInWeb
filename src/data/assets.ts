import { AVATAR_COUNT } from '../art/AvatarArt';

/**
 * Asset paths. All illustrations are now hand-drawn SVG components in `src/art`
 * (one 2D style for the whole game); only sounds are files in /public/assets.
 */
export const assets = {
  audio: {
    click: '/assets/audio/click.mp3',
    select: '/assets/audio/select.mp3',
    correct: '/assets/audio/correct.mp3',
    wrong: '/assets/audio/wrong.mp3',
    found: '/assets/audio/found.mp3',
    tick: '/assets/audio/tick.mp3',
    win: '/assets/audio/win.mp3',
  },
} as const;

export type AvatarId = `avatar-${number}`;
export const AVATAR_IDS = Array.from(
  { length: AVATAR_COUNT },
  (_, i) => `avatar-${i + 1}` as AvatarId,
);
