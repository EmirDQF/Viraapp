import type { StageResult } from '@/lib/gamification/xp';
import type { ModuleTone } from '@/theme/tokens';
import type { ModuleId } from '@/types/game';

/** Propiedades comunes de las 10 mecánicas reutilizables del juego. */
export interface MechanicProps<T> {
  readonly content: T;
  readonly moduleId: ModuleId;
  readonly tone: ModuleTone;
  readonly onComplete: (result: StageResult) => void;
}

/** Resultado extra de las etapas de decisión, para el Espejo emocional. */
export interface DecisionOutcome extends StageResult {
  readonly firstChoiceGood: boolean;
}
