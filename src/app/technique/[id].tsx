import { Redirect, useLocalSearchParams } from 'expo-router';

import { isTechniqueId } from '@/data/techniques';
import { TechniqueScreen } from '@/features/sos/TechniqueScreen';

/** Una técnica guiada. El id puede venir de un enlace: si no es válido, vuelve al inicio. */
export default function TechniqueRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!isTechniqueId(id)) return <Redirect href="/(tabs)" />;
  return <TechniqueScreen key={id} technique={id} />;
}
