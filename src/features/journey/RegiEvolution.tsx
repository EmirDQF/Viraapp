import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Confetti } from '@/components/Confetti';
import { EvolvedRegi } from '@/components/regi/EvolvedRegi';
import { ProgressBar } from '@/components/ProgressBar';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { haptic } from '@/lib/haptics';
import { REGI_STAGES, regiStageFor, type RegiStage } from '@/lib/timeline';
import { useAppStore } from '@/store/useAppStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const stageIndex = (stage: RegiStage): number => REGI_STAGES.findIndex((item) => item.id === stage);

/** Tarjeta de evolución: Regi en su etapa actual y cuánto XP falta para la siguiente. */
export function RegiEvolutionCard() {
  const { colors } = useTheme();
  const xp = useAppStore((state) => state.xp);
  const stage = regiStageFor(xp);
  const index = stageIndex(stage);
  const current = REGI_STAGES[index];
  const next = REGI_STAGES[index + 1];
  const progress = next ? (xp - current.minXp) / (next.minXp - current.minXp) : 1;
  return (
    <Card style={styles.card} accessibilityLabel={`Regi está en etapa ${current.name}${next ? `. Faltan ${next.minXp - xp} XP para ${next.name}` : '. Etapa máxima'}`}>
      <EvolvedRegi stage={stage} size={96} pose="growth" />
      <View style={styles.flex}>
        <AppText variant="overline" tone="muted" uppercase>
          Evolución de Regi
        </AppText>
        <AppText variant="subtitle">{current.name}</AppText>
        <ProgressBar value={progress} color={colors.highlight} height={10} />
        <AppText variant="caption" tone="muted">
          {next ? `${next.minXp - xp} XP para ${next.name}` : '¡Regi alcanzó su etapa más sabia!'}
        </AppText>
      </View>
    </Card>
  );
}

/**
 * Celebra una sola vez cada nueva etapa de Regi: compara la etapa por XP con la última celebrada.
 * Se monta en Inicio y en Mi camino.
 */
export function RegiEvolutionCelebration() {
  const xp = useAppStore((state) => state.xp);
  const seen = useAppStore((state) => state.regiStageSeen);
  const markSeen = useAppStore((state) => state.markRegiStageSeen);
  const stage = regiStageFor(xp);
  const evolved = stageIndex(stage) > stageIndex(seen);

  useEffect(() => {
    if (evolved) haptic('success');
  }, [evolved]);

  if (!evolved) return null;
  const close = () => markSeen(stage);
  const name = REGI_STAGES[stageIndex(stage)].name;
  return (
    <Sheet visible onClose={close} title={`¡Regi evolucionó a ${name}!`} footer={<Button3D label="¡Vamos!" haptics="success" onPress={close} />}>
      <View style={styles.celebration}>
        <EvolvedRegi stage={stage} size={160} pose="growth" />
        <AppText align="center">Cada práctica cuenta. Tu constancia hizo crecer a Regi: sigue así, a tu ritmo.</AppText>
      </View>
      <Confetti />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: spacing.xs },
  celebration: { alignItems: 'center', gap: spacing.md },
});
