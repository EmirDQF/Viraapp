/** Validación de la petición al chat (se usa en el servidor; el cliente arma el mismo formato). */
import { z } from 'zod';

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_HISTORY = 30;

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(MAX_MESSAGE_CHARS),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(messageSchema)
    .min(1)
    .max(MAX_HISTORY)
    .refine((messages) => messages[messages.length - 1]?.role === 'user', {
      message: 'El último mensaje debe ser del usuario',
    }),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type ChatTurn = ChatRequest['messages'][number];
