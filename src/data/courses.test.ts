import { describe, expect, it } from 'vitest';
import { COURSES, getCourse } from './courses';

describe('courses', () => {
  it('has unique ids', () => {
    const ids = COURSES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes the SSVN "Khoá mới nhất" catalogue with official links', () => {
    const fresh = COURSES.filter((c) => c.isNew);
    expect(fresh).toHaveLength(24);
    for (const c of fresh) {
      expect(c.partner).toContain('SSVN');
      expect(c.url).toMatch(/^https:\/\//);
      expect(c.audience).toBeTruthy();
    }
  });

  it('keeps free and unannounced fees apart for the budget filter', () => {
    expect(getCourse('ssvn-preschool-nutrition')?.priceVnd).toBe(0);
    expect(getCourse('ssvn-natural-disasters')?.priceVnd).toBeNull();
  });
});
