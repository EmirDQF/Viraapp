import type { MoodValue } from '@/lib/timeline';

/** Escala del check-in diario de ánimo (5 caritas). */
export const MOODS: readonly { readonly value: MoodValue; readonly label: string; readonly emoji: string }[] = [
  { value: 1, label: 'Muy mal', emoji: '😣' },
  { value: 2, label: 'Mal', emoji: '😕' },
  { value: 3, label: 'Regular', emoji: '😐' },
  { value: 4, label: 'Bien', emoji: '🙂' },
  { value: 5, label: 'Muy bien', emoji: '😄' },
];

export function moodLabel(value: MoodValue): string {
  return MOODS.find((mood) => mood.value === value)?.label ?? 'Regular';
}
