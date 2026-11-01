import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvatarId } from '../data/assets';

type UserState = {
  nickname: string;
  avatar: AvatarId;
  /** A profile (name + avatar) has been created on this device. */
  onboarded: boolean;
  /** The "how to play" guide has been seen once. */
  tutorialDone: boolean;
  setProfile: (nickname: string, avatar: AvatarId) => void;
  finishTutorial: () => void;
  reset: () => void;
};

const initial = {
  nickname: '',
  avatar: 'avatar-1' as AvatarId,
  onboarded: false,
  tutorialDone: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initial,
      setProfile: (nickname, avatar) => set({ nickname: nickname.trim(), avatar, onboarded: true }),
      finishTutorial: () => set({ tutorialDone: true }),
      reset: () => set(initial),
    }),
    { name: 'lifesim-user' },
  ),
);
