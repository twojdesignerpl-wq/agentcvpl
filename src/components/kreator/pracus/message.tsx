"use client";

import { memo } from "react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PracusMark } from "./icon";
import { StreamText } from "./stream-text";
import { cn } from "@/lib/utils";

export type Role = "user" | "assistant";

type Props = {
  role: Role;
  text: string;
  streaming?: boolean;
};

function MessageImpl({ role, text, streaming }: Props) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className={cn("flex gap-3 w-full", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {isUser ? (
        <div
          aria-hidden
          className="shrink-0 mt-1 size-10 rounded-full bg-[color-mix(in_oklab,var(--ink)_8%,var(--cream))] grid place-items-center text-[13px] font-semibold text-ink"
        >
          Ty
        </div>
      ) : (
        <div className="shrink-0 mt-1">
          <PracusMark size={40} />
        </div>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed break-words",
          isUser
            ? "bg-ink text-cream rounded-tr-md whitespace-pre-wrap shadow-[0_8px_24px_-16px_rgba(10,14,26,0.35)]"
            : "bg-cream-soft border border-ink/8 text-ink rounded-tl-md shadow-[0_4px_16px_-12px_rgba(10,14,26,0.18)]",
        )}
      >
        {isUser ? (
          text
        ) : streaming ? (
          <StreamText target={text} />
        ) : (
          <MarkdownRenderer text={text} />
        )}
        {streaming ? (
          <span
            aria-hidden
            className="inline-block align-[-2px] ml-1 w-[2px] h-[15px] bg-[color:var(--saffron)] pracus-caret"
          />
        ) : null}
      </div>
    </motion.div>
  );
}

/**
 * Ważne: Message memoizujemy względem (role, text, streaming).
 * Gdy streaming=true, każda zmiana text z AI SDK REBUDUJE komponent — co oznacza że
 * StreamText dostaje nowy `target` prop. StreamText mutuje DOM przez ref, więc
 * jego własny re-render jest tani (zwraca ten sam <span>), a pętla RAF zawsze czyta
 * najnowszy target przez `targetRef.current = target` przed useEffect.
 * To właśnie daje płynność — aktualizacja tekstu nie idzie przez React reconciler.
 */
export const Message = memo(MessageImpl, (prev, next) => {
  return (
    prev.role === next.role &&
    prev.text === next.text &&
    prev.streaming === next.streaming
  );
});

const MarkdownRenderer = memo(function MarkdownRenderer({ text }: { text: string }) {
  return (
    <div className="prose-pracus">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <p className="my-1.5 first:mt-0 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="my-1.5 pl-4 list-disc space-y-0.5 marker:text-[color:var(--saffron)]">{children}</ul>,
          ol: ({ children }) => <ol className="my-1.5 pl-4 list-decimal space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <h3 className="font-heading font-semibold text-[15px] mt-2 first:mt-0 mb-1">{children}</h3>,
          h2: ({ children }) => <h3 className="font-heading font-semibold text-[14.5px] mt-2 first:mt-0 mb-1">{children}</h3>,
          h3: ({ children }) => <h4 className="font-heading font-semibold text-[14px] mt-1.5 first:mt-0 mb-1">{children}</h4>,
          h4: ({ children }) => <h4 className="font-semibold text-[13.5px] mt-1.5 first:mt-0 mb-0.5">{children}</h4>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-saffron/40 pl-2.5 my-1.5 text-ink-soft italic">{children}</blockquote>
          ),
          code: ({ children, ...props }) => {
            const inline = !("className" in props && typeof props.className === "string" && props.className.startsWith("language-"));
            if (inline) {
              return (
                <code className="rounded bg-[color-mix(in_oklab,var(--ink)_8%,var(--cream))] px-1 py-0.5 font-mono text-[12.5px]">
                  {children}
                </code>
              );
            }
            return (
              <code className="block rounded bg-[color-mix(in_oklab,var(--ink)_90%,var(--cream))] text-cream p-2 font-mono text-[12.5px] my-1.5 overflow-x-auto">
                {children}
              </code>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--rust)] underline underline-offset-2 hover:text-ink"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-2 border-ink/10" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
});

export function TypingIndicator() {
  return (
    <div className="flex gap-3 items-start">
      <div className="shrink-0 mt-1">
        <PracusMark size={40} online />
      </div>
      <div className="bg-cream-soft border border-ink/8 rounded-2xl rounded-tl-md px-4 py-3 flex gap-1.5 items-center shadow-[0_4px_16px_-12px_rgba(10,14,26,0.18)]">
        <Dot delay={0} />
        <Dot delay={0.18} />
        <Dot delay={0.36} />
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="block size-1.5 rounded-full bg-ink/40"
      animate={{ y: [0, -3, 0], opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}
