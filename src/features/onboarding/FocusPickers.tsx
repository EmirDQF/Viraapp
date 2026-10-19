import {
  Brain,
  Briefcase,
  Flame,
  Heart,
  Moon,
  Shield,
  Smartphone,
  Sprout,
  Sun,
  Sunset,
  Users,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/ui/Chip';
import {
  FOCUS_AREA_IDS,
  HARD_MOMENT_IDS,
  HARD_MOMENT_LABELS,
  focusLabel,
  type FocusArea,
  type HardMoment,
} from '@/lib/personalize';
import { spacing } from '@/theme/tokens';

const FOCUS_ICONS: Readonly<Record<FocusArea, LucideIcon>> = {
  impulsos: Zap,
  frustracion: Flame,
  emociones: Heart,
  ansiedad: Wind,
  resiliencia: Sprout,
  estrategias: Shield,
  pensamientos: Brain,
  relaciones: Users,
  estres: Briefcase,
  pantallas: Smartphone,
};

const MOMENT_ICONS: Readonly<Record<HardMoment, LucideIcon>> = {
  manana: Sun,
  tarde: Sunset,
  noche: Moon,
  personas: Users,
};

/** Agrega o quita un valor de una lista (inmutable). */
export function toggleValue<T>(list: readonly T[], value: T): readonly T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

interface PickerProps<T> {
  readonly value: readonly T[];
  readonly onChange: (value: readonly T[]) => void;
}

/** "¿Qué quieres mejorar?": selección múltiple con chips e iconos. */
export function FocusPicker({ value, onChange }: PickerProps<FocusArea>) {
  return (
    <View style={styles.chips} accessibilityLabel="¿Qué quieres mejorar? Puedes elegir varias">
      {FOCUS_AREA_IDS.map((id) => (
        <Chip
          key={id}
          role="checkbox"
          label={focusLabel(id)}
          icon={FOCUS_ICONS[id]}
          selected={value.includes(id)}
          onPress={() => onChange(toggleValue(value, id))}
        />
      ))}
    </View>
  );
}

/** "¿Cuándo te cuesta más?": selección múltiple de momentos del día. */
export function MomentPicker({ value, onChange }: PickerProps<HardMoment>) {
  return (
    <View style={styles.chips} accessibilityLabel="¿Cuándo te cuesta más? Puedes elegir varias">
      {HARD_MOMENT_IDS.map((id) => (
        <Chip
          key={id}
          role="checkbox"
          label={HARD_MOMENT_LABELS[id]}
          icon={MOMENT_ICONS[id]}
          selected={value.includes(id)}
          onPress={() => onChange(toggleValue(value, id))}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
