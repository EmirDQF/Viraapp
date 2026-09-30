import * as WebBrowser from 'expo-web-browser';
import { ExternalLink } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import type { TrustedLink } from '@/data/explore';
import { displayHost, isTrustedUrl } from '@/lib/links';
import { MIN_TOUCH, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Abre un enlace confiable en el navegador del sistema; los que no pasan el filtro nunca se abren. */
async function openTrustedLink(url: string): Promise<boolean> {
  if (!isTrustedUrl(url)) return false;
  try {
    await WebBrowser.openBrowserAsync(url);
    return true;
  } catch {
    return false;
  }
}

export function LinkRow({ link }: { readonly link: TrustedLink }) {
  const { colors } = useTheme();
  const [failed, setFailed] = useState(false);
  const open = async () => setFailed(!(await openTrustedLink(link.url)));
  return (
    <View>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={`${link.title}. Abre ${displayHost(link.url)} en el navegador`}
        onPress={() => void open()}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      >
        <ExternalLink color={colors.highlight} size={18} />
        <View style={styles.text}>
          <AppText variant="bodyStrong" tone="primary">
            {link.title}
          </AppText>
          <AppText variant="caption" tone="muted">
            {displayHost(link.url)}
          </AppText>
        </View>
      </Pressable>
      {failed ? (
        <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">
          No pudimos abrir el enlace. Revisa tu conexión e inténtalo de nuevo.
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: MIN_TOUCH, paddingVertical: spacing.xs },
  text: { flex: 1 },
  pressed: { opacity: 0.6 },
});
