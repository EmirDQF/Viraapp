import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, RotateCcw } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { activitiesOf, getActivity } from '@/data/caminos/activities';
import { PA3_MODULES } from '@/data/caminos/modules';
import type { Pa3ModuleId } from '@/data/caminos/types';
import { BeforeAfter } from '@/features/caminos/BeforeAfter';
import { CaminoHeader, PillButton, StageSection, TEXT_SCALE } from '@/features/caminos/CaminoParts';
import { ModuleActivities } from '@/features/caminos/ModuleActivities';
import { RegiAvatar } from '@/features/caminos/RegiOrb';
import { SituationForm } from '@/features/caminos/SituationForm';
import { caminos, caminosText, PATH_COLORS } from '@/features/caminos/theme';
import { useOpenActivity } from '@/features/caminos/useOpenActivity';
import { moduleEvidence, moduleProgress, moduleStage, pathOfModule, type ModuleStage } from '@/lib/caminos';
import { useAppStore } from '@/store/useAppStore';

const STAGES: readonly { readonly key: Exclude<ModuleStage, 'done'>; readonly number: string; readonly label: string }[] = [
  { key: 'situation', number: '01', label: 'Situación inicial' },
  { key: 'practice', number: '02', label: 'Explora y practica' },
  { key: 'compare', number: '04', label: 'Antes y ahora' },
];

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/(tabs)/explore');
}

function Stepper({ stage, color }: { readonly stage: ModuleStage; readonly color: string }) {
  const order: readonly ModuleStage[] = ['situation', 'practice', 'compare', 'done'];
  const reached = order.indexOf(stage);
  const steps = [
    { number: '01', label: 'Situación', at: 0 },
    { number: '02', label: 'Practica', at: 1 },
    { number: '03', label: 'Regi', at: 1 },
    { number: '04', label: 'Antes y ahora', at: 2 },
  ];
  return (
    <View style={styles.stepper} accessible accessibilityLabel={`Etapa actual: ${STAGES.find((item) => item.key === stage)?.label ?? 'Módulo completo'}`}>
      {steps.map((step) => {
        const on = reached >= step.at;
        return (
          <View key={step.number} style={styles.step}>
            <View style={[styles.stepBar, { backgroundColor: on ? color : caminos.line }]} />
            <Text style={[caminosText.tag, { color: on ? color : caminos.muted }]} {...TEXT_SCALE}>
              {step.number}
            </Text>
            <Text style={[caminosText.tag, styles.stepLabel]} numberOfLines={1} {...TEXT_SCALE}>
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/** Un módulo PA3: 01 situación inicial → 02 explora y practica → 03 orientación de Regi → 04 antes y ahora. */
export function CaminoModuleScreen({ moduleId }: { readonly moduleId: Pa3ModuleId }) {
  const module = PA3_MODULES[moduleId];
  const path = pathOfModule(moduleId);
  const color = PATH_COLORS[path.id];
  const journey = useAppStore((state) => state.caminoJourneys[moduleId]);
  const progressMap = useAppStore((state) => state.caminoActivities);
  const saveSituation = useAppStore((state) => state.saveSituation);
  const completeActivity = useAppStore((state) => state.completeActivity);
  const resetModuleJourney = useAppStore((state) => state.resetModuleJourney);
  const openActivity = useOpenActivity();

  const activities = activitiesOf(moduleId);
  const progress = moduleProgress(moduleId, progressMap);
  const stage = moduleStage(journey, progress);
  const before = journey?.before ?? null;
  const after = journey?.after ?? null;
  const recommended = module.recommends ? getActivity(module.recommends.activityId) : undefined;

  const onMarkDone = useCallback((id: string) => completeActivity(id), [completeActivity]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <CaminoHeader
            backLabel={`Camino ${path.number}`}
            onBack={goBack}
            eyebrow={`Camino ${path.number} · ${module.courseCode} ${module.topic}`}
            title={module.title}
            color={color}
            lead={module.description}
          />
          <Stepper stage={stage} color={color} />

          <StageSection number="01" title="Situación inicial" color={color} current={stage === 'situation'}>
            <Text style={caminosText.body} {...TEXT_SCALE}>
              {module.situation.story}
            </Text>
            {before ? (
              <View style={styles.summary}>
                <Text style={[caminosText.eyebrow, { color: caminos.muted }]} {...TEXT_SCALE}>
                  Tu primera respuesta
                </Text>
                <Text style={caminosText.bodyStrong} {...TEXT_SCALE}>
                  {module.situation.decisions[before.decision]}
                </Text>
                <Text style={caminosText.small} {...TEXT_SCALE}>{`Porque: ${module.situation.arguments[before.argument]} · Tensión ${before.tension} de 5`}</Text>
              </View>
            ) : (
              <SituationForm
                situation={module.situation}
                color={color}
                submitLabel="Guardar y empezar"
                onSubmit={(answer) => saveSituation(moduleId, 'before', answer)}
              />
            )}
          </StageSection>

          <StageSection number="02" title="Explora y practica" color={color} current={stage === 'practice'}>
            <ModuleActivities
              activities={activities}
              progress={progressMap}
              color={color}
              locked={!before}
              onOpen={openActivity}
              onMarkDone={onMarkDone}
            />
          </StageSection>

          <StageSection number="03" title="Orientación de Regi" color={color} current={false}>
            <View style={styles.regiRow}>
              <RegiAvatar size={44} />
              <View style={styles.flex}>
                {module.orientation.map((line) => (
                  <Text key={line} style={caminosText.body} {...TEXT_SCALE}>
                    {`• ${line}`}
                  </Text>
                ))}
              </View>
            </View>
            {module.recommends && recommended ? (
              <Pressable
                onPress={() => openActivity(recommended.id)}
                accessibilityRole="button"
                accessibilityHint="Abre la actividad recomendada"
                style={({ pressed }) => [styles.recommend, pressed && styles.pressed]}
              >
                <View style={styles.flex}>
                  <Text style={[caminosText.tag, { color: caminos.teal }]} {...TEXT_SCALE}>
                    REGI RECOMIENDA
                  </Text>
                  <Text style={caminosText.body} {...TEXT_SCALE}>
                    {module.recommends.text}
                  </Text>
                </View>
                <ArrowRight size={18} color={caminos.teal} strokeWidth={2.2} />
              </Pressable>
            ) : null}
          </StageSection>

          <StageSection number="04" title="Antes y ahora" color={color} current={stage === 'compare' || stage === 'done'}>
            {stage === 'situation' ? (
              <Text style={caminosText.small} {...TEXT_SCALE}>
                Al final volverás a la situación inicial para comparar tu decisión, tu argumento y tu evidencia.
              </Text>
            ) : null}
            {stage === 'practice' ? (
              <Text style={caminosText.small} {...TEXT_SCALE}>
                Completa al menos una actividad y vuelve aquí para comparar.
              </Text>
            ) : null}
            {stage === 'compare' ? (
              <SituationForm
                situation={module.situation}
                color={color}
                question="Después de practicar, ¿qué harías ahora?"
                submitLabel="Comparar"
                onSubmit={(answer) => saveSituation(moduleId, 'after', answer)}
              />
            ) : null}
            {stage === 'done' && before && after ? (
              <>
                <BeforeAfter situation={module.situation} before={before} after={after} evidence={moduleEvidence(moduleId, progressMap)} color={color} />
                <View style={styles.actions}>
                  <PillButton label="Volver a la ruta" color={color} onPress={goBack} />
                  <PillButton
                    label="Rehacer"
                    variant="ghost"
                    icon={<RotateCcw size={16} color={caminos.teal} strokeWidth={2.2} />}
                    onPress={() => resetModuleJourney(moduleId)}
                  />
                </View>
              </>
            ) : null}
          </StageSection>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: caminos.appBg },
  content: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 32, gap: 14 },
  flex: { flex: 1, minWidth: 0, gap: 6 },
  stepper: { flexDirection: 'row', gap: 6 },
  step: { flex: 1, gap: 3 },
  stepBar: { height: 4, borderRadius: 2 },
  stepLabel: { color: caminos.muted },
  summary: { gap: 2, backgroundColor: caminos.appBg, borderRadius: 14, padding: 12 },
  regiRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  recommend: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: caminos.mint, borderRadius: 14, padding: 12 },
  pressed: { opacity: 0.85 },
  actions: { flexDirection: 'row', gap: 10 },
});
