export type CrucibleId = 'academic' | 'economic' | 'grief' | 'burnout' | 'existential';

export type ModuleId = 'm1-acceptance' | 'm2-distortions' | 'm3-anchoring' | 'm4-micro-actions' | 'm5-manifesto';

export type ControlZone = 'control' | 'no-control';

export type DistortionType =
  | 'catastrophizing'
  | 'black-white'
  | 'mind-reading'
  | 'overgeneralization'
  | 'personalization'
  | 'emotional-reasoning'
  | 'should-statements';

export interface User {
  readonly name: string;
  readonly birthDate: string; // ISO yyyy-mm-dd
  readonly createdAt: string; // ISO timestamp
}

export interface SortCard {
  readonly id: string;
  readonly text: string;
  readonly zone: ControlZone;
  readonly explanation: string;
}

export interface DistortionCase {
  readonly id: string;
  readonly thought: string;
  readonly options: readonly DistortionType[];
  readonly correct: DistortionType;
  readonly explanation: string;
}

export interface ReframeBlock {
  readonly id: string;
  readonly text: string;
}

export interface ReframeCase {
  readonly automaticThought: string;
  readonly blocks: readonly ReframeBlock[];
  readonly correctOrder: readonly string[];
  readonly explanation: string;
}

export interface MicroChallenge {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly durationSec: number;
}

export interface Rule {
  readonly id: string;
  readonly text: string;
}

export interface Diagnosis {
  readonly headline: string;
  readonly body: string;
}

export interface CrucibleContent {
  readonly diagnosis: Diagnosis;
  readonly sortCards: readonly SortCard[];
  readonly distortions: readonly DistortionCase[];
  readonly reframe: ReframeCase;
  readonly mantras: readonly string[];
  readonly microChallenges: readonly MicroChallenge[];
  readonly rules: readonly Rule[];
  readonly weeklyActions: readonly string[];
}

export interface CrucibleCategory {
  readonly id: CrucibleId;
  readonly title: string;
  readonly tagline: string;
  readonly examples: readonly string[];
  readonly content: CrucibleContent;
}

/* ---------- Ejercicios (unión discriminada) ---------- */

export interface InsightExercise {
  readonly kind: 'insight';
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface CardSortExercise {
  readonly kind: 'card-sort';
  readonly id: string;
  readonly title: string;
  readonly cards: readonly SortCard[];
}

export interface DistortionExercise {
  readonly kind: 'distortion';
  readonly id: string;
  readonly title: string;
  readonly case: DistortionCase;
}

export interface ReframeExercise {
  readonly kind: 'reframe';
  readonly id: string;
  readonly title: string;
  readonly case: ReframeCase;
}

export interface BreathingExercise {
  readonly kind: 'breathing';
  readonly id: string;
  readonly title: string;
  readonly phaseSeconds: number;
  readonly cycles: number;
}

export interface AnchorExercise {
  readonly kind: 'anchor';
  readonly id: string;
  readonly title: string;
  readonly mantras: readonly string[];
  readonly holdMs: number;
}

export interface MicroActionExercise {
  readonly kind: 'micro-action';
  readonly id: string;
  readonly title: string;
  readonly challenges: readonly MicroChallenge[];
}

export interface PlanSynthesisExercise {
  readonly kind: 'plan-synthesis';
  readonly id: string;
  readonly title: string;
  readonly rules: readonly Rule[];
  readonly requiredRules: number;
}

export type Exercise =
  | InsightExercise
  | CardSortExercise
  | DistortionExercise
  | ReframeExercise
  | BreathingExercise
  | AnchorExercise
  | MicroActionExercise
  | PlanSynthesisExercise;

export interface Module {
  readonly id: ModuleId;
  readonly order: number;
  readonly title: string;
  readonly subtitle: string;
  readonly skill: string;
  readonly concept: string;
  readonly xp: number;
  readonly exercises: readonly Exercise[];
}

/* ---------- Registros persistidos por módulo ---------- */

export type ModuleRecord =
  | { readonly kind: 'reframe'; readonly text: string }
  | { readonly kind: 'mantra'; readonly mantra: string }
  | { readonly kind: 'micro-action'; readonly challengeId: string; readonly commitment: string }
  | { readonly kind: 'rules'; readonly ruleIds: readonly string[] };

export interface CrucibleProgress {
  readonly completedModules: readonly ModuleId[];
  readonly reframe?: string;
  readonly mantra?: string;
  readonly microAction?: { readonly challengeId: string; readonly commitment: string };
  readonly ruleIds?: readonly string[];
}

export interface Streak {
  readonly count: number;
  readonly lastActiveDate: string | null; // yyyy-mm-dd
}

export interface Energy {
  readonly current: number;
  readonly max: number;
}

/* ---------- Plan de acción ---------- */

export interface PlanDay {
  readonly dayIndex: number;
  readonly dateLabel: string;
  readonly action: string;
}

export interface ActionPlan {
  readonly crucibleId: CrucibleId;
  readonly crucibleTitle: string;
  readonly diagnosis: Diagnosis;
  readonly mantra: string;
  readonly rules: readonly string[];
  readonly schedule: readonly PlanDay[];
  readonly reframe?: string;
}
