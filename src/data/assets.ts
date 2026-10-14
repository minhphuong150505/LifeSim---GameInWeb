/**
 * Single source of truth for asset paths.
 * To swap an image or sound, change the path here (or replace the file in /public/assets).
 */
export const assets = {
  proposal: {
    logo: '/assets/proposal/logo.webp',
    firstAidKit: '/assets/proposal/first-aid-kit.webp',
    woodenSigns: '/assets/proposal/wooden-signs.webp',
    bandage: '/assets/proposal/bandage.webp',
    trophy: '/assets/proposal/trophy.webp',
    cityBg: '/assets/proposal/city-bg.webp',
    sceneVictim: '/assets/proposal/scene-victim.webp',
    teamBanner: '/assets/proposal/team-banner.webp',
  },
  /** Mascot renders (3D model rendered to images) used where a live 3D view is overkill. */
  mascot: {
    hero: '/assets/3d/mascot-hero.webp',
    happy: '/assets/3d/mascot-happy.webp',
    worried: '/assets/3d/mascot-worried.webp',
    thinking: '/assets/3d/mascot-thinking.webp',
  },
  /** Live 3D mascot (Kenney Mini Characters, CC0) and its recoloured palette texture. */
  models: {
    mascot: '/assets/models/mascot.glb',
    mascotColormap: '/assets/models/mascot-colormap.png',
  },
  avatars: Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [`avatar-${i + 1}`, `/assets/3d/avatar-${i + 1}.webp`]),
  ) as Record<`avatar-${number}`, string>,
  /** Scenario backgrounds; scenario JSON refers to these keys in its `background` field. */
  scenes: {
    classroom: '/assets/3d/scene-classroom.webp',
    canteen: '/assets/3d/scene-canteen.webp',
    lab: '/assets/3d/scene-lab.webp',
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

export type AvatarId = `avatar-${number}`;
export const AVATAR_IDS = Object.keys(assets.avatars) as AvatarId[];

export function avatarSrc(id: string): string {
  return assets.avatars[id as AvatarId] ?? (assets.avatars['avatar-1'] as string);
}

/** Resolves a scenario `background` value: a key of `assets.scenes` or a raw URL/path. */
export function resolveScene(keyOrPath: string): string {
  return (assets.scenes as Record<string, string>)[keyOrPath] ?? keyOrPath;
}
