import { Redirect, useLocalSearchParams } from 'expo-router';

import { isModuleId } from '@/data/modules/catalog';
import { STAGES_PER_MODULE } from '@/data/stages';
import { StageScreen } from '@/features/game/StageScreen';

/** Etapa de un módulo. Los parámetros pueden venir de un enlace: se validan antes de usarlos. */
export default function StageRoute() {
  const { id, stage } = useLocalSearchParams<{ id: string; stage: string }>();
  const index = Number(stage);
  if (!isModuleId(id) || !Number.isInteger(index) || index < 0 || index >= STAGES_PER_MODULE) {
    return <Redirect href="/(tabs)/missions" />;
  }
  return <StageScreen key={`${id}-${index}`} moduleId={id} stage={index} />;
}
