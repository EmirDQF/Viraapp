import { Check } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { withAlpha } from '@/lib/color';
import type { PermissionState } from '@/store/types';
import { brand, MIN_TOUCH, radius, spacing } from '@/theme/tokens';

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

function statusText(state: PermissionState, supported: boolean): string | null {
  if (!supported) return 'Disponible en la app instalada en tu teléfono.';
  if (state === 'granted') return 'Activado. Gracias por confiar.';
  if (state === 'denied') return 'Sin acceso. Puedes activarlo cuando quieras desde Ajustes.';
  if (state === 'skipped') return 'Lo dejamos para después.';
  return null;
}

/** Tarjeta grande de color con ilustración, "PERMITIR ACCESO" y "Ahora no" (maqueta 1). */
export function PermissionCard({ title, description, illustration, tone, state, supported, busy, onAllow, onSkip }: PermissionCardProps) {
  const status = statusText(state, supported);
  const decided = state !== 'unknown';
  return (
    <View style={[styles.card, { backgroundColor: tone.face, borderBottomColor: tone.deep }]}>
      <View style={styles.row}>
        <View style={[styles.art, { backgroundColor: withAlpha(brand.white, 0.85) }]}>{illustration}</View>
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
            tone={{ face: withAlpha(brand.white, 0.25), shadow: tone.deep, text: tone.on }}
          />
          {!decided ? (
            <Pressable accessibilityRole="button" accessibilityLabel={`Ahora no: ${title}`} onPress={onSkip} style={styles.skip}>
              <AppText variant="bodyStrong" color={tone.on}>
                Ahora no
              </AppText>
            </Pressable>
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
  card: { borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.md, borderBottomWidth: 6 },
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  art: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: spacing.xs },
  granted: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, minHeight: MIN_TOUCH },
  skip: { alignSelf: 'center', minHeight: MIN_TOUCH, justifyContent: 'center', paddingHorizontal: spacing.lg },
});
