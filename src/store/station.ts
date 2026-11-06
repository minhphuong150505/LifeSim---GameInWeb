import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_SPOT, DEFAULT_VARIANT, getVariant, type SlotId } from '../data/station';
import { canPlace, type Layout, type Spot } from '../features/station/layout';
import { useWalletStore } from './wallet';

type StationState = {
  /** Variant ids the player owns (the collection, "Bộ sưu tập"). */
  owned: string[];
  /** Theme in use (wall and floor colours). */
  theme: string;
  /** Items placed in the room and where. */
  layout: Layout;
  /** Buys a variant into the collection. False if already owned or too few bandages. */
  buy: (id: string) => boolean;
  /** Puts an owned item on a free spot (or moves it there). False if it does not fit. */
  place: (id: string, spot: Spot) => boolean;
  /** Takes an item out of the room, back into the collection. */
  store: (id: string) => void;
  /** Switches to an owned theme. */
  applyTheme: (id: string) => void;
  reset: () => void;
};

const initial = { owned: [DEFAULT_VARIANT], theme: DEFAULT_VARIANT, layout: {} as Layout };

/** v0 saves kept one item per slot: `placed: { cabinet: 'cabinet-go', … }`. */
export function migrateStation(persisted: unknown, version: number) {
  const old = (persisted ?? {}) as {
    owned?: string[];
    placed?: Partial<Record<SlotId, string>>;
    theme?: string;
    layout?: Layout;
  };
  if (version >= 1) return { ...initial, ...old };
  const owned = old.owned?.length ? old.owned : initial.owned;
  const layout: Layout = {};
  for (const [slot, id] of Object.entries(old.placed ?? {})) {
    if (slot === 'theme' || !id) continue;
    const spot = DEFAULT_SPOT[slot as Exclude<SlotId, 'theme'>];
    if (spot && canPlace(layout, id, spot)) layout[id] = spot;
  }
  return { owned, theme: old.placed?.theme ?? DEFAULT_VARIANT, layout };
}

export const useStationStore = create<StationState>()(
  persist(
    (set, get) => ({
      ...initial,
      buy: (id) => {
        const variant = getVariant(id);
        if (!variant || get().owned.includes(id)) return false;
        if (!useWalletStore.getState().spend(variant.price)) return false;
        set((s) => ({ owned: [...s.owned, id] }));
        return true;
      },
      place: (id, spot) => {
        const { owned, layout } = get();
        if (!owned.includes(id) || !canPlace(layout, id, spot)) return false;
        set({ layout: { ...layout, [id]: spot } });
        return true;
      },
      store: (id) =>
        set((s) => {
          const layout = { ...s.layout };
          delete layout[id];
          return { layout };
        }),
      applyTheme: (id) => {
        if (getVariant(id)?.slot === 'theme' && get().owned.includes(id)) set({ theme: id });
      },
      reset: () => set(initial),
    }),
    {
      name: 'lifesim-station',
      version: 1,
      migrate: (persisted, version) => migrateStation(persisted, version) as StationState,
    },
  ),
);
