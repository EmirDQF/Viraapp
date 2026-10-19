import { router } from 'expo-router';
import { ChevronRight, LifeBuoy, Phone, Users, Wind } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { MOODS } from '@/data/moods';
import { TECHNIQUES } from '@/data/techniques';
import { useTechniqueSuggestion } from '@/features/sos/useTechniqueSuggestion';
import { toIsoDate } from '@/lib/age';
import { haptic } from '@/lib/haptics';
import { lowMoodStreak, moodToday, type MoodValue } from '@/lib/timeline';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, brand, gradients, onGradient, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Días seguidos de ánimo bajo a partir de los cuales Regi sugiere hablar con alguien. */
export const LOW_MOOD_DAYS = 3;

/** Botón "Tengo un impulso ahora": siempre arriba en Inicio, abre el SOS. */
export function SosButton() {
  return (
    <Card
      variant="gradient"
      gradient={gradients.sunrise}
      raised
      onPress={() => {
        haptic('medium');
        router.push('/sos');
      }}
      accessibilityLabel="Tengo un impulso ahora"
      accessibilityHint="Abre el SOS: una técnica guiada en tres toques"
      style={styles.sos}
    >
      <LifeBuoy color={onGradient.sunrise} size={30} strokeWidth={ICON_STROKE} />
      <View style={styles.flex}>
        <AppText variant="subtitle" color={onGradient.sunrise}>
          Tengo un impulso ahora
        </AppText>
        <AppText variant="caption" color={onGradient.sunrise}>
          SOS: una técnica guiada en 3 toques
        </AppText>
      </View>
      <ChevronRight color={onGradient.sunrise} size={24} />
    </Card>
  );
}

function useTodayMood(): MoodValue | null {
  const timeline = useAppStore((state) => state.timeline);
  const day = toIsoDate(new Date());
  return useMemo(() => moodToday(timeline, new Date(`${day}T23:59:59`)), [day, timeline]);
}

/** Check-in de ánimo de un toque: 5 caritas. Se puede cambiar durante el día (cuenta el último). */
export function MoodCheckIn() {
  const { colors } = useTheme();
  const logEvent = useAppStore((state) => state.logEvent);
  const today = useTodayMood();
  const current = MOODS.find((mood) => mood.value === today);
  return (
    <Card style={styles.mood}>
      <AppText variant="subtitle">{current ? `Hoy te sientes: ${current.label.toLowerCase()}` : '¿Cómo te sientes hoy?'}</AppText>
      <View style={styles.faces} accessibilityRole="radiogroup" accessibilityLabel="¿Cómo te sientes hoy?">
        {MOODS.map((mood) => {
          const selected = today === mood.value;
          return (
            <Pressable
              key={mood.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              accessibilityLabel={mood.label}
              onPress={() => {
                haptic('selection');
                logEvent({ kind: 'mood', value: mood.value });
              }}
              style={[styles.face, { backgroundColor: selected ? colors.regiSoft : colors.surface, borderColor: selected ? colors.regi : colors.border }]}
            >
              <AppText style={styles.emoji}>{mood.emoji}</AppText>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

/** Si el ánimo estuvo bajo 3 días seguidos, Regi sugiere hablar con alguien y muestra cómo hacerlo. */
export function LowMoodSupport() {
  const { colors } = useTheme();
  const timeline = useAppStore((state) => state.timeline);
  const day = toIsoDate(new Date());
  const streak = useMemo(() => lowMoodStreak(timeline, new Date(`${day}T23:59:59`)), [day, timeline]);
  if (streak < LOW_MOOD_DAYS) return null;
  return (
    <Card style={styles.support}>
      <RegiSays pose="empathetic" size={72} message={`Llevas ${streak} días sintiéndote bajo. No tienes que cargarlo solo: hablar con alguien de confianza ayuda.`} />
      <Button3D label="Escribir a alguien de confianza" variant="secondary" icon={<Users color={colors.onSecondary} size={18} />} onPress={() => router.push('/support')} />
      <Button3D label="Líneas de ayuda" variant="outline" icon={<Phone color={colors.text} size={18} />} onPress={() => router.push('/about')} />
    </Card>
  );
}

/** Técnica sugerida por el recomendador según el ánimo, los impulsos recientes, el foco y la hora. */
export function TechniqueSuggestionCard() {
  const { colors } = useTheme();
  const suggestion = useTechniqueSuggestion(null, null);
  const technique = TECHNIQUES[suggestion.technique];
  return (
    <Card
      onPress={() => router.push({ pathname: '/technique/[id]', params: { id: technique.id } })}
      accessibilityLabel={`Técnica sugerida: ${technique.name}. ${suggestion.reason}`}
      style={styles.row}
    >
      <IconTile icon={Wind} color={brand.sage} iconColor={brand.ink} size={48} />
      <View style={styles.flex}>
        <AppText variant="overline" tone="muted" uppercase>
          Técnica sugerida
        </AppText>
        <AppText variant="subtitle">{technique.name}</AppText>
        <AppText variant="caption" tone="muted" numberOfLines={2}>
          {suggestion.reason}
        </AppText>
      </View>
      <ChevronRight color={colors.textMuted} size={22} />
    </Card>
  );
}

const FACE = MIN_TOUCH + 8;

const styles = StyleSheet.create({
  sos: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  mood: { gap: spacing.sm },
  faces: { flexDirection: 'row', justifyContent: 'space-between' },
  face: { minWidth: FACE, minHeight: FACE, borderRadius: radius.pill, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 26, lineHeight: 32 },
  support: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
