import { contrastRatio } from '@/lib/color';
import { darkColors, lightColors, MODULE_COLORS } from '@/theme/tokens';

const AA_NORMAL = 4.5;

describe('tokens VIRA: contraste WCAG AA', () => {
  test.each([
    ['claro', lightColors],
    ['oscuro', darkColors],
  ])('modo %s: texto y texto atenuado sobre fondo y superficie', (_, colors) => {
    expect(contrastRatio(colors.text, colors.background)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.text, colors.surface)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.textMuted, colors.background)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.textMuted, colors.surface)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  test.each([
    ['claro', lightColors],
    ['oscuro', darkColors],
  ])('modo %s: texto de los botones sobre su color', (_, colors) => {
    expect(contrastRatio(colors.onPrimary, colors.primary)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.onAccent, colors.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.onSecondary, colors.secondary)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.onSuccess, colors.success)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.onDanger, colors.danger)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  test('cada módulo define un texto legible sobre su color', () => {
    Object.values(MODULE_COLORS).forEach((tone) => {
      expect(contrastRatio(tone.on, tone.base)).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });
});
