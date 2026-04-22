"use client";

import DOMPurify from "isomorphic-dompurify";
import { useEffect, useRef, useState } from "react";

type Props = {
  html: string;
};

export function HtmlSandbox({ html }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(320);

  // Sanitize aggressive — blokujemy scripts, event handlers, forms
  const clean = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["script", "iframe", "style", "object", "embed", "form", "input", "button"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "onfocus", "onblur", "formaction"],
    ALLOW_DATA_ATTR: false,
    WHOLE_DOCUMENT: false,
  });

  const wrapped = `
    <!doctype html>
    <html lang="pl">
      <head>
        <meta charset="utf-8" />
        <base target="_blank" />
        <style>
          html, body { margin: 0; padding: 16px; background: #fff; color: #0A0E1A;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px; line-height: 1.55; word-wrap: break-word; }
          img { max-width: 100%; height: auto; }
          a { color: #0A0E1A; text-decoration: underline; }
          pre, code { white-space: pre-wrap; word-break: break-word; }
          table { max-width: 100%; }
        </style>
      </head>
      <body>${clean}</body>
    </html>
  `;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const handle = () => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        const scrollHeight = doc.documentElement.scrollHeight;
        if (scrollHeight > 0) setHeight(Math.min(scrollHeight + 32, 4000));
      } catch {
        // sandbox — cross-origin access może być zablokowany
      }
    };
    iframe.addEventListener("load", handle);
    const interval = window.setInterval(handle, 800);
    return () => {
      iframe.removeEventListener("load", handle);
      window.clearInterval(interval);
    };
  }, [wrapped]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={wrapped}
      sandbox="allow-same-origin allow-popups"
      className="w-full rounded-xl border border-[color:color-mix(in_oklab,var(--ink)_10%,transparent)] bg-white"
      style={{ height, minHeight: 240 }}
      title="Treść e-maila"
    />
  );
}
