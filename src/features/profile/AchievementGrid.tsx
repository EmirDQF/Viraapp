import { Crown, Flag, Flame, Hourglass, ShieldCheck, Sprout, Star, Trophy, Users, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { Achievement, AchievementIcon } from '@/lib/gamification/achievements';
import { brand, feedback, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const ICONS: Readonly<Record<AchievementIcon, LucideIcon>> = {
  sprout: Sprout,
  flag: Flag,
  crown: Crown,
  flame: Flame,
  hourglass: Hourglass,
  shield: ShieldCheck,
  trophy: Trophy,
  users: Users,
  star: Star,
};

function AchievementTile({ achievement }: { readonly achievement: Achievement }) {
  const { colors } = useTheme();
  const Icon = ICONS[achievement.icon];
  const { unlocked } = achievement;
  const status = unlocked ? 'conseguido' : `${Math.min(achievement.value, achievement.target)} de ${achievement.target}`;
  return (
    <View
      accessible
      accessibilityLabel={`${achievement.title}: ${achievement.description} ${status}.`}
      style={[styles.tile, { backgroundColor: colors.surface, borderColor: unlocked ? feedback.gold : colors.border }]}
    >
      <View style={[styles.icon, { backgroundColor: unlocked ? feedback.gold : colors.disabled }]}>
        <Icon color={unlocked ? brand.ink : colors.textMuted} size={22} />
      </View>
      <AppText variant="caption" align="center" tone={unlocked ? 'default' : 'muted'} numberOfLines={2}>
        {achievement.title}
      </AppText>
      {unlocked ? null : (
        <View style={[styles.track, { backgroundColor: colors.disabled }]}>
          <View style={[styles.fill, { width: `${achievement.progress * 100}%`, backgroundColor: colors.highlight }]} />
        </View>
      )}
    </View>
  );
}

/** Cuadrícula de logros: dorados los conseguidos, grises con barra de avance los pendientes. */
export function AchievementGrid({ achievements }: { readonly achievements: readonly Achievement[] }) {
  return (
    <View style={styles.grid}>
      {achievements.map((achievement) => (
        <AchievementTile key={achievement.id} achievement={achievement} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm },
  tile: { width: '31.5%', alignItems: 'center', gap: spacing.xs, padding: spacing.sm, borderRadius: radius.lg, borderWidth: 2, minHeight: 112 },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  track: { alignSelf: 'stretch', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 'auto' },
  fill: { height: 6, borderRadius: 3 },
});
