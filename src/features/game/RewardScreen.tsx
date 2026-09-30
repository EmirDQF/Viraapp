import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Award, Crown, Flame, KeyRound, Leaf, ShieldCheck, Sparkles, Sprout, Star, Sun, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti } from '@/components/Confetti';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { EmptyState } from '@/components/ui/ComingSoon';
import { GlassCard } from '@/components/ui/GlassCard';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { MODULES } from '@/data/modules/catalog';
import { TreasureChest } from '@/features/game/TreasureChest';
import { toIsoDate } from '@/lib/age';
import { withAlpha } from '@/lib/color';
import { isModuleComplete } from '@/lib/gamification/progress';
import { MODULE_COMPLETE_BONUS, levelInfo } from '@/lib/gamification/xp';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { spring } from '@/theme/motion';
import { MODULE_COLORS, brand, feedback, gradients, radius, spacing, type GradientStops } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';
import type { ModuleId } from '@/types/game';

interface LevelBadge {
  readonly icon: LucideIcon;
  readonly color: string;
  /** Ícono sobre `color` con contraste ≥ 3:1. */
  readonly on: string;
}

/** Una insignia por nivel (1 a 9), con el arcoíris de la maqueta 4. */
const LEVEL_BADGES: readonly LevelBadge[] = [
  { icon: Sprout, color: MODULE_COLORS.descarga.base, on: brand.white },
  { icon: ShieldCheck, color: brand.petrol, on: brand.white },
  { icon: Flame, color: MODULE_COLORS.enfriador.base, on: brand.white },
  { icon: Sun, color: MODULE_COLORS.freno.base, on: brand.ink },
  { icon: Star, color: MODULE_COLORS.ancla.base, on: brand.ink },
  { icon: Leaf, color: MODULE_COLORS.hoy.base, on: brand.ink },
  { icon: Sparkles, color: brand.teal, on: brand.ink },
  { icon: Crown, color: brand.lilac, on: brand.white },
  { icon: Award, color: feedback.gold, on: brand.ink },
];

const BADGE_SIZE = 32;
const TRACK_HEIGHT = 6;
const CHEST_OPEN_DELAY_MS = 500;
const KEY_GLOW_ALPHA = 0.28;

export const moduleBadge = (id: ModuleId): string => `module:${id}`;

function LevelLine({ level }: { readonly level: number }) {
  const { colors } = useTheme();
  const reachedCount = Math.max(2, Math.min(level, LEVEL_BADGES.length));
  const trackStops = LEVEL_BADGES.slice(0, reachedCount).map((badge) => badge.color) as unknown as GradientStops;
  const fraction = Math.min(1, Math.max(0, (level - 1) / (LEVEL_BADGES.length - 1)));
  return (
    <View accessible accessibilityLabel={`Nivel ${level} de ${LEVEL_BADGES.length}`}>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <LinearGradient
          colors={trackStops}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.trackFill, { width: `${fraction * 100}%` }]}
        />
      </View>
      <View style={styles.levels}>
        {LEVEL_BADGES.map(({ icon: Icon, color, on }, index) => {
          const reached = index + 1 <= level;
          return (
            <View key={color} style={styles.levelItem}>
              {reached ? (
                <IconTile color={color} size={BADGE_SIZE}>
                  <Icon color={on} size={16} strokeWidth={ICON_STROKE} />
                </IconTile>
              ) : (
                <View style={[styles.lockedBadge, { backgroundColor: colors.disabled }]}>
                  <Icon color={colors.textMuted} size={16} strokeWidth={ICON_STROKE} />
                </View>
              )}
              <AppText variant="numberSmall" tone={reached ? 'default' : 'muted'}>
                {index + 1}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function GoldenKey() {
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion ? FadeIn : ZoomIn.delay(300).springify().damping(spring.snappy.damping);
  return (
    <Animated.View entering={entering} style={styles.key}>
      <View style={[styles.keyGlow, { backgroundColor: withAlpha(feedback.gold, KEY_GLOW_ALPHA) }]} />
      <IconTile color={feedback.gold} gradient={gradients.gold} size={60}>
        <KeyRound color={brand.ink} size={32} strokeWidth={ICON_STROKE} />
      </IconTile>
    </Animated.View>
  );
}

/** El Recorrido / recompensa (maqueta 4): nivel, llave dorada, cofre animado, confeti y RECOGER RECOMPENSA. */
export function RewardScreen({ moduleId }: { readonly moduleId: ModuleId }) {
  const reduceMotion = useReduceMotion();
  const modules = useAppStore((state) => state.modules);
  const xp = useAppStore((state) => state.xp);
  const badges = useAppStore((state) => state.badges);
  const earnReward = useAppStore((state) => state.earnReward);
  const addXp = useAppStore((state) => state.addXp);
  const addEvidence = useAppStore((state) => state.addEvidence);
  const [open, setOpen] = useState(false);
  const claimed = badges.includes(moduleBadge(moduleId));
  const { level } = levelInfo(xp);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), CHEST_OPEN_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isModuleComplete(moduleId, modules)) {
    return (
      <ScreenBackground variant="warm">
        <SafeAreaView style={styles.safe}>
          <EmptyState title="El cofre aún está cerrado" message={`Completa las 13 etapas de ${MODULES[moduleId].name} para abrirlo.`} pose="empathetic">
            <Button3D label="Ir al recorrido" onPress={() => router.replace('/(tabs)/missions')} />
          </EmptyState>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const collect = () => {
    if (!claimed) {
      earnReward(moduleBadge(moduleId));
      addXp(MODULE_COMPLETE_BONUS);
      addEvidence({ title: `Completaste ${MODULES[moduleId].name}`, icon: 'trophy', date: toIsoDate(new Date()), source: 'game' });
      haptic('success');
    }
    router.replace('/(tabs)/missions');
  };

  return (
    <ScreenBackground variant="warm">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Confetti />
        <ScrollView contentContainerStyle={styles.body}>
          <Animated.View entering={reduceMotion ? FadeIn : FadeInDown.springify()} style={styles.header}>
            <AppText variant="display" align="center" uppercase accessibilityRole="header">
              El Recorrido
            </AppText>
            <AppText variant="title" align="center">
              ¡Tu progreso es increíble!
            </AppText>
            <AppText variant="bodyStrong" tone="muted" align="center">
              {MODULES[moduleId].name} completado · Nivel {level}
            </AppText>
          </Animated.View>
          <View style={styles.regiRow}>
            <View style={styles.speech}>
              <GlassCard elevation="sm" radius={radius.lg} style={styles.bubble}>
                <AppText variant="bodyStrong" align="center">
                  ¡Aquí tienes tu llave dorada!
                </AppText>
              </GlassCard>
              <GoldenKey />
            </View>
            <RegiMascot pose="growth" size={120} glow={1} glowColor={feedback.gold} />
          </View>
          <LevelLine level={level} />
          <AppText variant="title" align="center" uppercase>
            ¡Recompensa desbloqueada!
          </AppText>
          <View style={styles.chest}>
            <TreasureChest open={open} size={200} />
          </View>
          <AppText tone="muted" align="center">
            {claimed ? 'Ya recogiste esta recompensa. Puedes rejugar el tema cuando quieras.' : `+${MODULE_COMPLETE_BONUS} XP y la insignia de ${MODULES[moduleId].name}.`}
          </AppText>
        </ScrollView>
        <View style={styles.footer}>
          <Button3D label={claimed ? 'Continuar' : 'Recoger recompensa'} size="lg" variant="accent" haptics="medium" onPress={collect} />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xl },
  header: { gap: spacing.xs },
  regiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  speech: { flex: 1, alignItems: 'center', gap: spacing.md },
  bubble: { alignSelf: 'stretch' },
  key: { alignItems: 'center', justifyContent: 'center' },
  keyGlow: { position: 'absolute', width: 96, height: 96, borderRadius: 48 },
  track: {
    position: 'absolute',
    left: BADGE_SIZE / 2,
    right: BADGE_SIZE / 2,
    top: BADGE_SIZE / 2 - TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  trackFill: { height: '100%' },
  levels: { flexDirection: 'row', justifyContent: 'space-between' },
  levelItem: { alignItems: 'center', gap: spacing.xs },
  lockedBadge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE * 0.32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chest: { alignItems: 'center' },
  footer: { paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.lg },
});
