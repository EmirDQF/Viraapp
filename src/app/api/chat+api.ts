/**
 * Ruta de servidor del chat con Regi (Expo Router API route). La clave de Anthropic vive SOLO aquí, como
 * variable de entorno del servidor (ANTHROPIC_API_KEY); nunca se incluye en la app.
 */
import Anthropic from '@anthropic-ai/sdk';

import { detectCrisis } from '@/lib/chat/crisis';
import { createRateLimiter } from '@/lib/chat/rateLimit';
import { chatRequestSchema } from '@/lib/chat/schema';
import { REGI_SYSTEM_PROMPT } from '@/lib/chat/systemPrompt';

/** Modelo indicado en la especificación del producto (respuestas rápidas y cálidas). */
const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 2048;
const MAX_BODY_BYTES = 80_000;
const limiter = createRateLimiter({ limit: 20, windowMs: 5 * 60 * 1000 });

const CRISIS_HEADER = 'X-Vira-Crisis';
const REFUSAL_FALLBACK = 'Prefiero no responder eso, pero sigo aquí contigo. ¿Quieres contarme cómo te sientes?';

function json(status: number, body: Record<string, unknown>, headers: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'anonymous';
}

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new Error('too_large');
  return JSON.parse(text);
}

function streamReply(client: Anthropic, messages: Anthropic.MessageParam[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: REGI_SYSTEM_PROMPT,
          output_config: { effort: 'low' },
          messages,
        });
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') controller.enqueue(encoder.encode(REFUSAL_FALLBACK));
        controller.close();
      } catch (error: unknown) {
        // El detalle se queda en el servidor; al cliente solo le llega un corte que activa el modo sin conexión.
        controller.error(error instanceof Error ? error : new Error('chat_failed'));
      }
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, { error: 'offline' });

  const rate = limiter.check(clientKey(request));
  if (!rate.allowed) {
    return json(429, { error: 'rate_limited' }, { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) });
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch {
    return json(400, { error: 'invalid_body' });
  }
  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) return json(400, { error: 'invalid_request' });

  const last = parsed.data.messages[parsed.data.messages.length - 1];
  const client = new Anthropic({ apiKey });
  const messages: Anthropic.MessageParam[] = parsed.data.messages.map((message) => ({ role: message.role, content: message.content }));

  return new Response(streamReply(client, messages), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      [CRISIS_HEADER]: detectCrisis(last.content) ? '1' : '0',
    },
  });
}
