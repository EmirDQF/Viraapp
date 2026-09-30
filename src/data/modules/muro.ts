import type { ModuleContent } from '@/types/content';

/** Muro de Evidencia · Sector 4 · Resiliencia: autoeficacia y memoria de superación. */
export const muro: ModuleContent = {
  id: 'muro',
  context: {
    title: 'El Contexto',
    situation: 'Primer día de prácticas: a Regi le dan una tarea que nunca ha hecho y siente que es un fraude.',
    options: [
      {
        label: 'Rendirse antes de intentarlo',
        outcome: 'Dice que no puede y la deja para otro. Se apaga y se encoge.',
        good: false,
        learning: 'El síndrome del impostor te hace olvidar lo que ya lograste.',
      },
      {
        label: 'Intentarlo un paso a la vez',
        outcome: 'Pregunta lo básico, empieza por una parte y avanza pese a la duda.',
        good: true,
        learning: 'La duda no desaparece antes de actuar: se reduce actuando.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'Llega una evaluación importante y Regi cree que "no va a poder".',
    options: [
      {
        label: 'Creer que no puede y rendirse',
        outcome: 'Pierde confianza y ni siquiera se presenta a la evaluación.',
        good: false,
        learning: 'Tus pensamientos no son hechos; tu historial sí lo es.',
      },
      {
        label: 'Abrir su Muro de Evidencia',
        outcome: 'Lee: "El ciclo pasado pudiste con esa entrega". Respira y se presenta.',
        good: true,
        learning: 'Tu evidencia propia pesa más que la duda del momento.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Te asignaron una tarea grande en tu primer trabajo o práctica y dudas de ti. ¿Qué ayuda más?', options: ['Recordar retos difíciles que ya superaste', 'Pensar que esos logros fueron suerte', 'Evitar el reto'], answer: 0, why: 'Tu historial demuestra tu capacidad.' },
      { prompt: '¿Qué es el síndrome del impostor?', options: ['Sentir que no mereces tus logros aunque tengas evidencia', 'Mentir sobre tus logros', 'Tener mucha confianza'], answer: 0, why: 'Es muy común, sobre todo en retos nuevos.' },
      { prompt: 'La autoeficacia es…', options: ['Confiar en tu capacidad de lograr algo', 'Hacer todo solo', 'Nunca equivocarte'], answer: 0, why: 'Crece cuando recuerdas lo que ya lograste.' },
      { prompt: '¿Por qué olvidamos nuestras victorias?', options: ['Porque la mente se enfoca más en las amenazas', 'Porque no fueron importantes', 'No las olvidamos'], answer: 0, why: 'Por eso ayuda registrarlas.' },
    ],
    [
      { prompt: 'Superaste una entrega muy difícil. ¿Cómo la registras?', options: ['La minimizo porque fue suerte', 'La guardo en el Muro como evidencia', 'La olvido'], answer: 1, why: 'Registrar el logro lo vuelve evidencia.' },
      { prompt: '¿Qué cuenta como evidencia de superación?', options: ['Un examen aprobado, una entrevista o un día difícil que pasaste', 'Solo los premios oficiales', 'Nada, si no fue perfecto'], answer: 0, why: 'Las pequeñas victorias también cuentan.' },
      { prompt: 'Atribuir tus logros solo a la suerte…', options: ['Te quita confianza para el siguiente reto', 'Te hace más humilde y seguro', 'No tiene efecto'], answer: 0, why: 'Reconocer tu esfuerzo te da base.' },
      { prompt: 'Recordar cómo superaste algo antes te ayuda a…', options: ['Tener estrategias para el reto actual', 'Vivir en el pasado', 'Presumir'], answer: 0, why: 'Tu historia es un manual de lo que funciona.' },
    ],
    [
      { prompt: 'Hoy dudas de ti antes de una entrevista o un examen. ¿Cuál es la evidencia más útil?', options: ['Un logro guardado en tu Muro, con lo que hiciste', 'Lo que creen los demás de ti', 'Recordar tu peor día'], answer: 0, why: 'La evidencia propia y concreta pesa más que la opinión.' },
      { prompt: 'Algo salió mal esta semana. ¿Borra tus logros anteriores?', options: ['No: un mal día no define tu historial', 'Sí, ya no cuentan', 'Solo los más recientes'], answer: 0, why: 'La evidencia se acumula, no se borra.' },
      { prompt: '¿Qué frase resume el Muro de Evidencia?', options: ['"Ya lo superé antes; hoy también puedo."', '"Fue pura suerte."', '"Mejor no intentar."'], answer: 0, why: 'Tu pasado te sostiene hoy.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena cómo un reto nuevo termina en rendición.',
    steps: ['Nuevo reto', 'Olvidar victorias', 'Inseguridad', 'Rendición'],
    insight: 'Recordar tus victorias justo al empezar el reto frena la inseguridad.',
  },
  swipe: {
    prompt: 'Desliza: ¿suerte o capacidad propia?',
    left: 'Fue suerte',
    right: 'Fue mi capacidad',
    cards: [
      { text: '"Aprobé porque el examen estaba fácil".', answer: 'left', why: 'Minimiza tu esfuerzo de estudio.' },
      { text: '"Aprobé porque estudié tres días".', answer: 'right', why: 'Reconoce lo que hiciste.' },
      { text: '"Me contrataron porque justo nadie más postuló".', answer: 'left', why: 'Te quita mérito sin evidencia.' },
      { text: '"Me eligieron porque preparé bien la entrevista".', answer: 'right', why: 'Es evidencia de tu capacidad.' },
      { text: '"Superé esa semana difícil pidiendo ayuda y organizándome".', answer: 'right', why: 'Eso son habilidades, no suerte.' },
      { text: '"Si salió bien, seguro fue casualidad".', answer: 'left', why: 'Es el síndrome del impostor hablando.' },
    ],
  },
  wordRain: {
    good: ['Evidencia', 'Logro', 'Superé', 'Capacidad', 'Confianza', 'Medalla', 'Historial', 'Constancia'],
    bad: ['Suerte', 'Impostor', 'No puedo', 'Fraude', 'Casualidad', 'Rendirme', 'Minimizar', 'Olvidar'],
    phrase: 'Ya lo superé antes; hoy también puedo.',
  },
  simulator: {
    kind: 'evidence-log',
    title: 'Registro de superación',
    intro: 'Guarda un examen, una entrega o un primer día que ya superaste. Se convertirá en una medalla.',
    placeholder: 'Ej.: aprobé el parcial de estadística',
    options: [],
    closing: 'Medalla guardada. Cuando dudes de ti, aquí está tu evidencia.',
  },
  wordSearch: {
    words: [
      { word: 'EVIDENCIA', clue: 'Prueba concreta de que puedes.' },
      { word: 'LOGRO', clue: 'Algo que conseguiste con esfuerzo.' },
      { word: 'MEDALLA', clue: 'Símbolo de una victoria.' },
      { word: 'CAPACIDAD', clue: 'Lo que tienes para enfrentar retos.' },
      { word: 'HISTORIAL', clue: 'Registro de lo que ya superaste.' },
      { word: 'CONFIANZA', clue: 'Lo que crece al recordar tus logros.' },
    ],
  },
  trap: {
    belief: 'Lo que logré antes no cuenta para hoy',
    turns: [
      {
        challenge: 'Esto es distinto. Que antes te fuera bien no significa nada ahora.',
        options: [
          { text: 'Las habilidades que usé antes siguen conmigo y me sirven ahora.', strength: 'strong', reply: 'Puede ser. ¿Pero y si esta vez es más difícil?' },
          { text: 'Algo cuenta, supongo.', strength: 'weak', reply: '¿Qué hiciste la última vez que te funcionó?' },
          { text: 'Sí, no cuenta.', strength: 'agree', reply: 'Si no contara, ¿cómo llegaste hasta aquí?' },
        ],
      },
      {
        challenge: 'Si es más difícil, seguro no vas a poder.',
        options: [
          { text: 'Antes también fue difícil y lo logré paso a paso; puedo hacerlo otra vez.', strength: 'strong', reply: 'Exacto: tu historial es tu mejor argumento.' },
          { text: 'No sé si pueda.', strength: 'weak', reply: 'No saber es normal. ¿Qué primer paso sí sabes dar?' },
          { text: 'Sí, no voy a poder.', strength: 'agree', reply: 'Eso dijiste antes de otros retos que sí superaste. ¿Recuerdas alguno?' },
        ],
      },
    ],
    closing: 'Tu historial es evidencia: lo que superaste antes te sostiene hoy.',
  },
  boss: {
    prompt: 'Crisis de confianza: ¿evidencia o suerte?',
    left: 'Evidencia',
    right: 'Suerte',
    seconds: 40,
    items: [
      { text: 'Aprobé porque estudié con constancia', answer: 'left' },
      { text: 'Seguro me regalaron la nota', answer: 'right' },
      { text: 'Terminé la entrega a tiempo organizándome', answer: 'left' },
      { text: 'Me eligieron por casualidad', answer: 'right' },
      { text: 'Superé una semana difícil pidiendo ayuda', answer: 'left' },
      { text: 'No cuenta porque fue fácil', answer: 'right' },
    ],
  },
  rewind: {
    summary: ['El síndrome del impostor olvida tus victorias.', 'Registra tus logros como evidencia.', 'Tu historial te sostiene en cada nuevo reto.'],
    reward: 'Final del recorrido: Regi brilla dorado. Maestría en resiliencia.',
  },
};
