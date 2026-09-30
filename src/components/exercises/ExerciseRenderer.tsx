import type { Exercise, ModuleRecord } from '@/types';
import { AnchorStep } from '@/components/exercises/AnchorStep';
import { BreathingStep } from '@/components/exercises/BreathingStep';
import { CardSortStep } from '@/components/exercises/CardSortStep';
import { DistortionStep } from '@/components/exercises/DistortionStep';
import { InsightStep } from '@/components/exercises/InsightStep';
import { MicroActionStep } from '@/components/exercises/MicroActionStep';
import { PlanSynthesisStep } from '@/components/exercises/PlanSynthesisStep';
import { ReframeStep } from '@/components/exercises/ReframeStep';

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
