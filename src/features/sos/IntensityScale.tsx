import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { haptic } from '@/lib/haptics';
import { MIN_TOUCH, brand, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export const INTENSITY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface IntensityScaleProps {
  readonly label: string;
  readonly value: number | null;
  readonly onChange: (value: number) => void;
}

/** Escala de intensidad del 1 al 10 (radiogroup accesible), con los extremos explicados. */
export function IntensityScale({ label, value, onChange }: IntensityScaleProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.root}>
      <AppText variant="bodyStrong">{label}</AppText>
      <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel={label}>
        {INTENSITY_LEVELS.map((level) => {
          const selected = value === level;
          return (
            <Pressable
              key={level}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              accessibilityLabel={`Intensidad ${level} de 10`}
              onPress={() => {
                haptic('selection');
                onChange(level);
              }}
              style={[
                styles.cell,
                { backgroundColor: selected ? brand.coral : colors.surface, borderColor: selected ? brand.coral : colors.border },
              ]}
            >
              <AppText variant="bodyStrong" color={selected ? brand.ink : colors.text}>
                {level}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.ends}>
        <AppText variant="caption" tone="muted">
          1 · Apenas lo noto
        </AppText>
        <AppText variant="caption" tone="muted">
          10 · Muy fuerte
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, justifyContent: 'space-between' },
  cell: { minWidth: MIN_TOUCH + 8, minHeight: MIN_TOUCH + 4, paddingHorizontal: spacing.xs, borderRadius: radius.lg, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  ends: { flexDirection: 'row', justifyContent: 'space-between' },
});
