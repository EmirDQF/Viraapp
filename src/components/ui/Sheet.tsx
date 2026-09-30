import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { GlassCard } from '@/components/ui/GlassCard';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const HANDLE_WIDTH = 44;
const HANDLE_HEIGHT = 5;

interface SheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
}

/** Hoja inferior modal de vidrio con asa; se cierra al tocar fuera o con el botón atrás. */
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
        <View accessibilityViewIsModal style={styles.frame}>
          <GlassCard
            padded={false}
            radius={radius.xl}
            elevation="lg"
            tint={colors.background}
            style={styles.sheet}
          >
            <View style={[styles.inner, { paddingBottom: insets.bottom + spacing.lg }]}>
              <View style={[styles.handle, { backgroundColor: colors.border }]} />
              {title ? (
                <AppText variant="title" accessibilityRole="header">
                  {title}
                </AppText>
              ) : null}
              <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                {children}
              </ScrollView>
              {footer ? <View style={styles.footer}>{footer}</View> : null}
            </View>
          </GlassCard>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  frame: { maxHeight: '88%' },
  sheet: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  inner: { paddingHorizontal: spacing.screen, paddingTop: spacing.sm, gap: spacing.md, flexShrink: 1 },
  handle: {
    alignSelf: 'center',
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: radius.pill,
    marginBottom: spacing.xs,
  },
  content: { gap: spacing.md, paddingBottom: spacing.sm },
  footer: { gap: spacing.sm },
});
