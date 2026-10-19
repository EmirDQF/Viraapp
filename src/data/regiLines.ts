/**
 * Banco de frases de Regi: según la hora, la racha, el foco del usuario, la tendencia semanal y cuando lo
 * tocan. Tono cálido, sin juzgar ni diagnosticar. `pickRegiLine` elige una frase de forma determinista.
 */
import type { FocusArea } from '@/lib/personalize';
import { seededRandom, type Random } from '@/lib/random';
import type { Trend } from '@/lib/timeline';

/** Marcador que se reemplaza por los días de racha. */
const STREAK_TOKEN = '{n}';

const FOCUS_LINES: Readonly<Record<FocusArea, readonly string[]>> = {
  impulsos: ['Entre lo que sientes y lo que haces cabe una pausa. Tú decides.', 'Un impulso es una ola: sube, llega al pico y baja.'],
  frustracion: ['La frustración avisa que algo te importa. Escúchala sin explotar.', '«Difícil» no es «imposible». ¿Qué parte sí puedes hacer?'],
  emociones: ['Todas las emociones traen información. Ninguna es mala.', '¿Qué estás sintiendo ahora? Ponerle nombre ya ayuda.'],
  ansiedad: ['Nombra 5 cosas que ves: el presente es un buen lugar.', 'Inhala 4, sostén 4, exhala 4. Estoy contigo.'],
  resiliencia: ['Ya saliste de cosas difíciles antes. Esa es tu evidencia.', 'Caerse es parte; levantarse es lo que te define.'],
  estrategias: ['Una técnica practicada en calma sale sola en la tormenta.', 'Hoy prueba una técnica nueva. Solo un minuto.'],
  pensamientos: ['Un pensamiento no es un hecho. ¿Qué evidencia tienes?', '¿Le hablarías así a un amigo? Háblate igual de bonito.'],
  relaciones: ['Decir lo que necesitas con calma también es cuidarte.', 'Pedir ayuda a tiempo es fuerza, no debilidad.'],
  estres: ['Tres prioridades bien elegidas rinden más que diez a la vez.', 'Divide la tarea grande en un primer paso de 5 minutos.'],
  pantallas: ['¿Scrolleas por ganas o por escape? Pausa y decide.', 'Celular lejos por 25 minutos: tu atención te lo agradece.'],
};

export const REGI_LINES = {
  morning: [
    '¡Buenos días! Un minuto de respiración puede cambiar cómo arranca tu día.',
    'Empieza pequeño: una cosa a la vez, y la primera ya cuenta.',
    'Antes de abrir redes, ¿qué tal un respiro conmigo?',
    'Hoy no tienes que poder con todo. Solo con lo siguiente.',
  ],
  afternoon: [
    'Media jornada: ¿cómo va tu energía? Una pausa corta recarga.',
    'Si la tarde se pone pesada, aquí estoy para un STOP rápido.',
    'Un vaso de agua y tres respiraciones. Tu cuerpo te lo agradece.',
    '¿Algo te frustró hoy? Ponerle nombre ya baja la intensidad.',
  ],
  night: [
    'Ya casi termina el día. ¿Qué fue lo mejor que hiciste hoy?',
    'Antes de dormir, la respiración 4-7-8 ayuda a soltar el día.',
    'Lo que no salió hoy puede esperar a mañana. Descansa.',
    'Deja el celular un rato antes de dormir. Tu mente lo nota.',
  ],
  streak: [
    `¡${STREAK_TOKEN} días seguidos! La constancia es tu superpoder.`,
    `Llevas ${STREAK_TOKEN} días practicando. Me haces crecer.`,
    `Racha de ${STREAK_TOKEN} días: cada día suma, aunque sea poquito.`,
  ],
  noStreak: ['Hoy es un buen día para empezar (o volver). Sin presión.', 'No importa cuánto tiempo pasó: volver también es avanzar.'],
  focus: FOCUS_LINES,
} as const;

/** Lo que dice Regi cuando lo tocan. */
export const TAP_LINES: readonly string[] = [
  '¡Jiji, cosquillas!',
  '¡Hola! Me alegra verte por aquí.',
  'Soy un ajolote: me regenero. Tú también puedes.',
  '¿Respiramos juntos? Inhala… exhala…',
  '¡Eso! Sigue así, a tu ritmo.',
  'Mis branquias se mueven cuando estoy feliz.',
];

/** Frases según la tendencia semanal de "Mi camino". */
export const TREND_LINES: Readonly<Record<Trend, string>> = {
  new: 'Tu camino empieza aquí. Cada lección, impulso frenado o check-in aparecerá en esta línea.',
  up: '¡Esta semana practicaste más que la anterior! Se nota tu constancia.',
  steady: 'Vas a un ritmo parejo. La constancia también es fuerza.',
  down: 'Esta semana fue más tranquila. Está bien: retomamos con algo pequeño, sin presión.',
};

/** Todas las frases del banco (para validar que no haya repetidas). */
export function allRegiLines(): readonly string[] {
  return [
    ...REGI_LINES.morning,
    ...REGI_LINES.afternoon,
    ...REGI_LINES.night,
    ...REGI_LINES.streak,
    ...REGI_LINES.noStreak,
    ...Object.values(FOCUS_LINES).flat(),
    ...TAP_LINES,
    ...Object.values(TREND_LINES),
  ];
}

function timeLines(hour: number): readonly string[] {
  if (hour >= 5 && hour < 12) return REGI_LINES.morning;
  if (hour >= 12 && hour < 19) return REGI_LINES.afternoon;
  return REGI_LINES.night;
}

export interface RegiLineInput {
  readonly hour: number;
  readonly streak: number;
  readonly focusAreas: readonly FocusArea[];
  /** Semilla (p. ej. el día o un contador de toques) para variar sin azar real. */
  readonly seed: number;
}

/** Elige una frase contextual: mezcla las de la hora, la racha y las áreas de foco del usuario. */
export function pickRegiLine({ hour, streak, focusAreas, seed }: RegiLineInput): string {
  const streakLines = streak > 0 ? REGI_LINES.streak.map((line) => line.replace(STREAK_TOKEN, String(streak))) : REGI_LINES.noStreak;
  const pool = [...timeLines(hour), ...streakLines, ...focusAreas.flatMap((area) => FOCUS_LINES[area])];
  return pool[Math.floor(seededRandom(seed + 1)() * pool.length)] ?? REGI_LINES.noStreak[0];
}

/** Espera aleatoria entre parpadeos: de 3 a 6 segundos. */
export function blinkDelay(random: Random = Math.random): number {
  return 3000 + Math.round(Math.min(0.999, Math.max(0, random())) * 3000);
}
