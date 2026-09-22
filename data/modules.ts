import type { CrucibleCategory, Module, ModuleId } from '../types';

export const MODULE_ORDER: readonly ModuleId[] = [
  'm1-acceptance',
  'm2-distortions',
  'm3-anchoring',
  'm4-micro-actions',
  'm5-manifesto',
];

const BREATH_PHASE_SECONDS = 4;
const BREATH_CYCLES = 3;
const ANCHOR_HOLD_MS = 3000;
const REQUIRED_RULES = 3;

export function buildModules(crucible: CrucibleCategory): readonly Module[] {
  const { content } = crucible;
  return [
    {
      id: 'm1-acceptance',
      order: 1,
      title: 'Descompresión y Aceptación Radical',
      subtitle: 'Separa lo que depende de ti',
      skill: 'Discriminar entre lo controlable y lo incontrolable',
      concept:
        'La aceptación radical no es rendirse: es dejar de gastar energía peleando contra lo que no puedes cambiar, para invertirla en lo que sí. Pregúntate siempre: "¿Esto depende de mí?"',
      xp: 20,
      exercises: [
        {
          kind: 'insight',
          id: 'm1-insight',
          title: 'Soltar para poder sostener',
          body:
            'Cuando todo se siente urgente, el cerebro intenta controlarlo todo y se agota. Hoy vas a clasificar situaciones reales de tu crisol. Cada tarjeta que sueltas es energía que recuperas.',
        },
        { kind: 'card-sort', id: 'm1-sort', title: '¿Bajo tu control o fuera de él?', cards: content.sortCards },
      ],
    },
    {
      id: 'm2-distortions',
      order: 2,
      title: 'Desarme de Distorsiones Cognitivas',
      subtitle: 'Detecta la trampa del pensamiento',
      skill: 'Identificar y reestructurar pensamientos automáticos',
      concept:
        'Los pensamientos automáticos no son hechos: son hipótesis rápidas que tu mente produce bajo estrés. Nombrar la distorsión (catastrofismo, blanco/negro...) le quita fuerza y abre espacio a una alternativa realista.',
      xp: 25,
      exercises: [
        {
          kind: 'insight',
          id: 'm2-insight',
          title: 'Tu mente exagera para protegerte',
          body:
            'Bajo presión, la mente toma atajos: imagina lo peor, ve todo en extremos o lee mentes. No es un defecto tuyo; es un sistema de alarma. Vamos a entrenar el ojo para detectar estas trampas.',
        },
        ...content.distortions.map((item, index) => ({
          kind: 'distortion' as const,
          id: `m2-distortion-${index}`,
          title: '¿Qué distorsión hay aquí?',
          case: item,
        })),
        { kind: 'reframe', id: 'm2-reframe', title: 'Reconstruye el pensamiento', case: content.reframe },
      ],
    },
    {
      id: 'm3-anchoring',
      order: 3,
      title: 'Anclaje y Regulación Nerviosa',
      subtitle: 'Calma el cuerpo, luego la mente',
      skill: 'Regular la activación fisiológica con respiración cuadrada',
      concept:
        'La respiración cuadrada (4-4-4-4) activa el sistema nervioso parasimpático y baja la alarma corporal. Un mantra breve funciona como ancla: una frase a la que volver cuando la ola sube.',
      xp: 20,
      exercises: [
        {
          kind: 'insight',
          id: 'm3-insight',
          title: 'El cuerpo primero',
          body:
            'No puedes razonar bien con el corazón a mil. Primero vas a regular tu respiración durante tres ciclos; después elegirás una frase ancla y la fijarás manteniendo el botón presionado.',
        },
        {
          kind: 'breathing',
          id: 'm3-breathing',
          title: 'Respiración cuadrada 4-4-4-4',
          phaseSeconds: BREATH_PHASE_SECONDS,
          cycles: BREATH_CYCLES,
        },
        {
          kind: 'anchor',
          id: 'm3-anchor',
          title: 'Fija tu mantra de anclaje',
          mantras: content.mantras,
          holdMs: ANCHOR_HOLD_MS,
        },
      ],
    },
    {
      id: 'm4-micro-actions',
      order: 4,
      title: 'Micro-Acciones de Tracción',
      subtitle: 'Dos minutos que rompen la inercia',
      skill: 'Activación conductual con compromisos mínimos',
      concept:
        'La motivación suele llegar después de actuar, no antes. Un micro-reto de dos minutos es tan pequeño que la mente no puede resistirse, y genera evidencia de que sí puedes moverte.',
      xp: 25,
      exercises: [
        {
          kind: 'insight',
          id: 'm4-insight',
          title: 'La acción precede a la motivación',
          body:
            'Esperar a "tener ganas" mantiene el bloqueo. Vas a elegir un reto de dos minutos, escribir tu compromiso y activarlo ahora mismo con el temporizador.',
        },
        { kind: 'micro-action', id: 'm4-action', title: 'Elige tu micro-reto de hoy', challenges: content.microChallenges },
      ],
    },
    {
      id: 'm5-manifesto',
      order: 5,
      title: 'Plan de Acción y Manifiesto',
      subtitle: 'Tu protocolo para días difíciles',
      skill: 'Diseñar un plan de afrontamiento personal',
      concept:
        'Decidir en calma cómo actuarás en la tormenta reduce la carga mental cuando llega. Tus reglas no negociables son acuerdos contigo que protegen tus decisiones en los peores días.',
      xp: 30,
      exercises: [
        {
          kind: 'insight',
          id: 'm5-insight',
          title: 'Decide hoy por tu yo de mañana',
          body:
            'Vas a elegir tres reglas no negociables. TENAZ las unirá con tu diagnóstico, tu mantra y tu micro-acción para construir tu Plan de Resiliencia de 7 días.',
        },
        {
          kind: 'plan-synthesis',
          id: 'm5-plan',
          title: 'Elige tus 3 reglas no negociables',
          rules: content.rules,
          requiredRules: REQUIRED_RULES,
        },
      ],
    },
  ];
}

export function findModule(modules: readonly Module[], id: string): Module | undefined {
  return modules.find((module) => module.id === id);
}
