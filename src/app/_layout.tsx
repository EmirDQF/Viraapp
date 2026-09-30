import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReduceMotion, ReducedMotionConfig } from 'react-native-reanimated';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { useNotificationRouting } from '@/features/notifications/useNotificationRouting';
import { usePreferencesSync } from '@/features/settings/usePreferencesSync';
import { useAppStore, useStoreHydrated } from '@/store/useAppStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const hydrated = useStoreHydrated();
  useNotificationRouting();
  usePreferencesSync();
  const reduceMotion = useAppStore((state) => state.settings.reduceMotion);
  const { colors, isDark } = useTheme();
  // Si la fuente falla (sin red en web, por ejemplo) seguimos con la del sistema en lugar de bloquear la app.
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  const fontsReady = fontsLoaded || fontError !== null;

  if (!hydrated || !fontsReady) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <RegiMascot pose="calm" size={140} />
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {/* El ajuste "Reducir movimiento" acorta todas las animaciones de reanimated (entradas y with*). */}
      {reduceMotion ? <ReducedMotionConfig mode={ReduceMotion.Always} /> : null}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: reduceMotion ? 'none' : 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
});
