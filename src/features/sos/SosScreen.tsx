import { router } from 'expo-router';
import { Phone, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { Button3D } from '@/components/ui/Button3D';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { DEFAULT_HELPLINES } from '@/data/helplines';
import { TECHNIQUE_IDS, TECHNIQUES, type TechniqueId, type TechniqueNeed } from '@/data/techniques';
import { HelplineRow } from '@/features/chat/CrisisCard';
import { goBackOrHome } from '@/features/game/navigation';
import { IntensityScale } from '@/features/sos/IntensityScale';
import { TechniqueRunner } from '@/features/sos/TechniqueRunner';
import { useTechniqueSuggestion } from '@/features/sos/useTechniqueSuggestion';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/useAppStore';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** A partir de esta intensidad se muestran las líneas de ayuda desde el primer paso. */
export const CRISIS_INTENSITY = 9;

const NEEDS: readonly { readonly id: TechniqueNeed; readonly label: string }[] = [
  { id: 'impulso', label: 'Un impulso' },
  { id: 'enojo', label: 'Enojo' },
  { id: 'ansiedad', label: 'Ansiedad' },
  { id: 'frustracion', label: 'Frustración' },
  { id: 'pensamientos', label: 'Pensamientos que pesan' },
  { id: 'tristeza', label: 'Tristeza' },
  { id: 'conflicto', label: 'Un conflicto' },
];

type Step = 'feel' | 'technique' | 'after' | 'result';

function CrisisLines() {
  return (
    <Card style={styles.crisis}>
      <AppText variant="subtitle">Si sientes que corres peligro, no estás solo</AppText>
      <AppText tone="muted">Llama ahora. Hay personas preparadas para escucharte.</AppText>
      {DEFAULT_HELPLINES.helplines.map((line) => (
        <HelplineRow key={line.id} line={line} />
      ))}
    </Card>
  );
}

function FeelStep({ need, intensity, onNeed, onIntensity, onNext }: {
  readonly need: TechniqueNeed | null;
  readonly intensity: number | null;
  readonly onNeed: (need: TechniqueNeed) => void;
  readonly onIntensity: (value: number) => void;
  readonly onNext: () => void;
}) {
  return (
    <>
      <RegiSays pose="empathetic" message="Estoy aquí contigo. Primero, ¿qué sientes y con qué fuerza?" />
      <View style={styles.chips}>
        {NEEDS.map((item) => (
          <Chip key={item.id} label={item.label} selected={need === item.id} onPress={() => onNeed(item.id)} />
        ))}
      </View>
      <IntensityScale label="¿Qué tan fuerte es ahora?" value={intensity} onChange={onIntensity} />
      {intensity !== null && intensity >= CRISIS_INTENSITY ? <CrisisLines /> : null}
      <Button3D label="Ayúdame ahora" size="lg" variant="accent" disabled={intensity === null} onPress={onNext} />
    </>
  );
}

function ResultStep({ before, after, onRetry }: { readonly before: number; readonly after: number; readonly onRetry: () => void }) {
  const lowered = after < before;
  return (
    <>
      <RegiSays
        pose={lowered ? 'growth' : 'empathetic'}
        message={lowered ? `¡Bajaste de ${before} a ${after}! Frenaste la ola. Eso es autocontrol de verdad.` : 'Está bien si no bajó todavía. A veces toma más tiempo. No tienes que hacerlo solo.'}
      />
      {lowered ? null : <Button3D label="Probar otra técnica" onPress={onRetry} />}
      <Button3D label="Hablar con alguien de confianza" variant="secondary" onPress={() => router.replace('/support')} />
      {after >= CRISIS_INTENSITY ? <CrisisLines /> : null}
      <Button3D label="Volver al inicio" variant="outline" onPress={goBackOrHome} />
    </>
  );
}

/** "Tengo un impulso ahora": qué siento → técnica guiada → ¿cómo estoy ahora? (y queda en Mi camino). */
export function SosScreen() {
  const { colors } = useTheme();
  const logEvent = useAppStore((state) => state.logEvent);
  const [step, setStep] = useState<Step>('feel');
  const [need, setNeed] = useState<TechniqueNeed | null>(null);
  const [before, setBefore] = useState<number | null>(null);
  const [after, setAfter] = useState<number | null>(null);
  const suggestion = useTechniqueSuggestion(need, before);
  const [technique, setTechnique] = useState<TechniqueId | null>(null);
  const [showLines, setShowLines] = useState(false);
  const current = technique ?? suggestion.technique;

  const anotherTechnique = () => {
    const pool = TECHNIQUE_IDS.filter((id) => id !== current && (need === null || TECHNIQUES[id].needs.includes(need)));
    setTechnique(pool[0] ?? 'respiracion-cuadrada');
    setStep('technique');
  };

  const finish = () => {
    if (before === null || after === null) return;
    logEvent({ kind: 'sos', technique: current, before, after });
    haptic(after < before ? 'success' : 'light');
    setStep('result');
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <AppText variant="title" accessibilityRole="header" style={styles.flex}>
            SOS
          </AppText>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar SOS" onPress={goBackOrHome} hitSlop={10} style={styles.close}>
            <X color={colors.text} size={26} />
          </Pressable>
        </View>
        {step === 'technique' ? (
          <View style={styles.runner}>
            <TechniqueRunner key={current} technique={current} onDone={() => setStep('after')} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {step === 'feel' ? (
              <FeelStep need={need} intensity={before} onNeed={setNeed} onIntensity={setBefore} onNext={() => setStep('technique')} />
            ) : null}
            {step === 'after' ? (
              <>
                <RegiSays pose="calm" message="Lo hiciste. Respira normal un momento. ¿Cómo estás ahora?" />
                <IntensityScale label="¿Qué tan fuerte es ahora?" value={after} onChange={setAfter} />
                <Button3D label="Listo" size="lg" disabled={after === null} onPress={finish} />
              </>
            ) : null}
            {step === 'result' && before !== null && after !== null ? <ResultStep before={before} after={after} onRetry={anotherTechnique} /> : null}
            {step === 'feel' ? (
              <>
                <Button3D label="Mis contactos de apoyo" variant="ghost" icon={<Users color={colors.highlight} size={18} />} onPress={() => router.push('/support')} />
                {showLines || (before !== null && before >= CRISIS_INTENSITY) ? null : (
                  <Button3D label="Necesito ayuda urgente" variant="ghost" icon={<Phone color={colors.highlight} size={18} />} onPress={() => setShowLines(true)} />
                )}
                {showLines && (before === null || before < CRISIS_INTENSITY) ? <CrisisLines /> : null}
              </>
            ) : null}
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.screen, paddingTop: spacing.sm },
  flex: { flex: 1 },
  close: { width: MIN_TOUCH, height: MIN_TOUCH, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  runner: { flex: 1, paddingHorizontal: spacing.screen, paddingBottom: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  crisis: { gap: spacing.sm },
});
