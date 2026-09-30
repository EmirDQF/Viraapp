import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface MenuRowProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle?: string;
  /** Color del squircle del ícono (por defecto, el petróleo de la marca). */
  readonly color?: string;
  readonly iconColor?: string;
  readonly onPress: () => void;
}

/** Fila de menú: ícono en IconTile, título, detalle opcional y chevron; responde con resorte y vibración. */
export function MenuRow({ icon: Icon, title, subtitle, color, iconColor, onPress }: MenuRowProps) {
  const { colors } = useTheme();
  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={styles.row}
    >
      <IconTile color={color ?? colors.primary} size={42}>
        <Icon color={iconColor ?? colors.onPrimary} size={20} strokeWidth={ICON_STROKE} />
      </IconTile>
      <View style={styles.text}>
        <AppText variant="bodyStrong">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ChevronRight color={colors.textMuted} size={20} strokeWidth={2.5} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: MIN_TOUCH + 16,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  text: { flex: 1, gap: 2 },
});
