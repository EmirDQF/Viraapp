/** Utilidades de color puras (sin dependencias de React Native) para tokens y verificación de contraste. */

type Rgb = readonly [number, number, number];

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
const CHANNEL_MAX = 255;
const LUMA_WEIGHTS: Rgb = [0.2126, 0.7152, 0.0722];

/** Limita un valor a [0, 1]; NaN o infinito se tratan como 0 para no generar colores inválidos. */
function clampUnit(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

function mapRgb(rgb: Rgb, fn: (channel: number, index: number) => number): Rgb {
  return [fn(rgb[0], 0), fn(rgb[1], 1), fn(rgb[2], 2)];
}

function parseHex(hex: string): Rgb {
  const match = HEX_PATTERN.exec(hex.trim());
  if (!match) {
    throw new Error(`Color hex inválido: "${hex}"`);
  }
  const raw = match[1].length === 3 ? [...match[1]].map((char) => char + char).join('') : match[1];
  const channel = (offset: number): number => parseInt(raw.slice(offset, offset + 2), 16);
  return [channel(0), channel(2), channel(4)];
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0').toUpperCase()).join('')}`;
}

function linearize(channel: number): number {
  const value = channel / CHANNEL_MAX;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa según WCAG 2.x. */
export function relativeLuminance(hex: string): number {
  const rgb = parseHex(hex);
  return rgb.reduce((sum, channel, index) => sum + linearize(channel) * LUMA_WEIGHTS[index], 0);
}

/** Relación de contraste WCAG entre dos colores (1 a 21). */
export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

/** Oscurece un color en la proporción indicada (0 = igual, 1 = negro). */
export function darken(hex: string, amount: number): string {
  const factor = 1 - clampUnit(amount);
  return toHex(mapRgb(parseHex(hex), (channel) => channel * factor));
}

/** Aclara un color mezclándolo con blanco (0 = igual, 1 = blanco). */
export function lighten(hex: string, amount: number): string {
  const factor = clampUnit(amount);
  return toHex(mapRgb(parseHex(hex), (channel) => channel + (CHANNEL_MAX - channel) * factor));
}

/** Mezcla dos colores: t = 0 devuelve `from`, t = 1 devuelve `to`. */
export function mix(from: string, to: string, t: number): string {
  const amount = clampUnit(t);
  const b = parseHex(to);
  return toHex(mapRgb(parseHex(from), (channel, index) => channel + (b[index] - channel) * amount));
}

/** Desatura un color hacia su gris equivalente (misma luminancia percibida). */
export function desaturate(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex);
  const gray = r * 0.299 + g * 0.587 + b * 0.114;
  return mix(hex, toHex([gray, gray, gray]), amount);
}

/** Convierte un hex en rgba con la opacidad indicada. */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${clampUnit(alpha)})`;
}
