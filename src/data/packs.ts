/**
 * Bandage packs sold for real money (prices from the LifeSim revenue plan). Buying a pack
 * does not make the account Premium: ads stay and the player keeps one Rescue Station.
 */
export type BandagePack = {
  id: string;
  name: string;
  amount: number;
  /** Price in VND. */
  price: number;
  role: string;
  /** Highlight ribbon. */
  tag?: string;
};

export const PACKS: BandagePack[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    amount: 300,
    price: 9000,
    role: 'Mua vài món trang trí nhỏ',
  },
  {
    id: 'builder',
    name: 'Builder Pack',
    amount: 800,
    price: 19000,
    role: 'Trang trí một khu vực trong trạm',
    tag: 'Phổ biến',
  },
  {
    id: 'rescuer',
    name: 'Rescuer Pack',
    amount: 1800,
    price: 39000,
    role: 'Mua nhiều nội thất, theme hơn',
  },
  {
    id: 'master',
    name: 'Station Master',
    amount: 4000,
    price: 79000,
    role: 'Cho người thích trang trí nhiều',
    tag: 'Lợi nhất',
  },
];

export const formatVnd = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

/** Smallest pack that covers a shortfall (or the biggest one). */
export function packFor(missing: number): BandagePack {
  return PACKS.find((p) => p.amount >= missing) ?? (PACKS[PACKS.length - 1] as BandagePack);
}
