import Constants from 'expo-constants';
import { fetch as expoFetch } from 'expo/fetch';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { detectCrisis } from '@/lib/chat/crisis';
import { offlineReply } from '@/lib/chat/offline';
import { MAX_HISTORY, MAX_MESSAGE_CHARS } from '@/lib/chat/schema';
import { useAppStore } from '@/store/useAppStore';
import type { ChatMessage } from '@/store/types';

const CHAT_PATH = '/api/chat';

/** URL de la ruta de chat: origen configurado, el mismo origen en web o el servidor de desarrollo en el teléfono. */
function chatUrl(): string | null {
  const origin = process.env.EXPO_PUBLIC_API_ORIGIN;
  if (origin) return `${origin.replace(/\/$/, '')}${CHAT_PATH}`;
  if (Platform.OS === 'web' && typeof window !== 'undefined') return `${window.location.origin}${CHAT_PATH}`;
  const host = Constants.expoConfig?.hostUri;
  return host ? `http://${host}${CHAT_PATH}` : null;
}

let counter = 0;
const newId = (): string => {
  counter += 1;
  return `${Date.now().toString(36)}-${counter}`;
};

export interface ChatController {
  readonly messages: readonly ChatMessage[];
  readonly sending: boolean;
  readonly offline: boolean;
  readonly crisis: boolean;
  readonly send: (text: string) => Promise<void>;
  readonly reset: () => void;
  readonly dismissCrisis: () => void;
}

/** Lógica del chat con Regi: streaming desde el servidor y, si no hay servidor, respuestas guionizadas. */
export function useChat(): ChatController {
  const messages = useAppStore((state) => state.chatMessages);
  const addMessage = useAppStore((state) => state.addChatMessage);
  const appendToMessage = useAppStore((state) => state.appendToChatMessage);
  const replaceMessage = useAppStore((state) => state.replaceChatMessage);
  const clearChat = useAppStore((state) => state.clearChat);
  const [sending, setSending] = useState(false);
  const [offline, setOffline] = useState(false);
  const [crisis, setCrisis] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const streamFromServer = useCallback(
    async (url: string, history: readonly ChatMessage[], replyId: string, signal: AbortSignal): Promise<void> => {
      const response = await expoFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map((message) => ({ role: message.role, content: message.text })) }),
        signal,
      });
      if (!response.ok || !response.body) throw new Error(`chat_unavailable_${response.status}`);
      if (response.headers.get('x-vira-crisis') === '1') setCrisis(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let received = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        received += text.length;
        if (text) appendToMessage(replyId, text);
      }
      if (received === 0) throw new Error('chat_empty');
    },
    [appendToMessage],
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, MAX_MESSAGE_CHARS);
      if (!text || sending) return;
      const userMessage: ChatMessage = { id: newId(), role: 'user', text, createdAt: new Date().toISOString() };
      const replyId = newId();
      const history = [...messages, userMessage].filter((message) => message.text.trim().length > 0).slice(-MAX_HISTORY);
      const assistantTurns = messages.filter((message) => message.role === 'assistant').length;
      addMessage(userMessage);
      if (detectCrisis(text)) setCrisis(true);
      addMessage({ id: replyId, role: 'assistant', text: '', createdAt: new Date().toISOString() });
      setSending(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const url = chatUrl();
        if (!url || offline) throw new Error('chat_offline');
        await streamFromServer(url, history, replyId, controller.signal);
      } catch {
        if (controller.signal.aborted) return;
        // Sin servidor configurado, sin red o con error: Regi responde con su guion, sin bloquear al usuario.
        setOffline(true);
        replaceMessage(replyId, offlineReply(text, assistantTurns));
      } finally {
        setSending(false);
      }
    },
    [addMessage, messages, offline, replaceMessage, sending, streamFromServer],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    clearChat();
    setCrisis(false);
    setSending(false);
  }, [clearChat]);

  return { messages, sending, offline, crisis, send, reset, dismissCrisis: () => setCrisis(false) };
}
