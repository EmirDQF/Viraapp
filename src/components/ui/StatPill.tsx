import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { withAlpha } from '@/lib/color';
import { elevationFor, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const ICON_SIZE = 18;
const ICON_BUBBLE = 28;
const ICON_BUBBLE_ALPHA = 0.18;
const ICON_FILL_ALPHA = 0.25;
const PILL_HEIGHT = 36;

interface StatPillProps {
  readonly icon: LucideIcon;
  readonly value: number;
  /** Color del ícono (racha = coral, XP = lila, nivel = petróleo…). */
  readonly color: string;
  /** Texto corto tras el número ("XP", "días"). */
  readonly unit?: string;
  /** Frase completa para lectores de pantalla ("Racha de 5 días"). */
  readonly accessibilityLabel: string;
}

/** Píldora de estadística (racha, XP, nivel): ícono en burbuja de color + número animado. */
export function StatPill({ icon: Icon, value, color, unit, accessibilityLabel }: StatPillProps) {
  const { colors, isDark } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.pill,
        elevationFor('sm', isDark),
        { backgroundColor: colors.surface, borderColor: isDark ? colors.glassBorder : colors.border },
      ]}
    >
      <View style={[styles.bubble, { backgroundColor: withAlpha(color, ICON_BUBBLE_ALPHA) }]}>
        <Icon color={color} size={ICON_SIZE} strokeWidth={ICON_STROKE} fill={withAlpha(color, ICON_FILL_ALPHA)} />
      </View>
      <AnimatedNumber value={value} variant="numberSmall" color={colors.text} />
      {unit ? (
        <AppText variant="caption" tone="muted">
          {unit}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    paddingLeft: spacing.xs,
    paddingRight: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: PILL_HEIGHT,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  bubble: {
    width: ICON_BUBBLE,
    height: ICON_BUBBLE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
