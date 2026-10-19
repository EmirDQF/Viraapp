import { Redirect, useLocalSearchParams } from 'expo-router';

import { getCase } from '@/data/cases';
import { CaseScreen } from '@/features/cases/CaseScreen';

/** Un caso del laboratorio. El id puede venir de un enlace: si no existe, vuelve a la lista. */
export default function CaseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const study = typeof id === 'string' ? getCase(id) : undefined;
  if (!study) return <Redirect href="/cases" />;
  return <CaseScreen key={study.id} study={study} />;
}
