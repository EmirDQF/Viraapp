import { router } from 'expo-router';
import { ChevronRight, Footprints, Route, Sparkles } from 'lucide-react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ModuleIcon } from '@/components/game/ModuleIcon';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { MODULES } from '@/data/modules/catalog';
import { stageAt } from '@/data/stages';
import { openStage } from '@/features/game/navigation';
import { toIsoDate } from '@/lib/age';
import { focusLabel, lessonOfDay, type Lesson } from '@/lib/personalize';
import { useAppStore } from '@/store/useAppStore';
import { brand, MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Invitación a quienes vienen de una versión anterior y aún no eligieron qué quieren mejorar. */
export function PersonalizeCard() {
  const { colors } = useTheme();
  const personalized = useAppStore((state) => state.onboarding.personalized);
  if (personalized) return null;
  return (
    <Card
      onPress={() => router.push('/goals')}
      accessibilityLabel="Personaliza tu camino"
      accessibilityHint="Elige qué quieres mejorar para recibir una ruta y una lección del día a tu medida"
      style={styles.row}
    >
      <IconTile icon={Sparkles} color={colors.highlight} iconColor={brand.white} size={48} />
      <View style={styles.flexText}>
        <AppText variant="subtitle">Personaliza tu camino</AppText>
        <AppText variant="caption" tone="muted">
          Cuéntale a Regi qué quieres mejorar y te armará una ruta a tu medida.
        </AppText>
      </View>
      <ChevronRight color={colors.textMuted} size={22} />
    </Card>
  );
}

/** Acceso a "Mi camino": la cronología del avance. */
export function JourneyCard() {
  const { colors } = useTheme();
  const events = useAppStore((state) => state.timeline.length);
  return (
    <Card onPress={() => router.push('/journey')} accessibilityLabel="Mi camino" accessibilityHint="Abre la línea de tiempo de tu avance" style={styles.row}>
      <IconTile icon={Footprints} color={colors.regi} iconColor={colors.onRegi} size={48} />
      <View style={styles.flexText}>
        <AppText variant="subtitle">Mi camino</AppText>
        <AppText variant="caption" tone="muted">
          {events > 0 ? 'Tu semana, tus hitos y cómo crece Regi.' : 'Aquí verás cada paso que des.'}
        </AppText>
      </View>
      <ChevronRight color={colors.textMuted} size={22} />
    </Card>
  );
}

/** Lección del día calculada con el estado actual (estable durante el día). */
export function useLessonOfDay(): Lesson {
  const focusAreas = useAppStore((state) => state.focusAreas);
  const modules = useAppStore((state) => state.modules);
  const start = useAppStore((state) => state.onboarding.firstModule);
  const day = toIsoDate(new Date());
  return useMemo(() => lessonOfDay({ focusAreas, modules, start, now: new Date(`${day}T12:00:00`) }), [day, focusAreas, modules, start]);
}

/** "Lección del día": la etapa que mejor encaja con el foco del usuario. */
export function LessonOfDayCard() {
  const lesson = useLessonOfDay();
  const { moduleId, stage } = lesson.pointer;
  const tone = MODULE_COLORS[moduleId];
  const stageTitle = stageAt(stage)?.title ?? `Etapa ${stage + 1}`;
  const reason = lesson.focus ? `Para: ${focusLabel(lesson.focus)}` : MODULES[moduleId].tagline;
  return (
    <Card
      onPress={() => openStage(lesson.pointer)}
      accessibilityLabel={`Lección del día: ${MODULES[moduleId].name}, ${stageTitle}. ${reason}`}
      style={styles.row}
    >
      <IconTile color={tone.base} gradient={[tone.soft, tone.base]} size={52}>
        <ModuleIcon id={moduleId} color={tone.on} size={26} strokeWidth={ICON_STROKE} />
      </IconTile>
      <View style={styles.flexText}>
        <View style={styles.overline}>
          <Route color={tone.deep} size={14} strokeWidth={ICON_STROKE} />
          <AppText variant="overline" tone="muted" uppercase>
            {lesson.isReview ? 'Repaso del día' : 'Lección del día'}
          </AppText>
        </View>
        <AppText variant="subtitle" numberOfLines={2}>
          {MODULES[moduleId].name} · {stageTitle}
        </AppText>
        <AppText variant="caption" tone="muted" numberOfLines={2}>
          {reason}
        </AppText>
      </View>
      <ChevronRight color={tone.deep} size={22} />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flexText: { flex: 1, gap: 2 },
  overline: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
