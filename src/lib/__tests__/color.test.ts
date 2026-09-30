import { contrastRatio, darken, withAlpha } from '@/lib/color';

describe('color', () => {
  test('contraste blanco sobre negro es 21:1', () => {
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 1);
  });

  test('el contraste es simétrico', () => {
    expect(contrastRatio('#24576A', '#FFFFFF')).toBeCloseTo(contrastRatio('#FFFFFF', '#24576A'), 5);
  });

  test('darken oscurece cada canal en la proporción indicada', () => {
    expect(darken('#FFFFFF', 0.5)).toBe('#808080');
    expect(darken('#24576A', 0)).toBe('#24576A');
  });

  test('darken acepta hex de 3 dígitos', () => {
    expect(darken('#FFF', 0.5)).toBe('#808080');
  });

  test('withAlpha devuelve rgba con la opacidad pedida', () => {
    expect(withAlpha('#24576A', 0.5)).toBe('rgba(36, 87, 106, 0.5)');
  });

  test('lanza un error claro ante un color inválido', () => {
    expect(() => darken('azul', 0.1)).toThrow('Color hex inválido');
  });
});
