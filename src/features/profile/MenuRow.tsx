import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface MenuRowProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly subtitle?: string;
  /** Color del círculo del ícono (por defecto, el de énfasis del tema). */
  readonly color?: string;
  readonly iconColor?: string;
  readonly onPress: () => void;
}

/** Fila de navegación con ícono, título, detalle opcional y flecha. */
export function MenuRow({ icon: Icon, title, subtitle, color, iconColor, onPress }: MenuRowProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.surfaceAlt : 'transparent' }]}
    >
      <View style={[styles.icon, { backgroundColor: color ?? colors.surfaceAlt }]}>
        <Icon color={iconColor ?? colors.highlight} size={20} />
      </View>
      <View style={styles.text}>
        <AppText variant="bodyStrong">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" tone="muted">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <ChevronRight color={colors.textMuted} size={20} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: MIN_TOUCH + 12, paddingHorizontal: spacing.sm, borderRadius: radius.lg },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
});
