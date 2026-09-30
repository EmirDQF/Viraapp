import { CheckCircle2, Heart } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface FeedbackPanelProps {
  readonly correct: boolean;
  readonly message: string;
  readonly onContinue: () => void;
  readonly continueLabel?: string;
}

/** Panel inferior tipo Duolingo. Si hubo error, Regi explica con empatía (sin castigos ni lenguaje clínico). */
export function FeedbackPanel({ correct, message, onContinue, continueLabel = 'Continuar' }: FeedbackPanelProps) {
  const { colors } = useTheme();
  const title = correct ? '¡Bien hecho!' : 'Casi. Mira esto:';
  return (
    <Animated.View
      entering={SlideInDown.duration(220)}
      accessibilityLiveRegion="assertive"
      style={[styles.panel, { backgroundColor: correct ? colors.successSoft : colors.surfaceAlt, borderColor: correct ? colors.success : colors.border }]}
    >
      <View style={styles.row}>
        <RegiMascot pose={correct ? 'growth' : 'empathetic'} size={64} />
        <View style={styles.text}>
          <View style={styles.titleRow}>
            {correct ? <CheckCircle2 color={colors.successText} size={20} /> : <Heart color={colors.highlight} size={18} />}
            <AppText variant="subtitle" color={correct ? colors.successText : colors.highlight}>
              {title}
            </AppText>
          </View>
          <AppText>{message}</AppText>
        </View>
      </View>
      <Button3D label={continueLabel} variant={correct ? 'success' : 'primary'} onPress={onContinue} haptics="light" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { borderRadius: radius.xxl, borderWidth: 1.5, padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  text: { flex: 1, gap: spacing.xs },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
