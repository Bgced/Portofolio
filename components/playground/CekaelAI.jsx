"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, CornerDownLeft, Send, Sparkles } from "lucide-react";
import { AI_SUGGESTIONS } from "@/lib/content";
import { AI_SUGGESTIONS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";
import { getLocalReply } from "@/lib/cekael-brain";

const CHARS_PER_TICK = 3;
const TICK_MS = 36; // ~12ms per karakter
const REQUEST_TIMEOUT_MS = 8000;
const MAX_CONTEXT = 10;

const WELCOME =
  "Halo, aku Cekael AI, asisten kecil di portfolio ini.\nTanya soal profil, project, skill, atau kontak. Kalau server lagi mati, aku jawab pakai brain lokal.";

const WELCOME_EN =
  "Hi, I'm Cekael AI, the little assistant inside this portfolio.\nAsk about the profile, projects, skills, or how to get in touch. If the server is down, I answer from the local brain.";

function nextId() {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function CekaelAI() {
  const { lang } = useLang();
  const en = lang === "en";
  const suggestions = en ? AI_SUGGESTIONS_EN : AI_SUGGESTIONS;
  const [messages, setMessages] = useState(() => [
    { id: "welcome", role: "assistant", content: en ? WELCOME_EN : WELCOME, typed: true },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState("local");

  const listRef = useRef(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimer();
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // Auto-scroll tiap ada pesan baru / lagi ngetik.
  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Keep the greeting in sync when the language toggle changes.
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m) => (m.id === "welcome" ? { ...m, content: en ? WELCOME_EN : WELCOME } : m))
    );
  }, [en]);

  const typeOut = useCallback((id, full) => {
    clearTimer();
    let index = 0;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: "" } : m)));

    timerRef.current = setInterval(() => {
      index = Math.min(full.length, index + CHARS_PER_TICK);
      const slice = full.slice(0, index);
      const done = index >= full.length;
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content: slice, typed: done } : m))
      );
      if (done) {
        clearTimer();
        setBusy(false);
      }
    }, TICK_MS);
  }, []);

  const send = useCallback(
    async (rawText) => {
      const text = String(rawText ?? "").trim();
      if (!text || busy) return;

      const userMessage = { id: nextId(), role: "user", content: text, typed: true };
      const replyId = nextId();
      const history = [...messages, userMessage]
        .filter((m) => m.content)
        .slice(-MAX_CONTEXT)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: replyId, role: "assistant", content: "", typed: false },
      ]);
      setInput("");
      setBusy(true);

      let reply = "";
      let source = "local";

      try {
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        let res = null;
        try {
          res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history, lang }),
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeout);
        }

        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (data && typeof data.reply === "string" && data.reply.trim()) {
            reply = data.reply.trim();
            source = typeof data.source === "string" ? data.source : "local";
          }
        }
      } catch {
        reply = "";
      }

      if (!mountedRef.current) return;
      if (!reply) {
        reply = getLocalReply(text);
        source = "local";
      }

      setMode(source === "gemini" || source === "openai" ? source : "local");
      typeOut(replyId, reply);
    },
    [busy, messages, typeOut]
  );

  const onSubmit = (event) => {
    event.preventDefault();
    send(input);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send(input);
    }
  };

  return (
    <div className="panel corner-frame overflow-hidden">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-ok opacity-70" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          <div className="leading-tight">
            <p className="flex items-center gap-1.5 font-mono text-[0.78rem] font-semibold text-ink">
              <Bot className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              Cekael AI
            </p>
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">brain lokal</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill pill-accent">mode: {mode}</span>
          <span className="pill hidden sm:inline-flex">{busy ? "thinking" : "ready"}</span>
        </div>
      </div>

      {/* messages */}
      <div
        ref={listRef}
        className="no-scrollbar max-h-[380px] min-h-[280px] overflow-y-auto px-3 py-4 sm:px-4"
        aria-live="polite"
        aria-label={en ? "Conversation with Cekael AI" : "Percakapan dengan Cekael AI"}
      >
        <div className="space-y-3">
          {messages.map((message) => {
            const isUser = message.role === "user";
            const isThinking = !isUser && !message.content;
            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[86%] rounded-[6px] border px-3.5 py-2.5 text-[0.82rem] leading-relaxed whitespace-pre-wrap break-words sm:max-w-[78%] ${
                    isUser
                      ? "border-accent/40 bg-accent/12 text-ink"
                      : "border-line-soft bg-surface-2 text-ink"
                  }`}
                >
                  {isThinking ? (
                    <span className="flex items-center gap-1.5 py-1" aria-label={en ? "Cekael AI is typing" : "Cekael AI sedang mengetik"}>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  ) : (
                    <>
                      {message.content}
                      {!isUser && !message.typed && (
                        <span className="caret" aria-hidden="true" />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* suggestions */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-line-soft px-3 py-2.5 sm:px-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => send(suggestion)}
            disabled={busy}
            className="shrink-0 rounded-[6px] border border-line-soft bg-surface px-3 py-1.5 font-mono text-[0.65rem] text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* composer */}
      <form onSubmit={onSubmit} className="border-t border-line-soft p-3 sm:p-4">
        <div className="flex items-end gap-2">
            <label htmlFor="cekael-input" className="sr-only">
              {en ? "Write a message for Cekael AI" : "Tulis pesan buat Cekael AI"}
            </label>
          <textarea
            id="cekael-input"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={en ? "Ask me anything... (Enter to send, Shift+Enter for a new line)" : "Tanya apa aja... (Enter kirim, Shift+Enter baris baru)"}
            className="max-h-28 min-h-[48px] w-full resize-none rounded-[6px] border border-line-soft bg-canvas px-3 py-3 text-[0.84rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-accent/70"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label={en ? "Send message" : "Kirim pesan"}
            className="btn btn-primary min-h-[48px] min-w-[48px] shrink-0 px-4 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{en ? "Send" : "Kirim"}</span>
          </button>
        </div>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" aria-hidden="true" /> {en ? "enter to send" : "enter kirim"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> {en ? "local fallback active" : "fallback lokal aktif"}
          </span>
          <span className="text-muted/70">{en ? "no API keys stored in the browser" : "nggak ada key disimpan di browser"}</span>
        </p>
      </form>
    </div>
  );
}
