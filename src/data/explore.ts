/**
 * Contenido de la pestaña Explorar. Los enlaces se comprobaron el 2026-09-30 (responden 200) y todos
 * pasan `isTrustedUrl`. Los eventos son DATOS DE EJEMPLO hasta que exista un backend con eventos reales.
 */
import type { ModuleId } from '@/types/game';

export interface TrustedLink {
  readonly title: string;
  readonly url: string;
}

export interface Topic {
  /** Por qué importa esta habilidad, en lenguaje cercano. */
  readonly why: string;
  readonly tips: readonly [string, string, string];
  readonly link: TrustedLink;
}

export const TOPICS: Readonly<Record<ModuleId, Topic>> = {
  descarga: {
    why: 'Cuando la cabeza da vueltas a lo mismo, gasta energía sin resolver nada. Ponerlo en palabras (escrito o hablado) baja la intensidad y te deja ver el problema con más claridad.',
    tips: ['Escribe 5 minutos sin corregir nada.', 'Separa lo que puedes controlar de lo que no.', 'Cuéntaselo a alguien de confianza, aunque sea breve.'],
    link: { title: 'Estrés (MedlinePlus)', url: 'https://medlineplus.gov/spanish/stress.html' },
  },
  enfriador: {
    why: 'Las redes, las compras y la comida rápida dan recompensas inmediatas. Esperar unos minutos antes de actuar deja que el impulso baje y que decidas tú.',
    tips: ['Anota el impulso en el Buzón y pon un temporizador.', 'Aleja el celular de la cama por las noches.', 'Pregúntate: ¿qué necesito de verdad ahora?'],
    link: { title: 'Salud mental de adolescentes y jóvenes (OMS)', url: 'https://www.who.int/es/news-room/fact-sheets/detail/adolescent-mental-health' },
  },
  freno: {
    why: 'Entre lo que sientes y lo que haces hay un espacio. Una pausa corta, con respiración lenta, evita respuestas en caliente de las que luego te arrepientes.',
    tips: ['Respira 4 segundos, sostén 4 y suelta 6.', 'Nombra la emoción: "estoy enojado/a".', 'Responde después, no durante el pico.'],
    link: { title: 'Trastornos de ansiedad (OMS)', url: 'https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders' },
  },
  hoy: {
    why: 'Una lista enorme paraliza. Elegir tres tareas y dividirlas en pasos pequeños reduce la carga mental y te da victorias rápidas que motivan.',
    tips: ['Elige solo 3 tareas para hoy.', 'Divide cada una en pasos de 10 minutos.', 'Duerme lo suficiente: el descanso también es productividad.'],
    link: { title: 'Cómo dormir bien (MedlinePlus)', url: 'https://medlineplus.gov/spanish/healthysleep.html' },
  },
  ancla: {
    why: 'Pedir ayuda a tiempo no es debilidad: es una estrategia. Tener dos o tres personas de confianza identificadas hace más fácil escribirles cuando lo necesitas.',
    tips: ['Elige tus contactos en Apoyo Cercano.', 'Un mensaje corto basta: "¿tienes 5 minutos?".', 'Si hay peligro, llama a una línea de ayuda.'],
    link: { title: 'Salud mental (OPS)', url: 'https://www.paho.org/es/temas/salud-mental' },
  },
  muro: {
    why: 'La memoria olvida lo que ya superaste. Guardar evidencia de tus logros te recuerda, en los días difíciles, que ya saliste adelante antes.',
    tips: ['Anota un logro pequeño cada semana.', 'Relee tu Muro cuando dudes de ti.', 'Celebra el esfuerzo, no solo el resultado.'],
    link: { title: 'Salud mental: fortalecer nuestra respuesta (OMS)', url: 'https://www.who.int/es/news-room/fact-sheets/detail/mental-health-strengthening-our-response' },
  },
};

export const RESOURCES: readonly TrustedLink[] = [
  { title: 'Orientación en salud y salud mental (gob.pe)', url: 'https://www.gob.pe/555-recibir-informacion-y-orientacion-en-salud' },
  { title: 'Salud mental (MedlinePlus)', url: 'https://medlineplus.gov/spanish/mentalhealth.html' },
  { title: 'Campañas del Ministerio de Salud (gob.pe)', url: 'https://www.gob.pe/institucion/minsa/campa%C3%B1as' },
];

export type EventKind = 'taller' | 'voluntariado' | 'actividad' | 'campaña';

export interface CommunityEvent {
  readonly id: string;
  readonly title: string;
  readonly kind: EventKind;
  readonly when: string;
  readonly where: string;
  readonly description: string;
}

/** Ejemplos ilustrativos (no son eventos reales): la participación siempre es voluntaria. */
export const SAMPLE_EVENTS: readonly CommunityEvent[] = [
  {
    id: 'ev-taller-estres',
    title: 'Taller: manejar el estrés de exámenes',
    kind: 'taller',
    when: 'Sábado · 10:00',
    where: 'Centro cultural de tu distrito',
    description: 'Técnicas de respiración y organización para épocas de parciales.',
  },
  {
    id: 'ev-caminata',
    title: 'Caminata consciente al aire libre',
    kind: 'actividad',
    when: 'Domingo · 08:00',
    where: 'Parque cercano',
    description: 'Una hora de caminata tranquila, sin celular, en grupo pequeño.',
  },
  {
    id: 'ev-voluntariado',
    title: 'Voluntariado: acompañamiento entre pares',
    kind: 'voluntariado',
    when: 'Miércoles · 18:30',
    where: 'En línea',
    description: 'Aprende a escuchar sin juzgar y a derivar a ayuda profesional.',
  },
  {
    id: 'ev-campana',
    title: 'Campaña: hablemos de salud mental',
    kind: 'campaña',
    when: 'Todo el mes',
    where: 'Universidades e institutos',
    description: 'Charlas abiertas y puntos de información sobre dónde pedir ayuda.',
  },
];
