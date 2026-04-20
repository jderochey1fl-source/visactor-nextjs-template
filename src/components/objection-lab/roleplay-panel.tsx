"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Bot, CheckCircle2, Drama, RotateCcw, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { LoggedObjection } from "@/types/types";

type Props = {
  draft: LoggedObjection;
  onPassed: () => void;
};

function getText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function RoleplayPanel({ draft, onPassed }: Props) {
  const [input, setInput] = useState(draft.analysis.response);
  const [passedLocal, setPassedLocal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/objection-roleplay",
    }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  const bodyPayload = {
    statedObjection: draft.statedObjection,
    product: draft.context.product,
    icp: draft.context.icp,
  };

  function start() {
    sendMessage(
      {
        text:
          "Begin the role-play. Open by stating your objection in your own words as the buyer described above. Stay in character.",
      },
      { body: bodyPayload },
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input.trim() }, { body: bodyPayload });
    setInput("");
  }

  function reset() {
    setMessages([]);
    setPassedLocal(false);
    setInput(draft.analysis.response);
  }

  function markPassed() {
    if (passedLocal) return;
    setPassedLocal(true);
    onPassed();
  }

  const hasMessages = messages.length > 0;

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <Drama className="h-4 w-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Role-Play Test
            </p>
            <p className="text-sm font-medium">
              Skeptical {draft.context.icp.split(",")[0] || "buyer"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {passedLocal ? (
            <span className="flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" />
              Passed
            </span>
          ) : null}
          <Button
            size="sm"
            variant="outline"
            onClick={reset}
            disabled={isStreaming}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="max-h-[60vh] min-h-[320px] flex-1 overflow-y-auto px-5 py-4"
      >
        {!hasMessages ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              Claude will role-play as a skeptical{" "}
              <span className="font-semibold text-foreground">
                {draft.context.icp.split(",")[0] || "buyer"}
              </span>{" "}
              and push back on your response to:
            </p>
            <p className="max-w-md rounded-md border border-border bg-muted/40 px-4 py-3 text-sm italic text-foreground">
              &ldquo;{draft.statedObjection}&rdquo;
            </p>
            <p className="max-w-md text-xs text-muted-foreground">
              Your generated response has been pre-filled below — edit it, send
              it, and see whether it lands. Refine until it does.
            </p>
            <Button onClick={start} className="gap-2">
              <Drama className="h-4 w-4" />
              Start role-play
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} text={getText(m)} />
            ))}
            {isStreaming && messages[messages.length - 1]?.role === "user" ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                  <Bot className="h-4 w-4" />
                </div>
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {hasMessages ? (
        <form
          onSubmit={submit}
          className="flex flex-col gap-2 border-t border-border px-5 py-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            placeholder="Your response..."
            rows={3}
            className="resize-none"
            disabled={isStreaming}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Enter to send · Shift + Enter for newline
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={markPassed}
                disabled={passedLocal || isStreaming || messages.length < 3}
                className="gap-2"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Mark as passed
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isStreaming}
                aria-label="Send response"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function Bubble({ role, text }: { role: UIMessage["role"]; text: string }) {
  const isUser = role === "user";
  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-destructive/10 text-destructive",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-md px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-card text-foreground",
        )}
      >
        {text}
      </div>
    </div>
  );
}
