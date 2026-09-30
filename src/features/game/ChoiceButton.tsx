import { Check, X } from 'lucide-react-native';
import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming, ZoomIn } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { IconTile } from '@/components/ui/IconTile';
import { spring } from '@/theme/motion';
import { brand, elevationFor, MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { useReduceMotion } from '@/theme/useReduceMotion';

export type ChoiceState = 'idle' | 'correct' | 'wrong' | 'dimmed';

interface ChoiceButtonProps {
  readonly label: string;
  readonly badge?: string;
  readonly state?: ChoiceState;
  readonly disabled?: boolean;
  readonly onPress: () => void;
}

const BADGE_SIZE = 36;
const SHAKE = 8;
const SHAKE_STEP_MS = 60;
const DIMMED_OPACITY = 0.55;

/**
 * Opción de respuesta en tarjeta grande (preguntas, decisiones y debate): letra en un IconTile, verde con check
 * animado al acertar y una sacudida suave al fallar.
 */
export const ChoiceButton = memo(function ChoiceButton({ label, badge, state = 'idle', disabled = false, onPress }: ChoiceButtonProps) {
  const { colors, isDark } = useTheme();
  const reduceMotion = useReduceMotion();
  const shake = useSharedValue(0);

  useEffect(() => {
    if (state !== 'wrong' || reduceMotion) return;
    shake.set(
      withSequence(
        withTiming(-SHAKE, { duration: SHAKE_STEP_MS }),
        withTiming(SHAKE, { duration: SHAKE_STEP_MS }),
        withTiming(-SHAKE / 2, { duration: SHAKE_STEP_MS }),
        withTiming(0, { duration: SHAKE_STEP_MS }),
      ),
    );
  }, [reduceMotion, shake, state]);

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() }] }));

  const tone = {
    idle: { bg: colors.surface, border: isDark ? colors.glassBorder : colors.border, lip: colors.border },
    correct: { bg: colors.successSoft, border: colors.success, lip: colors.successShadow },
    wrong: { bg: colors.dangerSoft, border: colors.danger, lip: colors.dangerShadow },
    dimmed: { bg: colors.surface, border: colors.border, lip: colors.border },
  }[state];
  const stateLabel = state === 'correct' ? ', correcta' : state === 'wrong' ? ', incorrecta' : '';

  return (
    <Animated.View style={shakeStyle}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={`${badge ? `Opción ${badge}: ` : ''}${label}${stateLabel}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        haptics={disabled ? 'none' : 'light'}
        onPress={onPress}
        style={[
          styles.choice,
          state === 'idle' ? elevationFor('sm', isDark) : null,
          {
            backgroundColor: tone.bg,
            borderColor: tone.border,
            borderBottomColor: tone.lip,
            opacity: state === 'dimmed' ? DIMMED_OPACITY : 1,
          },
        ]}
      >
        <ChoiceBadge badge={badge} state={state} />
        <AppText variant="bodyStrong" style={styles.label}>
          {label}
        </AppText>
      </AnimatedPressable>
    </Animated.View>
  );
});

function ChoiceBadge({ badge, state }: { readonly badge?: string; readonly state: ChoiceState }) {
  const { colors } = useTheme();
  if (state === 'correct') {
    return (
      <Animated.View entering={ZoomIn.springify().damping(spring.snappy.damping)}>
        <IconTile color={colors.success} iconColor={brand.ink} size={BADGE_SIZE}>
          <Check color={brand.ink} size={20} strokeWidth={3} />
        </IconTile>
      </Animated.View>
    );
  }
  if (state === 'wrong') {
    return (
      <IconTile color={colors.danger} size={BADGE_SIZE}>
        <X color={brand.white} size={20} strokeWidth={3} />
      </IconTile>
    );
  }
  if (!badge) return null;
  return (
    <View style={[styles.letter, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
      <AppText variant="bodyStrong" tone="primary" uppercase>
        {badge}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: MIN_TOUCH + 16,
  },
  letter: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE * 0.32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1 },
});
