import type { CrucibleCategory } from '../../types';

export const academicCrucible: CrucibleCategory = {
  id: 'academic',
  title: 'Crisis Académica',
  tagline: 'Cuando estudiar se vuelve una amenaza.',
  examples: ['Ansiedad ante exámenes', 'Bloqueo de tesis', 'Síndrome del impostor'],
  content: {
    diagnosis: {
      headline: 'Rendimiento bajo amenaza',
      body:
        'La ansiedad académica convierte cada examen o capítulo en un juicio sobre tu valor. El cerebro responde evitando la tarea, lo que alimenta la culpa y el bloqueo. Tu camino es separar tu identidad de tus notas, desmontar el "tengo que ser perfecto/a" y avanzar con bloques pequeños y concretos.',
    },
    sortCards: [
      { id: 'a1', text: 'Las preguntas que pondrá el profesor', zone: 'no-control', explanation: 'El contenido del examen no depende de ti; tu preparación sí.' },
      { id: 'a2', text: 'Estudiar 25 minutos sin el móvil', zone: 'control', explanation: 'Un bloque concreto de enfoque es totalmente tuyo.' },
      { id: 'a3', text: 'Lo que opine mi director/a de tesis', zone: 'no-control', explanation: 'Puedes pedir retroalimentación clara, pero no controlar su opinión.' },
      { id: 'a4', text: 'Escribir 150 palabras aunque sean malas', zone: 'control', explanation: 'Un borrador imperfecto es avance real.' },
      { id: 'a5', text: 'Las notas de mis compañeros', zone: 'no-control', explanation: 'Compararte no mejora tu aprendizaje.' },
      { id: 'a6', text: 'Pedir una tutoría o asesoría', zone: 'control', explanation: 'Buscar ayuda es una acción disponible hoy.' },
      { id: 'a7', text: 'Sentir nervios antes del examen', zone: 'no-control', explanation: 'Un poco de activación es normal; puedes regularla, no eliminarla.' },
      { id: 'a8', text: 'Dormir 7 horas la noche anterior', zone: 'control', explanation: 'El descanso mejora la memoria más que estudiar de madrugada.' },
    ],
    distortions: [
      {
        id: 'ad1',
        thought: 'Si repruebo este examen, se acaba mi carrera y mi futuro.',
        options: ['catastrophizing', 'personalization', 'mind-reading'],
        correct: 'catastrophizing',
        explanation: 'Un examen es un punto en un recorrido largo. Existen recuperaciones, segundas opciones y otros caminos.',
      },
      {
        id: 'ad2',
        thought: 'Todos en mi grupo saben que no merezco estar aquí.',
        options: ['mind-reading', 'overgeneralization', 'black-white'],
        correct: 'mind-reading',
        explanation: 'No tienes acceso a lo que piensan los demás. El síndrome del impostor se alimenta de suposiciones.',
      },
    ],
    reframe: {
      automaticThought: 'Soy un fraude; mi tesis nunca va a estar a la altura.',
      blocks: [
        { id: 'r1', text: 'Mi tesis está en proceso' },
        { id: 'r2', text: 'y todavía tiene fallos,' },
        { id: 'r3', text: 'como todo trabajo' },
        { id: 'r4', text: 'que se está construyendo.' },
        { id: 'x1', text: 'porque no soy inteligente' },
        { id: 'x2', text: 'y todos lo notarán.' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      explanation: 'Los borradores imperfectos son parte normal del proceso, no una prueba de que seas un fraude.',
    },
    mantras: [
      'Aprender es avanzar, no ser perfecto/a.',
      'Mi valor no es una calificación.',
      'Un párrafo a la vez.',
    ],
    microChallenges: [
      { id: 'amc1', title: 'Arranque de 2 minutos', description: 'Abre el documento y escribe una sola oración, sin editar.', durationSec: 120 },
      { id: 'amc2', title: 'Mapa de temas', description: 'Lista los 5 temas del examen y marca el que menos dominas.', durationSec: 120 },
      { id: 'amc3', title: 'Pregunta valiente', description: 'Redacta una duda concreta para tu profesor o director/a.', durationSec: 120 },
      { id: 'amc4', title: 'Escritorio limpio', description: 'Deja en tu mesa solo lo necesario para la próxima sesión.', durationSec: 120 },
    ],
    rules: [
      { id: 'ar1', text: 'No me comparo con otros la semana de exámenes.' },
      { id: 'ar2', text: 'Estudio en bloques con pausas, nunca de madrugada.' },
      { id: 'ar3', text: 'Un borrador malo vale más que una página en blanco.' },
      { id: 'ar4', text: 'Pido ayuda antes de llegar al límite.' },
      { id: 'ar5', text: 'Separo mi nota de mi valor como persona.' },
      { id: 'ar6', text: 'Celebro cada sesión de estudio terminada.' },
    ],
    weeklyActions: [
      'Haz un bloque Pomodoro de 25 minutos.',
      'Escribe 200 palabras de tu trabajo o resumen.',
      'Resuelve 5 ejercicios o preguntas de práctica.',
      'Consulta una duda con alguien que sepa del tema.',
      'Repasa en voz alta lo aprendido durante 10 minutos.',
      'Toma un descanso total de estudio: haz algo que te guste.',
      'Evalúa tu semana y planifica los 3 bloques siguientes.',
    ],
  },
};
