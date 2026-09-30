import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

import { useAppStore } from '@/store/useAppStore';

export type SfxKind = 'correct' | 'wrong' | 'complete';

const SOURCES = {
  correct: require('../../../assets/sounds/correct.wav'),
  wrong: require('../../../assets/sounds/wrong.wav'),
  complete: require('../../../assets/sounds/complete.wav'),
} as const;

/**
 * Tres reproductores compartidos por toda la app (se crean la primera vez que suenan y viven lo que la app).
 * Así cada etapa no carga sus propias copias de los mismos sonidos.
 */
const players: Partial<Record<SfxKind, AudioPlayer>> = {};

function playerFor(kind: SfxKind): AudioPlayer {
  const existing = players[kind];
  if (existing) return existing;
  const created = createAudioPlayer(SOURCES[kind]);
  players[kind] = created;
  return created;
}

/** Sonidos cortos opcionales (se respetan los ajustes del usuario). */
export function useSfx(): (kind: SfxKind) => void {
  const enabled = useAppStore((state) => state.settings.sounds);
  return useCallback(
    (kind: SfxKind) => {
      if (!enabled) return;
      try {
        const player = playerFor(kind);
        player.seekTo(0);
        player.play();
      } catch {
        // El sonido es un extra: si el dispositivo no puede reproducirlo, seguimos sin interrumpir.
      }
    },
    [enabled],
  );
}
