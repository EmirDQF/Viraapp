import type { ModuleContent } from '@/types/content';

/** Freno de Mano · Sector 2 · Impulsos: pausa táctica y reactividad emocional. */
export const freno: ModuleContent = {
  id: 'freno',
  context: {
    title: 'El Contexto',
    situation: 'A las 11 PM a Regi le llega un mensaje que le molesta mucho.',
    options: [
      {
        label: 'Responder en ese momento, con cólera',
        outcome: 'La discusión escala. Regi se enrojece y termina diciendo cosas que no quería.',
        good: false,
        learning: 'Responder en caliente deja que la emoción decida por ti.',
      },
      {
        label: 'Pausar antes de responder',
        outcome: 'Deja el celular, respira y responde al día siguiente con calma.',
        good: true,
        learning: 'La pausa deja que baje la emoción y aparezca la claridad.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'En una reunión de grupo, alguien critica el trabajo de Regi frente a todos.',
    options: [
      {
        label: 'Contestar en caliente para defenderse',
        outcome: 'Decide apurado, el ambiente se tensa y el trabajo empeora.',
        good: false,
        learning: 'En alerta, el cuerpo reacciona en automático y la visión se estrecha.',
      },
      {
        label: 'Activar la pausa táctica',
        outcome: 'Respira, pide un momento y luego propone revisar juntos los cambios.',
        good: true,
        learning: 'Pausar no es evitar: es responder mejor.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Recibes un mensaje que te molesta mucho. ¿Qué haces primero?', options: ['Responder de inmediato', 'Pausar unos minutos, respirar y luego decidir si respondes', 'Mandar un audio gritando'], answer: 1, why: 'La pausa deja que baje la emoción.' },
      { prompt: '¿Qué pasa en tu cuerpo cuando te sientes atacado?', options: ['Se activa una alarma: sube el cortisol y el corazón se acelera', 'Nada', 'Te da sueño'], answer: 0, why: 'Es una respuesta de protección, pero nubla el juicio.' },
      { prompt: '¿Qué es la pausa táctica?', options: ['Ignorar a la otra persona para siempre', 'Detenerte unos segundos antes de reaccionar', 'Contar chistes'], answer: 1, why: 'Es un freno breve entre sentir y actuar.' },
      { prompt: 'Contar hasta 10 sirve porque…', options: ['Da tiempo a que baje la intensidad de la emoción', 'Es una regla de etiqueta', 'Distrae a la otra persona'], answer: 0, why: 'Unos segundos cambian mucho la respuesta.' },
    ],
    [
      { prompt: '¿Por qué se decide peor cuando estás muy enojado?', options: ['Porque el cuerpo entra en alerta y la visión se estrecha', 'Porque uno se cansa', 'Porque falta información'], answer: 0, why: 'En alerta, el cuerpo reacciona en automático.' },
      { prompt: '¿Qué es la "visión de túnel"?', options: ['Ver solo la amenaza e ignorar el resto', 'Tener buena concentración', 'Un problema de la vista'], answer: 0, why: 'La emoción intensa reduce las opciones que ves.' },
      { prompt: 'Un límite dicho con calma suena como…', options: ['"Ahora no puedo hablar de esto, lo conversamos mañana"', '"¡Eres imposible!"', 'Silencio y portazo'], answer: 0, why: 'Claro y sin atacar.' },
      { prompt: 'Mandar indirectas en redes cuando te enojas…', options: ['Resuelve el conflicto', 'Suele escalarlo y confunde a todos', 'Es la forma más madura'], answer: 1, why: 'Lo directo y calmado funciona mejor.' },
    ],
    [
      { prompt: 'Ya te calmaste tras la pausa. ¿Cuál es el mejor siguiente paso?', options: ['Responder con un mensaje claro y tranquilo', 'No responder nunca más', 'Enviar todo lo que sentías'], answer: 0, why: 'Pausar no es evitar: es responder mejor.' },
      { prompt: 'Tu hermano usa tus cosas sin permiso y te enfureces. ¿Qué haces?', options: ['Gritarle en el momento', 'Salir un momento, respirar y luego decirle lo que necesitas', 'Romper algo suyo'], answer: 1, why: 'Primero regulas, después hablas.' },
      { prompt: '¿Qué señal te avisa que necesitas una pausa?', options: ['Aprietas los dientes y sientes calor en la cara', 'Tienes hambre', 'Estás aburrido'], answer: 0, why: 'El cuerpo avisa antes que la mente.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena cómo se dispara una reacción automática.',
    steps: ['Ataque percibido', 'Cortisol', 'Visión de túnel', 'Reacción automática'],
    insight: 'Una pausa de pocos segundos antes de reaccionar corta esta cadena.',
  },
  swipe: {
    prompt: 'Desliza: ¿reacción en caliente o respuesta con pausa?',
    left: 'En caliente',
    right: 'Con pausa',
    cards: [
      { text: 'Mandar un audio gritando apenas lees el mensaje.', answer: 'left', why: 'Reaccionar sin pausa suele escalar.' },
      { text: 'Escribir lo que sientes en el bloc de notas antes de responder.', answer: 'right', why: 'Descargas sin dañar la relación.' },
      { text: 'Salir a caminar cinco minutos antes de hablar.', answer: 'right', why: 'Mover el cuerpo baja la activación.' },
      { text: 'Tirar la puerta y encerrarte.', answer: 'left', why: 'La emoción decidió por ti.' },
      { text: 'Decir "necesito un momento, ya vuelvo".', answer: 'right', why: 'Es un freno claro y respetuoso.' },
      { text: 'Responder con sarcasmo en el grupo.', answer: 'left', why: 'El sarcasmo en caliente hiere y complica.' },
    ],
  },
  wordRain: {
    good: ['Pausa', 'Respirar', 'Calma', 'Escuchar', 'Contar hasta 10', 'Claridad', 'Límite', 'Espacio'],
    bad: ['Gritar', 'Insultar', 'Responder ya', 'Portazo', 'Indirecta', 'Rencor', 'Audio furioso', 'Explotar'],
    phrase: 'Entre lo que siento y lo que hago, cabe una pausa.',
  },
  simulator: {
    kind: 'pause-breath',
    title: 'Freno de mano de 10 segundos',
    intro: 'Escribe cómo te sientes. Luego la pantalla se pausa 10 segundos para respirar antes de decidir.',
    placeholder: 'Ahora mismo siento…',
    options: [],
    closing: 'Hiciste la pausa. Ahora decides tú, no la emoción.',
  },
  wordSearch: {
    words: [
      { word: 'PAUSA', clue: 'El freno entre sentir y actuar.' },
      { word: 'RESPIRAR', clue: 'Lo que baja la alarma del cuerpo.' },
      { word: 'CALMA', clue: 'Estado desde el que decides mejor.' },
      { word: 'CORTISOL', clue: 'Hormona que se dispara cuando te sientes atacado.' },
      { word: 'REACCION', clue: 'Lo que haces en automático, sin pensar.' },
      { word: 'EMOCION', clue: 'Lo que sientes; es válida, pero no tiene que decidir por ti.' },
    ],
  },
  trap: {
    belief: 'Si no respondo ya, soy débil',
    turns: [
      {
        challenge: 'Si alguien te ataca y no respondes al toque, van a pensar que te dejaste.',
        options: [
          { text: 'Responder después, con calma, muestra más control que gritar al instante.', strength: 'strong', reply: 'Puede ser. ¿Pero no se pierde el momento si esperas?' },
          { text: 'Depende de la situación.', strength: 'weak', reply: 'Es cierto. ¿En qué situaciones te arrepentiste de responder rápido?' },
          { text: 'Sí, hay que contestar de inmediato.', strength: 'agree', reply: '¿Y cuántas veces esa respuesta inmediata terminó mejorando las cosas?' },
        ],
      },
      {
        challenge: 'Pausar es huir del conflicto.',
        options: [
          { text: 'Pausar no es huir: vuelvo a la conversación cuando puedo pensar con claridad.', strength: 'strong', reply: 'Exacto: la pausa es para responder mejor, no para desaparecer.' },
          { text: 'A veces sí es huir.', strength: 'weak', reply: 'Si no vuelves a hablar, sí. ¿Qué harías para asegurarte de volver?' },
          { text: 'Sí, pausar es de cobardes.', strength: 'agree', reply: 'Los pilotos, los médicos y los atletas pausan antes de decidir. ¿Son cobardes?' },
        ],
      },
    ],
    closing: 'Responder con calma es fuerza; reaccionar sin pausa deja el control a la emoción.',
  },
  boss: {
    prompt: 'Provocación en curso: clasifica cada opción.',
    left: 'Reacción',
    right: 'Respuesta',
    seconds: 40,
    items: [
      { text: 'Contestar con insultos', answer: 'left' },
      { text: 'Respirar tres veces antes de hablar', answer: 'right' },
      { text: 'Subir una indirecta a redes', answer: 'left' },
      { text: 'Decir "hablemos cuando estemos más tranquilos"', answer: 'right' },
      { text: 'Tirar el celular', answer: 'left' },
      { text: 'Escribir lo que sientes antes de enviar nada', answer: 'right' },
    ],
  },
  rewind: {
    summary: ['La emoción intensa estrecha tu visión.', 'Una pausa de segundos cambia la respuesta.', 'Pausar no es huir: es volver con claridad.'],
    reward: 'Regi recupera el control y brilla en naranja estable.',
  },
};
