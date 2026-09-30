import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Heart, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { Button3D } from '@/components/ui/Button3D';
import { ExerciseRenderer } from '@/components/exercises/ExerciseRenderer';
import { ProgressBar } from '@/components/ProgressBar';
import { ReflectionPause } from '@/components/ReflectionPause';
import { Screen } from '@/components/Screen';
import { VictoryModal } from '@/components/VictoryModal';
import { getCrucible } from '@/data/crucibles';
import { buildModules, findModule } from '@/data/modules';
import { haptic } from '@/lib/haptics';
import { moduleStatus, xpForModule } from '@/lib/progress';
import { visibleStreak } from '@/lib/streak';
import { useActiveProgress, useResilienceStore } from '@/store/useResilienceStore';
import { palette, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import type { ModuleRecord } from '@/types';

const LAST_MODULE_ID = 'm5-manifesto';

function backToMap() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/modules');
  }
}

export default function ModuleEngineScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activeCrucible = useResilienceStore((state) => state.activeCrucible);
  const energy = useResilienceStore((state) => state.energy);
  const streak = useResilienceStore((state) => state.streak);
  const loseEnergy = useResilienceStore((state) => state.loseEnergy);
  const restoreEnergy = useResilienceStore((state) => state.restoreEnergy);
  const saveRecord = useResilienceStore((state) => state.saveRecord);
  const completeModule = useResilienceStore((state) => state.completeModule);
  const progress = useActiveProgress();

  const [stepIndex, setStepIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [earnedXp, setEarnedXp] = useState<number | null>(null);

  const modules = useMemo(() => (activeCrucible ? buildModules(getCrucible(activeCrucible)) : []), [activeCrucible]);
  const module = findModule(modules, id ?? '');

  if (!activeCrucible) return <Redirect href="/select-crucible" />;

  if (!module || moduleStatus(module.id, progress.completedModules) === 'locked') {
    return (
      <Screen footer={<Button3D label="Volver a la ruta" onPress={backToMap} />}>
        <RegiSays
          pose="empathetic"
          message={
            module
              ? `"${module.title}" todavía está bloqueado. Completa el módulo anterior para llegar aquí.`
              : 'No encontré ese módulo. Volvamos a tu ruta.'
          }
        />
      </Screen>
    );
  }

  const total = module.exercises.length;
  const exercise = module.exercises[Math.min(stepIndex, total - 1)];
  const finished = earnedXp !== null;

  const handleMistake = () => {
    setMistakes((count) => count + 1);
    loseEnergy();
  };

  const handleComplete = (record?: ModuleRecord) => {
    if (record) saveRecord(record);
    if (stepIndex + 1 < total) {
      haptic('medium');
      setStepIndex(stepIndex + 1);
      return;
    }
    const xp = xpForModule(module, mistakes);
    completeModule(module.id, xp);
    haptic('success');
    setEarnedXp(xp);
  };

  const handleVictoryContinue = () => {
    if (module.id === LAST_MODULE_ID) {
      router.replace('/action-plan');
      return;
    }
    backToMap();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Salir del módulo" onPress={backToMap} hitSlop={12}>
          <X color={colors.textMuted} size={28} />
        </Pressable>
        <ProgressBar value={finished ? 1 : stepIndex / total} />
        <View style={styles.energy} accessibilityLabel={`Energía reflexiva ${energy.current} de ${energy.max}`}>
          <Heart color={palette.retry} fill={energy.current > 0 ? palette.retry : 'none'} size={22} />
          <Text style={[styles.energyText, { color: palette.retry }]}>{energy.current}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <ExerciseRenderer key={exercise.id} exercise={exercise} onComplete={handleComplete} onMistake={handleMistake} />
      </View>

      <ReflectionPause visible={energy.current === 0 && !finished} concept={module.concept} onRefill={restoreEnergy} />
      <VictoryModal
        visible={finished}
        moduleTitle={module.title}
        skill={module.skill}
        xp={earnedXp ?? 0}
        streak={visibleStreak(streak)}
        continueLabel={module.id === LAST_MODULE_ID ? 'Ver mi plan' : 'Volver a la ruta'}
        onContinue={handleVictoryContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  energy: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  energyText: { fontSize: 17, fontWeight: '900' },
  body: { flex: 1, paddingHorizontal: spacing.lg },
});
