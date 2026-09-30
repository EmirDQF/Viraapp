/**
 * Regi: el ajolote guía de VIRA. Su nombre viene de "regenerar". Aquí vive la lógica pura de la mascota
 * (poses, etiquetas accesibles, paleta según el estado emocional) para poder probarla sin renderizar.
 */
import { desaturate } from '@/lib/color';

export type RegiPose = 'calm' | 'empathetic' | 'growth' | 'resilient';

export const REGI_POSES: readonly RegiPose[] = ['calm', 'empathetic', 'growth', 'resilient'];

/** Colores de ilustración de Regi (fieles a docs/brand/image6.png). */
export const REGI = Object.freeze({
  body: '#C9C6F0',
  shade: '#A7A2DE',
  belly: '#E4E2FA',
  gill: '#EE8FA6',
  gillTip: '#F6B6C4',
  cheek: '#F4A7B9',
  ink: '#3A3558',
  shine: '#FFFFFF',
  leaf: '#7CC47F',
  leafVein: '#5AA35E',
  leafHalo: '#BFE8B0',
  heart: '#F4A7B9',
  soil: '#9C7A5B',
  tension: '#8A8F98',
} as const);

export type RegiColors = { readonly [K in keyof typeof REGI]: string };

const POSE_LABEL: Readonly<Record<RegiPose, string>> = {
  calm: 'tranquilo',
  empathetic: 'empático y cercano',
  growth: 'celebrando tu avance',
  resilient: 'ofreciéndote apoyo',
};

/** Umbral a partir del cual el estado emocional domina sobre la pose en la descripción. */
const GLOW_LABEL_THRESHOLD = 0.5;
/** Desaturación máxima cuando Regi está tenso (no llega al gris total para no perder su identidad). */
const MAX_DESATURATION = 0.85;

export function clampGlow(glow: number): number {
  if (!Number.isFinite(glow)) return 0;
  return Math.min(1, Math.max(-1, glow));
}

export function regiStateLabel(pose: RegiPose, glow: number): string {
  const value = clampGlow(glow);
  if (value <= -GLOW_LABEL_THRESHOLD) return 'tenso';
  if (value >= GLOW_LABEL_THRESHOLD) return 'brillando';
  return POSE_LABEL[pose];
}

export function regiAccessibilityLabel(pose: RegiPose, glow: number): string {
  return `Regi, el ajolote guía, ${regiStateLabel(pose, glow)}`;
}

/** Paleta de Regi según el glow: en negativo se desatura (espejo emocional: "se tensa"). */
export function regiPalette(glow: number): RegiColors {
  const value = clampGlow(glow);
  if (value >= 0) return REGI;
  const amount = -value * MAX_DESATURATION;
  const entries = Object.entries(REGI).map(([key, color]) => [key, key === 'shine' ? color : desaturate(color, amount)]);
  return Object.fromEntries(entries) as RegiColors;
}

/** Contorno en zigzag alrededor de Regi que representa la tensión (glow negativo). */
export function tensionPath(cx: number, cy: number, radius: number, spikes: number): string {
  const count = Math.max(3, Math.trunc(Number.isFinite(spikes) ? spikes : 3));
  const inner = radius * 0.9;
  const points = Array.from({ length: count * 2 }, (_, index) => {
    const angle = (Math.PI * index) / count;
    const r = index % 2 === 0 ? radius : inner;
    return `${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points[0]} ${points.slice(1).map((point) => `L${point}`).join(' ')} Z`;
}
