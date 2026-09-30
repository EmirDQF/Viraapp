import { Flame, Zap } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Confetti } from '@/components/Confetti';
import { ProgressBar } from '@/components/ProgressBar';
import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button3D } from '@/components/ui/Button3D';
import { levelInfo } from '@/lib/gamification/xp';
import { useAppStore } from '@/store/useAppStore';
import { spacing, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface StageCompleteProps {
  readonly xp: number;
  readonly score: number;
  readonly bestCombo: number;
  readonly tone: ModuleTone;
  readonly hasNext: boolean;
  readonly onNext: () => void;
  readonly onExit: () => void;
}

function headline(score: number): string {
  if (score >= 1) return '¡Perfecto, a la primera!';
  if (score >= 0.7) return '¡Muy bien!';
  return '¡Etapa completada!';
}

/** Cierre de una etapa: XP ganada, combo y progreso de nivel. Nunca hay castigo, solo avance. */
export function StageComplete({ xp, score, bestCombo, tone, hasNext, onNext, onExit }: StageCompleteProps) {
  const { colors } = useTheme();
  const totalXp = useAppStore((state) => state.xp);
  const level = levelInfo(totalXp);
  return (
    <View style={styles.root}>
      {score >= 1 ? <Confetti /> : null}
      <ScrollView contentContainerStyle={styles.body}>
        <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.hero}>
          <RegiMascot pose="growth" size={170} glow={0.6} glowColor={tone.base} />
          <AppText variant="title" align="center" accessibilityRole="header" accessibilityLiveRegion="polite">
            {headline(score)}
          </AppText>
        </Animated.View>
        <View style={styles.badges}>
          <Badge label={`+${xp} XP`} icon={<Zap color={colors.highlight} size={16} />} />
          {bestCombo >= 2 ? <Badge label={`Combo x${bestCombo}`} icon={<Flame color={colors.accentShadow} size={16} />} /> : null}
        </View>
        <View style={styles.level}>
          <AppText variant="caption" tone="muted">
            Nivel {level.level} · {totalXp - level.floor} / {level.ceil - level.floor} XP
          </AppText>
          <View style={styles.bar}>
            <ProgressBar value={level.progress} color={tone.base} height={12} />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {hasNext ? (
          <Button3D label="Siguiente etapa" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={onNext} haptics="medium" />
        ) : null}
        <Button3D label="Volver al recorrido" variant="outline" onPress={onExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  body: { flexGrow: 1, justifyContent: 'center', gap: spacing.lg },
  hero: { alignItems: 'center', gap: spacing.sm },
  badges: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  level: { gap: spacing.xs, alignItems: 'center' },
  bar: { flexDirection: 'row', alignSelf: 'stretch' },
  footer: { gap: spacing.sm, paddingTop: spacing.md },
});
