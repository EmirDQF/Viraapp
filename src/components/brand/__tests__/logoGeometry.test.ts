import { LOGO, buildLogoSvg } from '@/components/brand/logoGeometry';

describe('buildLogoSvg', () => {
  test('genera un SVG con el tamaño pedido', () => {
    const svg = buildLogoSvg({ variant: 'mark', background: 'square', size: 1024 });
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg).toContain('width="1024"');
    expect(svg.endsWith('</svg>')).toBe(true);
  });

  test('la variante full incluye el wordmark y mark no', () => {
    const full = buildLogoSvg({ variant: 'full', background: 'none', size: 100 });
    const mark = buildLogoSvg({ variant: 'mark', background: 'none', size: 100 });
    expect(full.split('stroke-linejoin').length).toBeGreaterThan(mark.split('stroke-linejoin').length);
  });

  test('background none no dibuja el rectángulo petróleo', () => {
    expect(buildLogoSvg({ variant: 'mark', background: 'none', size: 48 })).not.toContain('<rect');
    expect(buildLogoSvg({ variant: 'mark', background: 'rounded', size: 48 })).toContain(`fill="${LOGO.background}"`);
  });

  test('monochrome pinta las hojas del color de la figura', () => {
    const svg = buildLogoSvg({ variant: 'mark', background: 'none', size: 48, monochrome: true });
    expect(svg).not.toContain(LOGO.coral);
    expect(svg).not.toContain(LOGO.sage);
  });
});
