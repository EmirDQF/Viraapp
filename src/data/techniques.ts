/**
 * Técnicas de control del curso como ejercicios guiados (SOS, recomendador y cronología).
 * Cada paso dura `seconds` y la pantalla lo acompaña con un temporizador y vibración suave.
 */
export const TECHNIQUE_IDS = [
  'stop',
  'respiracion-478',
  'respiracion-cuadrada',
  'contar-10',
  'tiempo-fuera',
  'surfear',
  'grounding',
  'reestructuracion',
  'autoinstrucciones',
  'problemas',
  'regla-10',
  'relajacion',
  'asertiva',
] as const;
export type TechniqueId = (typeof TECHNIQUE_IDS)[number];

/** Para qué sirve mejor cada técnica (lo usa el recomendador). */
export type TechniqueNeed = 'impulso' | 'enojo' | 'ansiedad' | 'frustracion' | 'pensamientos' | 'tristeza' | 'conflicto';

export interface TechniqueStep {
  readonly text: string;
  readonly seconds: number;
}

export interface Technique {
  readonly id: TechniqueId;
  readonly name: string;
  readonly short: string;
  readonly needs: readonly TechniqueNeed[];
  readonly steps: readonly TechniqueStep[];
}

export const TECHNIQUES: Readonly<Record<TechniqueId, Technique>> = {
  stop: {
    id: 'stop',
    name: 'STOP',
    short: 'Para, toma aire, observa y prosigue.',
    needs: ['impulso', 'enojo', 'conflicto'],
    steps: [
      { text: 'S · Para. Quédate quieto un momento. No hagas nada todavía.', seconds: 8 },
      { text: 'T · Toma aire. Inhala lento por la nariz y suelta despacio por la boca.', seconds: 12 },
      { text: 'O · Observa. ¿Qué piensas? ¿Qué sientes en el cuerpo? ¿Qué tienes ganas de hacer?', seconds: 20 },
      { text: 'P · Prosigue. Elige la acción que te acerca a lo que de verdad quieres.', seconds: 12 },
    ],
  },
  'respiracion-478': {
    id: 'respiracion-478',
    name: 'Respiración 4-7-8',
    short: 'Inhala 4, sostén 7, exhala 8.',
    needs: ['ansiedad', 'enojo', 'impulso'],
    steps: [
      { text: 'Inhala por la nariz contando hasta 4.', seconds: 4 },
      { text: 'Sostén el aire contando hasta 7.', seconds: 7 },
      { text: 'Exhala por la boca, lento, contando hasta 8.', seconds: 8 },
      { text: 'Otra vez: inhala 4…', seconds: 4 },
      { text: 'Sostén 7…', seconds: 7 },
      { text: 'Exhala 8. Nota cómo baja la activación.', seconds: 8 },
    ],
  },
  'respiracion-cuadrada': {
    id: 'respiracion-cuadrada',
    name: 'Respiración cuadrada',
    short: 'Inhala 4, sostén 4, exhala 4, sostén 4.',
    needs: ['ansiedad', 'frustracion'],
    steps: [
      { text: 'Inhala contando hasta 4.', seconds: 4 },
      { text: 'Sostén contando hasta 4.', seconds: 4 },
      { text: 'Exhala contando hasta 4.', seconds: 4 },
      { text: 'Sostén vacío contando hasta 4.', seconds: 4 },
      { text: 'Repite: inhala 4, sostén 4…', seconds: 8 },
      { text: 'Exhala 4, sostén 4. Un lado del cuadrado a la vez.', seconds: 8 },
    ],
  },
  'contar-10': {
    id: 'contar-10',
    name: 'Contar hasta 10',
    short: 'Diez segundos entre sentir y actuar.',
    needs: ['enojo', 'impulso', 'conflicto'],
    steps: [
      { text: 'No respondas todavía. Cuenta despacio del 1 al 10, una respiración por número.', seconds: 20 },
      { text: '¿Sigues queriendo hacer lo mismo? Decide ahora, con un poco más de calma.', seconds: 10 },
    ],
  },
  'tiempo-fuera': {
    id: 'tiempo-fuera',
    name: 'Tiempo fuera',
    short: 'Alejarte un momento y volver con calma.',
    needs: ['enojo', 'conflicto'],
    steps: [
      { text: 'Di: «Necesito unos minutos, ya vuelvo». Es una pausa, no una huida.', seconds: 10 },
      { text: 'Aléjate de la situación. Camina, toma agua o mira por la ventana.', seconds: 30 },
      { text: 'Cuando bajes, piensa qué quieres decir. Luego vuelve a la conversación.', seconds: 15 },
    ],
  },
  surfear: {
    id: 'surfear',
    name: 'Surfear el impulso',
    short: 'Observa la ola de ganas hasta que baje.',
    needs: ['impulso', 'frustracion'],
    steps: [
      { text: '¿Dónde sientes las ganas en el cuerpo? ¿Pecho, manos, estómago?', seconds: 12 },
      { text: 'Imagina que es una ola. No la pelees ni la obedezcas: solo obsérvala.', seconds: 15 },
      { text: 'Respira con ella. Nota cómo sube… llega al pico…', seconds: 15 },
      { text: '…y empieza a bajar. Las olas siempre bajan.', seconds: 15 },
    ],
  },
  grounding: {
    id: 'grounding',
    name: 'Grounding 5-4-3-2-1',
    short: 'Vuelve al presente con tus sentidos.',
    needs: ['ansiedad', 'tristeza'],
    steps: [
      { text: 'Nombra 5 cosas que puedes ver.', seconds: 15 },
      { text: 'Nombra 4 cosas que puedes tocar.', seconds: 12 },
      { text: 'Nombra 3 cosas que puedes oír.', seconds: 10 },
      { text: 'Nombra 2 cosas que puedes oler.', seconds: 8 },
      { text: 'Nombra 1 cosa que puedes saborear.', seconds: 6 },
    ],
  },
  reestructuracion: {
    id: 'reestructuracion',
    name: 'Reestructuración cognitiva',
    short: 'Pensamiento → evidencia → alternativa.',
    needs: ['pensamientos', 'tristeza', 'frustracion'],
    steps: [
      { text: '¿Qué pensamiento te está pesando? Dilo en una frase.', seconds: 15 },
      { text: '¿Qué pruebas tienes a favor? ¿Y en contra?', seconds: 20 },
      { text: '¿Qué le dirías a un amigo que piensa lo mismo?', seconds: 15 },
      { text: 'Escribe un pensamiento alternativo, realista y amable.', seconds: 15 },
    ],
  },
  autoinstrucciones: {
    id: 'autoinstrucciones',
    name: 'Autoinstrucciones',
    short: 'Háblate con calma y en concreto.',
    needs: ['frustracion', 'ansiedad', 'impulso'],
    steps: [
      { text: 'Dite: «Estoy sintiendo esto, y está bien sentirlo».', seconds: 8 },
      { text: 'Dite: «Respira. Un paso a la vez».', seconds: 8 },
      { text: 'Dite: «¿Qué es lo siguiente pequeño que puedo hacer?»', seconds: 10 },
      { text: 'Dite: «Ya salí de cosas difíciles antes. Puedo con esto».', seconds: 8 },
    ],
  },
  problemas: {
    id: 'problemas',
    name: 'Solución de problemas',
    short: 'Cinco pasos para salir del bloqueo.',
    needs: ['frustracion', 'conflicto'],
    steps: [
      { text: '1 · Define el problema en una frase concreta.', seconds: 12 },
      { text: '2 · Piensa en todas las opciones que se te ocurran, sin juzgarlas.', seconds: 15 },
      { text: '3 · Evalúa: ¿qué ganas y qué pierdes con cada una?', seconds: 15 },
      { text: '4 · Elige una y decide el primer paso.', seconds: 10 },
      { text: '5 · Después, revisa cómo salió y ajusta.', seconds: 8 },
    ],
  },
  'regla-10': {
    id: 'regla-10',
    name: 'Regla de los 10 minutos',
    short: 'Espera 10 minutos antes de decidir.',
    needs: ['impulso'],
    steps: [
      { text: 'Anota qué quieres hacer. No lo hagas todavía.', seconds: 10 },
      { text: 'Haz otra cosa por 10 minutos: camina, toma agua, ordena algo. Puedes usar el Buzón de Impulsos.', seconds: 20 },
      { text: 'Cuando pasen, pregúntate: ¿todavía lo quiero? ¿Me conviene?', seconds: 10 },
    ],
  },
  relajacion: {
    id: 'relajacion',
    name: 'Relajación muscular progresiva',
    short: 'Tensa y suelta cada grupo de músculos.',
    needs: ['ansiedad', 'enojo', 'frustracion'],
    steps: [
      { text: 'Aprieta los puños fuerte… y suelta. Nota la diferencia.', seconds: 10 },
      { text: 'Sube los hombros a las orejas… y déjalos caer.', seconds: 10 },
      { text: 'Aprieta la mandíbula… y afloja.', seconds: 10 },
      { text: 'Tensa el abdomen… y suelta.', seconds: 10 },
      { text: 'Estira las piernas y aprieta los pies… y suelta todo.', seconds: 10 },
    ],
  },
  asertiva: {
    id: 'asertiva',
    name: 'Comunicación asertiva',
    short: 'Hecho, emoción y pedido, sin atacar.',
    needs: ['conflicto', 'enojo'],
    steps: [
      { text: 'Hecho: describe lo que pasó, sin adjetivos. «Cuando llegaste tarde…»', seconds: 12 },
      { text: 'Emoción: di cómo te sentiste. «…me sentí ignorado…»', seconds: 10 },
      { text: 'Pedido: di qué necesitas. «…la próxima, avísame, por favor».', seconds: 12 },
      { text: 'Respira y dilo con un tono tranquilo.', seconds: 8 },
    ],
  },
};

export function isTechniqueId(value: unknown): value is TechniqueId {
  return typeof value === 'string' && (TECHNIQUE_IDS as readonly string[]).includes(value);
}

/** Duración total aproximada de una técnica, en segundos. */
export function techniqueSeconds(id: TechniqueId): number {
  return TECHNIQUES[id].steps.reduce((total, step) => total + step.seconds, 0);
}
