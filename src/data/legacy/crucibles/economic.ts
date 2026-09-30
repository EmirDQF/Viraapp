import type { CrucibleCategory } from '@/types/legacy';

export const economicCrucible: CrucibleCategory = {
  id: 'economic',
  title: 'Presión Económica',
  tagline: 'Cuando el dinero ocupa todo el espacio mental.',
  examples: ['Deudas', 'Ingresos inciertos', 'Comparación salarial', 'Estrés financiero'],
  content: {
    diagnosis: {
      headline: 'Escasez que secuestra la atención',
      body:
        'La presión financiera sostenida estrecha el foco mental ("efecto túnel"): todo gira alrededor de la próxima cuenta y se pierde perspectiva para planificar. No es falta de disciplina; es un cerebro en modo amenaza. Tu trabajo es separar lo que depende de ti, desactivar la narrativa catastrófica y recuperar tracción con pasos pequeños y medibles.',
    },
    sortCards: [
      { id: 'e1', text: 'La tasa de interés que fija el banco', zone: 'no-control', explanation: 'Las tasas las define el mercado. Puedes comparar o renegociar, pero no fijarlas.' },
      { id: 'e2', text: 'Revisar mis gastos de la última semana', zone: 'control', explanation: 'Mirar tus números es una acción concreta y 100% tuya.' },
      { id: 'e3', text: 'La inflación del país', zone: 'no-control', explanation: 'Es un fenómeno macroeconómico. Tu energía rinde más en tu presupuesto.' },
      { id: 'e4', text: 'Pedir un plan de pagos a mi acreedor', zone: 'control', explanation: 'Llamar y negociar está en tus manos, aunque la respuesta no lo esté.' },
      { id: 'e5', text: 'Cuánto gana mi excompañero de universidad', zone: 'no-control', explanation: 'Compararte consume energía sin cambiar tu situación.' },
      { id: 'e6', text: 'Cancelar una suscripción que no uso', zone: 'control', explanation: 'Una micro-decisión que libera dinero hoy mismo.' },
      { id: 'e7', text: 'Si me aprueban o no el aumento', zone: 'no-control', explanation: 'La decisión es de otros. Lo tuyo es preparar bien tu argumento.' },
      { id: 'e8', text: 'Aprender una habilidad que suba mis ingresos', zone: 'control', explanation: 'Invertir en ti es una palanca que controlas a mediano plazo.' },
    ],
    distortions: [
      {
        id: 'ed1',
        thought: 'Si no pago esta cuota a tiempo, voy a perderlo todo y terminaré en la calle.',
        options: ['catastrophizing', 'mind-reading', 'personalization'],
        correct: 'catastrophizing',
        explanation: 'Un retraso tiene consecuencias reales pero acotadas (recargos, llamadas). Saltar a "perderlo todo" es catastrofismo.',
      },
      {
        id: 'ed2',
        thought: 'O ahorro el 30% de mi sueldo o no tiene sentido ahorrar nada.',
        options: ['should-statements', 'black-white', 'overgeneralization'],
        correct: 'black-white',
        explanation: 'Ahorrar un 3% también construye un hábito. El "todo o nada" te deja en nada.',
      },
    ],
    reframe: {
      automaticThought: 'Nunca voy a salir de estas deudas; soy un desastre con el dinero.',
      blocks: [
        { id: 'r1', text: 'Tengo deudas' },
        { id: 'r2', text: 'que puedo dividir en pagos,' },
        { id: 'r3', text: 'y hoy puedo dar' },
        { id: 'r4', text: 'un primer paso concreto.' },
        { id: 'x1', text: 'porque soy un fracaso' },
        { id: 'x2', text: 'y nada va a cambiar.' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      explanation: 'El pensamiento realista reconoce el problema sin convertirlo en una etiqueta sobre tu identidad.',
    },
    mantras: [
      'Mi valor no cabe en mi saldo.',
      'Paso a paso, número a número.',
      'Lo que controlo hoy es suficiente para empezar.',
    ],
    microChallenges: [
      { id: 'emc1', title: 'Foto de tus números', description: 'Abre tu app bancaria y anota tu saldo real sin juzgarlo.', durationSec: 120 },
      { id: 'emc2', title: 'Caza una fuga', description: 'Identifica un gasto recurrente que puedas pausar este mes.', durationSec: 120 },
      { id: 'emc3', title: 'Borrador de llamada', description: 'Escribe 3 frases para pedir un plan de pagos a un acreedor.', durationSec: 120 },
      { id: 'emc4', title: 'Micro-ahorro', description: 'Transfiere una cantidad simbólica (aunque sea mínima) a un sobre de ahorro.', durationSec: 120 },
    ],
    rules: [
      { id: 'er1', text: 'No reviso redes sociales cuando me siento pobre.' },
      { id: 'er2', text: 'No tomo decisiones financieras grandes el mismo día que me angustio.' },
      { id: 'er3', text: 'Miro mis números una vez al día, no veinte.' },
      { id: 'er4', text: 'Hablo de dinero con una persona de confianza cada semana.' },
      { id: 'er5', text: 'Celebro cada pago hecho, por pequeño que sea.' },
      { id: 'er6', text: 'Duermo antes de comprar cualquier cosa no esencial.' },
    ],
    weeklyActions: [
      'Registra todos tus gastos del día en una nota.',
      'Lista tus deudas de menor a mayor monto.',
      'Pausa una suscripción o gasto hormiga.',
      'Envía un mensaje para negociar una fecha o cuota.',
      'Prepara una comida en casa y anota lo que ahorraste.',
      'Investiga 15 minutos una fuente de ingreso extra.',
      'Revisa la semana: ¿qué pequeño avance lograste?',
    ],
  },
};
