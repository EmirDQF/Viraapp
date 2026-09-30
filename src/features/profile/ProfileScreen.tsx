import { router } from 'expo-router';
import { Anchor, Flame, Hourglass, Info, Layers, Settings, ShieldCheck, Trophy, Users } from 'lucide-react-native';
import { ScrollView, StyleSheet, View, type ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { AchievementGrid } from '@/features/profile/AchievementGrid';
import { MenuRow } from '@/features/profile/MenuRow';
import { computeAchievements, unlockedCount } from '@/lib/gamification/achievements';
import { countCompletedModules, countCompletedStages } from '@/lib/gamification/progress';
import { levelInfo } from '@/lib/gamification/xp';
import { impulseStats } from '@/lib/impulses';
import { visibleStreak } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';
import { MODULE_COLORS, feedback, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';

/** Color de la llama de racha (naranja del Freno de Mano). */
const STREAK_COLOR = MODULE_COLORS.freno.base;

function StatTile({ icon: Icon, value, label, color }: { readonly icon: typeof Flame; readonly value: number; readonly label: string; readonly color: ColorValue }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]} accessible accessibilityLabel={`${value} ${label}`}>
      <Icon color={color} size={22} />
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" tone="muted" align="center">
        {label}
      </AppText>
    </View>
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

/** Pestaña Mi: perfil, nivel y XP, estadísticas, logros, herramientas de bienestar y ajustes. */
export function ProfileScreen() {
  const tabSpace = useTabBarSpace();
  const { colors } = useTheme();
  const { name, xp, level, stages, completedModules, streak, resisted, achievements } = useProfileData();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabSpace }]}>
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
              <ProgressBar value={level.progress} height={12} color={colors.highlight} />
            </View>
            <AppText variant="caption" tone="muted">
              {xp} XP · faltan {Math.max(0, level.ceil - xp)} para el nivel {level.level + 1}
            </AppText>
          </View>
        </View>

        <View style={styles.stats}>
          <StatTile icon={Flame} value={streak} label="días de racha" color={STREAK_COLOR} />
          <StatTile icon={Layers} value={stages} label="etapas" color={colors.highlight} />
          <StatTile icon={Trophy} value={completedModules} label="temas" color={feedback.goldDeep} />
          <StatTile icon={ShieldCheck} value={resisted} label="impulsos resistidos" color={MODULE_COLORS.enfriador.base} />
        </View>

        <View style={styles.sectionHeader}>
          <AppText variant="heading" accessibilityRole="header">
            Logros
          </AppText>
          <AppText variant="bodyStrong" tone="muted">
            {unlockedCount(achievements)} de {achievements.length}
          </AppText>
        </View>
        <AchievementGrid achievements={achievements} />

        <AppText variant="heading" accessibilityRole="header" style={styles.section}>
          Tus herramientas
        </AppText>
        <Card padded={false} style={styles.menu}>
          <MenuRow icon={Trophy} title="Muro de Evidencia" subtitle="Tus victorias sobre momentos difíciles" color={MODULE_COLORS.muro.base} iconColor={MODULE_COLORS.muro.on} onPress={() => router.push('/evidence')} />
          <MenuRow icon={Users} title="Apoyo Cercano" subtitle="Tus contactos de confianza y alerta rápida" color={MODULE_COLORS.ancla.base} iconColor={MODULE_COLORS.ancla.on} onPress={() => router.push('/support')} />
          <MenuRow icon={Hourglass} title="Buzón de Impulsos" subtitle="Espera antes de decidir" color={MODULE_COLORS.enfriador.base} iconColor={MODULE_COLORS.enfriador.on} onPress={() => router.push('/impulses')} />
          <MenuRow icon={Anchor} title="Pantalla Ancla" subtitle="10 segundos con tu foto feliz" color={MODULE_COLORS.descarga.base} iconColor={MODULE_COLORS.descarga.on} onPress={() => router.push('/anchor')} />
        </Card>

        <Card padded={false} style={styles.menu}>
          <MenuRow icon={Settings} title="Ajustes" subtitle="Tema, notificaciones, sonido y privacidad" onPress={() => router.push('/settings')} />
          <MenuRow icon={Info} title="Sobre VIRA y ayuda profesional" subtitle="Líneas de ayuda y descargo" onPress={() => router.push('/about')} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1, gap: spacing.xs },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  hero: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  // ProgressBar crece en horizontal (flex: 1): necesita un contenedor en fila.
  bar: { flexDirection: 'row' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stat: { flexGrow: 1, width: '45%', alignItems: 'center', gap: 2, padding: spacing.md, borderRadius: radius.xl, borderWidth: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  section: { marginTop: spacing.sm },
  menu: { paddingVertical: spacing.xs, paddingHorizontal: spacing.xs },
});
