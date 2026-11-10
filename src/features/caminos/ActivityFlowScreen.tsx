import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CircleCheck, Flag, Pause, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PA3_MODULES } from '@/data/caminos/modules';
import type { Activity, FlowActivity } from '@/data/caminos/types';
import { CaminoHeader, PillButton, StatusBadge, TEXT_SCALE } from '@/features/caminos/CaminoParts';
import { RegiAvatar } from '@/features/caminos/RegiOrb';
import { caminos, caminosText, PATH_COLORS } from '@/features/caminos/theme';
import { haptic } from '@/lib/haptics';
import { pathOfModule } from '@/lib/caminos';
import { useAppStore } from '@/store/useAppStore';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)/explore');
}

interface ActivityFlowScreenProps {
  readonly activity: Activity;
  readonly flow: FlowActivity;
}

/** Una actividad que se juega en VIRA: pasos con orientación de Regi y opciones de pausar, reintentar o finalizar. */
export function ActivityFlowScreen({ activity, flow }: ActivityFlowScreenProps) {
  const module = PA3_MODULES[activity.moduleId];
  const color = PATH_COLORS[pathOfModule(activity.moduleId).id];
  const saved = useAppStore((state) => state.caminoActivities[activity.id]);
  const pauseActivity = useAppStore((state) => state.pauseActivity);
  const restartActivity = useAppStore((state) => state.restartActivity);
  const completeActivity = useAppStore((state) => state.completeActivity);

  // Si había un intento en pausa, se retoma desde ese paso.
  const resume = saved && !saved.completed && saved.answers.length === saved.step && saved.step < flow.steps.length;
  const [answers, setAnswers] = useState<readonly number[]>(resume ? saved.answers : []);
  const [selected, setSelected] = useState<number | null>(null);

  const stepIndex = answers.length;
  const finished = stepIndex >= flow.steps.length && selected === null;
  const step = flow.steps[Math.min(stepIndex, flow.steps.length - 1)];
  const choice = selected === null ? null : step.options[selected];
  const goodCount = answers.filter((answer, index) => flow.steps[index]?.options[answer]?.good).length;

  const onChoose = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    haptic(step.options[index].good ? 'success' : 'light');
  };
  const onNext = () => {
    if (selected === null) return;
    setAnswers((list) => [...list, selected]);
    setSelected(null);
  };
  const onPause = () => {
    pauseActivity(activity.id, answers.length, answers);
    goBack();
  };
  const onRestart = () => {
    restartActivity(activity.id);
    setAnswers([]);
    setSelected(null);
  };
  const onFinish = () => {
    completeActivity(activity.id);
    haptic('success');
    goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <CaminoHeader backLabel={module.title} onBack={finished ? goBack : onPause} eyebrow="02 · Explora y practica" title={activity.title} color={color} />
          <StatusBadge status={activity.status} />
          {activity.status === 'maqueta' ? (
            <View style={styles.draft}>
              <Text style={[caminosText.body, { color: caminos.draftText }]} {...TEXT_SCALE}>
                Maqueta: es una versión corta de prueba. La actividad completa llegará pronto.
              </Text>
            </View>
          ) : null}

          {finished ? (
            <View style={styles.card}>
              <CircleCheck size={36} color={color} strokeWidth={2} />
              <Text style={caminosText.cardTitle} accessibilityRole="header" {...TEXT_SCALE}>
                ¡Actividad terminada!
              </Text>
              <Text style={caminosText.small} {...TEXT_SCALE}>{`${goodCount} de ${flow.steps.length} respuestas aplicaron el tema.`}</Text>
              <View style={styles.regiRow}>
                <RegiAvatar size={44} />
                <Text style={[caminosText.body, styles.flex]} {...TEXT_SCALE}>
                  {flow.takeaway}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <View style={styles.progressRow} accessible accessibilityLabel={`Paso ${stepIndex + 1} de ${flow.steps.length}`}>
                {flow.steps.map((item, index) => (
                  <View key={item.prompt} style={[styles.progressBar, { backgroundColor: index <= stepIndex ? color : caminos.line }]} />
                ))}
              </View>
              <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>{`Paso ${stepIndex + 1} de ${flow.steps.length}`}</Text>
              <Text style={caminosText.bodyStrong} {...TEXT_SCALE}>
                {step.prompt}
              </Text>
              <View style={styles.options}>
                {step.options.map((option, index) => {
                  const isChosen = selected === index;
                  const reveal = selected !== null && option.good;
                  return (
                    <Pressable
                      key={option.text}
                      onPress={() => onChoose(index)}
                      disabled={selected !== null}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isChosen, disabled: selected !== null }}
                      style={[styles.option, (isChosen || reveal) && { borderColor: color }, isChosen && styles.optionChosen]}
                    >
                      <Text style={caminosText.body} {...TEXT_SCALE}>
                        {option.text}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {choice ? (
                <View style={styles.feedback} accessibilityLiveRegion="polite">
                  <RegiAvatar size={40} />
                  <View style={styles.flex}>
                    <Text style={[caminosText.tag, { color: choice.good ? color : caminos.teal }]} {...TEXT_SCALE}>
                      {choice.good ? '03 · REGI TE ORIENTA · ¡ESO ES!' : '03 · REGI TE ORIENTA · MIRA OTRA FORMA'}
                    </Text>
                    <Text style={caminosText.body} {...TEXT_SCALE}>
                      {choice.feedback}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>

        <View style={styles.bar}>
          {finished ? (
            <>
              <PillButton label="Reintentar" variant="ghost" icon={<RotateCcw size={16} color={caminos.teal} strokeWidth={2.2} />} onPress={onRestart} />
              <PillButton label="Finalizar" color={color} icon={<Flag size={16} color={caminos.appBg} strokeWidth={2.2} />} onPress={onFinish} />
            </>
          ) : (
            <>
              <PillButton label="Pausar" variant="ghost" icon={<Pause size={16} color={caminos.teal} strokeWidth={2.2} />} onPress={onPause} />
              <PillButton label="Reintentar" variant="ghost" icon={<RotateCcw size={16} color={caminos.teal} strokeWidth={2.2} />} onPress={onRestart} />
              <PillButton
                label={stepIndex + 1 >= flow.steps.length ? 'Ver cierre' : 'Siguiente'}
                color={color}
                disabled={selected === null}
                onPress={onNext}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: caminos.appBg },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 12 },
  flex: { flex: 1, minWidth: 0, gap: 4 },
  draft: { backgroundColor: caminos.draftBg, borderRadius: 14, padding: 12 },
  card: {
    gap: 12,
    backgroundColor: caminos.cardBg,
    borderRadius: 20,
    padding: 16,
    shadowColor: caminos.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  progressRow: { flexDirection: 'row', gap: 6 },
  progressBar: { flex: 1, height: 5, borderRadius: 3 },
  options: { gap: 8 },
  option: { minHeight: 48, justifyContent: 'center', paddingVertical: 11, paddingHorizontal: 12, borderRadius: 14, borderWidth: 2, borderColor: caminos.line, backgroundColor: caminos.appBg },
  optionChosen: { backgroundColor: caminos.cardBg },
  feedback: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: caminos.mint, borderRadius: 14, padding: 12 },
  regiRow: { flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: caminos.mint, borderRadius: 14, padding: 12 },
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, borderTopColor: caminos.line, backgroundColor: caminos.cardBg },
});
