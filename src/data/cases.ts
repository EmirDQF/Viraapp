/**
 * Laboratorio de casos: personajes de películas y series analizados con las 4 preguntas del curso
 * (impulsos; pensamientos, emociones y reacciones; frustración; técnica de control).
 * Los resúmenes están escritos con palabras propias, sin citas ni fragmentos de guion.
 * La respuesta correcta se escribe en la posición 0 y el cargador mezcla las opciones.
 */
import { z } from 'zod';

import { MODULE_ORDER } from '@/data/modules/catalog';
import { quizQuestionSchema } from '@/data/modules/schema';
import { shuffleQuestion } from '@/lib/quiz';
import type { QuizQuestion } from '@/types/content';
import type { ModuleId } from '@/types/game';

export interface CaseStudy {
  readonly id: string;
  readonly character: string;
  readonly work: string;
  readonly format: 'película' | 'serie';
  readonly year: number;
  /** Módulo relacionado: da el color del caso. */
  readonly moduleId: ModuleId;
  /** Aviso breve cuando la historia toca temas duros. */
  readonly sensitive?: string;
  readonly summary: string;
  /** Las 4 preguntas del curso, en orden: impulsos, triángulo, frustración y técnica. */
  readonly questions: readonly [QuizQuestion, QuizQuestion, QuizQuestion, QuizQuestion];
  readonly feedback: string;
  readonly challenge: string;
}

/** Las 4 preguntas del trabajo del curso, en el mismo orden que `questions`. */
export const CASE_QUESTION_TITLES = [
  '¿Qué impulsos observas?',
  '¿Qué pensamientos, emociones y reacciones aparecen?',
  '¿Cómo se manifiesta la frustración?',
  '¿Qué técnica de control le ayudaría?',
] as const;

const RAW_CASES: readonly CaseStudy[] = [
  {
    id: 'intensamente-riley',
    character: 'Riley',
    work: 'Intensamente',
    format: 'película',
    year: 2015,
    moduleId: 'descarga',
    summary:
      'Riley tiene 11 años y se muda con sus papás a una ciudad nueva. Extraña a sus amigos, su equipo y su casa, pero intenta mostrarse siempre contenta. Mientras por dentro sus emociones pierden el equilibrio, el enojo toma el mando y la lleva a planear escaparse sola de vuelta a su antigua ciudad.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Escaparse de casa sin avisar y responder de mala manera a sus papás', 'Estudiar más para el colegio', 'Pedir ayuda a su familia desde el inicio'], answer: 0, why: 'Huir y contestar mal son impulsos de escape y agresión: buscan quitar el malestar rápido.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «aquí nada me sale bien»; siente tristeza y enojo; reacciona alejándose', 'Piensa «todo va perfecto»; siente calma; reacciona con paciencia', 'No piensa nada; no siente nada; no reacciona'], answer: 0, why: 'El pensamiento negativo alimenta tristeza y enojo, y eso empuja a la conducta de huir.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['Al tener que fingir alegría cuando no la siente y no poder volver a su vida anterior', 'Al ganar un partido', 'Al recibir un regalo'], answer: 0, why: 'La frustración nace del bloqueo: quiere lo de antes y no puede tenerlo.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Ponerle nombre a lo que siente y contárselo a sus papás (pedir apoyo)', 'Guardar todo y seguir fingiendo', 'Escaparse más lejos'], answer: 0, why: 'Nombrar la emoción y compartirla baja su intensidad. La tristeza también sirve: pide apoyo.' },
    ],
    feedback: 'Riley no necesitaba estar feliz todo el tiempo: necesitaba permiso para estar triste. Cuando por fin lo dice, su familia puede ayudarla.',
    challenge: 'Hoy, cuando alguien te pregunte cómo estás, responde con una emoción real en lugar de «bien».',
  },
  {
    id: 'whiplash-andrew',
    character: 'Andrew',
    work: 'Whiplash',
    format: 'película',
    year: 2014,
    moduleId: 'enfriador',
    summary:
      'Andrew es un joven baterista que sueña con ser de los mejores. Su profesor lo presiona con dureza y humillaciones. Andrew practica hasta lastimarse las manos, deja a su pareja para concentrarse solo en la música y, tras un accidente, llega herido a una presentación y termina explotando contra su profesor en pleno escenario.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Practicar sin descanso hasta lastimarse, cortar relaciones de golpe y atacar a su profesor', 'Descansar cuando está cansado', 'Hablar con calma de lo que le molesta'], answer: 0, why: 'Hay impulsos de sobreesfuerzo, de abandonar relaciones y de agresión.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «si no soy el mejor, no valgo nada»; siente ansiedad y rabia; reacciona exigiéndose al extremo', 'Piensa «puedo aprender a mi ritmo»; siente calma; reacciona con equilibrio', 'Piensa «la música no me importa»; siente aburrimiento; reacciona dejando la batería'], answer: 0, why: 'Un pensamiento de todo o nada dispara ansiedad y rabia, y empuja a conductas extremas.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['En el cuerpo (manos heridas, tensión), en pensamientos rígidos y en explosiones de ira', 'Con risas y relajación', 'No se frustra nunca'], answer: 0, why: 'La frustración se ve en el cuerpo, en lo que piensa y en lo que hace.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Reestructuración cognitiva: cambiar «soy perfecto o no valgo» por una meta exigente pero humana', 'Practicar aún más horas', 'No volver a tocar nunca'], answer: 0, why: 'Revisar el pensamiento de todo o nada le permitiría seguir su sueño sin destruirse.' },
    ],
    feedback: 'Querer ser excelente está bien; creer que solo vales si eres perfecto te quema. La exigencia sana deja espacio para descansar y equivocarte.',
    challenge: 'Elige una meta tuya y reescríbela como «quiero mejorar en…» en lugar de «tengo que ser el mejor en…».',
  },
  {
    id: 'coco-miguel',
    character: 'Miguel',
    work: 'Coco',
    format: 'película',
    year: 2017,
    moduleId: 'freno',
    summary:
      'Miguel ama la música, pero en su familia está prohibida. El día que su abuela rompe su guitarra, él sale corriendo enojado y, para participar en un concurso, toma sin permiso la guitarra de su ídolo. Esa decisión lo mete en una aventura llena de problemas en el mundo de los muertos.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Salir corriendo de casa enojado y tomar algo ajeno sin pensar en las consecuencias', 'Practicar a escondidas con calma', 'Pedirle a su familia que lo escuche'], answer: 0, why: 'Huir y tomar la guitarra son impulsos que nacen del enojo y la urgencia.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «nadie me entiende, tengo que hacerlo ya»; siente rabia e injusticia; reacciona escapando', 'Piensa «tienen razón en todo»; siente alivio; reacciona obedeciendo', 'Piensa «me da igual»; no siente nada; no reacciona'], answer: 0, why: 'El pensamiento de urgencia y la sensación de injusticia empujan a la acción impulsiva.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['Cuando su familia rompe su guitarra y le prohíbe lo que más quiere', 'Cuando gana el concurso', 'Cuando come con su familia'], answer: 0, why: 'La frustración aparece cuando un deseo importante se bloquea.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['STOP y luego comunicación asertiva: decir lo que siente y lo que necesita', 'Tomar decisiones más rápido', 'Callarse para siempre'], answer: 0, why: 'Pausar y luego hablar con claridad le habría ahorrado muchos problemas.' },
    ],
    feedback: 'El deseo de Miguel era valioso; lo que le trajo problemas fue decidir en caliente. Al final, hablar con su familia es lo que cambia las cosas.',
    challenge: 'Piensa en algo que quieras y que alguien no entiende. Escribe cómo se lo dirías con calma, empezando por «Para mí es importante…».',
  },
  {
    id: 'encanto-mirabel',
    character: 'Mirabel y Luisa',
    work: 'Encanto',
    format: 'película',
    year: 2021,
    moduleId: 'ancla',
    summary:
      'En la familia Madrigal todos tienen un don mágico, menos Mirabel, que se siente invisible. Su hermana Luisa, la fuerte, carga con todo y por dentro está agotada. Cuando la casa empieza a agrietarse, la tensión entre Mirabel y su abuela crece hasta que ambas explotan en una discusión.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Responder con enojo en la discusión y querer demostrar su valor a toda costa', 'Descansar y pedir ayuda a tiempo', 'Celebrar a su familia'], answer: 0, why: 'Mirabel actúa por impulso de demostrar y defenderse; Luisa por impulso de no fallar nunca.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «no soy suficiente»; siente tristeza y rabia; reacciona enfrentándose', 'Piensa «soy suficiente tal como soy»; siente paz; reacciona con calma', 'Piensa «nada me importa»; no siente; se va'], answer: 0, why: 'El pensamiento «no soy suficiente» enciende tristeza y enojo, y lleva al choque.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['En la presión de cumplir expectativas, el cansancio de Luisa y las grietas en la relación familiar', 'En lo bien que la pasan', 'No hay frustración'], answer: 0, why: 'La frustración se acumula cuando sientes que nunca es suficiente.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Pedir y dar apoyo: hablar de cómo se sienten y repartir la carga', 'Que Luisa cargue todavía más', 'Que Mirabel se aísle'], answer: 0, why: 'Cuando la familia se escucha, la casa (y la relación) se reconstruye.' },
    ],
    feedback: 'Tu valor no depende de un don ni de cuánto cargas. Pedir ayuda no te hace menos fuerte: te hace humana.',
    challenge: 'Identifica una carga que llevas sola o solo. Escríbele hoy a alguien de confianza para compartirla o pedir una mano.',
  },
  {
    id: 'joker-arthur',
    character: 'Arthur',
    work: 'Joker',
    format: 'película',
    year: 2019,
    moduleId: 'muro',
    sensitive: 'Este caso menciona violencia. Si te remueve algo, puedes saltarlo o hablar con alguien de confianza.',
    summary:
      'Arthur sueña con ser comediante, pero vive aislado, sufre burlas constantes y pierde su trabajo y el apoyo que recibía. Sin una red que lo sostenga, su frustración y su resentimiento se acumulan durante mucho tiempo hasta que termina reaccionando con violencia.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Reacciones agresivas cuando se siente humillado', 'Respirar antes de responder', 'Buscar ayuda en cuanto se siente mal'], answer: 0, why: 'Ante la humillación, el impulso agresivo toma el control.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «a nadie le importo»; siente soledad y resentimiento; reacciona con violencia', 'Piensa «hay gente que puede ayudarme»; siente esperanza; reacciona pidiendo apoyo', 'Piensa «todo está bien»; siente alegría; reacciona riendo'], answer: 0, why: 'Los pensamientos de abandono alimentan el resentimiento y la reacción violenta.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['Se acumula por meses: aislamiento, burlas, pérdida de apoyo, hasta que explota', 'Aparece una vez y se va', 'No siente frustración'], answer: 0, why: 'La frustración no expresada ni atendida crece hasta desbordarse.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Buscar ayuda profesional y una red de apoyo antes de llegar al límite', 'Aguantar solo hasta el final', 'Responder igual a quien lo lastima'], answer: 0, why: 'Ninguna técnica reemplaza el apoyo de personas y profesionales. Pedirlo a tiempo es clave.' },
    ],
    feedback: 'La historia de Arthur muestra lo que pasa cuando el dolor no encuentra apoyo. Nada justifica la violencia, y por eso pedir ayuda a tiempo importa tanto.',
    challenge: 'Revisa tus contactos de apoyo en VIRA. Si tienes menos de dos, piensa en alguien a quien podrías agregar.',
  },
  {
    id: 'breaking-bad-walter',
    character: 'Walter White',
    work: 'Breaking Bad',
    format: 'serie',
    year: 2008,
    moduleId: 'hoy',
    summary:
      'Walter es un profesor de química que siente que la vida no le dio el reconocimiento que merecía. Tras un diagnóstico grave, empieza a tomar decisiones cada vez más arriesgadas e ilegales. Cada paso lo justifica diciendo que es por su familia, aunque cada vez más lo mueven el orgullo y el resentimiento.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Tomar decisiones arriesgadas por orgullo y no poder detenerse una vez que empieza', 'Pedir consejo antes de decidir', 'Aceptar ayuda de otros'], answer: 0, why: 'El impulso de demostrar su valor lo lleva a escalar sin frenar.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «me deben respeto»; siente resentimiento y orgullo herido; reacciona arriesgándolo todo', 'Piensa «estoy en paz con mi vida»; siente gratitud; reacciona con calma', 'Piensa «no merezco nada»; siente vergüenza; se esconde'], answer: 0, why: 'El resentimiento guiado por el orgullo empuja a decisiones cada vez más extremas.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['En sentir que su talento no fue reconocido y en rechazar la ayuda que le ofrecen', 'En que todo le sale bien', 'No se frustra'], answer: 0, why: 'La frustración acumulada por años se mezcla con orgullo y lo vuelve rígido.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Solución de problemas en 5 pasos: definir el problema y evaluar varias alternativas legales', 'Seguir subiendo la apuesta', 'Decidir solo y en secreto'], answer: 0, why: 'Ver varias opciones con calma le habría mostrado caminos que no destruían a su familia.' },
    ],
    feedback: 'Walter muestra cómo pequeñas decisiones impulsivas, sumadas, pueden llevarte muy lejos de quien eras. Frenar a tiempo es más fácil que volver.',
    challenge: 'Piensa en un problema actual y escribe tres soluciones distintas antes de elegir una.',
  },
  {
    id: 'lobo-wall-street-jordan',
    character: 'Jordan Belfort',
    work: 'El lobo de Wall Street',
    format: 'película',
    year: 2013,
    moduleId: 'enfriador',
    sensitive: 'Este caso menciona excesos y consumo de sustancias.',
    summary:
      'Jordan es un corredor de bolsa que se hace millonario con engaños. Vive buscando más dinero, más fiestas y más excesos, y cada vez necesita algo más fuerte para sentirse bien. Aunque las señales de peligro son claras, no logra detenerse hasta que todo se derrumba.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Gastar sin control, buscar excesos y querer siempre más, ya', 'Ahorrar con un plan', 'Esperar antes de decidir'], answer: 0, why: 'Son impulsos de gratificación inmediata: compras, excesos y riesgo.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «me lo merezco todo y ahora»; siente euforia y luego vacío; reacciona buscando más', 'Piensa «puedo esperar»; siente calma; reacciona con prudencia', 'Piensa «no necesito nada»; siente paz; reacciona con moderación'], answer: 0, why: 'La euforia pasa y deja vacío, y el vacío pide otra dosis de recompensa.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['Cuando algo lo frena, reacciona con rabia y busca otro escape aún más fuerte', 'Acepta los límites con calma', 'No tiene límites, así que no se frustra'], answer: 0, why: 'La baja tolerancia a la frustración hace que cualquier freno se sienta insoportable.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['La regla de los 10 minutos y demorar la gratificación', 'Comprar antes de que se acabe', 'Subir la recompensa cada vez'], answer: 0, why: 'Esperar antes de actuar baja el empuje de la dopamina y te devuelve la decisión.' },
    ],
    feedback: 'Más nunca es suficiente cuando el impulso decide. Aprender a esperar es lo que te devuelve el control.',
    challenge: 'La próxima vez que quieras comprar algo no planificado, espera 10 minutos y anota si lo sigues queriendo.',
  },
  {
    id: 'bojack-horseman',
    character: 'BoJack',
    work: 'BoJack Horseman',
    format: 'serie',
    year: 2014,
    moduleId: 'muro',
    sensitive: 'Este caso menciona consumo de alcohol y autodestrucción.',
    summary:
      'BoJack fue una estrella de televisión y ahora vive del recuerdo de esa fama. Se siente vacío y, cuando algo le duele, actúa por impulso: dice cosas que hieren, se aleja de quienes lo quieren y busca escapes que lo dañan. Después se arrepiente, pero le cuesta cambiar el patrón.',
    questions: [
      { prompt: CASE_QUESTION_TITLES[0], options: ['Decir cosas hirientes, sabotear sus relaciones y buscar escapes dañinos', 'Pedir perdón y cambiar de inmediato', 'Planificar su día con calma'], answer: 0, why: 'Son impulsos de herir, huir y escapar del malestar.' },
      { prompt: CASE_QUESTION_TITLES[1], options: ['Piensa «soy una mala persona y no puedo cambiar»; siente culpa y vacío; reacciona dañándose', 'Piensa «puedo aprender de mis errores»; siente esperanza; reacciona reparando', 'Piensa «todo me sale bien»; siente orgullo; reacciona con calma'], answer: 0, why: 'El pensamiento «no puedo cambiar» alimenta la culpa y repite el ciclo.' },
      { prompt: CASE_QUESTION_TITLES[2], options: ['Cuando las cosas no salen como espera, se culpa, se enoja y se aísla', 'Nunca le pasa nada malo', 'Se frustra pero lo habla siempre'], answer: 0, why: 'La frustración se vuelve contra sí mismo y contra los demás.' },
      { prompt: CASE_QUESTION_TITLES[3], options: ['Reestructuración cognitiva y buscar apoyo profesional', 'Seguir solo con lo mismo', 'Culpar a todos los demás'], answer: 0, why: 'Revisar el pensamiento «no puedo cambiar» y pedir ayuda abre la puerta al cambio.' },
    ],
    feedback: 'Equivocarte no te define; repetir sin pedir ayuda sí te atrapa. Cambiar es posible, paso a paso y acompañado.',
    challenge: 'Escribe un error reciente y, al lado, una acción pequeña para repararlo o aprender de él.',
  },
];

const caseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  character: z.string().min(1),
  work: z.string().min(1),
  format: z.enum(['película', 'serie']),
  year: z.number().int().min(1900).max(2100),
  moduleId: z.enum(MODULE_ORDER as [string, ...string[]]),
  sensitive: z.string().min(1).optional(),
  summary: z.string().min(80),
  questions: z.tuple([quizQuestionSchema, quizQuestionSchema, quizQuestionSchema, quizQuestionSchema]),
  feedback: z.string().min(1),
  challenge: z.string().min(1),
});

/** Valida todos los casos (falla con un error claro si alguno está mal formado). */
export function validateCases(cases: readonly unknown[]): void {
  cases.forEach((item, index) => {
    const parsed = caseSchema.safeParse(item);
    if (!parsed.success) throw new Error(`Caso ${index} inválido: ${parsed.error.issues[0]?.message ?? 'error desconocido'}`);
  });
}

validateCases(RAW_CASES);

/** Casos listos para jugar: opciones mezcladas de forma determinista. */
export const CASES: readonly CaseStudy[] = RAW_CASES.map((study) => ({
  ...study,
  questions: study.questions.map((question, index) => shuffleQuestion(question, `${study.id}-${index}`)) as unknown as CaseStudy['questions'],
}));

export function getCase(id: string): CaseStudy | undefined {
  return CASES.find((study) => study.id === id);
}
