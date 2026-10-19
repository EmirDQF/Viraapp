/** Frases de Regi según la tendencia semanal de "Mi camino". (El banco completo se amplía en regiLines.) */
import type { Trend } from '@/lib/timeline';

export const TREND_LINES: Readonly<Record<Trend, string>> = {
  new: 'Tu camino empieza aquí. Cada lección, impulso frenado o check-in aparecerá en esta línea.',
  up: '¡Esta semana practicaste más que la anterior! Se nota tu constancia.',
  steady: 'Vas a un ritmo parejo. La constancia también es fuerza.',
  down: 'Esta semana fue más tranquila. Está bien: retomamos con algo pequeño, sin presión.',
};
