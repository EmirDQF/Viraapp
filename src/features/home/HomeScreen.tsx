import { router } from 'expo-router';
import { ChevronRight, Flame, Hourglass, Lock, Play, Star, Target, Zap } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ViraLogo } from '@/components/brand/ViraLogo';
import { ModuleIcon } from '@/components/game/ModuleIcon';
import { ProgressBar } from '@/components/ProgressBar';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { ProgressArc } from '@/components/ui/ProgressArc';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { StatPill } from '@/components/ui/StatPill';
import { MODULE_ORDER, MODULES } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import { openModule, openStage } from '@/features/game/navigation';
import { ModuleDial } from '@/features/home/ModuleDial';
import { dailyGoalProgress, minutesToday } from '@/lib/gamification/daily';
import { currentModule, followingModule, moduleCompletion, moduleOrder, moduleStatus, nextStage } from '@/lib/gamification/progress';
import { lighten } from '@/lib/color';
import { levelInfo } from '@/lib/gamification/xp';
import { visibleStreak } from '@/lib/streak';
import { useAppStore } from '@/store/useAppStore';
import { enterAnimation } from '@/theme/motion';
import { brand, gradients, MODULE_COLORS, onGradient, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';
import type { ModuleId, UnlockStatus } from '@/types/game';

/** Orden de los gajos en la ruleta, en sentido horario desde arriba (maqueta 2). */
const DIAL_ORDER: readonly ModuleId[] = ['hoy', 'freno', 'descarga', 'enfriador', 'muro', 'ancla'];
const DIAL_SIZE = 276;
const HERO_ARC = 248;
const HERO_REGI = 156;

function greeting(hour: number): string {
  if (hour < 12) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

function Header() {
  const { colors, isDark } = useTheme();
  const name = useAppStore((state) => state.user?.name ?? '');
  const xp = useAppStore((state) => state.xp);
  const streak = visibleStreak(useAppStore((state) => state.streak));
  const { level } = levelInfo(xp);
  return (
    <View style={styles.header}>
      <View style={styles.greetingRow}>
        <View style={styles.greetingText}>
          <AppText variant="caption" tone="muted">
            {greeting(new Date().getHours())}
          </AppText>
          <AppText variant="display" accessibilityRole="header" numberOfLines={1}>
            {name ? `Hola, ${name}` : 'Hola'}
          </AppText>
        </View>
        <ViraLogo size={52} tone={isDark ? 'onDark' : 'onLight'} />
      </View>
      <View style={styles.pills}>
        <StatPill
          icon={Flame}
          value={streak}
          unit={streak === 1 ? 'día' : 'días'}
          color={brand.coral}
          accessibilityLabel={`Racha de ${streak} ${streak === 1 ? 'día' : 'días'}`}
        />
        <StatPill icon={Zap} value={xp} unit="XP" color={colors.regi} accessibilityLabel={`${xp} puntos de experiencia`} />
        <StatPill icon={Star} value={level} unit="nivel" color={colors.highlight} accessibilityLabel={`Nivel ${level}`} />
      </View>
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
  const stagesLeft = remaining === 1 ? 'falta 1 etapa' : `faltan ${remaining} etapas`;
  let caption = '¡Completaste todo el recorrido! Puedes volver a jugar cualquier tema.';
  if (current && nextName) caption = `Te ${stagesLeft} para desbloquear ${nextName}.`;
  else if (current) caption = `Te ${stagesLeft} para completar el recorrido.`;

  return (
    <GlassCard elevation="md" style={styles.hero}>
      <View style={styles.heroInner}>
        {current ? (
          <AppText variant="overline" tone="muted" uppercase>
            {MODULES[current].name} · {Math.round(fraction * 100)} %
          </AppText>
        ) : null}
        <ProgressArc
          value={fraction}
          size={HERO_ARC}
          accessibilityLabel={`Progreso del tema actual: ${Math.round(fraction * 100)} por ciento`}
        >
          <RegiMascot pose={fraction > 0 ? 'growth' : 'calm'} size={HERO_REGI} />
        </ProgressArc>
        <AppText variant="bodyStrong" tone="muted" align="center" style={styles.caption}>
          {caption}
        </AppText>
        <Button3D
          label={next ? 'Iniciar' : 'Repasar'}
          size="lg"
          haptics="medium"
          icon={<Play color={onGradient.auroraButton} size={20} fill={onGradient.auroraButton} />}
          accessibilityHint={next ? `Retoma ${MODULES[next.moduleId].name} en la etapa ${next.stage + 1}` : undefined}
          onPress={() => (next ? openStage(next) : openModule(moduleOrder(start)[0]))}
        />
      </View>
    </GlassCard>
  );
}

function NextMissionTile() {
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const next = nextStage(modules, start);
  if (!next) return null;
  const tone = MODULE_COLORS[next.moduleId];
  const meta = MODULES[next.moduleId];
  return (
    <Card
      variant="gradient"
      gradient={tone.on === brand.ink ? [lighten(tone.base, 0.2), tone.base] : [tone.base, tone.deep]}
      raised
      onPress={() => openStage(next)}
      accessibilityLabel={`Siguiente misión: ${meta.name}, etapa ${next.stage + 1} de ${STAGES_PER_MODULE}`}
      style={styles.missionTile}
    >
      <IconTile color={tone.base} gradient={[brand.white, tone.soft]} size={52}>
        <ModuleIcon id={next.moduleId} color={tone.deep} size={26} strokeWidth={ICON_STROKE} />
      </IconTile>
      <View style={styles.flexText}>
        <AppText variant="overline" color={tone.on} uppercase>
          Siguiente misión
        </AppText>
        <AppText variant="subtitle" color={tone.on} numberOfLines={1}>
          {meta.name}
        </AppText>
        <AppText variant="caption" color={tone.on}>
          Etapa {next.stage + 1} de {STAGES_PER_MODULE}
        </AppText>
      </View>
      <ChevronRight color={tone.on} size={24} strokeWidth={2.5} />
    </Card>
  );
}

function DailyGoalTile() {
  const { colors } = useTheme();
  const today = useAppStore((state) => state.today);
  const goal = useAppStore((state) => state.dailyGoalMinutes);
  const minutes = Math.min(Math.round(minutesToday(today)), goal);
  return (
    <Card
      style={styles.bentoTile}
      accessibilityLabel={`Meta diaria: ${minutes} de ${goal} minutos`}
    >
      <IconTile icon={Target} color={colors.success} iconColor={brand.ink} size={40} />
      <AppText variant="subtitle">Meta diaria</AppText>
      <AppText variant="numberSmall" tone="muted">
        {minutes} / {goal} min
      </AppText>
      <View style={styles.barRow}>
        <ProgressBar value={dailyGoalProgress(today, goal)} color={colors.success} height={10} />
      </View>
    </Card>
  );
}

function ImpulsesTile() {
  const tone = MODULE_COLORS.enfriador;
  return (
    <Card
      onPress={() => router.push('/impulses')}
      accessibilityLabel="Abrir el Buzón de Impulsos"
      accessibilityHint="Anota un impulso y espera antes de decidir"
      style={styles.bentoTile}
    >
      <IconTile icon={Hourglass} color={tone.base} iconColor={tone.on} size={40} />
      <AppText variant="subtitle">Buzón de Impulsos</AppText>
      <AppText variant="caption" tone="muted" numberOfLines={3}>
        ¿Ganas de comprar o scrollear? Anótalo y espera.
      </AppText>
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
    <GlassCard elevation="md" style={styles.moduleCard}>
      <View style={styles.moduleCardInner}>
        <View style={styles.moduleHeader}>
          <IconTile color={tone.base} gradient={[tone.soft, tone.base, tone.deep]} size={60}>
            {locked ? (
              <Lock color={tone.on} size={28} strokeWidth={ICON_STROKE} />
            ) : (
              <ModuleIcon id={id} color={tone.on} size={30} strokeWidth={ICON_STROKE} />
            )}
          </IconTile>
          <View style={styles.flexText}>
            <AppText variant="heading" uppercase>
              {meta.name}
            </AppText>
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
          variant="accent"
          gradient={gradients.sunrise}
          disabled={locked}
          haptics="medium"
          onPress={() => openModule(id)}
        />
      </View>
    </GlassCard>
  );
}

export function HomeScreen() {
  const tabSpace = useTabBarSpace();
  const reduceMotion = useReduceMotion();
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const statuses = useMemo(
    () => Object.fromEntries(MODULE_ORDER.map((id) => [id, moduleStatus(id, modules, start)])) as Record<ModuleId, UnlockStatus>,
    [modules, start],
  );
  const [selected, setSelected] = useState<ModuleId>(() => currentModule(modules, start) ?? moduleOrder(start)[0]);
  const enter = (index: number) => enterAnimation(index, reduceMotion);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: tabSpace + spacing.lg }]}>
          <Animated.View entering={enter(0)}>
            <Header />
          </Animated.View>
          <Animated.View entering={enter(1)}>
            <ProgressHero />
          </Animated.View>
          <Animated.View entering={enter(2)} style={styles.bento}>
            <NextMissionTile />
            <View style={styles.bentoRow}>
              <DailyGoalTile />
              <ImpulsesTile />
            </View>
          </Animated.View>
          <Animated.View entering={enter(3)} style={styles.dialSection}>
            <SectionHeader overline="Elige tu habilidad" title="Mente Resiliente" />
            <AppText tone="muted">Gira la ruleta y elige qué quieres trabajar hoy.</AppText>
            <ModuleDial modules={DIAL_ORDER} selected={selected} statuses={statuses} onSelect={setSelected} size={DIAL_SIZE} />
            <SelectedModuleCard id={selected} status={statuses[selected]} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingTop: spacing.md, gap: spacing.xl },
  header: { gap: spacing.md },
  greetingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  greetingText: { flex: 1 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  hero: { borderRadius: radius.xl },
  heroInner: { alignItems: 'center', gap: spacing.md },
  caption: { maxWidth: 300 },
  bento: { gap: spacing.md },
  bentoRow: { flexDirection: 'row', gap: spacing.md },
  bentoTile: { flex: 1, gap: spacing.sm, minHeight: 168 },
  missionTile: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flexText: { flex: 1, gap: 2 },
  barRow: { flexDirection: 'row', marginTop: 'auto' },
  dialSection: { gap: spacing.md, alignItems: 'stretch' },
  moduleCard: { borderRadius: radius.xl },
  moduleCardInner: { gap: spacing.md },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
