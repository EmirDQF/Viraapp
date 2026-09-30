import { ScrollView, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { EvidenceSim, MicroStepsSim, SupportSim } from '@/features/game/mechanics/simulators/ChoiceSims';
import { JournalSim } from '@/features/game/mechanics/simulators/JournalSim';
import { ImpulseTimerSim, PauseBreathSim } from '@/features/game/mechanics/simulators/TimerSims';
import type { MechanicProps } from '@/features/game/types';
import type { ModuleTone } from '@/theme/tokens';
import { spacing } from '@/theme/tokens';
import type { SimulatorContent, SimulatorKind } from '@/types/content';

export interface SimProps {
  readonly content: SimulatorContent;
  readonly tone: ModuleTone;
  readonly onDone: () => void;
}

const SIMULATORS: Readonly<Record<SimulatorKind, (props: SimProps) => React.JSX.Element>> = {
  journal: JournalSim,
  'impulse-timer': ImpulseTimerSim,
  'pause-breath': PauseBreathSim,
  'micro-steps': MicroStepsSim,
  'support-message': SupportSim,
  'evidence-log': EvidenceSim,
};

/** Simulador de interfaz: una mini-herramienta real de cada módulo (buzón, pausa, micropasos…). */
export function SimulatorMechanic({ content, tone, onComplete }: MechanicProps<SimulatorContent>) {
  const Simulator = SIMULATORS[content.kind];
  return (
    <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
      <AppText variant="heading" accessibilityRole="header">
        {content.title}
      </AppText>
      <AppText tone="muted">{content.intro}</AppText>
      <Simulator content={content} tone={tone} onDone={() => onComplete({ score: 1, bestCombo: 0 })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md, paddingBottom: spacing.xl },
});
