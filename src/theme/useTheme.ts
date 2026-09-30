import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type ThemeColors } from '@/theme/tokens';

export interface Theme {
  readonly colors: ThemeColors;
  readonly isDark: boolean;
}

export function useTheme(): Theme {
  const isDark = useColorScheme() === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
