import { PA3_MODULE_IDS, type Pa3Module, type Pa3ModuleId } from '@/data/caminos/types';

/** Los 7 módulos activos de PA3, cada uno con su caso inicial y la orientación de Regi. */
export const PA3_MODULES: Readonly<Record<Pa3ModuleId, Pa3Module>> = {
  'muro-evidencia': {
    id: 'muro-evidencia',
    path: 'recursos',
    title: 'Muro de Evidencia',
    courseCode: 'T01',
    topic: 'Resiliencia',
    icon: 'note',
    description: 'Reúne pruebas reales de que ya superaste momentos difíciles y úsalas en los retos nuevos.',
    situation: {
      story:
        'Andrea desaprobó su primer examen parcial. Esa noche piensa: “No sirvo para esta carrera”. Mañana tiene que decidir si se inscribe en el taller de refuerzo.',
      question: 'Si fueras Andrea, ¿qué harías?',
      decisions: ['Me inscribo en el refuerzo y pido ayuda', 'Dejo pasar el taller y veo qué pasa', 'Pienso en retirarme del curso'],
      arguments: [
        'Antes ya superé cosas difíciles',
        'Un examen no define todo lo que soy',
        'Si fallé una vez, voy a fallar otra vez',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'La resiliencia no es “no caerse”: es la capacidad de adaptarse y seguir después de un golpe.',
      'Tu memoria guarda más fácil los fracasos que los logros. Por eso conviene anotar evidencia concreta de lo que sí superaste.',
      'Cada reto nuevo se parece en algo a uno que ya resolviste: esa es la evidencia que puedes llevar contigo.',
    ],
  },
  'red-recursos': {
    id: 'red-recursos',
    path: 'recursos',
    title: 'Red de Recursos',
    courseCode: 'T02',
    topic: 'Factores',
    icon: 'users',
    description: 'Identifica tus factores protectores: personas, lugares, hábitos y capacidades que te sostienen.',
    integrates: ['Círculo de Ancla', 'El Descarga'],
    situation: {
      story:
        'Diego se mudó a Lima por estudios. Está saturado de trabajos, duerme poco y siente que no tiene con quién hablar.',
      question: 'Si fueras Diego, ¿qué harías primero?',
      decisions: ['Busco a alguien de confianza y le cuento', 'Me encierro a terminar todo yo solo', 'Me distraigo con el celular hasta tarde'],
      arguments: [
        'Pedir apoyo también es una capacidad',
        'Contarlo sería molestar a los demás',
        'Necesito olvidarme un rato de todo',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'Los factores protectores son lo que amortigua el impacto de la adversidad: vínculos, hábitos, lugares seguros y habilidades propias.',
      'Los factores de riesgo (aislamiento, falta de sueño, estrés sostenido) no te condenan, pero conviene verlos a tiempo.',
      'Una red no se activa sola: saber a quién acudir y para qué hace que pedir ayuda sea más fácil.',
    ],
  },
  'hoy-facil': {
    id: 'hoy-facil',
    path: 'actuar',
    title: 'Hoy en Fácil',
    courseCode: 'T03',
    topic: 'Estrategias',
    icon: 'bulb',
    description: 'Conecta lo que piensas con lo que sientes y haces, y convierte un pensamiento en un paso pequeño.',
    situation: {
      story:
        'Valeria ve que su grupo de amigos subió fotos de una salida a la que no la invitaron. Siente un nudo en el pecho.',
      question: 'Si fueras Valeria, ¿qué harías?',
      decisions: ['Le pregunto con calma a una amiga qué pasó', 'Dejo de hablarles a todos', 'Publico una indirecta en mis historias'],
      arguments: [
        'Puede haber una explicación que no conozco',
        'Seguro lo hicieron a propósito',
        'Quiero que sepan cómo me siento',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'Triángulo cognitivo: un pensamiento automático cambia la emoción, y la emoción empuja la conducta.',
      'Las distorsiones más comunes son leer la mente, catastrofizar, el todo o nada y personalizar.',
      'Revisar la evidencia a favor y en contra de un pensamiento te deja elegir un paso más útil.',
    ],
  },
  'detras-impulso': {
    id: 'detras-impulso',
    path: 'respuestas',
    title: 'Detrás del Impulso',
    courseCode: 'T04',
    topic: 'Impulsos',
    icon: 'compass',
    description: 'Descubre qué necesidad hay detrás de cada impulso y qué otras formas tienes de atenderla.',
    integrates: ['Enfriador de Dopamina'],
    situation: {
      story:
        'Son las 11 p. m. Luis tiene que entregar un trabajo mañana, pero siente unas ganas enormes de abrir TikTok “solo cinco minutos”.',
      question: 'Si fueras Luis, ¿qué harías?',
      decisions: ['Pongo el celular lejos y trabajo 25 minutos', 'Abro TikTok un rato y luego veo', 'Dejo el trabajo para mañana temprano'],
      arguments: [
        'Necesito un descanso, pero puedo elegir cuál',
        'Si no lo abro, no me voy a concentrar',
        'Total, siempre lo termino a última hora',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'Un impulso es un empuje rápido a actuar para obtener alivio o recompensa inmediata.',
      'Detrás de cada impulso suele haber una necesidad legítima: descanso, conexión, alivio, reconocimiento.',
      'Cuando nombras la necesidad, aparecen varias formas de atenderla, no solo la primera que surgió.',
    ],
  },
  'punto-giro': {
    id: 'punto-giro',
    path: 'respuestas',
    title: 'Punto de Giro',
    courseCode: 'T05',
    topic: 'Impulsividad',
    icon: 'undo',
    description: 'Detecta las señales del impulso, mira sus consecuencias y encuentra el momento exacto para girar.',
    integrates: ['Freno de Mano'],
    situation: {
      story:
        'En un partido de fulbito, a Mateo le hacen una falta fuerte y el árbitro no la cobra. Siente calor en la cara y aprieta los puños.',
      question: 'Si fueras Mateo, ¿qué harías?',
      decisions: ['Respiro, me alejo un momento y sigo jugando', 'Le reclamo a gritos al árbitro', 'Le devuelvo la falta al rival'],
      arguments: [
        'Si reacciono ahora, después me arrepiento',
        'Si no respondo, van a pensar que soy débil',
        'Es lo justo, él empezó',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'La impulsividad es actuar antes de pensar en las consecuencias. No es un defecto fijo: se entrena.',
      'El impulso tiene una curva: sube, llega a un pico y baja. Si esperas unos minutos, la ola pasa.',
      'El punto de giro es ese segundo entre la señal del cuerpo y la acción: ahí puedes elegir otra respuesta.',
    ],
  },
  'toma-mando': {
    id: 'toma-mando',
    path: 'actuar',
    title: 'Toma el Mando',
    courseCode: 'T06–T07',
    topic: 'Técnicas y estrategias de control',
    icon: 'hand',
    description: 'Practica técnicas concretas para frenar, calmarte y elegir el recurso que necesitas en cada momento.',
    integrates: ['Freno de Mano'],
    situation: {
      story:
        'En una exposición grupal, un compañero no hizo su parte y el profesor les baja la nota a todos. Camila siente que va a explotar.',
      question: 'Si fueras Camila, ¿qué harías?',
      decisions: ['Uso una técnica para calmarme y luego hablo con él', 'Lo enfrento delante de todos', 'Me callo y me lo guardo'],
      arguments: [
        'Primero me calmo, después decido qué decir',
        'Tiene que saber que lo que hizo está mal ya',
        'Mejor no hacer problemas',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'Las técnicas de control no eliminan la emoción: te dan unos segundos para elegir qué hacer con ella.',
      'Semáforo: rojo (para), amarillo (piensa opciones), verde (actúa con la mejor).',
      'Respiración, grounding 5-4-3-2-1 y la regla de los 10 minutos funcionan mejor si las practicas antes de necesitarlas.',
    ],
    recommends: { text: 'Después de “Elige tu recurso”, revisa tu pensamiento en Hoy en Fácil.', activityId: 'conecta-la-reaccion' },
  },
  'bajo-presion': {
    id: 'bajo-presion',
    path: 'respuestas',
    title: 'Bajo Presión',
    courseCode: 'T09–T10',
    topic: 'Estrés y tipos de estrés',
    icon: 'gauge',
    description: 'Reconoce cómo se manifiesta el estrés en tu cuerpo, tu mente y tu conducta, y qué tipo de estrés estás viviendo.',
    isNew: true,
    situation: {
      story:
        'Es semana de parciales. Sofía tiene tres exámenes, un trabajo grupal y le duele la cabeza desde hace días. No puede dormir bien.',
      question: 'Si fueras Sofía, ¿qué harías?',
      decisions: ['Organizo mis pendientes y me doy pausas', 'Me quedo despierta toda la noche estudiando', 'Lo dejo todo porque no voy a poder'],
      arguments: [
        'Mi cuerpo me está avisando algo',
        'Descansar es perder tiempo',
        'Es demasiado, no tiene sentido intentarlo',
        'No sé bien por qué lo elijo',
      ],
    },
    orientation: [
      'El estrés es la respuesta del cuerpo ante una demanda. Un poco puede activarte (eustrés); mucho y por mucho tiempo, te desgasta (distrés).',
      'Según su duración, el estrés puede ser agudo (un momento puntual) o crónico (sostenido en el tiempo).',
      'Aparece en el cuerpo (tensión, dolor de cabeza), en la mente (preocupación) y en la conducta (irritabilidad, evitar cosas).',
    ],
    recommends: { text: 'Después de Bajo Presión, prueba “Vuelve a tu centro” en Toma el Mando.', activityId: 'vuelve-a-tu-centro' },
  },
};

export const PA3_MODULE_LIST: readonly Pa3Module[] = PA3_MODULE_IDS.map((id) => PA3_MODULES[id]);

export function isPa3ModuleId(value: unknown): value is Pa3ModuleId {
  return typeof value === 'string' && (PA3_MODULE_IDS as readonly string[]).includes(value);
}
