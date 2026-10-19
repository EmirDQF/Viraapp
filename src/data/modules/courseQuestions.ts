/**
 * Preguntas propias que cubren los 4 ejes del curso "Desarrollo de Resiliencia" (impulsos; pensamiento →
 * emoción → reacción; frustración; técnicas de control). Se suman a las rondas de cada módulo antes del
 * relleno heredado, así cada ronda tiene al menos 8 preguntas propias. Base: TCC y DBT, sin diagnosticar.
 */
import type { QuizQuestion } from '@/types/content';
import type { ModuleId } from '@/types/game';

export type CourseAxis = 'impulsos' | 'pensamientos' | 'frustracion' | 'tecnicas';

type Rounds = readonly [readonly QuizQuestion[], readonly QuizQuestion[], readonly QuizQuestion[]];

/** Ejes del curso que trabaja cada módulo (para el test de cobertura). */
export const MODULE_AXES: Readonly<Record<ModuleId, readonly CourseAxis[]>> = {
  freno: ['impulsos', 'tecnicas'],
  enfriador: ['frustracion', 'impulsos', 'tecnicas'],
  descarga: ['pensamientos', 'frustracion'],
  muro: ['pensamientos', 'tecnicas'],
  ancla: ['tecnicas', 'frustracion'],
  hoy: ['tecnicas', 'impulsos', 'pensamientos'],
};

const freno: Rounds = [
  [
    { prompt: '¿Qué es un impulso?', options: ['Unas ganas fuertes y rápidas de actuar ya, sin pensar', 'Una decisión tomada con calma', 'Un rasgo que no se puede cambiar'], answer: 0, why: 'Un impulso es un empuje rápido a actuar. Sentirlo es normal; lo que decides hacer con él es tu parte.' },
    { prompt: 'La "curva del impulso" dice que las ganas…', options: ['Suben, llegan a un pico y luego bajan solas', 'Siempre suben hasta que actúas', 'Desaparecen si las ignoras un segundo'], answer: 0, why: 'Como una ola: suben, llegan al pico y bajan. Si esperas, el pico pasa.' },
    { prompt: '¿Qué significa la S de la técnica STOP?', options: ['Para (detente)', 'Sigue', 'Sonríe'], answer: 0, why: 'STOP: Para, Toma aire, Observa y Prosigue con intención.' },
    { prompt: 'En STOP, la O de "Observa" te pide…', options: ['Notar qué piensas, sientes y quieres hacer', 'Mirar el celular', 'Observar a quién culpar'], answer: 0, why: 'Observar es tomar distancia: "estoy pensando…, siento…, tengo ganas de…".' },
    { prompt: 'Un impulso agresivo suele empezar con…', options: ['Calor en la cara, puños apretados y ganas de gritar', 'Sueño y bostezos', 'Hambre'], answer: 0, why: 'El cuerpo avisa primero. Reconocer esas señales te da tiempo de frenar.' },
  ],
  [
    { prompt: 'Contar hasta 10 antes de responder funciona porque…', options: ['Le da segundos a tu cuerpo para bajar la activación', 'Confunde a la otra persona', 'Es una regla de cortesía'], answer: 0, why: 'Unos segundos bastan para que la emoción baje un poco y pienses mejor.' },
    { prompt: '¿Qué es el "tiempo fuera"?', options: ['Alejarte un momento de la situación para calmarte y luego volver', 'Dejar de hablarle a alguien para siempre', 'Un castigo'], answer: 0, why: 'Es una pausa acordada: "Necesito unos minutos, ya vuelvo". Lo importante es volver.' },
    { prompt: 'Un disparador (gatillo) de un impulso es…', options: ['Lo que lo enciende: una persona, un lugar, una emoción o una hora', 'La consecuencia del impulso', 'Un tipo de respiración'], answer: 0, why: 'Conocer tus disparadores te permite anticiparte.' },
    { prompt: '"Tengo ganas de decir algo hiriente". ¿Qué te ayuda más?', options: ['Aplicar STOP y decidir si lo que dirás ayuda o solo hiere', 'Decirlo rápido para soltarlo', 'Escribirlo en el grupo'], answer: 0, why: 'Las palabras hirientes no se pueden borrar. Pausar te protege a ti y a la relación.' },
    { prompt: 'Después de un STOP, "Prosigue" significa…', options: ['Actuar eligiendo lo que te acerca a lo que quieres', 'Hacer lo que ibas a hacer igual', 'Olvidarte del tema'], answer: 0, why: 'Prosigues con intención, no en automático.' },
    { prompt: 'Comunicación asertiva es…', options: ['Decir lo que necesitas con claridad y respeto', 'Callarte para evitar problemas', 'Ganar la discusión a toda costa'], answer: 0, why: 'Asertivo es ni pasivo ni agresivo: claro, firme y respetuoso.' },
  ],
  [
    { prompt: '¿Cuál es un mensaje asertivo?', options: ['"Me molestó que llegaras tarde; la próxima avísame, por favor"', '"Siempre haces lo mismo, eres un desastre"', '"No pasa nada" (aunque sí pasa)'], answer: 0, why: 'Habla de un hecho, de lo que sientes y de lo que pides, sin atacar.' },
    { prompt: 'Sientes el impulso en su pico. ¿Qué haces?', options: ['Esperar y respirar: el pico es el momento más intenso y luego baja', 'Actuar ya, porque nunca va a bajar', 'Pelear contra la sensación'], answer: 0, why: 'El pico es temporal. Si no actúas en él, la ola baja.' },
    { prompt: 'Frenar un impulso varias veces hace que…', options: ['Tu cerebro aprenda que puede esperar y cada vez cueste menos', 'Te vuelvas más impulsivo', 'Nada cambie'], answer: 0, why: 'El autocontrol se entrena como un músculo.' },
    { prompt: 'Si alguna vez no lograste frenar, lo más útil es…', options: ['Revisar qué pasó sin castigarte y planear qué harás distinto', 'Pensar que no sirves para esto', 'Dejar de intentarlo'], answer: 0, why: 'Un tropiezo es información, no un fracaso. Aprender de él es parte del proceso.' },
    { prompt: 'Las autoinstrucciones son…', options: ['Frases que te dices para guiarte: "Tranquilo, paso a paso"', 'Órdenes que das a otros', 'Instrucciones de un manual'], answer: 0, why: 'Hablarte con calma y en concreto guía tu conducta en momentos difíciles.' },
  ],
];

const enfriador: Rounds = [
  [
    { prompt: '¿Qué es la frustración?', options: ['La emoción que aparece cuando algo que quieres se bloquea o no sale', 'Un defecto de personalidad', 'Algo que solo sienten los débiles'], answer: 0, why: 'La frustración es una emoción normal ante un obstáculo. Lo importante es cómo la manejas.' },
    { prompt: '¿Cómo se manifiesta la frustración en el cuerpo?', options: ['Tensión, calor, respiración rápida, ganas de golpear o tirar algo', 'Relajación profunda', 'Ganas de dormir siempre'], answer: 0, why: 'El cuerpo se prepara para pelear contra el obstáculo.' },
    { prompt: 'Un pensamiento típico de la frustración es…', options: ['"¡Esto no debería pasarme a mí! ¡Es injusto!"', '"Qué interesante, voy a probar otra forma"', '"No me importa nada"'], answer: 0, why: 'Las exigencias rígidas ("debería") avivan la frustración.' },
    { prompt: 'Una conducta frecuente cuando estás frustrado es…', options: ['Abandonar, explotar o buscar algo que te dé placer rápido', 'Planificar con calma', 'Pedir feedback'], answer: 0, why: 'Reconocer tu conducta típica te ayuda a elegir otra.' },
    { prompt: 'La "baja tolerancia a la frustración" es…', options: ['Sentir que no puedes soportar la incomodidad y querer quitarla ya', 'No sentir nunca frustración', 'Ser muy paciente'], answer: 0, why: 'Se puede entrenar: tolerar un poco más de incomodidad cada vez.' },
  ],
  [
    { prompt: 'La regla de los 10 minutos dice…', options: ['Ante un impulso, espera 10 minutos antes de decidir', 'Haz todo en 10 minutos', 'Duerme 10 minutos'], answer: 0, why: 'Demorar la gratificación da tiempo a que baje el impulso y decidas con calma.' },
    { prompt: '¿Qué es "surfear el impulso" (urge surfing)?', options: ['Observar las ganas como una ola, sin pelear ni obedecer, hasta que bajen', 'Hacer surf', 'Distraerte con el celular'], answer: 0, why: 'Notas dónde está la sensación en el cuerpo y respiras con ella hasta que pasa.' },
    { prompt: 'Un impulso de compra suele aparecer cuando…', options: ['Estás aburrido, triste o ves una oferta "por tiempo limitado"', 'Tienes una lista planificada', 'Ya ahorraste para eso'], answer: 0, why: 'Las ofertas urgentes y las emociones incómodas empujan a comprar sin pensar.' },
    { prompt: 'Un impulso digital (scrollear sin parar) se reduce si…', options: ['Pones el celular lejos y fijas un horario para redes', 'Te prometes "solo un video más"', 'Activas más notificaciones'], answer: 0, why: 'Cambiar el entorno funciona mejor que la pura fuerza de voluntad.' },
    { prompt: 'Para subir tu tolerancia a la frustración puedes…', options: ['Practicar quedarte un poco más con lo incómodo, en dosis pequeñas', 'Evitar todo lo difícil', 'Exigirte nunca fallar'], answer: 0, why: 'Como un entrenamiento: poco a poco, la incomodidad se vuelve manejable.' },
    { prompt: 'Comer por impulso cuando estás estresado se llama…', options: ['Hambre emocional', 'Hambre física', 'Dieta'], answer: 0, why: 'El hambre emocional llega de golpe y pide algo específico; la física crece poco a poco.' },
  ],
  [
    { prompt: 'Un reto de la universidad no te sale y quieres tirar todo. ¿Qué pensamiento ayuda?', options: ['"Esto es difícil, no imposible. ¿Qué parte sí puedo hacer?"', '"Soy un inútil"', '"Nunca me sale nada"'], answer: 0, why: 'Cambiar "imposible" por "difícil" baja la frustración y abre opciones.' },
    { prompt: 'El impulso de abandonar suele decir…', options: ['"Mejor lo dejo, no vale la pena"', '"Voy a intentarlo otra vez"', '"Pido ayuda"'], answer: 0, why: 'Reconocer esa voz te deja decidir si quieres hacerle caso.' },
    { prompt: '¿Qué hace la dopamina en un impulso?', options: ['Te empuja a buscar la recompensa rápida', 'Te da sueño', 'Te hace más paciente'], answer: 0, why: 'Promete placer inmediato. Esperar baja su empuje.' },
    { prompt: 'Después de esperar 10 minutos, todavía quieres comprar. ¿Qué haces?', options: ['Revisar si lo necesitas, si cabe en tu presupuesto y decidir con calma', 'Comprar dos', 'Sentirte culpable por quererlo'], answer: 0, why: 'Esperar no es prohibirte nada: es decidir tú, no el impulso.' },
    { prompt: 'Una frase de autoinstrucción ante la frustración es…', options: ['"Respira. Un paso a la vez. Puedo con esto."', '"¡Qué asco todo!"', '"Siempre me pasa lo peor"'], answer: 0, why: 'Hablarte con calma y en concreto guía lo que haces después.' },
  ],
];

const muro: Rounds = [
  [
    { prompt: 'El triángulo cognitivo une…', options: ['Pensamientos, emociones y conductas', 'Comer, dormir y estudiar', 'Pasado, presente y futuro'], answer: 0, why: 'Lo que piensas influye en lo que sientes y en lo que haces, y al revés.' },
    { prompt: 'Un pensamiento automático es…', options: ['Una idea rápida que aparece sola y se siente verdadera', 'Una conclusión pensada con calma', 'Un recuerdo feliz'], answer: 0, why: 'Aparecen solos. No siempre son ciertos: se pueden revisar.' },
    { prompt: '"Si me sale mal este examen, se arruina mi vida". ¿Qué distorsión es?', options: ['Catastrofizar', 'Pensamiento realista', 'Gratitud'], answer: 0, why: 'Catastrofizar es imaginar el peor final como si fuera seguro.' },
    { prompt: '"Seguro piensa que soy aburrido". ¿Qué distorsión es?', options: ['Leer la mente', 'Pensar en evidencia', 'Asertividad'], answer: 0, why: 'Suponer lo que otros piensan, sin pruebas.' },
    { prompt: '"O lo hago perfecto o soy un fracaso". ¿Qué distorsión es?', options: ['Todo o nada', 'Flexibilidad', 'Personalizar'], answer: 0, why: 'Ver todo en blanco o negro ignora los grises.' },
  ],
  [
    { prompt: '"Mis amigos están serios; seguro hice algo mal". ¿Qué distorsión es?', options: ['Personalizar', 'Observar con calma', 'Leer el contexto'], answer: 0, why: 'Personalizar es asumir que todo lo que pasa es por ti.' },
    { prompt: 'La reestructuración cognitiva tiene tres pasos:', options: ['Pensamiento → evidencia → pensamiento alternativo', 'Grito → portazo → silencio', 'Dormir → comer → olvidar'], answer: 0, why: 'Detectas el pensamiento, revisas las pruebas y construyes uno más justo.' },
    { prompt: 'Para revisar la evidencia te preguntas…', options: ['"¿Qué pruebas tengo a favor y en contra?"', '"¿Quién tiene la culpa?"', '"¿Cómo lo evito?"'], answer: 0, why: 'Como un detective: hechos, no suposiciones.' },
    { prompt: 'Si cambias "soy un fracaso" por "esta vez no salió, puedo aprender", la emoción…', options: ['Suele bajar de intensidad', 'Sube más', 'No cambia nada'], answer: 0, why: 'Un pensamiento más justo cambia cómo te sientes y lo que haces después.' },
    { prompt: 'Pensamiento: "Nadie me quiere". Emoción probable:', options: ['Tristeza y soledad', 'Euforia', 'Aburrimiento'], answer: 0, why: 'El pensamiento tiñe la emoción. Por eso vale revisarlo.' },
    { prompt: 'Un pensamiento alternativo debe ser…', options: ['Realista y basado en evidencia, no solo positivo', 'Siempre feliz', 'Lo contrario exacto'], answer: 0, why: 'No se trata de mentirte, sino de ver el cuadro completo.' },
  ],
  [
    { prompt: 'Pensamiento: "Me va a ir horrible en la exposición". ¿Qué conducta suele seguir?', options: ['Evitar prepararte o faltar', 'Practicar más', 'Pedir consejos'], answer: 0, why: 'Pensamiento → emoción (miedo) → conducta (evitar). Cambiar el pensamiento cambia la cadena.' },
    { prompt: 'Un pensamiento alternativo para "siempre arruino todo" es…', options: ['"A veces me equivoco y otras veces me sale bien; puedo mejorar"', '"Nunca me equivoco"', '"Soy un desastre total"'], answer: 0, why: '"Siempre" casi nunca es verdad. Busca los ejemplos que lo contradicen.' },
    { prompt: 'Escribir tus pensamientos en un registro sirve para…', options: ['Verlos desde fuera y revisarlos con calma', 'Olvidarlos', 'Culpar a otros'], answer: 0, why: 'En papel, el pensamiento pierde fuerza y se puede analizar.' },
    { prompt: '¿Las emociones son "malas"?', options: ['No: todas dan información; lo que importa es cómo actúas', 'Sí, hay que eliminarlas', 'Solo la alegría es buena'], answer: 0, why: 'Las emociones son señales. Las regulas, no las borras.' },
    { prompt: 'Recordar retos que ya superaste ayuda porque…', options: ['Es evidencia de que puedes con cosas difíciles', 'Te hace sentir superior', 'No ayuda'], answer: 0, why: 'Tu historia es la mejor prueba contra el "no puedo".' },
  ],
];

const ancla: Rounds = [
  [
    { prompt: 'El grounding 5-4-3-2-1 consiste en nombrar…', options: ['5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas', '5 problemas, 4 culpables, 3 quejas…', '5 contactos para llamar'], answer: 0, why: 'Usar los sentidos te trae al presente cuando la ansiedad te arrastra.' },
    { prompt: 'La respiración 4-7-8 es…', options: ['Inhalar 4 segundos, sostener 7 y exhalar 8', 'Respirar rápido 4 veces', 'Aguantar el aire lo más posible'], answer: 0, why: 'La exhalación larga ayuda a activar la calma del cuerpo.' },
    { prompt: 'La respiración cuadrada es…', options: ['Inhalar 4, sostener 4, exhalar 4, sostener 4', 'Respirar en una caja', 'Respirar solo por la boca'], answer: 0, why: 'Un ritmo parejo y fácil de recordar para bajar la activación.' },
    { prompt: 'La relajación muscular progresiva consiste en…', options: ['Tensar un grupo de músculos unos segundos y luego soltarlo', 'Hacer pesas', 'Quedarte quieto sin pensar'], answer: 0, why: 'Al soltar la tensión, notas la diferencia y el cuerpo se relaja.' },
    { prompt: 'Pedir ayuda cuando te sientes desbordado es…', options: ['Una estrategia de control y de fuerza', 'Una señal de debilidad', 'Molestar a los demás'], answer: 0, why: 'Apoyarte en otros es una habilidad resiliente.' },
  ],
  [
    { prompt: 'Sientes que la ansiedad te sube en un lugar lleno de gente. ¿Qué técnica usas?', options: ['Grounding 5-4-3-2-1 para volver al presente', 'Contener la respiración', 'Pensar en todo lo que puede salir mal'], answer: 0, why: 'Anclarte en los sentidos corta la espiral de preocupación.' },
    { prompt: 'Con la frustración llega la tensión en hombros y mandíbula. ¿Qué ayuda?', options: ['Relajación muscular progresiva', 'Apretar más fuerte', 'Ignorarlo'], answer: 0, why: 'Tensar y soltar enseña al cuerpo a relajarse.' },
    { prompt: 'Un buen mensaje para pedir apoyo es…', options: ['"¿Tienes 10 minutos? Estoy pasando un mal día y me ayudaría hablar"', '"Nadie me entiende"', 'No decir nada y esperar que adivinen'], answer: 0, why: 'Claro y concreto: la otra persona sabe cómo ayudarte.' },
    { prompt: 'La solución de problemas en 5 pasos empieza por…', options: ['Definir el problema con claridad', 'Elegir la primera idea', 'Culpar a alguien'], answer: 0, why: 'Definir → generar opciones → evaluar → elegir y actuar → revisar.' },
    { prompt: 'En la solución de problemas, "generar alternativas" significa…', options: ['Pensar varias opciones sin juzgarlas todavía', 'Quedarte con la primera', 'Pedir que otro lo resuelva'], answer: 0, why: 'Primero cantidad, después calidad.' },
    { prompt: '¿Cuándo es buen momento para practicar respiración?', options: ['También cuando estás tranquilo, para que salga fácil en crisis', 'Solo en una crisis', 'Nunca'], answer: 0, why: 'Lo que entrenas en calma está disponible cuando lo necesitas.' },
  ],
  [
    { prompt: 'El último paso de la solución de problemas es…', options: ['Revisar cómo salió y ajustar', 'Olvidarlo', 'Culparte si no salió perfecto'], answer: 0, why: 'Revisar convierte cada intento en aprendizaje.' },
    { prompt: 'Si un amigo explota de enojo, lo más útil es…', options: ['Hablar con calma, validar y darle espacio', 'Gritarle más fuerte', 'Burlarte'], answer: 0, why: 'La calma contagia. Desescalar empieza por ti.' },
    { prompt: 'Las líneas de ayuda sirven para…', options: ['Hablar con alguien preparado cuando sientes que no puedes más', 'Solo emergencias médicas', 'Nada'], answer: 0, why: 'Si sientes que corres peligro, llamar es un acto de cuidado.' },
    { prompt: 'Una red de apoyo sana incluye…', options: ['Personas con las que puedes ser tú y que te escuchan', 'Solo gente que te dice lo que quieres oír', 'Nadie'], answer: 0, why: 'Calidad sobre cantidad: con 2 o 3 personas de confianza basta.' },
    { prompt: 'Después de usar una técnica de calma, conviene…', options: ['Notar cuánto bajó la intensidad (por ejemplo, de 8 a 5)', 'Pensar que no sirvió si no llegó a 0', 'No volver a usarla'], answer: 0, why: 'Bajar un poco ya es un logro: no se trata de llegar a cero.' },
  ],
];

const hoy: Rounds = [
  [
    { prompt: 'El estrés académico aumenta los impulsos porque…', options: ['El cansancio reduce tu capacidad de frenar', 'Te da más energía', 'No tiene relación'], answer: 0, why: 'Cuando estás agotado, el autocontrol cuesta más. Cuidar el descanso también es estrategia.' },
    { prompt: 'Dividir una tarea grande en micropasos ayuda a…', options: ['Bajar la frustración y empezar', 'Hacerla más larga', 'Evitarla'], answer: 0, why: 'Un paso pequeño se siente posible y genera impulso positivo.' },
    { prompt: 'Postergar una tarea por ver "un video más" es…', options: ['Un impulso digital que busca alivio rápido', 'Descanso planificado', 'Productividad'], answer: 0, why: 'Reconocerlo te deja elegir: ¿descanso real o escape?' },
    { prompt: '"Tengo que hacerlo todo hoy" es un ejemplo de…', options: ['Pensamiento de todo o nada', 'Planificación realista', 'Autocuidado'], answer: 0, why: 'Elegir 3 prioridades es más realista y menos frustrante.' },
    { prompt: 'Antes de empezar el día, una autoinstrucción útil es…', options: ['"Primero lo primero: una tarea a la vez"', '"No voy a poder"', '"Lo hago después"'], answer: 0, why: 'Las autoinstrucciones claras guían la conducta.' },
  ],
  [
    { prompt: '¿Qué paso de la solución de problemas falta? Definir → … → Evaluar → Actuar → Revisar', options: ['Generar alternativas', 'Rendirse', 'Quejarse'], answer: 0, why: 'Sin opciones no hay qué evaluar.' },
    { prompt: 'Tienes 3 entregas y te bloqueas. ¿Qué haces primero?', options: ['Ordenarlas por fecha e importancia y empezar por la primera', 'Hacer las tres a la vez', 'No hacer ninguna'], answer: 0, why: 'Ordenar reduce la carga mental y la ansiedad.' },
    { prompt: 'Un descanso que sí recarga es…', options: ['Caminar, estirarte o respirar 5 minutos lejos de la pantalla', 'Scrollear una hora', 'Saltarte la comida'], answer: 0, why: 'Descansar de verdad devuelve energía para seguir.' },
    { prompt: 'Celebrar los avances pequeños sirve para…', options: ['Reforzar el hábito y la motivación', 'Perder el tiempo', 'Volverte arrogante'], answer: 0, why: 'Lo que se reconoce se repite.' },
    { prompt: 'Si hoy no cumpliste tu plan, ¿qué pensamiento ayuda?', options: ['"Hoy hice lo que pude; mañana ajusto el plan"', '"Soy un fracaso"', '"Para qué planificar"'], answer: 0, why: 'La autocompasión sostiene el cambio mejor que la autocrítica.' },
    { prompt: 'Practicar una técnica de control 5 minutos al día…', options: ['Hace que salga más fácil cuando la necesitas', 'No sirve de nada', 'Solo sirve en crisis'], answer: 0, why: 'La práctica diaria convierte la técnica en hábito.' },
  ],
  [
    { prompt: 'Integrar lo aprendido en tu día significa…', options: ['Usar STOP, respiración o la regla de 10 minutos en situaciones reales', 'Solo jugar en la app', 'Leer sin practicar'], answer: 0, why: 'Las técnicas sirven cuando las llevas a tu vida.' },
    { prompt: 'Para frenar el impulso de revisar el celular al estudiar…', options: ['Dejarlo en otra habitación durante bloques de 25 minutos', 'Tenerlo en la mano', 'Activar todas las notificaciones'], answer: 0, why: 'Quitar el disparador del entorno es la forma más fácil de autocontrol.' },
    { prompt: 'La frustración por una mala nota se maneja mejor si…', options: ['Validas la emoción, revisas qué falló y armas un plan', 'Te castigas', 'Culpas al profesor y no haces nada'], answer: 0, why: 'Sentir, entender y actuar: así la frustración se vuelve aprendizaje.' },
    { prompt: '¿Qué técnica usarías si la ansiedad no te deja dormir?', options: ['Respiración 4-7-8 o relajación muscular', 'Revisar redes', 'Tomar más café'], answer: 0, why: 'Calmar el cuerpo ayuda a que la mente lo siga.' },
    { prompt: 'Al terminar el día, revisar qué funcionó sirve para…', options: ['Aprender y ajustar mañana', 'Culparte', 'Nada'], answer: 0, why: 'La revisión diaria convierte la experiencia en mejora.' },
  ],
];

/** Preguntas de los ejes del curso para cada módulo. El Descarga ya tiene 30 propias (se respeta). */
export const COURSE_QUESTIONS: Partial<Readonly<Record<ModuleId, Rounds>>> = { freno, enfriador, muro, ancla, hoy };
