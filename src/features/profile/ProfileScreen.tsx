import { router } from 'expo-router';
import { Anchor, Flame, Hourglass, Info, Layers, Settings, ShieldCheck, Trophy, Users, type LucideIcon } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AchievementGrid } from '@/features/profile/AchievementGrid';
import { MenuRow } from '@/features/profile/MenuRow';
import { computeAchievements, unlockedCount } from '@/lib/gamification/achievements';
import { countCompletedModules, countCompletedStages } from '@/lib/gamification/progress';
import { levelInfo } from '@/lib/gamification/xp';
import { impulseStats } from '@/lib/impulses';
import { visibleStreak } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';
import { enterAnimation } from '@/theme/motion';
import { MODULE_COLORS, brand, feedback, gradients, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

interface StatTileProps {
  readonly icon: LucideIcon;
  readonly value: number;
  readonly label: string;
  readonly color: string;
  readonly iconColor: string;
}

function StatTile({ icon: Icon, value, label, color, iconColor }: StatTileProps) {
  return (
    <Card style={styles.stat} accessibilityLabel={`${value} ${label}`}>
      <IconTile color={color} size={40}>
        <Icon color={iconColor} size={20} strokeWidth={ICON_STROKE} />
      </IconTile>
      <AnimatedNumber value={value} />
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </Card>
  );
}

/** Datos derivados del perfil. Cada selector lee solo su parte del store para no re-renderizar de más. */
function useProfileData() {
  const name = useAppStore((store) => store.user?.name ?? '');
  const xp = useAppStore((store) => store.xp);
  const modules = useAppStore((store) => store.modules);
  const rawStreak = useAppStore((store) => store.streak);
  const impulses = useAppStore((store) => store.impulses);
  const evidence = useAppStore((store) => store.evidence.length);
  const contacts = useAppStore((store) => store.contacts.length);
  const level = levelInfo(xp);
  const stages = countCompletedStages(modules);
  const completedModules = countCompletedModules(modules);
  const streak = visibleStreak(rawStreak);
  const resisted = impulseStats(impulses).resisted;
  const achievements = computeAchievements({
    completedStages: stages,
    completedModules,
    streak,
    resistedImpulses: resisted,
    evidence,
    contacts,
    level: level.level,
  });
  return { name, xp, level, stages, completedModules, streak, resisted, achievements };
}

/** Pestaña Mi: perfil, nivel y XP, bento de estadísticas, logros, herramientas de bienestar y ajustes. */
export function ProfileScreen() {
  const tabSpace = useTabBarSpace();
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const { name, xp, level, stages, completedModules, streak, resisted, achievements } = useProfileData();
  const enter = (index: number) => enterAnimation(index, reduceMotion);
  const tools = MODULE_COLORS;

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabSpace + spacing.lg }]}>
          <Animated.View entering={enter(0)}>
            <GlassCard elevation="md" radius={radius.xl}>
              <View style={styles.hero}>
                <RegiMascot pose="growth" size={96} glow={Math.min(1, level.level / 9)} />
                <View style={styles.flex}>
                  <AppText variant="title" accessibilityRole="header" numberOfLines={1}>
                    {name || 'Mi espacio'}
                  </AppText>
                  <AppText variant="bodyStrong" tone="primary">
                    Nivel {level.level}
                  </AppText>
                  <View style={styles.bar}>
                    <ProgressBar value={level.progress} height={12} gradient={gradients.aurora} color={colors.highlight} />
                  </View>
                  <AppText variant="caption" tone="muted">
                    {xp} XP · faltan {Math.max(0, level.ceil - xp)} para el nivel {level.level + 1}
                  </AppText>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          <Animated.View entering={enter(1)} style={styles.bento}>
            <View style={styles.bentoRow}>
              <StatTile icon={Flame} value={streak} label="días de racha" color={brand.coral} iconColor={brand.ink} />
              <StatTile icon={Layers} value={stages} label="etapas" color={colors.primary} iconColor={colors.onPrimary} />
            </View>
            <View style={styles.bentoRow}>
              <StatTile icon={Trophy} value={completedModules} label="temas" color={feedback.gold} iconColor={brand.ink} />
              <StatTile
                icon={ShieldCheck}
                value={resisted}
                label="impulsos resistidos"
                color={tools.enfriador.base}
                iconColor={tools.enfriador.on}
              />
            </View>
          </Animated.View>

          <View style={styles.section}>
            <SectionHeader overline={`${unlockedCount(achievements)} de ${achievements.length}`} title="Logros" />
            <AchievementGrid achievements={achievements} />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Tus herramientas" />
            <Card padded={false} style={styles.menu}>
              <MenuRow
                icon={Trophy}
                title="Muro de Evidencia"
                subtitle="Tus victorias sobre momentos difíciles"
                color={tools.muro.base}
                iconColor={tools.muro.on}
                onPress={() => router.push('/evidence')}
              />
              <MenuRow
                icon={Users}
                title="Apoyo Cercano"
                subtitle="Tus contactos de confianza y alerta rápida"
                color={tools.ancla.base}
                iconColor={tools.ancla.on}
                onPress={() => router.push('/support')}
              />
              <MenuRow
                icon={Hourglass}
                title="Buzón de Impulsos"
                subtitle="Espera antes de decidir"
                color={tools.enfriador.base}
                iconColor={tools.enfriador.on}
                onPress={() => router.push('/impulses')}
              />
              <MenuRow
                icon={Anchor}
                title="Pantalla Ancla"
                subtitle="10 segundos con tu foto feliz"
                color={tools.descarga.base}
                iconColor={tools.descarga.on}
                onPress={() => router.push('/anchor')}
              />
            </Card>
          </View>

          <Card padded={false} style={styles.menu}>
            <MenuRow icon={Settings} title="Ajustes" subtitle="Tema, notificaciones, sonido y privacidad" onPress={() => router.push('/settings')} />
            <MenuRow
              icon={Info}
              title="Sobre VIRA y ayuda profesional"
              subtitle="Líneas de ayuda y descargo"
              color={colors.regi}
              iconColor={colors.onRegi}
              onPress={() => router.push('/about')}
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, gap: spacing.xs },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.md, gap: spacing.xl },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  // ProgressBar crece en horizontal (flex: 1): necesita un contenedor en fila.
  bar: { flexDirection: 'row' },
  bento: { gap: spacing.md },
  bentoRow: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, gap: spacing.xs },
  section: { gap: spacing.md },
  menu: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
});
