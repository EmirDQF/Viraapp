/**
 * Tipos del contenido heredado de TENAZ (crisoles y distorsiones). El contenido se conserva y se reutiliza
 * dentro del juego de VIRA (preguntas extra de las rondas, clasificación del Boss, frases ancla).
 */

export type CrucibleId = 'academic' | 'economic' | 'grief' | 'burnout' | 'existential';

export type ControlZone = 'control' | 'no-control';

export type DistortionType =
  | 'catastrophizing'
  | 'black-white'
  | 'mind-reading'
  | 'overgeneralization'
  | 'personalization'
  | 'emotional-reasoning'
  | 'should-statements';

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
