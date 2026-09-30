import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface SectionHeaderProps {
  readonly title: string;
  /** Texto pequeño en mayúsculas sobre el título. */
  readonly overline?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

/** Cabecera de sección: título fuerte, overline opcional y acción "Ver todo" a la derecha. */
export function SectionHeader({ title, overline, actionLabel, onAction }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.titles}>
        {overline ? (
          <AppText variant="overline" tone="muted" uppercase>
            {overline}
          </AppText>
        ) : null}
        <AppText variant="heading" accessibilityRole="header">
          {title}
        </AppText>
      </View>
      {actionLabel && onAction ? (
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          hitSlop={spacing.sm}
          style={styles.action}
        >
          <AppText variant="bodyStrong" tone="primary">
            {actionLabel}
          </AppText>
          <ChevronRight color={colors.highlight} size={18} strokeWidth={2.5} />
        </AnimatedPressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.md },
  titles: { flex: 1, gap: spacing.xxs },
  action: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, minHeight: MIN_TOUCH },
});
