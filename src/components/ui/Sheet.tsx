import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

interface SheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

/** Hoja inferior modal con fondo atenuado; se cierra al tocar fuera o con el botón atrás. */
export function Sheet({ visible, onClose, title, children, footer }: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
        />
        <View
          accessibilityViewIsModal
          style={[styles.sheet, { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.lg }]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          {title ? (
            <AppText variant="heading" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    maxHeight: '88%',
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: radius.pill, marginBottom: spacing.xs },
  content: { gap: spacing.md, paddingBottom: spacing.sm },
  footer: { gap: spacing.sm },
});
