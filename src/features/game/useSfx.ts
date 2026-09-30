import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { useAppStore } from '@/store/useAppStore';

export type SfxKind = 'correct' | 'wrong' | 'complete';

const SOURCES = {
  correct: require('../../../assets/sounds/correct.wav'),
  wrong: require('../../../assets/sounds/wrong.wav'),
  complete: require('../../../assets/sounds/complete.wav'),
} as const;

/** Sonidos cortos opcionales (se respetan los ajustes del usuario). */
export function useSfx(): (kind: SfxKind) => void {
  const enabled = useAppStore((state) => state.settings.sounds);
  const correct = useAudioPlayer(SOURCES.correct);
  const wrong = useAudioPlayer(SOURCES.wrong);
  const complete = useAudioPlayer(SOURCES.complete);

  return useCallback(
    (kind: SfxKind) => {
      if (!enabled) return;
      const player = kind === 'correct' ? correct : kind === 'wrong' ? wrong : complete;
      try {
        player.seekTo(0);
        player.play();
      } catch {
        // El sonido es un extra: si el dispositivo no puede reproducirlo, seguimos sin interrumpir.
      }
    },
    [complete, correct, enabled, wrong],
  );
}
