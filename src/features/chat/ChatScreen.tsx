import { Eraser, Send, WifiOff } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RegiMascot } from '@/components/regi/RegiMascot';
import { AppText } from '@/components/ui/AppText';
import { CrisisCard } from '@/features/chat/CrisisCard';
import { MessageBubble } from '@/features/chat/MessageBubble';
import { ResetOverlay } from '@/features/chat/ResetOverlay';
import { useChat } from '@/features/chat/useChat';
import { haptic } from '@/lib/haptics';
import { MAX_MESSAGE_CHARS } from '@/lib/chat/schema';
import type { ChatMessage } from '@/store/types';
import { MIN_TOUCH, radius, spacing } from '@/theme/tokens';
import { fontFamily } from '@/theme/typography';
import { useTheme } from '@/theme/useTheme';
import { useTabBarSpace } from '@/components/ui/GlassTabBar';

const RESET_MS = 2200;
const SUGGESTIONS = ['Tuve un mal día', 'Estoy estresado por un examen', 'Quiero organizarme mejor'] as const;

function EmptyChat({ onPick }: { readonly onPick: (text: string) => void }) {
  const { colors } = useTheme();
  return (
    <View style={styles.empty}>
      <RegiMascot pose="calm" size={140} />
      <AppText variant="heading" align="center">
        Hola, soy Regi
      </AppText>
      <AppText tone="muted" align="center">
        Cuéntame lo que quieras. Te escucho sin juzgar. Recuerda que no sustituyo a un profesional.
      </AppText>
      <View style={styles.chips}>
        {SUGGESTIONS.map((text) => (
          <Pressable
            key={text}
            accessibilityRole="button"
            accessibilityLabel={`Enviar: ${text}`}
            onPress={() => onPick(text)}
            style={[styles.chip, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <AppText variant="caption">{text}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/** Chat con Regi IA (maqueta 5) con el botón fijo "Borrón y cuenta nueva" arriba a la izquierda. */
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
    haptic('medium');
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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background, paddingBottom: tabSpace }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Borrón y cuenta nueva: borrar la conversación y empezar de nuevo"
          onPress={startReset}
          style={[styles.reset, { backgroundColor: colors.secondary }]}
        >
          <Eraser color={colors.onSecondary} size={22} />
        </Pressable>
        <View style={styles.headerText}>
          <AppText variant="subtitle" accessibilityRole="header">
            Chat con Regi
          </AppText>
          <AppText variant="caption" tone="muted">
            Borrón y cuenta nueva cuando quieras
          </AppText>
        </View>
        {chat.offline ? (
          <View style={styles.offline} accessible accessibilityLabel="Modo sin conexión: Regi responde con respuestas preparadas">
            <WifiOff color={colors.textMuted} size={16} />
            <AppText variant="caption" tone="muted">
              Sin conexión
            </AppText>
          </View>
        ) : null}
      </View>
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
        <View style={[styles.inputRow, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribe tu mensaje…"
            placeholderTextColor={colors.textMuted}
            accessibilityLabel="Escribe tu mensaje para Regi"
            multiline
            maxLength={MAX_MESSAGE_CHARS}
            style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Enviar mensaje"
            accessibilityState={{ disabled: !draft.trim() || chat.sending }}
            disabled={!draft.trim() || chat.sending}
            onPress={() => submit(draft)}
            style={[styles.send, { backgroundColor: draft.trim() && !chat.sending ? colors.primary : colors.disabled }]}
          >
            <Send color={colors.onPrimary} size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
      {resetting ? <ResetOverlay /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth },
  reset: { width: MIN_TOUCH + 4, height: MIN_TOUCH + 4, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  offline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  list: { padding: spacing.md, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.sm },
  chip: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.md, minHeight: MIN_TOUCH - 4, justifyContent: 'center' },
  crisis: { paddingHorizontal: spacing.md },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, padding: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: MIN_TOUCH + 4,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: fontFamily.regular,
    fontSize: 16,
  },
  send: { width: MIN_TOUCH + 4, height: MIN_TOUCH + 4, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
