import type { StateCreator } from 'zustand';

import { MAX_CHAT_MESSAGES } from '@/store/migrations';
import type { AppState, ChatActions } from '@/store/types';

export const createChatSlice: StateCreator<AppState, [], [], ChatActions> = (set) => ({
  addChatMessage: (message) =>
    set((current) => ({ chatMessages: [...current.chatMessages, message].slice(-MAX_CHAT_MESSAGES) })),
  appendToChatMessage: (id, text) =>
    set((current) => ({
      chatMessages: current.chatMessages.map((message) => (message.id === id ? { ...message, text: message.text + text } : message)),
    })),
  replaceChatMessage: (id, text) =>
    set((current) => ({
      chatMessages: current.chatMessages.map((message) => (message.id === id ? { ...message, text } : message)),
    })),
  clearChat: () => set({ chatMessages: [] }),
});
