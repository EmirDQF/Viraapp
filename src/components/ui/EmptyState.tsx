import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { RegiMascot, type RegiPose } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { spring } from '@/theme/motion';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

const REGI_SIZE = 160;
const HALO_SIZE = REGI_SIZE * 1.15;
const MESSAGE_MAX_WIDTH = 320;

export interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly pose?: RegiPose;
  readonly children?: ReactNode;
}

/** Estado vacío/amable con Regi sobre un halo suave: se usa en pantallas sin datos todavía o con errores. */
export function EmptyState({ title, message, pose = 'calm', children }: EmptyStateProps) {
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const entering = reduceMotion ? FadeIn : ZoomIn.springify().damping(spring.gentle.damping);

  return (
    <View style={styles.center}>
      <Animated.View entering={entering} style={styles.figure}>
        <View style={[styles.halo, { backgroundColor: colors.regiSoft }]} />
        <RegiMascot pose={pose} size={REGI_SIZE} />
      </Animated.View>
      <AppText variant="title" align="center" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="muted" align="center" style={styles.message}>
        {message}
      </AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  figure: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  halo: { position: 'absolute', width: HALO_SIZE, height: HALO_SIZE, borderRadius: HALO_SIZE / 2 },
  message: { maxWidth: MESSAGE_MAX_WIDTH },
});
