import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ProgressBar';
import { AppText } from '@/components/ui/AppText';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export const ONBOARDING_STEPS = 4;

interface StepFrameProps {
  readonly step: number;
  readonly title?: string;
  readonly onBack: () => void;
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

/** Marco común de los 4 pasos: saludo, barra de progreso "n / 4", contenido y pie fijo. */
export function StepFrame({ step, title = '¡Hola! Ayúdanos a personalizar tu camino ✨', onBack, children, footer }: StepFrameProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Volver al paso anterior" onPress={onBack} hitSlop={10} style={styles.back}>
            <ArrowLeft color={colors.textMuted} size={24} />
          </Pressable>
          <AppText variant="heading" align="center" accessibilityRole="header" style={styles.title}>
            {title}
          </AppText>
          <View style={styles.progressRow}>
            <ProgressBar value={step / ONBOARDING_STEPS} color={colors.success} height={10} />
            <AppText variant="caption" tone="muted" accessibilityLabel={`Paso ${step} de ${ONBOARDING_STEPS}`}>
              {step} / {ONBOARDING_STEPS}
            </AppText>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  back: { width: MIN_TOUCH, height: MIN_TOUCH, justifyContent: 'center' },
  title: { paddingHorizontal: spacing.md },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg },
  content: { padding: spacing.lg, gap: spacing.lg },
  footer: { padding: spacing.lg, gap: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
});
