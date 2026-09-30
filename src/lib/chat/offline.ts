/**
 * Respuestas guionizadas de Regi cuando no hay servidor de IA configurado o no hay conexión.
 * Siguen la misma guía que la IA: entender la situación → reconocer recursos → elegir un siguiente paso.
 */
import { detectCrisis } from '@/lib/chat/crisis';

export const CRISIS_REPLY =
  'Gracias por contármelo. Lo que sientes importa y no tienes que pasarlo solo. Por favor, habla ahora con alguien: ' +
  'puedes llamar gratis a la Línea 113, opción 5, las 24 horas, o escribir a alguien de tu Apoyo Cercano. ' +
  'Si estás en peligro inmediato, llama al 106. Aquí sigo contigo.';

interface Topic {
  readonly pattern: RegExp;
  readonly reply: string;
}

const TOPICS: readonly Topic[] = [
  {
    pattern: /examen|parcial|entrega|universidad|clase|tesis|curso|nota/,
    reply: 'Un examen o una entrega cercana puede pesar mucho. ¿Qué es lo que más te preocupa de ese examen: el tiempo, el tema o el resultado?',
  },
  {
    pattern: /trabajo|practicas|jefe|entrevista|empleo/,
    reply: 'Los primeros pasos en el trabajo suelen traer dudas. ¿Qué parte de esa situación sí depende de ti hoy?',
  },
  {
    pattern: /familia|mama|papa|hermano|hermana|casa/,
    reply: 'Lo que pasa en casa nos afecta mucho. ¿Cómo te sientes tú en medio de esa situación?',
  },
  {
    pattern: /amig|pareja|novi|grupo|sol[oa]\b/,
    reply: 'Las relaciones pueden doler y también sostenernos. ¿Hay alguien de confianza con quien te sientas un poco más tranquilo?',
  },
  {
    pattern: /ansie|nervios|estres|agobi|saturad|cansad|agotad/,
    reply: 'Suena a que estás cargando mucho. Antes de seguir, ¿te parece si respiramos juntos un momento? Luego me cuentas qué es lo más urgente.',
  },
  {
    pattern: /dinero|plata|deuda|pagar/,
    reply: 'Las preocupaciones de dinero cansan la cabeza. ¿Qué parte de esto podrías ordenar o consultar con alguien esta semana?',
  },
];

/** Guía por etapas cuando no se reconoce un tema concreto. */
const GUIDE: readonly string[] = [
  'Te escucho. ¿Qué está pasando y desde cuándo te sientes así?',
  'Gracias por contarme. ¿Qué te ha ayudado antes en momentos parecidos, o quién podría apoyarte ahora?',
  'Con lo que me cuentas, ¿cuál sería un paso pequeño que podrías dar hoy, aunque sea de cinco minutos?',
  'Me alegra acompañarte. Recuerda que un mal día no te define. ¿Quieres seguir conversando o prefieres practicar un ejercicio?',
];

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Respuesta offline de Regi. `turn` es cuántas respuestas de Regi hubo ya en la conversación. */
export function offlineReply(text: string, turn: number): string {
  if (detectCrisis(text)) return CRISIS_REPLY;
  const normalized = normalize(text);
  const topic = TOPICS.find((item) => item.pattern.test(normalized));
  if (topic && turn < 2) return topic.reply;
  return GUIDE[Math.min(Math.max(0, turn), GUIDE.length - 1)];
}
