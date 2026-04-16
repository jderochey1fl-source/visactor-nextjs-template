"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Bot, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const suggestedPrompts: { label: string; text: string }[] = [
  {
    label: "Stuck deal",
    text: "Deal has been in Diagnose for 11 days. HOA board, we're bid 1 of 3, they keep 'thinking about it'. What's my next move?",
  },
  {
    label: "Price objection",
    text: "Prospect says: 'Your guy down the street is $4k less.' Apples-to-apples scope, but I want the script and the closing move.",
  },
  {
    label: "Gone dark",
    text: "Design-stage deal. Was hot last week. Wife asked for time. Two touches since, no response. How do I re-open without burning the referral?",
  },
  {
    label: "Insurance supplement",
    text: "Adjuster missed valley ice & water and two pipe flashings. Walk me through building the supplement packet and the on-site re-inspection.",
  },
];

function getText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

export function AgentChat() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  const pick = (text: string) => {
    if (isStreaming) return;
    sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onPick={pick} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
            {isStreaming &&
            messages[messages.length - 1]?.role === "user" ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <TypingDots />
              </div>
            ) : null}
          </div>
        )}
      </div>

      <form
        onSubmit={submit}
        className="border-t border-border bg-card px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            placeholder="Ask about a stuck deal, objection, or pitch..."
            rows={2}
            className="resize-none"
            disabled={isStreaming}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Enter to send · Shift + Enter for newline
        </p>
      </form>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          How can I help you close this deal?
        </h2>
        <p className="text-sm text-muted-foreground">
          I coach on LADDER. I know roofing, insurance claims, and every
          objection you&apos;ll hear tonight. Give me the deal — I&apos;ll give
          you the move.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 tablet:grid-cols-2">
        {suggestedPrompts.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.text)}
            className="flex flex-col gap-1 rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
          >
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
              {p.label}
            </span>
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {p.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = getText(message);
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
            : "bg-primary/10 text-primary",
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

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
    </span>
  );
}
