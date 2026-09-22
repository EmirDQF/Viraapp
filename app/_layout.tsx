import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AxoMascot } from '../components/AxoMascot';
import { useStoreHydrated } from '../store/useResilienceStore';
import { spacing } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

export default function RootLayout() {
  const hydrated = useStoreHydrated();
  const { colors, isDark } = useTheme();

  if (!hydrated) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <AxoMascot mood="thinking" size={140} />
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
