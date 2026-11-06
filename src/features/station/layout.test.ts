import { DEFAULT_SPOT, DEFAULT_VARIANT, ROOM } from '../../data/station';
import { migrateStation, useStationStore } from '../../store/station';
import { useWalletStore } from '../../store/wallet';
import { canPlace, freeSpots, paintOrder, type Layout } from './layout';

describe('station placement grid', () => {
  it('keeps items inside the room and on the rows they allow', () => {
    expect(canPlace({}, 'bed-xanh', { col: 0, row: 0 })).toBe(true);
    expect(canPlace({}, 'bed-xanh', { col: ROOM.COLS - 3, row: 0 })).toBe(false); // 4 wide
    expect(canPlace({}, 'bed-xanh', { col: 0, row: 2 })).toBe(false); // 2 deep
    expect(canPlace({}, 'cabinet-go', { col: 0, row: 1 })).toBe(false); // against the wall only
    expect(canPlace({}, 'lamp-vom', { col: 0, row: 1 })).toBe(false); // hangs from the ceiling
    expect(canPlace({}, 'theme-kem', { col: 0, row: 0 })).toBe(false);
  });

  it('does not let two items share a cell of the same zone', () => {
    const layout: Layout = { 'bed-xanh': { col: 2, row: 0 } };
    expect(canPlace(layout, 'chair-go', { col: 4, row: 1 })).toBe(false);
    expect(canPlace(layout, 'chair-go', { col: 6, row: 1 })).toBe(true);
    // Rugs lie under furniture: a different layer.
    expect(canPlace(layout, 'rug-do', { col: 2, row: 0 })).toBe(true);
    // Moving an item onto its own cells is fine.
    expect(canPlace(layout, 'bed-xanh', { col: 3, row: 0 })).toBe(true);
  });

  it('keeps posters clear of the window and of tall furniture', () => {
    expect(canPlace({}, 'poster-115', { col: 10, row: 0 })).toBe(false);
    expect(canPlace({}, 'poster-115', { col: 0, row: 1 })).toBe(true);
    const withCabinet: Layout = { 'cabinet-go': { col: 0, row: 0 } };
    expect(canPlace(withCabinet, 'poster-115', { col: 0, row: 1 })).toBe(false);
    expect(canPlace({ 'poster-115': { col: 0, row: 1 } }, 'cabinet-go', { col: 0, row: 0 })).toBe(
      false,
    );
  });

  it('lists every free spot and shrinks the list as the room fills up', () => {
    const empty = freeSpots({}, 'plant-la').length;
    expect(empty).toBe(ROOM.COLS * ROOM.FLOOR_ROWS);
    expect(freeSpots({ 'bed-xanh': { col: 0, row: 0 } }, 'plant-la').length).toBe(empty - 8);
  });

  it('paints rugs first and front rows last', () => {
    const order = paintOrder({
      'chair-go': { col: 0, row: 2 },
      'bed-xanh': { col: 4, row: 0 },
      'rug-do': { col: 4, row: 1 },
      'poster-115': { col: 0, row: 0 },
    });
    expect(order).toEqual(['rug-do', 'poster-115', 'bed-xanh', 'chair-go']);
  });
});

describe('station store', () => {
  beforeEach(() => {
    useStationStore.getState().reset();
    useWalletStore.getState().reset();
  });

  it('puts bought items in the collection, then places them on a free spot', () => {
    useWalletStore.getState().earn(500);
    const st = useStationStore.getState();
    expect(st.buy('bed-xanh')).toBe(true);
    expect(st.buy('bed-xanh')).toBe(false);
    expect(useStationStore.getState().layout).toEqual({});
    expect(useStationStore.getState().place('bed-xanh', { col: 0, row: 0 })).toBe(true);
    expect(useStationStore.getState().place('chair-go', { col: 6, row: 2 })).toBe(false); // not owned
    useStationStore.getState().store('bed-xanh');
    expect(useStationStore.getState().layout).toEqual({});
    useStationStore.getState().applyTheme('theme-bac-ha'); // not owned
    expect(useStationStore.getState().theme).toBe(DEFAULT_VARIANT);
  });

  it('converts old one-per-slot saves into a room layout', () => {
    const migrated = migrateStation(
      {
        owned: ['theme-kem', 'theme-bac-ha', 'bed-xanh', 'poster-115'],
        placed: { theme: 'theme-bac-ha', bed: 'bed-xanh', poster: 'poster-115' },
      },
      0,
    );
    expect(migrated.theme).toBe('theme-bac-ha');
    expect(migrated.layout).toEqual({
      'bed-xanh': DEFAULT_SPOT.bed,
      'poster-115': DEFAULT_SPOT.poster,
    });
  });
});
