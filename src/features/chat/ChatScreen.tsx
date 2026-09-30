import { LinearGradient } from 'expo-linear-gradient';
import { Eraser, Send, WifiOff } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';
import { ICON_STROKE } from '@/components/ui/IconTile';
import { ScreenBackground } from '@/components/ui/ScreenBackground';
import { CrisisCard } from '@/features/chat/CrisisCard';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { ResetOverlay } from '@/features/chat/ResetOverlay';
import { useChat } from '@/features/chat/useChat';
import { MAX_MESSAGE_CHARS } from '@/lib/chat/schema';
import type { ChatMessage } from '@/store/types';
import { gradients, MIN_TOUCH, onGradient, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';

const RESET_MS = 2200;
const SUGGESTIONS = ['Tuve un mal día', 'Estoy estresado por un examen', 'Quiero organizarme mejor'] as const;
const SEND_SIZE = MIN_TOUCH + 4;
const INPUT_MAX_HEIGHT = 120;
const HALO = 170;

function EmptyChat({ onPick }: { readonly onPick: (text: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <View style={styles.emptyFigure}>
        <View style={[styles.emptyHalo, { backgroundColor: colors.regiSoft }]} />
        <RegiMascot pose="calm" size={140} glow={0.4} />
      </View>
      <AppText variant="title" align="center">
        Hola, soy Regi
      </AppText>
      <AppText tone="muted" align="center">
        Cuéntame lo que quieras. Te escucho sin juzgar. Recuerda que no sustituyo a un profesional.
      </AppText>
      <View style={styles.chips}>
        {SUGGESTIONS.map((text) => (
          <Chip key={text} label={text} accessibilityLabel={`Enviar: ${text}`} onPress={() => onPick(text)} />
        ))}
      </View>
    </View>
  );
}

function ChatHeader({ offline, onReset }: { readonly offline: boolean; readonly onReset: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel="Borrón y cuenta nueva: borrar la conversación y empezar de nuevo"
        haptics="medium"
        onPress={onReset}
      >
        <GlassCard padded={false} radius={radius.pill} elevation="sm">
          <View style={styles.resetPill}>
            <Eraser color={colors.regi} size={18} strokeWidth={ICON_STROKE} />
            <AppText variant="caption" style={styles.resetLabel}>
              Borrón y cuenta nueva
            </AppText>
          </View>
        </GlassCard>
      </AnimatedPressable>
      <View style={styles.headerTitle}>
        <AppText variant="subtitle" accessibilityRole="header" align="right">
          Chat con Regi
        </AppText>
        {offline ? (
          <View style={styles.offline} accessible accessibilityLabel="Modo sin conexión: Regi responde con respuestas preparadas">
            <WifiOff color={colors.textMuted} size={14} />
            <AppText variant="caption" tone="muted">
              Sin conexión
            </AppText>
          </View>
        ) : (
          <AppText variant="caption" tone="muted" align="right">
            Te escucho sin juzgar
          </AppText>
        )}
      </View>
    </View>
  );
}

/** Chat con Regi IA (maqueta 5): fondo regi suave, burbujas de vidrio y "Borrón y cuenta nueva" arriba a la izquierda. */
export function ChatScreen() {
  const tabSpace = useTabBarSpace();
  const { colors } = useTheme();
  const chat = useChat();
  const [draft, setDraft] = useState('');
  const [resetting, setResetting] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const blur = useSharedValue(1);
  const resetChat = chat.reset;
  const sendMessage = chat.send;

  useEffect(() => {
    if (!resetting) return;
    const timer = setTimeout(() => {
      resetChat();
      blur.set(withTiming(1, { duration: 300 }));
      setResetting(false);
    }, RESET_MS);
    return () => clearTimeout(timer);
  }, [blur, resetChat, resetting]);

  const startReset = () => {
    if (resetting) return;
    blur.set(withTiming(0.12, { duration: 500 }));
    setResetting(true);
  };

  const submit = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setDraft('');
      void sendMessage(text);
    },
    [sendMessage],
  );

  const listStyle = useAnimatedStyle(() => ({ opacity: blur.get(), transform: [{ scale: 0.96 + blur.get() * 0.04 }] }));
  const lastId = chat.messages.at(-1)?.id;
  const canSend = draft.trim().length > 0 && !chat.sending;

  return (
    <ScreenBackground variant="regi">
      <SafeAreaView style={[styles.safe, { paddingBottom: tabSpace }]} edges={['top']}>
        <ChatHeader offline={chat.offline} onReset={startReset} />
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
          <Animated.View style={[styles.flex, listStyle]}>
            <FlatList
              ref={listRef}
              data={chat.messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <MessageBubble message={item} typing={chat.sending && item.id === lastId} />}
              contentContainerStyle={styles.list}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              ListEmptyComponent={<EmptyChat onPick={submit} />}
              keyboardShouldPersistTaps="handled"
            />
          </Animated.View>
          {chat.crisis ? (
            <View style={styles.crisis}>
              <CrisisCard onDismiss={chat.dismissCrisis} />
            </View>
          ) : null}
          <View style={styles.inputRow}>
            <GlassCard padded={false} radius={radius.xl} elevation="md" style={styles.inputCapsule}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Escribe tu mensaje…"
                placeholderTextColor={colors.textMuted}
                accessibilityLabel="Escribe tu mensaje para Regi"
                multiline
                maxLength={MAX_MESSAGE_CHARS}
                style={[styles.input, { color: colors.text }]}
              />
            </GlassCard>
            <AnimatedPressable
              accessibilityRole="button"
              accessibilityLabel="Enviar mensaje"
              accessibilityState={{ disabled: !canSend }}
              disabled={!canSend}
              haptics="light"
              onPress={() => submit(draft)}
              style={[styles.send, canSend ? null : { backgroundColor: colors.disabled }]}
            >
              {canSend ? (
                <LinearGradient colors={gradients.regiButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              ) : null}
              {/* En web, el degradado posicionado se pinta sobre lo estático: el ícono va en su propia capa. */}
              <View style={styles.sendIcon}>
                <Send color={canSend ? onGradient.regiButton : colors.textMuted} size={20} strokeWidth={ICON_STROKE} />
              </View>
            </AnimatedPressable>
          </View>
        </KeyboardAvoidingView>
        {resetting ? <ResetOverlay /> : null}
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
  },
  resetPill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH },
  resetLabel: { fontFamily: fontFamily.bold },
  headerTitle: { flex: 1, alignItems: 'flex-end' },
  offline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  list: { paddingHorizontal: spacing.screen, paddingVertical: spacing.md, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  emptyFigure: { alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  emptyHalo: { position: 'absolute', width: HALO, height: HALO, borderRadius: HALO / 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.md },
  crisis: { paddingHorizontal: spacing.screen },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.sm,
  },
  inputCapsule: { flex: 1 },
  input: {
    maxHeight: INPUT_MAX_HEIGHT,
    minHeight: SEND_SIZE,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.medium,
    fontSize: 16,
  },
  send: {
    width: SEND_SIZE,
    height: SEND_SIZE,
    borderRadius: SEND_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { position: 'relative' },
});
