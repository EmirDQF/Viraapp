import type { ModuleContent } from '@/types/content';

/** El Descarga · Sector 1 · Factores: desahogo y frenar el sobrepensamiento. Módulo completo (30 preguntas). */
export const descarga: ModuleContent = {
  id: 'descarga',
  context: {
    title: 'El Contexto',
    situation: 'Son las 2 de la mañana. Regi no puede dormir: le da vueltas y vueltas a un problema con su grupo de la universidad.',
    options: [
      {
        label: 'Seguir pensando hasta encontrar la solución',
        outcome: 'Pasa la noche en vela repasando lo mismo. Amanece agotado y el problema sigue igual.',
        good: false,
        learning: 'Darle vueltas en la cama no resuelve: consume la energía que necesitarás mañana.',
      },
      {
        label: 'Escribirlo en una nota y soltarlo por hoy',
        outcome: 'Escribe todo lo que siente en el celular. La cabeza se aquieta y logra dormir.',
        good: true,
        learning: 'Pasar los pensamientos al papel libera la mente: lo que sale de tu cabeza deja de pesar.',
      },
    ],
  },
  conflict: {
    title: 'El Conflicto',
    situation: 'Al día siguiente el problema sigue. Hay cosas que Regi no puede cambiar, como lo que opinan sus compañeros.',
    options: [
      {
        label: 'Obsesionarse con lo que no puede cambiar',
        outcome: 'Se queda paralizado pensando en lo injusto de la situación. No avanza en nada.',
        good: false,
        learning: 'Pelear con lo que no depende de ti te deja sin energía para lo que sí.',
      },
      {
        label: 'Separar lo que depende de él y dar un paso',
        outcome: 'Anota qué está en sus manos (hablar con el grupo, repartir tareas) y escribe un mensaje claro.',
        good: true,
        learning: 'Separar lo controlable de lo que no te devuelve a la acción.',
      },
    ],
  },
  rounds: [
    [
      { prompt: 'Son las 2 AM y no dejas de pensar en un problema. ¿Qué te ayuda más?', options: ['Repasarlo hasta encontrar la solución', 'Escribir todo en una nota para sacarlo de la cabeza', 'Revisar el celular hasta que llegue el sueño'], answer: 1, why: 'Pasar los pensamientos al papel libera la mente.' },
      { prompt: '¿Cuál de estas cosas está fuera de tu control?', options: ['Lo que otra persona opine de ti', 'La hora a la que empiezas a estudiar', 'Cómo te preparas para una reunión'], answer: 0, why: 'La opinión ajena no depende de ti; el resto sí.' },
      { prompt: '¿Qué es "rumiar" un pensamiento?', options: ['Resolverlo paso a paso', 'Darle vueltas una y otra vez sin avanzar', 'Contárselo a alguien'], answer: 1, why: 'Rumiar es repetir el problema en la cabeza sin llegar a una acción.' },
      { prompt: 'Desahogarte con alguien de confianza es…', options: ['Una forma sana de soltar tensión', 'Una señal de debilidad', 'Una pérdida de tiempo'], answer: 0, why: 'Hablar o escribir lo que sientes baja la carga emocional.' },
      { prompt: '¿Qué suele pasar cuando acumulas problemas sin hablarlos?', options: ['Se resuelven solos', 'La mente se satura y aparece el agotamiento', 'Te vuelves más productivo'], answer: 1, why: 'Acumular lleva a rumiar, y rumiar agota.' },
      { prompt: '¿Cuál es un buen momento para "descargar" lo que piensas?', options: ['Solo cuando ya no aguantas más', 'Un momento breve cada día, antes de que se acumule', 'Nunca, hay que aguantar'], answer: 1, why: 'Descargar un poco a diario evita que la tensión crezca.' },
      { prompt: 'Escribir lo que sientes sirve aunque…', options: ['Nadie más lo lea', 'Solo si lo publicas', 'Solo si está bien redactado'], answer: 0, why: 'El beneficio está en sacarlo de tu cabeza, no en que alguien lo lea.' },
      { prompt: '¿Qué señal indica que estás sobrepensando?', options: ['Llevas una hora con el mismo pensamiento sin decidir nada', 'Haces una lista de tareas', 'Le pides opinión a un amigo'], answer: 0, why: 'Pensar mucho sin llegar a ninguna acción es la señal clave.' },
      { prompt: '¿Qué depende de ti cuando un examen salió mal?', options: ['La nota que ya te pusieron', 'Cómo te preparas para el siguiente', 'Lo que piensa el profesor'], answer: 1, why: 'El pasado no se cambia; tu próxima preparación sí.' },
      { prompt: 'Soltar un pensamiento significa…', options: ['Fingir que no existe', 'Reconocerlo, dejarlo por escrito y volver al presente', 'Olvidarlo para siempre'], answer: 1, why: 'Soltar no es negar: es dejar de cargarlo todo el tiempo.' },
    ],
    [
      { prompt: '¿Por qué escribir ayuda a dormir mejor cuando estás preocupado?', options: ['Porque cansa la mano', 'Porque tu mente deja de sostener todo a la vez', 'Porque te distrae del celular'], answer: 1, why: 'Al anotarlo, el cerebro siente que no tiene que recordarlo a cada momento.' },
      { prompt: '¿Cuál es la diferencia entre pensar un problema y rumiarlo?', options: ['Pensar lleva a decidir algo; rumiar no avanza', 'No hay diferencia', 'Rumiar es más profundo y útil'], answer: 0, why: 'Pensar tiene salida; rumiar es un círculo.' },
      { prompt: '¿Qué hace el cansancio con tus problemas?', options: ['Los hace ver más grandes de lo que son', 'Los hace desaparecer', 'No tiene ningún efecto'], answer: 0, why: 'Con poca energía, todo parece más difícil.' },
      { prompt: 'Desahogarte en crudo (sin filtro) en un chat privado o nota es…', options: ['Peligroso siempre', 'Una forma válida de vaciar la mente', 'Algo que solo hacen los niños'], answer: 1, why: 'Un espacio privado y seguro permite soltar sin juicio.' },
      { prompt: '¿Por qué "separar lo controlable" reduce la ansiedad?', options: ['Porque ignoras tus problemas', 'Porque enfocas tu energía donde sí puedes hacer algo', 'Porque te vuelves indiferente'], answer: 1, why: 'Saber dónde actuar reduce la sensación de impotencia.' },
      { prompt: '¿Qué pasa si intentas controlar todo?', options: ['Te agotas y te frustras', 'Lo logras con esfuerzo', 'Todo sale mejor'], answer: 0, why: 'Nadie controla todo; intentarlo drena tu energía.' },
      { prompt: 'Un amigo te cuenta lo que siente. ¿Qué lo ayuda más?', options: ['Darle soluciones de inmediato', 'Escucharlo sin juzgar', 'Cambiar de tema para animarlo'], answer: 1, why: 'Sentirse escuchado ya es una forma de descarga.' },
      { prompt: '¿Por qué la noche es un mal momento para resolver problemas?', options: ['Porque estás cansado y todo se ve peor', 'Porque hay menos luz', 'No lo es, es el mejor momento'], answer: 0, why: 'El cansancio distorsiona; mejor anótalo y decide de día.' },
      { prompt: 'Callar lo que te pasa para "no molestar" suele…', options: ['Proteger a los demás sin costo', 'Aumentar tu carga y aislarte', 'Resolver el problema'], answer: 1, why: 'Guardarlo todo te deja solo con el peso.' },
      { prompt: '¿Cuál es una señal de que la descarga funcionó?', options: ['Te sientes un poco más liviano y con más claridad', 'El problema desapareció por completo', 'Ya no sientes nada'], answer: 0, why: 'No se trata de borrar el problema, sino de recuperar claridad.' },
    ],
    [
      { prompt: 'Ya escribiste tus pensamientos, pero uno sigue dando vueltas. ¿Qué haces?', options: ['Repetirlo hasta agotarte', 'Preguntarte si depende de ti y, si sí, elegir un paso pequeño', 'Ignorarlo por completo'], answer: 1, why: 'Separar lo controlable te devuelve a la acción.' },
      { prompt: 'Tu grupo no responde en el chat del trabajo final. ¿Qué parte depende de ti?', options: ['Que respondan', 'Enviar un mensaje claro con una propuesta y una fecha', 'Que el profesor lo note'], answer: 1, why: 'Tu mensaje es tuyo; su respuesta no.' },
      { prompt: 'Es domingo en la noche y te angustia toda la semana. ¿Qué harías primero?', options: ['Pensar en todo lo que puede salir mal', 'Anotar lo pendiente y elegir lo primero para el lunes', 'Quedarte en redes para no pensar'], answer: 1, why: 'Una lista corta y un primer paso bajan la carga.' },
      { prompt: 'Te dijeron algo que te dolió y no dejas de recordarlo. ¿Qué te ayuda?', options: ['Escribir cómo te sentiste y qué necesitas', 'Repasar la escena mil veces', 'Contestar con rabia'], answer: 0, why: 'Nombrar lo que sientes le quita fuerza al recuerdo.' },
      { prompt: 'Tu familia tiene problemas de dinero y te preocupa. ¿Qué está en tus manos?', options: ['Arreglar toda la situación', 'Hablar con ellos y ver en qué puedes aportar', 'Nada, así que mejor no pensar'], answer: 1, why: 'No puedes cargarlo todo, pero sí conversar y aportar tu parte.' },
      { prompt: 'Te sientes saturado y alguien te pregunta "¿cómo estás?". ¿Qué respondes?', options: ['"Bien" aunque no sea cierto', 'Algo honesto: "Algo cansado, ¿podemos hablar luego?"', 'Nada'], answer: 1, why: 'Una respuesta honesta abre la puerta al apoyo.' },
      { prompt: 'Un pensamiento te dice "todo va a salir mal". ¿Cuál es una buena pregunta?', options: ['"¿Qué evidencia tengo de eso?"', '"¿Y si sale peor?"', '"¿Por qué siempre me pasa a mí?"'], answer: 0, why: 'Buscar evidencia frena la catástrofe mental.' },
      { prompt: 'Después de descargar, ¿qué sigue?', options: ['Elegir un siguiente paso pequeño o descansar', 'Volver a leer todo lo escrito diez veces', 'Borrar la nota con culpa'], answer: 0, why: 'La descarga prepara el terreno para actuar o recuperarte.' },
      { prompt: '¿Cuándo conviene buscar ayuda profesional?', options: ['Si el malestar es intenso o dura muchas semanas', 'Nunca, hay que poder solo', 'Solo si alguien te obliga'], answer: 0, why: 'Pedir ayuda profesional a tiempo es cuidarte.' },
      { prompt: '¿Qué frase resume El Descarga?', options: ['"Lo que sale de mi cabeza deja de pesar."', '"Si lo pienso mucho, lo resuelvo."', '"Mejor no decir nada."'], answer: 0, why: 'Sacarlo de la cabeza te devuelve energía.' },
    ],
  ],
  puzzle: {
    prompt: 'Ordena cómo se forma el agotamiento mental.',
    steps: ['Acumulación de problemas', 'Rumiación mental', 'Agotamiento'],
    insight: 'Si cortas la cadena en la rumiación (escribiendo o hablando), el agotamiento no llega.',
  },
  swipe: {
    prompt: 'Desliza: ¿quejarte en tu cabeza o escribir para vaciar la mente?',
    left: 'Darle vueltas',
    right: 'Soltarlo',
    cards: [
      { text: 'Son las 11 PM y repasas la discusión de hoy en tu cabeza.', answer: 'left', why: 'Repasarlo en la cabeza es rumiar.' },
      { text: 'Anotas en el celular lo que te molestó y por qué.', answer: 'right', why: 'Escribirlo lo saca de tu cabeza.' },
      { text: 'Le mandas un audio a tu mejor amiga contándole cómo te sientes.', answer: 'right', why: 'Hablarlo con alguien de confianza es descargar.' },
      { text: 'Imaginas todos los escenarios en que el examen sale mal.', answer: 'left', why: 'Anticipar catástrofes alimenta la rumiación.' },
      { text: 'Haces una lista: "lo que depende de mí / lo que no".', answer: 'right', why: 'Separar lo controlable ordena la mente.' },
      { text: 'Te quedas mirando el techo pensando "¿por qué a mí?".', answer: 'left', why: 'Preguntas sin salida mantienen el círculo.' },
    ],
  },
  wordRain: {
    good: ['Escribir', 'Soltar', 'Respirar', 'Hablar', 'Desahogo', 'Descansar', 'Anotar', 'Control'],
    bad: ['Rumiar', 'Obsesionar', 'Darle vueltas', 'Callar', 'Catastrofizar', 'Insomnio', 'Aguantar', 'Culpa ajena'],
    phrase: 'Lo que sale de mi cabeza deja de pesar.',
  },
  simulator: {
    kind: 'journal',
    title: 'Tu espacio de descarga',
    intro: 'Suelta tus frustraciones en crudo. Nadie más lo verá: no se guarda ni se envía.',
    placeholder: 'Escribe lo que te está dando vueltas…',
    options: [
      { label: 'Depende de mí', detail: 'Elige un paso pequeño para hoy.' },
      { label: 'No depende de mí', detail: 'Reconócelo y suéltalo por ahora.' },
    ],
    closing: 'Listo. Lo que escribiste ya no tiene que dar vueltas en tu cabeza.',
  },
  wordSearch: {
    words: [
      { word: 'DESAHOGO', clue: 'Soltar lo que sientes para aliviar la carga.' },
      { word: 'ESCRIBIR', clue: 'Pasar los pensamientos al papel o al celular.' },
      { word: 'SOLTAR', clue: 'Dejar de cargar algo que no depende de ti.' },
      { word: 'CONTROL', clue: 'Lo que sí está en tus manos.' },
      { word: 'DESCANSO', clue: 'Lo que tu mente necesita para ver con claridad.' },
      { word: 'RESPIRAR', clue: 'Lo primero para bajar la tensión del cuerpo.' },
    ],
  },
  trap: {
    belief: 'Desahogarme es una debilidad',
    turns: [
      {
        challenge: 'Si fueras fuerte de verdad, podrías con todo sin contárselo a nadie, ¿no?',
        options: [
          { text: 'Soltar lo que siento me da energía para seguir; eso también es fuerza.', strength: 'strong', reply: 'Buen punto. Pero, ¿no te preocupa que los demás te vean vulnerable?' },
          { text: 'Bueno… a veces sí me desahogo, pero poco.', strength: 'weak', reply: 'Entonces lo haces a escondidas. ¿Por qué sentirías vergüenza de algo que te ayuda?' },
          { text: 'Tienes razón, mejor aguanto solo.', strength: 'agree', reply: '¿Y qué ha pasado las veces que aguantaste solo hasta el límite? Piénsalo un momento.' },
        ],
      },
      {
        challenge: 'Mostrar que te afecta algo te hace ver débil ante los demás.',
        options: [
          { text: 'Ser honesto con lo que siento me acerca a la gente de confianza.', strength: 'strong', reply: 'Mmm. ¿Pero no es mejor resolverlo en tu cabeza antes de hablar?' },
          { text: 'Depende de a quién se lo cuente.', strength: 'weak', reply: 'Es verdad que conviene elegir bien. ¿Tienes a alguien de confianza para eso?' },
          { text: 'Sí, mejor que nadie sepa.', strength: 'agree', reply: 'Guardarlo todo suele pesar más con el tiempo. ¿Te ha pasado?' },
        ],
      },
      {
        challenge: 'Si lo piensas lo suficiente, lo resuelves solo. No necesitas desahogarte.',
        options: [
          { text: 'Pensar sin parar me agota; escribirlo me ayuda a ver qué sí puedo hacer.', strength: 'strong', reply: 'Tienes razón: sacarlo de la cabeza te devuelve claridad.' },
          { text: 'A veces funciona pensarlo mucho.', strength: 'weak', reply: 'A veces sí. Pero si llevas horas en lo mismo, ¿estás pensando o dando vueltas?' },
          { text: 'Sí, pensar más siempre ayuda.', strength: 'agree', reply: 'Pensar ayuda cuando lleva a una acción. Si no, se vuelve rumiación.' },
        ],
      },
    ],
    closing: 'Desahogarte no es debilidad: es cuidar tu energía para seguir.',
  },
  boss: {
    prompt: 'Clasifica rápido cada pensamiento.',
    left: 'Bajo control',
    right: 'Fuera de control',
    seconds: 45,
    items: [
      { text: 'La hora a la que me voy a dormir', answer: 'left' },
      { text: 'Lo que opina mi compañero de mí', answer: 'right' },
      { text: 'Escribir lo que me preocupa', answer: 'left' },
      { text: 'El tráfico camino a clase', answer: 'right' },
      { text: 'Pedir ayuda a un amigo', answer: 'left' },
      { text: 'La nota que ya me pusieron', answer: 'right' },
      { text: 'Cómo me preparo para el próximo examen', answer: 'left' },
      { text: 'Que me respondan el mensaje rápido', answer: 'right' },
    ],
  },
  rewind: {
    summary: [
      'Acumular problemas lleva a rumiar, y rumiar agota.',
      'Escribir o hablar lo que sientes saca el peso de tu cabeza.',
      'Separar lo que depende de ti te devuelve a la acción.',
    ],
    reward: 'Regi duerme tranquilo y brilla en azul profundo. Desbloqueaste el siguiente tramo.',
  },
};
