import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ChipProps {
  readonly label: string;
  readonly selected?: boolean;
  readonly onPress: () => void;
  readonly icon?: LucideIcon;
  readonly accessibilityLabel?: string;
}

/** Opción seleccionable en píldora (filtros, respuestas rápidas). */
export function Chip({ label, selected = false, onPress, icon: Icon, accessibilityLabel }: ChipProps) {
  const { colors } = useTheme();
  const text = selected ? colors.onPrimary : colors.text;
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      haptics="selection"
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      {Icon ? <Icon color={text} size={16} strokeWidth={ICON_STROKE} /> : null}
      <AppText variant="bodyStrong" color={text}>
        {label}
      </AppText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
});
