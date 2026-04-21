import { generateText, type ModelMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

/**
 * Summarization starszych wiadomości z historii chatu.
 * Używane gdy history > KEEP_VERBATIM — sparsowane wiadomości 1...history.length-KEEP
 * są podsumowane przez tańszy model (haiku) w maks 300 tok, reszta verbatim.
 */

export const KEEP_VERBATIM = 10;
export const SUMMARIZE_THRESHOLD = 20;

export async function summarizeOlderMessages(
  messages: ModelMessage[],
): Promise<string> {
  if (messages.length === 0) return "";

  const dialogue = messages
    .map((m) => {
      const role = m.role === "user" ? "Użytkownik" : m.role === "assistant" ? "Pracuś" : m.role;
      const content =
        typeof m.content === "string"
          ? m.content
          : Array.isArray(m.content)
            ? m.content
                .map((p) => (p.type === "text" ? p.text : `[${p.type}]`))
                .join(" ")
            : "";
      return `${role}: ${content}`;
    })
    .join("\n")
    .slice(0, 8000);

  const result = await generateText({
    model: anthropic("claude-haiku-4-5"),
    system:
      "Podsumuj poniższą rozmowę Pracusia (doradcy CV) z użytkownikiem w 3-5 zdaniach po polsku. Zachowaj: (1) co użytkownik chce osiągnąć w CV, (2) kluczowe fakty o jego doświadczeniu, (3) jakie zmiany zostały już zaakceptowane lub odrzucone. Bez wstępu.",
    prompt: dialogue,
    maxOutputTokens: 400,
    temperature: 0.3,
    abortSignal: AbortSignal.timeout(15_000),
  });

  return result.text.trim();
}

/**
 * Stosuje kompresję: pierwsze N wiadomości → summary, reszta verbatim.
 * Zwraca nową tablicę ModelMessage.
 */
export async function compressHistory(
  messages: ModelMessage[],
): Promise<ModelMessage[]> {
  if (messages.length <= SUMMARIZE_THRESHOLD) return messages;

  const older = messages.slice(0, messages.length - KEEP_VERBATIM);
  const recent = messages.slice(messages.length - KEEP_VERBATIM);

  try {
    const summary = await summarizeOlderMessages(older);
    if (!summary) return messages;

    const summaryMessage: ModelMessage = {
      role: "system",
      content: `<historia_rozmowy_skrot>\n${summary}\n</historia_rozmowy_skrot>`,
    };

    return [summaryMessage, ...recent];
  } catch {
    // Na błąd summarization — fallback do trimmingu do ostatnich KEEP
    return recent;
  }
}
