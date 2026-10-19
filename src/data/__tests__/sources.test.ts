import { SOURCES } from '@/data/sources';

describe('fuentes APA', () => {
  test('hay entre 5 y 8 fuentes con ids únicos', () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(5);
    expect(SOURCES.length).toBeLessThanOrEqual(8);
    expect(new Set(SOURCES.map((source) => source.id)).size).toBe(SOURCES.length);
  });

  test('cada referencia tiene autor, año entre paréntesis y para qué se usa', () => {
    SOURCES.forEach((source) => {
      expect(source.apa).toMatch(/^[A-Z][^,]+, [A-Z]\./);
      expect(source.apa).toMatch(/\((19|20)\d{2}\)/);
      expect(source.usedFor.length).toBeGreaterThan(5);
    });
  });
});
