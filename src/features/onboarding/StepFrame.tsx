import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { gradients, MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export const ONBOARDING_STEPS = 4;

interface StepFrameProps {
  readonly step: number;
  readonly title?: string;
  readonly onBack: () => void;
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

/** Marco común de los 4 pasos: saludo, barra "n / 4" con degradado aurora, contenido y pie fijo. */
export function StepFrame({ step, title = '¡Hola! Ayúdanos a personalizar tu camino ✨', onBack, children, footer }: StepFrameProps) {
  const { colors } = useTheme();
  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.header}>
            <AnimatedPressable
              accessibilityRole="button"
              accessibilityLabel="Volver al paso anterior"
              onPress={onBack}
              hitSlop={10}
              style={styles.backWrap}
            >
              <GlassCard padded={false} radius={radius.pill} style={styles.back}>
                <View style={styles.back}>
                  <ArrowLeft color={colors.text} size={22} strokeWidth={ICON_STROKE} />
                </View>
              </GlassCard>
            </AnimatedPressable>
            <AppText variant="title" align="center" accessibilityRole="header" style={styles.title}>
              {title}
            </AppText>
            <View style={styles.progressRow}>
              <ProgressBar value={step / ONBOARDING_STEPS} gradient={gradients.aurora} color={gradients.aurora[1]} height={12} />
              <AppText variant="numberSmall" tone="muted" accessibilityLabel={`Paso ${step} de ${ONBOARDING_STEPS}`}>
                {step} / {ONBOARDING_STEPS}
              </AppText>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          <View style={styles.footer}>{footer}</View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, gap: spacing.md },
  backWrap: { alignSelf: 'flex-start' },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  title: { paddingHorizontal: spacing.sm },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg },
  footer: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.sm },
});
