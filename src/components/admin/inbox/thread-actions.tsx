"use client";

import { useTransition } from "react";
import { Archive, ArrowUUpLeft, EnvelopeOpen } from "@phosphor-icons/react";
import { archiveThread, markThreadRead, unarchiveThread } from "@/app/admin/poczta/actions";

type Props = {
  threadId: string;
  isArchived: boolean;
  hasUnread: boolean;
};

export function ThreadActions({ threadId, isArchived, hasUnread }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {hasUnread ? (
        <button
          type="button"
          onClick={() => startTransition(() => markThreadRead(threadId))}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] disabled:opacity-50"
        >
          <EnvelopeOpen size={12} weight="bold" />
          Oznacz jako przeczytane
        </button>
      ) : null}
      {isArchived ? (
        <button
          type="button"
          onClick={() => startTransition(() => unarchiveThread(threadId))}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] disabled:opacity-50"
        >
          <ArrowUUpLeft size={12} weight="bold" />
          Przywróć z archiwum
        </button>
      ) : (
        <button
          type="button"
          onClick={() => startTransition(() => archiveThread(threadId))}
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--cream-soft)] px-3 py-1.5 text-[12px] font-medium text-[color:var(--ink-soft)] transition-colors hover:bg-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] disabled:opacity-50"
        >
          <Archive size={12} weight="bold" />
          Archiwizuj
        </button>
      )}
    </div>
  );
}
