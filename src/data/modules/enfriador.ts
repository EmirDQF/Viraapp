import type { ModuleContent } from '@/types/content';

/** Enfriador de Dopamina · Sector 2 · Impulsos: postergar la gratificación y frenar el escapismo. */
export const enfriador: ModuleContent = {
  id: 'enfriador',
  context: {
    title: 'El Contexto',
    situation: 'Regi tiene que avanzar un trabajo, pero entra a redes "un ratito" para relajarse.',
    options: [
      {
        label: 'Seguir scrolleando "solo un poco más"',
        outcome: 'El ratito se vuelve 3 horas. Termina agotado y con el trabajo sin empezar.',
        good: false,
        learning: 'El alivio rápido de las redes posterga la tarea y suma culpa y cansancio.',
      },
      {
        label: 'Dejar el celular y empezar por un paso pequeño',
        outcome: 'Pone el celular en otra habitación y abre el documento. En 10 minutos ya avanzó.',
        good: true,
        learning: 'Empezar pequeño rompe la inercia mejor que esperar a tener ganas.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'Regi está ansioso y ve unos audífonos caros en oferta a las 2 AM.',
    options: [
      {
        label: 'Comprarlos ya, antes de que se acabe la oferta',
        outcome: 'Los compra. Al día siguiente siente culpa y revisa su cuenta con preocupación.',
        good: false,
        learning: 'Comprar para calmar la ansiedad da alivio corto y arrepentimiento largo.',
      },
      {
        label: 'Anotarlo en el buzón de impulsos y esperar',
        outcome: 'Lo anota y espera 20 minutos. El impulso baja y decide que no lo necesita.',
        good: true,
        learning: 'Esperar no prohíbe comprar: te deja decidir con la cabeza fría.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Sientes ganas de comprar algo caro por ansiedad. ¿Mejor primera acción?', options: ['Comprarlo antes de que se agote', 'Anotarlo y esperar 20 minutos', 'Comprarlo y devolverlo después'], answer: 1, why: 'Esperar enfría el impulso.' },
      { prompt: '¿Qué es un impulso?', options: ['Una necesidad urgente que hay que atender ya', 'Un deseo intenso que suele bajar si esperas', 'Una decisión bien pensada'], answer: 1, why: 'Los impulsos suben rápido y bajan solos si les das tiempo.' },
      { prompt: '¿Por qué la "oferta por tiempo limitado" funciona tan bien?', options: ['Porque crea urgencia y te hace decidir sin pensar', 'Porque siempre es buen precio', 'Porque es obligatoria'], answer: 0, why: 'La urgencia artificial apaga la pausa.' },
      { prompt: 'Escapar a las redes cuando estás estresado…', options: ['Resuelve el estrés', 'Alivia un rato pero posterga el problema', 'No tiene efecto'], answer: 1, why: 'El alivio es real, pero corto.' },
    ],
    [
      { prompt: '¿Por qué scrollear redes estresado no soluciona el problema?', options: ['Porque las redes son malas', 'Porque solo posterga la tarea y suma culpa y cansancio', 'Porque gasta batería'], answer: 1, why: 'Alivia un rato, pero el problema sigue.' },
      { prompt: '¿Qué es postergar la gratificación?', options: ['Nunca darte gustos', 'Elegir esperar algo mejor en vez de un alivio inmediato', 'Comprar en cuotas'], answer: 1, why: 'Esperar te da más control y mejores decisiones.' },
      { prompt: 'Un buen truco contra el scroll infinito es…', options: ['Poner el celular fuera de tu alcance mientras estudias', 'Prometer que será "solo un ratito"', 'Usarlo en modo oscuro'], answer: 0, why: 'Reducir la fricción del hábito sano ayuda más que la fuerza de voluntad.' },
      { prompt: '¿Qué emoción suele esconderse detrás de un impulso?', options: ['Ansiedad, aburrimiento o cansancio', 'Siempre alegría', 'Ninguna'], answer: 0, why: 'Reconocer la emoción te ayuda a atenderla de otra forma.' },
    ],
    [
      { prompt: 'Pasaron los 20 minutos y todavía quieres comprarlo. ¿Qué haces?', options: ['Comprarlo sin pensar más', 'Preguntarte si es necesidad o alivio, revisar presupuesto y decidir con calma', 'Buscar uno más caro'], answer: 1, why: 'Esperar no prohíbe comprar: te deja decidir con la cabeza fría.' },
      { prompt: 'Son las 2 AM y quieres pedir comida aunque ya cenaste. ¿Qué te ayuda?', options: ['Tomar agua y esperar un rato', 'Pedir doble para no quedarte con ganas', 'Pedirla para no pensar'], answer: 0, why: 'Una pausa pequeña distingue hambre de antojo.' },
      { prompt: 'Te das cuenta de que llevas 2 horas en videos. ¿Qué haces sin culparte?', options: ['Seguir porque "ya perdí el día"', 'Cerrar la app y elegir una tarea de 5 minutos', 'Castigarte sin descanso'], answer: 1, why: 'Volver a empezar pequeño vale más que la culpa.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena la cadena del impulso.',
    steps: ['Ansiedad', 'Alivio rápido', 'Acción impulsiva', 'Culpa'],
    insight: 'Si pones una pausa entre la ansiedad y el alivio rápido, la cadena se corta.',
  },
  swipe: {
    prompt: 'Desliza: ¿ceder al impulso o postergarlo?',
    left: 'Ceder',
    right: 'Postergar',
    cards: [
      { text: 'Comprar unos audífonos a las 2 AM porque están "en oferta".', answer: 'left', why: 'Decidir de madrugada y con urgencia suele terminar en arrepentimiento.' },
      { text: 'Anotar lo que quieres comprar y revisarlo mañana.', answer: 'right', why: 'Postergar te deja decidir con calma.' },
      { text: 'Abrir redes "un ratito" antes de estudiar.', answer: 'left', why: 'El ratito suele alargarse.' },
      { text: 'Poner un temporizador de 20 minutos antes de pedir comida.', answer: 'right', why: 'La pausa distingue antojo de necesidad.' },
      { text: 'Dejar el celular en otra habitación mientras haces tu tarea.', answer: 'right', why: 'Alejar la tentación reduce la lucha.' },
      { text: 'Ver un episodio más aunque mañana tengas clase temprano.', answer: 'left', why: 'El alivio de hoy es el cansancio de mañana.' },
    ],
  },
  wordRain: {
    good: ['Esperar', 'Pausa', '20 minutos', 'Anotar', 'Presupuesto', 'Paciencia', 'Meta', 'Calma'],
    bad: ['Ya mismo', 'Oferta limitada', 'Solo un ratito', 'Scroll infinito', 'Comprar', 'Escapar', 'Antojo', 'Culpa'],
    phrase: 'El impulso pasa; mi decisión se queda.',
  },
  simulator: {
    kind: 'impulse-timer',
    title: 'Buzón virtual de impulsos',
    intro: 'Anota el impulso. En el juego, cada segundo representa un minuto: espera 20 y decide.',
    placeholder: 'Ej.: comprar unas zapatillas nuevas',
    options: [],
    closing: 'Lo lograste: esperaste y decidiste tú, no el impulso.',
  },
  wordSearch: {
    words: [
      { word: 'IMPULSO', clue: 'Deseo intenso que suele bajar si esperas.' },
      { word: 'ESPERAR', clue: 'Darle tiempo al impulso para que se enfríe.' },
      { word: 'PAUSA', clue: 'El espacio entre sentir y actuar.' },
      { word: 'BUZON', clue: 'Donde anotas un impulso para revisarlo luego.' },
      { word: 'PACIENCIA', clue: 'Capacidad de esperar sin desesperarte.' },
      { word: 'ANTOJO', clue: 'Ganas repentinas que no son necesidad.' },
    ],
  },
  trap: {
    belief: 'Escapar siempre me alivia',
    turns: [
      {
        challenge: 'Cuando estás estresado, lo mejor es desconectarte con redes o series. Te alivia, ¿no?',
        options: [
          { text: 'Me alivia un rato, pero después el problema sigue y me siento peor.', strength: 'strong', reply: 'Interesante. ¿Pero no merezco un descanso cuando estoy cansado?' },
          { text: 'A veces sí me alivia.', strength: 'weak', reply: '¿Y cómo te sientes una hora después de haber escapado?' },
          { text: 'Sí, escapar siempre ayuda.', strength: 'agree', reply: '¿Siempre? Piensa en la última vez que "un ratito" se volvió toda la noche.' },
        ],
      },
      {
        challenge: 'Descansar y escapar son lo mismo.',
        options: [
          { text: 'Descansar me recarga; escapar me hace evitar lo pendiente y termino más cansado.', strength: 'strong', reply: 'Buena diferencia. ¿Cómo sabrías cuál estás haciendo?' },
          { text: 'Son parecidos.', strength: 'weak', reply: 'Una pista: después de descansar, ¿te sientes con más o con menos energía?' },
          { text: 'Sí, es lo mismo.', strength: 'agree', reply: 'Si fuera lo mismo, no quedaría culpa después. ¿Queda?' },
        ],
      },
    ],
    closing: 'Descansar es válido; escapar siempre deja el problema esperando.',
  },
  boss: {
    prompt: 'Clasifica rápido: ¿necesidad o impulso?',
    left: 'Necesidad',
    right: 'Impulso',
    seconds: 40,
    items: [
      { text: 'Comprar el cargador que se malogró', answer: 'left' },
      { text: 'Comprar otra polera igual por la oferta', answer: 'right' },
      { text: 'Pedir delivery a las 3 AM después de cenar', answer: 'right' },
      { text: 'Pagar el pasaje para ir a clases', answer: 'left' },
      { text: 'Revisar redes "solo un segundo" en plena tarea', answer: 'right' },
      { text: 'Comprar los materiales del curso', answer: 'left' },
    ],
  },
  rewind: {
    summary: ['Un impulso no es una necesidad.', 'Anotar y esperar 20 minutos enfría la decisión.', 'Descansar no es lo mismo que escapar.'],
    reward: 'Regi suelta el celular y se relaja en un morado tranquilo.',
  },
};
