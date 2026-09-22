import type { Exercise, ModuleRecord } from '../../types';
import { AnchorStep } from './AnchorStep';
import { BreathingStep } from './BreathingStep';
import { CardSortStep } from './CardSortStep';
import { DistortionStep } from './DistortionStep';
import { InsightStep } from './InsightStep';
import { MicroActionStep } from './MicroActionStep';
import { PlanSynthesisStep } from './PlanSynthesisStep';
import { ReframeStep } from './ReframeStep';

interface ExerciseRendererProps {
  readonly exercise: Exercise;
  readonly onComplete: (record?: ModuleRecord) => void;
  readonly onMistake: () => void;
}

export function ExerciseRenderer({ exercise, onComplete, onMistake }: ExerciseRendererProps) {
  const handlers = { onComplete, onMistake };
  switch (exercise.kind) {
    case 'insight':
      return <InsightStep exercise={exercise} {...handlers} />;
    case 'card-sort':
      return <CardSortStep exercise={exercise} {...handlers} />;
    case 'distortion':
      return <DistortionStep exercise={exercise} {...handlers} />;
    case 'reframe':
      return <ReframeStep exercise={exercise} {...handlers} />;
    case 'breathing':
      return <BreathingStep exercise={exercise} {...handlers} />;
    case 'anchor':
      return <AnchorStep exercise={exercise} {...handlers} />;
    case 'micro-action':
      return <MicroActionStep exercise={exercise} {...handlers} />;
    case 'plan-synthesis':
      return <PlanSynthesisStep exercise={exercise} {...handlers} />;
  }
}
