import { shuffle } from '@/lib/shuffle';

describe('shuffle', () => {
  it('conserva todos los elementos y no muta el original', () => {
    const original = [1, 2, 3, 4, 5];
    const result = shuffle(original);
    expect([...result].sort()).toEqual(original);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });

  it('es determinista con un generador fijo', () => {
    expect(shuffle(['a', 'b', 'c'], () => 0)).toEqual(['b', 'c', 'a']);
  });
});
