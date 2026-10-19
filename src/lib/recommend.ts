/**
 * Recomendador de técnicas: a partir de lo que siente el usuario (si lo dijo), su ánimo, los impulsos
 * recientes, su foco y la hora, sugiere una técnica concreta y explica por qué. Lógica pura y determinista.
 */
import { TECHNIQUE_IDS, TECHNIQUES, type TechniqueId, type TechniqueNeed } from '@/data/techniques';
import type { FocusArea } from '@/lib/personalize';
import type { MoodValue } from '@/lib/timeline';

export interface RecommendInput {
  /** Lo que el usuario dice sentir (SOS) o null. */
  readonly need: TechniqueNeed | null;
  /** Último ánimo de hoy (1 a 5) o null. */
  readonly mood: MoodValue | null;
  /** Impulsos anotados en los últimos días. */
  readonly recentImpulses: number;
  readonly focusAreas: readonly FocusArea[];
  readonly hour: number;
  /** Intensidad de 1 a 10 (SOS) o null. */
  readonly intensity: number | null;
}

export interface Recommendation {
  readonly technique: TechniqueId;
  readonly reason: string;
}

/** Con intensidad alta primero se calma el cuerpo: técnicas cortas que no exigen pensar. */
const HIGH_INTENSITY = 8;
const BODY_FIRST: readonly TechniqueId[] = ['stop', 'respiracion-478', 'respiracion-cuadrada', 'grounding', 'contar-10'];
/** De noche se evitan las técnicas largas o que activan la mente. */
const NOT_AT_NIGHT: readonly TechniqueId[] = ['problemas', 'tiempo-fuera'];
const MANY_IMPULSES = 3;
const LOW_MOOD = 2;

const FOCUS_NEED: Readonly<Record<FocusArea, TechniqueNeed>> = {
  impulsos: 'impulso',
  frustracion: 'frustracion',
  emociones: 'tristeza',
  ansiedad: 'ansiedad',
  resiliencia: 'pensamientos',
  estrategias: 'impulso',
  pensamientos: 'pensamientos',
  relaciones: 'conflicto',
  estres: 'ansiedad',
  pantallas: 'impulso',
};

const NEED_REASON: Readonly<Record<TechniqueNeed, string>> = {
  impulso: 'Sirve para que la ola del impulso baje antes de decidir.',
  enojo: 'Ayuda a bajar el enojo antes de responder.',
  ansiedad: 'Calma el cuerpo y te trae al presente.',
  frustracion: 'Te ayuda a tolerar la frustración sin explotar.',
  pensamientos: 'Te ayuda a revisar ese pensamiento con calma.',
  tristeza: 'Es una forma amable de acompañarte cuando el ánimo está bajo.',
  conflicto: 'Te ayuda a expresar lo que necesitas sin atacar.',
};

function isNight(hour: number): boolean {
  return hour >= 22 || hour < 6;
}

/** Qué necesidad pesa más: lo que dijo, luego ánimo bajo, luego impulsos recientes, luego su foco. */
function resolveNeed(input: RecommendInput): TechniqueNeed {
  if (input.need) return input.need;
  if (input.mood !== null && input.mood <= LOW_MOOD) return 'tristeza';
  if (input.recentImpulses >= MANY_IMPULSES) return 'impulso';
  const focus = input.focusAreas[0];
  return focus ? FOCUS_NEED[focus] : 'ansiedad';
}

export function recommendTechnique(input: RecommendInput): Recommendation {
  const need = resolveNeed(input);
  const intense = input.intensity !== null && input.intensity >= HIGH_INTENSITY;
  const night = isNight(input.hour);
  const candidates = TECHNIQUE_IDS.filter((id) => TECHNIQUES[id].needs.includes(need)).filter((id) => !night || !NOT_AT_NIGHT.includes(id));
  const preferred = intense ? candidates.filter((id) => BODY_FIRST.includes(id)) : candidates;
  // Si la intensidad es alta y ninguna técnica de esa necesidad es "de cuerpo", se usa STOP, que sirve para todo.
  const technique = preferred[0] ?? (intense ? 'stop' : candidates[0]) ?? 'respiracion-cuadrada';
  const reason = intense ? 'Con tanta intensidad, primero calmamos el cuerpo. Después podrás pensar con más claridad.' : NEED_REASON[need];
  return { technique, reason };
}
