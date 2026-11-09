import { ALL_VARIANTS } from '../../data/station';

/** "Cùng dạo phố nào": rewarded ads from the lobby bag, at most this many per day. */
export const STREET_ADS_PER_DAY = 10;
/** Bandage amounts a street ad can give. */
export const STREET_BANDAGES = [10, 15, 20, 30] as const;
/** Chance that an ad gives a station item instead of bandages (when one is left to win). */
export const ITEM_CHANCE = 0.35;

export type StreetReward = { kind: 'bandages'; amount: number } | { kind: 'item'; id: string };

/**
 * Picks the reward for one watched ad: usually bandages, sometimes a station item the player
 * doesn't own yet (cheap items only, so ads never replace saving up for the big ones).
 */
export function rollStreetReward(owned: string[], rand: () => number = Math.random): StreetReward {
  const pool = ALL_VARIANTS.filter(
    (v) => v.slot !== 'theme' && v.price <= 80 && !owned.includes(v.id),
  );
  if (pool.length > 0 && rand() < ITEM_CHANCE) {
    const pick = pool[Math.min(pool.length - 1, Math.floor(rand() * pool.length))];
    if (pick) return { kind: 'item', id: pick.id };
  }
  const amount =
    STREET_BANDAGES[
      Math.min(STREET_BANDAGES.length - 1, Math.floor(rand() * STREET_BANDAGES.length))
    ];
  return { kind: 'bandages', amount: amount ?? STREET_BANDAGES[0] };
}

/** Ads left today given the stored day/count. */
export function streetAdsLeft(day: string, count: number, today: string): number {
  return day === today ? Math.max(0, STREET_ADS_PER_DAY - count) : STREET_ADS_PER_DAY;
}
