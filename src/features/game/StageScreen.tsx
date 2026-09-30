import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { EmptyState } from '@/components/ui/ComingSoon';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { getModuleContent } from '@/data/modules';
import { MODULES } from '@/data/modules/catalog';
import { SECTORS, STAGES, STAGES_PER_MODULE } from '@/data/stages';
import { MirrorView } from '@/features/game/MirrorView';
import { StageComplete } from '@/features/game/StageComplete';
import { StageMechanic } from '@/features/game/StageMechanic';
import type { DecisionOutcome } from '@/features/game/types';
import { useSfx } from '@/features/game/useSfx';
import { goBackOrHome, replaceStage } from '@/features/game/navigation';
import { lighten } from '@/lib/color';
import { stageStatus } from '@/lib/gamification/progress';
import { xpForStage, type StageResult } from '@/lib/gamification/xp';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleContent } from '@/types/content';
import type { ModuleId } from '@/types/game';

type Phase =
  | { readonly kind: 'play' }
  | { readonly kind: 'mirror'; readonly result: DecisionOutcome }
  | { readonly kind: 'complete'; readonly result: StageResult; readonly xp: number };

const REWIND_STAGE = STAGES_PER_MODULE - 1;

function loadContent(id: ModuleId): ModuleContent | null {
  try {
    return getModuleContent(id);
  } catch {
    return null;
  }
}

/** Ejecuta una etapa: muestra su mecánica, registra el resultado y da XP (sin vidas ni castigos). */
export function StageScreen({ moduleId, stage }: { readonly moduleId: ModuleId; readonly stage: number }) {
  const { colors } = useTheme();
  const tone = MODULE_COLORS[moduleId];
  const stageDef = STAGES[stage];
  const content = useMemo(() => loadContent(moduleId), [moduleId]);
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const recordStage = useAppStore((state) => state.recordStage);
  const addXp = useAppStore((state) => state.addXp);
  const registerPractice = useAppStore((state) => state.registerPractice);
  const play = useSfx();
  const [phase, setPhase] = useState<Phase>({ kind: 'play' });
  const [initialStatus] = useState(() => stageStatus(moduleId, stage, modules, start));

  const finish = (result: StageResult) => {
    const xp = xpForStage(result);
    recordStage({ moduleId, stage }, result.score);
    addXp(xp);
    registerPractice(stageDef.minutes);
    play('complete');
    if (stage === REWIND_STAGE) {
      router.replace({ pathname: '/reward', params: { module: moduleId } });
      return;
    }
    setPhase({ kind: 'complete', result, xp });
  };

  const onDecision = (outcome: DecisionOutcome) => setPhase({ kind: 'mirror', result: outcome });

  if (!content || !stageDef) {
    return (
      <ScreenBackground variant="regi">
        <SafeAreaView style={styles.safe}>
          <EmptyState title="No pudimos abrir esta etapa" message="Algo salió mal al cargar el contenido. Vuelve al recorrido e inténtalo de nuevo." pose="empathetic">
            <Button3D label="Volver" onPress={goBackOrHome} />
          </EmptyState>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  if (initialStatus === 'locked') {
    return (
      <ScreenBackground variant="regi">
        <SafeAreaView style={styles.safe}>
          <EmptyState title="Esta etapa aún está bloqueada" message="Completa la etapa anterior para llegar aquí. Paso a paso." pose="empathetic">
            <Button3D label="Volver al recorrido" onPress={goBackOrHome} />
          </EmptyState>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const sector = SECTORS.find((item) => item.id === stageDef.sector);
  const hasNext = stage + 1 < STAGES_PER_MODULE;

  return (
    <ScreenBackground plain>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <AnimatedPressable accessibilityRole="button" accessibilityLabel="Salir de la etapa" onPress={goBackOrHome} hitSlop={10}>
            <GlassCard padded={false} radius={radius.pill} style={styles.close}>
              <View style={styles.close}>
                <X color={colors.text} size={22} strokeWidth={2.5} />
              </View>
            </GlassCard>
          </AnimatedPressable>
          <View style={styles.headerText}>
            <AppText variant="overline" tone="muted" uppercase>
              {MODULES[moduleId].name} · {sector?.title}
            </AppText>
            <AppText variant="subtitle" numberOfLines={1}>
              {stageDef.title}
            </AppText>
          </View>
        </View>
        <View style={styles.progress}>
          <ProgressBar
            value={(stage + (phase.kind === 'complete' ? 1 : 0)) / STAGES_PER_MODULE}
            color={tone.base}
            gradient={[lighten(tone.base, 0.3), tone.base, tone.deep]}
            height={18}
          />
          <AppText variant="numberSmall" tone="muted">
            {stage + 1}/{STAGES_PER_MODULE}
          </AppText>
        </View>
        <View style={styles.body}>
          {phase.kind === 'play' ? (
            <ErrorBoundary
              fallback={
                <EmptyState title="Esta etapa tuvo un problema" message="No es tu culpa. Vuelve al recorrido e inténtalo de nuevo." pose="empathetic">
                  <Button3D label="Volver" onPress={goBackOrHome} />
                </EmptyState>
              }
            >
              <StageMechanic key={stage} stage={stage} content={content} moduleId={moduleId} tone={tone} onComplete={finish} onDecision={onDecision} />
            </ErrorBoundary>
          ) : null}
          {phase.kind === 'mirror' ? <MirrorView firstChoiceGood={phase.result.firstChoiceGood} tone={tone} onContinue={() => finish(phase.result)} /> : null}
          {phase.kind === 'complete' ? (
            <StageComplete
              xp={phase.xp}
              score={phase.result.score}
              bestCombo={phase.result.bestCombo}
              tone={tone}
              hasNext={hasNext}
              onNext={() => replaceStage({ moduleId, stage: stage + 1 })}
              onExit={goBackOrHome}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.screen, paddingTop: spacing.xs },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  progress: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.screen, paddingVertical: spacing.md },
  body: { flex: 1, paddingHorizontal: spacing.screen, paddingBottom: spacing.md },
});
