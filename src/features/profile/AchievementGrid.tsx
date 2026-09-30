import { Crown, Flag, Flame, Hourglass, ShieldCheck, Sprout, Star, Trophy, Users, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AppText } from '@/components/ui/AppText';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import type { Achievement, AchievementIcon } from '@/lib/gamification/achievements';
import { enterAnimation } from '@/theme/motion';
import { brand, elevationFor, feedback, gradients, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

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

const TILE_ICON = 44;

function AchievementTile({ achievement, index }: { readonly achievement: Achievement; readonly index: number }) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const Icon = ICONS[achievement.icon];
  const { unlocked } = achievement;
  const status = unlocked ? 'conseguido' : `${Math.min(achievement.value, achievement.target)} de ${achievement.target}`;
  return (
    <Animated.View
      entering={enterAnimation(index, reduceMotion)}
      accessible
      accessibilityLabel={`${achievement.title}: ${achievement.description} ${status}.`}
      style={[
        styles.tile,
        unlocked ? elevationFor('sm', isDark) : null,
        { backgroundColor: colors.surface, borderColor: unlocked ? feedback.gold : isDark ? colors.glassBorder : colors.border },
      ]}
    >
      {unlocked ? (
        <IconTile color={feedback.gold} gradient={gradients.gold} size={TILE_ICON}>
          <Icon color={brand.ink} size={22} strokeWidth={ICON_STROKE} />
        </IconTile>
      ) : (
        <View style={[styles.lockedIcon, { backgroundColor: colors.disabled }]}>
          <Icon color={colors.textMuted} size={22} strokeWidth={ICON_STROKE} />
        </View>
      )}
      <AppText variant="caption" align="center" tone={unlocked ? 'default' : 'muted'} numberOfLines={2}>
        {achievement.title}
      </AppText>
      {unlocked ? null : (
        <View style={[styles.track, { backgroundColor: colors.disabled }]}>
          <View style={[styles.fill, { width: `${achievement.progress * 100}%`, backgroundColor: colors.highlight }]} />
        </View>
      )}
    </Animated.View>
  );
}

/** Cuadrícula de logros: dorados (IconTile) los conseguidos, grises con barra de avance los pendientes. */
export function AchievementGrid({ achievements }: { readonly achievements: readonly Achievement[] }) {
  return (
    <View style={styles.grid}>
      {achievements.map((achievement, index) => (
        <AchievementTile key={achievement.id} achievement={achievement} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.sm },
  tile: {
    width: '31.5%',
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    minHeight: 116,
  },
  lockedIcon: {
    width: TILE_ICON,
    height: TILE_ICON,
    borderRadius: TILE_ICON * 0.32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: { alignSelf: 'stretch', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 'auto' },
  fill: { height: 6, borderRadius: 3 },
});
