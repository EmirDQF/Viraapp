import { CheckCircle2, Heart } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { GlassCard } from '@/components/ui/GlassCard';
import { withAlpha } from '@/lib/color';
import { spring } from '@/theme/motion';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

interface FeedbackPanelProps {
  readonly correct: boolean;
  readonly message: string;
  readonly onContinue: () => void;
  readonly continueLabel?: string;
}

const TINT_ALPHA = 0.85;

/**
 * Panel de feedback que sube desde abajo con un resorte: vidrio teñido de verde (acierto) o lila (error), con
 * Regi. Si hubo error, Regi explica con empatía (sin castigos ni lenguaje clínico).
 */
export function FeedbackPanel({ correct, message, onContinue, continueLabel = 'Continuar' }: FeedbackPanelProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const title = correct ? '¡Bien hecho!' : 'Casi. Mira esto:';
  const accent = correct ? colors.success : colors.regi;
  const entering = reduceMotion ? FadeIn : SlideInDown.springify().damping(spring.gentle.damping).stiffness(spring.gentle.stiffness);

  return (
    <Animated.View entering={entering} accessibilityLiveRegion="assertive">
      <GlassCard
        elevation="lg"
        radius={radius.xl}
        tint={withAlpha(correct ? colors.successSoft : colors.regiSoft, TINT_ALPHA)}
        style={[styles.panel, { borderColor: accent }]}
      >
        <View style={styles.inner}>
          <View style={styles.row}>
            <RegiMascot pose={correct ? 'growth' : 'empathetic'} size={72} glow={correct ? 0.6 : 0} />
            <View style={styles.text}>
              <View style={styles.titleRow}>
                {correct ? <CheckCircle2 color={colors.successText} size={22} /> : <Heart color={colors.text} size={20} />}
                <AppText variant="heading" color={correct ? colors.successText : colors.text}>
                  {title}
                </AppText>
              </View>
              <AppText>{message}</AppText>
            </View>
          </View>
          <Button3D label={continueLabel} variant={correct ? 'success' : 'primary'} onPress={onContinue} haptics="light" />
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1.5 },
  inner: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  text: { flex: 1, gap: spacing.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
