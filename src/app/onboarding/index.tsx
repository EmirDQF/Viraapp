import { Redirect } from 'expo-router';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { useAppStore } from '@/store/useAppStore';

export default function OnboardingRoute() {
  const onboarded = useAppStore((state) => state.onboarding.completed);
  if (onboarded) return <Redirect href="/(tabs)" />;
  return <OnboardingFlow />;
}
