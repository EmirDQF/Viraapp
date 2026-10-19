/** Textos legibles de cada evento de la cronología (título y detalle). */
import { getCase } from '@/data/cases';
import { isModuleId, MODULES } from '@/data/modules/catalog';
import { moodLabel } from '@/data/moods';
import { stageAt } from '@/data/stages';
import { TECHNIQUES } from '@/data/techniques';
import type { TimelineEvent } from '@/lib/timeline';

export interface EventText {
  readonly title: string;
  readonly detail: string | null;
}

function badgeTitle(label: string): string {
  const id = label.startsWith('module:') ? label.slice('module:'.length) : null;
  return id && isModuleId(id) ? `Insignia: ${MODULES[id].name}` : 'Nueva insignia';
}

const IMPULSE_TEXT = {
  registered: { title: (label: string) => `Anotaste un impulso: ${label}`, detail: 'Darle un nombre ya es empezar a frenarlo.' },
  resisted: { title: (label: string) => `Frenaste: ${label}`, detail: 'Esperaste y decidiste tú.' },
  gave_in: { title: (label: string) => `Cediste a: ${label}`, detail: 'Está bien: también se aprende de esto.' },
} as const;

export function describeEvent(event: TimelineEvent): EventText {
  switch (event.kind) {
    case 'lesson':
      return { title: MODULES[event.moduleId].name, detail: `Etapa ${event.stage + 1} · ${stageAt(event.stage)?.title ?? 'Lección'}` };
    case 'impulse':
      return { title: IMPULSE_TEXT[event.status].title(event.label), detail: IMPULSE_TEXT[event.status].detail };
    case 'mood':
      return { title: `Ánimo: ${moodLabel(event.value)}`, detail: null };
    case 'sos':
      return { title: `SOS con ${TECHNIQUES[event.technique].name}`, detail: `Bajaste de ${event.before} a ${event.after}` };
    case 'technique':
      return { title: `Practicaste ${TECHNIQUES[event.technique].name}`, detail: TECHNIQUES[event.technique].short };
    case 'badge':
      return { title: badgeTitle(event.label), detail: null };
    case 'case': {
      const study = getCase(event.caseId);
      return study ? { title: `Caso resuelto: ${study.character}`, detail: study.work } : { title: 'Caso resuelto', detail: null };
    }
  }
}
