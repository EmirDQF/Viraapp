import { BossMechanic } from '@/features/game/mechanics/BossMechanic';
import { DecisionMechanic } from '@/features/game/mechanics/DecisionMechanic';
import { PuzzleMechanic } from '@/features/game/mechanics/PuzzleMechanic';
import { QuizMechanic } from '@/features/game/mechanics/QuizMechanic';
import { RewindMechanic } from '@/features/game/mechanics/RewindMechanic';
import { SimulatorMechanic } from '@/features/game/mechanics/SimulatorMechanic';
import { SwipeMechanic } from '@/features/game/mechanics/SwipeMechanic';
import { TrapCaseMechanic } from '@/features/game/mechanics/TrapCaseMechanic';
import { WordRainMechanic } from '@/features/game/mechanics/WordRainMechanic';
import { WordSearchMechanic } from '@/features/game/mechanics/WordSearchMechanic';
import type { DecisionOutcome } from '@/features/game/types';
import type { StageResult } from '@/lib/gamification/xp';
import type { ModuleTone } from '@/theme/tokens';
import type { ModuleContent } from '@/types/content';
import type { ModuleId } from '@/types/game';

interface StageMechanicProps {
  readonly stage: number;
  readonly content: ModuleContent;
  readonly moduleId: ModuleId;
  readonly tone: ModuleTone;
  readonly onComplete: (result: StageResult) => void;
  readonly onDecision: (result: DecisionOutcome) => void;
}

/** Relaciona cada una de las 13 etapas (en el orden de la guía) con su mecánica y su contenido. */
export function StageMechanic({ stage, content, moduleId, tone, onComplete, onDecision }: StageMechanicProps) {
  const common = { moduleId, tone, onComplete };
  switch (stage) {
    case 0:
      return <DecisionMechanic content={content.context} moduleId={moduleId} tone={tone} onComplete={onDecision} />;
    case 1:
      return <QuizMechanic content={content.rounds[0]} {...common} />;
    case 2:
      return <PuzzleMechanic content={content.puzzle} {...common} />;
    case 3:
      return <SwipeMechanic content={content.swipe} {...common} />;
    case 4:
      return <WordRainMechanic content={content.wordRain} {...common} />;
    case 5:
      return <SimulatorMechanic content={content.simulator} {...common} />;
    case 6:
      return <QuizMechanic content={content.rounds[1]} {...common} />;
    case 7:
      return <DecisionMechanic content={content.conflict} moduleId={moduleId} tone={tone} onComplete={onDecision} />;
    case 8:
      return <QuizMechanic content={content.rounds[2]} {...common} />;
    case 9:
      return <WordSearchMechanic content={content.wordSearch} {...common} />;
    case 10:
      return <TrapCaseMechanic content={content.trap} {...common} />;
    case 11:
      return <BossMechanic content={content.boss} {...common} />;
    default:
      return <RewindMechanic content={content.rewind} {...common} />;
  }
}
