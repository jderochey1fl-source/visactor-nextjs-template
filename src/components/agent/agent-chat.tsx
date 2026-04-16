"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Bot, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const suggestedPrompts = [
  {
    label: "Diagnose stuck deal",
    text: "One of my deals has been in Discover for 12 days. The contact keeps saying &apos;let me think about it&apos;. What should I do?",
  },
  {
    label: "Handle price objection",
    text: "Prospect says $249/mo is too expensive compared to just using their bookkeeper. How do I respond?",
  },
  {
    label: "Ascend pitch",
    text: "Give me a 60-second pitch for Ascend Cashflow tailored to a 3-truck owner-operator.",
  },
  {
    label: "Discovery questions",
    text: "What are the 5 best Discover-stage questions for a trucking owner-operator?",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    if (isStreaming) return;
    sendMessage({ text });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Sales Coach
            </h1>
            <p className="text-xs text-muted-foreground">
              Claude Opus · Trained on LADDER, Ascend Cashflow, trucking ICP
            </p>
          </div>
        </div>
        <Badge variant="outline" className="font-mono text-xs">
          {messages.length} messages
        </Badge>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-background px-6 py-6"
      >
        {messages.length === 0 ? (
          <EmptyState onPick={handleSuggestion} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((m) => (
              <Message key={m.id} message={m} />
            ))}
            {isStreaming &&
              messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <Bot className="h-4 w-4" />
                  </div>
                  <TypingDots />
                </div>
              )}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-card px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask about a stuck deal, an objection, a pitch…"
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
      </form>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-foreground">
          How can I help you close this deal?
        </h2>
        <p className="text-sm text-muted-foreground">
          I know LADDER, Ascend Cashflow, and every owner-operator objection.
          Ask me anything.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestedPrompts.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPick(p.text)}
            className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 text-left text-sm transition hover:border-primary/40 hover:bg-muted/50"
          >
            <span className="font-medium text-foreground">{p.label}</span>
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {p.text.replace("&apos;", "'")}
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
          "flex h-8 w-8 flex-none items-center justify-center rounded-lg",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-accent/15 text-accent",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground border border-border",
        )}
      >
        <pre className="whitespace-pre-wrap font-sans">{text}</pre>
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
