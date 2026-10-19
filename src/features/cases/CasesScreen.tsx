import { router } from 'expo-router';
import { CheckCircle2, ChevronRight, Clapperboard, PenLine, Trash2 } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { ICON_STROKE, IconTile } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { CASES, type CaseStudy } from '@/data/cases';
import { useAppStore } from '@/store/useAppStore';
import type { OwnCase } from '@/store/types';
import { MIN_TOUCH, MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function CaseRow({ study, solved }: { readonly study: CaseStudy; readonly solved: boolean }) {
  const { colors } = useTheme();
  const tone = MODULE_COLORS[study.moduleId];
  return (
    <Card
      onPress={() => router.push({ pathname: '/cases/[id]', params: { id: study.id } })}
      accessibilityLabel={`${study.character}, ${study.work} (${study.format}, ${study.year})${solved ? '. Resuelto' : ''}`}
      style={styles.row}
    >
      <IconTile icon={Clapperboard} color={tone.base} iconColor={tone.on} size={48} />
      <View style={styles.flexText}>
        <AppText variant="subtitle" numberOfLines={1}>
          {study.character}
        </AppText>
        <AppText variant="caption" tone="muted">
          {study.work} · {study.format} · {study.year}
        </AppText>
      </View>
      {solved ? <CheckCircle2 color={colors.success} size={22} strokeWidth={ICON_STROKE} /> : <ChevronRight color={colors.textMuted} size={22} />}
    </Card>
  );
}

function OwnCaseRow({ item }: { readonly item: OwnCase }) {
  const { colors } = useTheme();
  const removeOwnCase = useAppStore((state) => state.removeOwnCase);
  return (
    <Card style={styles.own}>
      <View style={styles.ownHeader}>
        <AppText variant="subtitle" style={styles.flexText}>
          {item.title}
        </AppText>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityLabel={`Borrar el caso ${item.title}`}
          onPress={() => removeOwnCase(item.id)}
          hitSlop={8}
          style={styles.delete}
        >
          <Trash2 color={colors.dangerText} size={20} />
        </AnimatedPressable>
      </View>
      {[
        ['Impulsos', item.impulses],
        ['Pensamientos, emociones y reacciones', item.thoughts],
        ['Frustración', item.frustration],
        ['Técnica', item.technique],
      ]
        .filter(([, text]) => text.length > 0)
        .map(([label, text]) => (
          <View key={label}>
            <AppText variant="caption" tone="muted" uppercase>
              {label}
            </AppText>
            <AppText>{text}</AppText>
          </View>
        ))}
    </Card>
  );
}

/** Laboratorio de casos: personajes de películas y series analizados con las 4 preguntas del curso. */
export function CasesScreen() {
  const { colors } = useTheme();
  const solved = useAppStore((state) => state.solvedCases);
  const ownCases = useAppStore((state) => state.ownCases);
  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <BackHeader title="Laboratorio de casos" />
          <RegiSays
            pose="resilient"
            message={`Analicemos personajes como un psicólogo de cine. Llevas ${solved.length} de ${CASES.length} casos resueltos.`}
          />
          {CASES.map((study) => (
            <CaseRow key={study.id} study={study} solved={solved.includes(study.id)} />
          ))}
          <AppText variant="heading" accessibilityRole="header" style={styles.section}>
            Tus casos
          </AppText>
          <AppText tone="muted">Analiza una situación tuya con las mismas 4 preguntas. Se guarda solo en tu teléfono.</AppText>
          <Button3D
            label="Escribir mi propio caso"
            variant="secondary"
            icon={<PenLine color={colors.onSecondary} size={18} />}
            onPress={() => router.push('/cases/own')}
          />
          {ownCases.map((item) => (
            <OwnCaseRow key={item.id} item={item} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flexText: { flex: 1, gap: 2 },
  section: { marginTop: spacing.md },
  own: { gap: spacing.sm },
  ownHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  delete: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
});
