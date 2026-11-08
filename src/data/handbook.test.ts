import { describe, expect, it } from 'vitest';
import { isFreeOrientationPath } from '../lib/landscape';
import { HANDBOOK, getArticle, normalizeVi, searchHandbook } from './handbook';

describe('handbook content', () => {
  it('has the 7 articles of the document with unique ids and a video each', () => {
    expect(HANDBOOK.map((a) => a.number)).toEqual(['01', '02', '03', '04', '05', '06', '07']);
    expect(new Set(HANDBOOK.map((a) => a.id)).size).toBe(HANDBOOK.length);
    for (const a of HANDBOOK) {
      expect(a.actions.some((x) => x.kind === 'step')).toBe(true);
      expect(a.video.youtubeId).toMatch(/^[\w-]{11}$/);
    }
  });

  it('finds articles accent-insensitively', () => {
    expect(normalizeVi('Bỏng Đuối')).toBe('bong duoi');
    expect(searchHandbook('bong').map((a) => a.id)).toContain('bong');
    expect(searchHandbook('ep nguc').map((a) => a.id)).toEqual(['cpr-aed']);
    expect(searchHandbook('')).toHaveLength(HANDBOOK.length);
    expect(searchHandbook('zzzz')).toHaveLength(0);
    expect(getArticle('hoc-di-vat')?.title).toBe('Hóc dị vật');
  });

  it('only frees the orientation on handbook routes', () => {
    expect(isFreeOrientationPath('/handbook')).toBe(true);
    expect(isFreeOrientationPath('/handbook/co-giat')).toBe(true);
    expect(isFreeOrientationPath('/handbooks')).toBe(false);
    expect(isFreeOrientationPath('/')).toBe(false);
    expect(isFreeOrientationPath('/play/x')).toBe(false);
  });
});
