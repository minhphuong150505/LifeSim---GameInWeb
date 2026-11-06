import { C } from './ink';

export type PersonKind =
  | 'brother'
  | 'player'
  | 'mom'
  | 'dad'
  | 'grandma'
  | 'mascot'
  | 'friend'
  | 'lifeguard'
  | 'victim'
  | 'friendA'
  | 'friendB';
export type HairStyle =
  | 'boy'
  | 'ponytail'
  | 'long'
  | 'short'
  | 'bun'
  | 'cap'
  | 'bob'
  | 'pigtails'
  | 'spiky'
  | 'curly'
  | 'buzz';

export type Look = {
  hairStyle: HairStyle;
  hair: string;
  skin: string;
  shirt: string;
  pants: string;
  /** Bare legs below the knee (shorts / skirt). */
  shorts?: boolean;
  glasses?: boolean;
  /** First-aid backpack straps (mascot). */
  backpack?: boolean;
};

export const LOOKS: Record<PersonKind, Look & { scale: number }> = {
  brother: {
    hairStyle: 'boy',
    hair: '#4a3426',
    skin: C.skin,
    shirt: C.blue,
    pants: '#5d6f8a',
    shorts: true,
    scale: 0.8,
  },
  player: {
    hairStyle: 'ponytail',
    hair: '#6b4a2b',
    skin: C.skin,
    shirt: C.red,
    pants: '#efe0c2',
    shorts: true,
    scale: 1,
  },
  mom: {
    hairStyle: 'long',
    hair: '#3e2a22',
    skin: C.skin,
    shirt: '#f2b8c6',
    pants: '#7c8db0',
    scale: 1.08,
  },
  dad: {
    hairStyle: 'short',
    hair: '#2f2520',
    skin: '#f6d2b0',
    shirt: '#9fcf8f',
    pants: '#6b6157',
    glasses: true,
    scale: 1.14,
  },
  grandma: {
    hairStyle: 'bun',
    hair: '#dcd6cc',
    skin: '#f8dcc4',
    shirt: '#c7a6d9',
    pants: '#7a6a8c',
    glasses: true,
    scale: 0.98,
  },
  mascot: {
    hairStyle: 'cap',
    hair: '#5a3b28',
    skin: C.skin,
    shirt: C.white,
    pants: '#5d6f8a',
    backpack: true,
    scale: 1,
  },
  /* Tình huống 2 – Đuối nước */
  friend: {
    hairStyle: 'bob',
    hair: '#3e2a22',
    skin: '#ffe6cf',
    shirt: '#9fd5c9',
    pants: '#4d8fc2',
    shorts: true,
    scale: 0.98,
  },
  lifeguard: {
    hairStyle: 'buzz',
    hair: '#2f2520',
    skin: '#f0c49c',
    shirt: C.yellow,
    pants: C.red,
    shorts: true,
    scale: 1.12,
  },
  victim: {
    hairStyle: 'short',
    hair: '#4a3426',
    skin: '#f8d6b8',
    shirt: '#5aa0d6',
    pants: '#3f5f86',
    shorts: true,
    scale: 1.04,
  },
  friendA: {
    hairStyle: 'spiky',
    hair: '#3a2a20',
    skin: '#f6d2b0',
    shirt: '#f29e4c',
    pants: '#3f5f86',
    shorts: true,
    scale: 0.96,
  },
  friendB: {
    hairStyle: 'pigtails',
    hair: '#5a3b28',
    skin: C.skin,
    shirt: '#c7a6d9',
    pants: '#6f978b',
    shorts: true,
    scale: 0.94,
  },
};
