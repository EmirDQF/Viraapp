import { Bell, CalendarDays, Heart, Image as ImageIcon, Lock, Newspaper, Search } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { PermissionCard, type PermissionTone } from '@/features/onboarding/PermissionCard';
import { StepFrame } from '@/features/onboarding/StepFrame';
import { haptic } from '@/lib/haptics';
import { isPermissionSupported, requestPermission } from '@/lib/permissions';
import { useAppStore } from '@/store/useAppStore';
import type { PermissionKey, PermissionState } from '@/store/types';
import { brand, MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type CardId = 'stress' | 'context' | 'anchor';

const CARD_TONES: Readonly<Record<CardId, PermissionTone>> = {
  stress: { face: brand.coral, deep: brand.coralDeep, on: brand.ink },
  context: { face: brand.petrol, deep: brand.petrolDeep, on: brand.white },
  anchor: { face: MODULE_COLORS.enfriador.base, deep: MODULE_COLORS.enfriador.deep, on: brand.white },
};

/** Qué permisos del sistema pide cada tarjeta. */
const CARD_PERMISSIONS: Readonly<Record<CardId, readonly PermissionKey[]>> = {
  stress: ['notifications', 'calendar'],
  context: ['news'],
  anchor: ['photos'],
};

function Pair({ first, second }: { readonly first: React.ReactNode; readonly second: React.ReactNode }) {
  return (
    <View style={styles.pair}>
      {first}
      <View style={styles.pairBadge}>{second}</View>
    </View>
  );
}

function cardState(keys: readonly PermissionKey[], permissions: Readonly<Record<PermissionKey, PermissionState>>): PermissionState {
  const states = keys.map((key) => permissions[key]);
  if (states.includes('granted')) return 'granted';
  if (states.includes('denied')) return 'denied';
  if (states.includes('skipped')) return 'skipped';
  return 'unknown';
}

/** Paso 3: permisos opcionales. Cada uno se pide solo al pulsar su botón; negarlo nunca bloquea. */
export function PermissionsStep({ onBack, onNext }: { readonly onBack: () => void; readonly onNext: () => void }) {
  const { colors } = useTheme();
  const permissions = useAppStore((state) => state.onboarding.permissions);
  const setPermission = useAppStore((state) => state.setPermission);
  const [busy, setBusy] = useState<CardId | null>(null);

  const allow = async (card: CardId) => {
    setBusy(card);
    const keys = CARD_PERMISSIONS[card];
    const results = await Promise.all(keys.map(async (key) => [key, await requestPermission(key)] as const));
    results.forEach(([key, state]) => setPermission(key, state));
    haptic(results.some(([, state]) => state === 'granted') ? 'success' : 'light');
    setBusy(null);
  };
  const skip = (card: CardId) => CARD_PERMISSIONS[card].forEach((key) => setPermission(key, 'skipped'));

  const cardProps = (card: CardId) => ({
    tone: CARD_TONES[card],
    state: cardState(CARD_PERMISSIONS[card], permissions),
    supported: CARD_PERMISSIONS[card].some(isPermissionSupported),
    busy: busy === card,
    onAllow: () => void allow(card),
    onSkip: () => skip(card),
  });

  return (
    <StepFrame
      step={3}
      onBack={onBack}
      footer={
        <>
          <View style={styles.privacy}>
            <Lock color={colors.textMuted} size={16} />
            <AppText variant="caption" tone="muted">
              Tu privacidad es nuestra prioridad. Todo se queda en tu teléfono.
            </AppText>
          </View>
          <Button3D label="Continuar" onPress={onNext} />
        </>
      }
    >
      <PermissionCard
        title="Anticipar picos de estrés"
        description="Vincula tu calendario y tus notificaciones para saber cuándo vienen retos y estar listo para ellos."
        illustration={<Pair first={<CalendarDays color={brand.coralDeep} size={38} />} second={<Bell color={brand.coralDeep} size={20} />} />}
        {...cardProps('stress')}
      />
      <PermissionCard
        title="Entender tu contexto"
        description="Te explicamos cómo el entorno influye en tu ánimo, con enlaces opcionales a noticias locales. No usamos tu ubicación precisa."
        illustration={<Pair first={<Newspaper color={brand.petrol} size={38} />} second={<Search color={brand.petrol} size={20} />} />}
        {...cardProps('context')}
      />
      <PermissionCard
        title="Anclaje emocional"
        description="Elige fotos de momentos felices que te sirvan de apoyo cuando lo necesites. Nunca salen de tu teléfono."
        illustration={
          <Pair
            first={<ImageIcon color={MODULE_COLORS.enfriador.base} size={38} />}
            second={<Heart color={MODULE_COLORS.enfriador.base} fill={MODULE_COLORS.enfriador.soft} size={20} />}
          />
        }
        {...cardProps('anchor')}
      />
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  pair: { alignItems: 'center', justifyContent: 'center' },
  pairBadge: { position: 'absolute', right: -14, bottom: -10 },
  privacy: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
});
