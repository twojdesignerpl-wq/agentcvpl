import { convertToModelMessages, stepCountIs, streamText, type SystemModelMessage, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { BASE_PERSONA, buildSystemPrompt } from "@/lib/ai/prompts";
import { pracusTools } from "@/lib/ai/tools";
import { compressHistory, SUMMARIZE_THRESHOLD } from "@/lib/ai/summarize";
import type { AIContext } from "@/types/ai";
import { z } from "zod";

export const maxDuration = 30;
export const runtime = "nodejs";

const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 10_000;

const contextSchema = z.object({
  action: z.enum(["generate", "improve", "job-match", "chat"]),
  field: z.string().max(64).optional(),
  fieldLabel: z.string().max(128).optional(),
  currentText: z.string().max(5_000).optional(),
  position: z.string().max(200).optional(),
  industry: z.string().max(64).optional(),
  jobListing: z.string().max(8_000).optional(),
  cvData: z.unknown().optional(),
  overflowed: z.boolean().optional(),
});

// Minimalna walidacja UIMessage — shape + length cap + whitelist ról.
// Blokujemy `role: "system"` po stronie klienta, żeby user nie mógł wstrzyknąć
// własnego system promptu (system przygotowujemy serwerowo z BASE_PERSONA).
const uiMessagePartSchema = z.object({
  type: z.string().max(64),
  text: z.string().max(MAX_MESSAGE_CHARS).optional(),
}).passthrough();

const uiMessageSchema = z.object({
  id: z.string().max(128),
  role: z.enum(["user", "assistant"]),
  parts: z.array(uiMessagePartSchema).max(20),
}).passthrough();

const messagesSchema = z.array(uiMessageSchema).min(1).max(MAX_MESSAGES);

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Nieprawidłowy format JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Body musi być obiektem JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages: rawMessages, context } = body as {
    messages?: unknown;
    context?: unknown;
  };

  const parsedMessages = messagesSchema.safeParse(rawMessages);
  if (!parsedMessages.success) {
    const tooLong = Array.isArray(rawMessages) && rawMessages.length > MAX_MESSAGES;
    return new Response(
      JSON.stringify({
        error: tooLong
          ? `Maksymalnie ${MAX_MESSAGES} wiadomości w jednym żądaniu`
          : "Nieprawidłowy format wiadomości",
      }),
      {
        status: tooLong ? 413 : 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const messages = parsedMessages.data as unknown as UIMessage[];

  const parsedContext = contextSchema.safeParse(context);
  const aiContext: AIContext = parsedContext.success
    ? (parsedContext.data as AIContext)
    : { action: "chat" };

  // Pełny system prompt (BASE_PERSONA + industry + cv-context + directive)
  const fullSystem = buildSystemPrompt(aiContext);

  // Split dla prompt cachingu: BASE_PERSONA (stabilna persona ~600 tok) jest cached,
  // reszta (industry/cv/directive) zmienia się per request i NIE jest cached.
  // Oszczędność ~60% tokenów wejściowych na kolejnych req w ciągu 5 min.
  const dynamicPart = fullSystem.startsWith(BASE_PERSONA)
    ? fullSystem.slice(BASE_PERSONA.length).replace(/^\n+/, "")
    : fullSystem;

  const convertedMessagesRaw = await convertToModelMessages(messages);
  const convertedMessages =
    convertedMessagesRaw.length >= SUMMARIZE_THRESHOLD
      ? await compressHistory(convertedMessagesRaw)
      : convertedMessagesRaw;

  const systemMessages: SystemModelMessage[] = [
    {
      role: "system",
      content: BASE_PERSONA,
      providerOptions: {
        anthropic: { cacheControl: { type: "ephemeral" } },
      },
    },
    ...(dynamicPart
      ? [{ role: "system" as const, content: dynamicPart }]
      : []),
  ];

  // Tools: tylko w trybie "chat". Inne tryby (generate/improve/job-match) są
  // pojedyncze-zapytania, bez tool-calling.
  const enableTools = aiContext.action === "chat";

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemMessages,
    messages: convertedMessages,
    maxOutputTokens: 600,
    temperature: 0.35,
    abortSignal: AbortSignal.timeout(28_000),
    ...(enableTools
      ? {
          tools: pracusTools,
          // Zatrzymaj po pierwszym kroku — nie pozwalamy modelowi pętlić tool-calli
          // bez potwierdzenia użytkownika. Klient po `addToolResult` wysyła nową
          // wiadomość, co triggeruje nowy request.
          stopWhen: stepCountIs(1),
        }
      : {}),
  });

  return result.toUIMessageStreamResponse();
}
