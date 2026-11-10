/**
 * Lectura validada del avance en los caminos PA3 (v6). Lo que viene de AsyncStorage es dato externo: se
 * descarta lo que no reconocemos (módulos o actividades que ya no existen, valores fuera de rango).
 */
import { z } from 'zod';

import { getActivity } from '@/data/caminos/activities';
import { PA3_MODULES } from '@/data/caminos/modules';
import { PA3_MODULE_IDS } from '@/data/caminos/types';
import { TENSION_MAX, TENSION_MIN, type ActivityProgress, type CaminoActivities, type CaminoJourneys, type ModuleJourney } from '@/lib/caminos';

const index = z.number().int().min(0).max(20);

const answerSchema = z.object({
  decision: index,
  argument: index,
  tension: z.number().int().min(TENSION_MIN).max(TENSION_MAX),
  at: z.string().min(1),
});

const journeySchema = z.object({ before: answerSchema.nullable(), after: answerSchema.nullable() });

const progressSchema = z.object({
  completed: z.boolean(),
  step: z.number().int().min(0).max(50),
  answers: z.array(index).max(50),
  updatedAt: z.string().min(1),
});

const asObject = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Record<string, unknown>) : {};

/** Respuesta válida solo si sus índices existen en el caso del módulo. */
function fitsSituation(moduleId: (typeof PA3_MODULE_IDS)[number], journey: ModuleJourney): boolean {
  const { decisions, arguments: reasons } = PA3_MODULES[moduleId].situation;
  return [journey.before, journey.after].every((answer) => !answer || (answer.decision < decisions.length && answer.argument < reasons.length));
}

export function readCaminoJourneys(value: unknown): CaminoJourneys {
  const raw = asObject(value);
  return Object.fromEntries(
    PA3_MODULE_IDS.flatMap((moduleId) => {
      const parsed = journeySchema.safeParse(raw[moduleId]);
      return parsed.success && fitsSituation(moduleId, parsed.data) ? [[moduleId, parsed.data]] : [];
    }),
  );
}

export function readCaminoActivities(value: unknown): CaminoActivities {
  return Object.fromEntries(
    Object.entries(asObject(value)).flatMap(([activityId, entry]): [string, ActivityProgress][] => {
      if (!getActivity(activityId)) return [];
      const parsed = progressSchema.safeParse(entry);
      return parsed.success ? [[activityId, parsed.data]] : [];
    }),
  );
}
