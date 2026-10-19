import { appendEvent, type NewTimelineEvent, type TimelineEvent } from '@/lib/timeline';

const newId = (): string => `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** Devuelve la cronología con un evento nuevo (con id y fecha) al final. No muta la lista. */
export function withEvent(timeline: readonly TimelineEvent[], event: NewTimelineEvent, now: Date = new Date()): readonly TimelineEvent[] {
  return appendEvent(timeline, { ...event, id: newId(), at: now.toISOString() } as TimelineEvent);
}
