import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvatarId } from '../data/assets';

type UserState = {
  nickname: string;
  avatar: AvatarId;
  onboarded: boolean;
  setProfile: (nickname: string, avatar: AvatarId) => void;
  reset: () => void;
};

const initial = { nickname: '', avatar: 'avatar-1' as AvatarId, onboarded: false };

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initial,
      setProfile: (nickname, avatar) => set({ nickname: nickname.trim(), avatar, onboarded: true }),
      reset: () => set(initial),
    }),
    { name: 'lifesim-user' },
  ),
);
