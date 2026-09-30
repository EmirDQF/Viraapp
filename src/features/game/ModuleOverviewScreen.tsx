import { ArrowLeft, Lock } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MechanicIcon } from '@/components/game/ModuleIcon';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { MODULES } from '@/data/modules/catalog';
import { SECTORS, STAGES } from '@/data/stages';
import { goBackOrHome, openStage } from '@/features/game/navigation';
import { moduleCompletion, moduleStatus, stageStatus } from '@/lib/gamification/progress';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, MODULE_COLORS, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleId } from '@/types/game';
import { ScreenBackground } from '@/components/ui/ScreenBackground';

/** Portada de un tema: idea central, sectores y etapas. Desde aquí se juega o se rejuega. */
export function ModuleOverviewScreen({ id }: { readonly id: ModuleId }) {
  const { colors } = useTheme();
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const meta = MODULES[id];
  const tone = MODULE_COLORS[id];
  const status = moduleStatus(id, modules, start);
  const firstPending = STAGES.find((stage) => stageStatus(id, stage.index, modules, start) === 'unlocked');
  const percent = Math.round(moduleCompletion(id, modules) * 100);

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.hero, { backgroundColor: tone.base }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver" onPress={goBackOrHome} hitSlop={12} style={styles.back}>
            <ArrowLeft color={tone.on} size={26} />
          </Pressable>
          <RegiMascot pose={status === 'completed' ? 'growth' : 'resilient'} size={120} glow={status === 'completed' ? 0.8 : 0} glowColor={tone.soft} />
          <AppText variant="overline" color={tone.on}>
            {meta.track}
          </AppText>
          <AppText variant="title" color={tone.on} align="center" accessibilityRole="header">
            {meta.name}
          </AppText>
          <AppText color={tone.on} align="center">
            {meta.focus}
          </AppText>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Card tone="alt">
            <AppText variant="overline" tone="muted">
              Idea central
            </AppText>
            <AppText variant="bodyStrong">{meta.idea}</AppText>
          </Card>
          {SECTORS.map((sector) => (
            <View key={sector.id} style={styles.sector}>
              <AppText variant="subtitle">{sector.title}</AppText>
              <AppText variant="caption" tone="muted">
                {sector.summary}
              </AppText>
              {STAGES.filter((stage) => stage.sector === sector.id).map((stage) => {
                const state = stageStatus(id, stage.index, modules, start);
                const locked = state === 'locked';
                return (
                  <Pressable
                    key={stage.index}
                    accessibilityRole="button"
                    accessibilityLabel={`Etapa ${stage.index + 1}: ${stage.title}${locked ? ', bloqueada' : ''}${state === 'completed' ? ', completada' : ''}`}
                    accessibilityState={{ disabled: locked }}
                    disabled={locked}
                    onPress={() => openStage({ moduleId: id, stage: stage.index })}
                    style={[styles.stage, { backgroundColor: colors.surface, borderColor: colors.border, opacity: locked ? 0.6 : 1 }]}
                  >
                    <View style={[styles.stageIcon, { backgroundColor: locked ? colors.disabled : tone.base }]}>
                      {locked ? <Lock color={colors.textMuted} size={18} /> : <MechanicIcon kind={stage.kind} color={tone.on} size={20} />}
                    </View>
                    <AppText variant="bodyStrong" style={styles.stageTitle}>
                      {stage.index + 1}. {stage.title}
                    </AppText>
                    <AppText variant="caption" tone={state === 'completed' ? 'success' : 'muted'}>
                      {state === 'completed' ? 'Hecha' : `${stage.minutes} min`}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button3D
            label={status === 'locked' ? 'Tema bloqueado' : firstPending ? `Jugar etapa ${firstPending.index + 1}` : `Rejugar (${percent}%)`}
            disabled={status === 'locked'}
            tone={{ face: tone.base, shadow: tone.deep, text: tone.on }}
            haptics="medium"
            onPress={() => openStage({ moduleId: id, stage: firstPending?.index ?? 0 })}
          />
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
    borderBottomLeftRadius: radius.xxl,
    borderBottomRightRadius: radius.xxl,
  },
  back: { position: 'absolute', left: spacing.md, top: spacing.md, width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  sector: { gap: spacing.sm },
  stage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    minHeight: MIN_TOUCH + 12,
  },
  stageIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stageTitle: { flex: 1 },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
