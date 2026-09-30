import type { ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { MAX_FONT_SCALE, typography, type TypographyVariant } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

type Tone = 'default' | 'muted' | 'primary' | 'onColor' | 'danger' | 'success';

interface AppTextProps extends Omit<TextProps, 'style'> {
  readonly children: ReactNode;
  readonly variant?: TypographyVariant;
  readonly tone?: Tone;
  readonly color?: string;
  readonly align?: TextStyle['textAlign'];
  readonly uppercase?: boolean;
  readonly style?: StyleProp<TextStyle>;
}

/** Texto con la tipografía VIRA; respeta el tamaño de fuente del sistema con un tope razonable. */
export function AppText({
  children,
  variant = 'body',
  tone = 'default',
  color,
  align,
  uppercase = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useTheme();
  const toneColor: Record<Tone, string> = {
    default: colors.text,
    muted: colors.textMuted,
    primary: colors.highlight,
    onColor: colors.onColor,
    danger: colors.danger,
    success: colors.success,
  };
  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      {...rest}
      style={[
        typography[variant],
        { color: color ?? toneColor[tone] },
        align ? { textAlign: align } : null,
        uppercase ? styles.uppercase : null,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  uppercase: { textTransform: 'uppercase' },
});
