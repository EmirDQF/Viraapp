import { useCallback, useState } from 'react';

import { useSfx } from '@/features/game/useSfx';
import { EMPTY_SCORE, registerAnswer, toResult, type ScoreState } from '@/lib/gamification/combo';
import type { StageResult } from '@/lib/gamification/xp';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';

export interface StageScore {
  readonly state: ScoreState;
  /** Registra una respuesta (con háptico y sonido) y devuelve si fue correcta. */
  readonly answer: (correct: boolean, firstTry?: boolean) => void;
  readonly result: () => StageResult;
}

/** Marcador de la etapa con micro-feedback: háptico de acierto/error y sonido opcional. */
export function useStageScore(): StageScore {
  const [state, setState] = useState<ScoreState>(EMPTY_SCORE);
  const play = useSfx();
  const hapticsEnabled = useAppStore((store) => store.settings.haptics);

  const answer = useCallback(
    (correct: boolean, firstTry = true) => {
      if (hapticsEnabled) haptic(correct ? 'success' : 'error');
      play(correct ? 'correct' : 'wrong');
      if (firstTry) setState((current) => registerAnswer(current, correct));
    },
    [hapticsEnabled, play],
  );

  const result = useCallback(() => toResult(state), [state]);
  return { state, answer, result };
}
