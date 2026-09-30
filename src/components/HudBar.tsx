import { Flame, Heart, Zap } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { visibleStreak } from '@/lib/streak';
import { useResilienceStore } from '@/store/useResilienceStore';
import { palette, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface StatPillProps {
  readonly icon: ReactNode;
  readonly value: string;
  readonly color: string;
  readonly label: string;
}

function StatPill({ icon, value, color, label }: StatPillProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={label}
      style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      {icon}
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

interface HudBarProps {
  readonly showStreak?: boolean;
  readonly showXp?: boolean;
}

export function HudBar({ showStreak = true, showXp = true }: HudBarProps) {
  const streak = useResilienceStore((state) => state.streak);
  const xp = useResilienceStore((state) => state.xp);
  const energy = useResilienceStore((state) => state.energy);
  const streakCount = visibleStreak(streak);

  return (
    <View style={styles.row}>
      {showStreak ? (
        <StatPill
          icon={<Flame color={streakCount > 0 ? palette.phoenix : '#94A3B8'} fill={streakCount > 0 ? palette.amber : 'none'} size={20} />}
          value={String(streakCount)}
          color={palette.phoenix}
          label={`Racha de ${streakCount} días`}
        />
      ) : null}
      {showXp ? (
        <StatPill
          icon={<Zap color={palette.amber} fill={palette.amber} size={20} />}
          value={`${xp} XP`}
          color={palette.amber}
          label={`${xp} puntos de experiencia`}
        />
      ) : null}
      <StatPill
        icon={<Heart color={palette.retry} fill={energy.current > 0 ? palette.retry : 'none'} size={20} />}
        value={`${energy.current}/${energy.max}`}
        color={palette.retry}
        label={`Energía reflexiva ${energy.current} de ${energy.max}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', flexWrap: 'wrap' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
  value: { fontSize: 15, fontWeight: '800' },
});
