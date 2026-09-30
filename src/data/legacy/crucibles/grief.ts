import type { CrucibleCategory } from '@/types/legacy';

export const griefCrucible: CrucibleCategory = {
  id: 'grief',
  title: 'Duelo & Quiebre Emocional',
  tagline: 'Cuando algo o alguien que importaba ya no está.',
  examples: ['Rupturas amorosas', 'Pérdidas', 'Amistades que se alejan', 'Desapego'],
  content: {
    diagnosis: {
      headline: 'Un duelo que pide espacio, no prisa',
      body:
        'El dolor por una pérdida no es un error que corregir: es la medida de lo que te importaba. El sufrimiento crece cuando luchamos contra la emoción o nos culpamos por sentirla. Tu camino es aceptar la ola sin ahogarte en ella, cuestionar las historias que te cuentas sobre tu valor y reconstruir rutinas que te sostengan.',
    },
    sortCards: [
      { id: 'g1', text: 'Que mi ex me escriba o no', zone: 'no-control', explanation: 'Las decisiones de la otra persona no dependen de ti.' },
      { id: 'g2', text: 'Silenciar sus redes por un tiempo', zone: 'control', explanation: 'Proteger tu atención es un acto de autocuidado que puedes elegir.' },
      { id: 'g3', text: 'Sentir tristeza al ver una foto', zone: 'no-control', explanation: 'Las emociones llegan solas. Lo que controlas es cómo las acompañas.' },
      { id: 'g4', text: 'Llamar a un amigo cuando la noche se pone pesada', zone: 'control', explanation: 'Pedir apoyo es una acción concreta y disponible.' },
      { id: 'g5', text: 'Lo que piensen otros de la ruptura', zone: 'no-control', explanation: 'Las opiniones ajenas están fuera de tu alcance.' },
      { id: 'g6', text: 'Escribir lo que siento antes de dormir', zone: 'control', explanation: 'Poner en palabras la emoción reduce su intensidad.' },
      { id: 'g7', text: 'El tiempo que tarda en doler menos', zone: 'no-control', explanation: 'El duelo tiene su propio ritmo; forzarlo lo alarga.' },
      { id: 'g8', text: 'Mantener una rutina mínima de sueño y comida', zone: 'control', explanation: 'Cuidar lo básico le da a tu cuerpo base para procesar.' },
    ],
    distortions: [
      {
        id: 'gd1',
        thought: 'Me dejó porque no valgo nada; nadie me va a querer de verdad.',
        options: ['overgeneralization', 'catastrophizing', 'should-statements'],
        correct: 'overgeneralization',
        explanation: 'Una relación que termina no predice todas las relaciones futuras. "Nadie" y "nunca" son señales de sobregeneralización.',
      },
      {
        id: 'gd2',
        thought: 'Si me siento tan vacío/a, seguro es que arruiné mi vida.',
        options: ['mind-reading', 'emotional-reasoning', 'black-white'],
        correct: 'emotional-reasoning',
        explanation: 'El vacío es una emoción legítima, no una prueba de que tu vida esté arruinada.',
      },
    ],
    reframe: {
      automaticThought: 'Todo fue culpa mía; si hubiera sido diferente, seguiríamos juntos.',
      blocks: [
        { id: 'r1', text: 'La relación terminó' },
        { id: 'r2', text: 'por muchas causas compartidas,' },
        { id: 'r3', text: 'y puedo aprender de ella' },
        { id: 'r4', text: 'sin castigarme.' },
        { id: 'x1', text: 'porque siempre lo arruino' },
        { id: 'x2', text: 'y no merezco amor.' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      explanation: 'Asumir responsabilidad sana no es cargar con toda la culpa. El pensamiento realista reparte las causas.',
    },
    mantras: [
      'Puedo sentir esto y seguir de pie.',
      'Lo que amé me hizo más grande, no más pequeño.',
      'Las olas pasan; yo me quedo.',
    ],
    microChallenges: [
      { id: 'gmc1', title: 'Carta sin enviar', description: 'Escribe 3 líneas de lo que te gustaría decir. No la envíes.', durationSec: 120 },
      { id: 'gmc2', title: 'Mensaje de conexión', description: 'Escribe a alguien que te quiere solo para saludar.', durationSec: 120 },
      { id: 'gmc3', title: 'Paseo de dos minutos', description: 'Sal o camina por tu casa nombrando 5 cosas que ves.', durationSec: 120 },
      { id: 'gmc4', title: 'Limpieza simbólica', description: 'Guarda en una caja un objeto que hoy te duele ver.', durationSec: 120 },
    ],
    rules: [
      { id: 'gr1', text: 'No reviso sus redes cuando estoy triste.' },
      { id: 'gr2', text: 'No escribo mensajes importantes después de las 11 p.m.' },
      { id: 'gr3', text: 'Como y duermo aunque no tenga ganas.' },
      { id: 'gr4', text: 'Le cuento a alguien cómo estoy al menos una vez al día.' },
      { id: 'gr5', text: 'Me permito llorar sin pedirme perdón.' },
      { id: 'gr6', text: 'No tomo decisiones definitivas en la peor noche.' },
    ],
    weeklyActions: [
      'Escribe durante 5 minutos lo que extrañas y lo que no.',
      'Queda con una persona querida, aunque sea un café corto.',
      'Muévete 10 minutos: caminar, bailar o estirarte.',
      'Retoma una actividad que disfrutabas antes de la relación.',
      'Anota 3 cosas que hiciste bien hoy.',
      'Ordena un espacio pequeño de tu casa.',
      'Relee tu mantra y escribe cómo cambió tu semana.',
    ],
  },
};
