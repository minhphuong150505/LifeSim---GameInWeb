/**
 * Single source of truth for asset paths.
 * To swap an image or sound, change the path here (or replace the file in /public/assets).
 */
export const assets = {
  proposal: {
    logo: '/assets/proposal/logo.webp',
    characterHero: '/assets/proposal/character-hero.webp',
    characterConfused: '/assets/proposal/character-confused.webp',
    characterPeace: '/assets/proposal/character-peace.webp',
    characterThinking: '/assets/proposal/character-thinking.webp',
    firstAidKit: '/assets/proposal/first-aid-kit.webp',
    woodenSigns: '/assets/proposal/wooden-signs.webp',
    bandage: '/assets/proposal/bandage.webp',
    trophy: '/assets/proposal/trophy.webp',
    cityBg: '/assets/proposal/city-bg.webp',
    sceneVictim: '/assets/proposal/scene-victim.webp',
    teamBanner: '/assets/proposal/team-banner.webp',
  },
  avatars: {
    'avatar-1': '/assets/proposal/avatar-1.webp',
    'avatar-2': '/assets/proposal/avatar-2.webp',
    'avatar-3': '/assets/proposal/avatar-3.webp',
    'avatar-4': '/assets/proposal/avatar-4.webp',
  },
  /** Scenario backgrounds; scenario JSON refers to these keys in its `background` field. */
  scenes: {
    classroom: '/assets/scenes/classroom-placeholder.svg',
    canteen: '/assets/scenes/canteen-placeholder.svg',
    lab: '/assets/scenes/lab-placeholder.svg',
  },
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

export type AvatarId = keyof typeof assets.avatars;
export const AVATAR_IDS = Object.keys(assets.avatars) as AvatarId[];

export function avatarSrc(id: string): string {
  return assets.avatars[id as AvatarId] ?? assets.avatars['avatar-1'];
}

/** Resolves a scenario `background` value: a key of `assets.scenes` or a raw URL/path. */
export function resolveScene(keyOrPath: string): string {
  return (assets.scenes as Record<string, string>)[keyOrPath] ?? keyOrPath;
}
