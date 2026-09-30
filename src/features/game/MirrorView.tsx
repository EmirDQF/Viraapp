import { Heart, Zap } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { mirrorScores } from '@/lib/gamification/mirror';
import { MODULE_COLORS, radius, spacing, type ModuleTone } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

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
  readonly ringColor: string;
  readonly background: string;
  readonly highlighted: boolean;
  readonly icon: React.ReactNode;
}

function MirrorSide({ title, caption, percent, glow, ringColor, background, highlighted, icon }: SideProps) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityLabel={`${title}: ${percent} por ciento. ${caption}${highlighted ? '. Tu primera elección' : ''}`}
      style={[styles.side, { backgroundColor: background, borderColor: highlighted ? colors.highlight : 'transparent' }]}
    >
      <AppText variant="subtitle" align="center" uppercase>
        {title}
      </AppText>
      <RegiMascot pose={glow > 0 ? 'resilient' : 'empathetic'} size={118} glow={glow} glowColor={ringColor} />
      <ProgressRing value={percent / 100} size={104} strokeWidth={10} color={ringColor}>
        {icon}
        <AppText variant="subtitle">{percent}%</AppText>
      </ProgressRing>
      <AppText variant="caption" tone="muted" align="center">
        {caption}
      </AppText>
      {highlighted ? (
        <AppText variant="overline" tone="primary" align="center">
          Tu primera elección
        </AppText>
      ) : null}
    </View>
  );
}

/** Espejo emocional (maqueta 3): refleja la elección del usuario. Reacción impulsiva frente a respuesta resiliente. */
export function MirrorView({ firstChoiceGood, tone = MODULE_COLORS.descarga, onContinue }: MirrorViewProps) {
  const { colors } = useTheme();
  const scores = mirrorScores(firstChoiceGood);
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <AppText variant="title" align="center" accessibilityRole="header">
        Espejo emocional
      </AppText>
      <Animated.View entering={FadeInUp.duration(400)} style={styles.split}>
        <MirrorSide
          title="Reacción impulsiva"
          caption="Decisión impulsiva · baja resiliencia"
          percent={scores.impulsive}
          glow={-1}
          ringColor={colors.danger}
          background={colors.surfaceAlt}
          highlighted={!firstChoiceGood}
          icon={<Zap color={colors.danger} size={18} />}
        />
        <MirrorSide
          title="Respuesta resiliente"
          caption="Herramienta utilizada · alta resiliencia"
          percent={scores.resilient}
          glow={1}
          ringColor={tone.base}
          background={tone.soft}
          highlighted={firstChoiceGood}
          icon={<Heart color={tone.base} size={18} />}
        />
      </Animated.View>
      <AppText tone="muted" align="center">
        {firstChoiceGood
          ? 'Elegiste la respuesta resiliente a la primera. Regi brilla contigo.'
          : 'Primero reaccionaste en automático y luego cambiaste de rumbo. Eso también es resiliencia.'}
      </AppText>
      <Button3D label="Continuar" tone={{ face: tone.base, shadow: tone.deep, text: tone.on }} onPress={onContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.lg, paddingBottom: spacing.xl },
  split: { flexDirection: 'row', gap: spacing.sm },
  side: { flex: 1, alignItems: 'center', gap: spacing.sm, padding: spacing.sm, borderRadius: radius.xl, borderWidth: 2 },
});
