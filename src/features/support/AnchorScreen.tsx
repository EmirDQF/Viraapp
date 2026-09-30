import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { ImagePlus, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Button3D } from '@/components/ui/Button3D';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { goBackOrHome } from '@/features/game/navigation';
import { withAlpha } from '@/lib/color';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, brand, gradients, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';

const ANCHOR_SECONDS = 10;
const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] as const;

/**
 * Pantalla Ancla (maqueta 6): 10 segundos con una foto feliz. No reemplaza la pantalla de bloqueo del
 * sistema (no es posible); es una pantalla de la app que se abre desde una notificación o desde Círculo Ancla.
 */
export function AnchorScreen() {
  const photo = useAppStore((state) => state.anchorPhotoUri);
  const setPhoto = useAppStore((state) => state.setAnchorPhoto);
  const [remaining, setRemaining] = useState(ANCHOR_SECONDS);
  const [note, setNote] = useState<string | null>(null);
  const now = new Date();

  useEffect(() => {
    if (remaining <= 0) {
      haptic('success');
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const choosePhoto = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        setNote('Sin acceso a tus fotos. Puedes activarlo cuando quieras en los ajustes del teléfono.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.8 });
      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
        setRemaining(ANCHOR_SECONDS);
      }
    } catch {
      setNote('No pudimos abrir tus fotos. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: brand.inkDeep }]}>
      {photo ? <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityLabel="Tu foto feliz" /> : null}
      <LinearGradient
        colors={[withAlpha(brand.inkDeep, 0.6), withAlpha(brand.inkDeep, 0.55), withAlpha(brand.inkDeep, 0.9)]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe}>
        <AnimatedPressable accessibilityRole="button" accessibilityLabel="Cerrar pantalla ancla" onPress={goBackOrHome} hitSlop={10} style={styles.closeWrap}>
          <GlassCard padded={false} radius={radius.pill} tint={withAlpha(brand.inkDeep, 0.35)} style={styles.close}>
            <View style={styles.close}>
              <X color={brand.white} size={24} strokeWidth={2.5} />
            </View>
          </GlassCard>
        </AnimatedPressable>
        <AppText variant="subtitle" color={brand.white} align="center">
          {WEEKDAYS[now.getDay()]}, {now.getDate()} de {MONTHS[now.getMonth()]}
        </AppText>
        <AppText variant="display" color={brand.white} align="center" style={styles.clock}>
          {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
        </AppText>
        <View style={styles.center}>
          {photo ? null : <RegiMascot pose="empathetic" size={120} />}
          <ProgressRing value={remaining / ANCHOR_SECONDS} size={210} strokeWidth={14} gradient={gradients.sunrise} glow trackColor={withAlpha(brand.white, 0.2)} durationMs={950} accessibilityLabel={`${remaining} segundos`}>
            <AppText variant="display" color={brand.white} style={styles.count}>
              {remaining}
            </AppText>
            <AppText variant="overline" color={brand.white}>
              segundos
            </AppText>
          </ProgressRing>
          <AppText variant="title" color={brand.white} align="center" accessibilityLiveRegion="polite">
            {remaining > 0 ? '¿Qué momento feliz te ancla hoy?' : 'Ese momento también es tuyo. Sigue a tu ritmo.'}
          </AppText>
        </View>
        {note ? <AppText color={brand.white} align="center">{note}</AppText> : null}
        <Button3D label={photo ? 'Cambiar foto' : 'Elegir una foto feliz'} variant="accent" icon={<ImagePlus color={brand.ink} size={18} />} onPress={() => void choosePhoto()} />
        {remaining <= 0 ? <Button3D label="Listo" variant="outline" onPress={goBackOrHome} /> : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md },
  closeWrap: { alignSelf: 'flex-end' },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  clock: { fontFamily: fontFamily.extrabold, fontSize: 76, lineHeight: 84, letterSpacing: -2, fontVariant: ['tabular-nums'] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  count: { fontSize: 72, lineHeight: 80, fontVariant: ['tabular-nums'] },
});
