import { Redirect } from 'expo-router';

import { useAppStore } from '@/store/useAppStore';

/** Punto de entrada: onboarding la primera vez y, después, las pestañas. */
export default function Index() {
  const onboarded = useAppStore((state) => state.onboarding.completed);
  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding'} />;
}
