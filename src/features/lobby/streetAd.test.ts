import { describe, expect, it } from 'vitest';
import { ALL_VARIANTS } from '../../data/station';
import { rollStreetReward, STREET_ADS_PER_DAY, STREET_BANDAGES, streetAdsLeft } from './streetAd';

describe('rollStreetReward', () => {
  it('gives bandages when the roll misses the item chance', () => {
    const r = rollStreetReward([], () => 0.99);
    expect(r).toEqual({ kind: 'bandages', amount: STREET_BANDAGES[STREET_BANDAGES.length - 1] });
  });

  it('gives a cheap, unowned, non-theme station item on a low roll', () => {
    const r = rollStreetReward(['plant-xuong-rong'], () => 0);
    expect(r.kind).toBe('item');
    if (r.kind !== 'item') return;
    const v = ALL_VARIANTS.find((x) => x.id === r.id);
    expect(v?.slot).not.toBe('theme');
    expect(v?.price).toBeLessThanOrEqual(80);
    expect(r.id).not.toBe('plant-xuong-rong');
  });

  it('falls back to bandages once every cheap item is owned', () => {
    const owned = ALL_VARIANTS.map((v) => v.id);
    expect(rollStreetReward(owned, () => 0).kind).toBe('bandages');
  });
});

describe('streetAdsLeft', () => {
  it('resets on a new day and never goes below zero', () => {
    expect(streetAdsLeft('2026-11-06', 10, '2026-11-07')).toBe(STREET_ADS_PER_DAY);
    expect(streetAdsLeft('2026-11-07', 3, '2026-11-07')).toBe(STREET_ADS_PER_DAY - 3);
    expect(streetAdsLeft('2026-11-07', 12, '2026-11-07')).toBe(0);
  });
});
