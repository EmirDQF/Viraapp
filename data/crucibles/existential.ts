import type { CrucibleCategory } from '../../types';

export const existentialCrucible: CrucibleCategory = {
  id: 'existential',
  title: 'Desconexión Existencial',
  tagline: 'Cuando nada parece tener sentido o dirección.',
  examples: ['Parálisis por análisis', 'Falta de propósito', 'Fatiga por redes'],
  content: {
    diagnosis: {
      headline: 'Brújula apagada por exceso de ruido',
      body:
        'La desconexión aparece cuando hay demasiadas opciones, demasiada comparación y poca acción alineada con lo que valoras. Pensar más no enciende el propósito: lo enciende hacer algo pequeño que importe. Tu camino es aclarar tus valores, soltar la búsqueda de la decisión perfecta y moverte hacia ellos con micro-pasos.',
    },
    sortCards: [
      { id: 'x1', text: 'La vida que muestran otros en redes', zone: 'no-control', explanation: 'Ves un recorte editado; no controlas ni eso ni su realidad.' },
      { id: 'x2', text: 'Limitar mi tiempo de scroll a 20 minutos', zone: 'control', explanation: 'Configurar un límite de uso es una decisión tuya.' },
      { id: 'x3', text: 'Encontrar "la" pasión definitiva', zone: 'no-control', explanation: 'El propósito se construye actuando, no aparece de golpe.' },
      { id: 'x4', text: 'Probar una actividad nueva esta semana', zone: 'control', explanation: 'Explorar es la forma práctica de descubrir qué te importa.' },
      { id: 'x5', text: 'Que todos entiendan mis decisiones', zone: 'no-control', explanation: 'Los demás interpretarán según su propia historia.' },
      { id: 'x6', text: 'Escribir mis 3 valores principales', zone: 'control', explanation: 'Nombrar lo que valoras orienta tus próximas decisiones.' },
      { id: 'x7', text: 'El rumbo de la economía o el mundo', zone: 'no-control', explanation: 'Es real que preocupa, pero está fuera de tu alcance directo.' },
      { id: 'x8', text: 'Dedicar 15 minutos a algo que me importa', zone: 'control', explanation: 'Pequeñas dosis de sentido son acciones que eliges.' },
    ],
    distortions: [
      {
        id: 'xd1',
        thought: 'Si no elijo el camino perfecto, habré desperdiciado mi vida.',
        options: ['black-white', 'catastrophizing', 'personalization'],
        correct: 'black-white',
        explanation: 'No existe un único camino perfecto; hay muchos caminos valiosos que se ajustan con el tiempo.',
      },
      {
        id: 'xd2',
        thought: 'Todos a mi edad ya tienen su vida resuelta menos yo.',
        options: ['overgeneralization', 'emotional-reasoning', 'should-statements'],
        correct: 'overgeneralization',
        explanation: '"Todos" es una generalización basada en lo que ves en redes, no en datos reales.',
      },
    ],
    reframe: {
      automaticThought: 'No sé qué quiero en la vida, así que no vale la pena hacer nada.',
      blocks: [
        { id: 'r1', text: 'No necesito tener todo claro' },
        { id: 'r2', text: 'para dar un paso' },
        { id: 'r3', text: 'hacia algo' },
        { id: 'r4', text: 'que hoy me importa.' },
        { id: 'y1', text: 'porque estoy perdido/a' },
        { id: 'y2', text: 'y siempre lo estaré.' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      explanation: 'La claridad llega actuando. Un paso pequeño alineado con tus valores vale más que esperar certeza.',
    },
    mantras: [
      'La claridad llega caminando.',
      'Hoy elijo lo que importa, no lo perfecto.',
      'Estoy construyendo mi sentido, no buscándolo.',
    ],
    microChallenges: [
      { id: 'xmc1', title: 'Brújula de valores', description: 'Escribe 3 palabras que describan la persona que quieres ser.', durationSec: 120 },
      { id: 'xmc2', title: 'Desintoxicación exprés', description: 'Deja de seguir 3 cuentas que te hacen sentir peor.', durationSec: 120 },
      { id: 'xmc3', title: 'Decisión mínima', description: 'Elige ahora una opción que llevas días postergando, aunque sea pequeña.', durationSec: 120 },
      { id: 'xmc4', title: 'Presencia plena', description: 'Haz una tarea cotidiana (lavar una taza) prestando atención total.', durationSec: 120 },
    ],
    rules: [
      { id: 'xr1', text: 'No abro redes en la primera hora del día.' },
      { id: 'xr2', text: 'Cuando dudo, elijo la opción que puedo probar esta semana.' },
      { id: 'xr3', text: 'No me comparo con vidas editadas.' },
      { id: 'xr4', text: 'Hago algo con las manos cada día.' },
      { id: 'xr5', text: 'Doy un límite de tiempo a cada decisión.' },
      { id: 'xr6', text: 'Conecto con una persona real antes que con una pantalla.' },
    ],
    weeklyActions: [
      'Escribe tus 3 valores y un ejemplo de cada uno.',
      'Prueba una actividad nueva de menos de 30 minutos.',
      'Pasa una tarde sin redes sociales.',
      'Conversa con alguien sobre qué le da sentido a su vida.',
      'Ayuda a alguien con algo pequeño.',
      'Toma una decisión pendiente con un límite de 10 minutos.',
      'Revisa: ¿qué acción de la semana te hizo sentir más tú?',
    ],
  },
};
