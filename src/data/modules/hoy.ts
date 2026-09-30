import type { ModuleContent } from '@/types/content';

/** Hoy en Fácil · Sector 3 · Estrategia: organización y micropasos. */
export const hoy: ModuleContent = {
  id: 'hoy',
  context: {
    title: 'El Contexto',
    situation: 'Regi abre su lista: 15 pendientes para esta semana. Siente que no sabe por dónde empezar.',
    options: [
      {
        label: 'Abrir todos los proyectos a la vez',
        outcome: 'Salta de uno a otro sin terminar ninguno. Se llena de pendientes y se paraliza.',
        good: false,
        learning: 'La multitarea sobrecarga la mente y frena el avance.',
      },
      {
        label: 'Elegir 3 claves y empezar por lo más pequeño',
        outcome: 'Elige tres, divide la primera en micropasos y en media hora ya avanzó.',
        good: true,
        learning: 'Tres tareas bien elegidas rinden más que quince a la vez.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'Al día siguiente Regi vuelve a mirar la lista completa y se bloquea otra vez.',
    options: [
      {
        label: 'Mirar toda la lista y agobiarse',
        outcome: 'La lista entera lo abruma y deja todo para mañana.',
        good: false,
        learning: 'Mirar todo a la vez hace que todo parezca imposible.',
      },
      {
        label: 'Enfocarse solo en el primer micropaso',
        outcome: 'Abre el documento y escribe el título. La inercia empieza a jugar a su favor.',
        good: true,
        learning: 'Lo pequeño que empiezas vale más que lo grande que esperas.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Tienes 15 pendientes urgentes. ¿Qué haces?', options: ['Empiezo todos a la vez', 'Elijo 3 clave y las divido en micropasos', 'Espero a sentirme motivado'], answer: 1, why: 'Menos tareas, más pequeñas, se completan.' },
      { prompt: '¿Qué es un micropaso?', options: ['Una tarea tan pequeña que puedes empezarla ya', 'Una tarea sin importancia', 'Un proyecto completo'], answer: 0, why: 'Es el primer movimiento concreto y fácil.' },
      { prompt: '¿Por qué la multitarea agota?', options: ['Porque el cerebro pierde energía al cambiar de tarea', 'Porque es más rápida', 'No agota'], answer: 0, why: 'Cada cambio tiene un costo mental.' },
      { prompt: '¿Qué suele llegar primero, la motivación o la acción?', options: ['La motivación siempre', 'Muchas veces la acción trae la motivación', 'Ninguna'], answer: 1, why: 'Empezar pequeño despierta las ganas.' },
    ],
    [
      { prompt: '¿Cuál es un micropaso bien planteado?', options: ['Hacer el proyecto final', 'Abrir el documento y escribir el título', 'Terminar toda la investigación'], answer: 1, why: 'Es concreto y toma un minuto.' },
      { prompt: '¿Cómo eliges tus 3 tareas del día?', options: ['Las más importantes o con fecha cercana', 'Las más divertidas', 'Al azar'], answer: 0, why: 'Priorizar reduce la carga mental.' },
      { prompt: 'Una lista corta ayuda porque…', options: ['Se ve alcanzable y te da victorias', 'Es más bonita', 'Obliga a trabajar más'], answer: 0, why: 'Tachar algo motiva a seguir.' },
      { prompt: 'Buscar la perfección antes de empezar suele…', options: ['Retrasar el inicio', 'Mejorar siempre el resultado', 'Ahorrar tiempo'], answer: 0, why: 'Empieza imperfecto, mejora después.' },
    ],
    [
      { prompt: 'Tu primer micropaso te tomó 2 minutos. ¿Qué sigue?', options: ['Pasar al siguiente micropaso de la misma tarea', 'Abrir las 15 tareas para ver cuál sigue', 'Descansar el resto del día'], answer: 0, why: 'La inercia trabaja a tu favor: sigue con lo pequeño.' },
      { prompt: 'No lograste las 3 tareas hoy. ¿Cómo lo tomas?', options: ['Como prueba de que no sirvo', 'Reviso qué avancé y ajusto para mañana', 'Dejo de hacer listas'], answer: 1, why: 'Avanzar algo ya es una victoria.' },
      { prompt: '¿Qué tarea convendría dividir primero?', options: ['La que más te intimida', 'La más fácil', 'La que no tiene fecha'], answer: 0, why: 'Dividir lo que asusta lo vuelve manejable.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena cómo una meta gigante termina en procrastinación.',
    steps: ['Meta gigante', 'Sobrecarga', 'Parálisis', 'Procrastinación'],
    insight: 'Dividir la meta en micropasos evita la sobrecarga desde el inicio.',
  },
  swipe: {
    prompt: 'Desliza: ¿tarea abrumadora o micropaso accionable?',
    left: 'Abrumadora',
    right: 'Micropaso',
    cards: [
      { text: '"Hacer toda la tesis".', answer: 'left', why: 'Es demasiado grande para empezar.' },
      { text: '"Escribir tres ideas para la introducción".', answer: 'right', why: 'Es concreto y corto.' },
      { text: '"Ordenar toda mi vida".', answer: 'left', why: 'No sabrías por dónde empezar.' },
      { text: '"Guardar la ropa que está en la silla".', answer: 'right', why: 'Se hace en minutos.' },
      { text: '"Buscar dos fuentes para el trabajo".', answer: 'right', why: 'Es un paso claro.' },
      { text: '"Aprender inglés este mes".', answer: 'left', why: 'Mejor: "practicar 10 minutos hoy".' },
    ],
  },
  wordRain: {
    good: ['Micropaso', 'Prioridad', 'Tres tareas', 'Empezar', 'Lista corta', 'Enfocar', 'Dividir', 'Avance'],
    bad: ['Todo a la vez', 'Multitarea', 'Perfección', 'Después', 'Mañana', 'Caos', 'Abrumar', 'Postergar'],
    phrase: 'Lo pequeño que empiezo vale más que lo grande que espero.',
  },
  simulator: {
    kind: 'micro-steps',
    title: 'Tus 3 tareas de hoy',
    intro: 'Elige 3 tareas y pulsa "Desglosar" para convertirlas en micropasos diminutos.',
    placeholder: '',
    options: [
      { label: 'Trabajo de la universidad', detail: 'Abrir el documento · Escribir el título · Anotar 3 ideas' },
      { label: 'Estudiar para el examen', detail: 'Elegir un tema · Leer 2 páginas · Hacer 3 preguntas de repaso' },
      { label: 'Ordenar mi cuarto', detail: 'Guardar la ropa de la silla · Botar papeles · Tender la cama' },
      { label: 'Buscar prácticas', detail: 'Actualizar una línea del CV · Buscar 2 ofertas · Guardar una' },
      { label: 'Responder correos', detail: 'Abrir la bandeja · Responder el más corto · Archivar 5' },
    ],
    closing: 'Ya tienes tu primer micropaso. Empieza por el más pequeño.',
  },
  wordSearch: {
    words: [
      { word: 'MICROPASO', clue: 'Una tarea tan pequeña que la empiezas ya.' },
      { word: 'PRIORIDAD', clue: 'Lo que va primero.' },
      { word: 'ENFOQUE', clue: 'Atención en una sola cosa.' },
      { word: 'DIVIDIR', clue: 'Partir algo grande en partes pequeñas.' },
      { word: 'AVANCE', clue: 'Cada paso que te acerca a la meta.' },
      { word: 'PLAN', clue: 'Tu mapa para el día.' },
    ],
  },
  trap: {
    belief: 'Hacer 15 tareas de golpe es más productivo',
    turns: [
      {
        challenge: 'Si haces todo a la vez, terminas más rápido. ¿Para qué ir de a una?',
        options: [
          { text: 'Cambiar de tarea todo el tiempo me hace perder energía y termino menos.', strength: 'strong', reply: 'Puede ser. ¿Pero no se acumula el resto mientras haces una?' },
          { text: 'A veces sí me funciona.', strength: 'weak', reply: '¿Cuántas de esas 15 terminaste la última vez?' },
          { text: 'Sí, multitarea es lo mejor.', strength: 'agree', reply: 'La mente no hace dos cosas complejas a la vez: salta entre ellas y se cansa.' },
        ],
      },
      {
        challenge: 'Tres tareas al día es muy poco.',
        options: [
          { text: 'Tres bien terminadas avanzan más que quince empezadas.', strength: 'strong', reply: 'Exacto: lo terminado cuenta más que lo iniciado.' },
          { text: 'Tal vez podría hacer cinco.', strength: 'weak', reply: 'Puede ser. Empieza con tres y, si sobra tiempo, agrega.' },
          { text: 'Sí, es poco.', strength: 'agree', reply: 'Poco pero hecho vale más que mucho pendiente.' },
        ],
      },
    ],
    closing: 'Menos tareas, más pequeñas, se terminan.',
  },
  boss: {
    prompt: 'Filtro táctico: ¿micropaso o tarea gigante?',
    left: 'Micropaso',
    right: 'Tarea gigante',
    seconds: 40,
    items: [
      { text: 'Leer una página del libro', answer: 'left' },
      { text: 'Terminar el curso completo', answer: 'right' },
      { text: 'Anotar la fecha del examen', answer: 'left' },
      { text: 'Organizar todo el semestre', answer: 'right' },
      { text: 'Enviar un correo al profesor', answer: 'left' },
      { text: 'Cambiar todos mis hábitos', answer: 'right' },
    ],
  },
  rewind: {
    summary: ['Elige 3 tareas clave.', 'Divide cada una en micropasos.', 'Empieza por lo más pequeño: la inercia hace el resto.'],
    reward: 'Regi avanza sin fricción en un entorno verde.',
  },
};
