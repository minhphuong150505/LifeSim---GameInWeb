import type { TopicStats } from '../../store/progress';
import type { Topic } from '../../data/topics';

export type HubLocation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  /** Weekdays with a class: 0 = Sunday … 6 = Saturday. */
  days: number[];
  time: string;
  priceVnd: number;
  topics: Topic[];
  level: string;
};

export type LatLng = { lat: number; lng: number };
export type HubFilters = {
  maxKm: number | null;
  day: number | null;
  budgetVnd: number | null;
  /** Nhu cầu: the skill the player wants to practise. */
  topic: Topic | null;
};
export type RankedLocation = HubLocation & { distanceKm: number; recommended: boolean };

/** Fallback map center when geolocation is denied: Thủ Đức. */
export const DEFAULT_CENTER: LatLng = { lat: 10.8494, lng: 106.7537 };

export function haversineKm(a: LatLng, b: LatLng): number {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Topic with the lowest accuracy among topics the player has actually answered. */
export function weakestTopic(stats: TopicStats): Topic | null {
  let worst: { topic: Topic; accuracy: number } | null = null;
  for (const [topic, stat] of Object.entries(stats) as [
    Topic,
    { correct: number; total: number },
  ][]) {
    if (!stat || stat.total === 0) continue;
    const accuracy = stat.correct / stat.total;
    if (!worst || accuracy < worst.accuracy) worst = { topic, accuracy };
  }
  return worst?.topic ?? null;
}

/** Filters, then sorts: courses matching the weakest topic first, then nearest first. */
export function rankLocations(
  locations: readonly HubLocation[],
  center: LatLng,
  filters: HubFilters,
  focusTopic: Topic | null,
): RankedLocation[] {
  return locations
    .map((loc) => ({
      ...loc,
      distanceKm: haversineKm(center, loc),
      recommended: focusTopic !== null && loc.topics.includes(focusTopic),
    }))
    .filter(
      (loc) =>
        (filters.maxKm === null || loc.distanceKm <= filters.maxKm) &&
        (filters.day === null || loc.days.includes(filters.day)) &&
        (filters.budgetVnd === null || loc.priceVnd <= filters.budgetVnd) &&
        (filters.topic === null || loc.topics.includes(filters.topic)),
    )
    .sort((a, b) => Number(b.recommended) - Number(a.recommended) || a.distanceKm - b.distanceKm);
}

export function formatVnd(amount: number): string {
  return amount === 0 ? 'Miễn phí' : `${amount.toLocaleString('vi-VN')}đ`;
}
