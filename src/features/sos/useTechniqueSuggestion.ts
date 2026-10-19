import { useMemo } from 'react';

import type { TechniqueNeed } from '@/data/techniques';
import { recommendTechnique, type Recommendation } from '@/lib/recommend';
import { moodToday, recentImpulseCount } from '@/lib/timeline';
import { useAppStore } from '@/store/useAppStore';

/** Técnica recomendada con lo que sabemos del usuario (ánimo de hoy, impulsos recientes, foco y hora). */
export function useTechniqueSuggestion(need: TechniqueNeed | null, intensity: number | null): Recommendation {
  const timeline = useAppStore((state) => state.timeline);
  const focusAreas = useAppStore((state) => state.focusAreas);
  const hour = new Date().getHours();
  return useMemo(() => {
    const now = new Date();
    return recommendTechnique({
      need,
      intensity,
      hour,
      focusAreas,
      mood: moodToday(timeline, now),
      recentImpulses: recentImpulseCount(timeline, now),
    });
  }, [focusAreas, hour, intensity, need, timeline]);
}
