import { contrastRatio, relativeLuminance } from '@/lib/color';
import {
  brand,
  darkColors,
  gradients,
  lightColors,
  MODULE_COLORS,
  onGradient,
  radius,
} from '@/theme/tokens';

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
    expect(contrastRatio(colors.successText, colors.background)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.successText, colors.surface)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.dangerText, colors.background)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.dangerText, colors.surface)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.highlight, colors.background)).toBeGreaterThanOrEqual(AA_NORMAL);
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

  test.each([
    ['claro', lightColors],
    ['oscuro', darkColors],
  ])('modo %s: texto sobre el color de Regi', (_, colors) => {
    expect(contrastRatio(colors.onRegi, colors.regi)).toBeGreaterThanOrEqual(AA_NORMAL);
    expect(contrastRatio(colors.text, colors.regiSoft)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  test('cada módulo define un texto legible sobre su color y sus tintes suaves', () => {
    Object.values(MODULE_COLORS).forEach((tone) => {
      expect(contrastRatio(tone.on, tone.base)).toBeGreaterThanOrEqual(AA_NORMAL);
      expect(contrastRatio(lightColors.text, tone.soft)).toBeGreaterThanOrEqual(AA_NORMAL);
      expect(contrastRatio(darkColors.text, tone.softDark)).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });

  test.each(Object.entries(onGradient))('el texto del degradado %s es legible en todas sus paradas', (name, text) => {
    gradients[name as keyof typeof onGradient].forEach((stop) => {
      expect(contrastRatio(text, stop)).toBeGreaterThanOrEqual(AA_NORMAL);
    });
  });
});

describe('tokens VIRA 2026: paleta viva', () => {
  test('usa los valores de marca del rediseño', () => {
    expect(brand.petrol).toBe('#16708F');
    expect(brand.petrolDeep).toBe('#0F5870');
    expect(brand.petrolBright).toBe('#17789A');
    expect(brand.sage).toBe('#5ED3A0');
    expect(brand.coral).toBe('#FF7A59');
    expect(brand.lilac).toBe('#6F5FEA');
    expect(brand.ivory).toBe('#FBF8F2');
    expect(brand.ink).toBe('#15262E');
  });

  test('el modo oscuro es profundo y con color', () => {
    expect(darkColors.background).toBe('#0B2029');
    expect(darkColors.surface).toBe('#13303C');
    expect(darkColors.surfaceAlt).toBe('#1B3D4B');
    expect(darkColors.border).toBe('#24505F');
    expect(darkColors.textMuted).toBe('#9FB9C4');
  });

  test('los módulos usan los colores del dial', () => {
    expect(MODULE_COLORS.hoy.base).toBe('#16A34A');
    expect(MODULE_COLORS.descarga.base).toBe('#2563EB');
    expect(MODULE_COLORS.freno.base).toBe('#FF5A36');
    expect(MODULE_COLORS.enfriador.base).toBe('#7446F0');
    expect(MODULE_COLORS.ancla.base).toBe('#F59E0B');
    expect(MODULE_COLORS.muro.base).toBe('#EAB308');
  });

  test('las variantes deep son más oscuras que su base', () => {
    Object.values(MODULE_COLORS).forEach((tone) => {
      expect(relativeLuminance(tone.deep)).toBeLessThan(relativeLuminance(tone.base));
    });
  });

  test('los degradados principales siguen la guía', () => {
    expect(gradients.aurora).toEqual(['#16708F', '#2FB8A8', '#5ED3A0']);
    expect(gradients.sunrise).toEqual(['#FF7A59', '#FFB547']);
    expect(gradients.regi).toEqual(['#6F5FEA', '#B3A8FF']);
    expect(gradients.gold).toEqual(['#EAB308', '#FDE68A']);
  });

  test('radios de la escala 2026', () => {
    expect(radius).toMatchObject({ sm: 12, md: 18, lg: 24, xl: 32, pill: 999 });
  });
});
