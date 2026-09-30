import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface ScreenProps {
  readonly children: ReactNode;
  readonly scroll?: boolean;
  readonly footer?: ReactNode;
  readonly header?: ReactNode;
}

export function Screen({ children, scroll = false, footer, header }: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {header ? <View style={styles.header}>{header}</View> : null}
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
      {footer ? <View style={[styles.footer, { borderTopColor: colors.border }]}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
});
