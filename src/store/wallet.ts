import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STARTING_BANDAGES } from '../features/sim/engine';
import { getItem, type ItemId } from '../features/sim/items';
import { toDateKey } from '../lib/date';

/** Bandages for one rewarded ad in the bandage bank, and how many ads count per day. */
export const AD_BONUS = 30;
export const ADS_PER_DAY = 5;

type WalletState = {
  /** Băng gạc – earned by clearing rounds and streak gifts, spent in the shop and on retries. */
  bandages: number;
  items: Partial<Record<ItemId, number>>;
  /** Rewarded ads watched in the bandage bank today (resets every day). */
  adDay: string;
  adsToday: number;
  /** Ads left today in the bandage bank. */
  adsLeft: () => number;
  /** Grants AD_BONUS if today's limit is not reached; returns the bandages granted. */
  watchAd: () => number;
  earn: (amount: number) => void;
  /** Returns false (and changes nothing) when the balance is too low. */
  spend: (amount: number) => boolean;
  buy: (id: ItemId) => boolean;
  /** Uses one item; consumables are removed from the bag. */
  use: (id: ItemId) => boolean;
  reset: () => void;
};

const initial = { bandages: STARTING_BANDAGES, items: {}, adDay: '', adsToday: 0 };

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      ...initial,
      adsLeft: () => {
        const { adDay, adsToday } = get();
        return adDay === toDateKey() ? Math.max(0, ADS_PER_DAY - adsToday) : ADS_PER_DAY;
      },
      watchAd: () => {
        if (get().adsLeft() <= 0) return 0;
        const today = toDateKey();
        set((s) => ({
          bandages: s.bandages + AD_BONUS,
          adDay: today,
          adsToday: s.adDay === today ? s.adsToday + 1 : 1,
        }));
        return AD_BONUS;
      },
      earn: (amount) => set((s) => ({ bandages: s.bandages + Math.max(0, amount) })),
      spend: (amount) => {
        if (get().bandages < amount) return false;
        set((s) => ({ bandages: s.bandages - amount }));
        return true;
      },
      buy: (id) => {
        const item = getItem(id);
        const owned = get().items[id] ?? 0;
        if (!item.consumable && owned > 0) return false;
        if (!get().spend(item.price)) return false;
        set((s) => ({ items: { ...s.items, [id]: (s.items[id] ?? 0) + 1 } }));
        return true;
      },
      use: (id) => {
        const owned = get().items[id] ?? 0;
        if (owned <= 0) return false;
        if (getItem(id).consumable) set((s) => ({ items: { ...s.items, [id]: owned - 1 } }));
        return true;
      },
      reset: () => set(initial),
    }),
    { name: 'lifesim-wallet' },
  ),
);
