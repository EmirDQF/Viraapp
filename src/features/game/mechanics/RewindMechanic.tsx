import { CheckCircle2 } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { MODULES } from '@/data/modules/catalog';
import type { MechanicProps } from '@/features/game/types';
import { spacing } from '@/theme/tokens';
import type { RewindContent } from '@/types/content';

/** El Rewind: resumen del módulo, Regi brilla con el color del módulo y se abre el cofre. */
export function RewindMechanic({ content, moduleId, tone, onComplete }: MechanicProps<RewindContent>) {
  const meta = MODULES[moduleId];
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.hero}>
        <RegiMascot pose="growth" size={190} glow={1} glowColor={tone.base} />
        <AppText variant="title" align="center" accessibilityRole="header">
          El Rewind
        </AppText>
        <AppText tone="muted" align="center">
          Así recorriste {meta.name}
        </AppText>
      </View>
      {content.summary.map((line, index) => (
        <Animated.View key={line} entering={FadeInUp.delay(index * 150).duration(300)}>
          <Card style={styles.line}>
            <CheckCircle2 color={tone.base} size={22} />
            <AppText variant="bodyStrong" style={styles.lineText}>
              {line}
            </AppText>
          </Card>
        </Animated.View>
      ))}
      <Card tone="color" color={tone.soft}>
        <AppText variant="bodyStrong" align="center" color={tone.deep}>
          “{meta.phrase}”
        </AppText>
      </Card>
      <AppText tone="muted" align="center">
        {content.reward}
      </AppText>
      <Button3D label="Abrir el cofre" size="lg" haptics="success" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={() => onComplete({ score: 1, bestCombo: 0 })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md, paddingBottom: spacing.xl },
  hero: { alignItems: 'center', gap: spacing.xs },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  lineText: { flex: 1 },
});
