import type { ModuleContent } from '@/types/content';

/** Círculo Ancla · Sector 4 · Resiliencia: red de apoyo y pedir ayuda. */
export const ancla: ModuleContent = {
  id: 'ancla',
  context: {
    title: 'El Contexto',
    situation: 'Regi está en una crisis antes de una entrega importante y no quiere molestar a nadie.',
    options: [
      {
        label: 'Aislarse hasta que pase',
        outcome: 'Se encierra solo. Pierde perspectiva y la ansiedad empeora.',
        good: false,
        learning: 'El aislamiento hace que todo se vea más grande de lo que es.',
      },
      {
        label: 'Escribir en el chat de sus amigos',
        outcome: 'Manda un mensaje corto a sus panas. Le responden y la tensión baja.',
        good: true,
        learning: 'Pedir apoyo a tiempo y sin dramatismo es una fortaleza.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'Otra semana difícil. Regi siente que ya pidió ayuda antes y que ahora sería "demasiado".',
    options: [
      {
        label: 'Callarse y aguantar solo',
        outcome: 'La soledad crece y el problema se hace más pesado.',
        good: false,
        learning: 'Las redes de apoyo existen para usarse más de una vez.',
      },
      {
        label: 'Enviar la alerta prediseñada a su círculo',
        outcome: 'Envía "Ando saturado, ¿tienes 5 min?". Un amigo lo llama y se siente acompañado.',
        good: true,
        learning: 'Tener más de un ancla evita quedarte solo.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Estás muy ansioso y solo antes de un parcial o una entrega. ¿Qué es mejor?', options: ['Aislarte hasta que pase', 'Enviar un mensaje corto y directo a alguien de confianza', 'Publicar una indirecta en redes'], answer: 1, why: 'Es directo, breve y llega a quien puede ayudar.' },
      { prompt: '¿Qué es un "círculo ancla"?', options: ['Las personas de confianza a las que puedes acudir', 'Un grupo de estudio obligatorio', 'Tus seguidores en redes'], answer: 0, why: 'Son tu red de apoyo cercana.' },
      { prompt: '¿Por qué aislarse empeora la ansiedad?', options: ['Porque pierdes otras perspectivas', 'Porque descansas más', 'No la empeora'], answer: 0, why: 'Otras miradas ponen las cosas en proporción.' },
      { prompt: 'Pedir ayuda a tiempo es…', options: ['Una fortaleza', 'Un fracaso', 'Una molestia para los demás'], answer: 0, why: 'Actuar antes de desbordarte es cuidarte.' },
    ],
    [
      { prompt: '¿Cuál es una forma sana de pedir ayuda?', options: ['"Ando saturado, ¿tienes 5 min para hablar?"', '"Nadie me entiende, mejor olvídalo"', 'No decir nada y esperar que lo noten'], answer: 0, why: 'Es claro y sin dramatismo.' },
      { prompt: '¿Por qué las indirectas no suelen funcionar?', options: ['Porque nadie sabe qué necesitas', 'Porque son muy claras', 'Siempre funcionan'], answer: 0, why: 'Lo directo se entiende mejor.' },
      { prompt: 'Tu círculo puede incluir…', options: ['Amigos, familia, roomies o compañeros de confianza', 'Solo tu pareja', 'Solo profesionales'], answer: 0, why: 'Cuantas más anclas, mejor.' },
      { prompt: 'Un amigo te pide ayuda. ¿Qué le das primero?', options: ['Escucha sin juzgar', 'Un sermón', 'Consejos inmediatos'], answer: 0, why: 'Sentirse escuchado ya alivia.' },
    ],
    [
      { prompt: 'Enviaste tu alerta al chat grupal y nadie responde enseguida. ¿Qué haces?', options: ['Concluir que a nadie le importa', 'Escribirle a otro contacto de tu círculo y respirar mientras esperas', 'Borrar el mensaje'], answer: 1, why: 'Tener más de un ancla evita quedarte solo.' },
      { prompt: 'El malestar es intenso y dura semanas. ¿Qué conviene?', options: ['Buscar además ayuda profesional', 'Aguantar más', 'Esperar a que pase solo'], answer: 0, why: 'La ayuda profesional complementa a tu círculo.' },
      { prompt: 'Sientes que "ya pediste mucha ayuda". ¿Qué recuerdas?', options: ['Las relaciones sanas son de ida y vuelta', 'Que no debes molestar nunca más', 'Que es mejor callar'], answer: 0, why: 'Hoy recibes; otro día acompañarás tú.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena cómo una crisis se vuelve ansiedad severa.',
    steps: ['Crisis', 'Aislamiento', 'Falta de perspectiva', 'Ansiedad severa'],
    insight: 'Si en el aislamiento envías un mensaje a tu círculo, la cadena se rompe.',
  },
  swipe: {
    prompt: 'Desliza: ¿pedido de ayuda directo o indirecta dramática?',
    left: 'Indirecta',
    right: 'Directo',
    cards: [
      { text: 'Subir una historia triste esperando que alguien pregunte.', answer: 'left', why: 'Es una indirecta: nadie sabe qué necesitas.' },
      { text: 'Escribir "¿Podemos hablar un rato? Estoy saturado".', answer: 'right', why: 'Claro, breve y directo.' },
      { text: 'Decir "estoy bien" cuando no lo estás.', answer: 'left', why: 'Cierra la puerta al apoyo.' },
      { text: 'Llamar a tu hermana y contarle lo que pasa.', answer: 'right', why: 'Pedir apoyo a alguien concreto funciona.' },
      { text: 'Publicar "nadie me entiende" en redes.', answer: 'left', why: 'Es dramático y poco claro.' },
      { text: 'Proponer a un amigo ir por un café porque lo necesitas.', answer: 'right', why: 'Es una invitación directa y sana.' },
    ],
  },
  wordRain: {
    good: ['Pedir ayuda', 'Confianza', 'Escuchar', 'Apoyo', 'Compañía', 'Mensaje', 'Abrazo', 'Conexión'],
    bad: ['Aislarme', 'Callar', 'Aguantar solo', 'Indirecta', 'Carga', 'Vergüenza', 'Drama', 'Silencio'],
    phrase: 'Pedir ayuda a tiempo también es fuerza.',
  },
  simulator: {
    kind: 'support-message',
    title: 'Alerta a tu círculo',
    intro: 'Elige 1 o 2 personas de tu círculo y envía el mensaje (en el juego, es una simulación).',
    placeholder: 'Ando saturado, ¿tienes 5 min para hablar de cualquier tontería?',
    options: [
      { label: 'Mejor amiga o amigo', detail: 'Alguien que te conoce bien.' },
      { label: 'Roomie', detail: 'Alguien cerca, en casa.' },
      { label: 'Compañero de clase o trabajo', detail: 'Alguien que entiende tu contexto.' },
      { label: 'Familiar', detail: 'Alguien que te quiere de siempre.' },
    ],
    closing: 'Mensaje enviado. Pedir apoyo a tiempo te acompaña.',
  },
  wordSearch: {
    words: [
      { word: 'APOYO', clue: 'Lo que recibes de tu red cuando lo pides.' },
      { word: 'CONFIANZA', clue: 'Lo que sientes con tu círculo ancla.' },
      { word: 'CONTACTO', clue: 'Una persona a la que puedes escribir.' },
      { word: 'ESCUCHAR', clue: 'Lo que más ayuda a alguien que sufre.' },
      { word: 'CIRCULO', clue: 'Tu red de personas cercanas.' },
      { word: 'CERCANIA', clue: 'Sentirte acompañado.' },
    ],
  },
  trap: {
    belief: 'Pedir ayuda me convierte en una carga',
    turns: [
      {
        challenge: 'Si le cuentas tus problemas a tus amigos, los vas a cansar.',
        options: [
          { text: 'A mí me gusta ayudar a mis amigos; ellos probablemente sienten lo mismo.', strength: 'strong', reply: 'Buen punto. ¿Pero y si justo están ocupados?' },
          { text: 'Tal vez los canso un poco.', strength: 'weak', reply: '¿Te lo han dicho, o es algo que supones?' },
          { text: 'Sí, mejor no molesto.', strength: 'agree', reply: 'Y cuando un amigo te pide ayuda a ti, ¿lo ves como una carga?' },
        ],
      },
      {
        challenge: 'Si pides ayuda, eres menos capaz que los demás.',
        options: [
          { text: 'Pedir ayuda a tiempo es una habilidad: evita que el problema crezca.', strength: 'strong', reply: 'Exacto. Y si alguien no puede, tienes otras anclas.' },
          { text: 'Depende del problema.', strength: 'weak', reply: 'Algunos sí puedes solo. ¿Y los que te sobrepasan?' },
          { text: 'Sí, los fuertes no piden ayuda.', strength: 'agree', reply: 'Hasta los equipos más fuertes se apoyan entre sí. ¿Por qué tú no?' },
        ],
      },
    ],
    closing: 'Pedir ayuda no te hace una carga: te hace parte de una red.',
  },
  boss: {
    prompt: 'Conecta la señal a tiempo: ¿pedido sano o indirecta?',
    left: 'Pedido sano',
    right: 'Indirecta',
    seconds: 40,
    items: [
      { text: '"¿Podemos hablar un rato?"', answer: 'left' },
      { text: 'Historia triste sin explicar nada', answer: 'right' },
      { text: '"Necesito compañía hoy"', answer: 'left' },
      { text: '"Nadie me quiere" en redes', answer: 'right' },
      { text: 'Llamar a un familiar', answer: 'left' },
      { text: 'Dejar de responder a todos', answer: 'right' },
    ],
  },
  rewind: {
    summary: ['Aislarte quita perspectiva.', 'Pide ayuda de forma directa y breve.', 'Ten más de un ancla en tu círculo.'],
    reward: 'Regi conversa acompañado y brilla en amarillo cálido.',
  },
};
