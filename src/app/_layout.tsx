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

import { RegiMascot } from '@/components/regi/RegiMascot';
import { useStoreHydrated } from '@/store/useResilienceStore';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  const hydrated = useStoreHydrated();
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
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
});
