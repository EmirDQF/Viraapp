import type { ModuleRecord } from '../../types';

export interface StepProps<E> {
  readonly exercise: E;
  readonly onComplete: (record?: ModuleRecord) => void;
  readonly onMistake: () => void;
}
