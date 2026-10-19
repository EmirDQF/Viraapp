import { router } from 'expo-router';
import { AlertTriangle, Sprout } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { CASE_QUESTION_TITLES, type CaseStudy } from '@/data/cases';
import { QuizMechanic } from '@/features/game/mechanics/QuizMechanic';
import type { StageResult } from '@/lib/gamification/xp';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { MODULE_COLORS, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Minutos de práctica que cuenta resolver un caso (para la meta diaria). */
const CASE_MINUTES = 3;

type Phase = 'intro' | 'quiz' | 'done';

function Intro({ study, onStart }: { readonly study: CaseStudy; readonly onStart: () => void }) {
  const { colors } = useTheme();
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <AppText variant="caption" tone="muted" uppercase>
        {study.work} · {study.format} · {study.year}
      </AppText>
      {study.sensitive ? (
        <Card style={styles.notice} accessibilityLabel={`Aviso: ${study.sensitive}`}>
          <AlertTriangle color={colors.accent} size={20} />
          <AppText variant="caption" style={styles.flex}>
            {study.sensitive}
          </AppText>
        </Card>
      ) : null}
      <AppText>{study.summary}</AppText>
      <Card style={styles.list}>
        <AppText variant="subtitle">Vas a responder</AppText>
        {CASE_QUESTION_TITLES.map((title, index) => (
          <AppText key={title} tone="muted">
            {index + 1}. {title}
          </AppText>
        ))}
      </Card>
      <Button3D label="Analizar el caso" size="lg" onPress={onStart} />
    </ScrollView>
  );
}

function Done({ study, score }: { readonly study: CaseStudy; readonly score: number }) {
  const tone = MODULE_COLORS[study.moduleId];
  return (
    <ScrollView contentContainerStyle={styles.body}>
      <RegiSays pose={score >= 0.75 ? 'resilient' : 'empathetic'} message={study.feedback} />
      <Card variant="gradient" gradient={[tone.base, tone.deep]} style={styles.list}>
        <View style={styles.challengeTitle}>
          <Sprout color={tone.on} size={20} />
          <AppText variant="subtitle" color={tone.on}>
            Lleva esto a tu vida
          </AppText>
        </View>
        <AppText color={tone.on}>{study.challenge}</AppText>
      </Card>
      <Button3D label="Volver al laboratorio" onPress={() => router.back()} />
      <Button3D label="Escribir mi propio caso" variant="outline" onPress={() => router.replace('/cases/own')} />
    </ScrollView>
  );
}

/** Un caso del laboratorio: resumen → 4 preguntas del curso → retroalimentación de Regi y mini reto. */
export function CaseScreen({ study }: { readonly study: CaseStudy }) {
  const solveCase = useAppStore((state) => state.solveCase);
  const registerPractice = useAppStore((state) => state.registerPractice);
  const [phase, setPhase] = useState<Phase>('intro');
  const [score, setScore] = useState(0);
  const tone = MODULE_COLORS[study.moduleId];

  const complete = (result: StageResult) => {
    solveCase(study.id);
    registerPractice(CASE_MINUTES);
    setScore(result.score);
    haptic('success');
    setPhase('done');
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <BackHeader title={study.character} />
          {phase === 'intro' ? <Intro study={study} onStart={() => setPhase('quiz')} /> : null}
          {phase === 'quiz' ? <QuizMechanic content={study.questions} moduleId={study.moduleId} tone={tone} onComplete={complete} /> : null}
          {phase === 'done' ? <Done study={study} score={score} /> : null}
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.screen, paddingTop: spacing.lg, gap: spacing.md },
  body: { gap: spacing.md, paddingBottom: spacing.xxl },
  notice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  flex: { flex: 1 },
  list: { gap: spacing.xs },
  challengeTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
