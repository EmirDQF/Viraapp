import { Redirect, useLocalSearchParams } from 'expo-router';

import { isModuleId } from '@/data/modules/catalog';
import { ModuleOverviewScreen } from '@/features/game/ModuleOverviewScreen';

export default function ModuleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Los parámetros pueden venir de un enlace externo: se validan antes de usarlos.
  if (!isModuleId(id)) return <Redirect href="/(tabs)/missions" />;
  return <ModuleOverviewScreen id={id} />;
}
