/**
 * Geometría del logo VIRA (docs/brand/image3.png): ajolote blanco estilizado en "S", hojas/branquias coral y
 * salvia sobre azul petróleo y wordmark geométrico. Es datos puros y sin imports para que la compartan el
 * componente <ViraLogo /> y el script de íconos (scripts/generate-icons.mjs, que corre en Node).
 */

/** Colores de ilustración del logo (constante de marca, no de interfaz). */
export const LOGO = {
  background: '#24576A',
  figure: '#FFFFFF',
  coral: '#E99479',
  sage: '#A8C8B5',
  eye: '#24576A',
} as const;

export const LOGO_VIEWBOX = 120;

export type LeafTone = 'coral' | 'sage';

export interface LogoLeaf {
  readonly transform: string;
  readonly tone: LeafTone;
}

/** Hoja apuntando hacia +x desde el origen. */
export const LEAF_PATH = 'M0 0 C6 -8 16 -10 24 -4 C16 2 6 4 0 0 Z';

export const LOGO_LEAVES: readonly LogoLeaf[] = [
  { transform: 'translate(70 25) rotate(-162)', tone: 'sage' },
  { transform: 'translate(71 21) rotate(-130)', tone: 'coral' },
  { transform: 'translate(75 18) rotate(-98) scale(0.85)', tone: 'sage' },
  { transform: 'translate(32 81) rotate(168) scale(0.7)', tone: 'sage' },
  { transform: 'translate(32 79) rotate(208) scale(0.6)', tone: 'coral' },
];

/** Patitas del ajolote (elipses rotadas). */
export const LOGO_LEGS = [
  { cx: 42, cy: 62, rx: 6, ry: 3.4, rotate: 35 },
  { cx: 89, cy: 83, rx: 6, ry: 3.4, rotate: -35 },
] as const;

/** Cuerpo en "S": se dibuja como trazo grueso con extremos redondeados. */
export const LOGO_BODY = 'M74 30 C54 28 40 42 48 56 C56 70 86 64 82 80 C79 90 64 93 52 87';
export const LOGO_BODY_WIDTH = 14;
export const LOGO_TAIL = 'M54 85 C42 92 30 88 24 79 C33 84 43 83 51 80 Z';
export const LOGO_HEAD = { cx: 82, cy: 29, rx: 19, ry: 13.5, rotate: -10 } as const;
export const LOGO_EYE = { cx: 90, cy: 26, r: 2.6 } as const;
export const LOGO_SMILE = 'M91 32.5 Q95 35 99 31.5';

/** Wordmark "VIRA" con trazos geométricos y espaciado amplio. */
export const LOGO_WORDMARK: readonly string[] = [
  'M32 96 L38 110 L44 96',
  'M52 96 L52 110',
  'M60 110 L60 96 L66 96 C71 96 71 103 66 103 L60 103 M65 103 L70 110',
  'M78 110 L84 96 L90 110 M80.5 105 L87.5 105',
];
export const LOGO_WORDMARK_WIDTH = 3.2;

/** Desplazamiento vertical para centrar solo el símbolo (variante "mark"). */
export const MARK_OFFSET_Y = 12;

export type LogoVariant = 'full' | 'mark';
export type LogoBackground = 'rounded' | 'square' | 'none';

export interface LogoSvgOptions {
  readonly variant: LogoVariant;
  readonly background: LogoBackground;
  readonly size: number;
  /** Color del ajolote y el wordmark. */
  readonly figure?: string;
  /** Proporción del lienzo que ocupa el dibujo (1 = todo; 0.66 = zona segura del ícono adaptativo). */
  readonly contentScale?: number;
  /** Dibuja las hojas en el color de la figura (ícono monocromo). */
  readonly monochrome?: boolean;
}

function leafColor(tone: LeafTone, options: LogoSvgOptions): string {
  if (options.monochrome) return options.figure ?? LOGO.figure;
  return tone === 'coral' ? LOGO.coral : LOGO.sage;
}

/** Genera el SVG del logo como texto (lo usa el script de íconos). */
export function buildLogoSvg(options: LogoSvgOptions): string {
  const figure = options.figure ?? LOGO.figure;
  const scale = options.contentScale ?? 1;
  const offset = (LOGO_VIEWBOX * (1 - scale)) / 2;
  const shiftY = options.variant === 'mark' ? MARK_OFFSET_Y : 0;
  const background =
    options.background === 'none'
      ? ''
      : `<rect width="${LOGO_VIEWBOX}" height="${LOGO_VIEWBOX}" rx="${options.background === 'rounded' ? 26 : 0}" fill="${LOGO.background}"/>`;
  const leaves = LOGO_LEAVES.map(
    (leaf) => `<path d="${LEAF_PATH}" transform="${leaf.transform}" fill="${leafColor(leaf.tone, options)}"/>`,
  ).join('');
  const eyeColor = options.monochrome ? 'none' : LOGO.eye;
  const wordmark =
    options.variant === 'full'
      ? LOGO_WORDMARK.map(
          (d) =>
            `<path d="${d}" stroke="${figure}" stroke-width="${LOGO_WORDMARK_WIDTH}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
        ).join('')
      : '';
  const head = LOGO_HEAD;
  const legs = LOGO_LEGS.map(
    (leg) =>
      `<ellipse cx="${leg.cx}" cy="${leg.cy}" rx="${leg.rx}" ry="${leg.ry}" transform="rotate(${leg.rotate} ${leg.cx} ${leg.cy})" fill="${figure}"/>`,
  ).join('');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.size}" height="${options.size}" viewBox="0 0 ${LOGO_VIEWBOX} ${LOGO_VIEWBOX}">`,
    background,
    `<g transform="translate(${offset} ${offset}) scale(${scale})">`,
    `<g transform="translate(0 ${shiftY})">`,
    leaves,
    `<path d="${LOGO_BODY}" stroke="${figure}" stroke-width="${LOGO_BODY_WIDTH}" stroke-linecap="round" fill="none"/>`,
    `<path d="${LOGO_TAIL}" fill="${figure}"/>`,
    legs,
    `<ellipse cx="${head.cx}" cy="${head.cy}" rx="${head.rx}" ry="${head.ry}" transform="rotate(${head.rotate} ${head.cx} ${head.cy})" fill="${figure}"/>`,
    `<circle cx="${LOGO_EYE.cx}" cy="${LOGO_EYE.cy}" r="${LOGO_EYE.r}" fill="${eyeColor}"/>`,
    `<path d="${LOGO_SMILE}" stroke="${eyeColor}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`,
    '</g>',
    wordmark,
    '</g>',
    '</svg>',
  ].join('');
}
