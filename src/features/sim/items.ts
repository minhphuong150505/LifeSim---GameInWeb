export type ItemId = 'ice-pack' | 'phone';

export type ShopItem = {
  id: ItemId;
  name: string;
  price: number;
  description: string;
  /** Used up when applied (the phone is kept). */
  consumable: boolean;
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'ice-pack',
    name: 'Túi đá chườm lạnh',
    price: 40,
    description: 'Chườm nhẹ bên ngoài mũi – chỉ là hỗ trợ, vẫn phải bóp giữ mũi.',
    consumable: true,
  },
  {
    id: 'phone',
    name: 'Điện thoại cá nhân',
    price: 30,
    description: 'Gọi cấp cứu 115 khi tình huống nguy hiểm.',
    consumable: false,
  },
];

/** Shop shelves that are announced but not on sale yet (shown locked). */
export const UPCOMING_ITEMS = ['Găng tay y tế', 'Bộ sơ cứu', 'Băng cuộn', 'Máy AED'];

export function getItem(id: ItemId): ShopItem {
  return SHOP_ITEMS.find((i) => i.id === id) as ShopItem;
}
