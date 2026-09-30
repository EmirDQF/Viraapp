import { Heart, Zap } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { mirrorScores } from '@/lib/gamification/mirror';
import { enterAnimation } from '@/theme/motion';
import { elevationFor, gradients, MODULE_COLORS, radius, spacing, type GradientStops, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

interface MirrorViewProps {
  readonly firstChoiceGood: boolean;
  readonly tone?: ModuleTone;
  readonly onContinue: () => void;
}

interface SideProps {
  readonly title: string;
  readonly caption: string;
  readonly percent: number;
  readonly glow: number;
  readonly ring: { readonly color?: string; readonly gradient?: GradientStops };
  readonly background: string;
  readonly highlighted: boolean;
  readonly icon: ReactNode;
  readonly index: number;
}

const REGI_SIZE = 112;
const RING_SIZE = 108;

/**
 * Una columna del espejo. Todo el texto usa el color del tema sobre un fondo del mismo tema (claro sobre
 * tinte oscuro y viceversa), con contraste AA verificado en los tests de tokens.
 */
function MirrorSide({ title, caption, percent, glow, ring, background, highlighted, icon, index }: SideProps) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  return (
    <Animated.View
      entering={enterAnimation(index, reduceMotion)}
      accessible
      accessibilityLabel={`${title}: ${percent} por ciento. ${caption}${highlighted ? '. Tu primera elección' : ''}`}
      style={[
        styles.side,
        highlighted ? elevationFor('md', isDark) : null,
        { backgroundColor: background, borderColor: highlighted ? colors.highlight : 'transparent' },
      ]}
    >
      <AppText variant="bodyStrong" align="center" uppercase style={styles.title}>
        {title}
      </AppText>
      <RegiMascot pose={glow > 0 ? 'resilient' : 'empathetic'} size={REGI_SIZE} glow={glow} glowColor={ring.color} />
      <ProgressRing
        value={percent / 100}
        size={RING_SIZE}
        strokeWidth={11}
        color={ring.color}
        gradient={ring.gradient}
        glow={glow > 0}
        durationMs={900}
      >
        {icon}
        <AnimatedNumber value={percent} suffix="%" variant="subtitle" color={colors.text} />
      </ProgressRing>
      <AppText variant="caption" align="center" uppercase>
        {caption}
      </AppText>
      {highlighted ? (
        <View style={[styles.chip, { backgroundColor: colors.surface }]}>
          <AppText variant="overline" tone="primary" align="center">
            Tu primera elección
          </AppText>
        </View>
      ) : null}
    </Animated.View>
  );
}

/** Espejo emocional (maqueta 3): reacción impulsiva (gris y tensa) frente a respuesta resiliente (luminosa). */
export function MirrorView({ firstChoiceGood, tone = MODULE_COLORS.descarga, onContinue }: MirrorViewProps) {
  const { colors, isDark } = useTheme();
  const scores = mirrorScores(firstChoiceGood);
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <AppText variant="title" align="center" uppercase accessibilityRole="header">
        Espejo emocional
      </AppText>
      <View style={styles.split}>
        <MirrorSide
          index={0}
          title="Reacción impulsiva"
          caption="Decisión impulsiva · baja resiliencia"
          percent={scores.impulsive}
          glow={-1}
          ring={{ color: colors.danger }}
          background={colors.surfaceAlt}
          highlighted={!firstChoiceGood}
          icon={<Zap color={colors.dangerText} size={18} />}
        />
        <MirrorSide
          index={1}
          title="Respuesta resiliente"
          caption="Herramienta utilizada · alta resiliencia"
          percent={scores.resilient}
          glow={1}
          ring={{ color: tone.base, gradient: gradients.growth }}
          background={isDark ? tone.softDark : tone.soft}
          highlighted={firstChoiceGood}
          icon={<Heart color={colors.successText} size={18} fill={colors.successText} />}
        />
      </View>
      <AppText tone="muted" align="center">
        {firstChoiceGood
          ? 'Elegiste la respuesta resiliente a la primera. Regi brilla contigo.'
          : 'Primero reaccionaste en automático y luego cambiaste de rumbo. Eso también es resiliencia.'}
      </AppText>
      <Button3D label="Continuar" onPress={onContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingBottom: spacing.xl },
  split: { flexDirection: 'row', gap: spacing.sm },
  side: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 2,
  },
  title: { minHeight: 46 },
  chip: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs, borderRadius: radius.pill },
});
