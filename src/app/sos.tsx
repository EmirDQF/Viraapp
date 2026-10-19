import { Stack } from 'expo-router';

import { SosScreen } from '@/features/sos/SosScreen';

export default function SosRoute() {
  return (
    <>
      <Stack.Screen options={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom' }} />
      <SosScreen />
    </>
  );
}
