/**
 * Estructura pedagógica PA3: 3 caminos sugeridos, 7 módulos activos (más paradas futuras) y 25 actividades.
 * Cada módulo sigue el flujo de 4 etapas: situación inicial → explora y practica → orientación de Regi → antes y ahora.
 */

export const PATH_IDS = ['recursos', 'respuestas', 'actuar'] as const;
export type PathId = (typeof PATH_IDS)[number];

export const PA3_MODULE_IDS = [
  'muro-evidencia',
  'red-recursos',
  'hoy-facil',
  'detras-impulso',
  'punto-giro',
  'toma-mando',
  'bajo-presion',
] as const;
export type Pa3ModuleId = (typeof PA3_MODULE_IDS)[number];

/** Íconos del prototipo "VIRA Caminos" (se traducen a lucide en la interfaz). */
export type CaminoIcon =
  | 'backpack'
  | 'scan'
  | 'nav'
  | 'note'
  | 'users'
  | 'compass'
  | 'undo'
  | 'gauge'
  | 'bulb'
  | 'hand'
  | 'lock';

/** Estado de construcción visible en cada actividad. */
export type ActivityStatus = 'desarrollado' | 'maqueta' | 'propuesto';

export interface ChoiceOption {
  readonly text: string;
  /** Respuesta que mejor aplica el tema (las demás no son "malas": Regi explica por qué). */
  readonly good: boolean;
  /** Orientación de Regi al elegir esta opción. */
  readonly feedback: string;
}

export interface PracticeStep {
  readonly prompt: string;
  readonly options: readonly ChoiceOption[];
}

/** Actividad que se juega dentro de VIRA con pasos de práctica. */
export interface FlowActivity {
  readonly kind: 'flow';
  readonly steps: readonly PracticeStep[];
  /** Idea clave que Regi deja al terminar. */
  readonly takeaway: string;
}

/** Actividad que abre una pantalla de VIRA que ya existe (muro de evidencia, SOS, técnicas…). */
export interface LinkActivity {
  readonly kind: 'link';
  readonly href: string;
  /** Texto del botón que abre la pantalla. */
  readonly cta: string;
}

/** Actividad propuesta: aún no se juega, se describe cómo funcionará. */
export interface PlannedActivity {
  readonly kind: 'planned';
  readonly plan: readonly string[];
}

export type ActivityContent = FlowActivity | LinkActivity | PlannedActivity;

export interface Activity {
  readonly id: string;
  readonly moduleId: Pa3ModuleId;
  readonly title: string;
  readonly summary: string;
  readonly status: ActivityStatus;
  readonly content: ActivityContent;
}

/** Caso breve del inicio; se vuelve a responder en "Antes y ahora". */
export interface InitialSituation {
  readonly story: string;
  readonly question: string;
  /** Qué haría la persona (decisión). */
  readonly decisions: readonly string[];
  /** Por qué (argumento). */
  readonly arguments: readonly string[];
}

/** Recomendación cruzada de Regi hacia otra actividad o módulo. */
export interface CrossLink {
  readonly text: string;
  readonly activityId: string;
}

export interface Pa3Module {
  readonly id: Pa3ModuleId;
  readonly path: PathId;
  readonly title: string;
  /** Tema del curso (T01, T02…). */
  readonly courseCode: string;
  readonly topic: string;
  readonly icon: CaminoIcon;
  readonly description: string;
  readonly isNew?: boolean;
  /** Módulos de la app anterior que este módulo integra (solo informativo). */
  readonly integrates?: readonly string[];
  readonly situation: InitialSituation;
  /** Orientación teórica de Regi (etapa 03). */
  readonly orientation: readonly string[];
  readonly recommends?: CrossLink;
}

/** Parada de la ruta de un camino: un módulo activo o un tema que vendrá. */
export type PathStop =
  | { readonly kind: 'module'; readonly moduleId: Pa3ModuleId }
  | { readonly kind: 'soon'; readonly title: string };

export interface CaminoPath {
  readonly id: PathId;
  readonly number: 1 | 2 | 3;
  readonly name: string;
  readonly icon: CaminoIcon;
  readonly lead: string;
  readonly stops: readonly PathStop[];
  readonly tip: { readonly title: string; readonly text: string; readonly activityId?: string };
}
