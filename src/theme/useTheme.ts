import { useColorScheme } from 'react-native';

import { useAppStore } from '@/store/useAppStore';
import { darkColors, lightColors, type ThemeColors } from '@/theme/tokens';

export interface Theme {
  readonly colors: ThemeColors;
  readonly isDark: boolean;
}

/** Tema activo: respeta la preferencia del usuario (sistema, claro u oscuro). */
export function useTheme(): Theme {
  const system = useColorScheme();
  const preference = useAppStore((state) => state.settings.theme);
  const isDark = preference === 'system' ? system === 'dark' : preference === 'dark';
  return { colors: isDark ? darkColors : lightColors, isDark };
}
