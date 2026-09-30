import {
  REGI,
  REGI_POSES,
  clampGlow,
  regiAccessibilityLabel,
  regiPalette,
  tensionPath,
} from '@/lib/regi';
import { relativeLuminance } from '@/lib/color';

function channelSpread(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return Math.max(r, g, b) - Math.min(r, g, b);
}

describe('regi', () => {
  test('expone las 4 poses de la guía', () => {
    expect(REGI_POSES).toEqual(['calm', 'empathetic', 'growth', 'resilient']);
  });

  test('clampGlow limita el valor entre -1 y 1 y trata NaN como 0', () => {
    expect(clampGlow(3)).toBe(1);
    expect(clampGlow(-7)).toBe(-1);
    expect(clampGlow(0.4)).toBe(0.4);
    expect(clampGlow(Number.NaN)).toBe(0);
  });

  test('la etiqueta accesible describe pose y estado en español', () => {
    expect(regiAccessibilityLabel('calm', 0)).toBe('Regi, el ajolote guía, tranquilo');
    expect(regiAccessibilityLabel('growth', 0)).toBe('Regi, el ajolote guía, celebrando tu avance');
    expect(regiAccessibilityLabel('calm', -0.8)).toBe('Regi, el ajolote guía, tenso');
    expect(regiAccessibilityLabel('resilient', 0.9)).toBe('Regi, el ajolote guía, brillando');
  });

  test('con glow 0 o positivo la paleta es la original', () => {
    expect(regiPalette(0)).toEqual(REGI);
    expect(regiPalette(1)).toEqual(REGI);
  });

  test('con glow negativo la paleta se desatura hacia gris', () => {
    const tense = regiPalette(-1);
    expect(tense.body).not.toBe(REGI.body);
    expect(channelSpread(tense.gill)).toBeLessThan(channelSpread(REGI.gill) / 3);
  });

  test('la desaturación conserva aproximadamente la luminancia', () => {
    const tense = regiPalette(-1);
    expect(Math.abs(relativeLuminance(tense.body) - relativeLuminance(REGI.body))).toBeLessThan(0.08);
  });

  test('REGI está congelado para que nadie mute la paleta base compartida', () => {
    expect(Object.isFrozen(REGI)).toBe(true);
  });

  test('tensionPath no falla con un número de picos inválido', () => {
    expect(() => tensionPath(100, 100, 80, 0)).not.toThrow();
    expect(() => tensionPath(100, 100, 80, Number.NaN)).not.toThrow();
    expect(tensionPath(100, 100, 80, -4).match(/L/g)).toHaveLength(3 * 2 - 1);
  });

  test('tensionPath genera un contorno cerrado con el número de picos pedido', () => {
    const path = tensionPath(100, 100, 80, 12);
    expect(path.startsWith('M')).toBe(true);
    expect(path.endsWith('Z')).toBe(true);
    expect(path.match(/L/g)).toHaveLength(12 * 2 - 1);
  });
});
