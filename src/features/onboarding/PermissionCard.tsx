import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { lighten, withAlpha } from '@/lib/color';
import type { PermissionState } from '@/store/types';
import { brand, elevation, MIN_TOUCH, radius, spacing } from '@/theme/tokens';

export interface PermissionTone {
  readonly face: string;
  readonly deep: string;
  readonly on: string;
}

interface PermissionCardProps {
  readonly title: string;
  readonly description: string;
  readonly illustration: ReactNode;
  readonly tone: PermissionTone;
  readonly state: PermissionState;
  readonly supported: boolean;
  readonly busy: boolean;
  readonly onAllow: () => void;
  readonly onSkip: () => void;
}

const ART = 88;
const BUTTON_TINT_ALPHA = 0.28;

function statusText(state: PermissionState, supported: boolean): string | null {
  if (!supported) return 'Disponible en la app instalada en tu teléfono.';
  if (state === 'granted') return 'Activado. Gracias por confiar.';
  if (state === 'denied') return 'Sin acceso. Puedes activarlo cuando quieras desde Ajustes.';
  if (state === 'skipped') return 'Lo dejamos para después.';
  return null;
}

/** Degradado de la tarjeta con texto AA: los tonos con texto oscuro se aclaran; los de texto blanco se oscurecen. */
function cardGradient(tone: PermissionTone): readonly [string, string] {
  return tone.on === brand.ink ? [lighten(tone.face, 0.18), tone.face] : [tone.face, tone.deep];
}

/** Tarjeta grande de color con ilustración, "PERMITIR ACCESO" dentro y "Ahora no" discreto (maqueta 1). */
export function PermissionCard({ title, description, illustration, tone, state, supported, busy, onAllow, onSkip }: PermissionCardProps) {
  const status = statusText(state, supported);
  const decided = state !== 'unknown';
  return (
    <View style={[styles.card, elevation.md, { backgroundColor: tone.face, borderBottomColor: tone.deep }]}>
      <LinearGradient colors={cardGradient(tone)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, styles.fill]} />
      <View style={styles.row}>
        <View style={[styles.art, elevation.sm]}>{illustration}</View>
        <View style={styles.text}>
          <AppText variant="subtitle" color={tone.on} uppercase>
            {title}
          </AppText>
          <AppText variant="caption" color={tone.on}>
            {description}
          </AppText>
        </View>
      </View>
      {state === 'granted' ? (
        <View style={styles.granted} accessibilityLiveRegion="polite">
          <Check color={tone.on} size={20} strokeWidth={3} />
          <AppText variant="bodyStrong" color={tone.on}>
            {status}
          </AppText>
        </View>
      ) : (
        <>
          <Button3D
            label="Permitir acceso"
            onPress={onAllow}
            loading={busy}
            disabled={!supported}
            tone={{ face: withAlpha(brand.white, BUTTON_TINT_ALPHA), shadow: tone.deep, text: tone.on }}
          />
          {!decided ? (
            <AnimatedPressable
              accessibilityRole="button"
              accessibilityLabel={`Ahora no: ${title}`}
              onPress={onSkip}
              haptics="selection"
              style={styles.skip}
            >
              <AppText variant="caption" color={tone.on} style={styles.skipText}>
                Ahora no
              </AppText>
            </AnimatedPressable>
          ) : null}
          {status ? (
            <AppText variant="caption" color={tone.on} align="center" accessibilityLiveRegion="polite">
              {status}
            </AppText>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 6,
    overflow: 'hidden',
    zIndex: 0,
  },
  fill: { zIndex: -1 },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  art: {
    width: ART,
    height: ART,
    borderRadius: ART * 0.32,
    backgroundColor: brand.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: spacing.xs },
  granted: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, minHeight: MIN_TOUCH },
  skip: { alignSelf: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: spacing.lg },
  skipText: { textDecorationLine: 'underline' },
});
