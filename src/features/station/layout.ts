import {
  BLOCKED_WALL,
  FOOTPRINT,
  ROOM,
  ZONE_ROWS,
  getVariant,
  type ItemSlot,
  type Zone,
} from '../../data/station';

/** Grid cell an item's top-left footprint cell sits on. */
export type Spot = { col: number; row: number };
/** Placed items: variant id → its spot. */
export type Layout = Record<string, Spot>;

type Rect = { x: number; y: number; w: number; h: number };

/**
 * Visual bounds of each drawing around its origin (see `StationRoom`). Used to keep tall
 * furniture from covering a poster on the wall, and the other way round.
 */
export const ITEM_BOX: Record<ItemSlot, Rect> = {
  cabinet: { x: -40, y: -128, w: 80, h: 130 },
  bed: { x: -80, y: -82, w: 160, h: 86 },
  chair: { x: -36, y: -66, w: 72, h: 68 },
  plant: { x: -22, y: -72, w: 44, h: 74 },
  rug: { x: -84, y: -22, w: 168, h: 44 },
  poster: { x: -34, y: -88, w: 68, h: 92 },
  lamp: { x: -26, y: -2, w: 52, h: 80 },
};

/** Where an item's drawing origin goes in the room for a given spot. */
export function anchorOf(slot: ItemSlot, { col, row }: Spot): { x: number; y: number } {
  const f = FOOTPRINT[slot];
  const x = (col + f.w / 2) * ROOM.CELL;
  if (slot === 'lamp') return { x, y: 4 };
  if (f.zone === 'wall') return { x, y: ROOM.WALL_TOP + (row + f.h) * ROOM.WALL_ROW_H - 4 };
  if (f.zone === 'rug') return { x, y: ROOM.WALL_Y + (row + f.h / 2) * ROOM.ROW_H };
  return { x, y: ROOM.WALL_Y + (row + f.h) * ROOM.ROW_H - 4 };
}

/** Bounds of the item's drawing in the room. */
export function rectOf(slot: ItemSlot, spot: Spot): Rect {
  const a = anchorOf(slot, spot);
  const b = ITEM_BOX[slot];
  return { x: a.x + b.x, y: a.y + b.y, w: b.w, h: b.h };
}

/** The footprint cells, as a rectangle in grid units (for drawing the placement boxes). */
export function cellRect(slot: ItemSlot, { col, row }: Spot): Rect {
  const f = FOOTPRINT[slot];
  const x = col * ROOM.CELL;
  const w = f.w * ROOM.CELL;
  if (f.zone === 'wall')
    return { x, y: ROOM.WALL_TOP + row * ROOM.WALL_ROW_H, w, h: f.h * ROOM.WALL_ROW_H };
  return { x, y: ROOM.WALL_Y + row * ROOM.ROW_H, w, h: f.h * ROOM.ROW_H };
}

/** The single grid cell of a spot (its top-left footprint cell): the tap target. */
export function spotCell(slot: ItemSlot, { col, row }: Spot): Rect {
  const f = FOOTPRINT[slot];
  const x = col * ROOM.CELL;
  if (f.zone === 'wall')
    return { x, y: ROOM.WALL_TOP + row * ROOM.WALL_ROW_H, w: ROOM.CELL, h: ROOM.WALL_ROW_H };
  return { x, y: ROOM.WALL_Y + row * ROOM.ROW_H, w: ROOM.CELL, h: ROOM.ROW_H };
}

function cells(slot: ItemSlot, { col, row }: Spot): string[] {
  const f = FOOTPRINT[slot];
  const out: string[] = [];
  for (let c = col; c < col + f.w; c += 1)
    for (let r = row; r < row + f.h; r += 1) out.push(`${f.zone}:${c}:${r}`);
  return out;
}

const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

const slotOf = (id: string): ItemSlot | null => {
  const v = getVariant(id);
  return v && v.slot !== 'theme' ? v.slot : null;
};

/** Can `id` go on `spot`, given what else is in the room (the item itself is ignored)? */
export function canPlace(layout: Layout, id: string, spot: Spot): boolean {
  const slot = slotOf(id);
  if (!slot) return false;
  const f = FOOTPRINT[slot];
  if (spot.col < 0 || spot.row < 0) return false;
  if (spot.col + f.w > ROOM.COLS || spot.row + f.h > ZONE_ROWS[f.zone]) return false;
  if (f.rows && !f.rows.includes(spot.row)) return false;

  const mine = new Set(cells(slot, spot));
  if (f.zone === 'wall' && BLOCKED_WALL.some((b) => mine.has(`wall:${b.col}:${b.row}`)))
    return false;

  const rect = rectOf(slot, spot);
  for (const [otherId, otherSpot] of Object.entries(layout)) {
    if (otherId === id) continue;
    const other = slotOf(otherId);
    if (!other) continue;
    if (cells(other, otherSpot).some((c) => mine.has(c))) return false;
    // Wall decorations must not hide behind (or poke out of) tall furniture.
    const zones = [f.zone, FOOTPRINT[other].zone];
    if (
      zones.includes('wall') &&
      zones.includes('floor') &&
      overlaps(rect, rectOf(other, otherSpot))
    )
      return false;
  }
  return true;
}

/** Every spot where `id` fits right now. */
export function freeSpots(layout: Layout, id: string): Spot[] {
  const slot = slotOf(id);
  if (!slot) return [];
  const zone: Zone = FOOTPRINT[slot].zone;
  const out: Spot[] = [];
  for (let row = 0; row < ZONE_ROWS[zone]; row += 1)
    for (let col = 0; col < ROOM.COLS; col += 1)
      if (canPlace(layout, id, { col, row })) out.push({ col, row });
  return out;
}

/** Back-to-front painting order: rugs, wall, then floor items from the back row forward. */
export function paintOrder(layout: Layout): string[] {
  const rank = (id: string) => {
    const slot = slotOf(id);
    const spot = layout[id];
    if (!slot || !spot) return 0;
    const f = FOOTPRINT[slot];
    if (f.zone === 'rug') return 0 + spot.row * 0.01;
    if (f.zone === 'wall') return 1;
    return 2 + (spot.row + f.h) + spot.col * 0.001;
  };
  return Object.keys(layout).sort((a, b) => rank(a) - rank(b));
}
