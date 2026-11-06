/**
 * Rescue Station (Trạm cứu hộ) – the player's own room, decorated with bandages earned in
 * the game. Every product comes in a few variants (colour / style); bought variants go to the
 * collection ("Bộ sưu tập") and the player places them anywhere in the room where they fit.
 */
export type SlotId = 'theme' | 'cabinet' | 'bed' | 'chair' | 'poster' | 'plant' | 'rug' | 'lamp';

export type Variant = {
  id: string;
  slot: SlotId;
  name: string;
  price: number;
  /** Main and accent colours. */
  main: string;
  accent: string;
  /** Shape variant of the drawing (0, 1, 2). */
  style: 0 | 1 | 2;
};

export type Product = { slot: SlotId; name: string; hint: string; variants: Variant[] };

const v = (
  slot: SlotId,
  id: string,
  name: string,
  price: number,
  main: string,
  accent: string,
  style: 0 | 1 | 2,
): Variant => ({ id: `${slot}-${id}`, slot, name, price, main, accent, style });

export const PRODUCTS: Product[] = [
  {
    slot: 'cabinet',
    name: 'Tủ thuốc',
    hint: 'Nơi cất bông, băng, thuốc sát trùng.',
    variants: [
      v('cabinet', 'go', 'Tủ gỗ', 120, '#d9a866', '#f1d3a1', 0),
      v('cabinet', 'trang', 'Tủ trắng', 150, '#fffdf6', '#cfe9ef', 1),
      v('cabinet', 'kinh', 'Tủ kính đỏ', 220, '#ec6a4c', '#bfe6f5', 2),
    ],
  },
  {
    slot: 'bed',
    name: 'Giường sơ cứu',
    hint: 'Chỗ cho người bị nạn nằm nghỉ.',
    variants: [
      v('bed', 'xanh', 'Giường xanh', 180, '#7cb8e4', '#cfe9ef', 0),
      v('bed', 'hong', 'Giường hồng', 180, '#f6a59a', '#fde3da', 1),
      v('bed', 'vang', 'Giường vàng', 260, '#ffd23f', '#fff1c2', 2),
    ],
  },
  {
    slot: 'chair',
    name: 'Ghế chờ',
    hint: 'Ghế cho người nhà ngồi đợi.',
    variants: [
      v('chair', 'go', 'Ghế gỗ', 80, '#a8743f', '#d9a866', 0),
      v('chair', 'banh', 'Ghế bành', 130, '#8fb3a8', '#6f978b', 1),
      v('chair', 'luoi', 'Ghế lười', 160, '#ec6a4c', '#f6a59a', 2),
    ],
  },
  {
    slot: 'poster',
    name: 'Poster',
    hint: 'Nhắc mọi người kiến thức sơ cứu.',
    variants: [
      v('poster', 'chu-thap', 'Chữ thập đỏ', 50, '#ec6a4c', '#fffdf6', 0),
      v('poster', '115', 'Gọi 115', 60, '#7cb8e4', '#fffdf6', 1),
      v('poster', 'tim', 'Trái tim CPR', 80, '#86c06c', '#fffdf6', 2),
    ],
  },
  {
    slot: 'plant',
    name: 'Chậu cây',
    hint: 'Cho trạm thêm xanh mát.',
    variants: [
      v('plant', 'xuong-rong', 'Xương rồng', 40, '#86c06c', '#ec6a4c', 0),
      v('plant', 'la', 'Cây lá to', 60, '#7fb862', '#d9a866', 1),
      v('plant', 'hoa', 'Hoa hướng dương', 90, '#ffd23f', '#7cb8e4', 2),
    ],
  },
  {
    slot: 'rug',
    name: 'Thảm',
    hint: 'Trải sàn cho ấm cúng.',
    variants: [
      v('rug', 'do', 'Thảm tròn đỏ', 60, '#ec6a4c', '#ffd23f', 0),
      v('rug', 'soc', 'Thảm sọc xanh', 80, '#7cb8e4', '#fffdf6', 1),
      v('rug', 'caro', 'Thảm caro', 100, '#86c06c', '#fffdf6', 2),
    ],
  },
  {
    slot: 'lamp',
    name: 'Đèn trần',
    hint: 'Chiếu sáng cho trạm.',
    variants: [
      v('lamp', 'vom', 'Đèn vòm', 50, '#ffd23f', '#fff1c2', 0),
      v('lamp', 'non', 'Đèn nón', 70, '#86c06c', '#fff1c2', 1),
      v('lamp', 'cau', 'Đèn cầu', 110, '#fffdf6', '#ffd23f', 2),
    ],
  },
  {
    slot: 'theme',
    name: 'Theme trạm',
    hint: 'Đổi màu tường và sàn của cả trạm.',
    variants: [
      v('theme', 'kem', 'Kem ấm', 0, '#f3eed3', '#e3b98d', 0),
      v('theme', 'bac-ha', 'Bạc hà', 200, '#dff1e6', '#b9d8c2', 1),
      v('theme', 'dem-sao', 'Đêm sao', 300, '#cfd8ef', '#a9b4d6', 2),
    ],
  },
];

/** Variant every station starts with (free and placed). */
export const DEFAULT_VARIANT = 'theme-kem';

export const ALL_VARIANTS: Variant[] = PRODUCTS.flatMap((p) => p.variants);

export function getVariant(id: string | undefined): Variant | undefined {
  return ALL_VARIANTS.find((x) => x.id === id);
}

export function getProduct(slot: SlotId): Product {
  return PRODUCTS.find((p) => p.slot === slot) as Product;
}

/* ───────────────────────── room grid ───────────────────────── */

/** Room drawing size and the placement grid (world units). */
export const ROOM = {
  W: 480,
  H: 300,
  COLS: 12,
  CELL: 40,
  /** Where the wall meets the floor. */
  WALL_Y: 172,
  FLOOR_ROWS: 3,
  ROW_H: 42,
  WALL_TOP: 38,
  WALL_ROWS: 3,
  WALL_ROW_H: 42,
} as const;

export type Zone = 'floor' | 'rug' | 'wall';
export type ItemSlot = Exclude<SlotId, 'theme'>;

/**
 * Size of each kind of item on the grid: `w` columns × `h` rows of its zone. Floor items
 * stand on the floor (rows = depth, 0 = against the wall), rugs lie under them, posters
 * and lamps go on the wall. `rows` limits where the item may go.
 */
export const FOOTPRINT: Record<ItemSlot, { zone: Zone; w: number; h: number; rows?: number[] }> = {
  cabinet: { zone: 'floor', w: 2, h: 1, rows: [0] },
  bed: { zone: 'floor', w: 4, h: 2 },
  chair: { zone: 'floor', w: 2, h: 1 },
  plant: { zone: 'floor', w: 1, h: 1 },
  rug: { zone: 'rug', w: 4, h: 2 },
  poster: { zone: 'wall', w: 2, h: 2 },
  lamp: { zone: 'wall', w: 2, h: 1, rows: [0] },
};

export const ZONE_ROWS: Record<Zone, number> = {
  floor: ROOM.FLOOR_ROWS,
  rug: ROOM.FLOOR_ROWS,
  wall: ROOM.WALL_ROWS,
};

/** Wall cells taken by the window (fixed decoration). */
export const BLOCKED_WALL: { col: number; row: number }[] = [
  { col: 10, row: 0 },
  { col: 11, row: 0 },
  { col: 10, row: 1 },
  { col: 11, row: 1 },
];

/** Where items first go when an old save (one item per slot) is converted. */
export const DEFAULT_SPOT: Record<ItemSlot, { col: number; row: number }> = {
  cabinet: { col: 0, row: 0 },
  poster: { col: 3, row: 1 },
  lamp: { col: 6, row: 0 },
  plant: { col: 2, row: 0 },
  rug: { col: 4, row: 1 },
  bed: { col: 8, row: 0 },
  chair: { col: 4, row: 2 },
};
