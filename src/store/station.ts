import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_VARIANT, getVariant, type SlotId } from '../data/station';
import { useWalletStore } from './wallet';

type StationState = {
  /** Variant ids the player owns. */
  owned: string[];
  /** Variant placed in each slot (none = empty slot). */
  placed: Partial<Record<SlotId, string>>;
  /**
   * Buys a variant with bandages and places it. Returns false (nothing changes) if it is
   * already owned or the balance is too low.
   */
  buy: (id: string) => boolean;
  /** Places an owned variant. */
  place: (id: string) => void;
  /** Takes the item out of its slot (not for the theme). */
  remove: (slot: SlotId) => void;
  reset: () => void;
};

const initial = { owned: [DEFAULT_VARIANT], placed: { theme: DEFAULT_VARIANT } };

export const useStationStore = create<StationState>()(
  persist(
    (set, get) => ({
      ...initial,
      buy: (id) => {
        const variant = getVariant(id);
        if (!variant || get().owned.includes(id)) return false;
        if (!useWalletStore.getState().spend(variant.price)) return false;
        set((s) => ({
          owned: [...s.owned, id],
          placed: { ...s.placed, [variant.slot]: id },
        }));
        return true;
      },
      place: (id) => {
        const variant = getVariant(id);
        if (!variant || !get().owned.includes(id)) return;
        set((s) => ({ placed: { ...s.placed, [variant.slot]: id } }));
      },
      remove: (slot) => {
        if (slot === 'theme') return;
        set((s) => {
          const placed = { ...s.placed };
          delete placed[slot];
          return { placed };
        });
      },
      reset: () => set(initial),
    }),
    { name: 'lifesim-station' },
  ),
);
