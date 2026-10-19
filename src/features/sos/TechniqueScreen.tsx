import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiSays } from '@/components/regi/RegiMascot';
import { BackHeader } from '@/components/ui/BackHeader';
import { Button3D } from '@/components/ui/Button3D';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { TECHNIQUES, techniqueSeconds, type TechniqueId } from '@/data/techniques';
import { goBackOrHome } from '@/features/game/navigation';
import { TechniqueRunner } from '@/features/sos/TechniqueRunner';
import { useAppStore } from '@/store/useAppStore';
import { spacing } from '@/theme/tokens';

/** Practicar una técnica en calma (la sugerida en Inicio). Cuenta como práctica y queda en Mi camino. */
export function TechniqueScreen({ technique }: { readonly technique: TechniqueId }) {
  const logEvent = useAppStore((state) => state.logEvent);
  const registerPractice = useAppStore((state) => state.registerPractice);
  const [done, setDone] = useState(false);
  const minutes = Math.max(1, Math.round(techniqueSeconds(technique) / 60));

  const finish = () => {
    logEvent({ kind: 'technique', technique, minutes });
    registerPractice(minutes);
    setDone(true);
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <BackHeader title={TECHNIQUES[technique].name} />
          {done ? (
            <ScrollView contentContainerStyle={styles.done}>
              <RegiSays pose="growth" message="¡Bien hecho! Practicar en calma hace que la técnica salga sola cuando la necesites." />
              <Button3D label="Volver" onPress={goBackOrHome} />
            </ScrollView>
          ) : (
            <TechniqueRunner technique={technique} onDone={finish} />
          )}
        </View>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.screen, paddingVertical: spacing.lg, gap: spacing.md },
  done: { gap: spacing.lg },
});
