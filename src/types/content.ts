/** Contenido de cada módulo del juego (extraído de la guía v2 y ampliado). */
import type { ModuleId } from '@/types/game';

export interface QuizQuestion {
  readonly prompt: string;
  readonly options: readonly string[];
  readonly answer: number;
  readonly why: string;
}

export interface DecisionOption {
  readonly label: string;
  readonly outcome: string;
  readonly good: boolean;
  readonly learning: string;
}

export interface DecisionScene {
  readonly title: string;
  readonly situation: string;
  readonly options: readonly [DecisionOption, DecisionOption];
}

export interface PuzzleContent {
  readonly prompt: string;
  /** Eslabones de la cadena causa → efecto en el orden correcto. */
  readonly steps: readonly string[];
  readonly insight: string;
}

export type SwipeSide = 'left' | 'right';

export interface SwipeCard {
  readonly text: string;
  readonly answer: SwipeSide;
  readonly why: string;
}

export interface SwipeContent {
  readonly prompt: string;
  readonly left: string;
  readonly right: string;
  readonly cards: readonly SwipeCard[];
}

export interface WordRainContent {
  readonly good: readonly string[];
  readonly bad: readonly string[];
  readonly phrase: string;
}

export type SimulatorKind = 'journal' | 'impulse-timer' | 'pause-breath' | 'micro-steps' | 'support-message' | 'evidence-log';

export interface SimulatorOption {
  readonly label: string;
  readonly detail: string;
}

export interface SimulatorContent {
  readonly kind: SimulatorKind;
  readonly title: string;
  readonly intro: string;
  readonly placeholder: string;
  readonly options: readonly SimulatorOption[];
  readonly closing: string;
}

export interface WordSearchContent {
  readonly words: readonly { readonly word: string; readonly clue: string }[];
}

export type TrapStrength = 'strong' | 'weak' | 'agree';

export interface TrapOption {
  readonly text: string;
  readonly strength: TrapStrength;
  readonly reply: string;
}

export interface TrapTurn {
  readonly challenge: string;
  readonly options: readonly TrapOption[];
}

export interface TrapContent {
  readonly belief: string;
  readonly turns: readonly TrapTurn[];
  readonly closing: string;
}

export interface BossItem {
  readonly text: string;
  readonly answer: SwipeSide;
}

export interface BossContent {
  readonly prompt: string;
  readonly left: string;
  readonly right: string;
  readonly seconds: number;
  readonly items: readonly BossItem[];
}

export interface RewindContent {
  readonly summary: readonly string[];
  readonly reward: string;
}

export interface ModuleContent {
  readonly id: ModuleId;
  readonly context: DecisionScene;
  readonly conflict: DecisionScene;
  readonly rounds: readonly [readonly QuizQuestion[], readonly QuizQuestion[], readonly QuizQuestion[]];
  readonly puzzle: PuzzleContent;
  readonly swipe: SwipeContent;
  readonly wordRain: WordRainContent;
  readonly simulator: SimulatorContent;
  readonly wordSearch: WordSearchContent;
  readonly trap: TrapContent;
  readonly boss: BossContent;
  readonly rewind: RewindContent;
}
