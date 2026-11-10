import { Redirect, useLocalSearchParams } from 'expo-router';

import { getActivity } from '@/data/caminos/activities';
import { ActivityFlowScreen } from '@/features/caminos/ActivityFlowScreen';

/** Una actividad PA3 que se juega dentro de VIRA. Las demás llevan a su módulo. */
export default function CaminoActivityRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const activity = typeof id === 'string' ? getActivity(id) : undefined;
  if (!activity) return <Redirect href="/(tabs)/explore" />;
  if (activity.content.kind !== 'flow') {
    return <Redirect href={{ pathname: '/camino/modulo/[id]', params: { id: activity.moduleId } }} />;
  }
  return <ActivityFlowScreen key={activity.id} activity={activity} flow={activity.content} />;
}
