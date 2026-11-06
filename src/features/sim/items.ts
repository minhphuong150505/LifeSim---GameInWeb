export type ItemId = 'ice-pack' | 'phone' | 'life-ring';

export type ShopItem = {
  id: ItemId;
  name: string;
  price: number;
  description: string;
  /** Used up when applied (the phone and the life ring are kept). */
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
  {
    id: 'life-ring',
    name: 'Phao cứu sinh có dây',
    price: 40,
    description: 'Ném tới người gặp nạn từ trên bờ, giữ đầu dây để kéo vào.',
    consumable: false,
  },
];

/**
 * Wrong picks on the shelf during the life-ring task. They are never sold: choosing one
 * only explains why it would not keep someone afloat.
 */
export type DecoyId = 'toy-float' | 'towel' | 'goggles';

export type DecoyItem = {
  id: DecoyId;
  name: string;
  price: number;
  description: string;
  /** Why it does not help, shown when the player picks it. */
  reason: string;
};

export const DECOY_ITEMS: DecoyItem[] = [
  {
    id: 'toy-float',
    name: 'Phao bơi đồ chơi',
    price: 20,
    description: 'Phao bơm hơi nhỏ để vui chơi dưới nước.',
    reason:
      'Phao đồ chơi nhỏ, dễ xẹp và không có dây để kéo – không đủ an toàn để cứu người đang hoảng loạn.',
  },
  {
    id: 'towel',
    name: 'Khăn tắm',
    price: 15,
    description: 'Khăn bông lớn để lau khô người.',
    reason: 'Khăn tắm không nổi được – người gặp nạn không thể bám vào để giữ mình trên mặt nước.',
  },
  {
    id: 'goggles',
    name: 'Kính bơi',
    price: 15,
    description: 'Giúp nhìn rõ khi bơi dưới nước.',
    reason: 'Kính bơi không giúp người gặp nạn nổi lên được.',
  },
];

/** Shop shelves that are announced but not on sale yet (shown locked). */
export const UPCOMING_ITEMS = ['Găng tay y tế', 'Bộ sơ cứu', 'Băng cuộn', 'Máy AED'];

export function getItem(id: ItemId): ShopItem {
  return SHOP_ITEMS.find((i) => i.id === id) as ShopItem;
}
