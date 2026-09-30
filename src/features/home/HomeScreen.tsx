import { Flame, Lock, Target, Zap } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ViraLogo } from '@/components/brand/ViraLogo';
import { ModuleIcon } from '@/components/game/ModuleIcon';
import { ProgressBar } from '@/components/ProgressBar';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { ProgressArc } from '@/components/ui/ProgressArc';
import { MODULE_ORDER, MODULES } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import { openModule, openStage } from '@/features/game/navigation';
import { ModuleDial } from '@/features/home/ModuleDial';
import { dailyGoalProgress, minutesToday } from '@/lib/gamification/daily';
import { currentModule, followingModule, moduleCompletion, moduleStatus, moduleOrder, nextStage } from '@/lib/gamification/progress';
import { visibleStreak } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';
import { MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId, UnlockStatus } from '@/types/game';

/** Orden de los gajos en la ruleta, en sentido horario desde arriba (docs/IMAGENES 2.jpg). */
const DIAL_ORDER: readonly ModuleId[] = ['hoy', 'freno', 'descarga', 'enfriador', 'muro', 'ancla'];


function StatsRow() {
  const { colors } = useTheme();
  const xp = useAppStore((state) => state.xp);
  const streak = visibleStreak(useAppStore((state) => state.streak));
  return (
    <View style={styles.statsRow}>
      <Badge
        label={`${streak}`}
        accessibilityLabel={`Racha de ${streak} ${streak === 1 ? 'día' : 'días'}`}
        icon={<Flame color={colors.accentShadow} size={16} fill={streak > 0 ? colors.accent : 'none'} />}
      />
      <ViraLogo size={64} />
      <Badge label={`${xp} XP`} accessibilityLabel={`${xp} puntos de experiencia`} icon={<Zap color={colors.highlight} size={16} />} />
    </View>
  );
}

function ProgressHero() {
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const current = currentModule(modules, start);
  const next = nextStage(modules, start);
  const fraction = current ? moduleCompletion(current, modules) : 1;
  const remaining = current ? Math.round(STAGES_PER_MODULE * (1 - fraction)) : 0;
  const following = followingModule(modules, start);
  const nextName = following ? MODULES[following].name : null;
  let caption = '¡Completaste todo el recorrido! Puedes volver a jugar cualquier tema.';
  if (current && nextName) caption = `Te ${remaining === 1 ? 'falta 1 etapa' : `faltan ${remaining} etapas`} para desbloquear ${nextName}.`;
  else if (current) caption = `Te ${remaining === 1 ? 'falta 1 etapa' : `faltan ${remaining} etapas`} para completar el recorrido.`;
  const tone = current ? MODULE_COLORS[current] : null;

  return (
    <View style={styles.hero}>
      <ProgressArc
        value={fraction}
        size={272}
        color={tone?.base}
        accessibilityLabel={`Progreso del tema actual: ${Math.round(fraction * 100)} por ciento`}
      >
        <RegiMascot pose={fraction > 0 ? 'growth' : 'calm'} size={176} />
      </ProgressArc>
      <AppText variant="bodyStrong" tone="muted" align="center" style={styles.caption}>
        {caption}
      </AppText>
      <Button3D
        label={next ? 'Iniciar' : 'Repasar'}
        size="lg"
        haptics="medium"
        accessibilityHint={next ? `Retoma ${MODULES[next.moduleId].name} en la etapa ${next.stage + 1}` : undefined}
        onPress={() => (next ? openStage(next) : openModule(moduleOrder(start)[0]))}
      />
    </View>
  );
}

function DailyGoal() {
  const { colors } = useTheme();
  const today = useAppStore((state) => state.today);
  const goal = useAppStore((state) => state.dailyGoalMinutes);
  const minutes = Math.round(minutesToday(today));
  return (
    <Card style={styles.goal}>
      <View style={styles.goalHeader}>
        <Target color={colors.highlight} size={20} />
        <AppText variant="subtitle">Meta diaria</AppText>
        <AppText variant="caption" tone="muted" style={styles.goalValue}>
          {Math.min(minutes, goal)} / {goal} min
        </AppText>
      </View>
      <ProgressBar value={dailyGoalProgress(today, goal)} color={colors.success} height={14} />
    </Card>
  );
}

function SelectedModuleCard({ id, status }: { readonly id: ModuleId; readonly status: UnlockStatus }) {
  const start = useAppStore((state) => state.onboarding.firstModule);
  const meta = MODULES[id];
  const tone = MODULE_COLORS[id];
  const locked = status === 'locked';
  const order = moduleOrder(start);
  const previous = order[order.indexOf(id) - 1];
  return (
    <Card style={styles.moduleCard}>
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIcon, { backgroundColor: tone.base }]}>
          {locked ? <Lock color={tone.on} size={26} /> : <ModuleIcon id={id} color={tone.on} size={28} />}
        </View>
        <View style={styles.moduleText}>
          <AppText variant="heading">{meta.name}</AppText>
          <AppText tone="muted">{meta.tagline}</AppText>
        </View>
      </View>
      {locked && previous ? (
        <AppText variant="caption" tone="muted">
          Completa {MODULES[previous].name} para desbloquear este tema.
        </AppText>
      ) : null}
      <Button3D
        label={locked ? 'Bloqueado' : 'Comenzar sesión'}
        disabled={locked}
        tone={{ face: tone.base, shadow: tone.deep, text: tone.on }}
        gradient={[tone.base, tone.deep]}
        haptics="medium"
        onPress={() => openModule(id)}
      />
    </Card>
  );
}

export function HomeScreen() {
  const { colors } = useTheme();
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const statuses = useMemo(
    () => Object.fromEntries(MODULE_ORDER.map((id) => [id, moduleStatus(id, modules, start)])) as Record<ModuleId, UnlockStatus>,
    [modules, start],
  );
  const [selected, setSelected] = useState<ModuleId>(() => currentModule(modules, start) ?? moduleOrder(start)[0]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <StatsRow />
        <ProgressHero />
        <DailyGoal />
        <View style={styles.section}>
          <AppText variant="title" align="center" accessibilityRole="header">
            Mente Resiliente
          </AppText>
          <AppText tone="muted" align="center">
            Gira la ruleta y elige qué habilidad quieres trabajar hoy.
          </AppText>
        </View>
        <ModuleDial modules={DIAL_ORDER} selected={selected} statuses={statuses} onSelect={setSelected} size={292} />
        <SelectedModuleCard id={selected} status={statuses[selected]} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.xl, paddingBottom: spacing.xxxl },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { alignItems: 'center', gap: spacing.md },
  caption: { maxWidth: 320 },
  goal: { gap: spacing.sm },
  goalHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  goalValue: { marginLeft: 'auto' },
  section: { gap: spacing.xs, marginTop: spacing.md },
  moduleCard: { gap: spacing.md },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  moduleIcon: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  moduleText: { flex: 1, gap: 2 },
});
