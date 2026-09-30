import { Redirect, useLocalSearchParams } from 'expo-router';

import { isModuleId } from '@/data/modules/catalog';
import { RewardScreen } from '@/features/game/RewardScreen';

export default function RewardRoute() {
  const { module } = useLocalSearchParams<{ module: string }>();
  if (!isModuleId(module)) return <Redirect href="/(tabs)/missions" />;
  return <RewardScreen moduleId={module} />;
}
