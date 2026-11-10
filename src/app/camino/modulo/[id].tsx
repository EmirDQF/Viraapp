import { Redirect, useLocalSearchParams } from 'expo-router';

import { isPa3ModuleId } from '@/data/caminos/modules';
import { CaminoModuleScreen } from '@/features/caminos/CaminoModuleScreen';

/** Un módulo PA3 con su flujo de 4 etapas. El id puede venir de un enlace: si no es válido, vuelve a Explorar. */
export default function CaminoModuleRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!isPa3ModuleId(id)) return <Redirect href="/(tabs)/explore" />;
  return <CaminoModuleScreen key={id} moduleId={id} />;
}
