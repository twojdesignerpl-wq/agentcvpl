"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCVStore } from "@/lib/cv/store";
import { buildAIContext } from "@/lib/ai/context";
import { useJobContextStore } from "@/lib/plan/job-context";
import { Message, TypingIndicator } from "./message";
import { ChatInput } from "./input";
import { Suggestions, WelcomeCard } from "./suggestions";
import { ToolProposal } from "./tool-proposal";
import { JobMatchDialog } from "./job-match-dialog";
import { applyToolToStore } from "./apply-tool";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowClockwise, Target, WarningOctagon } from "@phosphor-icons/react/dist/ssr";

type MsgPart = UIMessage["parts"][number];

function extractText(msg: UIMessage): string {
  let out = "";
  for (const part of msg.parts) {
    if (part.type === "text") out += part.text;
  }
  return out;
}

function hasTextContent(msg: UIMessage): boolean {
  return msg.parts.some((p) => p.type === "text" && p.text.trim().length > 0);
}

function hasToolContent(msg: UIMessage): boolean {
  return msg.parts.some((p) => typeof p.type === "string" && p.type.startsWith("tool-"));
}

type ToolPart = Extract<MsgPart, { type: `tool-${string}` }>;

function isToolPart(p: MsgPart): p is ToolPart {
  return typeof p.type === "string" && p.type.startsWith("tool-");
}

export type PracusChatHandle = {
  sendPrompt: (prompt: string) => void;
  openJobDialog: () => void;
};

export const PracusChat = forwardRef<PracusChatHandle>(function PracusChat(_, ref) {
  const [input, setInput] = useState("");
  const [jobDialogOpen, setJobDialogOpen] = useState(false);

  const jobHydrate = useJobContextStore((s) => s.hydrate);
  const jobContext = useJobContextStore((s) => s.current);
  const jobHydrated = useJobContextStore((s) => s.hydrated);

  useEffect(() => {
    jobHydrate();
  }, [jobHydrate]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => {
          const cv = useCVStore.getState().cv;
          const job = useJobContextStore.getState().current;
          return {
            context: buildAIContext(cv, {
              jobListing: job?.listing,
            }),
          };
        },
      }),
    [],
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    clearError,
    regenerate,
    addToolResult,
  } = useChat({
    transport,
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const isEmpty = messages.length === 0;

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const lastMessageCountRef = useRef(0);
  useEffect(() => {
    const isNewMessage = messages.length !== lastMessageCountRef.current;
    lastMessageCountRef.current = messages.length;

    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
    }
    scrollRafRef.current = requestAnimationFrame(() => {
      const behavior: ScrollBehavior =
        isNewMessage && status !== "streaming" ? "smooth" : "auto";
      bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    });
    return () => {
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [messages, status]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    if (!text) setInput("");
    void sendMessage({ text: content });
  };

  useImperativeHandle(ref, () => ({
    sendPrompt: (prompt: string) => {
      void sendMessage({ text: prompt });
    },
    openJobDialog: () => setJobDialogOpen(true),
  }));

  const handleToolApply = async (toolName: string, toolCallId: string, input: Record<string, unknown>) => {
    const result = applyToolToStore(toolName, input);
    await addToolResult({
      tool: toolName,
      toolCallId,
      output: result,
    });
    // Po apply model automatycznie kontynuuje (jeśli useChat jest skonfigurowane),
    // ale my mamy stopWhen: stepCountIs(1) — wyślij wiadomość potwierdzającą
    // żeby model zareagował
    void sendMessage({ text: `✅ Zastosowano: ${result.note}` });
  };

  const handleToolReject = async (toolName: string, toolCallId: string, reason?: string) => {
    await addToolResult({
      tool: toolName,
      toolCallId,
      output: { status: "rejected" as const, note: reason },
    });
    void sendMessage({ text: "❌ Odrzuciłem tę propozycję. Spróbuj inaczej lub zapytaj o alternatywę." });
  };

  const handleJobSubmit = (listing: string, source?: string) => {
    const sourceLabel = source ? ` (${source})` : "";
    void sendMessage({
      text: `Wkleiłem ogłoszenie${sourceLabel}. Przeanalizuj dopasowanie mojego CV: % dopasowania, atuty, braki, co dodać i jakie słowa kluczowe ATS muszą się pojawić.`,
    });
  };

  const hasJobContext = jobHydrated && Boolean(jobContext);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-4 p-4 pb-2" aria-live="polite">
          {isEmpty ? (
            <WelcomeCard
              onPick={handleSend}
              onOpenJobDialog={() => setJobDialogOpen(true)}
              hasJobContext={hasJobContext}
            />
          ) : (
            messages.map((m) => {
              const text = extractText(m);
              const hasText = hasTextContent(m);
              const hasTools = hasToolContent(m);
              if (!hasText && !hasTools) return null;

              const isLastAssistant =
                m.role === "assistant" && m.id === messages[messages.length - 1]?.id;
              const streamingThis = status === "streaming" && isLastAssistant;

              // User messages — zawsze jako bąbel tekstu
              if (m.role === "user") {
                return hasText ? (
                  <Message key={m.id} role="user" text={text} />
                ) : null;
              }

              // Assistant — może mieć tekst + tool-call(s)
              return (
                <div key={m.id} className="flex flex-col gap-2.5">
                  {hasText ? (
                    <Message role="assistant" text={text} streaming={streamingThis} />
                  ) : null}
                  {m.parts.filter(isToolPart).map((part) => {
                    // part.type np. "tool-proposeUpdateProfile" → wyciągnij nazwę narzędzia
                    const toolName = part.type.slice("tool-".length);
                    const toolCallId = (part as { toolCallId?: string }).toolCallId ?? "";
                    const state = (part as { state: string }).state as
                      | "input-streaming"
                      | "input-available"
                      | "output-available"
                      | "output-error";
                    const input = ((part as { input?: unknown }).input as Record<string, unknown>) ?? {};
                    const output = (part as { output?: { status: "applied" | "rejected"; note?: string } })
                      .output;
                    return (
                      <ToolProposal
                        key={toolCallId || `${m.id}-${toolName}`}
                        toolCallId={toolCallId}
                        toolName={toolName}
                        input={input}
                        state={state}
                        output={output}
                        onApply={(overrideInput) =>
                          void handleToolApply(toolName, toolCallId, overrideInput ?? input)
                        }
                        onReject={(reason) => void handleToolReject(toolName, toolCallId, reason)}
                      />
                    );
                  })}
                </div>
              );
            })
          )}
          {status === "submitted" ? <TypingIndicator /> : null}
          {error ? <ErrorNotice error={error} onRetry={regenerate} onDismiss={clearError} /> : null}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="relative border-t border-ink/8 bg-[color-mix(in_oklab,var(--cream)_92%,black_2%)] px-5 py-4 flex flex-col gap-3">
        {!hasJobContext ? (
          <button
            type="button"
            onClick={() => setJobDialogOpen(true)}
            className="self-start inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream px-4 py-2 text-[13.5px] font-medium text-ink hover:border-saffron hover:bg-saffron/10 shadow-[0_2px_8px_-4px_rgba(10,14,26,0.08)] transition-colors"
          >
            <Target size={15} weight="duotone" className="text-ink-muted" />
            Wklej ogłoszenie
          </button>
        ) : null}
        {!isEmpty ? <Suggestions onPick={handleSend} compact hasJobContext={hasJobContext} /> : null}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          onStop={() => void stop()}
          disabled={isStreaming}
          isStreaming={isStreaming}
        />
        <p className="text-[11.5px] font-medium text-ink-muted/80 leading-tight">
          <kbd className="px-1.5 py-0.5 rounded bg-ink/6 font-mono text-[10.5px]">Enter</kbd> = wyślij ·
          <kbd className="px-1.5 py-0.5 rounded bg-ink/6 font-mono text-[10.5px] ml-1">Shift</kbd>+
          <kbd className="px-1.5 py-0.5 rounded bg-ink/6 font-mono text-[10.5px]">Enter</kbd> = nowy wiersz · limit 10 wiadomości/min
        </p>
      </div>

      <JobMatchDialog
        open={jobDialogOpen}
        onOpenChange={setJobDialogOpen}
        onSubmit={handleJobSubmit}
      />
    </div>
  );
});

function ErrorNotice({
  error,
  onRetry,
  onDismiss,
}: {
  error: Error;
  onRetry: () => void | Promise<void>;
  onDismiss: () => void;
}) {
  const msg = parseErrorMessage(error);
  return (
    <div className="rounded-xl border border-rust/25 bg-rust/5 p-3 flex items-start gap-3">
      <WarningOctagon size={18} weight="fill" className="text-rust shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col gap-2">
        <p className="text-[13px] text-ink">{msg}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void onRetry()}
            className="inline-flex items-center gap-1 rounded-full border border-ink/12 bg-cream px-2.5 py-1 text-[11.5px] font-medium text-ink hover:border-saffron transition-colors"
          >
            <ArrowClockwise size={12} weight="bold" /> Spróbuj ponownie
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-full px-2.5 py-1 text-[11.5px] font-medium text-ink-muted hover:text-ink transition-colors"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
}

function parseErrorMessage(error: Error): string {
  const raw = error.message || "";
  if (raw.includes("429") || raw.toLowerCase().includes("za dużo zapytań")) {
    return "Pracuś potrzebuje chwili oddechu — limit 10 wiadomości na minutę. Spróbuj za moment.";
  }
  if (raw.includes("timeout") || raw.includes("AbortError")) {
    return "Odpowiedź trwała zbyt długo. Spróbujmy jeszcze raz — tym razem krócej i konkretniej.";
  }
  return "Coś poszło nie tak po stronie Pracusia. Spróbuj ponownie.";
}

/**
 * Hook wrapper — przekazuje overflow z auto-fit do context builder.
 * Używaj tylko w panelu Pracuś (musi mieć dostęp do cv-page refs z kreator-shell).
 */
export function useOverflowedSignal(): boolean {
  // Nie mamy bezpośredniego dostępu do refs z panelu; kreator-shell może podpiąć via context.
  // Dla MVP zwracamy false — TODO: przekazać via prop lub Zustand.
  return false;
}

