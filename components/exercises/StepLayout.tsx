import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { spacing } from '../../theme/tokens';

interface StepLayoutProps {
  readonly children: ReactNode;
  readonly footer: ReactNode;
}

export function StepLayout({ children, footer }: StepLayoutProps) {
  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
      <View style={styles.footer}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingVertical: spacing.md, gap: spacing.lg },
  footer: { paddingTop: spacing.sm, paddingBottom: spacing.sm, gap: spacing.sm },
});
