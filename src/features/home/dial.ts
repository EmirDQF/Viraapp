/**
 * Geometría pura del dial de módulos. Los ángulos se miden en grados, en sentido horario y con 0° arriba.
 * Las funciones marcadas como worklet se usan también en el hilo de UI (gestos de Reanimated).
 */

const FULL_TURN = 360;

function mod(value: number, base: number): number {
  'worklet';
  return ((value % base) + base) % base;
}

export function segmentAngle(count: number): number {
  'worklet';
  return FULL_TURN / count;
}

/** Índice del gajo que queda bajo la flecha superior para una rotación dada. */
export function indexForRotation(rotation: number, count: number): number {
  'worklet';
  return mod(Math.round(-rotation / segmentAngle(count)), count);
}

/** Rotación encajada en el gajo más cercano. */
export function snapRotation(rotation: number, count: number): number {
  'worklet';
  const segment = segmentAngle(count);
  return Math.round(rotation / segment) * segment + 0;
}

/** Diferencia angular más corta de `from` a `to`, en [-180, 180]. */
export function shortestDelta(from: number, to: number): number {
  'worklet';
  return mod(to - from + 180, FULL_TURN) - 180;
}

/** Rotación que deja el gajo `index` arriba, girando lo mínimo desde la rotación actual. */
export function rotationForIndex(index: number, currentRotation: number, count: number): number {
  'worklet';
  const target = -index * segmentAngle(count);
  return currentRotation + shortestDelta(currentRotation, target);
}

/** Ángulo (0° arriba, horario) de un punto respecto al centro. */
export function angleFromPoint(x: number, y: number, cx: number, cy: number): number {
  'worklet';
  const degrees = (Math.atan2(x - cx, -(y - cy)) * 180) / Math.PI;
  return mod(degrees, FULL_TURN);
}

function polar(cx: number, cy: number, r: number, deg: number): string {
  const rad = ((deg - 90) * Math.PI) / 180;
  return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
}

/** Trayectoria SVG de un gajo (sector de anillo) entre dos ángulos. */
export function wedgePath(cx: number, cy: number, outer: number, inner: number, startDeg: number, endDeg: number): string {
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${polar(cx, cy, outer, startDeg)}`,
    `A ${outer} ${outer} 0 ${large} 1 ${polar(cx, cy, outer, endDeg)}`,
    `L ${polar(cx, cy, inner, endDeg)}`,
    `A ${inner} ${inner} 0 ${large} 0 ${polar(cx, cy, inner, startDeg)}`,
    'Z',
  ].join(' ');
}
