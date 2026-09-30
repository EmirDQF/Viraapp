import type { CrucibleCategory } from '@/types/legacy';

export const burnoutCrucible: CrucibleCategory = {
  id: 'burnout',
  title: 'Burnout Profesional',
  tagline: 'Cuando el trabajo te consume más de lo que te da.',
  examples: ['Sobrecarga laboral', 'Estancamiento', 'Ambientes hostiles'],
  content: {
    diagnosis: {
      headline: 'Batería vacía en modo supervivencia',
      body:
        'El burnout aparece cuando la demanda supera tus recursos durante demasiado tiempo: agotamiento, cinismo y sensación de ineficacia. No es debilidad; es un sistema sobrecargado. Tu camino es recuperar límites, cuestionar la exigencia de estar siempre disponible y reponer energía con acciones pequeñas y protegidas.',
    },
    sortCards: [
      { id: 'b1', text: 'La cantidad de correos que me envían', zone: 'no-control', explanation: 'No controlas lo que llega, pero sí cuándo lo revisas.' },
      { id: 'b2', text: 'Revisar el correo solo dos veces al día', zone: 'control', explanation: 'Definir ventanas de revisión es un límite que tú fijas.' },
      { id: 'b3', text: 'El carácter de mi jefe/a', zone: 'no-control', explanation: 'Su personalidad no depende de ti; tu forma de responder sí.' },
      { id: 'b4', text: 'Decir "hoy no llego, lo entrego mañana"', zone: 'control', explanation: 'Negociar plazos es una habilidad que puedes practicar.' },
      { id: 'b5', text: 'La reestructuración de la empresa', zone: 'no-control', explanation: 'Las decisiones corporativas están fuera de tu alcance.' },
      { id: 'b6', text: 'Tomar mi hora de almuerzo lejos del escritorio', zone: 'control', explanation: 'Una pausa real recarga más que comer trabajando.' },
      { id: 'b7', text: 'Que valoren mi esfuerzo', zone: 'no-control', explanation: 'El reconocimiento externo no está garantizado. Tu propio registro sí.' },
      { id: 'b8', text: 'Actualizar mi CV esta semana', zone: 'control', explanation: 'Abrir opciones reduce la sensación de estar atrapado/a.' },
    ],
    distortions: [
      {
        id: 'bd1',
        thought: 'Debería poder con todo; si no, soy un mal profesional.',
        options: ['should-statements', 'catastrophizing', 'mind-reading'],
        correct: 'should-statements',
        explanation: 'El "debería poder con todo" es una exigencia rígida que ignora tus límites humanos.',
      },
      {
        id: 'bd2',
        thought: 'El proyecto salió mal por mi culpa, aunque éramos seis.',
        options: ['overgeneralization', 'personalization', 'emotional-reasoning'],
        correct: 'personalization',
        explanation: 'Los resultados de equipo dependen de muchas personas y factores.',
      },
    ],
    reframe: {
      automaticThought: 'Si pongo un límite, me van a despedir.',
      blocks: [
        { id: 'r1', text: 'Poner un límite claro' },
        { id: 'r2', text: 'con respeto' },
        { id: 'r3', text: 'protege la calidad' },
        { id: 'r4', text: 'de mi trabajo.' },
        { id: 'x1', text: 'es egoísta' },
        { id: 'x2', text: 'y seguro me echan.' },
      ],
      correctOrder: ['r1', 'r2', 'r3', 'r4'],
      explanation: 'Los límites sostenibles mejoran tu rendimiento a largo plazo; no son una amenaza a tu puesto.',
    },
    mantras: [
      'Descansar también es trabajar en mí.',
      'Mi valor no se mide en horas extra.',
      'Un límite hoy es energía mañana.',
    ],
    microChallenges: [
      { id: 'bmc1', title: 'Cierre consciente', description: 'Escribe las 3 tareas de mañana y cierra la laptop.', durationSec: 120 },
      { id: 'bmc2', title: 'Pausa sin pantalla', description: 'Aléjate del escritorio y mira por una ventana dos minutos.', durationSec: 120 },
      { id: 'bmc3', title: 'Límite en borrador', description: 'Redacta cómo pedirías mover un plazo no urgente.', durationSec: 120 },
      { id: 'bmc4', title: 'Silencio de notificaciones', description: 'Desactiva las notificaciones de trabajo fuera de horario.', durationSec: 120 },
    ],
    rules: [
      { id: 'br1', text: 'No respondo mensajes de trabajo después de mi horario.' },
      { id: 'br2', text: 'Tomo al menos una pausa real cada 90 minutos.' },
      { id: 'br3', text: 'Digo "déjame revisarlo" antes de aceptar algo nuevo.' },
      { id: 'br4', text: 'Mi fin de semana tiene al menos un bloque sin trabajo.' },
      { id: 'br5', text: 'Registro un logro al final de cada día.' },
      { id: 'br6', text: 'No decido renunciar en mi peor día.' },
    ],
    weeklyActions: [
      'Define una hora fija de cierre y respétala.',
      'Delega o pospone una tarea no esencial.',
      'Sal a caminar 10 minutos en tu pausa.',
      'Habla con un colega de confianza sobre tu carga.',
      'Actualiza una línea de tu CV o perfil profesional.',
      'Dedica una hora a algo que no tenga que ver con tu trabajo.',
      'Revisa qué límite funcionó mejor esta semana.',
    ],
  },
};
