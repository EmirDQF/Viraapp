import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface BadgeProps {
  readonly label: string;
  readonly icon?: ReactNode;
  readonly color?: string;
  readonly textColor?: string;
  readonly accessibilityLabel?: string;
}

/** Píldora compacta para racha, XP, meta diaria o estados. */
export function Badge({ label, icon, color, textColor, accessibilityLabel }: BadgeProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      style={[styles.badge, { backgroundColor: color ?? colors.surface, borderColor: colors.border }]}
    >
      {icon}
      <AppText variant="caption" color={textColor ?? colors.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
