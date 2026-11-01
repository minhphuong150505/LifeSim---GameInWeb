import { create } from 'zustand';

/**
 * Per-visit state (not persisted): the login screen shows every time the game link is
 * opened, and the news pop-up appears once after each login.
 */
type SessionState = {
  loggedIn: boolean;
  newsSeen: boolean;
  login: () => void;
  logout: () => void;
  markNewsSeen: () => void;
};

export const useSessionStore = create<SessionState>()((set) => ({
  loggedIn: false,
  newsSeen: false,
  login: () => set({ loggedIn: true, newsSeen: false }),
  logout: () => set({ loggedIn: false }),
  markNewsSeen: () => set({ newsSeen: true }),
}));
