import type { Activity, ChoiceOption, Pa3ModuleId, PracticeStep } from '@/data/caminos/types';

const good = (text: string, feedback: string): ChoiceOption => ({ text, good: true, feedback });
const other = (text: string, feedback: string): ChoiceOption => ({ text, good: false, feedback });
const step = (prompt: string, ...options: ChoiceOption[]): PracticeStep => ({ prompt, options });

/**
 * Las 25 actividades PA3. "desarrollado" se juega completa (o abre una pantalla real de VIRA), "maqueta" es
 * una versión corta de prueba y "propuesto" describe cómo funcionará.
 */
export const ACTIVITIES: readonly Activity[] = [
  // ── Muro de Evidencia (Resiliencia) ──────────────────────────────────────────
  {
    id: 'distintos-caminos',
    moduleId: 'muro-evidencia',
    title: 'Distintos caminos',
    summary: 'Ante un mismo golpe, mira cómo distintas respuestas llevan a lugares diferentes.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Ana y Pedro perdieron la beca el mismo día. Ana dice: “Busco otra opción”. Pedro dice: “Ya fue, nada me sale”. ¿Qué diferencia hay?',
          good('Ana interpreta el golpe como algo temporal y busca salidas', 'Exacto. Ver el problema como algo que cambia abre caminos.'),
          other('Ana tiene más suerte que Pedro', 'La suerte no explica la diferencia: los dos vivieron lo mismo. Cambia cómo lo interpretan.'),
          other('No hay diferencia, los dos están igual de mal', 'Los dos sienten dolor, y es válido. Pero la forma de leerlo los lleva a acciones distintas.'),
        ),
        step(
          '¿Cuál de estas frases muestra resiliencia?',
          good('“Me dolió, y aun así puedo intentar algo distinto”', 'Sí. Resiliencia es sentir el golpe y seguir adaptándote.'),
          other('“No me afecta nada, soy de piedra”', 'Negar lo que sientes no es resiliencia: la emoción sigue ahí aunque no la mires.'),
          other('“Siempre me pasa lo peor”', 'Esa es una generalización: toma un hecho y lo convierte en una regla de vida.'),
        ),
        step(
          'Pedro quiere cambiar de camino. ¿Qué paso pequeño le ayudaría hoy?',
          good('Escribir dos cosas difíciles que ya superó antes', 'Muy bien. Recordar evidencia real devuelve la sensación de capacidad.'),
          other('Esperar a sentirse motivado para hacer algo', 'La motivación suele llegar después de actuar, no antes.'),
          other('Compararse con quienes sí ganaron la beca', 'Compararte desde el dolor suele hundirte más. Mejor mira tu propia historia.'),
        ),
      ],
      takeaway: 'El mismo golpe puede llevar a distintos caminos. Lo que haces con él sí está en tus manos.',
    },
  },
  {
    id: 'mi-evidencia',
    moduleId: 'muro-evidencia',
    title: 'Mi evidencia',
    summary: 'Guarda en tu muro los logros y momentos difíciles que ya superaste.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/evidence', cta: 'Abrir mi muro' },
  },
  {
    id: 'lo-llevo-a-otro-reto',
    moduleId: 'muro-evidencia',
    title: 'Lo llevo a otro reto',
    summary: 'Usa una evidencia de tu muro para enfrentar un reto nuevo.',
    status: 'maqueta',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Superaste el miedo a exponer en clase. Ahora tienes una entrevista de prácticas. ¿Qué te llevas de esa experiencia?',
          good('Que prepararme y practicar en voz alta me funcionó', 'Eso es transferir evidencia: una estrategia que ya probaste sirve en otro reto.'),
          other('Nada, son cosas totalmente distintas', 'Parecen distintas, pero las dos piden hablar con nervios. Lo que aprendiste sí viaja contigo.'),
        ),
      ],
      takeaway: 'Tu evidencia no se queda en el pasado: es una herramienta para lo que viene.',
    },
  },

  // ── Red de Recursos (Factores) ───────────────────────────────────────────────
  {
    id: 'mi-mapa-de-recursos',
    moduleId: 'red-recursos',
    title: 'Mi mapa de recursos',
    summary: 'Clasifica qué te protege y qué te pone en riesgo cuando las cosas se ponen difíciles.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          '¿Cuál de estos es un factor protector?',
          good('Tener una amiga a la que puedo llamar cuando estoy mal', 'Sí. Un vínculo de confianza es uno de los factores protectores más fuertes.'),
          other('Dormir cuatro horas para rendir más', 'Dormir poco es un factor de riesgo: baja tu paciencia y tu concentración.'),
          other('Guardarme todo para no preocupar a nadie', 'Aislarte aumenta la carga. Compartir, aunque sea un poco, la reparte.'),
        ),
        step(
          'Además de las personas, ¿qué otro recurso cuenta en tu mapa?',
          good('Un lugar o actividad que me calma, como caminar o dibujar', 'Exacto. Lugares, hábitos y actividades también son recursos.'),
          other('Solo cuentan las personas', 'Las personas son clave, pero también tus hábitos, tus lugares seguros y tus capacidades.'),
          other('Tener mucho dinero', 'El dinero ayuda en algunas cosas, pero la mayoría de recursos protectores no se compran.'),
        ),
        step(
          'Diego (el del caso inicial) duerme poco y no habla con nadie. ¿Qué factor de riesgo le conviene atender primero?',
          good('El aislamiento: buscar a una persona de confianza', 'Bien visto. Romper el aislamiento suele mejorar lo demás.'),
          other('Ninguno, ya se le pasará', 'A veces pasa, pero atender a tiempo evita que el malestar crezca.'),
        ),
      ],
      takeaway: 'Tu mapa de recursos es más grande de lo que crees: personas, lugares, hábitos y capacidades.',
    },
  },
  {
    id: 'aprendo-de-otros',
    moduleId: 'red-recursos',
    title: 'Aprendo de otros',
    summary: 'Historias de personas que salieron adelante gracias a su red.',
    status: 'propuesto',
    content: {
      kind: 'planned',
      plan: [
        'Leerás tres historias breves de personas que atravesaron un momento difícil.',
        'Marcarás qué factores protectores aparecen en cada historia.',
        'Regi te ayudará a elegir uno que quieras sumar a tu propio mapa.',
      ],
    },
  },
  {
    id: 'activo-mi-red',
    moduleId: 'red-recursos',
    title: 'Activo mi red',
    summary: 'Guarda a tus contactos de confianza para tenerlos a un toque cuando los necesites.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/support', cta: 'Abrir mi red de apoyo' },
  },

  // ── Hoy en Fácil (Estrategias) ───────────────────────────────────────────────
  {
    id: 'conecta-la-reaccion',
    moduleId: 'hoy-facil',
    title: 'Conecta la reacción',
    summary: 'Une cada pensamiento con la emoción y la conducta que provoca.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Valeria piensa: “No me invitaron porque les caigo mal”. ¿Qué emoción es más probable?',
          good('Tristeza y rechazo', 'Sí. Ese pensamiento lleva a sentirse rechazada.'),
          other('Alegría', 'Con ese pensamiento es difícil sentir alegría: la emoción sigue a la interpretación.'),
          other('Indiferencia', 'Si le importa el grupo, ese pensamiento difícilmente la dejará indiferente.'),
        ),
        step(
          'Con esa tristeza, ¿qué conducta es más probable?',
          good('Alejarse del grupo sin decir nada', 'Exacto. Pensamiento → emoción → conducta: así se forma la cadena.'),
          other('Organizar una fiesta', 'Poco probable desde la tristeza. La conducta suele seguir a la emoción.'),
        ),
        step(
          'Si Valeria pensara “Quizás fue algo improvisado”, ¿qué cambiaría?',
          good('Sentiría menos dolor y podría preguntar con calma', 'Eso es: cambiar el pensamiento cambia toda la cadena.'),
          other('Nada, la emoción sería la misma', 'Un pensamiento distinto suele traer una emoción distinta. Ahí está tu margen de acción.'),
        ),
      ],
      takeaway: 'Pensamiento, emoción y conducta están conectados. Si mueves uno, se mueven los otros.',
    },
  },
  {
    id: 'detective-de-pensamientos',
    moduleId: 'hoy-facil',
    title: 'Detective de pensamientos',
    summary: 'Encuentra la distorsión escondida en un pensamiento automático.',
    status: 'maqueta',
    content: {
      kind: 'flow',
      steps: [
        step(
          '“Si no me contesta el mensaje en cinco minutos, es que está enojado conmigo.” ¿Qué distorsión es?',
          good('Leer la mente', 'Correcto: supones lo que el otro piensa sin tener evidencia.'),
          other('Pensamiento realista', 'Hay muchas razones para no contestar: está ocupado, sin batería, en clase…'),
        ),
      ],
      takeaway: 'Ponerle nombre a la distorsión le quita fuerza al pensamiento.',
    },
  },
  {
    id: 'del-pensamiento-al-paso',
    moduleId: 'hoy-facil',
    title: 'Del pensamiento al paso',
    summary: 'Convierte un pensamiento alternativo en una acción pequeña y concreta.',
    status: 'propuesto',
    content: {
      kind: 'planned',
      plan: [
        'Escribirás un pensamiento que hoy te pesa.',
        'Buscarás evidencia a favor y en contra, con ayuda de Regi.',
        'Lo convertirás en un paso pequeño que puedas hacer hoy, y lo marcarás al cumplirlo.',
      ],
    },
  },

  // ── Detrás del Impulso (Impulsos) ────────────────────────────────────────────
  {
    id: 'que-me-mueve',
    moduleId: 'detras-impulso',
    title: '¿Qué me mueve?',
    summary: 'Descubre la necesidad que se esconde detrás de un impulso.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Luis quiere abrir TikTok a las 11 p. m. en lugar de hacer su trabajo. ¿Qué necesidad puede haber detrás?',
          good('Descansar o aliviar el cansancio', 'Probable. El impulso busca alivio rápido para una necesidad real.'),
          other('Ser flojo', 'Ponerse una etiqueta no ayuda. Mejor pregúntate qué necesitas en ese momento.'),
          other('Ninguna, es solo un impulso', 'Casi siempre hay una necesidad detrás: alivio, conexión, reconocimiento…'),
        ),
        step(
          'Rosa siente ganas de comprar ropa cada vez que discute con su mamá. ¿Qué busca?',
          good('Sentirse mejor después de un momento doloroso', 'Exacto. La compra da un alivio rápido, pero no atiende la emoción de fondo.'),
          other('Tener más ropa', 'Si el impulso aparece justo después de discutir, la ropa no es lo que realmente busca.'),
        ),
        step(
          '¿Qué pregunta te ayuda a mirar detrás de un impulso?',
          good('“¿Qué necesito ahora mismo?”', 'Esa es la pregunta clave. Nombrar la necesidad abre otras opciones.'),
          other('“¿Por qué siempre hago lo mismo?”', 'Esa pregunta suele traer culpa, no claridad. Prueba con “¿qué necesito?”.'),
        ),
      ],
      takeaway: 'Detrás de cada impulso hay una necesidad. Nombrarla es el primer paso para elegir.',
    },
  },
  {
    id: 'no-es-lo-mismo',
    moduleId: 'detras-impulso',
    title: 'No es lo mismo',
    summary: 'Distingue entre un impulso, una emoción y una decisión.',
    status: 'maqueta',
    content: {
      kind: 'flow',
      steps: [
        step(
          '“Siento rabia” y “Quiero tirar el celular contra la pared”. ¿Qué es cada cosa?',
          good('La primera es una emoción; la segunda, un impulso', 'Exacto. La emoción es lo que sientes; el impulso, el empuje a actuar.'),
          other('Las dos son lo mismo', 'Se parecen, pero no son iguales: puedes sentir rabia sin seguir el impulso.'),
        ),
      ],
      takeaway: 'Sentir no es lo mismo que actuar. Entre los dos hay espacio para decidir.',
    },
  },
  {
    id: 'una-necesidad-varias-opciones',
    moduleId: 'detras-impulso',
    title: 'Una necesidad, varias opciones',
    summary: 'Practica con el Enfriador de Dopamina cómo atender la misma necesidad de otras formas.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/module/enfriador', cta: 'Abrir el Enfriador' },
  },

  // ── Punto de Giro (Impulsividad) ─────────────────────────────────────────────
  {
    id: 'radar-del-impulso',
    moduleId: 'punto-giro',
    title: 'Radar del impulso',
    summary: 'Registra un impulso real: qué lo disparó y cuánto duró.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/impulses/new', cta: 'Registrar un impulso' },
  },
  {
    id: 'efecto-domino',
    moduleId: 'punto-giro',
    title: 'Efecto dominó',
    summary: 'Sigue la cadena de consecuencias de una reacción impulsiva.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Mateo le grita al árbitro. ¿Cuál puede ser la primera ficha que cae?',
          good('Le sacan tarjeta y su equipo juega con uno menos', 'Así empieza el dominó: una reacción de segundos tiene consecuencias.'),
          other('Nada, todos gritan en el fútbol', 'Que sea común no quita las consecuencias: tarjeta, expulsión, partido perdido.'),
        ),
        step(
          'Su equipo pierde y sus compañeros le reclaman. ¿Qué ficha cae después?',
          good('Se siente peor y discute con ellos también', 'Exacto. Una reacción impulsiva suele traer otra si no hay una pausa.'),
          other('Se le pasa al toque', 'A veces pasa, pero la frustración acumulada suele empujar a otra reacción.'),
        ),
        step(
          '¿Dónde podía Mateo detener el dominó?',
          good('Cuando sintió calor en la cara y apretó los puños', 'Sí. Las señales del cuerpo son el mejor momento para girar.'),
          other('Ya no había nada que hacer', 'Siempre hay un primer instante: esas señales del cuerpo eran su punto de giro.'),
        ),
      ],
      takeaway: 'Cada reacción empuja a la siguiente. Detener la primera ficha es más fácil que levantar todas.',
    },
  },
  {
    id: 'cambio-de-planes',
    moduleId: 'punto-giro',
    title: 'Cambio de planes',
    summary: 'Elige una respuesta alternativa cuando el impulso aparece.',
    status: 'maqueta',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Te escriben algo que te molesta y quieres responder con todo. ¿Cuál es un buen cambio de planes?',
          good('Esperar 10 minutos antes de contestar', 'La regla de los 10 minutos deja que la ola del impulso baje.'),
          other('Contestar rápido para no quedarte con la rabia', 'Responder en el pico de la rabia suele traer arrepentimiento después.'),
        ),
      ],
      takeaway: 'Tener un plan B preparado hace más fácil girar cuando llega el impulso.',
    },
  },
  {
    id: 'detras-de-la-reaccion',
    moduleId: 'punto-giro',
    title: 'Detrás de la reacción',
    summary: 'Analiza una reacción tuya: disparador, pensamiento, emoción y consecuencia.',
    status: 'propuesto',
    content: {
      kind: 'planned',
      plan: [
        'Elegirás una reacción impulsiva que hayas tenido esta semana.',
        'La descompondrás en disparador, pensamiento, emoción, acción y consecuencia.',
        'Regi te ayudará a encontrar en qué punto podías girar.',
      ],
    },
  },
  {
    id: 'tu-punto-de-giro',
    moduleId: 'punto-giro',
    title: 'Tu punto de giro',
    summary: 'Entrena en el Freno de Mano para frenar a tiempo y elegir otra respuesta.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/module/freno', cta: 'Abrir el Freno de Mano' },
  },

  // ── Toma el Mando (Técnicas y estrategias de control) ───────────────────────
  {
    id: 'semaforo-en-accion',
    moduleId: 'toma-mando',
    title: 'Semáforo en acción',
    summary: 'Aplica el semáforo (rojo, amarillo, verde) a una situación real.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Camila siente que va a explotar con su compañero. Luz roja: ¿qué hace?',
          good('Se detiene y respira antes de decir nada', 'Rojo es parar. Solo eso ya cambia lo que viene después.'),
          other('Le dice todo lo que piensa de una vez', 'Eso es saltarse el semáforo. En rojo, primero se para.'),
        ),
        step(
          'Luz amarilla: ¿qué hace ahora?',
          good('Piensa en dos o tres formas de resolverlo', 'Amarillo es pensar opciones y sus consecuencias.'),
          other('Decide no volver a trabajar con nadie', 'Es una decisión tomada en caliente. En amarillo se buscan varias opciones.'),
        ),
        step(
          'Luz verde: ¿cuál es la mejor acción?',
          good('Hablar con él a solas, con calma, sobre lo que pasó', 'Verde es actuar con la opción más útil. ¡Bien hecho!'),
          other('Quejarse con el profesor sin hablar con él', 'Puede ser una opción, pero primero conviene intentar resolverlo directamente.'),
        ),
      ],
      takeaway: 'Rojo para, amarillo piensa, verde actúa. El semáforo te devuelve el mando.',
    },
  },
  {
    id: 'elige-tu-recurso',
    moduleId: 'toma-mando',
    title: 'Elige tu recurso',
    summary: 'Usa el botón SOS: mide tu intensidad y deja que Regi te guíe con una técnica.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/sos', cta: 'Abrir el SOS' },
  },
  {
    id: 'vuelve-a-tu-centro',
    moduleId: 'toma-mando',
    title: 'Vuelve a tu centro',
    summary: 'Grounding 5-4-3-2-1: regresa al presente usando tus cinco sentidos.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/technique/grounding', cta: 'Empezar la técnica' },
  },
  {
    id: 'tu-escenario-de-calma',
    moduleId: 'toma-mando',
    title: 'Tu escenario de calma',
    summary: 'Arma tu Pantalla Ancla con una foto y frases que te devuelven la calma.',
    status: 'desarrollado',
    content: { kind: 'link', href: '/anchor', cta: 'Abrir mi ancla' },
  },
  {
    id: 'trazos-que-cuentan',
    moduleId: 'toma-mando',
    title: 'Trazos que cuentan',
    summary: 'Dibuja libremente lo que sientes para descargar la tensión.',
    status: 'propuesto',
    content: {
      kind: 'planned',
      plan: [
        'Tendrás un lienzo para dibujar con el dedo lo que sientes, sin reglas.',
        'Elegirás colores según tu emoción y verás cómo cambia el trazo.',
        'Al final, Regi te preguntará cómo te sientes ahora (sin obligarte a sentirte mejor).',
      ],
    },
  },

  // ── Bajo Presión (Estrés y tipos de estrés) ─────────────────────────────────
  {
    id: 'mapa-de-senales',
    moduleId: 'bajo-presion',
    title: 'Mapa de señales',
    summary: 'Reconoce cómo aparece el estrés en tu cuerpo, tu mente y tu conducta.',
    status: 'desarrollado',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Sofía tiene dolor de cabeza y la mandíbula apretada. ¿Qué tipo de señal es?',
          good('Una señal del cuerpo', 'Sí. El estrés suele aparecer primero en el cuerpo: tensión, dolor, cansancio.'),
          other('Una señal de la conducta', 'La conducta es lo que haces. El dolor y la tensión son señales del cuerpo.'),
        ),
        step(
          'Sofía no deja de pensar “no voy a llegar con todo”. ¿Qué señal es?',
          good('Una señal de la mente', 'Exacto. Preocupación constante y pensamientos catastróficos son señales mentales.'),
          other('Una señal del cuerpo', 'Ese pensamiento ocurre en la mente. Reconocerlo ayuda a no creerle del todo.'),
        ),
        step(
          'Sofía contesta mal a su hermano y deja de comer. ¿Qué te dice esto?',
          good('El estrés ya está afectando su conducta', 'Bien visto. Cuando llega a la conducta, es momento de hacer una pausa y pedir apoyo.'),
          other('Que es una persona difícil', 'No es su forma de ser: es el estrés hablando. Las señales ayudan a verlo a tiempo.'),
        ),
      ],
      takeaway: 'Cuerpo, mente y conducta: si aprendes tus señales, ves el estrés antes de que te desborde.',
    },
  },
  {
    id: 'una-situacion-distintas-respuestas',
    moduleId: 'bajo-presion',
    title: 'Una situación, distintas respuestas',
    summary: 'La misma presión puede activarte o desgastarte según cómo la vivas.',
    status: 'maqueta',
    content: {
      kind: 'flow',
      steps: [
        step(
          'Dos estudiantes tienen la misma exposición. Uno se activa y prepara; el otro se bloquea. ¿Qué muestra esto?',
          good('El estrés puede ser eustrés (activa) o distrés (desgasta)', 'Exacto. La misma demanda se vive distinto según tus recursos y tu interpretación.'),
          other('Que uno es mejor que el otro', 'No se trata de ser mejor: cada uno tiene recursos e historias distintas.'),
        ),
      ],
      takeaway: 'El estrés no es solo malo: depende de cuánto dura y de los recursos que tienes para enfrentarlo.',
    },
  },
  {
    id: 'que-tipo-reconoces',
    moduleId: 'bajo-presion',
    title: '¿Qué tipo reconoces?',
    summary: 'Clasifica situaciones como estrés agudo, crónico, eustrés o distrés.',
    status: 'propuesto',
    content: {
      kind: 'planned',
      plan: [
        'Verás situaciones cotidianas de estudiantes y trabajadores.',
        'Las clasificarás como estrés agudo, crónico, eustrés o distrés.',
        'Regi te explicará cada tipo y qué recurso ayuda más en cada caso.',
      ],
    },
  },
];

const BY_ID: ReadonlyMap<string, Activity> = new Map(ACTIVITIES.map((activity) => [activity.id, activity]));

export function getActivity(id: string): Activity | undefined {
  return BY_ID.get(id);
}

export function activitiesOf(moduleId: Pa3ModuleId): readonly Activity[] {
  return ACTIVITIES.filter((activity) => activity.moduleId === moduleId);
}
