import { router } from 'expo-router';
import { Award, Crown, Flame, KeyRound, Leaf, ShieldCheck, Sparkles, Sprout, Star, Sun, type LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Confetti } from '@/components/Confetti';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { EmptyState } from '@/components/ui/ComingSoon';
import { MODULES } from '@/data/modules/catalog';
import { TreasureChest } from '@/features/game/TreasureChest';
import { toIsoDate } from '@/lib/age';
import { isModuleComplete } from '@/lib/gamification/progress';
import { MODULE_COMPLETE_BONUS, levelInfo } from '@/lib/gamification/xp';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { MODULE_COLORS, feedback, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId } from '@/types/game';

/** Una insignia por nivel (1 a 9), como la línea de la maqueta 4. */
const LEVEL_BADGES: readonly LucideIcon[] = [Sprout, ShieldCheck, Flame, Sun, Star, Leaf, Sparkles, Crown, Award];

export const moduleBadge = (id: ModuleId): string => `module:${id}`;

function LevelLine({ level }: { readonly level: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.levels} accessible accessibilityLabel={`Nivel ${level} de ${LEVEL_BADGES.length}`}>
      {LEVEL_BADGES.map((Icon, index) => {
        const reached = index + 1 <= level;
        return (
          <View key={index} style={styles.levelItem}>
            <View style={[styles.levelIcon, { backgroundColor: reached ? feedback.gold : colors.disabled }]}>
              <Icon color={reached ? colors.text : colors.textMuted} size={16} />
            </View>
            <AppText variant="caption" tone={reached ? 'default' : 'muted'}>
              {index + 1}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

/** El Recorrido / recompensa (maqueta 4): nivel, llave dorada, cofre animado, confeti y RECOGER RECOMPENSA. */
export function RewardScreen({ moduleId }: { readonly moduleId: ModuleId }) {
  const { colors } = useTheme();
  const modules = useAppStore((state) => state.modules);
  const xp = useAppStore((state) => state.xp);
  const badges = useAppStore((state) => state.badges);
  const earnReward = useAppStore((state) => state.earnReward);
  const addXp = useAppStore((state) => state.addXp);
  const addEvidence = useAppStore((state) => state.addEvidence);
  const [open, setOpen] = useState(false);
  const tone = MODULE_COLORS[moduleId];
  const claimed = badges.includes(moduleBadge(moduleId));

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isModuleComplete(moduleId, modules)) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <EmptyState title="El cofre aún está cerrado" message={`Completa las 13 etapas de ${MODULES[moduleId].name} para abrirlo.`} pose="empathetic">
          <Button3D label="Ir al recorrido" onPress={() => router.replace('/(tabs)/missions')} />
        </EmptyState>
      </SafeAreaView>
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
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <Confetti />
      <ScrollView contentContainerStyle={styles.body}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <AppText variant="display" align="center" color={tone.base} accessibilityRole="header">
            El Recorrido
          </AppText>
          <AppText variant="heading" align="center">
            ¡Tu progreso es increíble!
          </AppText>
          <AppText variant="bodyStrong" tone="muted" align="center">
            {MODULES[moduleId].name} completado · Nivel {levelInfo(xp).level}
          </AppText>
        </Animated.View>
        <View style={styles.regiRow}>
          <View style={[styles.bubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <AppText variant="bodyStrong">¡Aquí tienes tu llave dorada!</AppText>
          </View>
          <RegiMascot pose="growth" size={110} glow={1} glowColor={tone.base} />
        </View>
        <Animated.View entering={ZoomIn.delay(300)} style={styles.key}>
          <KeyRound color={feedback.goldDeep} size={44} />
        </Animated.View>
        <LevelLine level={levelInfo(xp).level} />
        <AppText variant="title" align="center">
          ¡Recompensa desbloqueada!
        </AppText>
        <View style={styles.chest}>
          <TreasureChest open={open} />
        </View>
        <AppText tone="muted" align="center">
          {claimed ? 'Ya recogiste esta recompensa. Puedes rejugar el tema cuando quieras.' : `+${MODULE_COMPLETE_BONUS} XP y la insignia de ${MODULES[moduleId].name}.`}
        </AppText>
      </ScrollView>
      <View style={styles.footer}>
        <Button3D label={claimed ? 'Continuar' : 'Recoger recompensa'} size="lg" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={collect} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  body: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  header: { gap: spacing.xs },
  regiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  bubble: { flex: 1, borderWidth: 1.5, borderRadius: radius.xl, padding: spacing.md },
  key: { alignItems: 'center' },
  levels: { flexDirection: 'row', justifyContent: 'space-between' },
  levelItem: { alignItems: 'center', gap: 2 },
  levelIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  chest: { alignItems: 'center' },
  footer: { padding: spacing.lg },
});
