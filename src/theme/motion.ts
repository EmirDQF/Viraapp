/**
 * Movimiento VIRA 2026: resortes para todo lo que se pulsa o aparece. Todos los consumidores deben respetar
 * `useReduceMotion()` (ver `enterAnimation`); el layout raíz reduce además los `with*` de forma global.
 */
import { FadeIn, FadeInDown, type WithSpringConfig } from 'react-native-reanimated';

export const spring = {
  /** Respuesta física inmediata: botones, chips, indicadores. */
  snappy: { damping: 18, stiffness: 260, mass: 1 },
  /** Movimientos amplios y calmados: hojas, tarjetas que entran, arcos de progreso. */
  gentle: { damping: 20, stiffness: 120, mass: 1 },
} as const satisfies Record<string, WithSpringConfig>;

export const duration = {
  fast: 150,
  base: 250,
  slow: 400,
  /** Contadores numéricos animados. */
  counter: 700,
  /** Deriva de las manchas de los fondos vivos (un ciclo). */
  blobDrift: 24000,
  /** Barrido del shimmer de los skeletons. */
  shimmer: 1400,
} as const;

/** Escala al pulsar un elemento. */
export const PRESS_SCALE = 0.97;

/** Retraso entre ítems de una lista con entrada escalonada. */
export const STAGGER_MS = 40;

/** Tope de ítems escalonados: más allá, entran todos a la vez para no alargar la espera. */
const MAX_STAGGERED_ITEMS = 12;

/**
 * Animación de entrada de un ítem de lista (FadeInDown con resorte y 40 ms entre ítems).
 * Con movimiento reducido solo hay un fundido breve.
 */
export function enterAnimation(index: number, reduceMotion: boolean) {
  if (reduceMotion) {
    return FadeIn.duration(duration.fast);
  }
  const delay = Math.min(index, MAX_STAGGERED_ITEMS) * STAGGER_MS;
  return FadeInDown.springify().damping(spring.gentle.damping).stiffness(spring.gentle.stiffness).delay(delay);
}
