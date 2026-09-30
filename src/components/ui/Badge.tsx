import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

interface BadgeProps {
  readonly label: string;
  readonly icon?: ReactNode;
  readonly color?: string;
  readonly textColor?: string;
  readonly accessibilityLabel?: string;
}

/** Píldora compacta para etiquetas y estados. Sin color propio usa la superficie con borde suave. */
export function Badge({ label, icon, color, textColor, accessibilityLabel }: BadgeProps) {
  const { colors, isDark } = useTheme();
  const hasColor = color !== undefined;
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.badge,
        {
          backgroundColor: color ?? colors.surface,
          borderColor: hasColor ? 'transparent' : isDark ? colors.glassBorder : colors.border,
        },
      ]}
    >
      {icon}
      <AppText variant="caption" color={textColor ?? colors.text} style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { fontFamily: fontFamily.bold },
});
