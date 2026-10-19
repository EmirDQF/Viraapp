import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button3D } from '@/components/ui/Button3D';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { MODULES } from '@/data/modules/catalog';
import { goBackOrHome } from '@/features/game/navigation';
import { FocusPicker, MomentPicker } from '@/features/onboarding/FocusPickers';
import { GOAL_OPTIONS } from '@/features/onboarding/FocusSteps';
import { ChoiceGroup, SettingSection } from '@/features/settings/SettingControls';
import { haptic } from '@/lib/haptics';
import { rankModules, type FocusArea, type HardMoment } from '@/lib/personalize';
import { useAppStore } from '@/store/useAppStore';
import { spacing } from '@/theme/tokens';

/**
 * Ajustes → Mis objetivos: cambiar qué quiere mejorar, cuándo le cuesta y su meta diaria.
 * No cambia el módulo de inicio: eso alteraría qué temas están desbloqueados.
 */
export function GoalsScreen() {
  const savedAreas = useAppStore((state) => state.focusAreas);
  const savedMoments = useAppStore((state) => state.hardMoments);
  const dailyGoal = useAppStore((state) => state.dailyGoalMinutes);
  const setFocus = useAppStore((state) => state.setFocus);
  const setDailyGoal = useAppStore((state) => state.setDailyGoal);
  const [areas, setAreas] = useState<readonly FocusArea[]>(savedAreas);
  const [moments, setMoments] = useState<readonly HardMoment[]>(savedMoments);
  const top = rankModules(areas).slice(0, 2).map((id) => MODULES[id].name);

  const save = () => {
    setFocus(areas, moments);
    haptic('success');
    goBackOrHome();
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <BackHeader title="Mis objetivos" />
          <RegiSays
            message={areas.length > 0 ? `Tu lección del día se enfocará primero en ${top.join(' y ')}.` : 'Elige lo que quieras mejorar y ajusto tu lección del día.'}
            pose="growth"
          />
          <SettingSection title="¿Qué quieres mejorar?">
            <FocusPicker value={areas} onChange={setAreas} />
          </SettingSection>
          <SettingSection title="¿Cuándo te cuesta más?">
            <MomentPicker value={moments} onChange={setMoments} />
          </SettingSection>
          <SettingSection title="Tu meta">
            <ChoiceGroup label="Minutos de práctica al día" options={GOAL_OPTIONS} value={dailyGoal} onChange={setDailyGoal} />
          </SettingSection>
          <Button3D label="Guardar mis objetivos" size="lg" onPress={save} />
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
});
